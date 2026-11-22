'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Wrench,
  Clock,
  Package,
  Printer,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  ShieldAlert,
  ChevronRight,
  Layers,
} from 'lucide-react';
import { MakerGuide } from '@/lib/types';
import SdgBadge from '@/components/SdgBadge';

function GuideContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const ideaId = searchParams.get('idea_id') || 'idea-tree-demo';

  const [guide, setGuide] = useState<MakerGuide | null>(null);
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});
  const [activeTab, setActiveTab] = useState<'steps' | 'materials' | 'pitfalls'>('steps');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchGuide();
  }, [ideaId]);

  const fetchGuide = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/guide?idea_id=${ideaId}`);
      if (!res.ok) throw new Error('Failed to load guide');
      const data = await res.json();
      setGuide(data.guide);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleStep = (stepNumber: number) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [stepNumber]: !prev[stepNumber],
    }));
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto shadow-md" />
        <p className="text-xs font-bold text-stone-500 uppercase tracking-widest">
          Loading Step-by-Step Maker Blueprint...
        </p>
      </div>
    );
  }

  if (!guide) {
    return (
      <div className="max-w-md mx-auto py-20 text-center space-y-4">
        <h2 className="text-xl font-black text-stone-900">Guide Not Found</h2>
        <p className="text-xs text-stone-500">Could not locate production recipe for this idea.</p>
        <Link href="/ideas" className="uiverse-btn-emerald px-6 py-2.5 rounded-xl text-xs font-bold inline-block">
          Return to Ideas
        </Link>
      </div>
    );
  }

  const completedCount = Object.values(completedSteps).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / guide.steps.length) * 100);

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-forest-100 pb-5">
        <div>
          <div className="inline-flex items-center space-x-2 bg-emerald-50 text-emerald-800 border border-emerald-200/80 text-xs font-black px-3.5 py-1 rounded-full mb-1">
            <Wrench className="w-3.5 h-3.5 text-emerald-600" />
            <span>Maker Production Recipe & Blueprint</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-forest-950 tracking-tight">
            How to Make: <span className="text-emerald-700">{guide.ideaName}</span>
          </h1>
          <p className="text-xs sm:text-sm text-stone-500">
            A comprehensive step-by-step production recipe designed for Malaysian student teams and entrepreneurs.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => window.print()}
            className="uiverse-btn-glass px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center space-x-1.5 min-h-[44px]"
          >
            <Printer className="w-4 h-4" />
            <span>Print Blueprint</span>
          </button>
          <button
            onClick={() => router.back()}
            className="uiverse-btn-glass px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center space-x-1.5 min-h-[44px]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
        </div>
      </div>

      {/* Blueprint Spec Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="uiverse-card rounded-3xl p-4">
          <span className="text-[10px] text-stone-400 font-extrabold uppercase block">Batch Duration</span>
          <span className="font-black text-forest-950 text-base mt-1 flex items-center space-x-1.5">
            <Clock className="w-4 h-4 text-emerald-600" />
            <span>{guide.estProductionTime}</span>
          </span>
        </div>

        <div className="uiverse-card rounded-3xl p-4">
          <span className="text-[10px] text-stone-400 font-extrabold uppercase block">Batch Yield</span>
          <span className="font-black text-forest-950 text-base mt-1 flex items-center space-x-1.5">
            <Package className="w-4 h-4 text-amber-600" />
            <span>{guide.batchYield}</span>
          </span>
        </div>

        <div className="uiverse-card rounded-3xl p-4">
          <span className="text-[10px] text-stone-400 font-extrabold uppercase block">Startup Capital</span>
          <span className="font-black text-emerald-800 text-base mt-1 block">
            RM {guide.estStartupCostRm.toLocaleString()}
          </span>
        </div>

        <div className="uiverse-card rounded-3xl p-4">
          <span className="text-[10px] text-stone-400 font-extrabold uppercase block">Difficulty</span>
          <span className="font-black text-forest-950 text-base mt-1 block">
            {'★'.repeat(guide.difficulty)}{'☆'.repeat(5 - guide.difficulty)} ({guide.difficulty}/5)
          </span>
        </div>
      </div>

      {/* Interactive Progress Bar */}
      <div className="uiverse-card rounded-3xl p-5 space-y-2">
        <div className="flex items-center justify-between text-xs font-black text-forest-950">
          <span>Production Milestone Completion</span>
          <span className="text-emerald-700">
            {completedCount} of {guide.steps.length} Steps Completed ({progressPercent}%)
          </span>
        </div>
        <div className="w-full h-3.5 rounded-full bg-stone-100 border border-stone-200 overflow-hidden p-0.5">
          <div
            className="h-full bg-gradient-to-r from-emerald-400 to-forest-600 rounded-full transition-all duration-500 shadow-sm"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center space-x-2 border-b border-stone-200 pb-2">
        <button
          onClick={() => setActiveTab('steps')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center space-x-2 ${
            activeTab === 'steps' ? 'bg-forest-900 text-white shadow-md' : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Step-by-Step Instructions ({guide.steps.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('materials')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center space-x-2 ${
            activeTab === 'materials' ? 'bg-forest-900 text-white shadow-md' : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Bill of Materials & Equipment</span>
        </button>

        <button
          onClick={() => setActiveTab('pitfalls')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center space-x-2 ${
            activeTab === 'pitfalls' ? 'bg-forest-900 text-white shadow-md' : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Common Pitfalls & QC</span>
        </button>
      </div>

      {/* TAB 1: Steps */}
      {activeTab === 'steps' && (
        <div className="space-y-5">
          {guide.steps.map((step) => {
            const isDone = completedSteps[step.stepNumber];
            return (
              <div
                key={step.stepNumber}
                className={`uiverse-card rounded-[2.2rem] p-7 transition-all space-y-4 ${
                  isDone ? 'border-emerald-400 bg-emerald-50/30' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start space-x-4">
                    <button
                      onClick={() => toggleStep(step.stepNumber)}
                      className={`w-9 h-9 rounded-2xl flex items-center justify-center font-black text-sm transition-all shadow-xs ${
                        isDone
                          ? 'bg-emerald-600 text-white'
                          : 'bg-stone-100 text-stone-700 hover:bg-emerald-100 hover:text-emerald-800'
                      }`}
                    >
                      {isDone ? <CheckCircle2 className="w-5 h-5" /> : step.stepNumber}
                    </button>
                    <div>
                      <h3
                        className={`text-lg font-black ${
                          isDone ? 'line-through text-stone-400' : 'text-forest-950'
                        }`}
                      >
                        Step {step.stepNumber}: {step.title}
                      </h3>
                      <p className="text-xs text-stone-600 mt-1 leading-relaxed font-normal">
                        {step.description}
                      </p>
                    </div>
                  </div>

                  <span className="text-xs font-bold text-stone-500 bg-stone-100 px-3 py-1 rounded-full whitespace-nowrap">
                    {step.duration}
                  </span>
                </div>

                {/* Instructions */}
                <div className="pl-13 space-y-2 text-xs">
                  <span className="text-[10px] uppercase font-black tracking-wider text-emerald-800 block">
                    Execution Steps:
                  </span>
                  <ul className="list-disc list-inside space-y-1.5 text-stone-700 pl-1">
                    {step.keyInstructions.map((ins, idx) => (
                      <li key={idx} className="leading-relaxed">
                        {ins}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Equipment & Tips */}
                <div className="pl-13 pt-1 space-y-2">
                  {step.equipmentNeeded && step.equipmentNeeded.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-bold text-stone-400">Required tools:</span>
                      {step.equipmentNeeded.map((eq, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] font-bold text-forest-800 bg-forest-50 px-2.5 py-0.5 rounded-lg border border-forest-100"
                        >
                          {eq}
                        </span>
                      ))}
                    </div>
                  )}

                  {step.safetyTips && (
                    <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200/80 text-xs text-amber-900 flex items-start space-x-2.5">
                      <ShieldAlert className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                      <span>
                        <strong>Safety Note:</strong> {step.safetyTips}
                      </span>
                    </div>
                  )}

                  {step.proTip && (
                    <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200/80 text-xs text-emerald-900 flex items-start space-x-2.5">
                      <Lightbulb className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>
                        <strong>Malaysian Maker Pro-Tip:</strong> {step.proTip}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: Materials */}
      {activeTab === 'materials' && (
        <div className="space-y-6">
          <div className="uiverse-card rounded-[2.2rem] p-7 space-y-4">
            <h3 className="font-black text-base text-forest-950 uppercase tracking-wider">
              Raw Materials & Consumables per Batch
            </h3>
            <div className="overflow-x-auto rounded-2xl border border-stone-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-black uppercase text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Material / Input</th>
                    <th className="py-3 px-4">Quantity</th>
                    <th className="py-3 px-4">Estimated Cost</th>
                    <th className="py-3 px-4">Malaysian Sourcing Channel</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {guide.materialsList.map((m, idx) => (
                    <tr key={idx} className="hover:bg-stone-50/60">
                      <td className="py-3 px-4 font-bold text-forest-950">{m.name}</td>
                      <td className="py-3 px-4 text-stone-600">{m.quantity}</td>
                      <td className="py-3 px-4 font-black text-emerald-800">
                        {m.estCostRm === 0 ? 'Free (Waste Sourced)' : `RM ${m.estCostRm}`}
                      </td>
                      <td className="py-3 px-4 text-stone-500 text-[11px]">{m.source}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="uiverse-card rounded-[2.2rem] p-7 space-y-4">
            <h3 className="font-black text-base text-forest-950 uppercase tracking-wider">
              Workshop Equipment & Low-Cost Alternatives
            </h3>
            <div className="space-y-3">
              {guide.toolsRequired.map((tool, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                >
                  <div>
                    <span className="font-black text-forest-950 block text-sm">{tool.name}</span>
                    {tool.canBeSubstitutedWith && (
                      <span className="text-xs text-stone-500 block mt-0.5">
                        Budget DIY alternative: <strong>{tool.canBeSubstitutedWith}</strong>
                      </span>
                    )}
                  </div>
                  <span className="font-black text-emerald-800 bg-white px-3 py-1 rounded-xl border border-stone-200 shadow-2xs whitespace-nowrap self-start sm:self-auto">
                    RM {tool.estCostRm.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-amber-50/80 border border-amber-200/80 space-y-3">
            <h4 className="font-black text-xs text-amber-950 uppercase tracking-wider flex items-center space-x-1.5">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              <span>Safety Gear (PPE) Required</span>
            </h4>
            <div className="flex flex-wrap gap-2">
              {guide.safetyGear.map((gear, idx) => (
                <span
                  key={idx}
                  className="text-xs font-bold text-amber-900 bg-white px-3.5 py-1.5 rounded-xl border border-amber-200 shadow-2xs"
                >
                  {gear}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Pitfalls */}
      {activeTab === 'pitfalls' && (
        <div className="space-y-5">
          <div className="uiverse-card rounded-[2.2rem] p-7 space-y-4">
            <h3 className="font-black text-base text-forest-950 uppercase tracking-wider">
              Critical Maker Pitfalls to Avoid
            </h3>
            <div className="space-y-3">
              {guide.commonPitfalls.map((pitfall, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-rose-50/60 border border-rose-200 text-xs text-rose-950 flex items-start space-x-3"
                >
                  <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                  <p className="leading-relaxed font-medium">{pitfall}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center">
            <SdgBadge size="lg" showDetail={true} />
          </div>
        </div>
      )}

      {/* Bottom CTA to Score / Validation */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-forest-100">
        <Link
          href={`/ideas?material=${encodeURIComponent(guide.materialName)}`}
          className="uiverse-btn-glass px-6 py-3 rounded-2xl text-xs font-bold min-h-[44px]"
        >
          View All 5 Ideas
        </Link>

        <Link
          href={`/score?idea_id=${guide.ideaId}`}
          className="uiverse-btn-emerald w-full sm:w-auto px-8 py-3.5 rounded-2xl font-black text-sm tracking-wide shadow-lg flex items-center justify-center space-x-2.5 min-h-[50px]"
        >
          <span>Score This Idea in Validation Engine (M4)</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

export default function GuidePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-stone-500">Loading recipe guide...</div>}>
      <GuideContent />
    </Suspense>
  );
}
