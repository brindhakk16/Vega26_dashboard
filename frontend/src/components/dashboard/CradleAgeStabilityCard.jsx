import React, { useState } from 'react';
import { HourglassRingsVisualizer } from '../visualizers/HourglassRingsVisualizer.jsx';
import { ChevronDown, ArrowUpRight } from 'lucide-react';
import { formatTemp } from '../../utils/thermalColor.js';

export function CradleAgeStabilityCard({
  avgTemp = 27.2,
  minTemp = 24.5,
  maxTemp = 29.8,
  unit = 'C'
}) {
  const [activePill, setActivePill] = useState('Younger');

  return (
    <div className="relative w-full h-full min-h-[360px] rounded-3xl p-6 shadow-xl flex flex-col justify-between overflow-hidden text-white border border-white/40 group hover:border-white transition-all bg-[radial-gradient(ellipse_at_top_left,#34684c,#1b4d3e)]">
      {/* Background ambient gradient glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between">
        <span className="text-xs font-outfit font-medium text-white/80 tracking-wide">
          Heart Age & Cradle Stability
        </span>

        <div className="flex items-center gap-1 bg-white/10 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20 text-[11px] font-sans cursor-pointer hover:bg-white/20 transition-all">
          <span>Dates 2026</span>
          <ChevronDown className="w-3 h-3 opacity-70" />
        </div>
      </div>

      {/* Primary Value Display */}
      <div className="relative z-10 mt-3">
        <div className="flex items-baseline gap-3">
          <span className="text-5xl md:text-6xl font-extrabold font-outfit tracking-tight text-white">
            25
          </span>
          <span className="text-xl font-outfit text-white/90">years</span>
          <span className="text-xs font-mono font-bold bg-white/15 px-2 py-0.5 rounded-full text-[#D4FF00] border border-white/20">
            -6 years
          </span>
        </div>
        <div className="text-xs text-white/70 font-sans mt-1">
          Thermal balance score: <strong className="text-white font-mono">{formatTemp(avgTemp, unit)} avg</strong>
        </div>
      </div>

      {/* 3D Wireframe Hourglass Visualizer */}
      <div className="relative z-10 my-2 flex items-center justify-center">
        <HourglassRingsVisualizer />
      </div>

      {/* Footer Pill Switcher (Younger / Older - Image 3 & 4) */}
      <div className="relative z-10 flex items-center justify-between pt-2 border-t border-white/15">
        <div className="flex items-center gap-1.5 bg-black/20 p-1 rounded-full border border-white/20 text-xs">
          <button
            onClick={() => setActivePill('Younger')}
            className={`px-3 py-1 rounded-full font-semibold transition-all ${
              activePill === 'Younger'
                ? 'bg-white text-slate-900 shadow-md'
                : 'text-white/70 hover:text-white'
            }`}
          >
            ● Younger
          </button>
          <button
            onClick={() => setActivePill('Older')}
            className={`px-3 py-1 rounded-full font-semibold transition-all ${
              activePill === 'Older'
                ? 'bg-white text-slate-900 shadow-md'
                : 'text-white/70 hover:text-white'
            }`}
          >
            Older
          </button>
        </div>

        <ArrowUpRight className="w-4 h-4 opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all text-white" />
      </div>
    </div>
  );
}
