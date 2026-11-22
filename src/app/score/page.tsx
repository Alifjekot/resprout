'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Award, Sliders, ArrowRight, ArrowLeft, Info, Sprout, Sparkles, CheckCircle2, Wrench } from 'lucide-react';
import SdgBadge from '@/components/SdgBadge';
import PlantGraphic from '@/components/PlantGraphic';
import confetti from 'canvas-confetti';

interface ScoringBreakdown {
  factor: string;
  weight: number;
  subscore: number;
  explanation: string;
}

  function ScoreContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const ideaId = searchParams.get('idea_id') || 'idea-tree-demo';

    const [score, setScore] = useState<number>(81);
    const [band, setBand] = useState<string>('Strong');
    const [breakdown, setBreakdown] = useState<ScoringBreakdown[]>([]);
    const [stage, setStage] = useState<'seed' | 'sprout' | 'sapling' | 'tree' | 'forest'>('sprout');
    const [hasCelebrated, setHasCelebrated] = useState(false);

    // Editable overrides with sliders
    const [cost, setCost] = useState(4500);
    const [demand, setDemand] = useState(4);
    const [difficulty, setDifficulty] = useState(3);
    const [monthlyWasteKg, setMonthlyWasteKg] = useState(50);

    useEffect(() => {
      calculateScore();
    }, [ideaId, cost, demand, difficulty]);

    const calculateScore = async () => {
      try {
        const res = await fetch('/api/score', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            idea_id: ideaId,
            overrides: {
              cost,
              demand,
              difficulty,
            },
          }),
        });

            if (!res.ok) throw new Error('Score calculation failed');
            const data = await res.json();

            setScore(data.score);
            setBand(data.band);
            setBreakdown(data.breakdown || []);
            setStage(data.stage);

            // Celebrate Sprout upgrade with Confetti
            if (data.score >= 60 && !hasCelebrated) {
              setHasCelebrated(true);
              confetti({
                particleCount: 65,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#10b981', '#34d399', '#f59e0b', '#059669'],
              });
            }
        } catch (err) {
          console.error(err);
        }
      };

      const bandStyles: Record<string, { bg: string; text: string; glow: string }> = {
        Strong: {
          bg: 'bg-emerald-500',
          text: 'text-emerald-950',
          glow: 'shadow-[0_0_20px_rgba(16,185,129,0.5)]',
        },
        Promising: {
          bg: 'bg-lime-500',
          text: 'text-lime-950',
          glow: 'shadow-[0_0_20px_rgba(132,204,22,0.5)]',
        },
        'Needs work': {
          bg: 'bg-amber-500',
          text: 'text-amber-950',
          glow: 'shadow-[0_0_20px_rgba(245,158,11,0.5)]',
        },
        Rethink: {
          bg: 'bg-rose-500',
          text: 'text-rose-950',
          glow: 'shadow-[0_0_20px_rgba(244,63,94,0.5)]',
        },
      };

      const currentBandStyle = bandStyles[band] || bandStyles.Strong;

  const handleCreatePledgePage = () => {
                router.push(`/pledge/manage?idea_id=${ideaId}`);
  };

              return (
              <div className="max-w-4xl mx-auto space-y-8 pb-16">
                {/* Module Title */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-forest-100 pb-5">
                  <div>
                    <div className="inline-flex items-center space-x-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200/80 text-xs font-black px-3.5 py-1 rounded-full mb-1">
                      <Award className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Module 4: Algorithmic Validation Engine</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-black text-forest-950 tracking-tight">
                      Feasibility & Validation Score
                    </h1>
                    <p className="text-xs sm:text-sm text-stone-500">
                      Algorithmic score out of 100 based on demand, startup capital, difficulty, and environmental diversion.
                    </p>
                  </div>

                            <button
                              onClick={() => router.back()}
                              className="uiverse-btn-glass px-4 py-2 rounded-xl text-xs font-bold inline-flex items-center space-x-1.5"
                            >
                              <ArrowLeft className="w-3.5 h-3.5" />
                              <span>Back to ideas</span>
                            </button>
                        </div>

                        {/* Sprout Growth Notification Banner with Uiverse Glow */}
                        {score >= 60 && (
                          <div className="p-5 bg-gradient-to-r from-emerald-600 via-forest-600 to-teal-700 text-white rounded-3xl shadow-[0_10px_30px_rgba(16,185,129,0.3)] border border-emerald-400/40 flex items-center justify-between animate-growth">
                            <div className="flex items-center space-x-4">
                              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner">
                                <Sprout className="w-7 h-7 text-emerald-200" />
                              </div>
                              <div>
                                <div className="flex items-center space-x-2">
                                  <span className="font-black text-base">Idea Sprouted!</span>
                                  <span className="bg-emerald-400/30 text-emerald-100 text-[10px] font-black uppercase px-2 py-0.5 rounded-full">
                                    Level Up
                                  </span>
                                </div>
                                <span className="text-xs text-emerald-100 block mt-0.5 font-medium">
                                  Score reached {score}/100 (&ge;60). This idea has grown into a <strong>Sprout</strong> in your Idea Garden.
                                </span>
                              </div>
                            </div>
                            <div className="hidden sm:block">
                              <PlantGraphic stage={stage} size="sm" isAnimating={true} />
                            </div>
                          </div>
                        )}

                            {/* Main Score & Breakdown Grid with Uiverse Glass */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              {/* Left: Big Score & Band */}
                              <div className="uiverse-card rounded-[2.5rem] p-7 flex flex-col items-center justify-center text-center space-y-4">
                                <span className="text-xs uppercase font-black tracking-widest text-stone-400">Validation Score</span>

                                    {/* Glowing Radial Score Ring */}
                                    <div className="relative flex items-center justify-center my-2">
                                      <div className="w-40 h-40 rounded-full bg-gradient-to-br from-emerald-500/10 via-forest-50 to-lime-500/10 p-3 flex items-center justify-center shadow-[inset_0_2px_8px_rgba(16,185,129,0.15)] border border-emerald-200">
                                        <div className="w-32 h-32 rounded-full bg-white flex flex-col items-center justify-center shadow-md border border-white">
                                          <span className="text-5xl font-black text-forest-950 tracking-tight leading-none">{score}</span>
                                          <span className="text-[11px] font-bold text-stone-400 mt-1">out of 100</span>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="space-y-1">
                                      <span
                                        className={`inline-block px-4 py-1 rounded-full text-xs font-black uppercase tracking-wider text-white ${currentBandStyle.bg} ${currentBandStyle.glow}`}
                                      >
                                        {band} Band
                                      </span>
                                      <p className="text-[11px] text-stone-500 max-w-[210px] pt-1">
                                        {score >= 80
                                          ? 'High commercial feasibility with minimal market entry friction.'
                                          : score >= 60
                                            ? 'Promising concept; ready for public fake-door demand testing.'
                                            : 'Requires parameter tuning or lower capital requirements.'}
                                      </p>
                                    </div>

                                    <div className="pt-2 w-full border-t border-stone-100 flex justify-center">
                                      <PlantGraphic stage={stage} size="md" />
                                    </div>
                                  </div>

                                    {/* Center: Factor Breakdown Bars */}
                                    <div className="md:col-span-2 uiverse-card rounded-[2.5rem] p-7 space-y-5">
                                      <div className="flex items-center justify-between">
                                        <h3 className="font-black text-forest-950 text-base">Mathematical Factor Weights</h3>
                                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                                          M4 Strict Math
                                        </span>
                                      </div>

                                            <div className="space-y-4">
                                              {breakdown.map((item) => (
                                                <div key={item.factor} className="space-y-1.5">
                                                  <div className="flex items-center justify-between text-xs">
                                                    <span className="font-extrabold text-stone-900">
                                                      {item.factor} <span className="font-medium text-stone-400">({item.weight}% weight)</span>
                                                    </span>
                                                    <span className="font-black text-emerald-800">{item.subscore} / 5</span>
                                                  </div>

                                                  {/* Progress bar with Uiverse gradient */}
                                                  <div className="w-full h-3 rounded-full bg-stone-100 overflow-hidden shadow-inner p-0.5">
                                                    <div
                                                      className="h-full bg-gradient-to-r from-emerald-400 via-emerald-500 to-forest-600 rounded-full transition-all duration-500 shadow-sm"
                                                      style={{ width: `${(item.subscore / 5) * 100}%` }}
                                                    />
                                                  </div>

                                            <p className="text-[11px] text-stone-500 font-normal">{item.explanation}</p>
                                          </div>
                                        ))}
                                      </div>

                                      {/* Mandatory Specs Disclaimer */}
                                      <div className="p-3.5 bg-stone-50/90 rounded-2xl border border-stone-200 text-xs text-stone-600 flex items-start space-x-2.5">
                                        <Info className="w-4 h-4 text-emerald-700 flex-shrink-0 mt-0.5" />
                                        <span className="leading-relaxed">
                                          <strong>Disclaimer:</strong> Estimates are AI-generated. Real validation comes from customer pledges on your public landing page.
                                        </span>
                                      </div>
                                    </div>
                                  </div>

                                      {/* Interactive Uiverse Sensitivity Sliders */}
                                      <div className="uiverse-card rounded-[2.5rem] p-7 sm:p-9 space-y-6">
                                        <div className="flex items-center space-x-2.5 text-forest-950">
                                          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                                            <Sliders className="w-4 h-4" />
                                          </div>
                                          <div>
                                            <h3 className="font-black text-lg">Interactive Parameter Sensitivity Testing</h3>
                                            <p className="text-xs text-stone-500">
                                              Drag sliders to test sensitivity — watch the validation score dynamically adapt in real-time.
                                            </p>
                                          </div>
                                        </div>

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                                              {/* Cost Slider */}
                                              <div className="p-4 rounded-2xl bg-stone-50/80 border border-stone-200/80 space-y-3">
                                                <div className="flex justify-between items-center text-xs">
                                                  <label className="font-extrabold text-stone-800">Startup Capital</label>
                                                  <span className="font-black text-emerald-800 bg-white px-2 py-0.5 rounded-lg border border-stone-200 shadow-xs">
                                                    RM {cost.toLocaleString()}
                                                  </span>
                                                </div>
                                                <input
                                                  type="range"
                                                  min="500"
                                                  max="40000"
                                                  step="500"
                                                  value={cost}
                                                  onChange={(e) => setCost(Number(e.target.value))}
                                                  className="uiverse-slider"
                                                />
                                                <span className="text-[10px] text-stone-400 block font-medium">&le;RM1k = 5pts &bull; &gt;RM30k = 1pt</span>
                                              </div>

                                                {/* Demand Slider */}
                                                <div className="p-4 rounded-2xl bg-stone-50/80 border border-stone-200/80 space-y-3">
                                                  <div className="flex justify-between items-center text-xs">
                                                    <label className="font-extrabold text-stone-800">Market Demand</label>
                                                    <span className="font-black text-emerald-800 bg-white px-2 py-0.5 rounded-lg border border-stone-200 shadow-xs">
                                                      {demand} / 5
                                                    </span>
                                                  </div>
                                                  <input
                                                    type="range"
                                                    min="1"
                                                    max="5"
                                                    step="1"
                                                    value={demand}
                                                    onChange={(e) => setDemand(Number(e.target.value))}
                                                    className="uiverse-slider"
                                                  />
                                                  <span className="text-[10px] text-stone-400 block font-medium">1: Niche &bull; 5: Widespread buyer demand</span>
                                                </div>

                                                  {/* Difficulty Slider */}
                                                  <div className="p-4 rounded-2xl bg-stone-50/80 border border-stone-200/80 space-y-3">
                                                    <div className="flex justify-between items-center text-xs">
                                                      <label className="font-extrabold text-stone-800">Difficulty</label>
                                                      <span className="font-black text-emerald-800 bg-white px-2 py-0.5 rounded-lg border border-stone-200 shadow-xs">
                                                        {difficulty} / 5
                                                      </span>
                                                    </div>
                                                    <input
                                                      type="range"
                                                      min="1"
                                                      max="5"
                                                      step="1"
                                                      value={difficulty}
                                                      onChange={(e) => setDifficulty(Number(e.target.value))}
                                                      className="uiverse-slider"
                                                    />
                                                    <span className="text-[10px] text-stone-400 block font-medium">Ease = (6 - Diff) &bull; Lower gives more points</span>
                                                  </div>
                                                </div>
                                              </div>

                                                      {/* Environmental Diversion Dashboard & SDG 9.B */}
                                                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                        <div className="md:col-span-2 uiverse-card rounded-[2.5rem] p-7 space-y-4 bg-gradient-to-br from-emerald-50/60 to-forest-50/40">
                                                          <div className="flex items-center justify-between">
                                                            <h4 className="font-black text-forest-950 text-base">Annual Environmental Diversion</h4>
                                                            <span className="text-[10px] font-black uppercase text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                                                              Verified Formula
                                                            </span>
                                                          </div>

                                                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                            <div className="bg-white/90 p-4 rounded-2xl border border-emerald-100 shadow-sm">
                                                              <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">Waste Diverted</span>
                                                              <div className="text-3xl font-black text-forest-950 mt-1">
                                                                {(monthlyWasteKg * 12).toLocaleString()} <span className="text-sm font-bold text-stone-400">kg/yr</span>
                                                              </div>
                                                                <span className="text-[10px] text-stone-400 block mt-0.5">Based on {monthlyWasteKg} kg monthly waste processing</span>
                                                              </div>

                                                              <div className="bg-white/90 p-4 rounded-2xl border border-emerald-100 shadow-sm">
                                                                <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">Net CO₂ Reduction</span>
                                                                <div className="text-3xl font-black text-emerald-700 mt-1">
                                                                  {Math.round(monthlyWasteKg * 12 * 1.3).toLocaleString()} <span className="text-sm font-bold text-emerald-400">kg CO₂e</span>
                                                                </div>
                                                                <span className="text-[10px] text-stone-400 block mt-0.5">Lifecycle carbon avoidance estimate</span>
                                                              </div>
                                                            </div>
                                                          </div>

                                                          <div className="flex items-center justify-center">
                                                            <SdgBadge size="lg" showDetail={true} />
                                                          </div>
                                                        </div>

                                                          {/* Bottom CTA */}
                                                          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-forest-100">
                                                            <div className="flex items-center space-x-2.5 w-full sm:w-auto">
                                                              <button
                                                                onClick={() => router.push('/garden')}
                                                                className="uiverse-btn-glass flex-1 sm:flex-none px-5 py-3 rounded-2xl text-xs font-bold min-h-[44px]"
                                                              >
                                                                View Garden
                                                              </button>

                                                              <button
                                                                onClick={() => router.push(`/guide?idea_id=${ideaId}`)}
                                                                className="uiverse-btn-glass flex-1 sm:flex-none px-5 py-3 rounded-2xl text-xs font-bold min-h-[44px] flex items-center justify-center space-x-1.5 text-emerald-800"
                                                              >
                                                                <Wrench className="w-4 h-4 text-emerald-600" />
                                                                <span>How to Make It</span>
                                                              </button>
                                                            </div>

                                                          <button
                                                            onClick={handleCreatePledgePage}
                                                            className="uiverse-btn-emerald w-full sm:w-auto px-8 py-3.5 rounded-2xl font-black text-sm tracking-wide shadow-lg flex items-center justify-center space-x-2.5 min-h-[50px]"
                                                          >
                                                            <span>Create Public Pledge Page</span>
                                                            <ArrowRight className="w-4 h-4" />
                                                          </button>
                                                        </div>
                                                      </div>
                                                      );
}

                                                      export default function ScorePage() {
  return (
                                                      <Suspense fallback={<div className="p-8 text-center text-xs text-stone-500">Calculating validation score...</div>}>
                                                        <ScoreContent />
                                                      </Suspense>
                                                      );
}
