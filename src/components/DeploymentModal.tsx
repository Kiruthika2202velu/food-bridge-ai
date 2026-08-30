import React, { useState } from 'react';
import {
  X,
  Code2,
  Server,
  Database,
  Globe,
  Terminal,
  Copy,
  Check,
  Layers,
  ArrowRight,
  ExternalLink,
  Cpu,
  FileCode,
} from 'lucide-react';

interface DeploymentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeploymentModal: React.FC<DeploymentModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'architecture' | 'backend' | 'matching_code' | 'schema' | 'commands'>('architecture');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const fastApiMainPy = `from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import math
import os

app = FastAPI(
    title="Food Bridge AI API",
    description="Real-Time Food Donation Portal & AI Matching Engine Backend",
    version="1.0.0"
)

# CORS Setup for Vercel Frontend
FRONTEND_URL = os.getenv("FRONTEND_URL", "https://food-bridge-ai.vercel.app")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        FRONTEND_URL,
        "https://*.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class DonationCreate(BaseModel):
    restaurant_id: str
    food_name: str
    food_type: str
    quantity: int
    prepared_time: str
    expiry_time: str
    latitude: float
    longitude: float
    urgency: str = "urgent"

@app.get("/")
def read_root():
    return {"message": "Food Bridge AI API is running on Render", "status": "healthy"}

@app.get("/api/donations")
def get_donations():
    # Query PostgreSQL for active surplus food
    return {"status": "success", "donations": []}

@app.post("/api/donations")
def create_donation(donation: DonationCreate):
    # Save donation to PostgreSQL and trigger AI matching engine
    return {"status": "created", "donation": donation}

@app.get("/api/donations/{donation_id}/match")
def match_donation(donation_id: str):
    # Execute AI Matching formula:
    # 40% Distance + 30% Quantity + 20% Urgency + 10% Food Preference
    return {"status": "matched", "top_ngos": []}
`;

  const matchingServicePy = `import math

def calculate_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Haversine formula for distance in kilometers"""
    R = 6371.0
    d_lat = math.radians(lat2 - lat1)
    d_lon = math.radians(lon2 - lon1)
    a = (math.sin(d_lat / 2) ** 2 +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
         math.sin(d_lon / 2) ** 2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return round(R * c, 2)

def compute_ai_match_score(donation, ngo) -> dict:
    """
    AI Matching Formula:
    Score = 0.40 * Distance + 0.30 * Quantity + 0.20 * Urgency + 0.10 * Preference
    """
    dist_km = calculate_distance(donation.lat, donation.lng, ngo.lat, ngo.lng)
    distance_score = max(0, min(100, int(100 - (dist_km / 12) * 100)))

    # Quantity match against capacity
    ratio = donation.quantity / ngo.capacity
    if ratio <= 1.0:
        quantity_score = int(75 + ratio * 25)
    else:
        quantity_score = max(20, int(70 - (ratio - 1.0) * 40))

    urgency_score = 100 if donation.urgency == "urgent" else 80
    pref_score = 100 if donation.food_type in ngo.preferences else 60

    total_score = int(
        0.40 * distance_score +
        0.30 * quantity_score +
        0.20 * urgency_score +
        0.10 * pref_score
    )

    return {
        "ngo_id": ngo.id,
        "ngo_name": ngo.name,
        "distance_km": dist_km,
        "match_score": total_score,
        "recommendation": f"{ngo.name} is a {total_score}% match situated {dist_km}km away."
    }
`;

  const postgresSchemaSql = `-- Food Bridge AI PostgreSQL Schema Migration
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('restaurant', 'ngo', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE restaurants (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    contact_phone VARCHAR(50),
    cuisine_type VARCHAR(100)
);

CREATE TABLE ngos (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    organization_name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    required_food_capacity INT NOT NULL DEFAULT 50,
    active_volunteers INT DEFAULT 5,
    contact_phone VARCHAR(50)
);

CREATE TABLE donations (
    id SERIAL PRIMARY KEY,
    restaurant_id INT REFERENCES restaurants(id) ON DELETE CASCADE,
    food_name VARCHAR(255) NOT NULL,
    food_type VARCHAR(100) NOT NULL,
    quantity_meals INT NOT NULL,
    weight_kg DOUBLE PRECISION NOT NULL,
    prepared_at VARCHAR(50) NOT NULL,
    expiry_time VARCHAR(50) NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    pickup_code VARCHAR(10) NOT NULL,
    status VARCHAR(50) DEFAULT 'available' CHECK (status IN ('available', 'reserved', 'picked_up', 'completed', 'cancelled')),
    accepted_by_ngo_id INT REFERENCES ngos(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-400">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold">Food Bridge AI Deployment Blueprint</h2>
              <p className="text-xs text-slate-300">
                Architecture guide & source code for React (Vercel) + FastAPI & PostgreSQL (Render)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 flex items-center gap-2 overflow-x-auto text-xs py-2">
          {[
            { id: 'architecture', label: '1. Architecture & Flow', icon: Layers },
            { id: 'backend', label: '2. FastAPI main.py', icon: Server },
            { id: 'matching_code', label: '3. AI Matching Model', icon: Cpu },
            { id: 'schema', label: '4. PostgreSQL Schema', icon: Database },
            { id: 'commands', label: '5. Terminal Deployment Guide', icon: Terminal },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-200/70 hover:text-slate-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {activeTab === 'architecture' && (
            <div className="space-y-6">
              {/* Visual Flow diagram */}
              <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 space-y-4">
                <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">
                  Live Deployment Architecture
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <Globe className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                    <strong className="text-sm block">Vercel (Frontend)</strong>
                    <p className="text-xs text-slate-400 mt-1">React + TypeScript + Tailwind CSS</p>
                    <span className="text-[10px] text-emerald-300 font-mono block mt-2">
                      https://food-bridge-ai.vercel.app
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 relative">
                    <Server className="w-6 h-6 text-indigo-400 mx-auto mb-2" />
                    <strong className="text-sm block">Render (FastAPI)</strong>
                    <p className="text-xs text-slate-400 mt-1">Python 3.11 + Uvicorn + AI Engine</p>
                    <span className="text-[10px] text-indigo-300 font-mono block mt-2">
                      https://food-bridge-api.onrender.com
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <Database className="w-6 h-6 text-amber-400 mx-auto mb-2" />
                    <strong className="text-sm block">Render PostgreSQL</strong>
                    <p className="text-xs text-slate-400 mt-1">Managed Relational Database</p>
                    <span className="text-[10px] text-amber-300 font-mono block mt-2">
                      postgresql://user:pass@host/db
                    </span>
                  </div>
                </div>
              </div>

              {/* Step-by-step Summary */}
              <div className="space-y-3 text-xs text-slate-700">
                <h4 className="font-bold text-sm text-slate-900">End-to-End Operational Lifecycle:</h4>
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0">1</span>
                  <div>
                    <strong className="text-slate-900">Restaurant Post:</strong> Restaurant posts surplus meals with preparation timestamp, expiry window, and geocoordinates.
                  </div>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0">2</span>
                  <div>
                    <strong className="text-slate-900">AI Matching Evaluation:</strong> Backend computes real-time compatibility scores for all registered NGOs (Distance 40%, Quantity 30%, Urgency 20%, Dietary 10%).
                  </div>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-amber-600 text-white font-bold text-xs flex items-center justify-center shrink-0">3</span>
                  <div>
                    <strong className="text-slate-900">NGO Acceptance & Handover PIN:</strong> Top compatible NGO accepts donation, dispatches a volunteer driver, and verifies with the 4-digit PIN at the kitchen counter.
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'backend' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 font-mono">backend/app/main.py</span>
                <button
                  onClick={() => copyToClipboard(fastApiMainPy, 'main_py')}
                  className="px-2.5 py-1 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md flex items-center gap-1 transition-colors"
                >
                  {copiedKey === 'main_py' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'main_py' ? 'Copied' : 'Copy Code'}</span>
                </button>
              </div>
              <pre className="p-4 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto max-h-96">
                <code>{fastApiMainPy}</code>
              </pre>
            </div>
          )}

          {activeTab === 'matching_code' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 font-mono">backend/app/services/matching.py</span>
                <button
                  onClick={() => copyToClipboard(matchingServicePy, 'match_py')}
                  className="px-2.5 py-1 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md flex items-center gap-1 transition-colors"
                >
                  {copiedKey === 'match_py' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'match_py' ? 'Copied' : 'Copy Code'}</span>
                </button>
              </div>
              <pre className="p-4 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto max-h-96">
                <code>{matchingServicePy}</code>
              </pre>
            </div>
          )}

          {activeTab === 'schema' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 font-mono">database/schema.sql</span>
                <button
                  onClick={() => copyToClipboard(postgresSchemaSql, 'schema_sql')}
                  className="px-2.5 py-1 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md flex items-center gap-1 transition-colors"
                >
                  {copiedKey === 'schema_sql' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'schema_sql' ? 'Copied' : 'Copy Code'}</span>
                </button>
              </div>
              <pre className="p-4 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto max-h-96">
                <code>{postgresSchemaSql}</code>
              </pre>
            </div>
          )}

          {activeTab === 'commands' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-900 text-slate-100 space-y-3 font-mono">
                <div className="text-emerald-400 font-bold"># 1. Local FastAPI Setup</div>
                <div className="text-slate-300">
                  cd backend<br />
                  python -m venv venv<br />
                  source venv/bin/activate # or .\venv\Scripts\Activate.ps1<br />
                  pip install -r requirements.txt<br />
                  uvicorn app.main:app --reload --port 8000
                </div>

                <div className="text-emerald-400 font-bold pt-2 border-t border-slate-800"># 2. Render Deployment Configuration</div>
                <div className="text-slate-300">
                  Build Command: pip install -r requirements.txt<br />
                  Start Command: uvicorn app.main:app --host 0.0.0.0 --port $PORT<br />
                  Environment Variable: DATABASE_URL = [Your Render PostgreSQL URL]
                </div>

                <div className="text-emerald-400 font-bold pt-2 border-t border-slate-800"># 3. Vercel Frontend Deployment</div>
                <div className="text-slate-300">
                  Root Directory: frontend (or root)<br />
                  Build Command: npm run build<br />
                  Environment Variable: VITE_API_URL = https://food-bridge-api.onrender.com
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
