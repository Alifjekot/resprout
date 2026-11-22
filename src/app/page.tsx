'use client';

import React from 'react';
import Link from 'next/link';
import { Sprout, Camera, ArrowRight, ShieldCheck, TrendingUp, Sparkles, Award } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import SdgBadge from '@/components/SdgBadge';
import PlantGraphic from '@/components/PlantGraphic';

export default function HomePage() {
  const { user, loginAsDemoMaker } = useAuth();

  return (
    <div className="space-y-12 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-forest-800 via-forest-700 to-forest-900 text-white p-6 sm:p-10 md:p-14 shadow-xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-72 h-72 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-6">
          <div className="inline-flex items-center space-x-2 bg-forest-600/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-forest-400/30 text-xs font-semibold text-emerald-200">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>AI-Powered Waste-to-Value Validation</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Plant an idea. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-lime-200 to-amber-200">
              Grow a business.
            </span>
          </h1>

          <p className="text-forest-100 text-sm sm:text-base leading-relaxed max-w-xl">
            Photograph leftover agricultural or industrial waste. ReSprout identifies the material, generates 5 viable SCAMPER business models, scores them, and validates real demand through public pledge pages.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <Link
              href="/scan"
              className="inline-flex items-center justify-center space-x-2 px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-forest-950 font-bold rounded-xl shadow-lg transition-transform active:scale-95 min-h-[48px]"
            >
              <Camera className="w-5 h-5" />
              <span>Start Scanning Waste</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>

            <Link
              href="/garden"
              className="inline-flex items-center justify-center space-x-2 px-6 py-3.5 bg-forest-900/60 hover:bg-forest-900/80 text-white font-semibold rounded-xl border border-forest-500/30 transition min-h-[48px]"
            >
              <Sprout className="w-5 h-5 text-emerald-300" />
              <span>Visit Idea Garden</span>
            </Link>
          </div>

          <div className="pt-4 flex items-center space-x-3 text-xs text-forest-200">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Demo Mode ready with 5 Malaysian Hero Materials (Coconut husk, Coffee grounds, etc.)</span>
          </div>
        </div>

        {/* Floating Tree Showcase on larger displays */}
        <div className="hidden lg:flex absolute right-12 bottom-10 flex-col items-center p-5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15">
          <PlantGraphic stage="tree" size="lg" />
          <span className="text-xs font-semibold text-emerald-200 mt-2">Idea Growth Lifecycle</span>
          <span className="text-[11px] text-forest-200">Seed &rarr; Sprout &rarr; Sapling &rarr; Tree &rarr; Forest</span>
        </div>
      </section>

      {/* 5-Step End-to-End Flow */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <h2 className="text-2xl font-bold text-forest-950 tracking-tight">The 5-Step ReSprout Flow</h2>
            <p className="text-sm text-stone-600">Built specifically for BIK 20803 & SDG 9 Target 9.B</p>
          </div>
          <SdgBadge size="sm" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { step: '1', title: 'AI Vision Scan', desc: 'Identify organic & industrial waste via photo or catalogue.', tag: 'M2 Scan' },
            { step: '2', title: 'SCAMPER Ideation', desc: 'Generate 5 low-capital Malaysian business ideas.', tag: 'M3 Generator' },
            { step: '3', title: 'Algorithmic Score', desc: 'Compute 0-100 feasibility against demand, capital & SDG.', tag: 'M4 Scoring' },
            { step: '4', title: 'Pledge Page', desc: 'Publish fake-door landing page with QR code for real buyers.', tag: 'M6 Validation' },
            { step: '5', title: 'Watch Tree Grow', desc: 'As pledges arrive, advance from Seed to Sprout to Forest.', tag: 'M5 Garden' },
          ].map((item) => (
            <div
              key={item.step}
              className="bg-white rounded-2xl p-5 border border-forest-100 shadow-sm flex flex-col justify-between hover:border-forest-300 hover:shadow-md transition"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="w-8 h-8 rounded-full bg-forest-100 text-forest-800 font-black text-sm flex items-center justify-center">
                    {item.step}
                  </span>
                  <span className="text-[10px] font-bold text-earth-600 bg-earth-50 border border-earth-200 px-2 py-0.5 rounded">
                    {item.tag}
                  </span>
                </div>
                <h3 className="font-bold text-forest-950 text-base mb-1.5">{item.title}</h3>
                <p className="text-xs text-stone-600 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Hero Materials & SDG Impact */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-forest-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-forest-950">Preloaded Hero Materials</h3>
            <span className="text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-full font-semibold">
              Instant Demo Mode
            </span>
          </div>
          <p className="text-xs text-stone-600">
            In demo mode, scans of these materials return pre-tested business models instantly without requiring third-party API keys:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {[
              { name: 'Coconut husk', cat: 'Agri', idea: 'Biodegradable seedling trays' },
              { name: 'Used coffee grounds', cat: 'Food', idea: 'Gourmet oyster mushroom kits' },
              { name: 'Palm kernel shell', cat: 'Agri', idea: 'Activated charcoal filter blocks' },
              { name: 'Used cooking oil', cat: 'Oil', idea: 'Handmade soap and candles' },
              { name: 'Fabric scraps', cat: 'Textile', idea: 'Patchwork tech accessories' },
            ].map((mat) => (
              <Link
                key={mat.name}
                href={`/scan?preset=${encodeURIComponent(mat.name)}`}
                className="group p-3.5 rounded-xl border border-stone-200 hover:border-forest-400 hover:bg-forest-50/40 transition flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-sm text-stone-900 group-hover:text-forest-700">{mat.name}</span>
                    <span className="text-[10px] uppercase font-bold text-stone-500 bg-stone-100 px-1.5 py-0.5 rounded">
                      {mat.cat}
                    </span>
                  </div>
                  <span className="text-xs text-stone-500 block mt-0.5">{mat.idea}</span>
                </div>
                <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-forest-600 group-hover:translate-x-0.5 transition" />
              </Link>
            ))}
          </div>
        </div>

        {/* SDG Target Card */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-6 sm:p-8 border border-amber-200/80 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <SdgBadge size="lg" showDetail={true} />
            <div className="space-y-2 pt-2">
              <h4 className="font-bold text-sm text-amber-950">Academic Alignment</h4>
              <p className="text-xs text-amber-900/80 leading-relaxed">
                ReSprout directly supports SDG 9.B by empowering Malaysian student entrepreneurs and local makers to transform agricultural and industrial by-products into high-value commercial goods.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-amber-200/60">
            <span className="text-[11px] font-semibold text-amber-800 block">
              Universiti Tun Hussein Onn Malaysia (UTHM)
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
