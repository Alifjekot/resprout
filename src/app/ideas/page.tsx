'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lightbulb, RotateCcw, Bookmark, Sparkles, AlertCircle, CheckCircle2, ChevronRight } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

interface IdeaCard {
  id: string;
  name: string;
  description: string;
  technique: string;
  why_this_works: string;
  est_startup_cost_rm: number;
  demand: number;
  difficulty: number;
  sdg_impact: number;
  co2_saved_kg_year: number;
}

function IdeasContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const scanId = searchParams.get('scan_id') || 'scan-demo';
  const materialParam = searchParams.get('material') || 'Coconut husk';

  const [context, setContext] = useState('');
  const [ideas, setIdeas] = useState<IdeaCard[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [spinCount, setSpinCount] = useState(1);
  const [savedIds, setSavedIds] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchIdeas();
  }, [scanId]);

  const fetchIdeas = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scan_id: scanId,
          context: context.trim() || undefined,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to generate ideas. Please retry.');
      }

      const data = await res.json();
      setIdeas(data.ideas || []);
    } catch (err: any) {
      setError(err?.message || 'Error communicating with ideation coach.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpinAgain = () => {
    if (spinCount >= 3) {
      alert('Maximum 3 spins allowed per scan.');
      return;
    }
    setSpinCount((prev) => prev + 1);
    fetchIdeas();
  };

  const handleSaveIdea = async (ideaId: string) => {
    try {
      await fetch('/api/garden', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea_id: ideaId, saved: true }),
      });
      setSavedIds((prev) => ({ ...prev, [ideaId]: true }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleScoreIdea = (ideaId: string) => {
    handleSaveIdea(ideaId);
    router.push(`/score?idea_id=${ideaId}`);
  };

  const techniqueColors: Record<string, string> = {
    Substitute: 'bg-blue-100 text-blue-800 border-blue-200',
    Combine: 'bg-purple-100 text-purple-800 border-purple-200',
    Adapt: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    Modify: 'bg-amber-100 text-amber-800 border-amber-200',
    'Put to another use': 'bg-rose-100 text-rose-800 border-rose-200',
    Eliminate: 'bg-cyan-100 text-cyan-800 border-cyan-200',
    Reverse: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-14">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-forest-100 pb-5">
        <div>
          <div className="inline-flex items-center space-x-1.5 bg-forest-100 text-forest-800 text-xs font-bold px-3 py-1 rounded-full mb-1">
            <Lightbulb className="w-3.5 h-3.5" />
            <span>Module 3: SCAMPER Idea Generator</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-forest-950">
            5 Sustainable Business Ideas for <span className="text-forest-700">{materialParam}</span>
          </h1>
          <p className="text-xs sm:text-sm text-stone-600">
            Creative business applications under RM 30,000 for Malaysian entrepreneurs
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleSpinAgain}
            disabled={isLoading || spinCount >= 3}
            className="px-4 py-2 bg-white hover:bg-forest-50 text-forest-800 border border-forest-300 rounded-xl text-xs font-bold shadow-xs transition flex items-center space-x-1.5 disabled:opacity-50 min-h-[44px]"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Spin Again ({3 - spinCount} left)</span>
          </button>
        </div>
      </div>

      {/* Context Input */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <input
          type="text"
          value={context}
          onChange={(e) => setContext(e.target.value)}
          placeholder="Anything we should know? (e.g. Johor location, RM 5,000 budget, campus kiosk)..."
          className="flex-1 px-3.5 py-2 text-xs border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-forest-500 min-h-[44px]"
        />
        <button
          onClick={fetchIdeas}
          disabled={isLoading}
          className="px-4 py-2 bg-forest-700 hover:bg-forest-800 text-white rounded-xl text-xs font-semibold shadow-xs min-h-[44px]"
        >
          Refine Ideas
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center space-x-3 text-xs text-red-700">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Loading Skeleton */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4, 5].map((idx) => (
            <div key={idx} className="bg-white rounded-2xl p-6 border border-stone-200 animate-pulse space-y-3">
              <div className="h-4 bg-stone-200 rounded w-1/3" />
              <div className="h-6 bg-stone-200 rounded w-4/5" />
              <div className="h-12 bg-stone-100 rounded" />
              <div className="h-8 bg-stone-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : (
        /* Ideas Cards */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {ideas.map((idea) => {
            const isSaved = savedIds[idea.id];
            const badgeStyle = techniqueColors[idea.technique] || 'bg-stone-100 text-stone-800 border-stone-200';

            return (
              <div
                key={idea.id}
                className="bg-white rounded-3xl p-6 border border-forest-100 hover:border-forest-300 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${badgeStyle}`}>
                      SCAMPER: {idea.technique}
                    </span>
                    <span className="text-xs font-bold text-forest-700">
                      Est. RM {idea.est_startup_cost_rm.toLocaleString()}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-forest-950 leading-snug">{idea.name}</h3>
                  <p className="text-xs text-stone-600 leading-relaxed">{idea.description}</p>

                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
                    <span className="text-[10px] uppercase font-bold text-forest-800 block mb-0.5">Why this works</span>
                    <p className="text-xs text-stone-700 italic">{idea.why_this_works}</p>
                  </div>

                  {/* Badges / Metrics */}
                  <div className="flex flex-wrap gap-2 pt-1 text-[11px]">
                    <span className="bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded">
                      Demand: {idea.demand}/5
                    </span>
                    <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded">
                      SDG Impact: {idea.sdg_impact}/5
                    </span>
                    <span className="bg-teal-50 text-teal-800 border border-teal-200 px-2 py-0.5 rounded">
                      CO₂: {idea.co2_saved_kg_year} kg/yr
                    </span>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="flex items-center space-x-2 pt-3 border-t border-stone-100">
                  <button
                    onClick={() => handleSaveIdea(idea.id)}
                    className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-semibold border transition flex items-center justify-center space-x-1.5 min-h-[44px] ${
                      isSaved
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : 'bg-white hover:bg-stone-50 text-stone-700 border-stone-300'
                    }`}
                  >
                    {isSaved ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Saved to Garden</span>
                      </>
                    ) : (
                      <>
                        <Bookmark className="w-4 h-4 text-stone-400" />
                        <span>Save to Garden</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleScoreIdea(idea.id)}
                    className="flex-1 py-2.5 px-3 bg-forest-700 hover:bg-forest-800 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center justify-center space-x-1 min-h-[44px]"
                  >
                    <span>Score this idea</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function IdeasPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-stone-500">Generating ideas...</div>}>
      <IdeasContent />
    </Suspense>
  );
}
