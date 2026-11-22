import React from 'react';
import { Target, Cpu, Sparkles } from 'lucide-react';

interface SdgBadgeProps {
  size?: 'sm' | 'md' | 'lg';
  showDetail?: boolean;
}

export default function SdgBadge({ size = 'md', showDetail = false }: SdgBadgeProps) {
  if (size === 'sm') {
    return (
        <span className="inline-flex items-center space-x-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[11px] font-black px-2.5 py-1 rounded-full shadow-[0_2px_8px_rgba(245,158,11,0.35)] border border-amber-300/40">
          <Target className="w-3 h-3 text-amber-100" />
          <span className="tracking-wide">SDG 9.B</span>
        </span>
        );
  }

        return (
              <div className="relative overflow-hidden inline-flex flex-col bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 text-white rounded-3xl p-5 shadow-[0_10px_25px_rgba(245,158,11,0.25)] border border-amber-300/40">
                {/* Subtle shine reflection */}
                <div className="absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 rounded-full bg-white/15 blur-xl pointer-events-none" />

                <div className="flex items-center space-x-3 relative z-10">
                  <div className="bg-white/20 backdrop-blur-md p-2.5 rounded-2xl shadow-inner border border-white/20">
                    <Cpu className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-1.5">
                      <span className="text-[10px] uppercase tracking-widest font-black text-amber-100">UN Sustainable Goal 9</span>
                      <span className="bg-white/30 backdrop-blur-xs text-white text-[9px] px-2 py-0.5 rounded-full font-black tracking-wider">
                        Target 9.B
                      </span>
                    </div>
                    <span className="text-xs font-black block leading-tight mt-0.5">
                      Industry, Innovation & Infrastructure
                    </span>
                  </div>
                </div>

                {showDetail && (
                    <p className="mt-3 text-[11px] text-amber-50 leading-relaxed border-t border-white/20 pt-2.5 relative z-10 font-normal">
                      Support domestic technology development, research and innovation in developing countries, ensuring value-added industrial diversification and clean product lifecycle diversion.
                    </p>
      )}
                  </div>
                );
}
