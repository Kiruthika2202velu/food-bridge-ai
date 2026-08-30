import { DonationItem, AIMatchScore } from '../../src/types';
import { ngos } from '../data/store';
import { calculateDistance } from './geo';

/**
 * AI Matching Algorithm Engine — unchanged scoring logic from the
 * original server.ts. Weighted formula:
 *   0.40 * distanceScore + 0.30 * quantityScore + 0.20 * urgencyScore + 0.10 * preferenceScore
 * All four sub-scores are computed from real donation/NGO fields —
 * nothing here is random or fixed.
 */
export function calculateMatchesForDonation(donation: DonationItem): AIMatchScore[] {
  const results: AIMatchScore[] = [];

  for (const ngo of ngos) {
    const distanceKm = calculateDistance(donation.lat, donation.lng, ngo.lat, ngo.lng);
    let distanceScore = Math.max(0, Math.min(100, Math.round(100 - (distanceKm / 12) * 100)));

    const ratio = donation.quantityMeals / ngo.capacityMeals;
    let quantityScore = 0;
    if (ratio <= 1.0) {
      quantityScore = Math.round(75 + (ratio * 25));
    } else if (ratio <= 1.5) {
      quantityScore = Math.round(70 - (ratio - 1.0) * 40);
    } else {
      quantityScore = Math.max(20, Math.round(50 - (ratio - 1.5) * 30));
    }

    let urgencyScore = 80;
    if (donation.urgencyLevel === 'urgent') {
      if (distanceKm <= 3.0 && ngo.activeVolunteers >= 5) {
        urgencyScore = 100;
      } else if (distanceKm <= 6.0) {
        urgencyScore = 85;
      } else {
        urgencyScore = 60;
      }
    } else if (donation.urgencyLevel === 'moderate') {
      urgencyScore = 85;
    } else {
      urgencyScore = 90;
    }

    let preferenceScore = 60;
    if (ngo.dietaryPreferences.includes(donation.foodCategory)) {
      preferenceScore = 100;
    } else if (ngo.dietaryPreferences.includes('Cooked Meals')) {
      preferenceScore = 80;
    }

    const weightedScore = Math.round(
      0.40 * distanceScore +
      0.30 * quantityScore +
      0.20 * urgencyScore +
      0.10 * preferenceScore
    );

    const estimatedPickupMinutes = Math.max(10, Math.round(distanceKm * 4 + 8));

    const matchReasons: string[] = [];
    if (distanceKm <= 2.5) matchReasons.push(`Proximity: Only ${distanceKm} km away (~${estimatedPickupMinutes} min ETA)`);
    if (ngo.capacityMeals >= donation.quantityMeals) {
      matchReasons.push(`Capacity Match: Can accommodate all ${donation.quantityMeals} meals (capacity: ${ngo.capacityMeals})`);
    } else {
      matchReasons.push(`Partial/High Utilization: NGO capacity is ${ngo.capacityMeals} meals`);
    }
    if (ngo.dietaryPreferences.includes(donation.foodCategory)) {
      matchReasons.push(`Dietary Match: Regularly distributes ${donation.foodCategory}`);
    }
    if (ngo.activeVolunteers >= 8) {
      matchReasons.push(`Active Fleet: ${ngo.activeVolunteers} volunteers ready for rapid dispatch`);
    }

    const aiExplanation = `${ngo.name} is a ${weightedScore}% match. Located ${distanceKm} km away with ${ngo.activeVolunteers} active volunteers and ${ngo.capacityMeals}-meal capacity, ideal for this ${donation.quantityMeals}-meal ${donation.foodCategory} batch before ${donation.expiryTime}.`;

    results.push({
      ngoId: ngo.id,
      ngoName: ngo.name,
      ngoCity: ngo.city,
      ngoAddress: ngo.address,
      ngoCapacity: ngo.capacityMeals,
      distanceKm,
      distanceScore,
      quantityScore,
      urgencyScore,
      preferenceScore,
      overallScore: Math.min(99, Math.max(35, weightedScore)),
      estimatedPickupMinutes,
      aiExplanation,
      matchReasons,
      contactPhone: ngo.contactPhone,
    });
  }

  return results.sort((a, b) => b.overallScore - a.overallScore);
}
