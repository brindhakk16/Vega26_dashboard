import React from 'react';
import { ArcScaleVisualizer } from '../visualizers/ArcScaleVisualizer.jsx';
import { ArrowUpRight } from 'lucide-react';

export function InflammationCard({
  minTemp = 24.5,
  maxTemp = 29.8,
  unit = 'C'
}) {
  const delta = Number((maxTemp - minTemp).toFixed(1));
  const activeLevel = delta > 4 ? 'High' : delta > 2.5 ? 'Moderate' : delta > 1.5 ? 'Mid' : 'Optimal';

  return (
    <div className="relative w-full h-full min-h-[190px] rounded-3xl p-5 shadow-xl flex flex-col justify-between overflow-hidden text-white border border-white/40 group hover:border-white transition-all bg-[linear-gradient(145deg,#a85848_0%,#45627e_100%)]">
      {/* Background ambient light blur */}
      <div className="absolute top-0 left-0 w-48 h-48 bg-rose-400/20 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between">
        <span className="text-xs font-outfit font-medium text-white/90 tracking-wide">
          Inflammation (hs-CRI) / Disparity
        </span>
        <ArrowUpRight className="w-4 h-4 opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all text-white" />
      </div>

      {/* Primary Value Display */}
      <div className="relative z-10 my-1">
        <div className="text-4xl font-extrabold font-outfit tracking-tight text-white">
          0.5
        </div>
      </div>

      {/* Arc Scale Visualizer Artwork */}
      <div className="relative z-10 -mb-2">
        <ArcScaleVisualizer activeLevel={activeLevel} />
      </div>
    </div>
  );
}
