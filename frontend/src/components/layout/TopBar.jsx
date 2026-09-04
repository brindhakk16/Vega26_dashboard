import React, { useState } from 'react';
import { Maximize2, Minimize2, Settings, ShieldCheck, HeartPulse, Radio } from 'lucide-react';

export function TopBar({
  connected = false,
  reconnecting = false,
  sensorId = 'AMG8833-001',
  fps = 10,
  onOpenSettings
}) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => console.error(err));
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  return (
    <header className="bg-dark-panel border-b border-dark-border px-4 py-2.5 flex items-center justify-between shadow-panel z-30 select-none">
      {/* Brand & Product Title */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
          <HeartPulse className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-mono text-sm font-bold tracking-wider text-white">
              CRADLESENSE
            </h1>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-semibold">
              ENVIRONMENT MONITOR
            </span>
          </div>
          <p className="text-[10px] font-mono text-gray-400">
            AMG8833 Thermal Distribution Safeguard
          </p>
        </div>
      </div>

      {/* Connection & Telemetry Badges */}
      <div className="flex items-center gap-3 font-mono text-xs">
        {/* Status Indicator */}
        <div className={`flex items-center gap-2 px-3 py-1 rounded border font-semibold ${
          connected 
            ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
            : reconnecting
            ? 'bg-amber-500/10 border-amber-500/40 text-amber-400 animate-pulse'
            : 'bg-rose-500/10 border-rose-500/40 text-rose-400'
        }`}>
          <span className={`w-2 h-2 rounded-full ${
            connected ? 'bg-emerald-400 animate-pulse' : reconnecting ? 'bg-amber-400' : 'bg-rose-400'
          }`}></span>
          <span>{connected ? 'SENSOR ONLINE' : reconnecting ? 'CONNECTING...' : 'SENSOR OFFLINE'}</span>
        </div>

        {/* Sensor ID */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded bg-dark-card border border-dark-border text-gray-300 text-[11px]">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>{sensorId}</span>
        </div>

        {/* Stream Rate */}
        <div className="hidden md:flex items-center gap-1 px-2.5 py-1 rounded bg-dark-card border border-dark-border text-gray-400 text-[11px]">
          <Radio className="w-3.5 h-3.5 text-thermal-cyan" />
          <span>{fps} FPS</span>
        </div>

        {/* Control Buttons */}
        <div className="flex items-center gap-1 border-l border-dark-border pl-2">
          <button
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            className="p-1.5 rounded bg-dark-card border border-dark-border text-gray-400 hover:text-white hover:border-gray-500 transition-all"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          <button
            onClick={onOpenSettings}
            title="Settings"
            className="p-1.5 rounded bg-dark-card border border-dark-border text-gray-400 hover:text-white hover:border-gray-500 transition-all"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
