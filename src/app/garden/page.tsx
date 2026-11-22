'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Flower2, Camera, ExternalLink, Sliders, Sparkles, Users, Leaf, ArrowRight, Eye, Calendar, X, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import PlantGraphic from '@/components/PlantGraphic';
import SdgBadge from '@/components/SdgBadge';
import { PlantStage } from '@/lib/types';

interface GardenIdea {
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
  score: number;
  stage: PlantStage;
  pledge_count: number;
  progress_hint: string;
  pledge_page?: {
    id: string;
    slug: string;
    headline: string;
    body: string;
    price_hint_rm?: number;
    is_published: boolean;
    supporters: Array<{
      id: string;
      name: string;
      quantity: number;
      created_at: string;
    }>;
  };
}

export default function GardenPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [ideas, setIdeas] = useState<GardenIdea[]>([]);
  const [stats, setStats] = useState({ total_ideas: 0, total_pledges: 0, total_co2_kg_year: 0 });
  const [selectedIdea, setSelectedIdea] = useState<GardenIdea | null>(null);
  const [futureMode, setFutureMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchGardenData();
  }, [user]);

  const fetchGardenData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/garden?user_id=${user?.id || 'usr-demo-maker'}`);
      if (!res.ok) throw new Error('Failed to load garden');
      const data = await res.json();
      setIdeas(data.ideas || []);
      setStats(data.stats || { total_ideas: 0, total_pledges: 0, total_co2_kg_year: 0 });
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
        <div className="space-y-8 pb-16">
          {/* Top Header & Interactive Uiverse Switch */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-forest-100 pb-6">
            <div>
                <div className="inline-flex items-center space-x-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200/80 text-xs font-black px-3.5 py-1 rounded-full mb-1">
                  <Flower2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Module 5: Idea Garden Living Dashboard</span>
                </div>
                  <h1 className="text-2xl sm:text-4xl font-black text-forest-950 tracking-tight">
                    {user?.displayName ? `${user.displayName}'s Idea Garden` : 'Your Idea Garden'}
                  </h1>
                    <p className="text-xs sm:text-sm text-stone-500">
                      Watch your waste-to-value business ideas sprout and grow into thriving trees as validation pledges arrive.
                    </p>
                  </div>

                        {/* Uiverse Switch & Quick Scan Action */}
                        <div className="flex items-center space-x-3.5">
                          {/* Uiverse Custom 3D Toggle Switch */}
                          <label className="uiverse-card px-4 py-2 rounded-2xl flex items-center space-x-3 cursor-pointer shadow-xs min-h-[44px]">
                            <span className="text-xs font-extrabold text-forest-950 flex items-center space-x-1.5">
                              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                              <span>5-Year Future Mode</span>
                            </span>
                            <div className="uiverse-switch-container">
                              <input
                                type="checkbox"
                                checked={futureMode}
                                onChange={(e) => setFutureMode(e.target.checked)}
                                className="uiverse-switch-input"
                              />
                              <div className="uiverse-switch-track">
                                <div className="uiverse-switch-thumb" />
                              </div>
                            </div>
                          </label>

                          <Link
                            href="/scan"
                            className="uiverse-btn-emerald px-4 py-2.5 rounded-2xl text-xs font-black flex items-center space-x-1.5 min-h-[44px]"
                          >
                            <Camera className="w-4 h-4" />
                            <span>Scan New Waste</span>
                          </Link>
                        </div>
                      </div>

                      {/* Summary Stats Header with Uiverse Glass Cards */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="uiverse-card rounded-3xl p-5 flex items-center space-x-4">
                              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-100 to-forest-100 text-forest-800 flex items-center justify-center shadow-xs">
                                <Flower2 className="w-6 h-6" />
                              </div>
                              <div>
                                <span className="text-xs font-bold text-stone-400 block uppercase tracking-wider">Planted Ventures</span>
                                <span className="text-2xl font-black text-forest-950 tracking-tight">{stats.total_ideas} Ideas</span>
                              </div>
                            </div>

                                <div className="uiverse-card rounded-3xl p-5 flex items-center space-x-4">
                                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 text-amber-800 flex items-center justify-center shadow-xs">
                                    <Users className="w-6 h-6" />
                                  </div>
                                  <div>
                                    <span className="text-xs font-bold text-stone-400 block uppercase tracking-wider">Public Pledges</span>
                                    <span className="text-2xl font-black text-amber-900 tracking-tight">{stats.total_pledges} Supporters</span>
                                  </div>
                                </div>

                                    <div className="uiverse-card rounded-3xl p-5 flex items-center space-x-4">
                                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-100 to-emerald-100 text-emerald-800 flex items-center justify-center shadow-xs">
                                        <Leaf className="w-6 h-6" />
                                      </div>
                                      <div>
                                          <span className="text-xs font-bold text-stone-400 block uppercase tracking-wider">
                                            {futureMode ? '5-Year Projected CO₂ Offset' : 'Annual CO₂ Diverted'}
                                          </span>
                                            <span className="text-2xl font-black text-emerald-800 tracking-tight">
                                              {futureMode
                                                ? (stats.total_co2_kg_year * 5).toLocaleString()
                                                : stats.total_co2_kg_year.toLocaleString()}{' '}
                                              kg CO₂
                                            </span>
                                          </div>
                                      </div>
                                    </div>

                                    {/* Idea Garden Grid */}
                                    {isLoading ? (
                                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {[1, 2, 3].map((n) => (
            <div key={n} className="uiverse-card rounded-[2rem] p-6 animate-pulse h-64" />
                                        ))}
                                      </div>
                                    ) : ideas.length === 0 ? (
        /* Empty State */
                                          <div className="uiverse-card rounded-[2.5rem] p-12 text-center border-2 border-dashed border-emerald-200/80 space-y-4 max-w-lg mx-auto">
                                            <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto shadow-inner">
                                              <Flower2 className="w-8 h-8" />
                                            </div>
                                            <h3 className="text-xl font-black text-forest-950">Your garden is empty</h3>
                                            <p className="text-xs text-stone-500 leading-relaxed">
                                              Scan an agricultural or municipal waste material to generate SCAMPER ideas and plant your first seed.
                                            </p>
                                            <div className="pt-2">
                                              <Link
                                                href="/scan"
                                                className="uiverse-btn-emerald inline-flex items-center space-x-2 px-6 py-3 rounded-2xl text-xs font-black shadow-md min-h-[44px]"
                                              >
                                                <Camera className="w-4 h-4" />
                                                <span>Scan Material to Plant Seed</span>
                                              </Link>
                                            </div>
                                          </div>
                                          ) : (
                                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {ideas.map((idea) => {
                                              return (
                                                <div
                                                  key={idea.id}
                                                  onClick={() => setSelectedIdea(idea)}
                                                  className="uiverse-card rounded-[2.2rem] p-6 cursor-pointer flex flex-col justify-between space-y-4 group"
                                                >
                                                  <div className="space-y-3">
                                                    {/* Top graphic & stage */}
                                                    <div className="flex items-center justify-between">
                                                      <PlantGraphic stage={idea.stage} size="md" />
                                                      <div className="text-right">
                                                        <span className="text-3xl font-black text-forest-950 block tracking-tight">{idea.score}</span>
                                                        <span className="text-[10px] uppercase font-black text-stone-400 tracking-wider">Score / 100</span>
                                                      </div>
                                                    </div>

                                                      <h3 className="text-base font-black text-forest-950 group-hover:text-emerald-700 transition-colors leading-snug">
                                                        {idea.name}
                                                      </h3>
                                                      <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">{idea.description}</p>
                                                  </div>

                                                    {/* Progress Hint & Pledge Stats with Uiverse Styling */}
                                                    <div className="pt-3 border-t border-stone-100 space-y-2.5">
                                                      <div className="flex items-center justify-between text-xs">
                                                        <span className="font-bold text-stone-500">Pledges Received</span>
                                                        <span className="font-black text-amber-800 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200/80">
                                                          {idea.pledge_count} Supporters
                                                        </span>
                                                      </div>

                                                        <div className="p-2.5 bg-emerald-50/80 rounded-2xl border border-emerald-100 text-[11px] text-emerald-900 font-bold">
                                                          {idea.progress_hint}
                                                        </div>

                                                          <div className="flex items-center justify-between text-[11px] text-stone-400 pt-1 font-medium">
                                                            <span>Est. RM {idea.est_startup_cost_rm.toLocaleString()}</span>
                                                            <span>{idea.co2_saved_kg_year} kg CO₂/yr</span>
                                                          </div>
                                                        </div>
                                                      </div>
                                                      );
          })}
                                                    </div>
      )}

                                                    {/* Detail Modal / Drawer with Frosted Glass */}
                                                    {selectedIdea && (
                                                          <div className="fixed inset-0 z-50 bg-forest-950/40 backdrop-blur-md flex items-center justify-center p-4">
                                                            <div className="bg-white/95 backdrop-blur-2xl rounded-[2.5rem] max-w-2xl w-full p-7 sm:p-9 space-y-6 max-h-[90vh] overflow-y-auto shadow-[0_25px_60px_rgba(0,0,0,0.25)] border border-white/80 relative">
                                                              <button
                                                                onClick={() => setSelectedIdea(null)}
                                                                className="absolute top-6 right-6 p-2 rounded-2xl text-stone-400 hover:text-stone-800 hover:bg-stone-100 min-h-[44px] min-w-[44px] flex items-center justify-center transition"
                                                              >
                                                                <X className="w-5 h-5" />
                                                              </button>

                                                              <div className="flex items-center space-x-4">
                                                                <PlantGraphic stage={selectedIdea.stage} size="lg" />
                                                                <div>
                                                                    <span className="text-[11px] uppercase font-black text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                                                                      Stage: {selectedIdea.stage} &bull; Score {selectedIdea.score}/100
                                                                    </span>
                                                                    <h2 className="text-xl font-black text-forest-950 mt-1.5">{selectedIdea.name}</h2>
                                                                    <span className="text-xs text-stone-500 font-medium">SCAMPER Technique: {selectedIdea.technique}</span>
                                                                </div>
                                                              </div>

                                                                <p className="text-xs text-stone-700 leading-relaxed bg-stone-50 p-4 rounded-2xl border border-stone-200/80">
                                                                  {selectedIdea.description}
                                                                </p>

                                                                {/* Read-only Score Metrics */}
                                                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                                                                    <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-100 shadow-2xs">
                                                                      <span className="text-[10px] text-stone-500 uppercase font-black">Demand</span>
                                                                      <div className="text-xl font-black text-emerald-950">{selectedIdea.demand}/5</div>
                                                                    </div>
                                                                      <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-100 shadow-2xs">
                                                                        <span className="text-[10px] text-stone-500 uppercase font-black">Capital</span>
                                                                        <div className="text-xl font-black text-amber-950">RM {selectedIdea.est_startup_cost_rm}</div>
                                                                      </div>
                                                                        <div className="p-3.5 rounded-2xl bg-teal-50 border border-teal-100 shadow-2xs">
                                                                          <span className="text-[10px] text-stone-500 uppercase font-black">Difficulty</span>
                                                                          <div className="text-xl font-black text-teal-950">{selectedIdea.difficulty}/5</div>
                                                                        </div>
                                                                          <div className="p-3.5 rounded-2xl bg-forest-50 border border-forest-100 shadow-2xs">
                                                                            <span className="text-[10px] text-stone-500 uppercase font-black">CO₂ Offset</span>
                                                                            <div className="text-xl font-black text-forest-950">{selectedIdea.co2_saved_kg_year} kg/yr</div>
                                                                          </div>
                                                                        </div>

                                                                        {/* Pledge Validation Info & Supporters List */}
                                                                        <div className="space-y-3 pt-2 border-t border-stone-100">
                                                                          <div className="flex items-center justify-between">
                                                                              <h4 className="font-black text-sm text-forest-950">
                                                                                Supporter Community ({selectedIdea.pledge_count} Pledges)
                                                                              </h4>
                                                                              {selectedIdea.pledge_page?.is_published && (
                                                                                <Link
                                                                                  href={`/p/${selectedIdea.pledge_page.slug}`}
                                                                                  target="_blank"
                                                                                  className="text-xs font-bold text-emerald-700 hover:underline flex items-center space-x-1"
                                                                                >
                                                                                  <span>Open Public Pledge Page</span>
                                                                                  <ExternalLink className="w-3.5 h-3.5" />
                                                                                </Link>
                                                                              )}
                                                                          </div>

                                                                          {selectedIdea.pledge_page?.supporters && selectedIdea.pledge_page.supporters.length > 0 ? (
                                                                            <div className="max-h-40 overflow-y-auto space-y-1.5 p-3 bg-stone-50 rounded-2xl border border-stone-200">
                                                                              {selectedIdea.pledge_page.supporters.map((sup, idx) => (
                                                                                  <div key={sup.id || idx} className="flex items-center justify-between text-xs py-1.5 px-3 rounded-xl bg-white border border-stone-100 shadow-2xs">
                                                                                    <span className="font-bold text-stone-900">{sup.name}</span>
                                                                                    <span className="text-stone-400 text-[10px] font-semibold">{sup.quantity} unit(s)</span>
                                                                                  </div>
                  ))}
                                                                                </div>
                                                                              ) : (
                                                                                <p className="text-xs text-stone-400 italic bg-stone-50 p-3 rounded-xl">
                                                                                  No pledges yet. Publish your pledge page to start gathering interest from supporters!
                                                                                </p>
              )}
                                                                            </div>

                                                                          {/* Modal Actions */}
                                                                          <div className="flex flex-col sm:flex-row items-center gap-3 pt-3 border-t border-stone-100">
                                                                            <button
                                                                              onClick={() => router.push(`/score?idea_id=${selectedIdea.id}`)}
                                                                              className="uiverse-btn-glass w-full sm:flex-1 py-3 rounded-2xl text-xs font-bold min-h-[44px] flex items-center justify-center space-x-1.5"
                                                                            >
                                                                              <Sliders className="w-4 h-4 text-emerald-700" />
                                                                              <span>Adjust Score Estimates</span>
                                                                            </button>

                                                                            <button
                                                                              onClick={() => router.push(`/pledge/manage?idea_id=${selectedIdea.id}`)}
                                                                              className="uiverse-btn-emerald w-full sm:flex-1 py-3 rounded-2xl text-xs font-black min-h-[44px] flex items-center justify-center space-x-1.5"
                                                                            >
                                                                              <span>Manage Pledge Page</span>
                                                                              <ArrowRight className="w-4 h-4" />
                                                                            </button>
                                                                          </div>
                                                                        </div>
                                                                      </div>
      )}
                                                                    </div>
                                                                    );
}
