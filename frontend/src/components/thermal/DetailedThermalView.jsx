import React, { useState } from 'react';
import { CradleReferenceLayer } from './CradleReferenceLayer.jsx';
import { ThermalOverlayCanvas } from './ThermalOverlayCanvas.jsx';
import { IsothermalContourLayer } from './IsothermalContourLayer.jsx';
import { BabyMaskLayer } from './BabyMaskLayer.jsx';
import { CalibrationOverlay } from './CalibrationOverlay.jsx';
import { ProcessorDebugPanel } from './ProcessorDebugPanel.jsx';
import { ThermalLegend } from './ThermalLegend.jsx';
import { ThermalMatrix } from './ThermalMatrix.jsx';
import { interpolateBilinear } from '../../utils/interpolation.js';
import { PALETTES, formatTemp } from '../../utils/thermalColor.js';
import { DEFAULT_CALIBRATION } from '../../../../shared/thermal.js';
import { Eye, Layers, Sliders, Target, Cpu, Activity, Sparkles, RotateCcw } from 'lucide-react';

export function DetailedThermalView({
  frame,
  processedFrame,
  status,
  palette = PALETTES.IRONBOW,
  unit = 'C',
  onPixelSelect
}) {
  // 5 Debug Inspection Tabs: 'composite' (default), 'image', 'mask', 'field', 'contours'
  const [activeTab, setActiveTab] = useState('composite');

  // Visualization Layer Controls
  const [showReference, setShowReference] = useState(true);
  const [showThermalFill, setShowThermalFill] = useState(true);
  const [showContours, setShowContours] = useState(true);
  const [showContourLabels, setShowContourLabels] = useState(true);
  const [contourInterval, setContourInterval] = useState(1.0); // 0.5°C, 1.0°C, 2.0°C
  const [thermalOpacity, setThermalOpacity] = useState(0.4); // 40% default
  const [contourOpacity, setContourOpacity] = useState(0.9); // 90% default
  const [showBabyMask, setShowBabyMask] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const [showWarmest, setShowWarmest] = useState(true);
  const [showCalibration, setShowCalibration] = useState(false);

  // Calibration State
  const [calibration, setCalibration] = useState(DEFAULT_CALIBRATION);
  const [containerSize, setContainerSize] = useState({ width: 500, height: 500 });

  const temps = frame ? frame.temperatures : [];
  const minTemp = frame ? frame.minTemperature : 24;
  const maxTemp = frame ? frame.maxTemperature : 32;

  // 64x64 Bilinear Interpolated Grid for Marching Squares
  const interpolatedGrid = temps.length === 8 ? interpolateBilinear(temps, 64) : [];

  const handleCalibrationChange = (patch) => {
    setCalibration((prev) => ({ ...prev, ...patch }));
  };

  const handleResetCalibration = () => {
    setCalibration(DEFAULT_CALIBRATION);
  };

  return (
    <div className="space-y-4 pb-16 lg:pb-6">
      {/* 5 Technical Debug Inspection Tabs */}
      <div className="bg-dark-panel border border-dark-border rounded-lg p-3.5 shadow-panel flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-emerald-400" />
          <div>
            <h2 className="font-mono text-sm font-bold text-white">DETAILED BABY ISOTHERMAL VIEW</h2>
            <p className="font-mono text-xs text-gray-400">Marching Squares contours clipped to baby spatial mask</p>
          </div>
        </div>

        {/* Debug View Tabs */}
        <div className="flex flex-wrap items-center gap-1 font-mono text-xs">
          {[
            { id: 'composite', label: 'Final Composite', icon: Eye },
            { id: 'image', label: 'Original Image', icon: Layers },
            { id: 'mask', label: 'Baby Mask', icon: Target },
            { id: 'field', label: 'Thermal Field', icon: Activity },
            { id: 'contours', label: 'Isothermal Contours', icon: Sparkles }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded border uppercase font-bold flex items-center gap-1.5 transition-all ${
                  isActive
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-sm'
                    : 'bg-dark-card border-dark-border text-gray-400 hover:text-white'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-gray-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Viewport Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Multi-Layer Stage Viewport */}
        <div className="lg:col-span-8 bg-dark-panel border border-dark-border rounded-lg p-4 shadow-panel flex flex-col items-center">
          <div className="w-full flex items-center justify-between mb-3 border-b border-dark-border pb-2 font-mono text-xs">
            <span className="font-bold text-gray-200 uppercase tracking-wider">
              {activeTab === 'composite' ? 'MULTI-LAYER COMPOSITE VIEW' : `${activeTab.toUpperCase()} DIAGNOSTIC VIEW`}
            </span>
            <span className="text-emerald-400 font-semibold">
              CONTOUR INTERVAL: {contourInterval}°C | SENSOR: 8×8 → 64×64
            </span>
          </div>

          <div className="w-full flex flex-col md:flex-row gap-4 items-center justify-center">
            {/* Multi-Layer Stage Container */}
            <div className="relative w-full max-w-[500px]">
              {/* Layer 1: Baby Reference Image */}
              <CradleReferenceLayer
                showImage={activeTab === 'composite' || activeTab === 'image'}
                onResize={setContainerSize}
              />

              {/* Layer 2: Baby Spatial Mask Overlay */}
              {(activeTab === 'mask' || showBabyMask) && (
                <BabyMaskLayer
                  calibration={calibration}
                  containerWidth={containerSize.width}
                  containerHeight={containerSize.height}
                  showBoundary={true}
                />
              )}

              {/* Layer 3: Transparent Thermal Fill Canvas */}
              {(activeTab === 'composite' || activeTab === 'field') && (
                <ThermalOverlayCanvas
                  temperatures={temps}
                  minTemp={minTemp}
                  maxTemp={maxTemp}
                  palette={palette}
                  mode="smooth"
                  opacity={activeTab === 'field' ? 1.0 : thermalOpacity}
                  calibration={calibration}
                  containerWidth={containerSize.width}
                  containerHeight={containerSize.height}
                  showThermal={showThermalFill}
                  showGrid={showGrid}
                  showWarmest={showWarmest}
                  showValues={false}
                  unit={unit}
                  onPixelSelect={onPixelSelect}
                />
              )}

              {/* Layer 4: Clipped Isothermal Contour Lines (Marching Squares) */}
              {(activeTab === 'composite' || activeTab === 'contours') && showContours && (
                <IsothermalContourLayer
                  grid={interpolatedGrid}
                  minTemp={minTemp}
                  maxTemp={maxTemp}
                  interval={contourInterval}
                  opacity={activeTab === 'contours' ? 1.0 : contourOpacity}
                  calibration={calibration}
                  containerWidth={containerSize.width}
                  containerHeight={containerSize.height}
                  showLabels={showContourLabels}
                />
              )}

              {/* Layer 5: Calibration FOV Bounds Overlay */}
              {showCalibration && (
                <CalibrationOverlay
                  calibration={calibration}
                  containerWidth={containerSize.width}
                  containerHeight={containerSize.height}
                  onCalibrationChange={handleCalibrationChange}
                />
              )}
            </div>

            {/* Vertical Legend Bar */}
            <div className="hidden md:block">
              <ThermalLegend
                minTemp={minTemp}
                maxTemp={maxTemp}
                palette={palette}
                unit={unit}
                autoRange={true}
                vertical={true}
              />
            </div>
          </div>
        </div>

        {/* View & Contour Controls Sidebar */}
        <div className="lg:col-span-4 space-y-4 font-mono text-xs">
          <div className="bg-dark-panel border border-dark-border rounded-lg p-4 shadow-panel space-y-4">
            <div className="flex items-center justify-between border-b border-dark-border pb-2">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-emerald-400" />
                <h3 className="font-bold text-gray-200 tracking-wider">
                  ISOTHERMAL DISPLAY CONTROLS
                </h3>
              </div>
              <button
                onClick={handleResetCalibration}
                title="Reset Calibration"
                className="p-1 rounded bg-dark-card border border-dark-border text-gray-400 hover:text-white"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Contour Interval Selector */}
            <div>
              <label className="block text-gray-400 mb-1">CONTOUR INTERVAL (°C):</label>
              <div className="grid grid-cols-3 gap-1">
                {[0.5, 1.0, 2.0].map((step) => (
                  <button
                    key={step}
                    onClick={() => setContourInterval(step)}
                    className={`py-1 rounded border text-[11px] font-bold ${
                      contourInterval === step
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                        : 'bg-dark-card border-dark-border text-gray-400'
                    }`}
                  >
                    {step}°C
                  </button>
                ))}
              </div>
            </div>

            {/* Thermal Fill Opacity Slider */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-gray-400">THERMAL FILL OPACITY:</span>
                <span className="text-emerald-400 font-bold">{Math.round(thermalOpacity * 100)}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={Math.round(thermalOpacity * 100)}
                onChange={(e) => setThermalOpacity(Number(e.target.value) / 100)}
                className="w-full accent-emerald-400 cursor-pointer"
              />
            </div>

            {/* Contour Line Opacity Slider */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-gray-400">CONTOUR LINE OPACITY:</span>
                <span className="text-thermal-cyan font-bold">{Math.round(contourOpacity * 100)}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={Math.round(contourOpacity * 100)}
                onChange={(e) => setContourOpacity(Number(e.target.value) / 100)}
                className="w-full accent-thermal-cyan cursor-pointer"
              />
            </div>

            {/* Layer Toggles */}
            <div className="space-y-2 border-t border-dark-border pt-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">ISOTHERMAL CONTOURS:</span>
                <button
                  onClick={() => setShowContours(!showContours)}
                  className={`px-2.5 py-1 rounded border text-[11px] font-bold ${
                    showContours ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-dark-card border-dark-border text-gray-500'
                  }`}
                >
                  {showContours ? 'ON' : 'OFF'}
                </button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-400">CONTOUR LABELS:</span>
                <button
                  onClick={() => setShowContourLabels(!showContourLabels)}
                  className={`px-2.5 py-1 rounded border text-[11px] font-bold ${
                    showContourLabels ? 'bg-thermal-cyan/20 border-thermal-cyan text-thermal-cyan' : 'bg-dark-card border-dark-border text-gray-500'
                  }`}
                >
                  {showContourLabels ? 'ON' : 'OFF'}
                </button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-400">THERMAL FILL:</span>
                <button
                  onClick={() => setShowThermalFill(!showThermalFill)}
                  className={`px-2.5 py-1 rounded border text-[11px] font-bold ${
                    showThermalFill ? 'bg-thermal-orange/20 border-thermal-orange text-thermal-orange' : 'bg-dark-card border-dark-border text-gray-500'
                  }`}
                >
                  {showThermalFill ? 'ON' : 'OFF'}
                </button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-400">BABY SPATIAL MASK:</span>
                <button
                  onClick={() => setShowBabyMask(!showBabyMask)}
                  className={`px-2.5 py-1 rounded border text-[11px] font-bold ${
                    showBabyMask ? 'bg-purple-500/20 border-purple-500 text-purple-400' : 'bg-dark-card border-dark-border text-gray-500'
                  }`}
                >
                  {showBabyMask ? 'ON' : 'OFF'}
                </button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-400">CALIBRATION BOUNDS:</span>
                <button
                  onClick={() => setShowCalibration(!showCalibration)}
                  className={`px-2.5 py-1 rounded border text-[11px] font-bold ${
                    showCalibration ? 'bg-amber-500/20 border-amber-500 text-amber-400' : 'bg-dark-card border-dark-border text-gray-500'
                  }`}
                >
                  {showCalibration ? 'ON' : 'OFF'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Processor Pipeline Debug Panel */}
      <ProcessorDebugPanel
        processedFrame={processedFrame}
        status={status}
      />

      {/* Raw 8x8 Sensor Matrix */}
      <ThermalMatrix
        temperatures={temps}
        minTemp={minTemp}
        maxTemp={maxTemp}
        palette={palette}
        unit={unit}
      />
    </div>
  );
}
