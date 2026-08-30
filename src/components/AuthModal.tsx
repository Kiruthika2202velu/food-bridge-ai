import React, { useState } from 'react';
import {
  X,
  Building2,
  HeartHandshake,
  ShieldCheck,
  PlusCircle,
  MapPin,
  Phone,
  Mail,
  User as UserIcon,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { User, UserRole } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUserRegistered: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onUserRegistered }) => {
  const [role, setRole] = useState<UserRole>('restaurant');
  const [orgName, setOrgName] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Coimbatore');
  const [cuisineType, setCuisineType] = useState('Multi-Cuisine & Cafe');
  const [capacityMeals, setCapacityMeals] = useState(50);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgName.trim() || !email.trim()) {
      alert('Please fill in organization name and email');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: contactName || orgName,
          organizationName: orgName,
          email,
          role,
          phone: phone || '+91 98432 11223',
          address: address || 'Main City Road, Coimbatore',
          city: city || 'Coimbatore',
          cuisineType,
          capacityMeals: Number(capacityMeals) || 50,
          dietaryPreferences: ['Cooked Meals', 'Bakery & Bread', 'Fresh Produce'],
        }),
      });

      const data = await res.json();
      if (data.success && data.user) {
        onUserRegistered(data.user);
        onClose();
      }
    } catch (err) {
      console.error('Registration failed:', err);
      alert('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-700 to-teal-800 p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Register on Food Bridge AI</h2>
              <p className="text-xs text-emerald-100">Join the Real-Time Food Rescue Network</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Role Selector Tabs */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setRole('restaurant')}
              className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                role === 'restaurant'
                  ? 'border-emerald-600 bg-emerald-50/80 text-emerald-900 shadow-xs'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Building2 className={`w-6 h-6 ${role === 'restaurant' ? 'text-emerald-600' : 'text-slate-400'}`} />
              <div className="text-center">
                <span className="block text-xs font-bold">Restaurant / Donor</span>
                <span className="text-[10px] text-slate-400">Post surplus food</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setRole('ngo')}
              className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                role === 'ngo'
                  ? 'border-amber-600 bg-amber-50/80 text-amber-900 shadow-xs'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <HeartHandshake className={`w-6 h-6 ${role === 'ngo' ? 'text-amber-600' : 'text-slate-400'}`} />
              <div className="text-center">
                <span className="block text-xs font-bold">NGO / Food Bank</span>
                <span className="text-[10px] text-slate-400">Accept & distribute</span>
              </div>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {role === 'restaurant' ? 'Restaurant / Caterer Name *' : 'NGO / Foundation Name *'}
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  placeholder={role === 'restaurant' ? 'e.g. Grand Palace Hotel' : 'e.g. Care & Share Foundation'}
                  className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 outline-hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Contact Person</label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="e.g. Ramesh Kumar"
                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. contact@org.in"
                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 outline-hidden"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">City</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Coimbatore"
                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 outline-hidden"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Street Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. 104 DB Road, RS Puram"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 outline-hidden"
              />
            </div>

            {role === 'restaurant' ? (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Cuisine / Kitchen Type</label>
                <input
                  type="text"
                  value={cuisineType}
                  onChange={(e) => setCuisineType(e.target.value)}
                  placeholder="e.g. South Indian & Traditional Meals"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 outline-hidden"
                />
              </div>
            ) : (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Meal Absorption Capacity (Per Batch)</label>
                <input
                  type="number"
                  min="10"
                  max="1000"
                  value={capacityMeals}
                  onChange={(e) => setCapacityMeals(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 outline-hidden"
                />
              </div>
            )}

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/20 disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{loading ? 'Registering...' : 'Complete Registration'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
