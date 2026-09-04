import React from 'react';
import { Play, Pause, RotateCcw, Palette, Layers, Zap } from 'lucide-react';
import { PALETTES } from '../../utils/thermalColor.js';
import { CRADLE_SCENARIOS } from '../../../../shared/thermal.js';

export function ThermalControls({
  isRunning = true,
  onTogglePlay,
  onReset,
  scenario = CRADLE_SCENARIOS.NORMAL_CRADLE,
  onScenarioChange,
  fps = 10,
  onFpsChange,
  palette = PALETTES.IRONBOW,
  onPaletteChange,
  mode = 'smooth',
  onModeChange,
  showGrid = true,
  onToggleGrid,
  showCradleOutline = true,
  onToggleCradleOutline,
  autoRange = true,
  onToggleAutoRange,
  unit = 'C',
  onToggleUnit
}) {
  return (
    <div className="bg-dark-panel border border-dark-border rounded-lg p-3.5 shadow-panel">
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Playback Controls */}
        <div className="flex items-center gap-2 border-r border-dark-border pr-3">
          <button
            onClick={onTogglePlay}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded font-mono font-medium transition-all ${
              isRunning
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 hover:bg-amber-500/30'
                : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/30'
            }`}
          >
            {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isRunning ? 'PAUSE' : 'START'}</span>
          </button>

          <button
            onClick={onReset}
            title="Reset Telemetry Buffer"
            className="p-1.5 rounded bg-dark-card border border-dark-border text-gray-300 hover:text-white hover:border-gray-500 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Cradle Scenario Selector */}
        <div className="flex items-center gap-2">
          <Zap className="w-3.5 h-3.5 text-thermal-cyan" />
          <span className="text-gray-400 font-mono">ENVIRONMENT SCENARIO:</span>
          <select
            value={scenario}
            onChange={(e) => onScenarioChange(e.target.value)}
            className="bg-dark-card border border-dark-border text-white rounded px-2.5 py-1 font-mono focus:outline-none focus:border-thermal-cyan"
          >
            <option value={CRADLE_SCENARIOS.NORMAL_CRADLE}>Normal Cradle (26.5°C - 27.8°C)</option>
            <option value={CRADLE_SCENARIOS.GRADUAL_WARMING}>Gradual Environmental Warming</option>
            <option value={CRADLE_SCENARIOS.GRADUAL_COOLING}>Gradual Environmental Cooling</option>
            <option value={CRADLE_SCENARIOS.LOCAL_WARM_REGION}>Local Warm Region (Center)</option>
            <option value={CRADLE_SCENARIOS.UNEVEN_ENVIRONMENT}>Uneven Environment (Left vs Right)</option>
            <option value={CRADLE_SCENARIOS.SUDDEN_TEMP_CHANGE}>Sudden Temperature Change</option>
            <option value={CRADLE_SCENARIOS.SENSOR_OFFLINE}>Sensor Offline Simulation</option>
            <option value={CRADLE_SCENARIOS.SENSOR_RECOVERY}>Sensor Recovery Simulation</option>
          </select>
        </div>

        {/* Rendering Mode */}
        <div className="flex items-center gap-2">
          <Layers className="w-3.5 h-3.5 text-thermal-orange" />
          <span className="text-gray-400 font-mono">MAP RENDER:</span>
          <select
            value={mode}
            onChange={(e) => onModeChange(e.target.value)}
            className="bg-dark-card border border-dark-border text-white rounded px-2.5 py-1 font-mono focus:outline-none focus:border-thermal-orange"
          >
            <option value="smooth">Smooth (64x64 Bilinear)</option>
            <option value="pixel">Pixelated (Raw 8x8 matrix)</option>
            <option value="contour">Isothermal Contour</option>
            <option value="infrared">FLIR Infrared HD</option>
          </select>
        </div>

        {/* Palette Selector */}
        <div className="flex items-center gap-2">
          <Palette className="w-3.5 h-3.5 text-purple-400" />
          <span className="text-gray-400 font-mono">PALETTE:</span>
          <select
            value={palette}
            onChange={(e) => onPaletteChange(e.target.value)}
            className="bg-dark-card border border-dark-border text-white rounded px-2.5 py-1 font-mono focus:outline-none focus:border-purple-400"
          >
            <option value={PALETTES.IRONBOW}>Ironbow (Default Thermal)</option>
            <option value={PALETTES.RAINBOW}>Rainbow</option>
            <option value={PALETTES.INFERNO}>Inferno</option>
            <option value={PALETTES.GRAYSCALE}>Grayscale</option>
            <option value={PALETTES.FLIR}>FLIR Camera</option>
          </select>
        </div>

        {/* Toggles */}
        <div className="flex items-center gap-2 border-l border-dark-border pl-3">
          <button
            onClick={onToggleCradleOutline}
            className={`px-2.5 py-1 rounded font-mono border transition-all ${
              showCradleOutline 
                ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' 
                : 'bg-dark-card border-dark-border text-gray-400'
            }`}
          >
            CRADLE BOUNDARY {showCradleOutline ? 'ON' : 'OFF'}
          </button>

          <button
            onClick={onToggleGrid}
            className={`px-2.5 py-1 rounded font-mono border transition-all ${
              showGrid 
                ? 'bg-thermal-cyan/20 border-thermal-cyan text-thermal-cyan' 
                : 'bg-dark-card border-dark-border text-gray-400'
            }`}
          >
            GRID {showGrid ? 'ON' : 'OFF'}
          </button>

          <button
            onClick={onToggleUnit}
            className="px-2.5 py-1 rounded font-mono border border-dark-border bg-dark-card text-white hover:border-gray-400"
          >
            °{unit}
          </button>
        </div>
      </div>
    </div>
  );
}
