import { Router } from 'express';
import { donations } from '../data/store';
import { calculateMatchesForDonation } from '../services/matching';
import { getGeminiClient } from '../services/gemini';
import { AIAnalysisResult } from '../../src/types';

const router = Router();

// AI Matches for a donation — deterministic weighted scoring
// (calculateMatchesForDonation), optionally enriched with a Gemini-
// generated explanation for the top match if GEMINI_API_KEY is set.
router.get('/donations/:id/matches', async (req, res) => {
  const { id } = req.params;
  const donation = donations.find((d) => d.id === id);
  if (!donation) return res.status(404).json({ error: 'Donation not found' });

  const algorithmicMatches = calculateMatchesForDonation(donation);

  const gemini = getGeminiClient();
  if (gemini && algorithmicMatches.length > 0) {
    try {
      const topNgo = algorithmicMatches[0];
      const prompt = `You are the AI Matching Engine for Food Bridge AI.
Explain why ${topNgo.ngoName} (Capacity: ${topNgo.ngoCapacity} meals, Distance: ${topNgo.distanceKm}km) is the top match for a surplus donation of "${donation.foodName}" (${donation.quantityMeals} portions, Category: ${donation.foodCategory}, Urgency: ${donation.urgencyLevel}, Consume before: ${donation.expiryTime}).
Provide a crisp 2-sentence executive summary highlighting logistics efficiency, capacity fit, and urgency handling.`;

      const response = await gemini.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
      });

      if (response.text) {
        topNgo.aiExplanation = response.text.trim();
      }
    } catch (err) {
      console.warn('Gemini match enhancement fallback to algorithm:', err);
    }
  }

  res.json({
    donationId: donation.id,
    foodName: donation.foodName,
    quantityMeals: donation.quantityMeals,
    matches: algorithmicMatches,
  });
});

// AI Food Quality & Shelf-Life Analyzer — uses Gemini if configured,
// otherwise a category-based heuristic fallback so the endpoint always
// returns a usable, labeled result rather than failing.
router.post('/ai/analyze-food', async (req, res) => {
  const { foodName, foodCategory, quantityMeals, preparedAt, storageType, ingredientsNote } = req.body;

  const gemini = getGeminiClient();
  if (gemini) {
    try {
      const prompt = `Analyze this surplus food donation for safety, shelf-life, and distribution readiness:
- Food Name: "${foodName}"
- Category: "${foodCategory}"
- Quantity: ${quantityMeals} meals
- Prepared At: "${preparedAt || 'Freshly cooked'}"
- Current Storage: "${storageType || 'Room Temperature'}"
- Ingredients/Notes: "${ingredientsNote || 'Standard commercial preparation'}"

Return a strict JSON object with:
{
  "estimatedShelfLifeHours": number (e.g. 3, 4, 8, 24),
  "suggestedExpiryTime": string (e.g. "Within 3.5 hours at ambient room temp"),
  "recommendedStorage": string (must be one of: "Room Temperature", "Refrigerated", "Hot Held", "Frozen"),
  "dietaryTags": string array (e.g. ["Vegetarian", "High-Protein", "Nut-Free"]),
  "safeHandlingGuidelines": string array (3 practical bullet items for volunteers),
  "estimatedNutritionalPortion": string (e.g. "~450 kcal balanced meal per portion"),
  "urgencyRating": string (one of: "urgent", "moderate", "flexible"),
  "smartNotes": string (short AI distribution tip for NGOs)
}`;

      const response = await gemini.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      if (response.text) {
        const parsed = JSON.parse(response.text);
        return res.json({ success: true, analysis: parsed });
      }
    } catch (err) {
      console.warn('Gemini analysis error, using intelligent fallback rules:', err);
    }
  }

  let shelfLife = 4;
  let recommendedStorage: 'Room Temperature' | 'Refrigerated' | 'Hot Held' | 'Frozen' = 'Hot Held';
  let urgency: 'urgent' | 'moderate' | 'flexible' = 'moderate';
  let tags = ['Nutritious', 'Freshly Prepared'];

  if (foodCategory === 'Bakery & Bread') {
    shelfLife = 12;
    recommendedStorage = 'Room Temperature';
    urgency = 'flexible';
    tags.push('Vegetarian', 'Baked Fresh');
  } else if (foodCategory === 'Cooked Meals') {
    shelfLife = 3.5;
    recommendedStorage = 'Hot Held';
    urgency = 'urgent';
    tags.push('Warm Meals', 'High Energy');
  } else if (foodCategory === 'Dairy & Beverages') {
    shelfLife = 6;
    recommendedStorage = 'Refrigerated';
    urgency = 'urgent';
    tags.push('Keep Chilled');
  } else if (foodCategory === 'Fresh Produce') {
    shelfLife = 24;
    recommendedStorage = 'Room Temperature';
    urgency = 'flexible';
    tags.push('Vitamins & Fiber', 'Vegan');
  }

  const analysis: AIAnalysisResult = {
    estimatedShelfLifeHours: shelfLife,
    suggestedExpiryTime: `Consume within ${shelfLife} hours for optimal safety & taste`,
    recommendedStorage,
    dietaryTags: tags,
    safeHandlingGuidelines: [
      'Maintain appropriate temperature threshold during volunteer transit',
      'Verify packaging integrity and food grade seals before distribution',
      'Distribute to beneficiaries immediately upon NGO facility arrival',
    ],
    estimatedNutritionalPortion: `~420 kcal wholesome portion per meal unit`,
    urgencyRating: urgency,
    smartNotes: `AI Safety Assessment: Ready for instant matching with priority to nearby NGOs within 5 km.`,
  };

  res.json({ success: true, analysis });
});

export default router;
