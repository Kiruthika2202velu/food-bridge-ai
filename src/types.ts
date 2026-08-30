export type UserRole = 'restaurant' | 'ngo' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  entityId?: string; // restaurantId or ngoId
  avatar?: string;
}

export interface RestaurantProfile {
  id: string;
  userId: string;
  name: string;
  address: string;
  city: string;
  lat: number;
  lng: number;
  contactPhone: string;
  cuisineType: string;
  verificationStatus: 'verified' | 'pending';
  avatar?: string;
  totalDonationsCount: number;
  foodSavedKg: number;
}

export interface NGOProfile {
  id: string;
  userId: string;
  name: string;
  organizationName: string;
  address: string;
  city: string;
  lat: number;
  lng: number;
  contactPhone: string;
  capacityMeals: number;
  activeVolunteers: number;
  dietaryPreferences: string[];
  verificationStatus: 'verified' | 'pending';
  totalReceivedMeals: number;
  avatar?: string;
}

export type FoodCategory = 'Cooked Meals' | 'Bakery & Bread' | 'Fresh Produce' | 'Packaged Food' | 'Dairy & Beverages' | 'Desserts & Sweets';
export type UrgencyLevel = 'urgent' | 'moderate' | 'flexible';
export type DonationStatus = 'available' | 'reserved' | 'picked_up' | 'completed' | 'cancelled';

export interface DonationItem {
  id: string;
  restaurantId: string;
  restaurantName: string;
  restaurantPhone: string;
  foodName: string;
  foodCategory: FoodCategory;
  quantityMeals: number;
  weightKg: number;
  preparedAt: string; // ISO or human format
  expiryTime: string; // ISO or human format
  expiryTimestamp: number;
  locationName: string;
  city: string;
  lat: number;
  lng: number;
  status: DonationStatus;
  urgencyLevel: UrgencyLevel;
  packagingType: string;
  dietaryTags: string[];
  storageRequirement: 'Room Temperature' | 'Refrigerated' | 'Hot Held' | 'Frozen';
  pickupInstructions: string;
  pickupCode: string;
  image?: string;
  createdAt: string;
  acceptedByNgoId?: string;
  acceptedByNgoName?: string;
  acceptedAt?: string;
  pickedUpAt?: string;
  completedAt?: string;
  pickupStage?: 'accepted' | 'en_route' | 'arrived' | 'completed';
}

export interface AIMatchScore {
  ngoId: string;
  ngoName: string;
  ngoCity: string;
  ngoAddress: string;
  ngoCapacity: number;
  distanceKm: number;
  distanceScore: number;
  quantityScore: number;
  urgencyScore: number;
  preferenceScore: number;
  overallScore: number;
  estimatedPickupMinutes: number;
  aiExplanation: string;
  matchReasons: string[];
  contactPhone: string;
}

export interface SystemMetrics {
  totalRestaurants: number;
  totalNGOs: number;
  availableDonations: number;
  completedDonations: number;
  foodSavedKg: number;
  mealsServed: number;
  co2PreventedKg: number;
  activePickups: number;
}

export interface AIAnalysisResult {
  estimatedShelfLifeHours: number;
  suggestedExpiryTime: string;
  recommendedStorage: 'Room Temperature' | 'Refrigerated' | 'Hot Held' | 'Frozen';
  dietaryTags: string[];
  safeHandlingGuidelines: string[];
  estimatedNutritionalPortion: string;
  urgencyRating: UrgencyLevel;
  smartNotes: string;
}

export interface ActivityNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'donation_posted' | 'donation_accepted' | 'pickup_completed' | 'match_alert';
  linkId?: string;
  read?: boolean;
}
