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
      <header className="bg-white/95 border-b border-slate-200/80 px-4 md:px-6 py-2.5 min-h-[4rem] flex flex-wrap lg:flex-nowrap items-center justify-between gap-3 text-slate-900 font-jakarta select-none shadow-sm sticky top-0 z-50 backdrop-blur-md">
        
        {/* Brand & Main Title */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-2xl bg-slate-900 flex items-center justify-center shadow-md">
            <Activity className="w-5 h-5 text-[#D4FF00] animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-outfit text-base md:text-lg font-extrabold tracking-tight text-slate-900 whitespace-nowrap">
                VEGA Workstation
              </h1>
              <span className="hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-300">
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
                ? 'bg-emerald-500 text-white border-emerald-600 shadow-md animate-pulse'
                : isConnecting
                ? 'bg-amber-100 border-amber-300 text-amber-800'
                : 'bg-slate-900 text-white border-slate-800 hover:bg-slate-800 shadow-sm'
            }`}
            title="Connect / Manage VEGA ARIES v2.0 RISC-V USB Data Transmission"
          >
            <Cpu className="w-3.5 h-3.5 text-[#D4FF00]" />
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
              ? 'bg-rose-100 border-rose-300 text-rose-800'
              : isPaused
              ? 'bg-amber-100 border-amber-300 text-amber-800'
              : 'bg-emerald-100 border-emerald-300 text-emerald-800'
          }`}>
            <span className={`w-2 h-2 rounded-full ${
              !isOnline ? 'bg-rose-600' : isPaused ? 'bg-amber-500' : 'bg-emerald-500 animate-ping'
            }`} />
            <span>{!isOnline ? 'OFFLINE' : isPaused ? 'PAUSED' : 'LIVE DATA'}</span>
          </div>

          {/* DEMO MODE Toggle */}
          <button
            onClick={() => onToggleDemoMode(!demoMode)}
            className={`px-3 py-1.5 rounded-full border text-[11px] font-bold flex items-center gap-1.5 whitespace-nowrap transition-all shrink-0 ${
              demoMode
                ? 'bg-slate-800 text-slate-200 border-slate-700'
                : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>DEMO: {demoMode ? 'ON' : 'OFF'}</span>
          </button>

          {/* Pause/Resume Live Stream */}
          <button
            onClick={onTogglePause}
            title={isPaused ? 'Resume Live Stream' : 'Pause Live Updates'}
            className="p-1.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200 transition-all shrink-0"
          >
            {isPaused ? <Play className="w-4 h-4 text-emerald-600" /> : <Pause className="w-4 h-4 text-amber-600" />}
          </button>

          {/* Alert Counter Bell */}
          <button
            onClick={onOpenAlerts}
            className={`relative p-1.5 rounded-xl border font-bold text-xs flex items-center justify-center transition-all shrink-0 ${
              activeAlertCount > 0
                ? 'bg-rose-100 border-rose-300 text-rose-700 animate-pulse'
                : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Bell className="w-4 h-4" />
            {activeAlertCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[9px] font-extrabold rounded-full flex items-center justify-center">
                {activeAlertCount}
              </span>
            )}
          </button>

          {/* User Profile & Sign Out Control */}
          {user && (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200 shrink-0">
              <div className="flex items-center gap-2 bg-slate-100 border border-slate-200 px-3 py-1 rounded-xl text-xs">
                <span className={`w-2 h-2 rounded-full ${user.role === 'doctor' ? 'bg-emerald-500' : 'bg-cyan-500'}`} />
                <span className="font-bold text-slate-800 font-outfit whitespace-nowrap">{user.name}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                  user.role === 'doctor' ? 'bg-emerald-100 text-emerald-800' : 'bg-cyan-100 text-cyan-800'
                }`}>
                  {user.role === 'doctor' ? 'Doctor' : 'Parent'}
                </span>
              </div>

              <button
                onClick={onLogout}
                title="Sign Out / Switch User"
                className="px-3 py-1 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-all shadow-sm whitespace-nowrap"
              >
                <span>Sign Out</span>
              </button>
            </div>
          )}

        </div>
      </header>

      {/* VEGA ARIES v2.0 USB Serial Connection Dialog Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-md w-full text-white space-y-5 shadow-2xl animate-in fade-in zoom-in-95 font-jakarta">
            
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30">
                  <Usb className="w-5 h-5 text-[#D4FF00]" />
                </div>
                <div>
                  <h3 className="font-outfit font-extrabold text-base text-white">
                    VEGA ARIES v2.0 Hardware Link
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">
                    Direct USB UART Web Serial Transmission
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Connection Status Box */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">USB Status:</span>
                <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                  isConnected 
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' 
                    : 'bg-slate-800 text-slate-400'
                }`}>
                  {isConnected ? 'CONNECTED' : 'DISCONNECTED'}
                </span>
              </div>

              {isConnected && portInfo && (
                <>
                  <div className="flex items-center justify-between text-slate-300">
                    <span>Target Board:</span>
                    <span className="font-bold text-[#D4FF00]">{portInfo.displayName}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
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
              <label className="block text-xs font-mono text-slate-300 font-bold">
                UART Baud Rate Configuration:
              </label>
              <select
                value={baudRate}
                onChange={(e) => setBaudRate(e.target.value)}
                disabled={isConnected}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:ring-2 focus:ring-emerald-500 outline-none"
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
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs font-outfit uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all"
                >
                  <Zap className="w-4 h-4 text-[#D4FF00]" />
                  <span>{isConnecting ? 'Requesting Port Access...' : 'Select USB Port & Connect'}</span>
                </button>
              ) : (
                <button
                  onClick={() => { disconnect(); setShowModal(false); }}
                  className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs font-outfit uppercase tracking-wider transition-all"
                >
                  Disconnect VEGA ARIES USB
                </button>
              )}
            </div>

            {!isSupported && (
              <p className="text-[11px] text-amber-400/90 text-center font-mono">
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
