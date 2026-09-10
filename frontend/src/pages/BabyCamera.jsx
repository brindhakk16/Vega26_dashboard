import React, { useState, useEffect } from 'react';
import { DashboardNav } from '../components/dashboard/DashboardNav.jsx';
import { 
  Camera, 
  Video, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Moon, 
  Sun, 
  ShieldCheck, 
  Activity, 
  Sparkles, 
  Music, 
  Play, 
  Pause, 
  Radio, 
  Maximize2, 
  RotateCcw, 
  ChevronUp, 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight,
  ZoomIn,
  Eye,
  Heart,
  AlertTriangle,
  Smile,
  Sliders,
  Maximize
} from 'lucide-react';

export function BabyCameraPage({ status = {}, onNavigateTab }) {
  const [cameraMode, setCameraMode] = useState('night_vision'); // 'night_vision', 'rgb', 'thermal_hybrid'
  const [isTalking, setIsTalking] = useState(false);
  const [audioMuted, setAudioMuted] = useState(false);
  const [isPlayingLullaby, setIsPlayingLullaby] = useState(false);
  const [selectedLullaby, setSelectedLullaby] = useState('Ocean Waves');
  const [nightLightColor, setNightLightColor] = useState('amber'); // 'amber', 'blue', 'emerald', 'off'
  const [nightLightBrightness, setNightLightBrightness] = useState(60);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showAiOverlay, setShowAiOverlay] = useState(true);

  // Simulated live audio level meter
  const [audioLevel, setAudioLevel] = useState(18);

  useEffect(() => {
    const interval = setInterval(() => {
      setAudioLevel(Math.floor(14 + Math.random() * 8));
    }, 800);
    return () => clearInterval(interval);
  }, []);

  const lullabies = ['Ocean Waves', 'White Noise', 'Soft Brahms Lullaby', 'Gentle Heartbeat', 'Rainfall Sleep'];

  return (
    <div className="min-h-screen bg-[#07090e] p-2 md:p-6 text-white font-jakarta">
      {/* Workstation Frame Container */}
      <div className="max-w-[1550px] mx-auto bg-[#0b1018] border border-white/20 rounded-[32px] shadow-2xl overflow-hidden backdrop-blur-3xl">
        
        {/* Navigation Bar */}
        <DashboardNav
          activeTab="babycamera"
          onTabChange={onNavigateTab}
          connected={status.connected ?? true}
          sensorId={status.sensorId || 'SYS-NODE-01'}
          onOpenSettings={() => onNavigateTab('settings')}
        />

        {/* Workspace Body */}
        <div className="p-4 md:p-8 space-y-6">
          
          {/* Header Toolbar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-5">
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white font-outfit">
                  Baby Camera & AI Vision Telemetry
                </h1>
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 font-mono text-xs font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  1080P HD • LIVE 30 FPS
                </span>
              </div>
              <p className="text-xs text-white/60 font-sans mt-1">
                Smart infrared night vision, real-time posture tracking & acoustic cry detection
              </p>
            </div>

            {/* Camera View Mode Switcher */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <button
                onClick={() => setCameraMode('night_vision')}
                className={`px-3.5 py-1.5 rounded-full border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  cameraMode === 'night_vision'
                    ? 'bg-[#D4FF00] text-slate-950 border-[#D4FF00] font-bold shadow-md'
                    : 'bg-white/10 text-white border-white/20 hover:bg-white/15'
                }`}
              >
                <Moon className="w-3.5 h-3.5" />
                <span>IR Night Vision</span>
              </button>

              <button
                onClick={() => setCameraMode('rgb')}
                className={`px-3.5 py-1.5 rounded-full border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  cameraMode === 'rgb'
                    ? 'bg-cyan-400 text-slate-950 border-cyan-400 font-bold shadow-md'
                    : 'bg-white/10 text-white border-white/20 hover:bg-white/15'
                }`}
              >
                <Sun className="w-3.5 h-3.5" />
                <span>Full Color HD</span>
              </button>

              <button
                onClick={() => setCameraMode('thermal_hybrid')}
                className={`px-3.5 py-1.5 rounded-full border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  cameraMode === 'thermal_hybrid'
                    ? 'bg-rose-500 text-white border-rose-400 font-bold shadow-md'
                    : 'bg-white/10 text-white border-white/20 hover:bg-white/15'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Thermal Overlay</span>
              </button>

              <button
                onClick={() => setShowAiOverlay(!showAiOverlay)}
                className={`px-3.5 py-1.5 rounded-full border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  showAiOverlay
                    ? 'bg-white text-slate-900 border-white font-bold'
                    : 'bg-white/10 text-white/60 border-white/20'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>AI Overlay</span>
              </button>
            </div>
          </div>

          {/* MAIN 2-COLUMN CAMERA WORKSPACE */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* LEFT HERO COLUMN (Col 7 / 12) - Live Video Screen Viewer */}
            <div className="lg:col-span-7 flex flex-col space-y-4">
              
              <div className={`relative w-full aspect-video rounded-3xl overflow-hidden border border-white/20 shadow-2xl transition-all ${
                cameraMode === 'night_vision'
                  ? 'bg-gradient-to-b from-[#0a120d] via-[#040906] to-[#010402]'
                  : cameraMode === 'thermal_hybrid'
                  ? 'bg-gradient-to-b from-slate-950 via-purple-950 to-slate-950'
                  : 'bg-slate-900'
              }`}>
                
                {/* OSD TOP OVERLAY BAR */}
                <div className="absolute top-4 left-4 right-4 z-20 flex justify-between items-center text-xs font-mono text-white/90 drop-shadow-md">
                  <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/15">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                    <span className="font-bold">REC</span>
                    <span className="text-white/60">|</span>
                    <span>1080P 30FPS</span>
                  </div>

                  <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/15 text-[#D4FF00]">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>AI POSE MONITORING ACTIVE</span>
                  </div>
                </div>

                {/* SIMULATED CAMERA FEED CANVAS / ILLUSTRATION */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
                  {/* Subtle Grid overlay */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px]" />

                  {/* Simulated Baby Cradle View Graphic */}
                  <div className="relative w-72 h-48 rounded-full border-2 border-dashed border-emerald-400/40 flex items-center justify-center p-4">
                    {/* Simulated Sleeping Infant Silhouette */}
                    <div className="relative flex flex-col items-center">
                      {/* Head */}
                      <div className="w-16 h-16 rounded-full bg-white/20 border border-white/40 flex items-center justify-center relative">
                        {cameraMode === 'thermal_hybrid' && (
                          <div className="absolute inset-0 rounded-full bg-amber-500/40 blur-sm" />
                        )}
                        <Smile className="w-8 h-8 text-white/70" />
                      </div>
                      {/* Body */}
                      <div className="w-28 h-20 rounded-3xl bg-white/15 border border-white/30 -mt-2 flex items-center justify-center relative">
                        {cameraMode === 'thermal_hybrid' && (
                          <div className="absolute inset-2 rounded-2xl bg-rose-500/40 blur-md" />
                        )}
                        <Heart className="w-6 h-6 text-emerald-400 animate-pulse" />
                      </div>
                    </div>

                    {/* AI Bounding Box Overlay */}
                    {showAiOverlay && (
                      <div className="absolute -inset-4 border-2 border-[#D4FF00] rounded-3xl animate-pulse flex flex-col justify-between p-2">
                        <div className="flex justify-between items-start text-[10px] font-mono text-slate-950 font-bold">
                          <span className="bg-[#D4FF00] px-1.5 py-0.5 rounded">INFANT: SAFE BACK-SLEEPING</span>
                          <span className="bg-[#D4FF00] px-1.5 py-0.5 rounded">99.4% CONF</span>
                        </div>
                        <div className="flex justify-between items-end text-[10px] font-mono text-emerald-400 font-bold bg-black/70 px-2 py-0.5 rounded border border-emerald-400/40">
                          <span>Breathing: 34 RPM</span>
                          <span>Chest Rise: Normal</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* BOTTOM OSD CONTROLS */}
                <div className="absolute bottom-4 left-4 right-4 z-20 flex justify-between items-center bg-black/70 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/15 text-xs">
                  <div className="flex items-center gap-3 font-mono">
                    <span className="text-white/70">MODE:</span>
                    <span className="text-[#D4FF00] font-bold uppercase">{cameraMode.replace('_', ' ')}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setZoomLevel(zoomLevel === 1 ? 2 : zoomLevel === 2 ? 4 : 1)}
                      className="px-3 py-1 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-mono flex items-center gap-1"
                    >
                      <ZoomIn className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{zoomLevel}x ZOOM</span>
                    </button>

                    <button
                      onClick={() => alert('Snapshot captured & saved to gallery')}
                      className="px-3 py-1 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/40 text-emerald-300 font-mono flex items-center gap-1"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>SNAPSHOT</span>
                    </button>
                  </div>
                </div>

              </div>

              {/* PTZ Directional Joystick & Quick Camera Controls */}
              <div className="bg-slate-900/80 border border-white/15 rounded-3xl p-5 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                
                {/* Pan / Tilt Arrow Buttons */}
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-white/70 font-bold uppercase">Camera PTZ Controls:</span>
                  <div className="grid grid-cols-3 gap-1 bg-white/5 p-2 rounded-2xl border border-white/10">
                    <div />
                    <button className="p-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-white"><ChevronUp className="w-4 h-4" /></button>
                    <div />
                    <button className="p-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-white"><ChevronLeft className="w-4 h-4" /></button>
                    <button className="p-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-white/50"><RotateCcw className="w-4 h-4" /></button>
                    <button className="p-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-white"><ChevronRight className="w-4 h-4" /></button>
                    <div />
                    <button className="p-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-white"><ChevronDown className="w-4 h-4" /></button>
                    <div />
                  </div>
                </div>

                {/* Two-Way Talk Intercom Button */}
                <div className="flex items-center gap-3">
                  <button
                    onMouseDown={() => setIsTalking(true)}
                    onMouseUp={() => setIsTalking(false)}
                    onTouchStart={() => setIsTalking(true)}
                    onTouchEnd={() => setIsTalking(false)}
                    className={`px-5 py-3 rounded-2xl font-outfit font-bold text-xs flex items-center gap-2 transition-all shadow-lg ${
                      isTalking
                        ? 'bg-rose-500 text-white animate-pulse shadow-rose-500/50 scale-105'
                        : 'bg-[#D4FF00] text-slate-950 hover:bg-[#c2ed00]'
                    }`}
                  >
                    {isTalking ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                    <span>{isTalking ? 'TALKING LIVE TO NURSERY...' : 'HOLD TO TALK TO BABY'}</span>
                  </button>
                </div>

              </div>

            </div>

            {/* RIGHT COLUMN (Col 5 / 12) - AI Posture Vitals, Acoustic Cry Sensor & Nightlight */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Card 1: AI Posture & Safety Status */}
              <div className="bg-slate-900/80 border border-white/15 rounded-3xl p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <h3 className="font-outfit text-sm font-bold text-white flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#D4FF00]" />
                    <span>Infant Safety & Posture Vision AI</span>
                  </h3>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    SAFE
                  </span>
                </div>

                <div className="space-y-3 font-mono text-xs">
                  <div className="flex justify-between items-center bg-white/5 p-3 rounded-2xl border border-white/10">
                    <span className="text-white/70">Sleep Posture</span>
                    <span className="text-emerald-400 font-bold">Supine (Back Sleeping)</span>
                  </div>
                  <div className="flex justify-between items-center bg-white/5 p-3 rounded-2xl border border-white/10">
                    <span className="text-white/70">Airway Clearance</span>
                    <span className="text-emerald-400 font-bold">100% Unobstructed</span>
                  </div>
                  <div className="flex justify-between items-center bg-white/5 p-3 rounded-2xl border border-white/10">
                    <span className="text-white/70">Rollover Probability</span>
                    <span className="text-cyan-400 font-bold">Low (2.4%)</span>
                  </div>
                  <div className="flex justify-between items-center bg-white/5 p-3 rounded-2xl border border-white/10">
                    <span className="text-white/70">Estimated Respiration</span>
                    <span className="text-[#D4FF00] font-bold">34 Breaths / Min</span>
                  </div>
                </div>
              </div>

              {/* Card 2: Cry Detection & Audio Telemetry */}
              <div className="bg-slate-900/80 border border-white/15 rounded-3xl p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <h3 className="font-outfit text-sm font-bold text-white flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-cyan-400" />
                    <span>Cry Sensor & Acoustic Telemetry</span>
                  </h3>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    PEACEFUL SILENCE
                  </span>
                </div>

                <div className="flex items-center justify-between bg-white/5 p-4 rounded-2xl border border-white/10">
                  <div>
                    <div className="text-xs text-white/60 font-mono">Ambient Noise Level</div>
                    <div className="text-2xl font-extrabold font-outfit text-white mt-1">
                      {audioLevel} <span className="text-xs font-mono text-cyan-400">dB</span>
                    </div>
                  </div>

                  {/* Audio dB Waveform Equalizer Animation */}
                  <div className="flex items-end gap-1 h-10 px-2">
                    {[12, 24, 16, 32, 20, 14, 28, 18].map((h, i) => (
                      <div
                        key={i}
                        className="w-1.5 rounded-full bg-cyan-400 transition-all duration-300"
                        style={{ height: `${Math.min(100, (audioLevel / 30) * h)}%` }}
                      />
                    ))}
                  </div>
                </div>

                {/* Smart Lullaby Player */}
                <div className="pt-2 space-y-3">
                  <div className="flex justify-between items-center text-xs font-semibold text-white/80">
                    <span>SMART NURSERY LULLABY:</span>
                    <span className="text-[#D4FF00] font-mono font-bold">{selectedLullaby}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={selectedLullaby}
                      onChange={(e) => setSelectedLullaby(e.target.value)}
                      className="flex-1 bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                    >
                      {lullabies.map(song => (
                        <option key={song} value={song} className="bg-slate-900 text-white">{song}</option>
                      ))}
                    </select>

                    <button
                      onClick={() => setIsPlayingLullaby(!isPlayingLullaby)}
                      className={`p-2.5 rounded-xl font-bold transition-all ${
                        isPlayingLullaby
                          ? 'bg-[#D4FF00] text-slate-950 shadow-[0_0_12px_rgba(212,255,0,0.3)]'
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                    >
                      {isPlayingLullaby ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

              </div>

              {/* Card 3: Nursery Night Light Controls */}
              <div className="bg-slate-900/80 border border-white/15 rounded-3xl p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <h3 className="font-outfit text-sm font-bold text-white flex items-center gap-2">
                    <Sun className="w-4 h-4 text-amber-400" />
                    <span>Nursery Soft Night Light</span>
                  </h3>
                  <span className="text-xs font-mono text-amber-400 font-bold">
                    {nightLightBrightness}%
                  </span>
                </div>

                {/* Brightness Slider */}
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={nightLightBrightness}
                    onChange={(e) => setNightLightBrightness(Number(e.target.value))}
                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#D4FF00]"
                  />
                </div>

                {/* Color Selector Pills */}
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: 'amber', label: 'Warm Amber', color: 'bg-amber-400' },
                    { id: 'blue', label: 'Soft Blue', color: 'bg-cyan-400' },
                    { id: 'emerald', label: 'Green Glow', color: 'bg-emerald-400' },
                    { id: 'off', label: 'Light Off', color: 'bg-slate-700' },
                  ].map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setNightLightColor(c.id)}
                      className={`p-2.5 rounded-xl border text-center text-xs transition-all flex flex-col items-center gap-1.5 ${
                        nightLightColor === c.id
                          ? 'bg-white/20 border-white text-white font-bold'
                          : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                      }`}
                    >
                      <span className={`w-3.5 h-3.5 rounded-full ${c.color}`} />
                      <span className="text-[10px]">{c.label}</span>
                    </button>
                  ))}
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

export default BabyCameraPage;
