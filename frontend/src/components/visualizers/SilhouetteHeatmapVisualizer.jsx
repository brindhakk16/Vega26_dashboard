import React from 'react';
import { formatTemp } from '../../utils/thermalColor.js';
import { Activity, Heart, ShieldCheck, ArrowUpRight } from 'lucide-react';

export function SilhouetteHeatmapVisualizer({
  temperatures = [],
  minTemp = 24.5,
  maxTemp = 29.8,
  avgTemp = 27.2,
  unit = 'C',
  scenario = 'normal_cradle'
}) {
  return (
    <div className="relative w-full h-full min-h-[460px] bg-[#0d1520]/80 backdrop-blur-2xl border border-white/20 rounded-3xl p-6 shadow-2xl flex flex-col justify-between overflow-hidden group">
      {/* Soft Ambient Background Mesh Glows */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(212,255,0,0.04),transparent_60%)] pointer-events-none" />

      {/* Top Header Section */}
      <div className="relative z-10 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-outfit uppercase tracking-widest text-slate-400">
            <span className="w-2 h-2 rounded-full bg-[#D4FF00] animate-ping" />
            <span className="text-white font-semibold">Cradle & Infant Circulation</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white font-outfit mt-1">
            Thermal & Vitals
          </h2>
        </div>

        {/* Action Controls / Icons */}
        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 text-xs text-white">
          <Heart className="w-3.5 h-3.5 text-[#D4FF00] animate-pulse" />
          <span className="font-mono font-medium">98.2% Optimal</span>
        </div>
      </div>

      {/* Central Hero Body Silhouette Graphics & Glowing Hotspots */}
      <div className="relative z-10 my-4 flex-1 flex items-center justify-center min-h-[260px]">
        {/* Futuristic Grid & Orbit Rings in Backdrop */}
        <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" viewBox="0 0 400 300">
          <circle cx="200" cy="150" r="120" fill="none" stroke="white" strokeDasharray="3 6" />
          <circle cx="200" cy="150" r="80" fill="none" stroke="white" strokeWidth="0.5" />
          <line x1="20" y1="150" x2="380" y2="150" stroke="white" strokeWidth="0.5" strokeDasharray="2 4" />
          <line x1="200" y1="20" x2="200" y2="280" stroke="white" strokeWidth="0.5" strokeDasharray="2 4" />
        </svg>

        {/* Infant / Body Silhouette Overlay */}
        <div className="relative w-56 h-64 flex items-center justify-center">
          <svg viewBox="0 0 200 260" className="w-full h-full drop-shadow-[0_0_25px_rgba(252,211,77,0.15)]">
            <defs>
              <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(255, 255, 255, 0.25)" />
                <stop offset="50%" stopColor="rgba(255, 255, 255, 0.12)" />
                <stop offset="100%" stopColor="rgba(255, 255, 255, 0.05)" />
              </linearGradient>

              <radialGradient id="chestHeat" cx="50%" cy="40%" r="40%">
                <stop offset="0%" stopColor="rgba(234, 88, 12, 0.7)" />
                <stop offset="50%" stopColor="rgba(212, 255, 0, 0.4)" />
                <stop offset="100%" stopColor="rgba(14, 165, 233, 0)" />
              </radialGradient>
            </defs>

            {/* Stylized Body Silhouette Path */}
            {/* Head */}
            <circle cx="100" cy="55" r="32" fill="url(#bodyGradient)" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
            
            {/* Torso & Arms */}
            <path
              d="M 60,95 C 45,110 35,140 38,170 C 40,185 55,185 62,165 C 65,150 70,125 72,110 L 72,190 C 72,210 82,230 90,240 C 95,245 98,220 98,185 L 102,185 C 102,220 105,245 110,240 C 118,230 128,210 128,190 L 128,110 C 130,125 135,150 138,165 C 145,185 160,185 162,170 C 165,140 155,110 140,95 C 125,82 75,82 60,95 Z"
              fill="url(#bodyGradient)"
              stroke="rgba(255,255,255,0.4)"
              strokeWidth="1"
            />

            {/* Thermal Core Glow on Silhouette */}
            <circle cx="100" cy="115" r="38" fill="url(#chestHeat)" />

            {/* Micro Lines & Vector Guides */}
            <circle cx="100" cy="115" r="50" fill="none" stroke="rgba(212,255,0,0.3)" strokeWidth="0.8" strokeDasharray="2 3" />
          </svg>

          {/* Glowing Neon Pulsing Sensor Dots (#D4FF00) */}
          {/* Head Node */}
          <div className="absolute top-8 left-[50%] -translate-x-[50%] flex items-center justify-center">
            <span className="w-4 h-4 rounded-full bg-[#D4FF00]/40 animate-ping absolute" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#D4FF00] border border-white shadow-[0_0_10px_#D4FF00]" />
          </div>

          {/* Chest Node */}
          <div className="absolute top-[42%] left-[50%] -translate-x-[50%] flex items-center justify-center">
            <span className="w-6 h-6 rounded-full bg-[#D4FF00]/30 animate-ping absolute" />
            <span className="w-3.5 h-3.5 rounded-full bg-[#D4FF00] border border-white shadow-[0_0_12px_#D4FF00]" />
          </div>

          {/* Right Arm Node */}
          <div className="absolute top-[58%] right-[14%] flex items-center justify-center">
            <span className="w-3 h-3 rounded-full bg-[#D4FF00]/40 animate-ping absolute" />
            <span className="w-2 h-2 rounded-full bg-[#D4FF00] border border-white shadow-[0_0_8px_#D4FF00]" />
          </div>

          {/* Floating Vitals Indicators (Matching Image 4 Layout!) */}
          
          {/* Top Right Callout: Heart Sound / Rate */}
          <div className="absolute top-2 -right-16 md:-right-24 bg-white/10 backdrop-blur-md border border-white/30 rounded-2xl px-3 py-2 text-left shadow-lg">
            <div className="text-2xl font-bold font-outfit text-white leading-none">120</div>
            <div className="text-[10px] text-white/70 font-sans tracking-wide mt-0.5">heart sound / rate</div>
            <div className="text-[9px] font-bold text-[#D4FF00] uppercase mt-0.5">● Optimal</div>
          </div>

          {/* Middle Right Callouts: Arterial Health & Heart Rhythm */}
          <div className="absolute top-[40%] -right-20 md:-right-28 space-y-2">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-2.5 py-1.5 text-left">
              <div className="text-[11px] font-semibold text-white">Arterial health</div>
              <div className="text-[9px] text-white/60 font-mono">Monitor</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-2.5 py-1.5 text-left">
              <div className="text-[11px] font-semibold text-white">Heart rhythm</div>
              <div className="text-[9px] text-[#D4FF00] font-mono">Normal</div>
            </div>
          </div>

          {/* Bottom Left Callout: Arm Pressure & Core Temp */}
          <div className="absolute bottom-2 -left-16 md:-left-24 bg-white/10 backdrop-blur-md border border-white/30 rounded-2xl px-3 py-2 text-left shadow-lg">
            <div className="text-2xl font-bold font-outfit text-white leading-none">
              92<span className="text-sm text-white/60 font-normal">/57</span>
            </div>
            <div className="text-[10px] text-white/70 font-sans tracking-wide mt-0.5">arm pressure</div>
            <div className="text-[9px] font-bold text-amber-300 uppercase mt-0.5">● High</div>
          </div>

        </div>
      </div>

      {/* Bottom Scrubber Timeline Bar ("Today's Data" - Image 4) */}
      <div className="relative z-10 pt-3 border-t border-white/15 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-white/90">
          <span>Today's Data</span>
          <span className="text-[10px] text-[#D4FF00] bg-white/10 px-2 py-0.5 rounded-full font-mono">Live Sync</span>
        </div>

        {/* Timeline Time Range Axis (12:55 -> 13:20) */}
        <div className="flex-1 w-full max-w-sm flex items-center justify-between bg-white/10 backdrop-blur-md p-1.5 rounded-xl border border-white/20 text-[10px] font-mono text-white/70">
          <span className="px-1.5 py-0.5 rounded bg-[#D4FF00] text-slate-900 font-bold">12:55</span>
          <span>13:00</span>
          <span>13:05</span>
          <span className="px-1.5 py-0.5 rounded bg-emerald-500/40 text-white font-bold border border-emerald-400/50">13:10</span>
          <span>13:15</span>
          <span>13:20</span>
          <ArrowUpRight className="w-3.5 h-3.5 text-white/80" />
        </div>
      </div>
    </div>
  );
}
