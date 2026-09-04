import React, { useState } from 'react';
import { getTemperatureColor, formatTemp, PALETTES } from '../../utils/thermalColor.js';
import { Grid, Eye } from 'lucide-react';

export function ThermalMatrix({
  temperatures,
  minTemp = 20,
  maxTemp = 45,
  palette = PALETTES.IRONBOW,
  unit = 'C'
}) {
  const [showColor, setShowColor] = useState(true);

  if (!temperatures || temperatures.length !== 8) {
    return (
      <div className="bg-dark-panel p-4 rounded-lg border border-dark-border text-center font-mono text-sm text-gray-400">
        No matrix data available
      </div>
    );
  }

  return (
    <div className="bg-dark-panel border border-dark-border rounded-lg p-4 shadow-panel">
      <div className="flex items-center justify-between mb-3 border-b border-dark-border pb-2">
        <div className="flex items-center gap-2">
          <Grid className="w-4 h-4 text-thermal-cyan" />
          <h3 className="font-mono text-xs font-bold text-gray-200 tracking-wider">
            RAW 8×8 SENSOR MATRIX (64 PIXELS)
          </h3>
        </div>

        <button
          onClick={() => setShowColor(!showColor)}
          className="flex items-center gap-1 text-[11px] font-mono text-gray-400 hover:text-white bg-dark-card border border-dark-border px-2 py-1 rounded"
        >
          <Eye className="w-3 h-3" />
          <span>{showColor ? 'COLORIZED' : 'TEXT ONLY'}</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[400px]">
          {/* Header Row Indices (0..7) */}
          <div className="grid grid-cols-9 gap-1 text-center font-mono text-[10px] text-gray-500 mb-1">
            <span>Y\X</span>
            {[0, 1, 2, 3, 4, 5, 6, 7].map(x => (
              <span key={x}>X{x}</span>
            ))}
          </div>

          {/* Matrix Rows */}
          {temperatures.map((row, r) => (
            <div key={r} className="grid grid-cols-9 gap-1 mb-1 items-center">
              <span className="font-mono text-[10px] text-gray-500 text-center">Y{r}</span>
              {row.map((val, c) => {
                const bg = showColor ? getTemperatureColor(val, minTemp, maxTemp, palette) : 'transparent';
                
                return (
                  <div
                    key={c}
                    style={{ backgroundColor: bg }}
                    className={`py-1 px-0.5 rounded text-center font-mono text-[11px] font-semibold transition-colors duration-150 border border-white/5 ${
                      showColor ? 'text-black drop-shadow-[0_1px_1px_rgba(255,255,255,0.7)]' : 'text-gray-200 bg-dark-card'
                    }`}
                    title={`Pixel (X:${c}, Y:${r}): ${formatTemp(val, unit)}`}
                  >
                    {unit === 'F' ? Math.round((val * 9) / 5 + 32) : val.toFixed(1)}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
