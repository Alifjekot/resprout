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

  const stageColors: Record<PlantStage, { badge: string; text: string; bg: string }> = {
    seed: { badge: 'bg-amber-100 text-amber-800 border-amber-300', text: 'Seed', bg: 'from-amber-50 to-amber-100/50' },
    sprout: { badge: 'bg-lime-100 text-lime-800 border-lime-300', text: 'Sprout', bg: 'from-lime-50 to-emerald-100/50' },
    sapling: { badge: 'bg-emerald-100 text-emerald-800 border-emerald-300', text: 'Sapling', bg: 'from-emerald-50 to-teal-100/50' },
    tree: { badge: 'bg-forest-100 text-forest-800 border-forest-300', text: 'Tree', bg: 'from-forest-50 to-green-100/50' },
    forest: { badge: 'bg-emerald-200 text-emerald-900 border-emerald-400 font-bold', text: 'Forest', bg: 'from-green-100 to-emerald-200/50' },
  };

  const renderSvg = () => {
    switch (stage) {
      case 'seed':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm">
            {/* Soil mound */}
            <ellipse cx="50" cy="82" rx="36" ry="12" fill="#8c6643" opacity="0.8" />
            <ellipse cx="50" cy="80" rx="30" ry="8" fill="#5d4132" />
            {/* Seed in soil */}
            <g transform="translate(50, 68) rotate(-15)">
              <path
                d="M0,-12 C8,-12 12,-2 8,8 C4,16 -4,16 -8,8 C-12,-2 -8,-12 0,-12 Z"
                fill="#a98254"
                stroke="#5d4132"
                strokeWidth="2"
              />
              <path d="M-2,-6 C2,-2 2,4 -1,7" stroke="#edd8be" strokeWidth="1.5" strokeLinecap="round" />
            </g>
            {/* Sparkle hint */}
            <circle cx="58" cy="50" r="2" fill="#46865c" opacity="0.6" />
          </svg>
        );

      case 'sprout':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow">
            {/* Soil */}
            <ellipse cx="50" cy="85" rx="36" ry="10" fill="#8c6643" opacity="0.8" />
            <ellipse cx="50" cy="83" rx="30" ry="7" fill="#5d4132" />
            {/* Stem */}
            <path
              d="M50,83 Q49,60 46,45"
              fill="none"
              stroke="#46865c"
              strokeWidth="4"
              strokeLinecap="round"
            />
            {/* Two tender baby leaves */}
            <path
              d="M46,46 C32,45 28,32 40,30 C45,36 46,43 46,46 Z"
              fill="#69a37c"
              stroke="#2a5439"
              strokeWidth="1.5"
            />
            <path
              d="M46,46 C60,42 62,28 50,28 C46,34 46,43 46,46 Z"
              fill="#86c698"
              stroke="#2a5439"
              strokeWidth="1.5"
            />
          </svg>
        );

      case 'sapling':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            {/* Soil */}
            <ellipse cx="50" cy="87" rx="38" ry="9" fill="#8c6643" opacity="0.8" />
            <ellipse cx="50" cy="85" rx="32" ry="6" fill="#5d4132" />
            {/* Young trunk */}
            <path
              d="M49,85 Q51,60 50,38"
              fill="none"
              stroke="#704e38"
              strokeWidth="5"
              strokeLinecap="round"
            />
            {/* Branches and leaves */}
            <path
              d="M50,62 Q40,55 35,56"
              fill="none"
              stroke="#704e38"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <ellipse cx="33" cy="54" rx="8" ry="4" transform="rotate(-20 33 54)" fill="#46865c" />
            <path
              d="M50,50 Q60,44 65,46"
              fill="none"
              stroke="#704e38"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <ellipse cx="66" cy="44" rx="9" ry="5" transform="rotate(25 66 44)" fill="#69a37c" />
            {/* Top foliage crown */}
            <circle cx="50" cy="30" r="16" fill="#46865c" opacity="0.95" />
            <circle cx="43" cy="26" r="12" fill="#69a37c" />
            <circle cx="57" cy="27" r="11" fill="#86c698" />
          </svg>
        );

      case 'tree':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
            {/* Soil & grass */}
            <ellipse cx="50" cy="88" rx="42" ry="9" fill="#346b47" opacity="0.5" />
            <ellipse cx="50" cy="86" rx="36" ry="6" fill="#5d4132" />
            {/* Sturdy trunk */}
            <path
              d="M46,86 C46,65 47,48 48,38 L52,38 C53,48 54,65 54,86 Z"
              fill="#5d4132"
            />
            <path d="M47,56 Q36,46 32,48" stroke="#5d4132" strokeWidth="4" strokeLinecap="round" />
            <path d="M53,52 Q64,44 68,48" stroke="#5d4132" strokeWidth="4" strokeLinecap="round" />
            {/* Dense mature canopy */}
            <circle cx="50" cy="34" r="24" fill="#2a5439" />
            <circle cx="36" cy="38" r="16" fill="#346b47" />
            <circle cx="64" cy="38" r="16" fill="#346b47" />
            <circle cx="42" cy="25" r="15" fill="#46865c" />
            <circle cx="58" cy="24" r="15" fill="#69a37c" />
            <circle cx="50" cy="18" r="12" fill="#86c698" />
          </svg>
        );

      case 'forest':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl">
            {/* Expansive green terrain */}
            <ellipse cx="50" cy="88" rx="45" ry="9" fill="#24432f" opacity="0.6" />
            <ellipse cx="50" cy="86" rx="40" ry="7" fill="#346b47" />
            {/* Background trees */}
            <g opacity="0.75" transform="scale(0.7) translate(10, 20)">
              <rect x="30" y="45" width="6" height="40" fill="#5d4132" />
              <polygon points="33,18 15,55 51,55" fill="#2a5439" />
              <polygon points="33,32 18,65 48,65" fill="#346b47" />
            </g>
            <g opacity="0.75" transform="scale(0.75) translate(65, 18)">
              <rect x="30" y="45" width="6" height="40" fill="#5d4132" />
              <polygon points="33,15 12,56 54,56" fill="#2a5439" />
              <polygon points="33,30 16,68 50,68" fill="#346b47" />
            </g>
            {/* Foreground grand central tree */}
            <rect x="47" y="48" width="8" height="38" fill="#4f372c" rx="2" />
            <circle cx="51" cy="40" r="22" fill="#24432f" />
            <circle cx="38" cy="43" r="17" fill="#2a5439" />
            <circle cx="64" cy="43" r="17" fill="#346b47" />
            <circle cx="45" cy="28" r="15" fill="#46865c" />
            <circle cx="57" cy="28" r="15" fill="#69a37c" />
            <circle cx="51" cy="20" r="11" fill="#99c4a6" />
          </svg>
        );
    }
  };

  return (
    <div className="relative inline-flex flex-col items-center justify-center">
      <div
        className={`${sizeClasses[size]} rounded-2xl bg-gradient-to-b ${stageColors[stage].bg} p-2 flex items-center justify-center transition-all duration-500 ${
          isAnimating ? 'animate-growth' : 'animate-sway'
        }`}
      >
        {renderSvg()}
      </div>
      <span
        className={`mt-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${stageColors[stage].badge} flex items-center space-x-1 shadow-xs`}
      >
        {stage === 'forest' && <Sparkles className="w-3 h-3 text-emerald-600" />}
        <span className="capitalize">{stage}</span>
      </span>
    </div>
  );
}
