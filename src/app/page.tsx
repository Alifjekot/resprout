'use client';

import React from 'react';
import Link from 'next/link';
import { Sprout, Camera, ArrowRight, Sparkles, Target, Zap, ShieldCheck, Heart } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import SdgBadge from '@/components/SdgBadge';
import PlantGraphic from '@/components/PlantGraphic';

export default function HomePage() {
  const { user, loginAsDemoMaker } = useAuth();

  return (
    <div className="space-y-12 pb-16">
      {/* Uiverse Hero Section with Mesh Glow and Frosted Layer */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-forest-900 via-forest-800 to-emerald-950 text-white p-7 sm:p-12 md:p-16 shadow-[0_20px_50px_rgba(20,50,30,0.3)] border border-emerald-500/20">
        {/* Ambient Decorative Blurs */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-emerald-400/20 blur-[90px] pointer-events-none animate-pulse" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-amber-400/15 blur-[80px] pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-6">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 text-xs font-bold text-emerald-200 shadow-[0_2px_12px_rgba(0,0,0,0.15)]">
            <Sparkles className="w-4 h-4 text-amber-300 animate-spin" style={{ animationDuration: '6s' }} />
            <span>AI-Driven Waste-to-Value Validation Platform</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.1]">
            Plant an idea. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-lime-200 to-amber-200 drop-shadow-[0_4px_16px_rgba(52,211,153,0.3)]">
              Grow a business.
            </span>
          </h1>

          <p className="text-forest-100 text-sm sm:text-base leading-relaxed max-w-xl font-normal">
            Photograph leftover agricultural or industrial waste. ReSprout identifies the material, generates 5 viable SCAMPER business models, scores them, and validates real demand through public pledge pages.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
            <Link
              href="/scan"
              className="uiverse-btn-emerald inline-flex items-center justify-center space-x-2.5 px-7 py-3.5 rounded-2xl font-black text-sm tracking-wide min-h-[50px]"
            >
              <Camera className="w-5 h-5 text-emerald-100" />
              <span>Start Scanning Waste</span>
              <ArrowRight className="w-4 h-4 ml-0.5" />
            </Link>

            <Link
              href="/garden"
              className="uiverse-btn-glass inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-2xl font-bold text-xs text-forest-900 min-h-[50px]"
            >
              <Sprout className="w-4 h-4 text-emerald-700" />
              <span>Explore Idea Garden</span>
            </Link>
          </div>

          <div className="pt-3 flex items-center space-x-2.5 text-xs text-forest-200 font-medium">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
            </span>
            <span>Preloaded with 5 Malaysian Hero Materials (Coconut husk, Coffee grounds, etc.)</span>
          </div>
        </div>

        {/* Floating Plant Showcase Widget */}
        <div className="hidden lg:flex absolute right-12 bottom-12 flex-col items-center p-6 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-[0_12px_35px_rgba(0,0,0,0.25)] hover:scale-105 transition-transform duration-500">
          <PlantGraphic stage="tree" size="lg" />
          <div className="text-center mt-3 space-y-0.5">
            <span className="text-xs font-black text-white block">Interactive Growth Engine</span>
            <span className="text-[11px] text-emerald-200">Seed &rarr; Sprout &rarr; Sapling &rarr; Tree &rarr; Forest</span>
          </div>
        </div>
      </section>

      {/* 5-Step Process with Uiverse Cards */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-forest-700 uppercase tracking-wider mb-1">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>Streamlined Validation Workflow</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-forest-950 tracking-tight">The 5-Step ReSprout Flow</h2>
          </div>
          <SdgBadge size="sm" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { step: '01', title: 'AI Vision Scan', desc: 'Identify organic & industrial waste via camera or catalogue.', tag: 'M2 Scan' },
            { step: '02', title: 'SCAMPER Ideation', desc: 'Synthesize 5 low-capital Malaysian business ideas under RM 30k.', tag: 'M3 Generator' },
            { step: '03', title: 'Algorithmic Score', desc: 'Compute 0-100 feasibility rating across demand, cost & SDG.', tag: 'M4 Scoring' },
            { step: '04', title: 'Fake-Door Page', desc: 'Auto-publish landing page with QR code for real buyers.', tag: 'M6 Validation' },
            { step: '05', title: 'Watch Tree Grow', desc: 'As pledges arrive, advance from Seed to Sprout to Forest.', tag: 'M5 Garden' },
          ].map((item) => (
            <div
              key={item.step}
              className="uiverse-card rounded-3xl p-5 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="w-9 h-9 rounded-2xl bg-gradient-to-br from-emerald-100 to-forest-100 text-forest-900 font-black text-xs flex items-center justify-center border border-forest-200/50 shadow-inner group-hover:scale-110 transition-transform">
                    {item.step}
                  </span>
                  <span className="text-[10px] font-extrabold text-forest-700 bg-forest-50 border border-forest-200/60 px-2 py-0.5 rounded-full">
                    {item.tag}
                  </span>
                </div>
                <h3 className="font-extrabold text-forest-950 text-sm mb-1.5 group-hover:text-emerald-700 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-stone-500 leading-relaxed font-normal">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Hero Materials Section & Academic SDG Card */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 uiverse-card rounded-[2rem] p-6 sm:p-8 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-xl font-black text-forest-950">Preloaded Malaysian Hero Materials</h3>
              <p className="text-xs text-stone-500">
                Click any waste item below to instantly test AI vision identification and SCAMPER ideation:
              </p>
            </div>
            <span className="self-start sm:self-auto text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-full font-bold shadow-xs">
              Instant Demo Mode
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
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
                className="group p-3.5 rounded-2xl bg-white/70 border border-stone-200/80 hover:border-emerald-400 hover:bg-emerald-50/50 hover:shadow-[0_8px_20px_rgba(16,185,129,0.08)] transition-all flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-extrabold text-xs text-stone-900 group-hover:text-emerald-800 transition-colors">
                      {mat.name}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-stone-500 bg-stone-100 px-1.5 py-0.5 rounded-md">
                      {mat.cat}
                    </span>
                  </div>
                  <span className="text-xs text-stone-500 block mt-0.5">{mat.idea}</span>
                </div>
                <div className="w-8 h-8 rounded-xl bg-stone-100 group-hover:bg-emerald-500 group-hover:text-white text-stone-400 flex items-center justify-center transition-all">
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* SDG Target 9.B Academic Card */}
        <div className="uiverse-card rounded-[2rem] p-6 sm:p-8 flex flex-col justify-between space-y-4 bg-gradient-to-br from-amber-50/80 to-orange-50/60 border-amber-200/70">
          <div className="space-y-4">
            <SdgBadge size="lg" showDetail={true} />
            <div className="space-y-2 pt-2">
              <h4 className="font-extrabold text-sm text-amber-950">Academic Target Alignment</h4>
              <p className="text-xs text-amber-900/80 leading-relaxed">
                ReSprout directly supports SDG 9.B by empowering Malaysian student entrepreneurs and local makers to transform agricultural and industrial by-products into high-value commercial goods.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-amber-200/60 flex items-center justify-between">
            <span className="text-[11px] font-bold text-amber-800 block">
              UTHM &bull; BIK 20803
            </span>
            <span className="text-[10px] font-black uppercase text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded-full">
              Target 9.B
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
