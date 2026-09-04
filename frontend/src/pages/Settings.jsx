import React from 'react';
import { Settings, ShieldAlert, Palette, RotateCcw, Sliders } from 'lucide-react';
import { PALETTES } from '../utils/thermalColor.js';

export function SettingsPage({
  warningThreshold,
  onWarningThresholdChange,
  criticalThreshold,
  onCriticalThresholdChange,
  palette,
  onPaletteChange,
  mode,
  onModeChange,
  unit,
  onToggleUnit,
  onResetDefaults
}) {
  return (
    <div className="space-y-4 pb-16 lg:pb-6">
      <div className="bg-dark-panel border border-dark-border rounded-lg p-4 shadow-panel flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-gray-300" />
          <div>
            <h2 className="font-mono text-sm font-bold text-white">CRADLESENSE WORKSTATION PREFERENCES</h2>
            <p className="font-mono text-xs text-gray-400">Configure environmental monitoring thresholds & visual controls</p>
          </div>
        </div>

        <button
          onClick={onResetDefaults}
          className="flex items-center gap-1 text-xs font-mono px-3 py-1.5 rounded bg-dark-card border border-dark-border text-gray-300 hover:text-white hover:border-gray-500 transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>RESET DEFAULTS</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Environmental Thresholds */}
        <div className="bg-dark-panel border border-dark-border rounded-lg p-4 shadow-panel font-mono text-xs space-y-4">
          <h3 className="text-white font-bold text-sm border-b border-dark-border pb-2 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-emerald-400" />
            <span>ENVIRONMENT COMFORT THRESHOLDS (°C)</span>
          </h3>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-amber-400 font-bold">WARNING THRESHOLD (UPPER):</span>
                <span className="text-white font-bold">{warningThreshold}°C</span>
              </div>
              <input
                type="range"
                min={25}
                max={35}
                value={warningThreshold}
                onChange={(e) => onWarningThresholdChange(Number(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer"
              />
              <span className="text-[10px] text-gray-500">Triggers warm warning status when ambient temp exceeds value.</span>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-thermal-red font-bold">CRITICAL THRESHOLD (UPPER):</span>
                <span className="text-white font-bold">{criticalThreshold}°C</span>
              </div>
              <input
                type="range"
                min={30}
                max={40}
                value={criticalThreshold}
                onChange={(e) => onCriticalThresholdChange(Number(e.target.value))}
                className="w-full accent-thermal-red cursor-pointer"
              />
              <span className="text-[10px] text-gray-500">Triggers critical alert when ambient temp reaches high threshold.</span>
            </div>
          </div>
        </div>

        {/* Display & Palette Settings */}
        <div className="bg-dark-panel border border-dark-border rounded-lg p-4 shadow-panel font-mono text-xs space-y-4">
          <h3 className="text-white font-bold text-sm border-b border-dark-border pb-2 flex items-center gap-2">
            <Palette className="w-4 h-4 text-thermal-cyan" />
            <span>THERMAL MAP DISPLAY PREFERENCES</span>
          </h3>

          <div className="space-y-3">
            <div>
              <label className="block text-gray-400 mb-1">DEFAULT PALETTE:</label>
              <select
                value={palette}
                onChange={(e) => onPaletteChange(e.target.value)}
                className="w-full bg-dark-card border border-dark-border text-white rounded p-2 focus:outline-none focus:border-thermal-cyan"
              >
                <option value={PALETTES.IRONBOW}>Ironbow (Default Thermal)</option>
                <option value={PALETTES.RAINBOW}>Rainbow</option>
                <option value={PALETTES.INFERNO}>Inferno High Contrast</option>
                <option value={PALETTES.GRAYSCALE}>Grayscale</option>
                <option value={PALETTES.FLIR}>FLIR Camera</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-400 mb-1">INTERPOLATION RENDER:</label>
              <select
                value={mode}
                onChange={(e) => onModeChange(e.target.value)}
                className="w-full bg-dark-card border border-dark-border text-white rounded p-2 focus:outline-none focus:border-thermal-orange"
              >
                <option value="smooth">Smooth (64x64 Bilinear Upscale)</option>
                <option value="pixel">Pixelated (Raw 8x8 matrix)</option>
                <option value="contour">Isothermal Contour</option>
                <option value="infrared">FLIR Infrared HD</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-400 mb-1">TEMPERATURE UNIT:</label>
              <button
                onClick={onToggleUnit}
                className="px-4 py-2 bg-dark-card border border-dark-border text-white rounded font-bold hover:border-thermal-cyan"
              >
                ACTIVE UNIT: °{unit}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Safety Notice */}
      <div className="p-3.5 bg-dark-panel border border-dark-border rounded-lg text-gray-400 font-mono text-[11px] leading-relaxed flex items-start gap-2.5">
        <ShieldAlert className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
        <div>
          <strong className="text-white font-bold block mb-0.5">IMPORTANT ENVIRONMENTAL MONITORING NOTICE</strong>
          This system is an environmental temperature monitoring tool designed to observe ambient temperature distribution around a cradle.
          It is not a medical device and does not assess an infant's health, comfort, or medical condition.
          Configured temperature thresholds are user preferences and should not be treated as medical guidance.
        </div>
      </div>
    </div>
  );
}
