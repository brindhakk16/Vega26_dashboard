import React from 'react';
import { Wind, ShieldCheck, AlertTriangle, CheckCircle2, Gauge, Activity } from 'lucide-react';
import { calculateOverallAirQuality, getGasStatus } from '../utils/sensorDefaults.js';

export function AirQualityOverviewPage({ data = {}, thresholds = {} }) {
  const mq135 = data.mq135 || {};
  const mq2 = data.mq2 || {};

  const overall = calculateOverallAirQuality(mq135, mq2, thresholds);

  const gases = [
    { formula: 'CO₂', name: 'Carbon Dioxide', val: mq135.co2 || 620, unit: 'ppm', warn: thresholds.co2Warning, crit: thresholds.co2Critical },
    { formula: 'NH₃', name: 'Ammonia', val: mq135.nh3 || 12, unit: 'ppm', warn: thresholds.nh3Warning, crit: thresholds.nh3Critical },
    { formula: 'CO', name: 'Carbon Monoxide', val: mq135.co || 4, unit: 'ppm', warn: thresholds.coWarning, crit: thresholds.coCritical },
    { formula: 'C₆H₆', name: 'Benzene / VOCs', val: mq135.c6h6 || 2, unit: 'ppm', warn: thresholds.c6h6Warning, crit: thresholds.c6h6Critical },
    { formula: 'H₂', name: 'Hydrogen Gas', val: mq2.h2 || 15, unit: 'ppm', warn: thresholds.h2Warning, crit: thresholds.h2Critical },
    { formula: 'CH₄', name: 'Methane Gas', val: mq2.ch4 || 8, unit: 'ppm', warn: thresholds.ch4Warning, crit: thresholds.ch4Critical }
  ];

  return (
    <div className="space-y-6 font-jakarta text-white select-none">
      
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-violet-500/20 pb-5">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white font-outfit uppercase flex items-center gap-2.5 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
            <Gauge className="w-7 h-7 text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
            <span>REAL-TIME AIR QUALITY OVERVIEW</span>
          </h1>
          <p className="text-xs text-violet-300/70 font-sans mt-1">
            Calculated overall atmospheric status derived from air quality & gas sensor threshold evaluation
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="text-emerald-400 font-bold bg-emerald-900/30 px-3.5 py-1.5 rounded-full border border-emerald-500/30 shadow-[0_0_10px_rgba(139,92,246,0.1)]">
            ● 6-Gas Monitoring Array Active
          </span>
        </div>
      </div>

      {/* LARGE HORIZONTAL AIR QUALITY STATUS GAUGE CARD (FIXED DARK BENTO CARD) */}
      <div className="bg-obsidian-800/80 backdrop-blur-md text-white rounded-[32px] p-6 sm:p-8 shadow-[0_4px_20px_rgba(139,92,246,0.15)] space-y-6 border border-violet-500/20">
        <div className="flex items-center justify-between border-b border-violet-500/20 pb-4">
          <span className="font-outfit text-sm font-bold text-violet-200 uppercase tracking-wider flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#D4FF00]" />
            <span>CURRENT OVERALL ATMOSPHERIC SAFETY STATUS</span>
          </span>
          <span className="text-[11px] font-mono text-violet-400/60">
            Evaluated via calibrated sensor thresholds
          </span>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-8 p-6 rounded-2xl bg-obsidian-950 border border-violet-500/20">
          <div>
            <div className="text-xs font-mono text-violet-300/70 uppercase tracking-wider">CURRENT OVERALL STATUS</div>
            <div className={`text-5xl font-extrabold font-outfit tracking-tight mt-1 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] ${
              overall.label === 'GOOD' ? 'text-emerald-400' :
              overall.label === 'MODERATE' ? 'text-amber-400' : 'text-rose-500'
            }`}>
              {overall.label}
            </div>
            <div className="text-xs text-violet-200 font-sans mt-2">
              {overall.summary}
            </div>
          </div>

          {/* Large Horizontal Gauge Visual Bar */}
          <div className="w-full md:w-1/2 space-y-3 font-mono text-xs">
            <div className="flex justify-between text-violet-300/70 text-[11px] font-bold">
              <span className={overall.label === 'GOOD' ? 'text-emerald-400 text-xs drop-shadow-[0_0_5px_rgba(52,211,153,0.8)]' : ''}>GOOD</span>
              <span className={overall.label === 'MODERATE' ? 'text-amber-400 text-xs drop-shadow-[0_0_5px_rgba(251,191,36,0.8)]' : ''}>MODERATE</span>
              <span className={overall.label === 'POOR' ? 'text-rose-400 text-xs drop-shadow-[0_0_5px_rgba(251,113,133,0.8)]' : ''}>POOR</span>
              <span className={overall.label === 'CRITICAL' ? 'text-rose-500 text-xs drop-shadow-[0_0_5px_rgba(244,63,94,0.8)]' : ''}>CRITICAL</span>
            </div>

            <div className="w-full bg-obsidian-900 h-4 rounded-full overflow-hidden p-0.5 border border-violet-500/30">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  overall.label === 'GOOD' ? 'w-1/4 bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]' :
                  overall.label === 'MODERATE' ? 'w-2/4 bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.8)]' :
                  overall.label === 'POOR' ? 'w-3/4 bg-rose-400' : 'w-full bg-rose-500'
                }`} 
              />
            </div>
          </div>
        </div>

        {/* BELOW IT: THE 6 MONITORED GASES BREAKDOWN (LIGHT HIGH-CONTRAST BENTO CARDS INSIDE MAIN BODY) */}
        <div className="pt-4 border-t border-violet-500/20">
          <h3 className="font-outfit text-xs font-bold text-violet-300/70 uppercase tracking-wider mb-4">
            Monitored Gas Parameters Summary (CO₂ | NH₃ | CO | C₆H₆ | H₂ | CH₄)
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {gases.map((g) => {
              const stat = getGasStatus(g.val, g.warn, g.crit);
              return (
                <div key={g.formula} className="bg-obsidian-950 border border-violet-500/20 rounded-2xl p-4 space-y-2 text-center font-mono shadow-[0_0_15px_rgba(139,92,246,0.1)]">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold font-outfit text-white text-base">{g.formula}</span>
                    <span className={`w-2.5 h-2.5 rounded-full ${stat.severity === 'normal' ? 'bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]' : stat.severity === 'warning' ? 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]' : 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]'}`} />
                  </div>
                  <div className="text-xl font-bold font-outfit text-white">
                    {g.val} <span className="text-xs font-mono text-[#D4FF00]">{g.unit}</span>
                  </div>
                  <div className="text-[10px] text-violet-300/70">
                    {g.name}
                  </div>
                  <div className={`text-[10px] font-bold ${stat.severity === 'normal' ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {stat.status}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
}

export default AirQualityOverviewPage;
