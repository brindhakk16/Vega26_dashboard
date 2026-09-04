import React from 'react';
import { ShieldCheck, AlertTriangle, AlertOctagon, TrendingUp, TrendingDown, Minus, Clock } from 'lucide-react';
import { formatTemp } from '../../utils/thermalColor.js';

export function EnvironmentStatusCard({
  currentTemp = 27.4,
  state = 'normal', // 'normal', 'warning-high', 'warning-low', 'critical-high', 'critical-low'
  preferredMin = 24.0,
  preferredMax = 28.0,
  trend = 0.2,
  durationOutside = 0,
  unit = 'C'
}) {
  const isNormal = state === 'normal';
  const isWarningHigh = state === 'warning-high';
  const isWarningLow = state === 'warning-low';
  const isCriticalHigh = state === 'critical-high';
  const isCriticalLow = state === 'critical-low';

  const formatDuration = (secs) => {
    if (!secs) return '00:00';
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-dark-panel border border-dark-border rounded-lg p-4 shadow-panel relative overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Main Temperature & Status */}
        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 rounded-full flex items-center justify-center border ${
            isNormal
              ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
              : isWarningHigh || isWarningLow
              ? 'bg-amber-500/10 border-amber-500/40 text-amber-400'
              : 'bg-rose-500/10 border-rose-500/40 text-rose-400'
          }`}>
            {isNormal ? (
              <ShieldCheck className="w-7 h-7" />
            ) : isWarningHigh || isWarningLow ? (
              <AlertTriangle className="w-7 h-7" />
            ) : (
              <AlertOctagon className="w-7 h-7" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-gray-400 uppercase tracking-wider">
                CURRENT ENVIRONMENT
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider ${
                isNormal
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  : isWarningHigh
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                  : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
              }`}>
                ● {isNormal ? 'STABLE' : isWarningHigh ? 'WARM' : isWarningLow ? 'COOL' : 'THRESHOLD EXCEEDED'}
              </span>
            </div>

            <div className="flex items-baseline gap-3 mt-1">
              <div className="text-3xl font-bold font-mono text-white">
                {formatTemp(currentTemp, unit)}
              </div>
              <div className="text-xs font-mono text-gray-400 flex items-center gap-1">
                <span>Trend:</span>
                <span className={`font-semibold flex items-center ${
                  trend > 0.1 ? 'text-amber-400' : trend < -0.1 ? 'text-thermal-cyan' : 'text-gray-300'
                }`}>
                  {trend > 0.1 ? <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> : trend < -0.1 ? <TrendingDown className="w-3.5 h-3.5 mr-0.5" /> : <Minus className="w-3.5 h-3.5 mr-0.5" />}
                  {trend > 0 ? `+${trend}°${unit}` : `${trend}°${unit}`} / 5m
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Range & Duration Info */}
        <div className="flex flex-wrap items-center gap-4 border-t md:border-t-0 md:border-l border-dark-border pt-3 md:pt-0 md:pl-6 font-mono text-xs">
          <div>
            <div className="text-gray-500 text-[10px] uppercase">CONFIGURED RANGE</div>
            <div className="text-gray-200 font-bold">
              {preferredMin}°{unit} – {preferredMax}°{unit}
            </div>
            <div className="text-[10px] text-gray-400 mt-0.5">User-set comfort bounds</div>
          </div>

          {!isNormal && (
            <div className="bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded">
              <div className="text-amber-400 text-[10px] flex items-center gap-1 font-bold">
                <Clock className="w-3 h-3" />
                OUTSIDE RANGE
              </div>
              <div className="text-white font-bold text-sm">
                {formatDuration(durationOutside)}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
