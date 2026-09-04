import React from 'react';
import { BarChart3, TrendingUp, ShieldAlert, Zap, Clock } from 'lucide-react';
import { formatTemp } from '../utils/thermalColor.js';

export function AnalyticsPage({ history = [], frame, unit = 'C' }) {
  const temps = frame ? frame.temperatures : [];
  const minTemp = frame ? frame.minTemperature : 20;
  const maxTemp = frame ? frame.maxTemperature : 45;
  const avgTemp = frame ? frame.averageTemperature : 27;

  // Calculate metrics over session history
  let sessionPeak = -Infinity;
  let sessionMin = Infinity;
  let totalAvgSum = 0;

  history.forEach((h) => {
    if (h.max > sessionPeak) sessionPeak = h.max;
    if (h.min < sessionMin) sessionMin = h.min;
    totalAvgSum += h.avg;
  });

  const sessionMean = history.length > 0 ? totalAvgSum / history.length : avgTemp;
  const tempVariation = Math.max(0, maxTemp - minTemp);

  return (
    <div className="space-y-4 pb-16 lg:pb-6">
      <div className="bg-dark-panel border border-dark-border rounded-lg p-4 shadow-panel flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-thermal-cyan" />
          <div>
            <h2 className="font-mono text-sm font-bold text-white">THERMAL ANALYTICS & STATISTICAL METRICS</h2>
            <p className="font-mono text-xs text-gray-400">Deep telemetry analysis of thermopile array</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-dark-panel border border-dark-border rounded-lg p-4 shadow-panel">
          <div className="flex justify-between items-center text-xs font-mono text-gray-400 mb-1">
            <span>SESSION PEAK</span>
            <TrendingUp className="w-4 h-4 text-thermal-red" />
          </div>
          <div className="text-2xl font-bold font-mono text-thermal-red">
            {formatTemp(sessionPeak > -Infinity ? sessionPeak : maxTemp, unit)}
          </div>
          <div className="text-[10px] font-mono text-gray-500 mt-1">Highest recorded in session</div>
        </div>

        <div className="bg-dark-panel border border-dark-border rounded-lg p-4 shadow-panel">
          <div className="flex justify-between items-center text-xs font-mono text-gray-400 mb-1">
            <span>THERMAL VARIATION</span>
            <Zap className="w-4 h-4 text-thermal-orange" />
          </div>
          <div className="text-2xl font-bold font-mono text-thermal-orange">
            {tempVariation.toFixed(1)}°{unit}
          </div>
          <div className="text-[10px] font-mono text-gray-500 mt-1">Delta (Max - Min)</div>
        </div>

        <div className="bg-dark-panel border border-dark-border rounded-lg p-4 shadow-panel">
          <div className="flex justify-between items-center text-xs font-mono text-gray-400 mb-1">
            <span>SESSION MEAN</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-400">
            {formatTemp(sessionMean, unit)}
          </div>
          <div className="text-[10px] font-mono text-gray-500 mt-1">Historical mean across frames</div>
        </div>

        <div className="bg-dark-panel border border-dark-border rounded-lg p-4 shadow-panel">
          <div className="flex justify-between items-center text-xs font-mono text-gray-400 mb-1">
            <span>TOTAL FRAMES LOGGED</span>
            <ShieldAlert className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400">
            {history.length}
          </div>
          <div className="text-[10px] font-mono text-gray-500 mt-1">Buffered telemetry frames</div>
        </div>
      </div>
    </div>
  );
}
