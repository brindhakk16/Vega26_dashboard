import React, { useState } from 'react';
import { calculateSpatialZones, calculateSpatialZones4x4 } from '../../../../shared/thermal.js';
import { formatTemp, getTemperatureColor, PALETTES } from '../../utils/thermalColor.js';
import { LayoutGrid } from 'lucide-react';

export function SpatialZonesCard({
  temperatures = [],
  minTemp = 24,
  maxTemp = 29,
  palette = PALETTES.IRONBOW,
  unit = 'C'
}) {
  const [gridMode, setGridMode] = useState('4x4'); // '4x4' (16 zones) or '3x3' (9 zones)
  const [hoveredZone, setHoveredZone] = useState(null);

  const zones4x4 = calculateSpatialZones4x4(temperatures);
  const zones3x3 = calculateSpatialZones(temperatures);

  if (!zones4x4 || !zones3x3) return null;

  // Center average temperature for delta calculations
  const centerVal = zones3x3.center;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between font-mono text-xs h-full">
      {/* Header with 4x4 / 3x3 Grid Mode Toggle */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-cyan-50 border border-cyan-200 flex items-center justify-center">
            <LayoutGrid className="w-3.5 h-3.5 text-cyan-600" />
          </div>
          <div>
            <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
              SPATIAL MICRO-ZONES
            </span>
            <span className="text-[10px] text-slate-400 block font-normal">
              {gridMode === '4x4' ? '16 Sub-Zones (2×2 Blocks)' : '9 Regional Maps'}
            </span>
          </div>
        </div>

        {/* 4x4 vs 3x3 Toggle */}
        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
          <button
            onClick={() => setGridMode('4x4')}
            className={`px-2 py-0.5 rounded-md font-bold text-[10px] transition-all ${
              gridMode === '4x4'
                ? 'bg-white text-cyan-700 shadow-xs border border-slate-200'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            4×4
          </button>
          <button
            onClick={() => setGridMode('3x3')}
            className={`px-2 py-0.5 rounded-md font-bold text-[10px] transition-all ${
              gridMode === '3x3'
                ? 'bg-white text-cyan-700 shadow-xs border border-slate-200'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            3×3
          </button>
        </div>
      </div>

      {/* 4x4 Matrix (16 Spatial Micro-Zones) */}
      {gridMode === '4x4' ? (
        <div className="grid grid-cols-4 gap-1.5 my-auto">
          {zones4x4.map((z) => {
            const color = getTemperatureColor(z.avg, minTemp, maxTemp, palette);
            const deltaFromCenter = Number((z.avg - centerVal).toFixed(1));
            const isHovered = hoveredZone === z.id;

            return (
              <div
                key={z.id}
                onMouseEnter={() => setHoveredZone(z.id)}
                onMouseLeave={() => setHoveredZone(null)}
                className={`p-1.5 rounded-lg border text-center font-mono transition-all relative overflow-hidden ${
                  z.isCenter
                    ? 'bg-emerald-50/90 border-emerald-300 shadow-xs'
                    : isHovered
                    ? 'bg-slate-100 border-slate-300'
                    : 'bg-slate-50/80 border-slate-200/80'
                }`}
              >
                {/* Color Indicator Bar */}
                <div 
                  className="absolute top-0 left-0 right-0 h-1 transition-all"
                  style={{ backgroundColor: color }}
                />

                <div className="flex items-center justify-between mt-0.5 mb-0.5">
                  <span className={`text-[8px] font-bold uppercase ${z.isCenter ? 'text-emerald-700' : 'text-slate-500'}`}>
                    {z.code}
                  </span>
                  <span className={`text-[8px] font-bold ${
                    deltaFromCenter > 0 ? 'text-amber-600' : deltaFromCenter < 0 ? 'text-cyan-600' : 'text-slate-400'
                  }`}>
                    {deltaFromCenter > 0 ? `+${deltaFromCenter}` : deltaFromCenter}
                  </span>
                </div>

                <div className={`text-xs font-bold tracking-tight ${
                  z.isCenter ? 'text-emerald-900' : 'text-slate-800'
                }`}>
                  {formatTemp(z.avg, unit)}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* 3x3 Matrix (9 Spatial Micro-Zones) */
        <div className="grid grid-cols-3 gap-2 my-auto">
          {[
            { code: 'TL', val: zones3x3.topLeft, sub: 'Head Left' },
            { code: 'TC', val: zones3x3.topCenter, sub: 'Headrest' },
            { code: 'TR', val: zones3x3.topRight, sub: 'Head Right' },
            { code: 'ML', val: zones3x3.middleLeft, sub: 'Left Rail' },
            { code: 'CTR', val: zones3x3.center, sub: 'Core Mattress', highlight: true },
            { code: 'MR', val: zones3x3.middleRight, sub: 'Right Rail' },
            { code: 'BL', val: zones3x3.bottomLeft, sub: 'Foot Left' },
            { code: 'BC', val: zones3x3.bottomCenter, sub: 'Footrest' },
            { code: 'BR', val: zones3x3.bottomRight, sub: 'Foot Right' },
          ].map((z, idx) => {
            const color = getTemperatureColor(z.val, minTemp, maxTemp, palette);
            const deltaFromCenter = Number((z.val - centerVal).toFixed(1));

            return (
              <div
                key={idx}
                className={`p-2.5 rounded-xl border text-center font-mono transition-all relative overflow-hidden ${
                  z.highlight
                    ? 'bg-emerald-50/80 border-emerald-300 shadow-xs'
                    : 'bg-slate-50/80 border-slate-200/80'
                }`}
              >
                <div 
                  className="absolute top-0 left-0 right-0 h-1.5"
                  style={{ backgroundColor: color }}
                />

                <div className="flex items-center justify-between mt-1 mb-0.5">
                  <span className={`text-[9px] font-bold uppercase ${z.highlight ? 'text-emerald-700' : 'text-slate-500'}`}>
                    {z.code}
                  </span>
                  {!z.highlight && (
                    <span className={`text-[9px] font-bold ${
                      deltaFromCenter > 0 ? 'text-amber-600' : deltaFromCenter < 0 ? 'text-cyan-600' : 'text-slate-400'
                    }`}>
                      {deltaFromCenter > 0 ? `+${deltaFromCenter}` : deltaFromCenter}
                    </span>
                  )}
                </div>

                <div className={`text-sm font-bold tracking-tight ${
                  z.highlight ? 'text-emerald-900' : 'text-slate-800'
                }`}>
                  {formatTemp(z.val, unit)}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
