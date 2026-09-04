import React from 'react';
import { calculateSpatialZones } from '../../../../shared/thermal.js';
import { formatTemp, getTemperatureColor, PALETTES } from '../../utils/thermalColor.js';
import { LayoutGrid } from 'lucide-react';

export function CradleZones({ temperatures, minTemp = 20, maxTemp = 45, palette = PALETTES.IRONBOW, unit = 'C' }) {
  const zones = calculateSpatialZones(temperatures);

  if (!zones) return null;

  const zoneItems = [
    { key: 'topLeft', label: 'Top Left', val: zones.topLeft },
    { key: 'topCenter', label: 'Top Center', val: zones.topCenter },
    { key: 'topRight', label: 'Top Right', val: zones.topRight },
    { key: 'middleLeft', label: 'Mid Left', val: zones.middleLeft },
    { key: 'center', label: 'Center', val: zones.center, highlight: true },
    { key: 'middleRight', label: 'Mid Right', val: zones.middleRight },
    { key: 'bottomLeft', label: 'Bottom Left', val: zones.bottomLeft },
    { key: 'bottomCenter', label: 'Bottom Center', val: zones.bottomCenter },
    { key: 'bottomRight', label: 'Bottom Right', val: zones.bottomRight },
  ];

  return (
    <div className="bg-dark-panel border border-dark-border rounded-lg p-4 shadow-panel">
      <div className="flex items-center gap-2 mb-3 border-b border-dark-border pb-2">
        <LayoutGrid className="w-4 h-4 text-thermal-cyan" />
        <h3 className="font-mono text-xs font-bold text-gray-200 tracking-wider">
          SPATIAL TEMPERATURE ZONES (9 REGIONS)
        </h3>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {zoneItems.map((zone) => {
          const color = getTemperatureColor(zone.val, minTemp, maxTemp, palette);
          return (
            <div
              key={zone.key}
              className={`p-2.5 rounded border text-center font-mono transition-all relative overflow-hidden ${
                zone.highlight
                  ? 'bg-dark-card border-thermal-cyan/60 shadow-cyan-glow'
                  : 'bg-dark-card border-dark-border'
              }`}
            >
              <div 
                className="absolute top-0 left-0 right-0 h-1"
                style={{ backgroundColor: color }}
              />
              <div className="text-[10px] text-gray-400 font-medium uppercase mt-1">
                {zone.label}
              </div>
              <div className={`text-sm font-bold mt-0.5 ${zone.highlight ? 'text-white' : 'text-gray-200'}`}>
                {formatTemp(zone.val, unit)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
