import React from 'react';
import { Target, Layers, Cpu } from 'lucide-react';

interface SdgBadgeProps {
  size?: 'sm' | 'md' | 'lg';
  showDetail?: boolean;
}

export default function SdgBadge({ size = 'md', showDetail = false }: SdgBadgeProps) {
  if (size === 'sm') {
    return (
      <span className="inline-flex items-center space-x-1 bg-amber-500 text-white text-[11px] font-bold px-2 py-0.5 rounded shadow-sm">
        <Target className="w-3 h-3" />
        <span>SDG 9.B</span>
      </span>
    );
  }

  return (
    <div className="inline-flex flex-col bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl p-3 shadow-md border border-amber-400">
      <div className="flex items-center space-x-2">
        <div className="bg-white/20 p-1.5 rounded-lg">
          <Cpu className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="flex items-center space-x-1.5">
            <span className="text-xs uppercase tracking-wider font-extrabold text-amber-100">UN SDG 9</span>
            <span className="bg-white/30 text-white text-[10px] px-1.5 py-0.5 rounded font-black">Target 9.B</span>
          </div>
          <span className="text-xs font-semibold block leading-tight">Industry, Innovation & Infrastructure</span>
        </div>
      </div>
      {showDetail && (
        <p className="mt-2 text-[11px] text-amber-50 leading-relaxed border-t border-white/20 pt-1.5">
          Support domestic technology development, research and innovation in developing countries, ensuring value-added industrial diversification.
        </p>
      )}
    </div>
  );
}
