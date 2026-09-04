import React, { useState } from 'react';
import { History, Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import { ThermalCanvas } from '../components/thermal/ThermalCanvas.jsx';
import { ThermalLegend } from '../components/thermal/ThermalLegend.jsx';
import { formatTemp, PALETTES } from '../utils/thermalColor.js';

export function HistoryPage({ history = [], palette = PALETTES.IRONBOW, unit = 'C' }) {
  const [selectedIndex, setSelectedIndex] = useState(history.length - 1);
  const [isPlaying, setIsPlaying] = useState(false);

  const activeFrameData = history[selectedIndex] || null;

  return (
    <div className="space-y-4 pb-16 lg:pb-6">
      <div className="bg-dark-panel border border-dark-border rounded-lg p-4 shadow-panel flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-thermal-orange" />
          <div>
            <h2 className="font-mono text-sm font-bold text-white">HISTORICAL SESSION TELEMETRY REPLAY</h2>
            <p className="font-mono text-xs text-gray-400">Inspect & scrub past captured thermal frames</p>
          </div>
        </div>
        
        <div className="font-mono text-xs text-gray-400">
          Total Captured: <strong className="text-white">{history.length}</strong> Frames
        </div>
      </div>

      {history.length > 0 && activeFrameData ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-8 bg-dark-panel border border-dark-border rounded-lg p-6 shadow-panel flex flex-col items-center">
            {/* Timeline Scrubbing Control Bar */}
            <div className="w-full mb-4 bg-dark-card border border-dark-border p-3 rounded-lg flex flex-col gap-2">
              <div className="flex justify-between items-center text-xs font-mono text-gray-300">
                <span>Timeline Frame: #{selectedIndex + 1} of {history.length}</span>
                <span className="text-thermal-cyan">{activeFrameData.time}</span>
              </div>

              <input
                type="range"
                min={0}
                max={history.length - 1}
                value={selectedIndex}
                onChange={(e) => setSelectedIndex(Number(e.target.value))}
                className="w-full accent-thermal-orange cursor-pointer"
              />
            </div>

            {/* Thermal Snapshot */}
            <div className="w-full max-w-[450px]">
              <ThermalCanvas
                temperatures={activeFrameData.temperatures || Array.from({ length: 8 }, () => Array(8).fill(25))}
                minTemp={activeFrameData.min}
                maxTemp={activeFrameData.max}
                palette={palette}
                mode="smooth"
                showGrid={true}
                showHotspot={true}
                autoRange={true}
                unit={unit}
              />
            </div>
          </div>

          <div className="lg:col-span-4 bg-dark-panel border border-dark-border rounded-lg p-4 shadow-panel font-mono text-xs space-y-3">
            <div className="text-white font-bold border-b border-dark-border pb-2">FRAME TELEMETRY DETAILS</div>
            <div className="flex justify-between py-1 border-b border-dark-border/60">
              <span>Timestamp:</span>
              <span className="text-white font-bold">{activeFrameData.time}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-dark-border/60">
              <span>Max Temperature:</span>
              <span className="text-thermal-red font-bold">{formatTemp(activeFrameData.max, unit)}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-dark-border/60">
              <span>Min Temperature:</span>
              <span className="text-thermal-cyan font-bold">{formatTemp(activeFrameData.min, unit)}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-dark-border/60">
              <span>Avg Temperature:</span>
              <span className="text-amber-400 font-bold">{formatTemp(activeFrameData.avg, unit)}</span>
            </div>
            <div className="flex justify-between py-1">
              <span>Hotspot Cell:</span>
              <span className="text-thermal-hotspot font-bold">X:{activeFrameData.hotspotX}, Y:{activeFrameData.hotspotY}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-dark-panel border border-dark-border rounded-lg p-8 text-center font-mono text-xs text-gray-500">
          No historical thermal frames recorded yet. Start simulation streaming to capture telemetry sessions.
        </div>
      )}
    </div>
  );
}
