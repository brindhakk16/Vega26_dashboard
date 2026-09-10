import React from 'react';
import { SineWaveVisualizer } from '../visualizers/SineWaveVisualizer.jsx';
import { ArrowUpRight } from 'lucide-react';
import { formatTemp } from '../../utils/thermalColor.js';

export function BloodOxygenCard({
  maxTemp = 29.8,
  unit = 'C'
}) {
  return (
    <div className="relative w-full h-full min-h-[175px] rounded-3xl p-5 shadow-xl flex flex-col justify-between overflow-hidden text-white border border-white/40 group hover:border-white transition-all bg-[radial-gradient(ellipse_at_top_right,#d49f2a,#8a6514)]">
      {/* Background ambient light blur */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-amber-300/20 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between">
        <span className="text-xs font-outfit font-medium text-white/90 tracking-wide">
          Blood Oxygen & Peak Temp
        </span>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-white/90">Normal</span>
          <ArrowUpRight className="w-4 h-4 opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all text-white" />
        </div>
      </div>

      {/* Primary Value Display */}
      <div className="relative z-10 my-1 flex items-baseline justify-between">
        <div className="text-5xl font-extrabold font-outfit tracking-tight text-white">
          99
        </div>
        <div className="text-xs font-mono font-bold bg-white/20 px-2 py-1 rounded-lg text-white">
          Max: {formatTemp(maxTemp, unit)}
        </div>
      </div>

      {/* Sine Wave Visualizer Artwork */}
      <div className="relative z-10 -mb-2">
        <SineWaveVisualizer />
      </div>
    </div>
  );
}
