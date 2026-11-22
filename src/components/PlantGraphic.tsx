'use client';

import React from 'react';
import { PlantStage } from '@/lib/types';
import { Sparkles } from 'lucide-react';

interface PlantGraphicProps {
  stage: PlantStage;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isAnimating?: boolean;
}

export default function PlantGraphic({ stage, size = 'md', isAnimating = false }: PlantGraphicProps) {
  const sizeClasses = {
    sm: 'w-14 h-14',
    md: 'w-24 h-24',
    lg: 'w-36 h-36',
    xl: 'w-48 h-48',
  };

    const stageThemes: Record<PlantStage, { badge: string; text: string; bg: string; aura: string; ringColor: string }> = {
      seed: {
        badge: 'bg-amber-50 text-amber-800 border-amber-300 shadow-amber-200/50',
        text: 'Seed',
        bg: 'from-amber-100/70 via-stone-50 to-amber-50',
        aura: 'rgba(217, 119, 6, 0.25)',
        ringColor: '#d97706',
      },
      sprout: {
        badge: 'bg-lime-50 text-lime-900 border-lime-300 shadow-lime-200/50',
        text: 'Sprout',
        bg: 'from-lime-100/70 via-emerald-50 to-lime-50',
        aura: 'rgba(101, 163, 13, 0.3)',
        ringColor: '#65a30d',
      },
      sapling: {
        badge: 'bg-emerald-50 text-emerald-900 border-emerald-300 shadow-emerald-200/50',
        text: 'Sapling',
        bg: 'from-emerald-100/80 via-teal-50 to-emerald-50',
        aura: 'rgba(16, 185, 129, 0.35)',
        ringColor: '#10b981',
      },
      tree: {
        badge: 'bg-forest-100 text-forest-900 border-forest-400 shadow-forest-200/60 font-bold',
        text: 'Tree',
        bg: 'from-forest-100 via-emerald-50 to-green-100',
        aura: 'rgba(52, 107, 71, 0.4)',
        ringColor: '#346b47',
      },
      forest: {
        badge: 'bg-gradient-to-r from-emerald-500 to-forest-600 text-white border-emerald-400 shadow-emerald-400/50 font-black',
        text: 'Forest',
        bg: 'from-emerald-200/80 via-green-100 to-teal-100',
        aura: 'rgba(5, 150, 105, 0.5)',
        ringColor: '#059669',
      },
    };

  const current = stageThemes[stage];

  const renderSvg = () => {
    switch (stage) {
      case 'seed':
        return (
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
              {/* Soft ground shadows */}
              <ellipse cx="50" cy="84" rx="36" ry="10" fill="#704e38" opacity="0.4" />
              <ellipse cx="50" cy="80" rx="30" ry="7" fill="#5d4132" />
              {/* Organic Seed with subtle gradient */}
              <g transform="translate(50, 68) rotate(-15)">
                <path
                  d="M0,-14 C10,-14 14,-2 9,9 C4,18 -4,18 -9,9 C-14,-2 -10,-14 0,-14 Z"
                  fill="url(#seedGrad)"
                  stroke="#4f372c"
                  strokeWidth="2"
                />
                <path d="M-2,-7 C2,-3 2,5 -1,9" stroke="#edd8be" strokeWidth="1.8" strokeLinecap="round" />
              </g>
              <circle cx="56" cy="46" r="2.5" fill="#10b981" opacity="0.7" />
              <circle cx="42" cy="52" r="1.5" fill="#f59e0b" opacity="0.8" />
              <defs>
                <linearGradient id="seedGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#c29f74" />
                  <stop offset="100%" stopColor="#8c6643" />
                </linearGradient>
              </defs>
            </svg>
            );

            case 'sprout':
            return (
              <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
                <ellipse cx="50" cy="85" rx="36" ry="9" fill="#704e38" opacity="0.4" />
                <ellipse cx="50" cy="83" rx="30" ry="6" fill="#4f372c" />
                {/* Glowing Stem */}
                <path
                  d="M50,83 Q49,58 46,42"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                />
                {/* Leaves with gradient */}
                <path
                  d="M46,43 C30,42 26,28 39,26 C45,33 46,40 46,43 Z"
                  fill="url(#sproutLeaf1)"
                  stroke="#047857"
                  strokeWidth="1.5"
                />
                <path
                  d="M46,43 C62,39 65,24 52,24 C47,31 46,40 46,43 Z"
                  fill="url(#sproutLeaf2)"
                  stroke="#047857"
                  strokeWidth="1.5"
                />
                {/* Dew drop */}
                <circle cx="39" cy="27" r="2" fill="#e0f2fe" opacity="0.9" />
                <defs>
                  <linearGradient id="sproutLeaf1" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#34d399" />
                    <stop offset="100%" stopColor="#059669" />
                  </linearGradient>
                  <linearGradient id="sproutLeaf2" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#6ee7b7" />
                    <stop offset="100%" stopColor="#10b981" />
                  </linearGradient>
                </defs>
              </svg>
              );

              case 'sapling':
              return (
                <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl">
                  <ellipse cx="50" cy="87" rx="38" ry="9" fill="#5d4132" opacity="0.45" />
                  <ellipse cx="50" cy="85" rx="32" ry="6" fill="#4f372c" />
                  {/* Trunk */}
                  <path
                    d="M49,85 Q51,58 50,35"
                    fill="none"
                    stroke="#5d4132"
                    strokeWidth="5"
                    strokeLinecap="round"
                  />
                  {/* Branches */}
                  <path d="M50,60 Q38,52 32,54" stroke="#5d4132" strokeWidth="3" strokeLinecap="round" />
                  <ellipse cx="30" cy="52" rx="9" ry="5" transform="rotate(-20 30 52)" fill="#10b981" />
                  <path d="M50,48 Q62,40 68,43" stroke="#5d4132" strokeWidth="3" strokeLinecap="round" />
                  <ellipse cx="70" cy="42" rx="10" ry="6" transform="rotate(25 70 42)" fill="#34d399" />
                  {/* Foliage Canopy */}
                  <circle cx="50" cy="27" r="17" fill="#047857" />
                  <circle cx="42" cy="23" r="13" fill="#059669" />
                  <circle cx="58" cy="24" r="12" fill="#10b981" />
                  <circle cx="50" cy="16" r="10" fill="#6ee7b7" />
                </svg>
                );

                case 'tree':
                return (
                  <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-2xl">
                    <ellipse cx="50" cy="88" rx="42" ry="9" fill="#1f3828" opacity="0.4" />
                    <ellipse cx="50" cy="86" rx="36" ry="6" fill="#4f372c" />
                    {/* Robust Wood Trunk */}
                    <path d="M46,86 C46,65 47,46 48,35 L52,35 C53,46 54,65 54,86 Z" fill="#4f372c" />
                    <path d="M47,56 Q34,44 28,47" stroke="#4f372c" strokeWidth="4" strokeLinecap="round" />
                    <path d="M53,50 Q66,42 72,46" stroke="#4f372c" strokeWidth="4" strokeLinecap="round" />
                    {/* Multi-layered Lush Canopy with 3D Depth */}
                    <circle cx="50" cy="32" r="25" fill="#064e3b" />
                    <circle cx="34" cy="36" r="17" fill="#047857" />
                    <circle cx="66" cy="36" r="17" fill="#047857" />
                    <circle cx="40" cy="22" r="16" fill="#059669" />
                    <circle cx="60" cy="22" r="16" fill="#10b981" />
                    <circle cx="50" cy="14" r="13" fill="#34d399" />
                    {/* Fruit / Blossom Sparks */}
                    <circle cx="45" cy="28" r="2" fill="#f59e0b" />
                    <circle cx="58" cy="34" r="2" fill="#f59e0b" />
                  </svg>
                  );

                  case 'forest':
                  return (
                      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-2xl">
                        <ellipse cx="50" cy="89" rx="46" ry="9" fill="#064e3b" opacity="0.5" />
                        <ellipse cx="50" cy="86" rx="40" ry="7" fill="#047857" />
                        {/* Background Sylvan Grove */}
                        <g opacity="0.75" transform="scale(0.7) translate(8, 20)">
                          <rect x="30" y="45" width="6" height="40" fill="#4f372c" />
                          <polygon points="33,16 12,56 54,56" fill="#064e3b" />
                          <polygon points="33,30 15,66 51,66" fill="#047857" />
                        </g>
                          <g opacity="0.75" transform="scale(0.75) translate(66, 18)">
                            <rect x="30" y="45" width="6" height="40" fill="#4f372c" />
                            <polygon points="33,14 10,58 56,58" fill="#064e3b" />
                            <polygon points="33,28 14,68 52,68" fill="#047857" />
                          </g>
                          {/* Central Master Tree */}
                          <rect x="47" y="46" width="8" height="40" fill="#3d291f" rx="2" />
                          <circle cx="51" cy="38" r="23" fill="#064e3b" />
                          <circle cx="36" cy="41" r="17" fill="#047857" />
                          <circle cx="66" cy="41" r="17" fill="#047857" />
                          <circle cx="43" cy="26" r="16" fill="#059669" />
                          <circle cx="59" cy="26" r="16" fill="#10b981" />
                          <circle cx="51" cy="17" r="12" fill="#34d399" />
                          <circle cx="51" cy="11" r="5" fill="#a7f3d0" opacity="0.9" />
                      </svg>
                      );
    }
  };

                      return (
                        <div className="relative inline-flex flex-col items-center justify-center group">
                          {/* Dynamic Uiverse Ethereal Glow Ring */}
                          <div
        style={{
                              background: `radial-gradient(circle, ${current.aura} 0%, transparent 70%)`,
                            }}
                          />

                          {/* Graphic Container with subtle glass border & 3D shadow */}
                          <div
                            className={`${sizeClasses[size]} relative z-10 rounded-3xl bg-gradient-to-b ${current.bg} p-2.5 flex items-center justify-center border border-white/80 shadow-[0_8px_25px_rgba(0,0,0,0.06),inset_0_1px_2px_rgba(255,255,255,0.9)] transition-all duration-500 group-hover:scale-105 ${isAnimating ? 'animate-growth' : 'animate-sway'
                              }`}
                          >
                            {renderSvg()}
                          </div>

                            {/* Uiverse Stage Badge with Pulsing Beacon */}
      <div
                            className={`mt-2 px-3 py-0.5 rounded-full text-[11px] font-bold border ${current.badge} shadow-xs flex items-center space-x-1.5 backdrop-blur-md relative z-10`}
                          >
                          <span
                            className="w-2 h-2 rounded-full animate-ping"
                            style={{ backgroundColor: current.ringColor }}
                          />
                          <span className="capitalize tracking-wide">{stage}</span>
                          {stage === 'forest' && <Sparkles className="w-3 h-3 text-amber-300" />}
                        </div>
                      </div>
                      );
}
