import React from 'react';
import { ThermalCanvas } from '../thermal/ThermalCanvas.jsx';
import { ExternalLink, Radio } from 'lucide-react';

export function LiveStreamSnapshotCard({
  temperatures = [],
  minTemp = 24.5,
  maxTemp = 29.8,
  palette = 'ironbow',
  mode = 'smooth',
  unit = 'C',
  onNavigateToLive
}) {
  return (
    <div
      onClick={onNavigateToLive}
      className="relative w-full h-full min-h-[160px] rounded-3xl p-5 shadow-xl flex flex-col justify-between overflow-hidden text-white border border-white/40 group hover:border-white cursor-pointer transition-all bg-[#121c2b] backdrop-blur-xl"
    >
      {/* Background Live Thermal Canvas Preview */}
      <div className="absolute inset-0 opacity-40 group-hover:opacity-60 transition-opacity">
        <ThermalCanvas
          temperatures={temperatures}
          minTemp={minTemp}
          maxTemp={maxTemp}
          palette={palette}
          mode={mode}
          showGrid={false}
          showHotspot={false}
          showCradleOutline={true}
          autoRange={true}
          unit={unit}
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/40 to-transparent pointer-events-none" />

      {/* Header Tag */}
      <div className="relative z-10 flex items-center justify-between">
        <span className="bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-mono text-white/80 border border-white/20">
          0.5 min
        </span>

        <span className="flex items-center gap-1 bg-[#D4FF00]/20 text-[#D4FF00] px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border border-[#D4FF00]/30">
          <Radio className="w-3 h-3 text-[#D4FF00] animate-pulse" />
          LIVE
        </span>
      </div>

      {/* Footer Title Callout */}
      <div className="relative z-10 flex items-end justify-between mt-auto pt-4">
        <div>
          <div className="text-sm font-bold font-outfit text-white group-hover:text-[#D4FF00] transition-colors flex items-center gap-1.5">
            <span>Heart, Body, Skin Data Insights</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="text-[10px] text-white/60 font-sans mt-0.5">
            Tap to open full 8×8 live matrix stream
          </div>
        </div>
      </div>
    </div>
  );
}
