import React from 'react';
import { PALETTES, getRGBForNormalizedValue, formatTemp } from '../../utils/thermalColor.js';

export function ThermalLegend({
  minTemp = 20,
  maxTemp = 45,
  palette = PALETTES.IRONBOW,
  unit = 'C',
  autoRange = true,
  vertical = true
}) {
  // Generate gradient stops for CSS background
  const stopsCount = 20;
  const gradientStops = [];
  
  for (let i = 0; i <= stopsCount; i++) {
    const norm = i / stopsCount;
    // For vertical display, top is max (norm = 1), bottom is min (norm = 0)
    const val = vertical ? 1 - norm : norm;
    const [r, g, b] = getRGBForNormalizedValue(val, palette);
    gradientStops.push(`rgb(${r}, ${g}, ${b}) ${(norm * 100).toFixed(1)}%`);
  }

  const gradientCss = vertical
    ? `linear-gradient(to bottom, ${gradientStops.join(', ')})`
    : `linear-gradient(to right, ${gradientStops.join(', ')})`;

  const midTemp = (maxTemp + minTemp) / 2;

  if (vertical) {
    return (
      <div className="flex items-center gap-2 h-full min-h-[300px] bg-dark-panel p-3 rounded-lg border border-dark-border select-none">
        {/* Thermal Bar */}
        <div 
          className="w-5 h-full rounded border border-dark-border/60 shadow-inner"
          style={{ background: gradientCss }}
        />

        {/* Labels */}
        <div className="flex flex-col justify-between h-full font-mono text-xs text-gray-300">
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-[1px] bg-gray-400"></span>
            <span className="font-bold text-thermal-orange">{formatTemp(maxTemp, unit)}</span>
          </div>

          <div className="flex items-center gap-1 text-gray-400">
            <span className="w-1.5 h-[1px] bg-gray-500"></span>
            <span>{formatTemp(midTemp, unit)}</span>
          </div>

          <div className="flex items-center gap-1">
            <span className="w-1.5 h-[1px] bg-gray-400"></span>
            <span className="font-bold text-thermal-cyan">{formatTemp(minTemp, unit)}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-dark-panel p-3 rounded-lg border border-dark-border select-none">
      <div className="flex justify-between items-center text-xs font-mono mb-1 text-gray-300">
        <span className="text-thermal-cyan font-bold">{formatTemp(minTemp, unit)}</span>
        <span className="text-gray-400">{formatTemp(midTemp, unit)}</span>
        <span className="text-thermal-orange font-bold">{formatTemp(maxTemp, unit)}</span>
      </div>
      <div 
        className="h-4 w-full rounded border border-dark-border/60"
        style={{ background: gradientCss }}
      />
    </div>
  );
}
