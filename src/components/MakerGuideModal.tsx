'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Wrench,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Printer,
  X,
  Sparkles,
  ShieldAlert,
  ChevronRight,
  Package,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { MakerGuide } from '@/lib/types';

interface MakerGuideModalProps {
  guide: MakerGuide | null;
  isOpen: boolean;
  onClose: () => void;
  onScoreIdea?: (ideaId: string) => void;
}

export default function MakerGuideModal({
  guide,
  isOpen,
  onClose,
  onScoreIdea,
}: MakerGuideModalProps) {
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});
  const [activeTab, setActiveTab] = useState<'steps' | 'materials' | 'pitfalls'>('steps');

  if (!isOpen || !guide) return null;

  const toggleStep = (stepNumber: number) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [stepNumber]: !prev[stepNumber],
    }));
  };

  const completedCount = Object.values(completedSteps).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / guide.steps.length) * 100);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-forest-950/50 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white/98 backdrop-blur-2xl rounded-[2.5rem] max-w-3xl w-full p-6 sm:p-9 space-y-6 max-h-[92vh] overflow-y-auto shadow-[0_25px_60px_rgba(0,0,0,0.3)] border border-white/80 relative text-stone-900">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-2xl text-stone-400 hover:text-stone-800 hover:bg-stone-100 min-h-[44px] min-w-[44px] flex items-center justify-center transition"
          aria-label="Close Guide"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Blueprint Header */}
        <div className="space-y-3 border-b border-forest-100 pb-5 pr-12">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center space-x-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200/80 text-xs font-black px-3.5 py-1 rounded-full shadow-xs">
              <Wrench className="w-3.5 h-3.5 text-emerald-600" />
              <span>Step-by-Step Maker Blueprint</span>
            </span>
            <span className="text-[11px] font-extrabold text-stone-500 bg-stone-100 px-2.5 py-0.5 rounded-full uppercase">
              Material: {guide.materialName}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-forest-950 tracking-tight leading-tight">
            How to Make: <span className="text-emerald-700">{guide.ideaName}</span>
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1 text-xs">
            <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/70">
              <span className="text-[10px] text-stone-400 font-extrabold uppercase block">Est. Batch Time</span>
              <span className="font-black text-forest-950 mt-0.5 flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5 text-emerald-600" />
                <span>{guide.estProductionTime}</span>
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/70">
              <span className="text-[10px] text-stone-400 font-extrabold uppercase block">Batch Output</span>
              <span className="font-black text-forest-950 mt-0.5 flex items-center space-x-1">
                <Package className="w-3.5 h-3.5 text-amber-600" />
                <span>{guide.batchYield}</span>
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/70">
              <span className="text-[10px] text-stone-400 font-extrabold uppercase block">Capital Setup</span>
              <span className="font-black text-emerald-800 mt-0.5">
                RM {guide.estStartupCostRm.toLocaleString()}
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/70">
              <span className="text-[10px] text-stone-400 font-extrabold uppercase block">Difficulty Level</span>
              <span className="font-black text-forest-950 mt-0.5">
                {'★'.repeat(guide.difficulty)}{'☆'.repeat(5 - guide.difficulty)} ({guide.difficulty}/5)
              </span>
            </div>
          </div>
        </div>

        {/* Interactive Progress Bar */}
        <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-100/80 space-y-2">
          <div className="flex items-center justify-between text-xs font-black text-emerald-950">
            <span>Production Progress Tracker</span>
            <span>
              {completedCount} of {guide.steps.length} Steps Completed ({progressPercent}%)
            </span>
          </div>
          <div className="w-full h-3 rounded-full bg-white border border-emerald-200 overflow-hidden p-0.5">
            <div
              className="h-full bg-gradient-to-r from-emerald-400 to-forest-600 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center space-x-2 border-b border-stone-200/70 pb-1">
          <button
            onClick={() => setActiveTab('steps')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all min-h-[40px] flex items-center space-x-1.5 ${
              activeTab === 'steps'
                ? 'bg-forest-900 text-white shadow-xs'
                : 'text-stone-500 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Step-by-Step Recipe ({guide.steps.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('materials')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all min-h-[40px] flex items-center space-x-1.5 ${
              activeTab === 'materials'
                ? 'bg-forest-900 text-white shadow-xs'
                : 'text-stone-500 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Bill of Materials & Tools</span>
          </button>

          <button
            onClick={() => setActiveTab('pitfalls')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all min-h-[40px] flex items-center space-x-1.5 ${
              activeTab === 'pitfalls'
                ? 'bg-forest-900 text-white shadow-xs'
                : 'text-stone-500 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Pitfalls & QC</span>
          </button>
        </div>

        {/* TAB 1: Step-by-Step Instructions */}
        {activeTab === 'steps' && (
          <div className="space-y-4">
            {guide.steps.map((step) => {
              const isDone = completedSteps[step.stepNumber];
              return (
                <div
                  key={step.stepNumber}
                  className={`p-5 rounded-3xl border transition-all space-y-3 ${
                    isDone
                      ? 'bg-emerald-50/40 border-emerald-300/80 shadow-xs'
                      : 'bg-white border-stone-200/80 hover:border-emerald-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start space-x-3">
                      <button
                        onClick={() => toggleStep(step.stepNumber)}
                        className={`mt-0.5 w-7 h-7 rounded-full flex items-center justify-center font-black text-xs transition-all ${
                          isDone
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-stone-100 text-stone-600 hover:bg-emerald-100 hover:text-emerald-800'
                        }`}
                        title={isDone ? 'Mark step as incomplete' : 'Mark step as complete'}
                      >
                        {isDone ? <CheckCircle2 className="w-4 h-4" /> : step.stepNumber}
                      </button>

                      <div>
                        <div className="flex items-center space-x-2">
                          <h3
                            className={`font-black text-base ${
                              isDone ? 'line-through text-stone-500' : 'text-forest-950'
                            }`}
                          >
                            Step {step.stepNumber}: {step.title}
                          </h3>
                        </div>
                        <p className="text-xs text-stone-600 mt-0.5 leading-relaxed font-normal">
                          {step.description}
                        </p>
                      </div>
                    </div>

                    <span className="text-[11px] font-bold text-stone-500 bg-stone-100 px-2.5 py-1 rounded-full whitespace-nowrap">
                      {step.duration}
                    </span>
                  </div>

                  {/* Key Instruction Bullet Points */}
                  <div className="pl-10 space-y-1.5 text-xs text-stone-700">
                    <span className="text-[10px] uppercase font-black tracking-wider text-emerald-800 block">
                      Instructions:
                    </span>
                    <ul className="list-disc list-inside space-y-1 text-stone-600 pl-1">
                      {step.keyInstructions.map((instruction, idx) => (
                        <li key={idx} className="leading-relaxed">
                          {instruction}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Equipment & Safety / Pro Tips */}
                  <div className="pl-10 pt-1 space-y-2">
                    {step.equipmentNeeded && step.equipmentNeeded.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[10px] font-bold text-stone-400">Tools needed:</span>
                        {step.equipmentNeeded.map((eq, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] font-bold text-forest-800 bg-forest-50 px-2 py-0.5 rounded-md border border-forest-100"
                          >
                            {eq}
                          </span>
                        ))}
                      </div>
                    )}

                    {step.safetyTips && (
                      <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200/80 text-[11px] text-amber-900 flex items-start space-x-2">
                        <ShieldAlert className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                        <span>
                          <strong>Safety:</strong> {step.safetyTips}
                        </span>
                      </div>
                    )}

                    {step.proTip && (
                      <div className="p-2.5 rounded-xl bg-emerald-50/80 border border-emerald-200/80 text-[11px] text-emerald-900 flex items-start space-x-2">
                        <Lightbulb className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span>
                          <strong>Pro-Tip:</strong> {step.proTip}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 2: Bill of Materials & Tools Required */}
        {activeTab === 'materials' && (
          <div className="space-y-6">
            {/* Raw Materials Table */}
            <div className="space-y-2">
              <h3 className="font-black text-sm text-forest-950 uppercase tracking-wider">
                Raw Materials & Consumables per Batch
              </h3>
              <div className="overflow-x-auto rounded-2xl border border-stone-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-black uppercase text-[10px]">
                    <tr>
                      <th className="py-2.5 px-3">Item Name</th>
                      <th className="py-2.5 px-3">Batch Quantity</th>
                      <th className="py-2.5 px-3">Est. Cost</th>
                      <th className="py-2.5 px-3">Local Malaysian Source</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {guide.materialsList.map((m, idx) => (
                      <tr key={idx} className="hover:bg-stone-50/60">
                        <td className="py-2.5 px-3 font-bold text-forest-950">{m.name}</td>
                        <td className="py-2.5 px-3 text-stone-600">{m.quantity}</td>
                        <td className="py-2.5 px-3 font-black text-emerald-800">
                          {m.estCostRm === 0 ? 'Free (Waste)' : `RM ${m.estCostRm}`}
                        </td>
                        <td className="py-2.5 px-3 text-stone-500 text-[11px]">{m.source}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Tools & Workshop Equipment */}
            <div className="space-y-2">
              <h3 className="font-black text-sm text-forest-950 uppercase tracking-wider">
                Workshop Tools & DIY Substitutions
              </h3>
              <div className="space-y-2">
                {guide.toolsRequired.map((tool, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                  >
                    <div>
                      <span className="font-black text-forest-950 block">{tool.name}</span>
                      {tool.canBeSubstitutedWith && (
                        <span className="text-[11px] text-stone-500 block mt-0.5">
                          Low-cost DIY substitute: <strong>{tool.canBeSubstitutedWith}</strong>
                        </span>
                      )}
                    </div>
                    <span className="font-black text-emerald-800 bg-white px-2.5 py-1 rounded-lg border border-stone-200 shadow-2xs whitespace-nowrap self-start sm:self-auto">
                      RM {tool.estCostRm.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Safety Gear PPE */}
            <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 space-y-2">
              <h4 className="font-black text-xs text-amber-950 uppercase tracking-wider flex items-center space-x-1.5">
                <ShieldAlert className="w-4 h-4 text-amber-600" />
                <span>Required Personal Protective Equipment (PPE)</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {guide.safetyGear.map((gear, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-bold text-amber-900 bg-white px-3 py-1 rounded-xl border border-amber-200 shadow-2xs"
                  >
                    {gear}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Common Pitfalls & Quality Control */}
        {activeTab === 'pitfalls' && (
          <div className="space-y-4">
            <h3 className="font-black text-sm text-forest-950 uppercase tracking-wider">
              Common Production Mistakes & Quality Control Checklist
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

            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 space-y-1.5">
              <span className="font-black text-emerald-900 block uppercase tracking-wider">
                SDG 9.B Waste-to-Value Validation Standard
              </span>
              <p className="leading-relaxed">
                By manufacturing locally using domestic waste by-products, your prototype demonstrates Target 9.B in action: building high-value, small-scale industrial diversification.
              </p>
            </div>
          </div>
        )}

        {/* Bottom Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-forest-100">
          <button
            onClick={handlePrint}
            className="uiverse-btn-glass w-full sm:w-auto px-5 py-2.5 rounded-2xl text-xs font-bold flex items-center justify-center space-x-1.5 min-h-[44px]"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save PDF Recipe</span>
          </button>

          <div className="flex items-center space-x-2.5 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="uiverse-btn-glass flex-1 sm:flex-none px-5 py-2.5 rounded-2xl text-xs font-bold min-h-[44px]"
            >
              Done
            </button>

            {onScoreIdea && (
              <button
                onClick={() => {
                  onClose();
                  onScoreIdea(guide.ideaId);
                }}
                className="uiverse-btn-emerald flex-1 sm:flex-none px-6 py-2.5 rounded-2xl text-xs font-black shadow-md flex items-center justify-center space-x-1.5 min-h-[44px]"
              >
                <span>Score Feasibility (M4)</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
