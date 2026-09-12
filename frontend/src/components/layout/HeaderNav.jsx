import React, { useState } from 'react';
import { Activity, Bell, Play, Pause, Layers, Cpu, Usb, Zap, AlertTriangle, X } from 'lucide-react';
import { useVegaAriesSerial } from '../../hooks/useVegaAriesSerial.js';

export function HeaderNav({
  data = {},
  isPaused = false,
  onTogglePause,
  demoMode = true,
  onToggleDemoMode,
  scenario = 'normal',
  onSelectScenario,
  activeAlertCount = 0,
  onOpenAlerts,
  user = null,
  onLogout
}) {
  const {
    isSupported,
    isConnected,
    isConnecting,
    baudRate,
    portInfo,
    error,
    bytesReceived,
    packetsReceived,
    connect,
    disconnect,
    setBaudRate
  } = useVegaAriesSerial();

  const [showModal, setShowModal] = useState(false);
  const isOnline = data.deviceStatus === 'ONLINE';

  const handleConnectUSB = async () => {
    try {
      const ok = await connect();
      if (ok) {
        setShowModal(false);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <header className="bg-[#0c061a]/95 border-b border-violet-900/40 px-4 md:px-6 py-2.5 min-h-[4rem] flex flex-wrap lg:flex-nowrap items-center justify-between gap-3 text-slate-100 font-jakarta select-none shadow-lg shadow-black/50 sticky top-0 z-50 backdrop-blur-xl">
        
        {/* Brand & Main Title */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-700 flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.4)] border border-violet-400/40">
            <Activity className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-outfit text-base md:text-lg font-extrabold tracking-tight text-white whitespace-nowrap">
                VEGA Workstation
              </h1>
              <span className="hidden sm:inline-block text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-violet-950/80 text-violet-300 font-bold border border-violet-700/60 shadow-sm">
                LIVE MONITORING
              </span>
            </div>
          </div>
        </div>

        {/* Connection & Status Toolbar */}
        <div className="flex items-center gap-2 font-mono text-xs overflow-x-auto scrollbar-none py-0.5">
          
          {/* VEGA ARIES v2.0 USB Serial Connection Control */}
          <button
            onClick={() => setShowModal(true)}
            className={`px-3 py-1.5 rounded-full border text-[11px] font-bold flex items-center gap-1.5 whitespace-nowrap transition-all shrink-0 ${
              isConnected
                ? 'bg-emerald-600 text-white border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.4)] animate-pulse'
                : isConnecting
                ? 'bg-amber-950/70 border-amber-700/60 text-amber-300'
                : 'bg-violet-950/80 text-violet-200 border-violet-700/60 hover:bg-violet-900/80 hover:text-white shadow-sm'
            }`}
            title="Connect / Manage VEGA ARIES v2.0 RISC-V USB Data Transmission"
          >
            <Cpu className="w-3.5 h-3.5 text-violet-400" />
            <span>
              {isConnected
                ? `VEGA (USB): ONLINE`
                : isConnecting
                ? 'CONNECTING...'
                : 'CONNECT VEGA ARIES (USB)'}
            </span>
            {isConnected && (
              <span className="w-2 h-2 rounded-full bg-white animate-ping" />
            )}
          </button>

          {/* Live Indicator */}
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold text-[11px] border whitespace-nowrap shrink-0 ${
            !isOnline 
              ? 'bg-rose-950/70 border-rose-800/60 text-rose-300'
              : isPaused
              ? 'bg-amber-950/70 border-amber-800/60 text-amber-300'
              : 'bg-emerald-950/70 border-emerald-800/60 text-emerald-300'
          }`}>
            <span className={`w-2 h-2 rounded-full ${
              !isOnline ? 'bg-rose-500' : isPaused ? 'bg-amber-400' : 'bg-emerald-400 animate-ping'
            }`} />
            <span>{!isOnline ? 'OFFLINE' : isPaused ? 'PAUSED' : 'LIVE DATA'}</span>
          </div>

          {/* DEMO MODE Toggle */}
          <button
            onClick={() => onToggleDemoMode(!demoMode)}
            className={`px-3 py-1.5 rounded-full border text-[11px] font-bold flex items-center gap-1.5 whitespace-nowrap transition-all shrink-0 ${
              demoMode
                ? 'bg-violet-600 text-white border-violet-400/50 shadow-[0_0_12px_rgba(168,85,247,0.3)]'
                : 'bg-violet-950/60 text-violet-300 border-violet-800/50 hover:bg-violet-900/60'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>DEMO: {demoMode ? 'ON' : 'OFF'}</span>
          </button>

          {/* Pause/Resume Live Stream */}
          <button
            onClick={onTogglePause}
            title={isPaused ? 'Resume Live Stream' : 'Pause Live Updates'}
            className="p-1.5 rounded-xl bg-violet-950/70 border border-violet-800/60 text-violet-200 hover:bg-violet-900/80 hover:text-white transition-all shrink-0"
          >
            {isPaused ? <Play className="w-4 h-4 text-emerald-400" /> : <Pause className="w-4 h-4 text-amber-400" />}
          </button>

          {/* Alert Counter Bell */}
          <button
            onClick={onOpenAlerts}
            className={`relative p-1.5 rounded-xl border font-bold text-xs flex items-center justify-center transition-all shrink-0 ${
              activeAlertCount > 0
                ? 'bg-rose-950/80 border-rose-600 text-rose-300 animate-pulse'
                : 'bg-violet-950/70 border-violet-800/60 text-violet-200 hover:bg-violet-900/80 hover:text-white'
            }`}
          >
            <Bell className="w-4 h-4" />
            {activeAlertCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[9px] font-extrabold rounded-full flex items-center justify-center shadow-sm">
                {activeAlertCount}
              </span>
            )}
          </button>

          {/* User Profile & Sign Out Control */}
          {user && (
            <div className="flex items-center gap-2 pl-2 border-l border-violet-900/50 shrink-0">
              <div className="flex items-center gap-2 bg-violet-950/70 border border-violet-800/60 px-3 py-1 rounded-xl text-xs">
                <span className={`w-2 h-2 rounded-full ${user.role === 'doctor' ? 'bg-violet-400 shadow-[0_0_8px_#c084fc]' : 'bg-cyan-400'}`} />
                <span className="font-bold text-violet-100 font-outfit whitespace-nowrap">{user.name}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                  user.role === 'doctor' ? 'bg-violet-500/20 text-violet-300 border border-violet-500/40' : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                }`}>
                  {user.role === 'doctor' ? 'Doctor' : 'Parent'}
                </span>
              </div>

              <button
                onClick={onLogout}
                title="Sign Out / Switch User"
                className="px-3 py-1 rounded-xl bg-violet-800 hover:bg-violet-700 text-white font-bold text-xs transition-all shadow-[0_0_12px_rgba(147,51,234,0.3)] border border-violet-600/50 whitespace-nowrap"
              >
                <span>Sign Out</span>
              </button>
            </div>
          )}

        </div>
      </header>

      {/* VEGA ARIES v2.0 USB Serial Connection Dialog Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#120726] border border-violet-700/50 rounded-3xl p-6 max-w-md w-full text-white space-y-5 shadow-[0_0_50px_rgba(147,51,234,0.25)] animate-in fade-in zoom-in-95 font-jakarta">
            
            <div className="flex justify-between items-center border-b border-violet-900/60 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-violet-600/20 border border-violet-500/40">
                  <Usb className="w-5 h-5 text-violet-300" />
                </div>
                <div>
                  <h3 className="font-outfit font-extrabold text-base text-white">
                    VEGA ARIES v2.0 Hardware Link
                  </h3>
                  <p className="text-xs text-violet-300/70 font-mono">
                    Direct USB UART Web Serial Transmission
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-xl hover:bg-violet-900/60 text-violet-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Connection Status Box */}
            <div className="bg-[#0b0416] border border-violet-900/60 rounded-2xl p-4 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between">
                <span className="text-violet-300/70">USB Status:</span>
                <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                  isConnected 
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' 
                    : 'bg-violet-950 text-violet-400 border border-violet-800/40'
                }`}>
                  {isConnected ? 'CONNECTED' : 'DISCONNECTED'}
                </span>
              </div>

              {isConnected && portInfo && (
                <>
                  <div className="flex items-center justify-between text-violet-200">
                    <span>Target Board:</span>
                    <span className="font-bold text-violet-300">{portInfo.displayName}</span>
                  </div>
                  <div className="flex items-center justify-between text-violet-200">
                    <span>Packets Received:</span>
                    <span className="font-bold text-cyan-400">{packetsReceived} pkts ({bytesReceived} bytes)</span>
                  </div>
                </>
              )}

              {error && (
                <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-center gap-2 text-[11px]">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}
            </div>

            {/* Config & Controls */}
            <div className="space-y-3">
              <label className="block text-xs font-mono text-violet-200 font-bold">
                UART Baud Rate Configuration:
              </label>
              <select
                value={baudRate}
                onChange={(e) => setBaudRate(e.target.value)}
                disabled={isConnected}
                className="w-full bg-[#0b0416] border border-violet-800/60 rounded-xl px-3 py-2 text-xs text-white font-mono focus:ring-2 focus:ring-violet-500 outline-none"
              >
                <option value="115200">115200 Baud (VEGA ARIES v2.0 Standard)</option>
                <option value="9600">9600 Baud (Low Speed)</option>
                <option value="230400">230400 Baud (High Speed)</option>
                <option value="460800">460800 Baud (Ultra Speed)</option>
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-2">
              {!isConnected ? (
                <button
                  onClick={handleConnectUSB}
                  disabled={isConnecting || !isSupported}
                  className="flex-1 bg-gradient-to-r from-violet-600 to-purple-700 hover:from-violet-500 hover:to-purple-600 text-white font-bold py-2.5 px-4 rounded-xl text-xs font-outfit uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(147,51,234,0.4)] border border-violet-400/30 transition-all"
                >
                  <Zap className="w-4 h-4 text-violet-200" />
                  <span>{isConnecting ? 'Requesting Port Access...' : 'Select USB Port & Connect'}</span>
                </button>
              ) : (
                <button
                  onClick={() => { disconnect(); setShowModal(false); }}
                  className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs font-outfit uppercase tracking-wider transition-all shadow-md"
                >
                  Disconnect VEGA ARIES USB
                </button>
              )}
            </div>

            {!isSupported && (
              <p className="text-[11px] text-amber-300/90 text-center font-mono">
                ⚠️ Web Serial API is only supported in desktop Chrome, Edge, and Opera.
              </p>
            )}

          </div>
        </div>
      )}
    </>
  );
}

export default HeaderNav;
