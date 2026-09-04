import React from 'react';
import { ThermometerSnowflake, ThermometerSun, Gauge, Sparkles, SlidersHorizontal } from 'lucide-react';
import { formatTemp } from '../../utils/thermalColor.js';
import { calculateUniformity } from '../../../../shared/thermal.js';

export function MetricCards({
  temperatures = [],
  minTemp = 0,
  maxTemp = 0,
  avgTemp = 0,
  unit = 'C'
}) {
  const tempRange = Number(Math.max(0, maxTemp - minTemp).toFixed(1));
  const uniformity = calculateUniformity(temperatures, avgTemp);

  return (
    <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
      {/* CURRENT AVERAGE */}
      <div className="bg-dark-panel border border-dark-border rounded-lg p-3 shadow-panel relative overflow-hidden">
        <div className="flex items-center justify-between text-gray-400 text-xs font-mono mb-1">
          <span>CURRENT</span>
          <Gauge className="w-4 h-4 text-emerald-400" />
        </div>
        <div className="text-xl font-bold font-mono text-emerald-400">
          {formatTemp(avgTemp, unit)}
        </div>
        <div className="text-[10px] font-mono text-gray-500 mt-1">Cradle Mean Reading</div>
        <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-400/5 rounded-full blur-xl pointer-events-none"></div>
      </div>

      {/* COOLEST ZONE (MIN) */}
      <div className="bg-dark-panel border border-dark-border rounded-lg p-3 shadow-panel relative overflow-hidden">
        <div className="flex items-center justify-between text-gray-400 text-xs font-mono mb-1">
          <span>COOLEST ZONE</span>
          <ThermometerSnowflake className="w-4 h-4 text-thermal-cyan" />
        </div>
        <div className="text-xl font-bold font-mono text-thermal-cyan">
          {formatTemp(minTemp, unit)}
        </div>
        <div className="text-[10px] font-mono text-gray-500 mt-1">Lowest Local Temp</div>
        <div className="absolute top-0 right-0 w-16 h-16 bg-thermal-cyan/5 rounded-full blur-xl pointer-events-none"></div>
      </div>

      {/* WARMEST ZONE (MAX) */}
      <div className="bg-dark-panel border border-dark-border rounded-lg p-3 shadow-panel relative overflow-hidden">
        <div className="flex items-center justify-between text-gray-400 text-xs font-mono mb-1">
          <span>WARMEST ZONE</span>
          <ThermometerSun className="w-4 h-4 text-thermal-orange" />
        </div>
        <div className="text-xl font-bold font-mono text-thermal-orange">
          {formatTemp(maxTemp, unit)}
        </div>
        <div className="text-[10px] font-mono text-gray-500 mt-1">Peak Local Temp</div>
        <div className="absolute top-0 right-0 w-16 h-16 bg-thermal-orange/5 rounded-full blur-xl pointer-events-none"></div>
      </div>

      {/* TEMP RANGE */}
      <div className="bg-dark-panel border border-dark-border rounded-lg p-3 shadow-panel relative overflow-hidden">
        <div className="flex items-center justify-between text-gray-400 text-xs font-mono mb-1">
          <span>TEMP RANGE</span>
          <SlidersHorizontal className="w-4 h-4 text-amber-400" />
        </div>
        <div className="text-xl font-bold font-mono text-amber-400">
          {tempRange}°{unit}
        </div>
        <div className="text-[10px] font-mono text-gray-500 mt-1">Max - Min Delta</div>
        <div className="absolute top-0 right-0 w-16 h-16 bg-amber-400/5 rounded-full blur-xl pointer-events-none"></div>
      </div>

      {/* THERMAL UNIFORMITY */}
      <div className="bg-dark-panel border border-dark-border rounded-lg p-3 shadow-panel relative overflow-hidden col-span-2 md:col-span-2">
        <div className="flex items-center justify-between text-gray-400 text-xs font-mono mb-1">
          <span>THERMAL UNIFORMITY</span>
          <Sparkles className="w-4 h-4 text-purple-400" />
        </div>
        <div className="text-xl font-bold font-mono text-purple-400 flex items-baseline gap-2">
          <span>{uniformity}%</span>
          <span className="text-xs font-normal text-gray-400">
            {uniformity >= 85 ? 'High Balance' : uniformity >= 70 ? 'Moderate' : 'Uneven Distribution'}
          </span>
        </div>
        <div className="text-[10px] font-mono text-gray-500 mt-1">
          Distribution consistency across cradle grid
        </div>
        <div className="absolute top-0 right-0 w-16 h-16 bg-purple-400/5 rounded-full blur-xl pointer-events-none"></div>
      </div>
    </div>
  );
}
