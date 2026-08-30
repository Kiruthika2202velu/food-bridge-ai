import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Utensils,
  Clock,
  MapPin,
  ShieldAlert,
  Package,
  Layers,
  Image as ImageIcon,
  CheckCircle,
  HelpCircle,
  Loader2,
  AlertTriangle,
} from 'lucide-react';
import { DonationItem, FoodCategory, RestaurantProfile, UrgencyLevel, AIAnalysisResult } from '../types';

interface CreateDonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  restaurant: RestaurantProfile;
  onDonationCreated: (donation: DonationItem) => void;
}

const PRESET_DONATIONS = [
  {
    name: 'Vegetable Biryani & Fresh Raita',
    category: 'Cooked Meals' as FoodCategory,
    quantity: 25,
    weightKg: 12.5,
    prepared: '10:30 AM',
    expiryHoursAhead: 3,
    storage: 'Hot Held',
    urgency: 'urgent' as UrgencyLevel,
    tags: ['Vegetarian', 'Nut-Free', 'Freshly Cooked'],
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=80',
    packaging: 'Thermal Sealed Meal Trays (Food-grade)',
    notes: 'Steaming hot freshly prepared vegetable dum biryani packed with aromatic basmati rice.',
  },
  {
    name: 'Artisan Whole Wheat Bread & Croissants',
    category: 'Bakery & Bread' as FoodCategory,
    quantity: 40,
    weightKg: 8.5,
    prepared: '08:00 AM',
    expiryHoursAhead: 6,
    storage: 'Room Temperature',
    urgency: 'moderate' as UrgencyLevel,
    tags: ['Vegetarian', 'Baked Today', 'Preservative-Free'],
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&auto=format&fit=crop&q=80',
    packaging: 'Individual Paper Bags & Crates',
    notes: 'Crispy crust artisan loaves and buttery golden croissants from morning baking run.',
  },
  {
    name: 'Paneer Butter Masala with Phulkas',
    category: 'Cooked Meals' as FoodCategory,
    quantity: 30,
    weightKg: 15.0,
    prepared: '11:45 AM',
    expiryHoursAhead: 3,
    storage: 'Hot Held',
    urgency: 'urgent' as UrgencyLevel,
    tags: ['Vegetarian', 'High Protein'],
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=80',
    packaging: 'Foil Packed Bento Boxes',
    notes: 'Rich cottage cheese curry with soft hand-rolled whole wheat phulkas.',
  },
  {
    name: 'Fresh Garden Salad & Fruit Bowls',
    category: 'Fresh Produce' as FoodCategory,
    quantity: 20,
    weightKg: 7.0,
    prepared: '09:30 AM',
    expiryHoursAhead: 5,
    storage: 'Refrigerated',
    urgency: 'moderate' as UrgencyLevel,
    tags: ['Vegan', 'Low Calorie', 'High Fiber'],
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&auto=format&fit=crop&q=80',
    packaging: 'Bio-degradable PLA Salad Containers',
    notes: 'Crisp lettuce, cucumbers, cherry tomatoes, and diced seasonal melons.',
  },
];

