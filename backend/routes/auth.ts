import { Router } from 'express';
import { users, restaurants, ngos } from '../data/store';
import { RestaurantProfile, NGOProfile, User } from '../../src/types';

const router = Router();

router.get('/auth/users', (req, res) => {
  res.json(users);
});

router.post('/auth/login', (req, res) => {
  const { email, role } = req.body;
  let found = users.find((u) => u.email.toLowerCase() === (email || '').toLowerCase());
  if (!found) {
    found = users.find((u) => u.role === role) || users[0];
  }
  res.json({ success: true, user: found });
});

router.post('/auth/register', (req, res) => {
  const { name, email, role, organizationName, address, city, phone, capacityMeals, cuisineType, dietaryPreferences } = req.body;
  const userId = `u-${Date.now()}`;
  let entityId: string | undefined;

  if (role === 'restaurant') {
    entityId = `rest-${Date.now()}`;
    const newRest: RestaurantProfile = {
      id: entityId,
      userId,
      name: organizationName || name || 'New Restaurant',
      address: address || 'Main City Center',
      city: city || 'Coimbatore',
      lat: 11.015 + (Math.random() - 0.5) * 0.04,
      lng: 76.96 + (Math.random() - 0.5) * 0.04,
      contactPhone: phone || '+91 98765 43210',
      cuisineType: cuisineType || 'Multi-Cuisine',
      verificationStatus: 'verified',
      totalDonationsCount: 0,
      foodSavedKg: 0,
    };
    restaurants.push(newRest);
  } else if (role === 'ngo') {
    entityId = `ngo-${Date.now()}`;
    const newNgo: NGOProfile = {
      id: entityId,
      userId,
      name: organizationName || name || 'Community Food Bank',
      organizationName: organizationName || name || 'Community Food Bank',
      address: address || 'Community Center Road',
      city: city || 'Coimbatore',
      lat: 11.012 + (Math.random() - 0.5) * 0.04,
      lng: 76.955 + (Math.random() - 0.5) * 0.04,
      contactPhone: phone || '+91 98765 12345',
      capacityMeals: Number(capacityMeals) || 50,
      activeVolunteers: 6,
      dietaryPreferences: dietaryPreferences || ['Cooked Meals', 'Fresh Produce'],
      verificationStatus: 'verified',
      totalReceivedMeals: 0,
    };
    ngos.push(newNgo);
  }

  const newUser: User = {
    id: userId,
    name: name || organizationName || 'User',
    email: email || `user_${Date.now()}@foodbridge.ai`,
    role: role || 'restaurant',
    entityId,
  };
  users.push(newUser);

  res.json({ success: true, user: newUser });
});

export default router;
