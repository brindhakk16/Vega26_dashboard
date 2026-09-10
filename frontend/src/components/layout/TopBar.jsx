import React, { useState } from 'react';
import { Maximize2, Minimize2, Settings, ShieldCheck, Sun, Radio, Bell, User } from 'lucide-react';

export function TopBar({
  connected = false,
  reconnecting = false,
  sensorId = 'SYS-NODE-01',
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
    <header className="bg-[#07090e] border-b border-white/10 px-6 py-3 flex items-center justify-between shadow-lg z-30 select-none text-white font-jakarta">
      {/* Brand & Product Title */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center shadow-md">
          <Sun className="w-5 h-5 text-[#D4FF00] animate-spin-slow" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-outfit text-base font-extrabold tracking-wide text-white">
              VEGA Workstation
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#D4FF00]/20 border border-[#D4FF00]/40 text-[#D4FF00] font-bold">
              VEGA ARIES AI
            </span>
          </div>
          <p className="text-[11px] text-white/50 font-sans">
            Thermal Infrared Spatial Workstation
          </p>
        </div>
      </div>

      {/* Connection & Telemetry Badges */}
      <div className="flex items-center gap-3 font-mono text-xs">
        {/* Status Indicator */}
        <div className={`flex items-center gap-2 px-3.5 py-1 rounded-full border text-[11px] font-bold ${
          connected 
            ? 'bg-emerald-500/10 border-emerald-400/40 text-emerald-400'
            : reconnecting
            ? 'bg-amber-500/10 border-amber-400/40 text-amber-300 animate-pulse'
            : 'bg-rose-500/10 border-rose-400/40 text-rose-300'
        }`}>
          <span className={`w-2 h-2 rounded-full ${
            connected ? 'bg-[#D4FF00] animate-pulse' : reconnecting ? 'bg-amber-400' : 'bg-rose-400'
          }`}></span>
          <span>{connected ? 'ONLINE' : reconnecting ? 'CONNECTING...' : 'OFFLINE'}</span>
        </div>

        {/* Sensor ID */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-white text-[11px]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#D4FF00]" />
          <span>{sensorId}</span>
        </div>

        {/* Stream Rate */}
        <div className="hidden md:flex items-center gap-1 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-white/80 text-[11px]">
          <Radio className="w-3.5 h-3.5 text-cyan-400" />
          <span>{fps} FPS</span>
        </div>

        {/* Control Buttons */}
        <div className="flex items-center gap-1.5 border-l border-white/15 pl-3">
          <button
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            className="p-2 rounded-full bg-white/10 border border-white/15 text-white/80 hover:text-white hover:bg-white/20 transition-all"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          <button
            onClick={onOpenSettings}
            title="Settings"
            className="p-2 rounded-full bg-white/10 border border-white/15 text-white/80 hover:text-white hover:bg-white/20 transition-all"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}

export default TopBar;
