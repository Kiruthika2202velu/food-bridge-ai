import { Router } from 'express';
import { donations, restaurants, ngos, notifications } from '../data/store';
import { DonationItem } from '../../src/types';

const router = Router();

router.get('/donations', (req, res) => {
  const { status, restaurantId, ngoId, category } = req.query;
  let list = [...donations];

  if (status && typeof status === 'string') {
    list = list.filter((d) => d.status === status);
  }
  if (restaurantId && typeof restaurantId === 'string') {
    list = list.filter((d) => d.restaurantId === restaurantId);
  }
  if (ngoId && typeof ngoId === 'string') {
    list = list.filter((d) => d.acceptedByNgoId === ngoId);
  }
  if (category && typeof category === 'string' && category !== 'All') {
    list = list.filter((d) => d.foodCategory === category);
  }

  list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  res.json(list);
});

router.get('/donations/:id', (req, res) => {
  const donation = donations.find((d) => d.id === req.params.id);
  if (!donation) return res.status(404).json({ error: 'Donation not found' });
  res.json(donation);
});

router.post('/donations', (req, res) => {
  const {
    restaurantId, restaurantName, restaurantPhone, foodName, foodCategory, quantityMeals,
    weightKg, preparedAt, expiryTime, locationName, city, lat, lng, urgencyLevel,
    packagingType, dietaryTags, storageRequirement, pickupInstructions, image,
  } = req.body;

  const rest = restaurants.find((r) => r.id === restaurantId) || restaurants[0];
  const generatedPin = Math.floor(1000 + Math.random() * 9000).toString();

  let expTimestamp = Date.now() + 3 * 3600 * 1000;
  if (expiryTime && expiryTime.includes(':')) {
    const parts = expiryTime.split(':');
    const nowD = new Date();
    nowD.setHours(parseInt(parts[0], 10), parseInt(parts[1], 10), 0, 0);
    if (nowD.getTime() < Date.now()) {
      nowD.setDate(nowD.getDate() + 1);
    }
    expTimestamp = nowD.getTime();
  }

  const newDonation: DonationItem = {
    id: `don-${Date.now()}`,
    restaurantId: rest.id,
    restaurantName: restaurantName || rest.name,
    restaurantPhone: restaurantPhone || rest.contactPhone,
    foodName: foodName || 'Fresh Prepared Food',
    foodCategory: foodCategory || 'Cooked Meals',
    quantityMeals: Number(quantityMeals) || 20,
    weightKg: Number(weightKg) || Math.round((Number(quantityMeals) || 20) * 0.45 * 10) / 10,
    preparedAt: preparedAt || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    expiryTime: expiryTime || 'Within 3 hours',
    expiryTimestamp: expTimestamp,
    locationName: locationName || rest.address,
    city: city || rest.city,
    lat: Number(lat) || rest.lat,
    lng: Number(lng) || rest.lng,
    status: 'available',
    urgencyLevel: urgencyLevel || 'moderate',
    packagingType: packagingType || 'Food-Grade Sealed Containers',
    dietaryTags: dietaryTags || ['Vegetarian', 'Fresh'],
    storageRequirement: storageRequirement || 'Hot Held',
    pickupInstructions: pickupInstructions || 'Pickup from dispatch gate.',
    pickupCode: generatedPin,
    image: image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80',
    createdAt: new Date().toISOString(),
  };

  donations.unshift(newDonation);
  rest.totalDonationsCount += 1;
  rest.foodSavedKg += newDonation.weightKg;

  notifications.unshift({
    id: `notif-${Date.now()}`,
    title: 'New Surplus Food Posted',
    message: `${newDonation.restaurantName} posted ${newDonation.quantityMeals} meals of ${newDonation.foodName}.`,
    timestamp: 'Just now',
    type: 'donation_posted',
    linkId: newDonation.id,
  });

  res.status(201).json({ success: true, donation: newDonation });
});

router.patch('/donations/:id/status', (req, res) => {
  const { id } = req.params;
  const { status, ngoId, ngoName, pickupStage } = req.body;
  const donation = donations.find((d) => d.id === id);

  if (!donation) return res.status(404).json({ error: 'Donation not found' });

  if (status === 'reserved') {
    const ngo = ngos.find((n) => n.id === ngoId) || ngos[0];
    donation.status = 'reserved';
    donation.acceptedByNgoId = ngo.id;
    donation.acceptedByNgoName = ngoName || ngo.name;
    donation.acceptedAt = new Date().toISOString();
    donation.pickupStage = 'accepted';

    notifications.unshift({
      id: `notif-${Date.now()}`,
      title: 'Donation Accepted!',
      message: `${donation.acceptedByNgoName} accepted ${donation.foodName} (${donation.quantityMeals} meals) from ${donation.restaurantName}.`,
      timestamp: 'Just now',
      type: 'donation_accepted',
      linkId: donation.id,
    });
  } else if (status === 'picked_up' || pickupStage === 'arrived' || pickupStage === 'en_route') {
    if (pickupStage) donation.pickupStage = pickupStage;
    if (status === 'picked_up') {
      donation.status = 'picked_up';
      donation.pickedUpAt = new Date().toISOString();
    }
  } else if (status === 'completed') {
    donation.status = 'completed';
    donation.pickupStage = 'completed';
    donation.completedAt = new Date().toISOString();

    if (donation.acceptedByNgoId) {
      const ngo = ngos.find((n) => n.id === donation.acceptedByNgoId);
      if (ngo) {
        ngo.totalReceivedMeals += donation.quantityMeals;
      }
    }

    notifications.unshift({
      id: `notif-${Date.now()}`,
      title: 'Pickup & Distribution Completed!',
      message: `Successfully rescued ${donation.weightKg} kg of ${donation.foodName} (${donation.quantityMeals} meals served).`,
      timestamp: 'Just now',
      type: 'pickup_completed',
      linkId: donation.id,
    });
  } else if (status === 'available') {
    donation.status = 'available';
    donation.acceptedByNgoId = undefined;
    donation.acceptedByNgoName = undefined;
    donation.acceptedAt = undefined;
    donation.pickupStage = undefined;
  }

  res.json({ success: true, donation });
});

export default router;