export const CreateDonationModal: React.FC<CreateDonationModalProps> = ({
  isOpen,
  onClose,
  restaurant,
  onDonationCreated,
}) => {
  const [foodName, setFoodName] = useState('');
  const [foodCategory, setFoodCategory] = useState<FoodCategory>('Cooked Meals');
  const [quantityMeals, setQuantityMeals] = useState<number>(25);
  const [weightKg, setWeightKg] = useState<number>(12.5);
  const [preparedAt, setPreparedAt] = useState('10:30 AM');
  const [expiryTime, setExpiryTime] = useState('02:00 PM');
  const [locationName, setLocationName] = useState(restaurant.address);
  const [urgencyLevel, setUrgencyLevel] = useState<UrgencyLevel>('urgent');
  const [packagingType, setPackagingType] = useState('Thermal Sealed Meal Trays (Food-grade)');
  const [storageRequirement, setStorageRequirement] = useState<'Room Temperature' | 'Refrigerated' | 'Hot Held' | 'Frozen'>('Hot Held');
  const [pickupInstructions, setPickupInstructions] = useState('Pickup from kitchen dispatch counter. Ask for Duty Chef.');
  const [dietaryTagsInput, setDietaryTagsInput] = useState('Vegetarian, Freshly Cooked');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=80');
  
  const [isAnalyzingAI, setIsAnalyzingAI] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysisResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleApplyPreset = (preset: typeof PRESET_DONATIONS[0]) => {
    setFoodName(preset.name);
    setFoodCategory(preset.category);
    setQuantityMeals(preset.quantity);
    setWeightKg(preset.weightKg);
    setPreparedAt(preset.prepared);
    setStorageRequirement(preset.storage as any);
    setUrgencyLevel(preset.urgency);
    setPackagingType(preset.packaging);
    setDietaryTagsInput(preset.tags.join(', '));
    setImageUrl(preset.image);
    setPickupInstructions(preset.notes);

    const now = new Date();
    const exp = new Date(now.getTime() + preset.expiryHoursAhead * 3600 * 1000);
    setExpiryTime(exp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  };

  const handleAIAnalyze = async () => {
    if (!foodName) {
      alert('Please enter a food name first to analyze with AI');
      return;
    }

    setIsAnalyzingAI(true);
    try {
      const response = await fetch('/api/ai/analyze-food', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          foodName,
          foodCategory,
          quantityMeals,
          preparedAt,
          storageType: storageRequirement,
        }),
      });
      const data = await response.json();
      if (data.success && data.analysis) {
        setAiAnalysis(data.analysis);
        if (data.analysis.recommendedStorage) {
          setStorageRequirement(data.analysis.recommendedStorage);
        }
        if (data.analysis.urgencyRating) {
          setUrgencyLevel(data.analysis.urgencyRating);
        }
        if (data.analysis.dietaryTags?.length > 0) {
          setDietaryTagsInput(data.analysis.dietaryTags.join(', '));
        }
      }
    } catch (err) {
      console.error('Error analyzing food:', err);
    } finally {
      setIsAnalyzingAI(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!foodName.trim()) {
      alert('Please enter a food name');
      return;
    }

    setIsSubmitting(true);
    try {
      const dietaryTags = dietaryTagsInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const payload = {
        restaurantId: restaurant.id,
        restaurantName: restaurant.name,
        restaurantPhone: restaurant.contactPhone,
        foodName,
        foodCategory,
        quantityMeals: Number(quantityMeals) || 20,
        weightKg: Number(weightKg) || 10,
        preparedAt,
        expiryTime,
        locationName,
        city: restaurant.city,
        lat: restaurant.lat,
        lng: restaurant.lng,
        urgencyLevel,
        packagingType,
        dietaryTags,
        storageRequirement,
        pickupInstructions,
        image: imageUrl,
      };

      const response = await fetch('/api/donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (data.success && data.donation) {
        onDonationCreated(data.donation);
        onClose();
      }
    } catch (err) {
      console.error('Failed to create donation:', err);
      alert('Failed to post donation. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-700 to-teal-700 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
              <Utensils className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Post Surplus Food for Rescue</h2>
              <p className="text-xs text-emerald-100">
                Instantly connect with nearby verified NGOs via AI Matching Engine
              </p>
            </div>
          </div>
          <button
            id="close-post-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/15 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Presets Banner */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-2.5">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="font-semibold text-slate-500 shrink-0">Quick Demo Presets:</span>
            {PRESET_DONATIONS.map((preset, idx) => (
              <button
                key={idx}
                id={`apply-preset-${idx}`}
                type="button"
                onClick={() => handleApplyPreset(preset)}
                className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-700 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-800 font-medium whitespace-nowrap transition-colors shadow-2xs"
              >
                {preset.name.split(' ')[0]} {preset.name.split(' ')[1]} ({preset.quantity} meals)
              </button>
            ))}
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Food Details Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Food Item Name *
                </label>
                <button
                  type="button"
                  id="ai-autofill-btn"
                  onClick={handleAIAnalyze}
                  disabled={isAnalyzingAI || !foodName}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 hover:text-emerald-900 disabled:opacity-50"
                >
                  {isAnalyzingAI ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <Sparkles className="w-3 h-3 text-amber-500" />
                  )}
                  <span>AI Analyze & Suggest</span>
                </button>
              </div>
              <input
                type="text"
                id="input-food-name"
                required
                value={foodName}
                onChange={(e) => setFoodName(e.target.value)}
                placeholder="e.g. Vegetable Rice, Fresh Sandwiches, Meal Boxes"
                className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Food Category
              </label>
              <select
                id="select-food-category"
                value={foodCategory}
                onChange={(e) => setFoodCategory(e.target.value as FoodCategory)}
                className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-hidden bg-white"
              >
                <option value="Cooked Meals">Cooked Meals (Warm / Prepared)</option>
                <option value="Bakery & Bread">Bakery & Bread (Loaves, Pastries)</option>
                <option value="Fresh Produce">Fresh Produce (Fruits, Salads, Veg)</option>
                <option value="Packaged Food">Packaged Food (Sealed Goods)</option>
                <option value="Dairy & Beverages">Dairy & Beverages</option>
                <option value="Desserts & Sweets">Desserts & Sweets</option>
              </select>
            </div>
          </div>

          {/* AI Analysis Insight Card (if triggered) */}
          {aiAnalysis && (
            <div className="p-3.5 bg-emerald-50/80 rounded-xl border border-emerald-200 text-xs space-y-2">
              <div className="flex items-center gap-2 text-emerald-900 font-bold">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>AI Quality & Safety Verification</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700">
                <p>
                  <strong className="text-slate-900">Estimated Shelf Life:</strong> {aiAnalysis.suggestedExpiryTime}
                </p>
                <p>
                  <strong className="text-slate-900">Recommended Storage:</strong> {aiAnalysis.recommendedStorage}
                </p>
                <p className="sm:col-span-2">
                  <strong className="text-slate-900">Safety Tip:</strong>{' '}
                  {aiAnalysis.safeHandlingGuidelines?.[0] || 'Maintain hygienic temperature control'}
                </p>
              </div>
            </div>
          )}

          {/* Quantities & Timing Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Portions (Meals)
              </label>
              <input
                type="number"
                id="input-quantity-meals"
                min="1"
                required
                value={quantityMeals}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setQuantityMeals(val);
                  setWeightKg(Math.round(val * 0.45 * 10) / 10);
                }}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Est. Weight (kg)
              </label>
              <input
                type="number"
                id="input-weight-kg"
                step="0.1"
                min="0.5"
                value={weightKg}
                onChange={(e) => setWeightKg(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Prepared At
              </label>
              <input
                type="text"
                id="input-prepared-at"
                value={preparedAt}
                onChange={(e) => setPreparedAt(e.target.value)}
                placeholder="10:30 AM"
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Best Before
              </label>
              <input
                type="text"
                id="input-expiry-time"
                value={expiryTime}
                onChange={(e) => setExpiryTime(e.target.value)}
                placeholder="02:00 PM"
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-hidden"
              />
            </div>
          </div>

          {/* Storage & Urgency Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Urgency Level
              </label>
              <select
                id="select-urgency"
                value={urgencyLevel}
                onChange={(e) => setUrgencyLevel(e.target.value as UrgencyLevel)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-hidden bg-white"
              >
                <option value="urgent">Urgent (Expires in &lt;3 hrs)</option>
                <option value="moderate">Moderate (Expires in 3-6 hrs)</option>
                <option value="flexible">Flexible (Expires in 6+ hrs)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Storage Condition
              </label>
              <select
                id="select-storage"
                value={storageRequirement}
                onChange={(e) => setStorageRequirement(e.target.value as any)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-hidden bg-white"
              >
                <option value="Hot Held">Hot Held (Warm Insulated)</option>
                <option value="Room Temperature">Room Temperature</option>
                <option value="Refrigerated">Refrigerated (Chilled)</option>
                <option value="Frozen">Frozen Storage</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Packaging Type
              </label>
              <input
                type="text"
                id="input-packaging"
                value={packagingType}
                onChange={(e) => setPackagingType(e.target.value)}
                placeholder="e.g. Sealed Food Trays"
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-hidden"
              />
            </div>
          </div>

          {/* Location & Dietary Tags */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Pickup Location & Address
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  id="input-pickup-location"
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-hidden"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Coordinates: {restaurant.lat.toFixed(4)}, {restaurant.lng.toFixed(4)} ({restaurant.city})
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Dietary Tags (comma separated)
              </label>
              <input
                type="text"
                id="input-dietary-tags"
                value={dietaryTagsInput}
                onChange={(e) => setDietaryTagsInput(e.target.value)}
                placeholder="Vegetarian, Nut-Free, Halal, Jain"
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-hidden"
              />
            </div>
          </div>

          {/* Instructions */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Pickup Instructions & Access Notes
            </label>
            <textarea
              id="input-pickup-instructions"
              rows={2}
              value={pickupInstructions}
              onChange={(e) => setPickupInstructions(e.target.value)}
              placeholder="e.g. Enter through kitchen rear door on DB Road. Provide the 4-digit PIN."
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-hidden"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <ShieldAlert className="w-4 h-4 text-emerald-600" />
              <span>A secure 4-digit PIN will be generated for driver verification.</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                id="submit-donation-btn"
                disabled={isSubmitting}
                className="px-5 py-2 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-all hover:shadow-md flex items-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4 text-emerald-200" />
                )}
                <span>Broadcast Donation to NGOs</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
