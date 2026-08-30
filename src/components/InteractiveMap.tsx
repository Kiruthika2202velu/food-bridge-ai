import React, { useState } from 'react';
import {
  MapPin,
  Building2,
  HeartHandshake,
  Navigation,
  Sparkles,
  Layers,
  Clock,
  Radio,
} from 'lucide-react';
import { DonationItem, NGOProfile, RestaurantProfile } from '../types';

interface InteractiveMapProps {
  restaurants: RestaurantProfile[];
  ngos: NGOProfile[];
  donations: DonationItem[];
  selectedDonation?: DonationItem | null;
  onSelectDonation?: (donation: DonationItem) => void;
  activeNgo?: NGOProfile | null;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  restaurants,
  ngos,
  donations,
  selectedDonation,
  onSelectDonation,
  activeNgo,
}) => {
  const [hoveredPoint, setHoveredPoint] = useState<any | null>(null);

  // Map coordinates projection to SVG viewBox (0, 0, 800, 500)
  // Coimbatore bounding box: Lat 10.98 to 11.04, Lng 76.92 to 77.03
  const minLat = 10.985;
  const maxLat = 11.035;
  const minLng = 76.935;
  const maxLng = 77.025;

  const project = (lat: number, lng: number) => {
    const x = ((lng - minLng) / (maxLng - minLng)) * 700 + 50;
    const y = 450 - ((lat - minLat) / (maxLat - minLat)) * 400;
    return { x: Math.max(40, Math.min(760, x)), y: Math.max(40, Math.min(460, y)) };
  };

  const activeDonations = donations.filter((d) => d.status === 'available' || d.status === 'reserved');

  return (
    <div className="bg-slate-900 rounded-2xl p-4 text-white shadow-xl border border-slate-800 relative overflow-hidden">
      {/* Map Header */}
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          <span className="font-bold text-sm text-slate-100">Live Geospatial Rescue Map</span>
          <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-medium">
            Coimbatore Metro Grid
          </span>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-[11px] text-slate-300">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-xs shadow-amber-400" />
            <span>Restaurants (Surplus)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-xs shadow-emerald-400" />
            <span>NGO Relief Centers</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-0.5 bg-dashed border-t-2 border-dashed border-teal-400" />
            <span>AI Match Route</span>
          </div>
        </div>
      </div>

      {/* SVG Canvas Map */}
      <div className="relative w-full h-80 sm:h-96 rounded-xl bg-slate-950/70 border border-slate-800/80 overflow-hidden">
        {/* Background Grid Lines */}
        <svg className="w-full h-full" viewBox="0 0 800 500">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(51, 65, 85, 0.25)" strokeWidth="1" />
            </pattern>
            <radialGradient id="radar-gradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(16, 185, 129, 0.15)" />
              <stop offset="100%" stopColor="rgba(16, 185, 129, 0)" />
            </radialGradient>
          </defs>

          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* City Landmark reference tracks */}
          <path
            d="M 120 80 Q 280 220 700 380"
            fill="none"
            stroke="rgba(71, 85, 105, 0.4)"
            strokeWidth="3"
            strokeDasharray="6 4"
          />
          <text x="130" y="70" fill="rgba(148, 163, 184, 0.5)" fontSize="10" fontWeight="bold">
            Avinashi Highway Road
          </text>
          <text x="600" y="440" fill="rgba(148, 163, 184, 0.5)" fontSize="10" fontWeight="bold">
            Trichy Road Corridor
          </text>

          {/* Radar circle around active NGO if present */}
          {activeNgo && (
            (() => {
              const pt = project(activeNgo.lat, activeNgo.lng);
              return (
                <g>
                  <circle cx={pt.x} cy={pt.y} r="120" fill="url(#radar-gradient)" />
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="120"
                    fill="none"
                    stroke="rgba(16, 185, 129, 0.3)"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                  />
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="60"
                    fill="none"
                    stroke="rgba(16, 185, 129, 0.2)"
                    strokeWidth="1"
                  />
                </g>
              );
            })()
          )}

          {/* Connection Lines from selected / active donations to NGOs */}
          {activeDonations.map((don) => {
            const rPt = project(don.lat, don.lng);
            // Match with top NGO or accepted NGO
            const targetNgo = don.acceptedByNgoId
              ? ngos.find((n) => n.id === don.acceptedByNgoId)
              : activeNgo || ngos[0];

            if (!targetNgo) return null;
            const nPt = project(targetNgo.lat, targetNgo.lng);
            const isSelected = selectedDonation?.id === don.id;

            return (
              <g key={`route-${don.id}`}>
                <line
                  x1={rPt.x}
                  y1={rPt.y}
                  x2={nPt.x}
                  y2={nPt.y}
                  stroke={isSelected ? '#10b981' : 'rgba(45, 212, 191, 0.35)'}
                  strokeWidth={isSelected ? '2.5' : '1.5'}
                  strokeDasharray={isSelected ? 'none' : '4 3'}
                />
                {isSelected && (
                  <circle cx={(rPt.x + nPt.x) / 2} cy={(rPt.y + nPt.y) / 2} r="4" fill="#10b981">
                    <animate attributeName="opacity" values="0.4;1;0.4" dur="1.5s" repeatCount="indefinite" />
                  </circle>
                )}
              </g>
            );
          })}

          {/* NGO Points */}
          {ngos.map((ngo) => {
            const pt = project(ngo.lat, ngo.lng);
            const isActive = activeNgo?.id === ngo.id;

            return (
              <g
                key={ngo.id}
                transform={`translate(${pt.x}, ${pt.y})`}
                onMouseEnter={() => setHoveredPoint({ ...ngo, type: 'ngo' })}
                onMouseLeave={() => setHoveredPoint(null)}
                className="cursor-pointer group"
              >
                {/* Glow ring */}
                <circle
                  r={isActive ? '18' : '12'}
                  fill="rgba(16, 185, 129, 0.2)"
                  className="animate-pulse"
                />
                <circle r={isActive ? '8' : '6'} fill="#10b981" stroke="#ffffff" strokeWidth="2" />
                <text
                  y="20"
                  textAnchor="middle"
                  fill="#6ee7b7"
                  fontSize="10"
                  fontWeight="bold"
                  className="pointer-events-none drop-shadow-md"
                >
                  {ngo.name.split(' ')[0]}
                </text>
              </g>
            );
          })}

          {/* Restaurant / Donation Points */}
          {restaurants.map((rest) => {
            const pt = project(rest.lat, rest.lng);
            const hasDonation = activeDonations.some((d) => d.restaurantId === rest.id);
            const donation = activeDonations.find((d) => d.restaurantId === rest.id);
            const isSelected = selectedDonation?.restaurantId === rest.id;

            return (
              <g
                key={rest.id}
                transform={`translate(${pt.x}, ${pt.y})`}
                onClick={() => donation && onSelectDonation && onSelectDonation(donation)}
                onMouseEnter={() => setHoveredPoint({ ...rest, type: 'restaurant', donation })}
                onMouseLeave={() => setHoveredPoint(null)}
                className="cursor-pointer group"
              >
                {hasDonation && (
                  <circle
                    r={isSelected ? '24' : '16'}
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="1.5"
                    opacity="0.7"
                  >
                    <animate
                      attributeName="r"
                      values="10;26;10"
                      dur="2s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      values="0.9;0.1;0.9"
                      dur="2s"
                      repeatCount="indefinite"
                    />
                  </circle>
                )}
                <circle
                  r={isSelected ? '9' : '7'}
                  fill="#f59e0b"
                  stroke="#ffffff"
                  strokeWidth="2"
                />
                <text
                  y="-12"
                  textAnchor="middle"
                  fill="#fde68a"
                  fontSize="10"
                  fontWeight="bold"
                  className="pointer-events-none drop-shadow-md"
                >
                  {rest.name.split(' ')[0]}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hovered Popup Tooltip */}
        {hoveredPoint && (
          <div className="absolute bottom-3 left-3 bg-slate-900/95 backdrop-blur-md p-3 rounded-xl border border-slate-700 shadow-2xl text-xs max-w-xs animate-in fade-in duration-100 z-10">
            {hoveredPoint.type === 'restaurant' ? (
              <div>
                <div className="flex items-center gap-1.5 text-amber-400 font-bold mb-0.5">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>{hoveredPoint.name}</span>
                </div>
                <p className="text-[11px] text-slate-400">{hoveredPoint.address}</p>
                {hoveredPoint.donation && (
                  <div className="mt-2 pt-2 border-t border-slate-800 text-emerald-300 font-medium">
                    <span>🍱 Surplus: <strong>{hoveredPoint.donation.foodName}</strong></span>
                    <div className="flex items-center justify-between mt-1 text-[10px] text-slate-300">
                      <span>{hoveredPoint.donation.quantityMeals} Meals</span>
                      <span className="text-amber-300">Expires: {hoveredPoint.donation.expiryTime}</span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold mb-0.5">
                  <HeartHandshake className="w-3.5 h-3.5" />
                  <span>{hoveredPoint.name}</span>
                </div>
                <p className="text-[11px] text-slate-400">{hoveredPoint.address}</p>
                <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-300">
                  <span>Capacity: {hoveredPoint.capacityMeals} meals</span>
                  <span>Volunteers: {hoveredPoint.activeVolunteers}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
