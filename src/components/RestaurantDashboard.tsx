import React, { useState } from 'react';
import {
  Building2,
  PlusCircle,
  Sparkles,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Package,
  ShieldCheck,
  TrendingUp,
  Award,
  Key,
  Users,
  ChevronRight,
  Eye,
  Trash2,
} from 'lucide-react';
import { DonationItem, RestaurantProfile, NGOProfile } from '../types';

interface RestaurantDashboardProps {
  restaurant: RestaurantProfile;
  donations: DonationItem[];
  onOpenCreateDonation: () => void;
  onViewAIMatches: (donation: DonationItem) => void;
  onCancelDonation?: (donationId: string) => void;
}

export const RestaurantDashboard: React.FC<RestaurantDashboardProps> = ({
  restaurant,
  donations,
  onOpenCreateDonation,
  onViewAIMatches,
  onCancelDonation,
}) => {
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');

  const myDonations = donations.filter((d) => d.restaurantId === restaurant.id);
  const activeDonations = myDonations.filter((d) => d.status === 'available' || d.status === 'reserved');
  const pastDonations = myDonations.filter((d) => d.status === 'completed' || d.status === 'picked_up');

  const totalMealsSaved = myDonations.reduce((sum, d) => sum + d.quantityMeals, 0);
  const totalKgSaved = myDonations.reduce((sum, d) => sum + d.weightKg, 0);

  return (
    <div className="space-y-6">
      {/* Restaurant Welcome & Metric Hero */}
      <div className="bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        {/* Background ambient pattern */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-emerald-300 shrink-0 shadow-inner">
              <Building2 className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight">{restaurant.name}</h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Verified Food Donor
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                {restaurant.address}, {restaurant.city} &bull; {restaurant.cuisineType}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              id="post-surplus-hero-btn"
              onClick={onOpenCreateDonation}
              className="px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/30 transition-all hover:scale-105"
            >
              <PlusCircle className="w-5 h-5" />
              <span>Post Surplus Food</span>
            </button>
          </div>
        </div>

        {/* Quick Impact Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6 pt-6 border-t border-white/10">
          <div className="bg-white/5 rounded-xl p-3.5 border border-white/10 backdrop-blur-xs">
            <span className="text-xs text-slate-300 font-medium">Active Surplus Posts</span>
            <div className="text-2xl font-black text-emerald-400 mt-0.5">{activeDonations.length}</div>
            <span className="text-[10px] text-emerald-200/70">Broadcasting to NGOs</span>
          </div>

          <div className="bg-white/5 rounded-xl p-3.5 border border-white/10 backdrop-blur-xs">
            <span className="text-xs text-slate-300 font-medium">Meals Rescued</span>
            <div className="text-2xl font-black text-amber-300 mt-0.5">{totalMealsSaved + 420}</div>
            <span className="text-[10px] text-amber-200/70">Community Portions</span>
          </div>

          <div className="bg-white/5 rounded-xl p-3.5 border border-white/10 backdrop-blur-xs">
            <span className="text-xs text-slate-300 font-medium">Food Diverted</span>
            <div className="text-2xl font-black text-teal-300 mt-0.5">{Math.round(totalKgSaved + 185)} kg</div>
            <span className="text-[10px] text-teal-200/70">Zero-Waste Target</span>
          </div>

          <div className="bg-white/5 rounded-xl p-3.5 border border-white/10 backdrop-blur-xs">
            <span className="text-xs text-slate-300 font-medium">Avg. Rescue Time</span>
            <div className="text-2xl font-black text-indigo-300 mt-0.5">38 mins</div>
            <span className="text-[10px] text-indigo-200/70">Powered by AI Match</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <div className="flex items-center gap-2">
          <button
            id="tab-active-donations"
            onClick={() => setActiveTab('active')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
              activeTab === 'active'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Active Donations ({activeDonations.length})
          </button>
          <button
            id="tab-past-history"
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
              activeTab === 'history'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Rescue History ({pastDonations.length})
          </button>
        </div>

        <button
          id="post-surplus-secondary-btn"
          onClick={onOpenCreateDonation}
          className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1.5 py-1 px-3 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>New Surplus Batch</span>
        </button>
      </div>

      {/* Active Donations Content */}
      {activeTab === 'active' && (
        <div className="space-y-4">
          {activeDonations.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-300 p-8">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                <Package className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800">No Active Surplus Food Posts</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-4">
                Got leftover cooked meals, baked items, or produce at the end of the shift? Post them to instantly alert verified nearby NGOs.
              </p>
              <button
                onClick={onOpenCreateDonation}
                className="px-4 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors inline-flex items-center gap-1.5 shadow-xs"
              >
                <PlusCircle className="w-4 h-4" />
                Post Surplus Food
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {activeDonations.map((don) => {
                const isReserved = don.status === 'reserved';

                return (
                  <div
                    key={don.id}
                    id={`restaurant-donation-${don.id}`}
                    className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
                  >
                    <div>
                      {/* Card Header & Status */}
                      <div className="p-4 sm:p-5 pb-3">
                        <div className="flex items-start justify-between gap-3">
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
                              <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="text-base font-bold text-slate-900">{don.foodName}</h3>
                                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                                  {don.foodCategory}
                                </span>
                              </div>

                              <div className="flex items-center gap-3 text-xs text-slate-600 mt-1">
                                <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                                  🍱 {don.quantityMeals} Meals ({don.weightKg} kg)
                                </span>
                                <span className="flex items-center gap-1 text-slate-500">
                                  <Clock className="w-3 h-3 text-slate-400" />
                                  Prep: {don.preparedAt}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Status Pill */}
                          <div className="text-right shrink-0">
                            {isReserved ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 animate-pulse">
                                <Clock className="w-3 h-3" />
                                Pickup En Route
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                                <Sparkles className="w-3 h-3 text-emerald-600" />
                                Live Available
                              </span>
                            )}
                            <div className="text-[10px] text-slate-400 mt-1">
                              Best by: <strong className="text-amber-700">{don.expiryTime}</strong>
                            </div>
                          </div>
                        </div>

                        {/* Dietary tags */}
                        <div className="flex items-center gap-1.5 flex-wrap mt-3">
                          {don.dietaryTags.map((tag, idx) => (
                            <span
                              key={idx}
                              className="text-[11px] font-medium bg-slate-50 text-slate-600 border border-slate-200 px-2 py-0.5 rounded-md"
                            >
                              {tag}
                            </span>
                          ))}
                          <span className="text-[11px] font-medium bg-teal-50 text-teal-700 border border-teal-200 px-2 py-0.5 rounded-md">
                            {don.storageRequirement}
                          </span>
                        </div>

                        {/* Accepted NGO Info or AI Top Match recommendation */}
                        <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                          {isReserved ? (
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">
                                  Accepted By Verified NGO:
                                </p>
                                <p className="text-xs font-bold text-slate-900 mt-0.5">
                                  {don.acceptedByNgoName || 'Hope Harvest Foundation'}
                                </p>
                              </div>
                              <div className="text-right">
                                <span className="text-xs font-semibold text-emerald-700 bg-emerald-100/80 px-2 py-1 rounded-lg">
                                  Driver Assigned
                                </span>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-emerald-600" />
                                <div>
                                  <p className="text-xs font-bold text-slate-800">
                                    AI Matching Engine: <span className="text-emerald-600">Top Match 94%</span>
                                  </p>
                                  <p className="text-[11px] text-slate-500">
                                    Hope Harvest Foundation (1.2 km &bull; Cap: 50)
                                  </p>
                                </div>
                              </div>
                              <button
                                id={`view-matches-btn-${don.id}`}
                                onClick={() => onViewAIMatches(don)}
                                className="px-3 py-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors flex items-center gap-1 shadow-2xs"
                              >
                                <span>Inspect AI Matches</span>
                                <ChevronRight className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Card Footer: Handover Verification PIN & Actions */}
                    <div className="px-4 py-3 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 text-xs font-semibold text-slate-700">
                          <Key className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Handover PIN:</span>
                          <span className="font-mono text-sm font-black bg-white px-2 py-0.5 rounded-md border border-slate-300 tracking-wider text-slate-900">
                            {don.pickupCode}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          id={`view-details-${don.id}`}
                          onClick={() => onViewAIMatches(don)}
                          className="px-2.5 py-1 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-md hover:bg-white border border-transparent hover:border-slate-200 transition-colors"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* History Content */}
      {activeTab === 'history' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900">Completed Surplus Food Rescues</h3>
            <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-full">
              100% Direct Impact Verified
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3.5">Food Item</th>
                  <th className="p-3.5">Quantity</th>
                  <th className="p-3.5">Rescued By (NGO)</th>
                  <th className="p-3.5">Date Completed</th>
                  <th className="p-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {pastDonations.map((don) => (
                  <tr key={don.id} className="hover:bg-slate-50/80">
                    <td className="p-3.5 font-bold text-slate-900">
                      {don.foodName}
                      <span className="block text-[11px] text-slate-400 font-normal">{don.foodCategory}</span>
                    </td>
                    <td className="p-3.5 font-semibold text-emerald-700">
                      {don.quantityMeals} meals ({don.weightKg} kg)
                    </td>
                    <td className="p-3.5 font-medium">
                      {don.acceptedByNgoName || 'Hope Harvest Foundation'}
                    </td>
                    <td className="p-3.5 text-slate-500">
                      {new Date(don.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-3.5">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                        <CheckCircle2 className="w-3 h-3" />
                        Completed
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
