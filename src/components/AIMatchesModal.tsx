import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  HeartHandshake,
  MapPin,
  Clock,
  CheckCircle2,
  Phone,
  ShieldCheck,
  TrendingUp,
  Award,
  ChevronRight,
  Info,
  Loader2,
  Users,
} from 'lucide-react';
import { DonationItem, AIMatchScore, NGOProfile } from '../types';

interface AIMatchesModalProps {
  isOpen: boolean;
  onClose: () => void;
  donation: DonationItem | null;
  onAcceptByNGO?: (donationId: string, ngo: NGOProfile) => void;
  currentNgo?: NGOProfile | null;
}

export const AIMatchesModal: React.FC<AIMatchesModalProps> = ({
  isOpen,
  onClose,
  donation,
  onAcceptByNGO,
  currentNgo,
}) => {
  const [matches, setMatches] = useState<AIMatchScore[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMatch, setSelectedMatch] = useState<AIMatchScore | null>(null);

  useEffect(() => {
    if (isOpen && donation) {
      setLoading(true);
      fetch(`/api/donations/${donation.id}/matches`)
        .then((res) => res.json())
        .then((data) => {
          if (data.matches) {
            setMatches(data.matches);
            setSelectedMatch(data.matches[0] || null);
          }
        })
        .catch((err) => console.error('Error loading AI matches:', err))
        .finally(() => setLoading(false));
    }
  }, [isOpen, donation]);

  if (!isOpen || !donation) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold">AI Matching Engine Analysis</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 uppercase tracking-wider">
                  Live Dispatch
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Evaluating candidate NGOs for "{donation.foodName}" ({donation.quantityMeals} meals)
              </p>
            </div>
          </div>
          <button
            id="close-ai-matches-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Algorithm Formula Banner */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-2.5 flex flex-wrap items-center justify-between text-xs gap-2">
          <div className="flex items-center gap-2 text-slate-600 font-medium">
            <Info className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              <strong>Formula:</strong> 40% Distance + 30% Capacity + 20% Urgency + 10% Food Category Match
            </span>
          </div>
          <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100/70 px-2.5 py-0.5 rounded-full">
            Optimal Match Recommendation Powered by Gemini AI
          </span>
        </div>

        {/* Content Body */}
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center text-slate-500 gap-3">
            <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
            <p className="text-sm font-medium">Computing geospatial distance & AI matching compatibility...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 flex-1 overflow-hidden">
            {/* Left: Ranked NGO Candidate List */}
            <div className="md:col-span-5 border-r border-slate-200 overflow-y-auto p-4 space-y-2.5 bg-slate-50/50 max-h-[60vh] md:max-h-none">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-1">
                Ranked Compatible NGOs ({matches.length})
              </p>

              {matches.map((match, idx) => {
                const isSelected = selectedMatch?.ngoId === match.ngoId;
                const isTop = idx === 0;

                return (
                  <div
                    key={match.ngoId}
                    id={`match-card-${match.ngoId}`}
                    onClick={() => setSelectedMatch(match)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer relative ${
                      isSelected
                        ? 'bg-white border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/80 shadow-2xs'
                    }`}
                  >
                    {isTop && (
                      <span className="absolute -top-2.5 right-3 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                        <Award className="w-3 h-3" /> Top AI Recommendation
                      </span>
                    )}

                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900">{match.ngoName}</h4>
                        <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{match.ngoAddress}</span>
                        </p>
                      </div>

                      {/* Match Score Badge */}
                      <div className="text-right shrink-0">
                        <div
                          className={`text-base sm:text-lg font-extrabold ${
                            match.overallScore >= 90
                              ? 'text-emerald-600'
                              : match.overallScore >= 75
                              ? 'text-teal-600'
                              : 'text-amber-600'
                          }`}
                        >
                          {match.overallScore}%
                        </div>
                        <span className="text-[10px] text-slate-400 block -mt-1 font-medium">Match</span>
                      </div>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-emerald-600" />
                        <strong>{match.distanceKm} km</strong> away
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-500" />
                        ETA: <strong>~{match.estimatedPickupMinutes} mins</strong>
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3 text-indigo-500" />
                        Cap: <strong>{match.ngoCapacity}</strong>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right: Selected Match Breakdown */}
            {selectedMatch ? (
              <div className="md:col-span-7 p-5 sm:p-6 overflow-y-auto space-y-4">
                <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900">{selectedMatch.ngoName}</h3>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Verified NGO
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{selectedMatch.ngoAddress}, {selectedMatch.ngoCity}</p>
                  </div>

                  <div className="text-right">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200">
                      <Sparkles className="w-4 h-4 text-emerald-600" />
                      <span className="text-lg font-black">{selectedMatch.overallScore}%</span>
                      <span className="text-xs font-semibold">AI Match Score</span>
                    </div>
                  </div>
                </div>

                {/* AI Executive Reasoning Narrative */}
                <div className="p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-200/80 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span>AI Engine Recommendation Context</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed italic">
                    "{selectedMatch.aiExplanation}"
                  </p>
                </div>

                {/* Score Breakdown Radar Bars */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Scoring Dimensions Breakdown
                  </h4>

                  {/* 1. Distance */}
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium text-slate-700">Geospatial Distance (40% Weight)</span>
                      <span className="font-bold text-slate-900">
                        {selectedMatch.distanceScore}% ({selectedMatch.distanceKm} km)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ width: `${selectedMatch.distanceScore}%` }}
                      />
                    </div>
                  </div>

                  {/* 2. Quantity Match */}
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium text-slate-700">Capacity & Quantity Fit (30% Weight)</span>
                      <span className="font-bold text-slate-900">
                        {selectedMatch.quantityScore}% ({donation.quantityMeals} of {selectedMatch.ngoCapacity} cap)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-teal-500 rounded-full"
                        style={{ width: `${selectedMatch.quantityScore}%` }}
                      />
                    </div>
                  </div>

                  {/* 3. Urgency Match */}
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium text-slate-700">Urgency & Fleet Dispatch (20% Weight)</span>
                      <span className="font-bold text-slate-900">
                        {selectedMatch.urgencyScore}% (ETA ~{selectedMatch.estimatedPickupMinutes}m)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-500 rounded-full"
                        style={{ width: `${selectedMatch.urgencyScore}%` }}
                      />
                    </div>
                  </div>

                  {/* 4. Dietary Preference */}
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium text-slate-700">Food Type & Preference (10% Weight)</span>
                      <span className="font-bold text-slate-900">{selectedMatch.preferenceScore}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-500 rounded-full"
                        style={{ width: `${selectedMatch.preferenceScore}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Match Reasons Checklist */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <h4 className="text-xs font-bold text-slate-800 mb-2">Key Match Factors:</h4>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    {selectedMatch.matchReasons.map((reason, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Direct Action */}
                <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>Contact: {selectedMatch.contactPhone}</span>
                  </div>

                  {onAcceptByNGO && currentNgo && donation.status === 'available' && (
                    <button
                      id="accept-donation-from-matches-btn"
                      onClick={() => {
                        onAcceptByNGO(donation.id, currentNgo);
                        onClose();
                      }}
                      className="px-4 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
                    >
                      <HeartHandshake className="w-4 h-4" />
                      <span>Accept Donation as {currentNgo.name}</span>
                    </button>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
};
