import React from 'react';
import { FunnelSpiralVisualizer } from '../visualizers/FunnelSpiralVisualizer.jsx';
import { ArrowUpRight } from 'lucide-react';

export function SpatialMicroZonesCard({
  zoneCount = 16
}) {
  return (
    <div className="relative w-full h-full min-h-[160px] rounded-3xl p-5 shadow-xl flex flex-col justify-between overflow-hidden text-white border border-white/40 group hover:border-white transition-all bg-[radial-gradient(ellipse_at_bottom_right,#9cb046,#708638)]">
      {/* Header */}
      <div className="relative z-10 flex items-center justify-between">
        <div>
          <div className="text-3xl font-extrabold font-outfit tracking-tight text-white">
            {zoneCount}
          </div>
          <div className="text-xs font-outfit text-white/80 tracking-wide mt-0.5">
            Bloodwork / Zones
          </div>
        </div>
        <ArrowUpRight className="w-4 h-4 opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all text-white" />
      </div>

      {/* Funnel Spiral Visualizer Artwork */}
      <div className="relative z-10 -mb-2">
        <FunnelSpiralVisualizer />
      </div>
    </div>
  );
}
