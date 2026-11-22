'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShieldCheck, Database, ToggleLeft, ToggleRight, Sparkles, AlertCircle, Users, Camera, Lightbulb, Heart, Check } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { Material } from '@/lib/types';

export default function AdminPage() {
  const { user, loginAsAdmin } = useAuth();
  const [metrics, setMetrics] = useState({
    totalUsers: 2,
    totalScans: 8,
    totalIdeas: 5,
    totalPledges: 11,
    totalCo2SavedKg: 1250,
  });
  const [materials, setMaterials] = useState<Material[]>([]);
  const [demoMode, setDemoMode] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/metrics');
      if (!res.ok) throw new Error('Failed to load admin metrics');
      const data = await res.json();
      setMetrics(data.metrics);
      setMaterials(data.materials);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const isAdmin = user?.role === 'admin';

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-14">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-forest-100 pb-5">
        <div>
          <div className="inline-flex items-center space-x-1.5 bg-forest-100 text-forest-800 text-xs font-bold px-3 py-1 rounded-full mb-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Module 7: Admin & Material Data Control</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-forest-950">Platform Administration</h1>
          <p className="text-xs sm:text-sm text-stone-600">
            Control waste catalog, hero materials, cached demo results, and platform metrics.
          </p>
        </div>

        {!isAdmin && (
          <button
            onClick={loginAsAdmin}
            className="px-4 py-2 bg-forest-700 hover:bg-forest-800 text-white rounded-xl text-xs font-bold shadow-xs min-h-[44px]"
          >
            Switch to Admin Role
          </button>
        )}
      </div>

      {/* Non-Admin Warning Banner */}
      {!isAdmin && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between text-xs text-amber-800">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-amber-600" />
            <span>
              You are currently browsing as <strong>{user?.displayName || 'Guest'}</strong> (Role: {user?.role || 'None'}).
              Click "Switch to Admin Role" to enable administrative editing.
            </span>
          </div>
        </div>
      )}

      {/* Metric Cards (M7-F4 Requirement) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-forest-100 shadow-xs">
          <div className="flex items-center space-x-2 text-stone-500 text-xs mb-1">
            <Users className="w-4 h-4" />
            <span>Total Makers</span>
          </div>
          <span className="text-2xl font-black text-forest-950">{metrics.totalUsers}</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-forest-100 shadow-xs">
          <div className="flex items-center space-x-2 text-stone-500 text-xs mb-1">
            <Camera className="w-4 h-4" />
            <span>Scans Processed</span>
          </div>
          <span className="text-2xl font-black text-forest-950">{metrics.totalScans}</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-forest-100 shadow-xs">
          <div className="flex items-center space-x-2 text-stone-500 text-xs mb-1">
            <Lightbulb className="w-4 h-4" />
            <span>Ideas Generated</span>
          </div>
          <span className="text-2xl font-black text-forest-950">{metrics.totalIdeas}</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-forest-100 shadow-xs">
          <div className="flex items-center space-x-2 text-stone-500 text-xs mb-1">
            <Heart className="w-4 h-4 text-rose-500" />
            <span>Total Pledges</span>
          </div>
          <span className="text-2xl font-black text-rose-700">{metrics.totalPledges}</span>
        </div>
      </div>

      {/* Demo Mode Switch (M7-F3 Requirement) */}
      <div className="bg-gradient-to-r from-emerald-50 to-forest-50 p-6 rounded-3xl border border-emerald-200 shadow-sm flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <h3 className="font-bold text-forest-950 text-base">Hero Materials Demo Mode</h3>
          </div>
          <p className="text-xs text-stone-600 max-w-lg">
            When enabled, scans and ideation for the 5 hero materials return instantly from cache so demo walks never fail due to external AI rate limits or missing API keys.
          </p>
        </div>

        <button
          onClick={() => setDemoMode(!demoMode)}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition min-h-[44px] ${
            demoMode
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
          }`}
        >
          <span>{demoMode ? 'Demo Mode Active' : 'Live AI Only'}</span>
        </button>
      </div>

      {/* Seeded Hero Materials Table (M7-F1 & M7-F2 Requirements) */}
      <div className="bg-white rounded-3xl p-6 border border-forest-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Database className="w-5 h-5 text-forest-700" />
            <h3 className="font-bold text-forest-950 text-base">Managed Waste Materials ({materials.length})</h3>
          </div>
          <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
            5 Hero Materials Active
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-stone-200 text-stone-500 font-bold uppercase text-[10px]">
                <th className="py-3 px-3">Material Name</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Typical Cost Range</th>
                <th className="py-3 px-3">Hero Status</th>
                <th className="py-3 px-3">Cached Business Models</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {materials.map((m) => (
                <tr key={m.id} className="hover:bg-stone-50/70 transition">
                  <td className="py-3 px-3 font-bold text-forest-950">{m.name}</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded bg-stone-100 text-stone-700 uppercase font-semibold text-[10px]">
                      {m.category}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-stone-600">RM {m.typicalCostRangeRm}</td>
                  <td className="py-3 px-3">
                    {m.isHero ? (
                      <span className="inline-flex items-center space-x-1 text-emerald-700 font-bold">
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Hero (Demo Ready)</span>
                      </span>
                    ) : (
                      <span className="text-stone-400">Standard</span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-stone-500">
                    {m.cachedResult?.ideas ? `${m.cachedResult.ideas.length} pre-tested SCAMPER models` : 'Generated on demand'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
