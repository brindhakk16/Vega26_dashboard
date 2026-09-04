import React from 'react';
import { ThermalCanvas } from '../thermal/ThermalCanvas.jsx';
import { ExternalLink, Radio } from 'lucide-react';
import { formatTemp } from '../../utils/thermalColor.js';

export function ThermalOverviewCard({
  temperatures = [],
  minTemp = 24,
  maxTemp = 29,
  palette = 'ironbow',
  mode = 'smooth',
  showGrid = true,
  showCradleOutline = true,
  unit = 'C',
  onNavigateToLive
}) {
  return (
    <div 
      onClick={onNavigateToLive}
      className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm cursor-pointer group transition-all hover:border-emerald-500/50 hover:shadow-md flex flex-col justify-between"
    >
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
        <div>
          <h3 className="font-mono text-sm font-bold text-slate-900 flex items-center gap-2 group-hover:text-emerald-600 transition-colors">
            <span>CRADLE THERMAL MAP</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </h3>
          <p className="font-mono text-[11px] text-slate-500">Live spatial thermal distribution</p>
        </div>

        <span className="flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold border border-emerald-200">
          <Radio className="w-3 h-3 text-emerald-600 animate-pulse" />
          ● LIVE
        </span>
      </div>

      {/* Primary Thermal Heatmap Canvas */}
      <div className="w-full max-w-[420px] mx-auto py-2">
        <ThermalCanvas
          temperatures={temperatures}
          minTemp={minTemp}
          maxTemp={maxTemp}
          palette={palette}
          mode={mode}
          showGrid={showGrid}
          showHotspot={true}
          showCradleOutline={showCradleOutline}
          autoRange={true}
          unit={unit}
        />
      </div>

      {/* Footer Range Bar */}
      <div className="flex items-center justify-between border-t border-slate-100 pt-3 font-mono text-xs text-slate-500">
        <div>
          <span>Coolest Zone: </span>
          <strong className="text-cyan-700">{formatTemp(minTemp, unit)}</strong>
        </div>

        <div>
          <span>Warmest Zone: </span>
          <strong className="text-orange-600">{formatTemp(maxTemp, unit)}</strong>
        </div>
      </div>
    </div>
  );
}
