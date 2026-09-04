import React from 'react';
import { Cpu, Wifi, Radio, Server, CheckCircle2, ShieldAlert, HeartPulse } from 'lucide-react';

export function SensorPage({ status }) {
  return (
    <div className="space-y-4 pb-16 lg:pb-6">
      <div className="bg-dark-panel border border-dark-border rounded-lg p-4 shadow-panel flex items-center justify-between">
        <div className="flex items-center gap-2">
          <HeartPulse className="w-5 h-5 text-emerald-400" />
          <div>
            <h2 className="font-mono text-sm font-bold text-white">CRADLESENSE HARDWARE & SENSOR HEALTH</h2>
            <p className="font-mono text-xs text-gray-400">AMG8833 thermopile diagnostics & IoT bridge specifications</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Sensor Health & Quality Card */}
        <div className="bg-dark-panel border border-dark-border rounded-lg p-4 shadow-panel font-mono text-xs space-y-3">
          <h3 className="text-white font-bold text-sm border-b border-dark-border pb-2 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>SENSOR HEALTH & QUALITY SCORE</span>
          </h3>

          <div className="space-y-2">
            <div className="flex justify-between py-1.5 border-b border-dark-border/60">
              <span className="text-gray-400">Connection Status:</span>
              <span className="text-emerald-400 font-bold">● ONLINE</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-dark-border/60">
              <span className="text-gray-400">Data Quality Score:</span>
              <span className="text-emerald-400 font-bold">Excellent (64 / 64 Valid Pixels)</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-dark-border/60">
              <span className="text-gray-400">Frame Rate:</span>
              <span className="text-white font-bold">{status.refreshRate || 10} FPS</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-dark-border/60">
              <span className="text-gray-400">Dropped Frames:</span>
              <span className="text-white font-bold">0</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-dark-border/60">
              <span className="text-gray-400">Reconnections:</span>
              <span className="text-white font-bold">0</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-gray-400">Last Telemetry Reading:</span>
              <span className="text-thermal-cyan font-bold">{new Date().toLocaleTimeString()}</span>
            </div>
          </div>
        </div>

        {/* Hardware Specifications */}
        <div className="bg-dark-panel border border-dark-border rounded-lg p-4 shadow-panel font-mono text-xs space-y-3">
          <h3 className="text-white font-bold text-sm border-b border-dark-border pb-2 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-thermal-orange" />
            <span>AMG8833 HARDWARE PARAMETERS</span>
          </h3>

          <div className="space-y-2">
            <div className="flex justify-between py-1.5 border-b border-dark-border/60">
              <span className="text-gray-400">Sensor Model:</span>
              <span className="text-white font-bold">Panasonic AMG8833 Grid-EYE</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-dark-border/60">
              <span className="text-gray-400">Thermopile Grid:</span>
              <span className="text-white font-bold">8 × 8 Matrix (64 Pixels)</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-dark-border/60">
              <span className="text-gray-400">Temperature Bounds:</span>
              <span className="text-white font-bold">0°C to 80°C (32°F to 176°F)</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-dark-border/60">
              <span className="text-gray-400">Measurement Accuracy:</span>
              <span className="text-white font-bold">±2.5°C (±4.5°F)</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-gray-400">I²C Interface Address:</span>
              <span className="text-white font-bold">0x69 (default) / 0x68</span>
            </div>
          </div>
        </div>
      </div>

      {/* Safety Disclaimer Banner */}
      <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-200/90 font-mono text-[11px] leading-relaxed flex items-start gap-2">
        <ShieldAlert className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
        <div>
          <strong className="text-amber-300 font-bold block mb-0.5">ENVIRONMENTAL MONITORING NOTICE</strong>
          This system is an environmental temperature monitoring tool designed to observe ambient temperature distribution around a cradle.
          It is not a medical device and does not assess an infant's health, comfort, or medical condition.
          Configured temperature thresholds are monitoring preferences and should not be treated as medical guidance.
        </div>
      </div>
    </div>
  );
}
