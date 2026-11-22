'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lightbulb, RotateCcw, Bookmark, Sparkles, AlertCircle, CheckCircle2, ChevronRight, Zap, Wrench } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import MakerGuideModal from '@/components/MakerGuideModal';
import { MakerGuide } from '@/lib/types';

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

    const [selectedGuide, setSelectedGuide] = useState<MakerGuide | null>(null);
    const [isGuideOpen, setIsGuideOpen] = useState(false);
    const [loadingGuideId, setLoadingGuideId] = useState<string | null>(null);

    useEffect(() => {
      fetchIdeas();
    }, [scanId]);

    const handleOpenGuide = async (idea: IdeaCard) => {
      setLoadingGuideId(idea.id);
      try {
        const res = await fetch(
          `/api/guide?idea_id=${encodeURIComponent(idea.id)}&material=${encodeURIComponent(
            materialParam
          )}&idea_name=${encodeURIComponent(idea.name)}&cost_rm=${idea.est_startup_cost_rm}`
        );
        if (!res.ok) throw new Error('Failed to fetch guide');
        const data = await res.json();
        setSelectedGuide(data.guide);
        setIsGuideOpen(true);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingGuideId(null);
      }
    };

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

            const techniqueStyles: Record<string, {badge: string; glow: string }> = {
              Substitute: {badge: 'bg-blue-50 text-blue-800 border-blue-200', glow: 'hover:border-blue-400' },
            Combine: {badge: 'bg-purple-50 text-purple-800 border-purple-200', glow: 'hover:border-purple-400' },
            Adapt: {badge: 'bg-emerald-50 text-emerald-800 border-emerald-200', glow: 'hover:border-emerald-400' },
            Modify: {badge: 'bg-amber-50 text-amber-800 border-amber-200', glow: 'hover:border-amber-400' },
            'Put to another use': {badge: 'bg-rose-50 text-rose-800 border-rose-200', glow: 'hover:border-rose-400' },
            Eliminate: {badge: 'bg-cyan-50 text-cyan-800 border-cyan-200', glow: 'hover:border-cyan-400' },
            Reverse: {badge: 'bg-indigo-50 text-indigo-800 border-indigo-200', glow: 'hover:border-indigo-400' },
  };

              return (
              <div className="max-w-4xl mx-auto space-y-8 pb-16">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-forest-100 pb-5">
                  <div>
                    <div className="inline-flex items-center space-x-2 bg-emerald-50 text-emerald-800 border border-emerald-200/80 text-xs font-black px-3.5 py-1 rounded-full mb-1">
                      <Lightbulb className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Module 3: SCAMPER Ideation Engine</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-black text-forest-950 tracking-tight">
                      5 Sustainable Business Ideas for <span className="text-emerald-700">{materialParam}</span>
                    </h1>
                    <p className="text-xs sm:text-sm text-stone-500">
                      Creative business applications under RM 30,000 tailored for Malaysian university & maker teams.
                    </p>
                  </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={handleSpinAgain}
                        disabled={isLoading || spinCount >= 3}
                        className="uiverse-btn-glass px-4 py-2.5 rounded-2xl text-xs font-bold shadow-xs flex items-center space-x-2 disabled:opacity-50 min-h-[44px]"
                      >
                        <RotateCcw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                        <span>Spin Again ({3 - spinCount} left)</span>
                      </button>
                    </div>
                  </div>

                  {/* Context Input with Uiverse Card Styling */}
                  <div className="uiverse-card rounded-2xl p-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                    <input
                      type="text"
                      value={context}
                      onChange={(e) => setContext(e.target.value)}
                      placeholder="Refine constraints (e.g. Johor location, RM 5,000 budget, campus kiosk, artisan market)..."
                      className="flex-1 px-4 py-2.5 text-xs border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 min-h-[44px] bg-stone-50/50"
                    />
                    <button
                      onClick={fetchIdeas}
                      disabled={isLoading}
                      className="uiverse-btn-emerald px-5 py-2.5 rounded-xl text-xs font-black min-h-[44px]"
                    >
                      Refine Ideas
                    </button>
                  </div>

                          {
                            error && (
                              <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center space-x-3 text-xs text-red-700">
                                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                <span>{error}</span>
                              </div>
                            )
                          }

                                {/* Loading Skeleton */}
                                {isLoading ? (
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    {[1, 2, 3, 4, 5].map((idx) => (
                                      <div key={idx} className="uiverse-card rounded-[2.2rem] p-7 animate-pulse space-y-4">
                                        <div className="h-5 bg-stone-200 rounded-full w-1/3" />
                                        <div className="h-7 bg-stone-200 rounded-xl w-4/5" />
                                        <div className="h-14 bg-stone-100 rounded-2xl" />
                                        <div className="h-9 bg-stone-200 rounded-xl w-1/2" />
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  /* Ideas Cards */
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    {ideas.map((idea) => {
                                      const isSaved = savedIds[idea.id];
                                      const tech = techniqueStyles[idea.technique] || {
                                        badge: 'bg-stone-100 text-stone-800 border-stone-200',
                                        glow: 'hover:border-stone-400',
                                      };

                                      return (
                                        <div
                                          key={idea.id}
                                          className={`uiverse-card rounded-[2.2rem] p-7 flex flex-col justify-between space-y-4 group ${tech.glow}`}
                                        >
                                          <div className="space-y-3.5">
                                            <div className="flex items-center justify-between">
                                              <span className={`text-[10px] font-black px-3 py-1 rounded-full border ${tech.badge} uppercase tracking-wider`}>
                                                SCAMPER: {idea.technique}
                                              </span>
                                              <span className="text-xs font-black text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100 shadow-2xs">
                                                Est. RM {idea.est_startup_cost_rm.toLocaleString()}
                                              </span>
                                            </div>

                                            <h3 className="text-lg font-black text-forest-950 leading-snug group-hover:text-emerald-800 transition-colors">
                                              {idea.name}
                                            </h3>
                                            <p className="text-xs text-stone-600 leading-relaxed font-normal">{idea.description}</p>

                                          <div className="p-3.5 bg-stone-50/80 rounded-2xl border border-stone-200/60 shadow-inner">
                                            <span className="text-[10px] uppercase font-black text-emerald-800 block mb-0.5 tracking-wider">
                                              Why this works
                                            </span>
                                            <p className="text-xs text-stone-700 italic">{idea.why_this_works}</p>
                                          </div>

                                            {/* Badges / Metrics */}
                                            <div className="flex flex-wrap gap-2 pt-1 text-[11px] font-bold">
                                              <span className="bg-amber-50 text-amber-900 border border-amber-200/80 px-2.5 py-0.5 rounded-lg">
                                                Demand: {idea.demand}/5
                                              </span>
                                              <span className="bg-emerald-50 text-emerald-900 border border-emerald-200/80 px-2.5 py-0.5 rounded-lg">
                                                SDG: {idea.sdg_impact}/5
                                              </span>
                                              <span className="bg-teal-50 text-teal-900 border border-teal-200/80 px-2.5 py-0.5 rounded-lg">
                                                CO₂: {idea.co2_saved_kg_year} kg/yr
                                              </span>
                                            </div>
                                          </div>

                                {/* Card Actions */}
                                <div className="space-y-2 pt-4 border-t border-stone-100">
                                  {/* How to Make It Button */}
                                  <button
                                    onClick={() => handleOpenGuide(idea)}
                                    disabled={loadingGuideId === idea.id}
                                    className="w-full py-2.5 px-3 rounded-2xl text-xs font-black bg-gradient-to-r from-emerald-600 to-forest-700 hover:from-emerald-700 hover:to-forest-800 text-white shadow-sm hover:shadow-md transition-all flex items-center justify-center space-x-2 min-h-[44px] group"
                                  >
                                    <Wrench className={`w-4 h-4 text-emerald-200 ${loadingGuideId === idea.id ? 'animate-spin' : 'group-hover:rotate-12'} transition-transform`} />
                                    <span>{loadingGuideId === idea.id ? 'Loading Blueprint...' : 'How to Make It (Step-by-Step)'}</span>
                                    <ChevronRight className="w-4 h-4 text-emerald-200 group-hover:translate-x-0.5 transition-transform" />
                                  </button>

                                  <div className="flex items-center space-x-2.5">
                                    <button
                                      onClick={() => handleSaveIdea(idea.id)}
                                      className={`flex-1 py-2.5 px-3 rounded-2xl text-xs font-bold border transition flex items-center justify-center space-x-1.5 min-h-[44px] ${isSaved
                                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300 shadow-xs'
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
                                      className="uiverse-btn-emerald flex-1 py-2.5 px-3 rounded-2xl text-xs font-black shadow-xs flex items-center justify-center space-x-1 min-h-[44px]"
                                    >
                                      <span>Score this idea</span>
                                      <ChevronRight className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                              );
          })}
                            </div>
      )}

      {/* Step-by-Step Maker Guide Modal */}
      <MakerGuideModal
        guide={selectedGuide}
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        onScoreIdea={(id) => handleScoreIdea(id)}
      />
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
