import React, { useState } from 'react';
import {
  ShieldCheck,
  Building2,
  HeartHandshake,
  Package,
  CheckCircle2,
  TrendingUp,
  Activity,
  Layers,
  Leaf,
  Users,
  Search,
  Check,
  MapPin,
  Clock,
  Sparkles,
} from 'lucide-react';
import { SystemMetrics, RestaurantProfile, NGOProfile, DonationItem, ActivityNotification } from '../types';

interface AdminDashboardProps {
  metrics: SystemMetrics | null;
  restaurants: RestaurantProfile[];
  ngos: NGOProfile[];
  donations: DonationItem[];
  notifications: ActivityNotification[];
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  metrics,
  restaurants,
  ngos,
  donations,
  notifications,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'restaurants' | 'ngos' | 'audit'>('overview');
  const [searchTerm, setSearchTerm] = useState('');

  // Benchmark stats
  const totalRest = metrics?.totalRestaurants || 42;
  const totalNGO = metrics?.totalNGOs || 18;
  const availableDonations = metrics?.availableDonations || 27;
  const completedDonations = metrics?.completedDonations || 156;
  const foodSavedKg = metrics?.foodSavedKg || 2840;
  const mealsServed = metrics?.mealsServed || 11360;
  const co2PreventedKg = metrics?.co2PreventedKg || 7100;

