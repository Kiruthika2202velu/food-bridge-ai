import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { RestaurantDashboard } from './components/RestaurantDashboard';
import { NGODashboard } from './components/NGODashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { AIMatchingVisualizer } from './components/AIMatchingVisualizer';
import { InteractiveMap } from './components/InteractiveMap';
import { CreateDonationModal } from './components/CreateDonationModal';
import { AIMatchesModal } from './components/AIMatchesModal';
import { DeploymentModal } from './components/DeploymentModal';
import { AuthModal } from './components/AuthModal';
import {
  User,
  DonationItem,
  RestaurantProfile,
  NGOProfile,
  SystemMetrics,
  ActivityNotification,
} from './types';
import {
  Sparkles,
  HeartHandshake,
  Building2,
  ShieldCheck,
  PlusCircle,
} from 'lucide-react';

export default function App() {
  // Application Data States
  const [allUsers, setAllUsers] = useState<User[]>([
    { id: 'u-1', name: 'The Daily Grind (Manager Rahul)', email: 'manager@dailygrind.com', role: 'restaurant', entityId: 'rest-1', avatar: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=150&auto=format&fit=crop&q=80' },
    { id: 'u-2', name: 'Hope Harvest Foundation (Priya S.)', email: 'contact@hopeharvest.org', role: 'ngo', entityId: 'ngo-1', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80' },
    { id: 'u-3', name: 'Food Bridge Admin (System)', email: 'admin@foodbridge.ai', role: 'admin' },
    { id: 'u-4', name: 'Annapoorna Kitchen (Suresh K.)', email: 'suresh@annapoorna.in', role: 'restaurant', entityId: 'rest-2' },
    { id: 'u-5', name: 'FeedAll Youth Initiative (Anand R.)', email: 'hello@feedall.org', role: 'ngo', entityId: 'ngo-2' },
  ]);

  // Current active user / persona (default to restaurant donor)
  const [currentUser, setCurrentUser] = useState<User>({
    id: 'u-1',
    name: 'The Daily Grind (Manager Rahul)',
    email: 'manager@dailygrind.com',
    role: 'restaurant',
    entityId: 'rest-1',
    avatar: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=150&auto=format&fit=crop&q=80',
  });

  const [activeView, setActiveView] = useState<'dashboard' | 'matching_engine' | 'map' | 'admin'>('dashboard');

  const [donations, setDonations] = useState<DonationItem[]>([]);
  const [restaurants, setRestaurants] = useState<RestaurantProfile[]>([]);
  const [ngos, setNgos] = useState<NGOProfile[]>([]);
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [notifications, setNotifications] = useState<ActivityNotification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Modal States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isAIMatchesModalOpen, setIsAIMatchesModalOpen] = useState<boolean>(false);
  const [isDeployModalOpen, setIsDeployModalOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [selectedDonationForMatches, setSelectedDonationForMatches] = useState<DonationItem | null>(null);

  // Initial Data Fetch
  const fetchData = useCallback(async () => {
    try {
      const [donRes, restRes, ngoRes, metRes, notifRes, usersRes] = await Promise.all([
        fetch('/api/donations').then((r) => r.json()),
        fetch('/api/restaurants').then((r) => r.json()),
        fetch('/api/ngos').then((r) => r.json()),
        fetch('/api/metrics').then((r) => r.json()),
        fetch('/api/notifications').then((r) => r.json()),
        fetch('/api/auth/users').then((r) => r.json()),
      ]);

      if (Array.isArray(donRes)) setDonations(donRes);
      else if (donRes?.donations) setDonations(donRes.donations);

      if (Array.isArray(restRes)) setRestaurants(restRes);
      else if (restRes?.restaurants) setRestaurants(restRes.restaurants);

      if (Array.isArray(ngoRes)) setNgos(ngoRes);
      else if (ngoRes?.ngos) setNgos(ngoRes.ngos);

      if (metRes && typeof metRes === 'object') {
        setMetrics(metRes.metrics || metRes);
      }

      if (Array.isArray(notifRes)) setNotifications(notifRes);
      else if (notifRes?.notifications) setNotifications(notifRes.notifications);

      if (Array.isArray(usersRes)) setAllUsers(usersRes);
    } catch (err) {
      console.error('Error fetching Food Bridge AI data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Active Profiles matching currentUser
  const currentRestaurant: RestaurantProfile =
    restaurants.find((r) => r.id === currentUser.entityId || r.userId === currentUser.id) ||
    restaurants[0] || {
      id: 'rest-1',
      userId: 'u-1',
      name: 'The Daily Grind',
      address: '42 DB Road, RS Puram',
      city: 'Coimbatore',
      lat: 11.0088,
      lng: 76.9525,
      contactPhone: '+91 98432 10987',
      cuisineType: 'Multi-Cuisine & Cafe',
      verificationStatus: 'verified',
      totalDonationsCount: 28,
      foodSavedKg: 520,
    };

  const currentNgo: NGOProfile =
    ngos.find((n) => n.id === currentUser.entityId || n.userId === currentUser.id) ||
    ngos[0] || {
      id: 'ngo-1',
      userId: 'u-2',
      name: 'Hope Harvest Foundation',
      organizationName: 'Hope Harvest Foundation',
      address: '12 West Venkatasamy Road, RS Puram',
      city: 'Coimbatore',
      lat: 11.0112,
      lng: 76.9498,
      contactPhone: '+91 94888 12345',
      capacityMeals: 50,
      activeVolunteers: 12,
      dietaryPreferences: ['Cooked Meals', 'Bakery & Bread', 'Fresh Produce'],
      verificationStatus: 'verified',
      totalReceivedMeals: 3450,
    };

  // Switch persona handler
  const handleSwitchUser = (user: User) => {
    setCurrentUser(user);
    if (user.role === 'admin') {
      setActiveView('admin');
    } else {
      setActiveView('dashboard');
    }
  };

  // Register new User handler
  const handleUserRegistered = (newUser: User) => {
    setAllUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    fetchData();
  };

  // Accept Donation by NGO
  const handleAcceptDonation = async (donationId: string) => {
    if (!currentNgo) return;
    try {
      const res = await fetch(`/api/donations/${donationId}/accept`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ngoId: currentNgo.id,
          ngoName: currentNgo.organizationName || currentNgo.name,
        }),
      });
      const data = await res.json();
      if (data.donation) {
        setDonations((prev) =>
          prev.map((d) => (d.id === donationId ? { ...data.donation, pickupStage: 'accepted' } : d))
        );
        fetchData();
      }
    } catch (err) {
      console.error('Failed to accept donation:', err);
    }
  };

  // Update pickup stage (en_route -> arrived/verified -> completed)
  const handleUpdatePickupStage = async (
    donationId: string,
    stage: 'accepted' | 'en_route' | 'arrived' | 'completed',
    pin?: string
  ) => {
    try {
      const res = await fetch(`/api/donations/${donationId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: stage === 'completed' ? 'completed' : stage === 'arrived' ? 'picked_up' : 'reserved',
          pickupStage: stage,
          pin,
        }),
      });
      const data = await res.json();
      if (data.donation) {
        setDonations((prev) =>
          prev.map((d) => (d.id === donationId ? { ...data.donation, pickupStage: stage } : d))
        );
        fetchData();
      }
    } catch (err) {
      console.error('Failed to update stage:', err);
    }
  };

  // Cancel donation by Restaurant
  const handleCancelDonation = async (donationId: string) => {
    try {
      const res = await fetch(`/api/donations/${donationId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'cancelled',
        }),
      });
      const data = await res.json();
      if (data.donation) {
        setDonations((prev) =>
          prev.map((d) => (d.id === donationId ? { ...data.donation, status: 'cancelled' } : d))
        );
        fetchData();
      }
    } catch (err) {
      console.error('Failed to cancel donation:', err);
    }
  };

  const handleOpenAIMatches = (donation: DonationItem) => {
    setSelectedDonationForMatches(donation);
    setIsAIMatchesModalOpen(true);
  };

  const availableCount = donations.filter((d) => d.status === 'available').length;

  return (
    <div className="min-h-screen bg-slate-950/2 text-slate-900 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        currentUser={currentUser}
        onSwitchUser={handleSwitchUser}
        allUsers={allUsers}
        onOpenNewDonation={() => setIsCreateModalOpen(true)}
        onOpenDeploymentGuide={() => setIsDeployModalOpen(true)}
        onOpenAIMatchingEngine={() => setActiveView('matching_engine')}
        activeView={activeView}
        setActiveView={setActiveView}
        notifications={notifications}
        availableDonationsCount={availableCount}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
      />

      {/* Main App Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center animate-bounce">
              <Sparkles className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-slate-700">Connecting to Food Bridge AI Ecosystem...</p>
          </div>
        ) : (
          <>
            {/* 1. Dashboard View (Dynamic according to role) */}
            {activeView === 'dashboard' && (
              <>
                {currentUser.role === 'restaurant' && currentRestaurant && (
                  <RestaurantDashboard
                    restaurant={currentRestaurant}
                    donations={donations}
                    onOpenCreateDonation={() => setIsCreateModalOpen(true)}
                    onViewAIMatches={handleOpenAIMatches}
                    onCancelDonation={handleCancelDonation}
                  />
                )}

                {currentUser.role === 'ngo' && currentNgo && (
                  <NGODashboard
                    ngo={currentNgo}
                    donations={donations}
                    restaurants={restaurants}
                    ngos={ngos}
                    onAcceptDonation={handleAcceptDonation}
                    onUpdatePickupStage={handleUpdatePickupStage}
                    onViewAIMatches={handleOpenAIMatches}
                  />
                )}

                {currentUser.role === 'admin' && (
                  <AdminDashboard
                    metrics={metrics}
                    restaurants={restaurants}
                    ngos={ngos}
                    donations={donations}
                    notifications={notifications}
                  />
                )}
              </>
            )}

            {/* 2. Dedicated AI Matching Engine Simulator */}
            {activeView === 'matching_engine' && (
              <AIMatchingVisualizer donations={donations} ngos={ngos} />
            )}

            {/* 3. City Geospatial Map View */}
            {activeView === 'map' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-black text-slate-900 tracking-tight">
                      Live Metropolitan Geospatial Radar
                    </h2>
                    <p className="text-xs text-slate-500">
                      Real-time pins of restaurant surplus posts, NGO relief hubs, and active logistics corridors.
                    </p>
                  </div>
                  {currentUser.role === 'restaurant' && (
                    <button
                      onClick={() => setIsCreateModalOpen(true)}
                      className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-all"
                    >
                      <PlusCircle className="w-4 h-4" />
                      <span>Post Surplus Food</span>
                    </button>
                  )}
                </div>

                <InteractiveMap
                  restaurants={restaurants}
                  ngos={ngos}
                  donations={donations}
                  selectedDonation={selectedDonationForMatches}
                  onSelectDonation={(don) => handleOpenAIMatches(don)}
                  activeNgo={currentNgo}
                />
              </div>
            )}

            {/* 4. Admin Governance View */}
            {activeView === 'admin' && (
              <AdminDashboard
                metrics={metrics}
                restaurants={restaurants}
                ngos={ngos}
                donations={donations}
                notifications={notifications}
              />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white/70 backdrop-blur-xs py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-black text-[10px]">
              FB
            </div>
            <span className="font-bold text-slate-800">Food Bridge AI</span>
            <span>&bull; Real-Time Surplus Food Rescue & Dispatch Platform</span>
          </div>

          <div className="flex items-center gap-4 text-slate-600">
            <button
              onClick={() => setIsDeployModalOpen(true)}
              className="hover:text-emerald-700 font-medium transition-colors"
            >
              Full Deployment Blueprint (FastAPI + Render + Vercel)
            </button>
            <span>&bull;</span>
            <button
              onClick={() => setActiveView('matching_engine')}
              className="hover:text-emerald-700 font-medium transition-colors"
            >
              AI Scoring Formula
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <CreateDonationModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        restaurant={currentRestaurant}
        onDonationCreated={(newDon) => {
          setDonations((prev) => [newDon, ...prev]);
          fetchData();
        }}
      />

      <AIMatchesModal
        isOpen={isAIMatchesModalOpen}
        onClose={() => setIsAIMatchesModalOpen(false)}
        donation={selectedDonationForMatches}
        onAcceptByNGO={(id, ngo) => handleAcceptDonation(id)}
        currentNgo={currentUser.role === 'ngo' ? currentNgo : null}
      />

      <DeploymentModal
        isOpen={isDeployModalOpen}
        onClose={() => setIsDeployModalOpen(false)}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onUserRegistered={handleUserRegistered}
      />
    </div>
  );
}
