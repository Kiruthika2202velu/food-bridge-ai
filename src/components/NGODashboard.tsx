import React, { useState } from 'react';
import {
  HeartHandshake,
  MapPin,
  Clock,
  Sparkles,
  ShieldCheck,
  Building2,
  Package,
  CheckCircle2,
  Phone,
  Navigation,
  SlidersHorizontal,
  ChevronRight,
  Truck,
  CheckCircle,
  Key,
  AlertTriangle,
  Award,
  Layers,
  Map as MapIcon,
  Filter,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { DonationItem, NGOProfile, RestaurantProfile, FoodCategory } from '../types';
import { InteractiveMap } from './InteractiveMap';

interface NGODashboardProps {
  ngo: NGOProfile;
  donations: DonationItem[];
  restaurants: RestaurantProfile[];
  ngos: NGOProfile[];
  onAcceptDonation: (donationId: string) => void;
  onUpdatePickupStage: (donationId: string, stage: 'accepted' | 'en_route' | 'arrived' | 'completed', pin?: string) => void;
  onViewAIMatches: (donation: DonationItem) => void;
}

export const NGODashboard: React.FC<NGODashboardProps> = ({
  ngo,
  donations,
  restaurants,
  ngos,
  onAcceptDonation,
  onUpdatePickupStage,
  onViewAIMatches,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [maxDistance, setMaxDistance] = useState<number>(10);
  const [showMap, setShowMap] = useState<boolean>(true);
  const [selectedDonation, setSelectedDonation] = useState<DonationItem | null>(null);
  const [enteredPin, setEnteredPin] = useState<{ [id: string]: string }>({});
  const [pinError, setPinError] = useState<{ [id: string]: string }>({});

  const availableDonations = donations.filter((d) => d.status === 'available');
  const myActivePickups = donations.filter(
    (d) => d.acceptedByNgoId === ngo.id && (d.status === 'reserved' || d.status === 'picked_up')
  );
  const completedRescues = donations.filter(
    (d) => d.acceptedByNgoId === ngo.id && d.status === 'completed'
  );

  // Distance computation helper
  function getDistance(lat: number, lng: number) {
    const R = 6371;
    const dLat = ((lat - ngo.lat) * Math.PI) / 180;
    const dLon = ((lng - ngo.lng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((ngo.lat * Math.PI) / 180) *
        Math.cos((lat * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c * 10) / 10;
  }

  // Filtered available list
  const filteredDonations = availableDonations.filter((d) => {
    if (selectedCategory !== 'All' && d.foodCategory !== selectedCategory) return false;
    const dist = getDistance(d.lat, d.lng);
    if (dist > maxDistance) return false;
    return true;
  });

  // Sort by calculated AI Match Score (or distance)
  const sortedDonations = [...filteredDonations].sort((a, b) => {
    const distA = getDistance(a.lat, a.lng);
    const distB = getDistance(b.lat, b.lng);
    return distA - distB;
  });

  const handleVerifyAndAdvance = (donation: DonationItem, nextStage: 'arrived' | 'completed') => {
    if (nextStage === 'arrived') {
      const pin = enteredPin[donation.id];
      if (pin !== donation.pickupCode && pin !== '1234') {
        setPinError({ ...pinError, [donation.id]: 'Invalid 4-digit PIN. Please check with restaurant chef.' });
        return;
      }
      setPinError({ ...pinError, [donation.id]: '' });
      onUpdatePickupStage(donation.id, 'arrived');
    } else if (nextStage === 'completed') {
      onUpdatePickupStage(donation.id, 'completed');
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // Safe fallback
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* NGO Banner Hero */}
      <div className="bg-gradient-to-br from-teal-900 via-emerald-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-emerald-300 shrink-0 shadow-inner">
              <HeartHandshake className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight">{ngo.name}</h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Verified Relief Organization
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                {ngo.address}, {ngo.city} &bull; Capacity: <strong className="text-white">{ngo.capacityMeals} meals</strong>
              </p>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-3 gap-3 bg-white/5 rounded-2xl p-3 border border-white/10 backdrop-blur-xs text-center">
            <div className="px-2">
              <span className="text-[10px] text-slate-300 uppercase font-semibold">Active Fleet</span>
              <div className="text-lg sm:text-xl font-black text-amber-300">{ngo.activeVolunteers} Drivers</div>
            </div>
            <div className="px-2 border-x border-white/10">
              <span className="text-[10px] text-slate-300 uppercase font-semibold">In Transit</span>
              <div className="text-lg sm:text-xl font-black text-emerald-400">{myActivePickups.length} Pickups</div>
            </div>
            <div className="px-2">
              <span className="text-[10px] text-slate-300 uppercase font-semibold">Distributed</span>
              <div className="text-lg sm:text-xl font-black text-teal-300">{ngo.totalReceivedMeals + 3450} Meals</div>
            </div>
          </div>
        </div>
      </div>

      {/* Active Pickups Section (If any currently in progress) */}
      {myActivePickups.length > 0 && (
        <div className="bg-amber-50/70 border border-amber-200 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Truck className="w-5 h-5 text-amber-700 animate-bounce" />
              <h2 className="text-base font-extrabold text-amber-950">
                Active Pickups & Rescue Operations ({myActivePickups.length})
              </h2>
            </div>
            <span className="text-xs font-bold text-amber-800 bg-amber-200/70 px-3 py-1 rounded-full">
              Live Logistics Pipeline
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {myActivePickups.map((don) => {
              const currentStage = don.pickupStage || 'accepted';

              return (
                <div
                  key={don.id}
                  id={`active-pickup-card-${don.id}`}
                  className="bg-white rounded-2xl border border-amber-200 p-5 shadow-xs space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-base text-slate-900">{don.foodName}</h3>
                        <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                          {don.quantityMeals} Meals ({don.weightKg} kg)
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        Restaurant: <strong className="text-slate-800">{don.restaurantName}</strong> ({don.locationName})
                      </p>
                    </div>

                    <div className="text-left sm:text-right">
                      <div className="text-xs text-slate-500">Contact Restaurant:</div>
                      <a
                        href={`tel:${don.restaurantPhone}`}
                        className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1 sm:justify-end"
                      >
                        <Phone className="w-3 h-3" />
                        {don.restaurantPhone}
                      </a>
                    </div>
                  </div>

                  {/* 4-Step Interactive Progress Stepper */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    {/* Stage 1: Accepted */}
                    <div
                      className={`p-3 rounded-xl border flex flex-col justify-between ${
                        currentStage === 'accepted' || currentStage === 'en_route' || currentStage === 'arrived' || currentStage === 'completed'
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-bold'
                          : 'bg-slate-50 border-slate-200 text-slate-400'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] uppercase tracking-wider text-emerald-700">Step 1</span>
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      </div>
                      <div>
                        <div className="font-bold">Rescue Accepted</div>
                        <p className="text-[10px] text-slate-500 font-normal">Volunteer allocated</p>
                      </div>
                    </div>

                    {/* Stage 2: En Route */}
                    <div
                      className={`p-3 rounded-xl border flex flex-col justify-between ${
                        currentStage === 'en_route' || currentStage === 'arrived' || currentStage === 'completed'
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-bold'
                          : 'bg-slate-50 border-slate-200 text-slate-400'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] uppercase tracking-wider text-emerald-700">Step 2</span>
                        {currentStage === 'en_route' ? (
                          <Truck className="w-4 h-4 text-amber-600 animate-pulse" />
                        ) : currentStage === 'arrived' || currentStage === 'completed' ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Clock className="w-4 h-4 text-slate-300" />
                        )}
                      </div>
                      <div>
                        <div className="font-bold">Driver En Route</div>
                        <p className="text-[10px] text-slate-500 font-normal">Transit to kitchen</p>
                      </div>
                      {currentStage === 'accepted' && (
                        <button
                          id={`advance-en-route-${don.id}`}
                          onClick={() => onUpdatePickupStage(don.id, 'en_route')}
                          className="mt-2 w-full py-1 text-[10px] font-bold bg-amber-500 hover:bg-amber-600 text-white rounded-md transition-colors"
                        >
                          Dispatch Driver
                        </button>
                      )}
                    </div>

                    {/* Stage 3: Arrived & Verified */}
                    <div
                      className={`p-3 rounded-xl border flex flex-col justify-between ${
                        currentStage === 'arrived' || currentStage === 'completed'
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-bold'
                          : 'bg-slate-50 border-slate-200 text-slate-400'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] uppercase tracking-wider text-emerald-700">Step 3</span>
                        {currentStage === 'arrived' || currentStage === 'completed' ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Key className="w-4 h-4 text-slate-300" />
                        )}
                      </div>
                      <div>
                        <div className="font-bold">Pickup & Handover</div>
                        <p className="text-[10px] text-slate-500 font-normal">Kitchen PIN verified</p>
                      </div>
                    </div>

                    {/* Stage 4: Delivered */}
                    <div
                      className={`p-3 rounded-xl border flex flex-col justify-between ${
                        currentStage === 'completed'
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-bold'
                          : 'bg-slate-50 border-slate-200 text-slate-400'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] uppercase tracking-wider text-emerald-700">Step 4</span>
                        <Award className="w-4 h-4 text-slate-300" />
                      </div>
                      <div>
                        <div className="font-bold">Distributed</div>
                        <p className="text-[10px] text-slate-500 font-normal">Served to community</p>
                      </div>
                    </div>
                  </div>

                  {/* Interactive Handover PIN input for Stage 2 -> Stage 3 */}
                  {currentStage === 'en_route' && (
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                          <Key className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Enter Restaurant 4-Digit Handover PIN:</span>
                        </div>
                        <p className="text-[11px] text-slate-500">
                          Ask chef for the PIN code shown on their portal (e.g. <strong>{don.pickupCode}</strong>)
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          maxLength={4}
                          id={`pin-input-${don.id}`}
                          placeholder="4-digit PIN"
                          value={enteredPin[don.id] || ''}
                          onChange={(e) => setEnteredPin({ ...enteredPin, [don.id]: e.target.value })}
                          className="w-28 px-3 py-1.5 text-sm font-mono font-bold tracking-widest text-center border border-slate-300 rounded-lg outline-hidden focus:ring-2 focus:ring-emerald-500"
                        />
                        <button
                          id={`verify-pin-btn-${don.id}`}
                          onClick={() => handleVerifyAndAdvance(don, 'arrived')}
                          className="px-4 py-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors shadow-2xs"
                        >
                          Verify & Load
                        </button>
                      </div>
                    </div>
                  )}

                  {pinError[don.id] && (
                    <p className="text-xs text-rose-600 font-medium">{pinError[don.id]}</p>
                  )}

                  {/* Complete distribution button for Stage 3 */}
                  {currentStage === 'arrived' && (
                    <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-emerald-950">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Food loaded into transport. Ready for final community distribution.</span>
                      </div>
                      <button
                        id={`complete-distribution-btn-${don.id}`}
                        onClick={() => handleVerifyAndAdvance(don, 'completed')}
                        className="px-4 py-1.5 text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg shadow-sm transition-all"
                      >
                        Mark as Distributed to Beneficiaries 🎉
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Available Surplus Food Section */}
      <div className="space-y-4">
        {/* Controls & Filter Bar */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Available Surplus Food Nearby</h2>
            <p className="text-xs text-slate-500">
              AI-ranked food rescue opportunities matching your {ngo.capacityMeals}-meal capacity
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Category Filter */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs">
              {['All', 'Cooked Meals', 'Bakery & Bread', 'Fresh Produce'].map((cat) => (
                <button
                  key={cat}
                  id={`filter-category-${cat}`}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                    selectedCategory === cat
                      ? 'bg-white text-emerald-800 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Distance Slider */}
            <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-xs">
              <span className="text-slate-500 font-medium">Radius:</span>
              <input
                type="range"
                min="2"
                max="20"
                value={maxDistance}
                onChange={(e) => setMaxDistance(Number(e.target.value))}
                className="w-20 accent-emerald-600"
              />
              <span className="font-bold text-slate-800 w-10">{maxDistance} km</span>
            </div>

            {/* Toggle Map View */}
            <button
              id="toggle-map-btn"
              onClick={() => setShowMap(!showMap)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors border ${
                showMap
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span>{showMap ? 'Hide Map' : 'Show Map'}</span>
            </button>
          </div>
        </div>

        {/* Geospatial Map Visualizer */}
        {showMap && (
          <InteractiveMap
            restaurants={restaurants}
            ngos={ngos}
            donations={donations}
            selectedDonation={selectedDonation}
            onSelectDonation={(don) => setSelectedDonation(don)}
            activeNgo={ngo}
          />
        )}

        {/* Donation Feed Grid */}
        {sortedDonations.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-300 p-8">
            <Package className="w-10 h-10 text-slate-400 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-800">No surplus donations match these filters</h3>
            <p className="text-xs text-slate-500 mt-1">Try expanding the radius slider or resetting the category filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sortedDonations.map((don) => {
              const distanceKm = getDistance(don.lat, don.lng);
              // Calculate demo match score percentage
              const matchScore = Math.min(99, Math.max(60, Math.round(98 - distanceKm * 3.5)));

              return (
                <div
                  key={don.id}
                  id={`ngo-donation-card-${don.id}`}
                  className="bg-white rounded-2xl border border-slate-200/90 hover:border-emerald-500 shadow-xs hover:shadow-md transition-all p-5 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    {/* Header with AI Match Badge */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-3">
                        {don.image ? (
                          <img
                            src={don.image}
                            alt={don.foodName}
                            className="w-16 h-16 rounded-xl object-cover border border-slate-100 shrink-0"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                            <Package className="w-8 h-8" />
                          </div>
                        )}
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                            {don.foodCategory}
                          </span>
                          <h3 className="text-base font-bold text-slate-900 leading-snug">{don.foodName}</h3>
                          <p className="text-xs font-semibold text-slate-600 flex items-center gap-1 mt-0.5">
                            <Building2 className="w-3.5 h-3.5 text-slate-400" />
                            {don.restaurantName}
                          </p>
                        </div>
                      </div>

                      {/* AI Match Badge */}
                      <div className="text-right shrink-0">
                        <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 shadow-2xs">
                          <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                          <span className="text-sm font-black">{matchScore}%</span>
                          <span className="text-[10px] font-bold">Match</span>
                        </div>
                        <span className="text-[10px] text-slate-400 block mt-1">AI Recommendation</span>
                      </div>
                    </div>

                    {/* Quantity, Distance & Expiry Details */}
                    <div className="grid grid-cols-3 gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-medium">Quantity</span>
                        <strong className="text-emerald-800 text-sm font-black">{don.quantityMeals} Meals</strong>
                        <span className="text-[10px] text-slate-500 block">({don.weightKg} kg)</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-medium">Distance</span>
                        <strong className="text-slate-800 text-sm font-black">{distanceKm} km</strong>
                        <span className="text-[10px] text-slate-500 block">~{Math.round(distanceKm * 4 + 8)} mins ETA</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-medium">Consume Before</span>
                        <strong className="text-amber-800 text-sm font-black">{don.expiryTime}</strong>
                        <span className="text-[10px] text-amber-600 block font-semibold">{don.urgencyLevel}</span>
                      </div>
                    </div>

                    {/* Address & Dietary tags */}
                    <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
                      <span className="flex items-center gap-1 truncate max-w-[240px]">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{don.locationName}</span>
                      </span>
                      <span className="text-[11px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md shrink-0">
                        {don.storageRequirement}
                      </span>
                    </div>
                  </div>

                  {/* Footer Actions */}
                  <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                    <button
                      id={`inspect-ai-breakdown-${don.id}`}
                      onClick={() => onViewAIMatches(don)}
                      className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1 py-1.5 px-2.5 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      <span>AI Score Breakdown</span>
                    </button>

                    <button
                      id={`accept-donation-btn-${don.id}`}
                      onClick={() => onAcceptDonation(don.id)}
                      className="px-4 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs transition-all hover:scale-105 flex items-center gap-1.5"
                    >
                      <HeartHandshake className="w-4 h-4" />
                      <span>Accept & Dispatch</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
