import React from 'react';
import { AlertTriangle, AlertOctagon, CheckCircle2 } from 'lucide-react';
import { formatTemp } from '../../utils/thermalColor.js';

export function AlertPanel({
  maxTemp = 0,
  hotspot = { x: 0, y: 0 },
  warningThreshold = 35,
  criticalThreshold = 40,
  unit = 'C'
}) {
  const isCritical = maxTemp >= criticalThreshold;
  const isWarning = maxTemp >= warningThreshold && !isCritical;
  const isNormal = !isCritical && !isWarning;

  return (
    <div className="bg-dark-panel border border-dark-border rounded-lg p-3.5 shadow-panel">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isCritical ? (
            <AlertOctagon className="w-5 h-5 text-thermal-red animate-bounce" />
          ) : isWarning ? (
            <AlertTriangle className="w-5 h-5 text-amber-400 animate-pulse" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          )}

          <div>
            <h4 className="font-mono text-xs font-bold text-gray-200 tracking-wider">
              THERMAL MONITOR STATUS
            </h4>
            <p className="text-[11px] font-mono text-gray-400">
              Thresholds: Warning &gt;={warningThreshold}°C | Critical &gt;={criticalThreshold}°C
            </p>
          </div>
        </div>

        <div className="text-right">
          {isCritical && (
            <div className="bg-thermal-red/20 border border-thermal-red/60 text-thermal-red px-3 py-1 rounded font-mono text-xs font-bold animate-pulse">
              CRITICAL HOTSPOT DETECTED
            </div>
          )}
          {isWarning && (
            <div className="bg-amber-500/20 border border-amber-500/60 text-amber-400 px-3 py-1 rounded font-mono text-xs font-bold">
              ELEVATED TEMPERATURE
            </div>
          )}
          {isNormal && (
            <div className="bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 px-3 py-1 rounded font-mono text-xs font-bold">
              SYSTEM NOMINAL
            </div>
          )}
        </div>
      </div>

      {(isCritical || isWarning) && (
        <div className="mt-3 pt-2.5 border-t border-dark-border/80 flex items-center justify-between text-xs font-mono">
          <span className="text-gray-300">
            Peak Temperature of <strong className={isCritical ? 'text-thermal-red' : 'text-amber-400'}>{formatTemp(maxTemp, unit)}</strong> recorded at pixel <strong className="text-white">(X:{hotspot.x}, Y:{hotspot.y})</strong>
          </span>
          <span className="text-[10px] text-gray-500">{new Date().toLocaleTimeString()}</span>
        </div>
      )}
    </div>
  );
}
