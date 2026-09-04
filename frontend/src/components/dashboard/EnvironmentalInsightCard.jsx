import React from 'react';
import { Sparkles, ShieldCheck } from 'lucide-react';
import { formatTemp } from '../../utils/thermalColor.js';

export function EnvironmentalInsightCard({
  avgTemp = 27.2,
  minTemp = 24.5,
  maxTemp = 29.8,
  durationMinutes = 18,
  unit = 'C'
}) {
  const variation = Number((maxTemp - minTemp).toFixed(1));

  return (
    <div className="bg-gradient-to-br from-emerald-50/60 to-white border border-emerald-200/80 rounded-2xl p-5 shadow-sm flex flex-col justify-between font-mono text-xs relative overflow-hidden">
      <div>
        <div className="flex items-center justify-between border-b border-emerald-100 pb-3 mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
              ENVIRONMENT INSIGHT
            </span>
          </div>
          <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100/80 px-2 py-0.5 rounded-full border border-emerald-200">
            STABILITY NOTE
          </span>
        </div>

        <p className="text-slate-700 text-[11px] leading-relaxed mb-4">
          Environment temperature remained <strong className="text-emerald-700 font-bold">stable within comfort bounds</strong> for the past {durationMinutes} minutes.
        </p>

        <div className="space-y-2 text-[11px]">
          <div className="flex justify-between py-1 border-b border-slate-100">
            <span className="text-slate-500">Average Temp:</span>
            <span className="text-slate-900 font-bold">{formatTemp(avgTemp, unit)}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-100">
            <span className="text-slate-500">Total Variation:</span>
            <span className="text-amber-700 font-bold">{variation}°{unit}</span>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-2 flex items-center gap-1.5 text-[10px] text-emerald-700 font-semibold">
        <ShieldCheck className="w-3.5 h-3.5" />
        <span>Optimal cradle thermal balance</span>
      </div>
    </div>
  );
}
