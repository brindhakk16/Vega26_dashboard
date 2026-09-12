import React from 'react';
import { 
  UserCheck, 
  UserX, 
  Flame, 
  Wind, 
  ShieldCheck, 
  Activity, 
  ChevronRight, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle,
  Cpu,
  Waves,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { calculateOverallAirQuality, getGasStatus } from '../utils/sensorDefaults.js';

export function DashboardOverviewPage({ data = {}, thresholds = {}, onNavigate }) {
  const amg = data.amg8833 || {};
  const mq135 = data.mq135 || {};
  const mq2 = data.mq2 || {};
  const mr24 = data.mr24d11c10 || {};

  const airQuality = calculateOverallAirQuality(mq135, mq2, thresholds);

  return (
    <div className="space-y-6 font-jakarta text-slate-100 select-none">
      
      {/* Page Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-violet-900/40 pb-5">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white font-outfit">
            Smart Environment & Vitals
          </h1>
          <p className="text-xs text-violet-300/70 font-sans mt-1">
            Real-time thermal array telemetry, vital respiration, air quality & safety diagnostics
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-violet-300 font-bold bg-violet-950/80 px-3.5 py-1.5 rounded-full border border-violet-700/60 shadow-sm flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-violet-400 animate-ping" />
            4/4 SENSORS ACTIVE
          </span>
        </div>
      </div>

      {/* NEKA BENTO WORKSTATION MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* LEFT 7 COLUMNS — LARGE FEATURE FOCUS PANEL */}
        <div className="lg:col-span-7 bg-[#120726]/90 border border-violet-900/50 rounded-[32px] p-6 shadow-2xl flex flex-col justify-between relative overflow-hidden space-y-6 backdrop-blur-xl">
          
          {/* Top Panel Bar */}
          <div className="flex justify-between items-center border-b border-violet-900/40 pb-4">
            <div>
              <span className="text-xs font-mono font-bold text-violet-400/80 uppercase tracking-wider block">LIVE TELEMETRY VIEW</span>
              <h2 className="text-2xl font-extrabold font-outfit text-white mt-0.5">Subject Vitals & Environment</h2>
            </div>

            <button 
              onClick={() => onNavigate('human')}
              className="p-2 rounded-2xl bg-violet-950/70 hover:bg-violet-900/80 border border-violet-800/60 text-violet-200 transition-all"
            >
              <ArrowUpRight className="w-5 h-5" />
            </button>
          </div>

          {/* Center Visualizer Area */}
          <div className="relative min-h-[280px] flex items-center justify-center bg-gradient-to-b from-[#090314] to-[#14072c] rounded-3xl border border-violet-900/50 p-6 overflow-hidden">
            
            {/* Glowing Callout Metric Pill 1 */}
            <div className="absolute top-6 left-6 bg-[#180935]/90 backdrop-blur-md border border-violet-700/60 px-4 py-2 rounded-2xl shadow-[0_0_15px_rgba(168,85,247,0.2)] flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-violet-400 shadow-[0_0_8px_#c084fc]" />
              <div>
                <div className="text-lg font-extrabold font-outfit text-white">{mr24.presence ? `${mr24.breathing_rate || 18} BPM` : '0 BPM'}</div>
                <div className="text-[10px] text-violet-300/70 font-mono">respiration rate</div>
              </div>
            </div>

            {/* Glowing Callout Metric Pill 2 */}
            <div className="absolute top-6 right-6 bg-[#180935]/90 backdrop-blur-md border border-violet-700/60 px-4 py-2 rounded-2xl shadow-[0_0_15px_rgba(168,85,247,0.2)] flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-400 shadow-[0_0_8px_#a855f7]" />
              <div>
                <div className="text-lg font-extrabold font-outfit text-white">{amg.max_temperature || 36.8}°C</div>
                <div className="text-[10px] text-violet-300/70 font-mono">thermal peak</div>
              </div>
            </div>

            {/* Center Subject Silhouette Graphics */}
            <div className="relative z-10 text-center space-y-3 py-8">
              <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-violet-600 via-purple-700 to-indigo-900 border-4 border-violet-400/40 shadow-[0_0_35px_rgba(147,51,234,0.5)] flex items-center justify-center relative">
                <Activity className="w-16 h-16 text-white animate-pulse" />
                <span className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-[#120726] flex items-center justify-center text-white text-[10px] font-bold">✓</span>
              </div>

              <div className="inline-flex items-center gap-2 bg-[#0b0416] text-violet-200 border border-violet-700/60 px-4 py-1.5 rounded-full text-xs font-mono font-bold shadow-md">
                <span className="w-2 h-2 rounded-full bg-violet-400 animate-ping" />
                <span>ENVIRONMENT MONITORING OPTIMAL</span>
              </div>
            </div>

            {/* Glowing Callout Metric Pill 3 */}
            <div className="absolute bottom-6 left-6 bg-[#180935]/90 backdrop-blur-md border border-violet-700/60 px-4 py-2 rounded-2xl shadow-[0_0_15px_rgba(168,85,247,0.2)] flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 shadow-[0_0_8px_#818cf8]" />
              <div>
                <div className="text-lg font-extrabold font-outfit text-white">{mq135.co2 || 420} ppm</div>
                <div className="text-[10px] text-violet-300/70 font-mono">air quality CO₂</div>
              </div>
            </div>

          </div>

          {/* Bottom "Today's Data" Timeline Slider Bar */}
          <div className="pt-2">
            <div className="flex justify-between items-center text-xs font-bold text-violet-200 mb-2">
              <span>Today's Telemetry Data</span>
              <span className="font-mono text-violet-400/70 text-[11px]">Real-Time Snapshot</span>
            </div>

            <div className="bg-violet-950/40 border border-violet-900/60 p-2.5 rounded-2xl flex items-center justify-between font-mono text-xs text-violet-200 shadow-sm">
              <span className="text-violet-300 font-bold px-2 py-0.5 rounded-md bg-violet-900/60">12:55</span>
              <span className="text-violet-400/70">13:00</span>
              <span className="text-white font-extrabold bg-violet-600 px-3 py-1 rounded-xl shadow-[0_0_12px_rgba(168,85,247,0.4)] border border-violet-400/50">13:05 (NOW)</span>
              <span className="text-violet-400/70">13:10</span>
              <span className="text-violet-400/70">13:15</span>
              <button onClick={() => onNavigate('historical')} className="p-1 hover:bg-violet-900/60 rounded-lg text-violet-200">
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

        {/* RIGHT 5 COLUMNS — BENTO GRADIENT CARDS GRID */}
        <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
          
          {/* BENTO CARD 1 — DEEP VIOLET PURPLE GRADIENT (Respiration & Vitals) */}
          <div 
            onClick={() => onNavigate('human')}
            className="bg-gradient-to-br from-[#240e4f] via-[#1a0a38] to-[#0c0318] border border-violet-700/50 text-white p-6 rounded-[28px] shadow-xl hover:border-violet-500/70 hover:shadow-[0_0_25px_rgba(147,51,234,0.35)] transition-all cursor-pointer relative overflow-hidden group"
          >
            {/* Fine Line Art Geometry Curve Background */}
            <div className="absolute -right-6 -bottom-6 w-36 h-36 border border-violet-400/10 rounded-full pointer-events-none group-hover:scale-110 transition-transform" />
            <div className="absolute -right-10 -bottom-10 w-48 h-48 border border-violet-400/10 rounded-full pointer-events-none" />

            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-mono text-violet-300 uppercase font-bold tracking-wider">RESPIRATION & VITALS</span>
              <ArrowUpRight className="w-4 h-4 text-violet-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>

            <div className="flex items-baseline justify-between">
              <div>
                <div className="text-5xl font-extrabold font-outfit text-white tracking-tight">
                  {mr24.presence ? (mr24.breathing_rate || 18) : 0}
                </div>
                <div className="text-xs font-mono text-violet-300/80 mt-1">breathing rate (BPM)</div>
              </div>

              <div className="text-right">
                <div className="inline-flex items-center gap-1.5 bg-violet-500/20 border border-violet-400/40 text-violet-200 px-3 py-1 rounded-full text-xs font-bold font-mono">
                  <span className="w-2 h-2 rounded-full bg-violet-400 shadow-[0_0_8px_#c084fc]" />
                  <span>{mr24.presence ? 'Optimal' : 'Absent'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* BENTO CARD 2 — ELECTRIC PURPLE OBSIDIAN (Thermal Infrared Array) */}
          <div 
            onClick={() => onNavigate('thermal')}
            className="bg-gradient-to-br from-[#3b0764] via-[#2a0649] to-[#120224] border border-violet-700/50 text-white p-6 rounded-[28px] shadow-xl hover:border-violet-500/70 hover:shadow-[0_0_25px_rgba(168,85,247,0.35)] transition-all cursor-pointer relative overflow-hidden group"
          >
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-mono text-violet-300 uppercase font-bold tracking-wider">THERMAL IR ARRAY</span>
              <ArrowUpRight className="w-4 h-4 text-violet-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>

            <div className="flex items-baseline justify-between">
              <div>
                <div className="text-5xl font-extrabold font-outfit text-white tracking-tight">
                  {amg.max_temperature || 36.8}°
                </div>
                <div className="text-xs font-mono text-violet-300/80 mt-1">thermal max peak (°C)</div>
              </div>

              <div className="text-right">
                <div className="text-sm font-bold font-mono text-violet-200 bg-violet-950/60 px-3 py-1 rounded-xl border border-violet-700/50">
                  Mean: {amg.average_temperature || 31.4}°C
                </div>
              </div>
            </div>
          </div>

          {/* BENTO CARD 3 — DEEP OBSIDIAN VIOLET (Air Quality & Gas Array) */}
          <div 
            onClick={() => onNavigate('gas')}
            className="bg-gradient-to-br from-[#1e0a3d] via-[#14062a] to-[#0a0215] border border-violet-700/50 text-white p-6 rounded-[28px] shadow-xl hover:border-violet-500/70 hover:shadow-[0_0_25px_rgba(168,85,247,0.35)] transition-all cursor-pointer relative overflow-hidden group"
          >
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-mono text-violet-300 uppercase font-bold tracking-wider">AIR QUALITY & GASES</span>
              <ArrowUpRight className="w-4 h-4 text-violet-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>

            <div className="flex items-baseline justify-between">
              <div>
                <div className="text-5xl font-extrabold font-outfit text-white tracking-tight">
                  {mq135.co2 || 420}
                </div>
                <div className="text-xs font-mono text-violet-300/80 mt-1">CO₂ concentration (ppm)</div>
              </div>

              <div className="text-right">
                <div className="inline-flex items-center gap-1 bg-violet-500/20 border border-violet-400/40 text-violet-200 px-3 py-1 rounded-full text-xs font-bold font-mono">
                  <span>{airQuality.label}</span>
                </div>
              </div>
            </div>
          </div>

          {/* BENTO ROW OF 2 SQUARE CARDS */}
          <div className="grid grid-cols-2 gap-4">
            
            <div 
              onClick={() => onNavigate('health')}
              className="bg-gradient-to-br from-[#190933] to-[#0c0318] border border-violet-800/50 text-white p-5 rounded-[24px] shadow-lg hover:border-violet-600/60 hover:shadow-[0_0_15px_rgba(147,51,234,0.25)] transition-all cursor-pointer group"
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-mono text-violet-300 uppercase font-bold">READINGS</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-white group-hover:translate-x-0.5 transition-transform" />
              </div>
              <div className="text-2xl font-extrabold font-outfit text-white">+2000</div>
              <div className="text-[10px] text-violet-400/70 font-mono mt-0.5">Telemetry Points</div>
            </div>

            <div 
              onClick={() => onNavigate('health')}
              className="bg-gradient-to-br from-[#190933] to-[#0c0318] border border-violet-800/50 text-white p-5 rounded-[24px] shadow-lg hover:border-violet-600/60 hover:shadow-[0_0_15px_rgba(147,51,234,0.25)] transition-all cursor-pointer group"
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-mono text-violet-300 uppercase font-bold">ARRAY NODES</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-white group-hover:translate-x-0.5 transition-transform" />
              </div>
              <div className="text-2xl font-extrabold font-outfit text-white">4 Modules</div>
              <div className="text-[10px] text-violet-400/70 font-mono mt-0.5">100% Online</div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default DashboardOverviewPage;
