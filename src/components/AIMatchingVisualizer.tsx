import React, { useState } from 'react';
import {
  SlidersHorizontal,
  Sparkles,
  Calculator,
  Award,
  Zap,
  MapPin,
  Package,
  Clock,
  HeartHandshake,
  TrendingUp,
  Brain,
  Code2,
  CheckCircle2,
} from 'lucide-react';
import { DonationItem, NGOProfile } from '../types';

interface AIMatchingVisualizerProps {
  donations: DonationItem[];
  ngos: NGOProfile[];
}

export const AIMatchingVisualizer: React.FC<AIMatchingVisualizerProps> = ({
  donations,
  ngos,
}) => {
  // Interactive Simulation Sandbox State
  const [simDistance, setSimDistance] = useState<number>(1.4);
  const [simQuantity, setSimQuantity] = useState<number>(30);
  const [simNgoCapacity, setSimNgoCapacity] = useState<number>(45);
  const [simUrgency, setSimUrgency] = useState<'urgent' | 'moderate' | 'flexible'>('urgent');
  const [simCategoryMatch, setSimCategoryMatch] = useState<boolean>(true);

  // 1. Distance score calculation (0 - 100)
  const distanceScore = Math.max(0, Math.min(100, Math.round(100 - (simDistance / 10) * 100)));

  // 2. Quantity fit score (0 - 100)
  const ratio = simQuantity / simNgoCapacity;
  let quantityScore = 85;
  if (ratio <= 1.0) {
    quantityScore = Math.round(75 + ratio * 25);
  } else {
    quantityScore = Math.max(30, Math.round(70 - (ratio - 1.0) * 50));
  }

  // 3. Urgency score (0 - 100)
  const urgencyScore = simUrgency === 'urgent' ? 100 : simUrgency === 'moderate' ? 80 : 60;

  // 4. Preference score (0 - 100)
  const preferenceScore = simCategoryMatch ? 95 : 50;

  // Weighted sum formula
  const weightedDistance = 0.4 * distanceScore;
  const weightedQuantity = 0.3 * quantityScore;
  const weightedUrgency = 0.2 * urgencyScore;
  const weightedPreference = 0.1 * preferenceScore;

  const totalMatchScore = Math.min(99, Math.round(weightedDistance + weightedQuantity + weightedUrgency + weightedPreference));

  return (
    <div className="space-y-6">
      {/* Title & Introduction */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-emerald-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400 shrink-0">
            <Brain className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight">AI Matching Engine & Dispatch Intelligence</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                Multi-Factor Optimization
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Food Bridge AI uses a multi-objective scoring formula and Gemini API reasoning to pair surplus food with the best nearby NGO in under 5 seconds.
            </p>
          </div>
        </div>

        {/* Formula Display Banner */}
        <div className="mt-6 pt-5 border-t border-white/10 grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <span className="text-emerald-300 font-bold block text-sm">40% Distance Score</span>
            <span className="text-[11px] text-slate-300">Minimizes food spoilage & transit times</span>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <span className="text-teal-300 font-bold block text-sm">30% Quantity Match</span>
            <span className="text-[11px] text-slate-300">Matches batch size with NGO storage capacity</span>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <span className="text-amber-300 font-bold block text-sm">20% Urgency Factor</span>
            <span className="text-[11px] text-slate-300">Prioritizes expiring meals to active volunteer fleets</span>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <span className="text-indigo-300 font-bold block text-sm">10% Food Preference</span>
            <span className="text-[11px] text-slate-300">Aligns cooked, produce, or bakery categories</span>
          </div>
        </div>
      </div>

      {/* Interactive Simulation Playground */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls Sandbox */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5 text-emerald-600" />
              <h2 className="text-base font-bold text-slate-900">Interactive Algorithm Simulator</h2>
            </div>
            <span className="text-xs text-slate-400 font-semibold">Real-Time Reactive Calculator</span>
          </div>

          {/* Slider 1: Distance */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="font-bold text-slate-700 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                Geographic Distance (km)
              </span>
              <span className="font-black text-slate-900">{simDistance} km &rarr; Subscore: {distanceScore} pts</span>
            </div>
            <input
              type="range"
              min="0.2"
              max="12.0"
              step="0.1"
              value={simDistance}
              onChange={(e) => setSimDistance(Number(e.target.value))}
              className="w-full accent-emerald-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>0.2 km (Immediate vicinity)</span>
              <span>12.0 km (City perimeter)</span>
            </div>
          </div>

          {/* Slider 2: Quantity vs NGO Capacity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-slate-700">Surplus Portions</span>
                <span className="font-black text-slate-900">{simQuantity} meals</span>
              </div>
              <input
                type="range"
                min="5"
                max="100"
                step="5"
                value={simQuantity}
                onChange={(e) => setSimQuantity(Number(e.target.value))}
                className="w-full accent-teal-600"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-slate-700">NGO Capacity</span>
                <span className="font-black text-slate-900">{simNgoCapacity} meals</span>
              </div>
              <input
                type="range"
                min="10"
                max="120"
                step="5"
                value={simNgoCapacity}
                onChange={(e) => setSimNgoCapacity(Number(e.target.value))}
                className="w-full accent-teal-600"
              />
            </div>
          </div>

          {/* Controls: Urgency & Dietary Match */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Surplus Urgency Rating</label>
              <div className="grid grid-cols-3 gap-1.5 text-xs">
                {(['urgent', 'moderate', 'flexible'] as const).map((urg) => (
                  <button
                    key={urg}
                    type="button"
                    onClick={() => setSimUrgency(urg)}
                    className={`py-1.5 rounded-lg font-bold capitalize transition-colors border ${
                      simUrgency === urg
                        ? 'bg-amber-500 text-white border-amber-600'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {urg}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Dietary Compatibility</label>
              <button
                type="button"
                onClick={() => setSimCategoryMatch(!simCategoryMatch)}
                className={`w-full py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                  simCategoryMatch
                    ? 'bg-indigo-50 text-indigo-800 border-indigo-300'
                    : 'bg-slate-50 text-slate-500 border-slate-200'
                }`}
              >
                {simCategoryMatch ? '✓ Matching Category Preference' : '✗ General Food Handling Only'}
              </button>
            </div>
          </div>
        </div>

        {/* Live Computed Output Card */}
        <div className="lg:col-span-5 bg-gradient-to-b from-slate-900 to-slate-950 rounded-3xl p-6 text-white shadow-xl flex flex-col justify-between border border-slate-800">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Live AI Match Result
              </span>
              <span className="text-[10px] text-slate-400">Algorithmic + Gemini</span>
            </div>

            {/* Big Score Display */}
            <div className="my-6 text-center">
              <div className="inline-block relative">
                <div
                  className={`text-6xl sm:text-7xl font-black tracking-tight ${
                    totalMatchScore >= 90
                      ? 'text-emerald-400'
                      : totalMatchScore >= 75
                      ? 'text-teal-300'
                      : 'text-amber-400'
                  }`}
                >
                  {totalMatchScore}%
                </div>
                <div className="text-xs uppercase tracking-widest font-bold text-slate-400 mt-1">
                  Compatibility Score
                </div>
              </div>
            </div>

            {/* Formula Math Breakdown */}
            <div className="space-y-2 text-xs bg-white/5 rounded-2xl p-4 border border-white/10 font-mono">
              <div className="flex justify-between text-slate-300">
                <span>0.40 &times; Distance ({distanceScore} pts)</span>
                <span className="font-bold text-emerald-400">+{weightedDistance.toFixed(1)}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>0.30 &times; Quantity ({quantityScore} pts)</span>
                <span className="font-bold text-teal-400">+{weightedQuantity.toFixed(1)}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>0.20 &times; Urgency ({urgencyScore} pts)</span>
                <span className="font-bold text-amber-400">+{weightedUrgency.toFixed(1)}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>0.10 &times; Dietary ({preferenceScore} pts)</span>
                <span className="font-bold text-indigo-400">+{weightedPreference.toFixed(1)}</span>
              </div>
              <div className="pt-2 border-t border-white/10 flex justify-between font-bold text-sm text-white">
                <span>Total Computed Match</span>
                <span className="text-emerald-400 font-black">{totalMatchScore}%</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>High precision scoring prevents volunteer trip rejections and optimizes zero-waste pickup timing.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
