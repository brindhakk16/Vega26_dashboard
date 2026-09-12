import React, { useState } from 'react';
import { SlidersHorizontal, ShieldAlert, CheckCircle2, RotateCcw, Save, Cpu } from 'lucide-react';
import { DEFAULT_THRESHOLDS } from '../utils/sensorDefaults.js';

export function SensorCalibrationPage({ thresholds = {}, onUpdateThresholds }) {
  const [form, setForm] = useState({ ...DEFAULT_THRESHOLDS, ...thresholds });
  const [saved, setSaved] = useState(false);

  const handleChange = (key, val) => {
    setForm(prev => ({ ...prev, [key]: Number(val) }));
    setSaved(false);
  };

  const handleSave = () => {
    onUpdateThresholds(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    setForm({ ...DEFAULT_THRESHOLDS });
    onUpdateThresholds(DEFAULT_THRESHOLDS);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-4 md:p-8 space-y-6 font-jakarta text-white select-none">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-violet-500/20 pb-5">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white font-outfit uppercase flex items-center gap-2.5 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
            <SlidersHorizontal className="w-7 h-7 text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
            <span>SENSOR CALIBRATION & THRESHOLDS</span>
          </h1>
          <p className="text-xs text-violet-300/70 font-sans mt-1">
            Configure baseline raw ADC calibration, gas conversion models & safety alert thresholds
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <button
            onClick={handleReset}
            className="px-4 py-2 rounded-xl bg-obsidian-900 hover:bg-obsidian-800 border border-violet-500/30 text-violet-200 font-bold flex items-center gap-1.5 transition-all shadow-[0_0_10px_rgba(139,92,246,0.1)]"
          >
            <RotateCcw className="w-3.5 h-3.5 text-violet-400" />
            <span>RESET DEFAULTS</span>
          </button>

          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-outfit font-bold text-xs flex items-center gap-1.5 shadow-[0_0_15px_rgba(139,92,246,0.4)] transition-all"
          >
            <Save className="w-4 h-4 text-[#D4FF00]" />
            <span className={saved ? 'text-[#D4FF00]' : ''}>{saved ? 'SETTINGS SAVED ✓' : 'SAVE CALIBRATION'}</span>
          </button>
        </div>
      </div>

      {/* ENGINEERING NOTICE CARD */}
      <div className="p-4 bg-amber-900/20 border border-amber-500/30 rounded-2xl text-amber-200 font-sans text-xs leading-relaxed flex items-start gap-3 shadow-[0_0_15px_rgba(251,191,36,0.05)] backdrop-blur-sm">
        <ShieldAlert className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5 drop-shadow-[0_0_5px_rgba(251,191,36,0.5)]" />
        <div>
          <strong className="text-white font-bold block mb-1 font-outfit text-sm">CALIBRATION & METRIC DISCREPANCY NOTICE</strong>
          Generic analog gas sensors output a <strong className="text-amber-400">RAW ADC VALUE</strong> (0-1023). Conversion to calibrated concentration (ppm) requires clean air baseline zeroing (R0) and empirical temperature/humidity compensation curves.
        </div>
      </div>

      {/* THRESHOLDS CONFIGURATION GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 font-mono text-xs">
        
        {/* AMG8833 Thermal Thresholds */}
        <div className="bg-obsidian-800/80 backdrop-blur-md border border-violet-500/20 rounded-3xl p-6 shadow-[0_4px_20px_rgba(139,92,246,0.1)] space-y-4">
          <h3 className="text-white font-extrabold font-outfit text-sm border-b border-violet-500/20 pb-3 uppercase flex items-center gap-2">
            <Cpu className="w-4 h-4 text-emerald-400" />
            <span>Thermal Infrared Array Thresholds (°C)</span>
          </h3>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1.5 text-violet-300/70 font-bold">
                <span>Thermal Warning Max:</span>
                <span className="text-amber-400 font-extrabold drop-shadow-[0_0_5px_rgba(251,191,36,0.5)]">{form.thermalWarningMax}°C</span>
              </div>
              <input
                type="range" min="30" max="45" step="0.5"
                value={form.thermalWarningMax}
                onChange={(e) => handleChange('thermalWarningMax', e.target.value)}
                className="w-full accent-amber-500 cursor-pointer h-2 bg-obsidian-900 border border-violet-500/30 rounded-lg appearance-none"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1.5 text-violet-300/70 font-bold">
                <span>Thermal Critical Max:</span>
                <span className="text-rose-400 font-extrabold drop-shadow-[0_0_5px_rgba(244,63,94,0.5)]">{form.thermalCriticalMax}°C</span>
              </div>
              <input
                type="range" min="35" max="50" step="0.5"
                value={form.thermalCriticalMax}
                onChange={(e) => handleChange('thermalCriticalMax', e.target.value)}
                className="w-full accent-rose-500 cursor-pointer h-2 bg-obsidian-900 border border-violet-500/30 rounded-lg appearance-none"
              />
            </div>
          </div>
        </div>

        {/* MR24D11C10 Radar Breathing Thresholds */}
        <div className="bg-obsidian-800/80 backdrop-blur-md border border-violet-500/20 rounded-3xl p-6 shadow-[0_4px_20px_rgba(139,92,246,0.1)] space-y-4">
          <h3 className="text-white font-extrabold font-outfit text-sm border-b border-violet-500/20 pb-3 uppercase flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>Radar Breathing Rate Thresholds (BPM)</span>
          </h3>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1 text-violet-300/70 font-bold">
                <span>Normal Range:</span>
                <span className="text-emerald-400 font-extrabold drop-shadow-[0_0_5px_rgba(52,211,153,0.5)]">{form.breathingMinNormal} - {form.breathingMaxNormal} BPM</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1 text-violet-300/70 font-bold">
                <span>Low Respiration Warning:</span>
                <span className="text-amber-400 font-extrabold drop-shadow-[0_0_5px_rgba(251,191,36,0.5)]">Below {form.breathingLowWarning} BPM</span>
              </div>
              <input
                type="range" min="5" max="15"
                value={form.breathingLowWarning}
                onChange={(e) => handleChange('breathingLowWarning', e.target.value)}
                className="w-full accent-amber-500 cursor-pointer h-2 bg-obsidian-900 border border-violet-500/30 rounded-lg appearance-none"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1 text-violet-300/70 font-bold">
                <span>High Respiration Warning:</span>
                <span className="text-rose-400 font-extrabold drop-shadow-[0_0_5px_rgba(244,63,94,0.5)]">Above {form.breathingHighWarning} BPM</span>
              </div>
              <input
                type="range" min="20" max="40"
                value={form.breathingHighWarning}
                onChange={(e) => handleChange('breathingHighWarning', e.target.value)}
                className="w-full accent-rose-500 cursor-pointer h-2 bg-obsidian-900 border border-violet-500/30 rounded-lg appearance-none"
              />
            </div>
          </div>
        </div>

        {/* MQ-135 Gas Thresholds */}
        <div className="bg-obsidian-800/80 backdrop-blur-md border border-violet-500/20 rounded-3xl p-6 shadow-[0_4px_20px_rgba(139,92,246,0.1)] space-y-4">
          <h3 className="text-white font-extrabold font-outfit text-sm border-b border-violet-500/20 pb-3 uppercase flex items-center gap-2">
            <Cpu className="w-4 h-4 text-amber-400" />
            <span>Air Quality Gas Thresholds (ppm)</span>
          </h3>

          <div className="space-y-3">
            <div>
              <span className="text-violet-300/70 font-bold block mb-1">CO₂ Warning / Critical (ppm):</span>
              <div className="flex gap-3">
                <input
                  type="number" value={form.co2Warning}
                  onChange={(e) => handleChange('co2Warning', e.target.value)}
                  className="bg-obsidian-900 border border-violet-500/30 rounded-xl p-2.5 text-white font-bold w-1/2 focus:ring-2 focus:ring-violet-500 outline-none transition-all"
                />
                <input
                  type="number" value={form.co2Critical}
                  onChange={(e) => handleChange('co2Critical', e.target.value)}
                  className="bg-obsidian-900 border border-violet-500/30 rounded-xl p-2.5 text-white font-bold w-1/2 focus:ring-2 focus:ring-rose-500 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <span className="text-violet-300/70 font-bold block mb-1">CO Warning / Critical (ppm):</span>
              <div className="flex gap-3">
                <input
                  type="number" value={form.coWarning}
                  onChange={(e) => handleChange('coWarning', e.target.value)}
                  className="bg-obsidian-900 border border-violet-500/30 rounded-xl p-2.5 text-white font-bold w-1/2 focus:ring-2 focus:ring-violet-500 outline-none transition-all"
                />
                <input
                  type="number" value={form.coCritical}
                  onChange={(e) => handleChange('coCritical', e.target.value)}
                  className="bg-obsidian-900 border border-violet-500/30 rounded-xl p-2.5 text-white font-bold w-1/2 focus:ring-2 focus:ring-rose-500 outline-none transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* MQ-2 Gas Thresholds */}
        <div className="bg-obsidian-800/80 backdrop-blur-md border border-violet-500/20 rounded-3xl p-6 shadow-[0_4px_20px_rgba(139,92,246,0.1)] space-y-4">
          <h3 className="text-white font-extrabold font-outfit text-sm border-b border-violet-500/20 pb-3 uppercase flex items-center gap-2">
            <Cpu className="w-4 h-4 text-rose-400" />
            <span>Combustible Gas Thresholds (ppm)</span>
          </h3>

          <div className="space-y-3">
            <div>
              <span className="text-violet-300/70 font-bold block mb-1">H₂ Warning / Critical (ppm):</span>
              <div className="flex gap-3">
                <input
                  type="number" value={form.h2Warning}
                  onChange={(e) => handleChange('h2Warning', e.target.value)}
                  className="bg-obsidian-900 border border-violet-500/30 rounded-xl p-2.5 text-white font-bold w-1/2 focus:ring-2 focus:ring-violet-500 outline-none transition-all"
                />
                <input
                  type="number" value={form.h2Critical}
                  onChange={(e) => handleChange('h2Critical', e.target.value)}
                  className="bg-obsidian-900 border border-violet-500/30 rounded-xl p-2.5 text-white font-bold w-1/2 focus:ring-2 focus:ring-rose-500 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <span className="text-violet-300/70 font-bold block mb-1">CH₄ Warning / Critical (ppm):</span>
              <div className="flex gap-3">
                <input
                  type="number" value={form.ch4Warning}
                  onChange={(e) => handleChange('ch4Warning', e.target.value)}
                  className="bg-obsidian-900 border border-violet-500/30 rounded-xl p-2.5 text-white font-bold w-1/2 focus:ring-2 focus:ring-violet-500 outline-none transition-all"
                />
                <input
                  type="number" value={form.ch4Critical}
                  onChange={(e) => handleChange('ch4Critical', e.target.value)}
                  className="bg-obsidian-900 border border-violet-500/30 rounded-xl p-2.5 text-white font-bold w-1/2 focus:ring-2 focus:ring-rose-500 outline-none transition-all"
                />
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}

export default SensorCalibrationPage;
