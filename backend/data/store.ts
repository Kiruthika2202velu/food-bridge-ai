/**
 * In-memory data store — exact same seed data and shape as the original
 * server.ts, just extracted into its own module. This is not a database:
 * data resets on every server restart. See docs note in README if you
 * want to persist it later.
 */
import {
  DonationItem,
  RestaurantProfile,
  NGOProfile,
  ActivityNotification,
  User,
} from '../../src/types';

export const users: User[] = [
  { id: 'u-1', name: 'The Daily Grind (Manager Rahul)', email: 'manager@dailygrind.com', role: 'restaurant', entityId: 'rest-1', avatar: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=150&auto=format&fit=crop&q=80' },
  { id: 'u-2', name: 'Hope Harvest Foundation (Priya S.)', email: 'contact@hopeharvest.org', role: 'ngo', entityId: 'ngo-1', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80' },
  { id: 'u-3', name: 'Food Bridge Admin (System)', email: 'admin@foodbridge.ai', role: 'admin' },
  { id: 'u-4', name: 'Annapoorna Kitchen (Suresh K.)', email: 'suresh@annapoorna.in', role: 'restaurant', entityId: 'rest-2' },
  { id: 'u-5', name: 'FeedAll Youth Initiative (Anand R.)', email: 'hello@feedall.org', role: 'ngo', entityId: 'ngo-2' },
];

export const restaurants: RestaurantProfile[] = [
  {
    id: 'rest-1', userId: 'u-1', name: 'The Daily Grind',
    address: '42 DB Road, RS Puram', city: 'Coimbatore', lat: 11.0088, lng: 76.9525,
    contactPhone: '+91 98432 10987', cuisineType: 'Multi-Cuisine & Cafe',
    verificationStatus: 'verified',
    avatar: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=150&auto=format&fit=crop&q=80',
    totalDonationsCount: 28, foodSavedKg: 520,
  },
  {
    id: 'rest-2', userId: 'u-4', name: 'Annapoorna Kitchen',
    address: '15 Cross Cut Road, Gandhipuram', city: 'Coimbatore', lat: 11.0183, lng: 76.9682,
    contactPhone: '+91 98940 55432', cuisineType: 'South Indian & Traditional Meals',
    verificationStatus: 'verified',
    avatar: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=150&auto=format&fit=crop&q=80',
    totalDonationsCount: 45, foodSavedKg: 980,
  },
  {
    id: 'rest-3', userId: 'u-6', name: 'The Royal Bakes',
    address: '88 NSR Road, Saibaba Colony', city: 'Coimbatore', lat: 11.0264, lng: 76.9458,
    contactPhone: '+91 97890 22119', cuisineType: 'Bakery & Confectionery',
    verificationStatus: 'verified',
    avatar: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=150&auto=format&fit=crop&q=80',
    totalDonationsCount: 31, foodSavedKg: 410,
  },
  {
    id: 'rest-4', userId: 'u-7', name: 'Spice Symphony Catering',
    address: '102 Race Course Road', city: 'Coimbatore', lat: 11.0022, lng: 76.9744,
    contactPhone: '+91 94433 88120', cuisineType: 'North Indian & Banquet Meals',
    verificationStatus: 'verified',
    avatar: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=150&auto=format&fit=crop&q=80',
    totalDonationsCount: 52, foodSavedKg: 930,
  },
];

export const ngos: NGOProfile[] = [
  {
    id: 'ngo-1', userId: 'u-2', name: 'Hope Harvest Foundation', organizationName: 'Hope Harvest Foundation',
    address: '12 West Venkatasamy Road, RS Puram', city: 'Coimbatore', lat: 11.0112, lng: 76.9498,
    contactPhone: '+91 94888 12345', capacityMeals: 50, activeVolunteers: 12,
    dietaryPreferences: ['Cooked Meals', 'Bakery & Bread', 'Fresh Produce'],
    verificationStatus: 'verified', totalReceivedMeals: 3450,
    avatar: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb7?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'ngo-2', userId: 'u-5', name: 'FeedAll Youth Initiative', organizationName: 'FeedAll Youth Initiative',
    address: '54 Avinashi Road, Peelamedu', city: 'Coimbatore', lat: 11.0289, lng: 77.0035,
    contactPhone: '+91 99444 87654', capacityMeals: 35, activeVolunteers: 8,
    dietaryPreferences: ['Cooked Meals', 'Packaged Food', 'Dairy & Beverages'],
    verificationStatus: 'verified', totalReceivedMeals: 2180,
    avatar: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'ngo-3', userId: 'u-8', name: 'Annapoorna Care Network', organizationName: 'Annapoorna Care Network',
    address: '77 5th Street, Gandhipuram', city: 'Coimbatore', lat: 11.0195, lng: 76.9654,
    contactPhone: '+91 98421 99887', capacityMeals: 80, activeVolunteers: 18,
    dietaryPreferences: ['Cooked Meals', 'Fresh Produce', 'Bakery & Bread', 'Packaged Food'],
    verificationStatus: 'verified', totalReceivedMeals: 5200,
    avatar: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'ngo-4', userId: 'u-9', name: 'City Shelter & Relief Trust', organizationName: 'City Shelter & Relief Trust',
    address: '22 Trichy Road, Singanallur', city: 'Coimbatore', lat: 10.9984, lng: 77.0211,
    contactPhone: '+91 97910 33445', capacityMeals: 100, activeVolunteers: 22,
    dietaryPreferences: ['Cooked Meals', 'Bakery & Bread', 'Desserts & Sweets'],
    verificationStatus: 'verified', totalReceivedMeals: 7100,
    avatar: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'ngo-5', userId: 'u-10', name: 'ShareMeal Society', organizationName: 'ShareMeal Society',
    address: '33 Alagesan Road, Saibaba Colony', city: 'Coimbatore', lat: 11.0310, lng: 76.9421,
    contactPhone: '+91 98942 66778', capacityMeals: 40, activeVolunteers: 10,
    dietaryPreferences: ['Cooked Meals', 'Fresh Produce', 'Packaged Food'],
    verificationStatus: 'verified', totalReceivedMeals: 2900,
    avatar: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=150&auto=format&fit=crop&q=80',
  },
];

const now = new Date();
const in2Hours = new Date(now.getTime() + 2.5 * 60 * 60 * 1000);
const in4Hours = new Date(now.getTime() + 4 * 60 * 60 * 1000);
const in5Hours = new Date(now.getTime() + 5.5 * 60 * 60 * 1000);
const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

function in3HoursTimeString() {
  const d = new Date(Date.now() + 3 * 3600 * 1000);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export const donations: DonationItem[] = [
  {
    id: 'don-1', restaurantId: 'rest-1', restaurantName: 'The Daily Grind', restaurantPhone: '+91 98432 10987',
    foodName: 'Vegetable Biryani & Fresh Raita', foodCategory: 'Cooked Meals', quantityMeals: 25, weightKg: 12.5,
    preparedAt: '10:30 AM', expiryTime: in2Hours.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    expiryTimestamp: in2Hours.getTime(), locationName: '42 DB Road, RS Puram, Coimbatore', city: 'Coimbatore',
    lat: 11.0088, lng: 76.9525, status: 'available', urgencyLevel: 'urgent',
    packagingType: 'Thermal Sealed Meal Trays (Food-grade)', dietaryTags: ['Vegetarian', 'Nut-Free', 'Freshly Cooked'],
    storageRequirement: 'Hot Held', pickupInstructions: 'Kitchen rear gate pickup. Enter via DB Road lane. Ask for Chef Anand.',
    pickupCode: '8241', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=80',
    createdAt: new Date(now.getTime() - 45 * 60 * 1000).toISOString(),
  },
  {
    id: 'don-2', restaurantId: 'rest-3', restaurantName: 'The Royal Bakes', restaurantPhone: '+91 97890 22119',
    foodName: 'Artisan Whole Wheat Bread & Butter Croissants', foodCategory: 'Bakery & Bread', quantityMeals: 40, weightKg: 9.0,
    preparedAt: '08:00 AM', expiryTime: in5Hours.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    expiryTimestamp: in5Hours.getTime(), locationName: '88 NSR Road, Saibaba Colony, Coimbatore', city: 'Coimbatore',
    lat: 11.0264, lng: 76.9458, status: 'available', urgencyLevel: 'moderate',
    packagingType: 'Individual Paper Bags & Safe Crates', dietaryTags: ['Vegetarian', 'Baked Today', 'Preservative-Free'],
    storageRequirement: 'Room Temperature', pickupInstructions: 'Main storefront bakery counter. Verification PIN required at counter.',
    pickupCode: '4912', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&auto=format&fit=crop&q=80',
    createdAt: new Date(now.getTime() - 90 * 60 * 1000).toISOString(),
  },
  {
    id: 'don-3', restaurantId: 'rest-2', restaurantName: 'Annapoorna Kitchen', restaurantPhone: '+91 98940 55432',
    foodName: 'Mixed Veg Sambar, Steamed Rice & Kootu', foodCategory: 'Cooked Meals', quantityMeals: 60, weightKg: 30.0,
    preparedAt: '11:15 AM', expiryTime: in4Hours.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    expiryTimestamp: in4Hours.getTime(), locationName: '15 Cross Cut Road, Gandhipuram, Coimbatore', city: 'Coimbatore',
    lat: 11.0183, lng: 76.9682, status: 'available', urgencyLevel: 'moderate',
    packagingType: 'Large Insulated Stainless Steel Dispenser Drums', dietaryTags: ['Pure Vegetarian', 'Gluten-Free Option', 'Low Spice'],
    storageRequirement: 'Hot Held', pickupInstructions: 'Dispatch bay on ground floor. Staff will assist loading into vehicle.',
    pickupCode: '6139', image: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=500&auto=format&fit=crop&q=80',
    createdAt: new Date(now.getTime() - 30 * 60 * 1000).toISOString(),
  },
  {
    id: 'don-4', restaurantId: 'rest-4', restaurantName: 'Spice Symphony Catering', restaurantPhone: '+91 94433 88120',
    foodName: 'Paneer Butter Masala with Phulkas', foodCategory: 'Cooked Meals', quantityMeals: 30, weightKg: 15.0,
    preparedAt: '12:00 PM', expiryTime: in3HoursTimeString(), expiryTimestamp: now.getTime() + 3 * 3600 * 1000,
    locationName: '102 Race Course Road, Coimbatore', city: 'Coimbatore', lat: 11.0022, lng: 76.9744,
    status: 'reserved', urgencyLevel: 'urgent', packagingType: 'Foil Packed Bento Boxes',
    dietaryTags: ['Vegetarian', 'High Protein'], storageRequirement: 'Hot Held',
    pickupInstructions: 'Banquet service lobby. Driver can park in designated spot 4.', pickupCode: '3725',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=80',
    createdAt: new Date(now.getTime() - 60 * 60 * 1000).toISOString(),
    acceptedByNgoId: 'ngo-1', acceptedByNgoName: 'Hope Harvest Foundation',
    acceptedAt: new Date(now.getTime() - 20 * 60 * 1000).toISOString(), pickupStage: 'en_route',
  },
  {
    id: 'don-5', restaurantId: 'rest-1', restaurantName: 'The Daily Grind', restaurantPhone: '+91 98432 10987',
    foodName: 'Assorted Fresh Sandwiches & Fruit Bowls', foodCategory: 'Cooked Meals', quantityMeals: 18, weightKg: 7.5,
    preparedAt: '09:00 AM', expiryTime: '01:30 PM', expiryTimestamp: yesterday.getTime(),
    locationName: '42 DB Road, RS Puram, Coimbatore', city: 'Coimbatore', lat: 11.0088, lng: 76.9525,
    status: 'completed', urgencyLevel: 'moderate', packagingType: 'Eco Kraft Boxes',
    dietaryTags: ['Vegetarian', 'Healthy'], storageRequirement: 'Refrigerated',
    pickupInstructions: 'Collected successfully by Volunteer Vinod.', pickupCode: '1102',
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=500&auto=format&fit=crop&q=80',
    createdAt: yesterday.toISOString(),
    acceptedByNgoId: 'ngo-1', acceptedByNgoName: 'Hope Harvest Foundation',
    acceptedAt: new Date(yesterday.getTime() + 15 * 60 * 1000).toISOString(),
    pickedUpAt: new Date(yesterday.getTime() + 45 * 60 * 1000).toISOString(),
    completedAt: new Date(yesterday.getTime() + 90 * 60 * 1000).toISOString(),
    pickupStage: 'completed',
  },
];

export const notifications: ActivityNotification[] = [
  {
    id: 'notif-1', title: 'AI Matching Engine Alert',
    message: '94% Match computed between The Daily Grind (25 meals) and Hope Harvest Foundation.',
    timestamp: '5 mins ago', type: 'match_alert', linkId: 'don-1',
  },
  {
    id: 'notif-2', title: 'Donation Accepted',
    message: 'Hope Harvest Foundation accepted Paneer Butter Masala (30 meals) from Spice Symphony.',
    timestamp: '20 mins ago', type: 'donation_accepted', linkId: 'don-4',
  },
  {
    id: 'notif-3', title: 'Surplus Food Posted',
    message: 'Annapoorna Kitchen posted 60 meals of Mixed Veg Sambar & Rice (Expires in 4 hours).',
    timestamp: '30 mins ago', type: 'donation_posted', linkId: 'don-3',
  },
];