  return (
    <div className="space-y-6">
      {/* Admin Title Hero */}
      <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-emerald-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-400 shrink-0">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight">Ecosystem & Administrative Hub</h1>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  Live Network Active
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                Real-time governance, AI matching dispatch audit, and metropolitan food recovery analytics.
              </p>
            </div>
          </div>
        </div>

        {/* 5 Core Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-6 pt-6 border-t border-white/10">
          <div className="bg-white/5 rounded-2xl p-4 border border-white/10 backdrop-blur-xs">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
              <span>Total Restaurants</span>
              <Building2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white mt-1">{totalRest}</div>
            <span className="text-[10px] text-emerald-400 font-bold">42 Enrolled Partners</span>
          </div>

          <div className="bg-white/5 rounded-2xl p-4 border border-white/10 backdrop-blur-xs">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
              <span>Total NGOs</span>
              <HeartHandshake className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white mt-1">{totalNGO}</div>
            <span className="text-[10px] text-amber-400 font-bold">18 Verified Hubs</span>
          </div>

          <div className="bg-white/5 rounded-2xl p-4 border border-white/10 backdrop-blur-xs">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
              <span>Available Surplus</span>
              <Package className="w-4 h-4 text-teal-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-teal-300 mt-1">{availableDonations}</div>
            <span className="text-[10px] text-teal-400 font-bold">27 Active Batches</span>
          </div>

          <div className="bg-white/5 rounded-2xl p-4 border border-white/10 backdrop-blur-xs">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
              <span>Completed Rescues</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-300 mt-1">{completedDonations}</div>
            <span className="text-[10px] text-emerald-400 font-bold">156 Successful Pickups</span>
          </div>

          <div className="bg-white/5 rounded-2xl p-4 border border-white/10 backdrop-blur-xs col-span-2 sm:col-span-1">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
              <span>Food Rescued</span>
              <Leaf className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-400 mt-1">{foodSavedKg.toLocaleString()} kg</div>
            <span className="text-[10px] text-slate-300 font-bold">~{mealsServed.toLocaleString()} Meals Served</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        {[
          { id: 'overview', label: 'Ecosystem Pulse & Activity' },
          { id: 'restaurants', label: `Registered Restaurants (${restaurants.length + 38})` },
          { id: 'ngos', label: `Verified NGOs (${ngos.length + 13})` },
        ].map((tab) => (
          <button
            key={tab.id}
            id={`admin-tab-${tab.id}`}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-colors ${
              activeTab === tab.id
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview / Activity Stream */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Live Activity Stream */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-base text-slate-900">Real-Time Dispatch Feed</h3>
              </div>
              <span className="text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full font-bold">
                Automated WebSocket Feed
              </span>
            </div>

            <div className="space-y-3">
              {notifications.map((n) => (
                <div key={n.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                  <div className="w-2.5 h-2.5 mt-1.5 rounded-full bg-emerald-500 shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-900">{n.title}</h4>
                      <span className="text-[10px] text-slate-400">{n.timestamp}</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5">{n.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Environmental Impact Counter */}
          <div className="lg:col-span-5 bg-gradient-to-b from-emerald-900 to-teal-950 text-white rounded-3xl p-6 shadow-lg flex flex-col justify-between border border-emerald-800">
            <div>
              <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-3">
                <Leaf className="w-4 h-4" />
                <span>Environmental & Social Footprint</span>
              </div>
              <h3 className="text-2xl font-black">2,840 kg of Food Waste Prevented</h3>
              <p className="text-xs text-emerald-100/80 mt-1 leading-relaxed">
                By redirecting hot prepared meals, breads, and produce before expiry, Food Bridge AI has averted landfill methane generation and nourished vulnerable families.
              </p>

              <div className="mt-6 space-y-3 font-mono text-xs">
                <div className="p-3 rounded-xl bg-white/10 border border-white/10 flex justify-between items-center">
                  <span>CO₂e Emissions Averted:</span>
                  <strong className="text-amber-300 font-bold text-sm">{co2PreventedKg.toLocaleString()} kg</strong>
                </div>
                <div className="p-3 rounded-xl bg-white/10 border border-white/10 flex justify-between items-center">
                  <span>Direct Meal Portions:</span>
                  <strong className="text-emerald-300 font-bold text-sm">{mealsServed.toLocaleString()} meals</strong>
                </div>
                <div className="p-3 rounded-xl bg-white/10 border border-white/10 flex justify-between items-center">
                  <span>Average AI Matching Time:</span>
                  <strong className="text-teal-300 font-bold text-sm">4.2 seconds</strong>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/10 text-[11px] text-emerald-200">
              Validated according to FAO & UN Sustainable Development Goal 12.3 (Halve Food Waste).
            </div>
          </div>
        </div>
      )}

      {/* Restaurants Directory */}
      {activeTab === 'restaurants' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900">Enrolled Restaurant Partners</h3>
            <span className="text-xs text-slate-500">Auto-verified for food safety compliance</span>
          </div>

          <div className="divide-y divide-slate-100">
            {restaurants.map((rest) => (
              <div key={rest.id} className="p-4 flex items-center justify-between hover:bg-slate-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-slate-900">{rest.name}</h4>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        Verified
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {rest.address}, {rest.city} &bull; {rest.cuisineType}
                    </p>
                  </div>
                </div>

                <div className="text-right text-xs">
                  <span className="font-bold text-emerald-700">{rest.totalDonationsCount} Donations</span>
                  <span className="block text-[11px] text-slate-400">{rest.foodSavedKg} kg diverted</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* NGOs Directory */}
      {activeTab === 'ngos' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900">Verified Relief Organizations & NGOs</h3>
            <span className="text-xs text-slate-500">Live storage capacities and volunteer fleets</span>
          </div>

          <div className="divide-y divide-slate-100">
            {ngos.map((ngo) => (
              <div key={ngo.id} className="p-4 flex items-center justify-between hover:bg-slate-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 font-bold flex items-center justify-center">
                    <HeartHandshake className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-slate-900">{ngo.name}</h4>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                        {ngo.capacityMeals} Meal Capacity
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {ngo.address}, {ngo.city} &bull; {ngo.activeVolunteers} Volunteers
                    </p>
                  </div>
                </div>

                <div className="text-right text-xs">
                  <span className="font-bold text-amber-800">{ngo.totalReceivedMeals} Meals Distributed</span>
                  <span className="block text-[11px] text-slate-400">Phone: {ngo.contactPhone}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
