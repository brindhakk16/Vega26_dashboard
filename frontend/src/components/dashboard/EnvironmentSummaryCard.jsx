import React from 'react';
import { ShieldCheck, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { formatTemp } from '../../utils/thermalColor.js';

export function EnvironmentSummaryCard({
  avgTemp = 27.2,
  minTemp = 24.5,
  maxTemp = 29.8,
  preferredMin = 24.0,
  preferredMax = 28.0,
  trend = 0.2,
  unit = 'C'
}) {
  const isWithinRange = avgTemp >= preferredMin && avgTemp <= preferredMax;
  const rangeDelta = Number((maxTemp - minTemp).toFixed(1));

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between h-full font-mono text-xs">
      <div>
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
          <span className="text-slate-500 font-bold uppercase tracking-wider text-[11px]">
            ENVIRONMENT SUMMARY
          </span>
          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
            isWithinRange
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
              : 'bg-amber-50 border border-amber-200 text-amber-700'
          }`}>
            ● {isWithinRange ? 'STABLE' : 'ELEVATED'}
          </span>
        </div>

        {/* Main Temperature Display */}
        <div className="mb-4">
          <div className="text-4xl font-bold font-mono text-slate-900 tracking-tight">
            {formatTemp(avgTemp, unit)}
          </div>
          <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
            <span>5-Min Trend:</span>
            <span className={`font-semibold flex items-center ${
              trend > 0.1 ? 'text-amber-600' : trend < -0.1 ? 'text-cyan-600' : 'text-emerald-600'
            }`}>
              {trend > 0.1 ? <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> : trend < -0.1 ? <TrendingDown className="w-3.5 h-3.5 mr-0.5" /> : <Minus className="w-3.5 h-3.5 mr-0.5" />}
              {trend > 0 ? `+${trend}°${unit}` : `${trend}°${unit}`} / 5m
            </span>
          </div>
        </div>

        {/* Comfort Range Confirmation */}
        <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl mb-4">
          <div className="text-slate-500 text-[10px] uppercase font-semibold">CONFIGURED COMFORT RANGE</div>
          <div className="text-slate-900 font-bold text-sm mt-0.5">
            {preferredMin}°{unit} — {preferredMax}°{unit}
          </div>
          <div className="text-[10px] text-emerald-700 mt-1 flex items-center gap-1 font-medium">
            <ShieldCheck className="w-3 h-3 text-emerald-600" />
            {isWithinRange ? 'Within user-configured target range' : 'Exceeding target range'}
          </div>
        </div>
      </div>

      {/* Secondary Metrics Summary Row */}
      <div className="grid grid-cols-3 gap-2 border-t border-slate-100 pt-3 text-center">
        <div className="p-2 bg-slate-50 rounded-xl border border-slate-200/60">
          <div className="text-slate-500 text-[10px]">MIN</div>
          <div className="text-cyan-700 font-bold mt-0.5">{formatTemp(minTemp, unit)}</div>
        </div>
        <div className="p-2 bg-slate-50 rounded-xl border border-slate-200/60">
          <div className="text-slate-500 text-[10px]">MAX</div>
          <div className="text-orange-600 font-bold mt-0.5">{formatTemp(maxTemp, unit)}</div>
        </div>
        <div className="p-2 bg-slate-50 rounded-xl border border-slate-200/60">
          <div className="text-slate-500 text-[10px]">DELTA</div>
          <div className="text-amber-600 font-bold mt-0.5">{rangeDelta}°{unit}</div>
        </div>
      </div>
    </div>
  );
}
