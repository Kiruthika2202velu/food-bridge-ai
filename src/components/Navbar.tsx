import React from 'react';
import {
  Sparkles,
  Building2,
  HeartHandshake,
  ShieldCheck,
  Bell,
  Layers,
  PlusCircle,
  Radio,
  CheckCircle2,
  ChevronDown,
  LogOut,
  SlidersHorizontal,
  Code2,
} from 'lucide-react';
import { User, UserRole, ActivityNotification } from '../types';
import { Map as MapIcon } from 'lucide-react';

interface NavbarProps {
  currentUser: User;
  onSwitchUser: (user: User) => void;
  allUsers: User[];
  onOpenNewDonation: () => void;
  onOpenDeploymentGuide: () => void;
  onOpenAIMatchingEngine: () => void;
  activeView: 'dashboard' | 'matching_engine' | 'map' | 'admin';
  setActiveView: (view: 'dashboard' | 'matching_engine' | 'map' | 'admin') => void;
  notifications: ActivityNotification[];
  availableDonationsCount: number;
  onOpenAuthModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onSwitchUser,
  allUsers,
  onOpenNewDonation,
  onOpenDeploymentGuide,
  onOpenAIMatchingEngine,
  activeView,
  setActiveView,
  notifications,
  availableDonationsCount,
  onOpenAuthModal,
}) => {
  const [showUserMenu, setShowUserMenu] = React.useState(false);
  const [showNotifMenu, setShowNotifMenu] = React.useState(false);

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'restaurant':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <Building2 className="w-3 h-3" />
            Restaurant
          </span>
        );
      case 'ngo':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
            <HeartHandshake className="w-3 h-3" />
            NGO / Charity
          </span>
        );
      case 'admin':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800 border border-indigo-200">
            <ShieldCheck className="w-3 h-3" />
            System Admin
          </span>
        );
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-6">
            <div
              id="brand-logo-btn"
              onClick={() => setActiveView('dashboard')}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5 text-amber-200 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-lg text-slate-900 tracking-tight">Food Bridge AI</span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                    <Radio className="w-2.5 h-2.5 text-emerald-600 animate-ping" />
                    Live Portal
                  </span>
                </div>
                <p className="text-xs text-slate-500 hidden sm:block">Real-Time Food Donation & AI Matching Engine</p>
              </div>
            </div>

            {/* Navigation Tabs */}
            <nav className="hidden md:flex items-center gap-1 pl-4 border-l border-slate-200">
              <button
                id="nav-dashboard-tab"
                onClick={() => setActiveView('dashboard')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  activeView === 'dashboard'
                    ? 'bg-emerald-50 text-emerald-700 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {currentUser.role === 'restaurant'
                  ? 'Restaurant Portal'
                  : currentUser.role === 'ngo'
                  ? 'NGO Rescue Hub'
                  : 'Dashboard'}
              </button>

              <button
                id="nav-matching-engine-tab"
                onClick={() => setActiveView('matching_engine')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors ${
                  activeView === 'matching_engine'
                    ? 'bg-emerald-50 text-emerald-700 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
                AI Match Visualizer
              </button>

              <button
                id="nav-map-tab"
                onClick={() => setActiveView('map')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors ${
                  activeView === 'map'
                    ? 'bg-emerald-50 text-emerald-700 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <MapIcon className="w-4 h-4 text-emerald-600" />
                Live City Radar
              </button>

              <button
                id="nav-admin-tab"
                onClick={() => setActiveView('admin')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors ${
                  activeView === 'admin'
                    ? 'bg-emerald-50 text-emerald-700 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Layers className="w-4 h-4 text-indigo-600" />
                Ecosystem Metrics
              </button>
            </nav>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-3">
            {/* Deployment & Architecture Guide Button */}
            <button
              id="open-deployment-guide-btn"
              onClick={onOpenDeploymentGuide}
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors"
              title="View full FastAPI + PostgreSQL + React Vercel + Render Deployment Blueprint"
            >
              <Code2 className="w-3.5 h-3.5 text-slate-500" />
              Deployment Blueprint
            </button>

            {/* Quick Post Button for Restaurant */}
            {currentUser.role === 'restaurant' && (
              <button
                id="navbar-post-food-btn"
                onClick={onOpenNewDonation}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-all hover:shadow-md"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Post Surplus Food</span>
              </button>
            )}

            {/* Notifications Menu */}
            <div className="relative">
              <button
                id="notifications-toggle-btn"
                onClick={() => {
                  setShowNotifMenu(!showNotifMenu);
                  setShowUserMenu(false);
                }}
                className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 relative transition-colors"
                aria-label="View notifications"
              >
                <Bell className="w-5 h-5" />
                {notifications.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white" />
                )}
              </button>

              {showNotifMenu && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                    <span className="font-semibold text-sm text-slate-900">Live Activity Feed</span>
                    <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-medium">
                      {notifications.length} alerts
                    </span>
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                    {notifications.map((notif) => (
                      <div key={notif.id} className="p-3 hover:bg-slate-50 transition-colors">
                        <div className="flex items-start gap-2.5">
                          <div className="w-2 h-2 mt-1.5 rounded-full bg-emerald-500 shrink-0" />
                          <div className="flex-1">
                            <p className="text-xs font-semibold text-slate-800">{notif.title}</p>
                            <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{notif.message}</p>
                            <span className="text-[10px] text-slate-400 mt-1 block">{notif.timestamp}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* User Role Switcher Dropdown */}
            <div className="relative">
              <button
                id="user-profile-menu-btn"
                onClick={() => {
                  setShowUserMenu(!showUserMenu);
                  setShowNotifMenu(false);
                }}
                className="flex items-center gap-2 p-1.5 rounded-xl border border-slate-200 bg-slate-50/80 hover:bg-slate-100 transition-colors text-left"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-100 border border-emerald-200 text-emerald-800 font-bold text-xs flex items-center justify-center overflow-hidden">
                  {currentUser.avatar ? (
                    <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
                  ) : (
                    currentUser.name.charAt(0)
                  )}
                </div>
                <div className="hidden sm:block pr-1">
                  <div className="text-xs font-bold text-slate-900 truncate max-w-[140px]">{currentUser.name}</div>
                  <div className="text-[11px] text-slate-500 capitalize">{currentUser.role}</div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 pr-0.5" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs text-slate-500">Current Role Profile</p>
                    <p className="text-sm font-bold text-slate-900 truncate">{currentUser.name}</p>
                    <div className="mt-1">{getRoleBadge(currentUser.role)}</div>
                  </div>

                  <div className="px-3 py-2">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 px-2 mb-1.5">
                      Switch Demo Persona
                    </p>
                    <div className="space-y-1">
                      {(allUsers || []).map((u) => (
                        <button
                          key={u.id}
                          id={`switch-user-${u.id}`}
                          onClick={() => {
                            onSwitchUser(u);
                            setShowUserMenu(false);
                          }}
                          className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                            u.id === currentUser.id
                              ? 'bg-emerald-50 text-emerald-800 font-bold'
                              : 'text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          <div className="truncate">
                            <span className="block font-medium">{u.name}</span>
                            <span className="text-[10px] text-slate-400 capitalize">{u.role}</span>
                          </div>
                          {u.id === currentUser.id && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-1 px-3">
                    <button
                      id="navbar-register-new-btn"
                      onClick={() => {
                        setShowUserMenu(false);
                        onOpenAuthModal();
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold text-emerald-700 hover:bg-emerald-50 flex items-center gap-2"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      Register New Restaurant / NGO
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
