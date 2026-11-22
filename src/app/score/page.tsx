'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Award, Sliders, ArrowRight, ArrowLeft, Info, Sprout } from 'lucide-react';
import SdgBadge from '@/components/SdgBadge';
import PlantGraphic from '@/components/PlantGraphic';

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

  // Editable overrides with sliders
  const [cost, setCost] = useState(4500);
  const [demand, setDemand] = useState(4);
  const [difficulty, setDifficulty] = useState(3);
  const [monthlyWasteKg, setMonthlyWasteKg] = useState(50); // for Impact Card

  const [isLoading, setIsLoading] = useState(true);

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
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const bandColors: Record<string, { bg: string; text: string; border: string }> = {
    Strong: { bg: 'bg-emerald-500', text: 'text-emerald-900', border: 'border-emerald-300' },
    Promising: { bg: 'bg-lime-500', text: 'text-lime-900', border: 'border-lime-300' },
    'Needs work': { bg: 'bg-amber-500', text: 'text-amber-900', border: 'border-amber-300' },
    Rethink: { bg: 'bg-rose-500', text: 'text-rose-900', border: 'border-rose-300' },
  };

  const handleCreatePledgePage = () => {
    router.push(`/pledge/manage?idea_id=${ideaId}`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-14">
      {/* Module Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-forest-100 pb-5">
        <div>
          <div className="inline-flex items-center space-x-1.5 bg-forest-100 text-forest-800 text-xs font-bold px-3 py-1 rounded-full mb-1">
            <Award className="w-3.5 h-3.5" />
            <span>Module 4: Validation Scoring Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-forest-950">Feasibility & Validation Score</h1>
          <p className="text-xs sm:text-sm text-stone-600">
            Algorithmic score out of 100 based on demand, startup capital, difficulty, and environmental diversion.
          </p>
        </div>

        <button
          onClick={() => router.back()}
          className="inline-flex items-center space-x-1 text-xs font-semibold text-stone-600 hover:text-forest-800 min-h-[44px]"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to ideas</span>
        </button>
      </div>

      {/* Sprout Growth Notification Banner */}
      {score >= 60 && (
        <div className="p-4 bg-gradient-to-r from-emerald-500 to-forest-600 text-white rounded-2xl shadow-md flex items-center justify-between animate-growth">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-xl">
              <Sprout className="w-6 h-6 text-emerald-100" />
            </div>
            <div>
              <span className="font-bold text-sm block">Idea Sprouted!</span>
              <span className="text-xs text-emerald-100">
                Score reached 60+ (Band: {band}). This idea has grown into a Sprout in your Idea Garden.
              </span>
            </div>
          </div>
          <PlantGraphic stage={stage} size="sm" isAnimating={true} />
        </div>
      )}

      {/* Main Score & Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left: Big Score & Band */}
        <div className="bg-white rounded-3xl p-6 border border-forest-100 shadow-sm flex flex-col items-center justify-center text-center space-y-4">
          <span className="text-xs uppercase font-extrabold tracking-wider text-stone-400">Total Validation Score</span>

          <div className="relative flex items-center justify-center">
            <div className="w-36 h-36 rounded-full border-8 border-forest-100 flex items-center justify-center shadow-inner">
              <span className="text-5xl font-black text-forest-950">{score}</span>
              <span className="text-sm font-bold text-stone-400 self-end mb-4">/100</span>
            </div>
          </div>

          <div className="space-y-1">
            <span
              className={`inline-block px-4 py-1 rounded-full text-xs font-extrabold uppercase tracking-wide text-white shadow-xs ${
                bandColors[band]?.bg || 'bg-forest-600'
              }`}
            >
              {band} Band
            </span>
            <p className="text-[11px] text-stone-500 max-w-[200px]">
              {score >= 80
                ? 'High commercial feasibility with minimal market entry friction.'
                : score >= 60
                ? 'Promising concept; ready for public fake-door demand testing.'
                : 'Requires parameter tuning or lower capital requirements.'}
            </p>
          </div>

          <div className="pt-2 w-full border-t border-stone-100">
            <PlantGraphic stage={stage} size="md" />
          </div>
        </div>

        {/* Center: Factor Breakdown Bars */}
        <div className="md:col-span-2 bg-white rounded-3xl p-6 border border-forest-100 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-forest-950 text-base">Weighted Scoring Breakdown</h3>
            <span className="text-[11px] text-stone-400">Strict M4 Math Formula</span>
          </div>

          <div className="space-y-4">
            {breakdown.map((item) => (
              <div key={item.factor} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-stone-800">
                    {item.factor} <span className="font-normal text-stone-400">({item.weight}% weight)</span>
                  </span>
                  <span className="font-bold text-forest-800">{item.subscore} / 5</span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-3 rounded-full bg-stone-100 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-forest-500 to-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${(item.subscore / 5) * 100}%` }}
                  />
                </div>

                <p className="text-[11px] text-stone-500">{item.explanation}</p>
              </div>
            ))}
          </div>

          {/* Mandatory Specs Disclaimer */}
          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-600 flex items-start space-x-2">
            <Info className="w-4 h-4 text-forest-700 flex-shrink-0 mt-0.5" />
            <span>
              <strong>Disclaimer:</strong> Estimates are AI-generated. Real validation comes from customer pledges on your public landing page.
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Sliders (M4-F6 Requirement) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-forest-100 shadow-sm space-y-6">
        <div className="flex items-center space-x-2 text-forest-900">
          <Sliders className="w-5 h-5 text-forest-600" />
          <h3 className="font-bold text-lg">Interactive Parameter Sensitivity Testing</h3>
        </div>
        <p className="text-xs text-stone-500">
          Adjust startup capital or difficulty sliders below to instantly see your validation score recalculate in real time.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {/* Cost Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <label>Startup Capital</label>
              <span className="text-forest-700 font-bold">RM {cost.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="500"
              max="40000"
              step="500"
              value={cost}
              onChange={(e) => setCost(Number(e.target.value))}
              className="w-full accent-forest-600"
            />
            <span className="text-[10px] text-stone-400 block">&le;RM1,000 gives 5pts &bull; &gt;RM30,000 gives 1pt</span>
          </div>

          {/* Demand Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <label>Market Demand Rating</label>
              <span className="text-forest-700 font-bold">{demand} / 5</span>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              step="1"
              value={demand}
              onChange={(e) => setDemand(Number(e.target.value))}
              className="w-full accent-forest-600"
            />
            <span className="text-[10px] text-stone-400 block">1: Niche &bull; 5: Widespread buyer demand</span>
          </div>

          {/* Difficulty Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <label>Technical Difficulty</label>
              <span className="text-forest-700 font-bold">{difficulty} / 5</span>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              step="1"
              value={difficulty}
              onChange={(e) => setDifficulty(Number(e.target.value))}
              className="w-full accent-forest-600"
            />
            <span className="text-[10px] text-stone-400 block">Ease = (6 - Difficulty) &bull; Lower difficulty yields higher ease</span>
          </div>
        </div>
      </div>

      {/* Impact Card & SDG 9.B */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-gradient-to-br from-forest-50 to-emerald-50 rounded-3xl p-6 border border-emerald-200 shadow-sm space-y-4">
          <h4 className="font-bold text-forest-950 text-base">Annual Environmental Diversion Impact</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-emerald-100">
              <span className="text-[11px] font-semibold text-stone-500 uppercase">Estimated Waste Diverted</span>
              <div className="text-2xl font-black text-forest-900 mt-1">
                {(monthlyWasteKg * 12).toLocaleString()} kg / year
              </div>
              <span className="text-[10px] text-stone-400">Based on {monthlyWasteKg} kg monthly waste processing</span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-emerald-100">
              <span className="text-[11px] font-semibold text-stone-500 uppercase">Net CO₂ Reduction</span>
              <div className="text-2xl font-black text-emerald-700 mt-1">
                {Math.round(monthlyWasteKg * 12 * 1.3).toLocaleString()} kg CO₂e
              </div>
              <span className="text-[10px] text-stone-400">Lifecycle carbon avoidance estimate</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <SdgBadge size="lg" showDetail={true} />
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-forest-100">
        <button
          onClick={() => router.push('/garden')}
          className="text-xs font-semibold text-stone-600 hover:text-forest-800 min-h-[44px]"
        >
          View in Idea Garden
        </button>

        <button
          onClick={handleCreatePledgePage}
          className="w-full sm:w-auto px-8 py-3.5 bg-forest-700 hover:bg-forest-800 text-white font-bold rounded-xl shadow-lg transition flex items-center justify-center space-x-2 min-h-[48px]"
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
