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
    <div className="space-y-6 font-jakarta text-slate-900 select-none">
      
      {/* Page Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 font-outfit">
            Smart Environment & Vitals
          </h1>
          <p className="text-xs text-slate-500 font-sans mt-1">
            Real-time thermal array telemetry, vital respiration, air quality & safety diagnostics
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-emerald-800 font-bold bg-emerald-100 px-3 py-1.5 rounded-full border border-emerald-300 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            4/4 SENSORS ACTIVE
          </span>
        </div>
      </div>

      {/* NEKA BENTO WORKSTATION MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* LEFT 7 COLUMNS — LARGE FEATURE FOCUS PANEL */}
        <div className="lg:col-span-7 bg-white border border-slate-200/80 rounded-[32px] p-6 shadow-xl flex flex-col justify-between relative overflow-hidden space-y-6">
          
          {/* Top Panel Bar */}
          <div className="flex justify-between items-center border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block">LIVE TELEMETRY VIEW</span>
              <h2 className="text-2xl font-extrabold font-outfit text-slate-900 mt-0.5">Subject Vitals & Environment</h2>
            </div>

            <button 
              onClick={() => onNavigate('human')}
              className="p-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all"
            >
              <ArrowUpRight className="w-5 h-5" />
            </button>
          </div>

          {/* Center Visualizer Area (Matching Neka Silhouette Layout) */}
          <div className="relative min-h-[280px] flex items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 rounded-3xl border border-slate-200/60 p-6 overflow-hidden">
            
            {/* Glowing Callout Metric Pill 1 */}
            <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md border border-slate-200 px-4 py-2 rounded-2xl shadow-lg flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#c9e265] shadow-[0_0_8px_#c9e265]" />
              <div>
                <div className="text-lg font-extrabold font-outfit text-slate-900">{mr24.presence ? `${mr24.breathing_rate || 18} BPM` : '0 BPM'}</div>
                <div className="text-[10px] text-slate-500 font-mono">respiration rate</div>
              </div>
            </div>

            {/* Glowing Callout Metric Pill 2 */}
            <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-md border border-slate-200 px-4 py-2 rounded-2xl shadow-lg flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_#fbbf24]" />
              <div>
                <div className="text-lg font-extrabold font-outfit text-slate-900">{amg.max_temperature || 36.8}°C</div>
                <div className="text-[10px] text-slate-500 font-mono">thermal peak</div>
              </div>
            </div>

            {/* Center Subject Silhouette Graphics */}
            <div className="relative z-10 text-center space-y-3 py-8">
              <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-emerald-100 via-amber-100 to-rose-100 border-4 border-white shadow-2xl flex items-center justify-center relative">
                <Activity className="w-16 h-16 text-slate-800 animate-pulse" />
                <span className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white text-[10px] font-bold">✓</span>
              </div>

              <div className="inline-flex items-center gap-2 bg-slate-900 text-white px-4 py-1.5 rounded-full text-xs font-mono font-bold shadow-md">
                <span className="w-2 h-2 rounded-full bg-[#D4FF00] animate-ping" />
                <span>ENVIRONMENT MONITORING OPTIMAL</span>
              </div>
            </div>

            {/* Glowing Callout Metric Pill 3 */}
            <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-md border border-slate-200 px-4 py-2 rounded-2xl shadow-lg flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 shadow-[0_0_8px_#06b6d4]" />
              <div>
                <div className="text-lg font-extrabold font-outfit text-slate-900">{mq135.co2 || 420} ppm</div>
                <div className="text-[10px] text-slate-500 font-mono">air quality CO₂</div>
              </div>
            </div>

          </div>

          {/* Bottom "Today's Data" Timeline Slider Bar (Exact match to Neka image!) */}
          <div className="pt-2">
            <div className="flex justify-between items-center text-xs font-bold text-slate-700 mb-2">
              <span>Today's Telemetry Data</span>
              <span className="font-mono text-slate-500 text-[11px]">Real-Time Snapshot</span>
            </div>

            <div className="bg-gradient-to-r from-emerald-600/10 via-emerald-500/20 to-emerald-600/10 border border-emerald-500/30 p-2.5 rounded-2xl flex items-center justify-between font-mono text-xs text-slate-800 shadow-sm">
              <span className="text-emerald-800 font-bold px-2 py-0.5 rounded-md bg-emerald-100">12:55</span>
              <span className="text-slate-600">13:00</span>
              <span className="text-emerald-900 font-extrabold bg-emerald-400/40 px-3 py-1 rounded-xl shadow-inner border border-emerald-500">13:05 (NOW)</span>
              <span className="text-slate-600">13:10</span>
              <span className="text-slate-600">13:15</span>
              <button onClick={() => onNavigate('historical')} className="p-1 hover:bg-emerald-200 rounded-lg text-emerald-900">
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

        {/* RIGHT 5 COLUMNS — NEKA BENTO GRADIENT CARDS GRID */}
        <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
          
          {/* BENTO CARD 1 — FOREST GREEN GRADIENT (Respiration & Vitals) */}
          <div 
            onClick={() => onNavigate('human')}
            className="bg-gradient-to-br from-[#1b4332] via-[#2d6a4f] to-[#142d1f] text-white p-6 rounded-[28px] shadow-xl hover:shadow-2xl transition-all cursor-pointer relative overflow-hidden group"
          >
            {/* Fine Line Art Geometry Curve Background */}
            <div className="absolute -right-6 -bottom-6 w-36 h-36 border border-white/10 rounded-full pointer-events-none group-hover:scale-110 transition-transform" />
            <div className="absolute -right-10 -bottom-10 w-48 h-48 border border-white/10 rounded-full pointer-events-none" />

            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-mono text-white/70 uppercase font-bold tracking-wider">RESPIRATION & VITALS</span>
              <ArrowUpRight className="w-4 h-4 text-[#c9e265] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>

            <div className="flex items-baseline justify-between">
              <div>
                <div className="text-5xl font-extrabold font-outfit text-white tracking-tight">
                  {mr24.presence ? (mr24.breathing_rate || 18) : 0}
                </div>
                <div className="text-xs font-mono text-white/80 mt-1">breathing rate (BPM)</div>
              </div>

              <div className="text-right">
                <div className="inline-flex items-center gap-1.5 bg-[#c9e265]/20 border border-[#c9e265]/40 text-[#c9e265] px-3 py-1 rounded-full text-xs font-bold font-mono">
                  <span className="w-2 h-2 rounded-full bg-[#c9e265] shadow-[0_0_8px_#c9e265]" />
                  <span>{mr24.presence ? 'Optimal' : 'Absent'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* BENTO CARD 2 — GOLDEN OCHRE GRADIENT (Thermal Infrared Array) */}
          <div 
            onClick={() => onNavigate('thermal')}
            className="bg-gradient-to-br from-[#c99700] via-[#a37000] to-[#593900] text-white p-6 rounded-[28px] shadow-xl hover:shadow-2xl transition-all cursor-pointer relative overflow-hidden group"
          >
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-mono text-white/70 uppercase font-bold tracking-wider">THERMAL IR ARRAY</span>
              <ArrowUpRight className="w-4 h-4 text-amber-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>

            <div className="flex items-baseline justify-between">
              <div>
                <div className="text-5xl font-extrabold font-outfit text-white tracking-tight">
                  {amg.max_temperature || 36.8}°
                </div>
                <div className="text-xs font-mono text-white/80 mt-1">thermal max peak (°C)</div>
              </div>

              <div className="text-right">
                <div className="text-sm font-bold font-mono text-amber-200 bg-white/10 px-3 py-1 rounded-xl border border-white/20">
                  Mean: {amg.average_temperature || 31.4}°C
                </div>
              </div>
            </div>
          </div>

          {/* BENTO CARD 3 — TERRACOTTA SUNSET GRADIENT (Air Quality & Gas Array) */}
          <div 
            onClick={() => onNavigate('gas')}
            className="bg-gradient-to-br from-[#c85a32] via-[#9e3a1b] to-[#4a1707] text-white p-6 rounded-[28px] shadow-xl hover:shadow-2xl transition-all cursor-pointer relative overflow-hidden group"
          >
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-mono text-white/70 uppercase font-bold tracking-wider">AIR QUALITY & GASES</span>
              <ArrowUpRight className="w-4 h-4 text-orange-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>

            <div className="flex items-baseline justify-between">
              <div>
                <div className="text-5xl font-extrabold font-outfit text-white tracking-tight">
                  {mq135.co2 || 420}
                </div>
                <div className="text-xs font-mono text-white/80 mt-1">CO₂ concentration (ppm)</div>
              </div>

              <div className="text-right">
                <div className="inline-flex items-center gap-1 bg-white/10 border border-white/20 text-white px-3 py-1 rounded-full text-xs font-bold font-mono">
                  <span>{airQuality.label}</span>
                </div>
              </div>
            </div>
          </div>

          {/* BENTO ROW OF 2 SQUARE SAND CARDS */}
          <div className="grid grid-cols-2 gap-4">
            
            <div 
              onClick={() => onNavigate('health')}
              className="bg-gradient-to-br from-[#b5832a] to-[#3b2505] text-white p-5 rounded-[24px] shadow-lg hover:shadow-xl transition-all cursor-pointer group"
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-mono text-amber-200 uppercase font-bold">READINGS</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-white group-hover:translate-x-0.5 transition-transform" />
              </div>
              <div className="text-2xl font-extrabold font-outfit text-white">+2000</div>
              <div className="text-[10px] text-white/70 font-mono mt-0.5">Telemetry Points</div>
            </div>

            <div 
              onClick={() => onNavigate('health')}
              className="bg-gradient-to-br from-[#855b17] to-[#261702] text-white p-5 rounded-[24px] shadow-lg hover:shadow-xl transition-all cursor-pointer group"
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-mono text-amber-200 uppercase font-bold">ARRAY NODES</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-white group-hover:translate-x-0.5 transition-transform" />
              </div>
              <div className="text-2xl font-extrabold font-outfit text-white">4 Modules</div>
              <div className="text-[10px] text-white/70 font-mono mt-0.5">100% Online</div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default DashboardOverviewPage;
