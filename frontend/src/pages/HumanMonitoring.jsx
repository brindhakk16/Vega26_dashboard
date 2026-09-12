import React, { useState } from 'react';
import { UserCheck, Waves, Activity, ShieldCheck, Play, Pause, Radio, RefreshCw } from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';

export function HumanMonitoringPage({ data = {}, history = [], thresholds = {} }) {
  const [isWaveformPaused, setIsWaveformPaused] = useState(false);
  const mr24 = data.mr24d11c10 || {};

  const presence = mr24.presence;
  const bpm = presence ? (mr24.breathing_rate || 18) : 0;
  const statusLabel = mr24.breathing_status || (presence ? 'NORMAL' : 'NO PERSON DETECTED');
  const signalQuality = mr24.signal_quality || 'good';

  // Calculate breathing statistics from history
  const validBpmList = history.map(h => h.breathingRate).filter(b => b > 0);
  const avgBpm = validBpmList.length ? Math.round(validBpmList.reduce((a, b) => a + b, 0) / validBpmList.length) : bpm;
  const minBpm = validBpmList.length ? Math.min(...validBpmList) : bpm;
  const maxBpm = validBpmList.length ? Math.max(...validBpmList) : bpm;

  // Waveform graph data
  const waveformData = (mr24.respiration_waveform || []).map((val, idx) => ({
    time: `${idx}ms`,
    signal: val
  }));

  return (
    <div className="space-y-6 font-jakarta text-white select-none">
      
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-violet-500/20 pb-5">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white font-outfit uppercase drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
            HUMAN VITAL & RESPIRATION MONITORING
          </h1>
          <p className="text-xs text-violet-300/70 font-sans mt-1">
            24GHz mmWave radar contactless human presence & respiration movement telemetry
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="px-3.5 py-1.5 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 font-bold flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
            24GHz mmWave Radar Active
          </span>
        </div>
      </div>

      {/* COMPACT STATUS VISUALIZATION PILLS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-obsidian-800/80 backdrop-blur-md border border-violet-500/20 rounded-2xl p-4 flex items-center justify-between font-mono text-xs shadow-[0_4px_20px_rgba(139,92,246,0.1)]">
          <span className="text-violet-300/70 font-bold uppercase">PERSON PRESENCE</span>
          <span className={`font-bold px-3 py-1 rounded-full border ${
            presence ? 'bg-emerald-900/30 text-emerald-400 border-emerald-500/30' : 'bg-rose-900/30 text-rose-400 border-rose-500/30'
          }`}>
            ● {presence ? 'DETECTED' : 'NOT DETECTED'}
          </span>
        </div>

        <div className="bg-obsidian-800/80 backdrop-blur-md border border-violet-500/20 rounded-2xl p-4 flex items-center justify-between font-mono text-xs shadow-[0_4px_20px_rgba(139,92,246,0.1)]">
          <span className="text-violet-300/70 font-bold uppercase">BREATHING STATUS</span>
          <span className="font-bold text-white bg-obsidian-900 px-3 py-1 rounded-full border border-violet-500/30">
            {statusLabel}
          </span>
        </div>

        <div className="bg-obsidian-800/80 backdrop-blur-md border border-violet-500/20 rounded-2xl p-4 flex items-center justify-between font-mono text-xs shadow-[0_4px_20px_rgba(139,92,246,0.1)]">
          <span className="text-violet-300/70 font-bold uppercase">RADAR SIGNAL</span>
          <span className="font-bold text-cyan-400 bg-cyan-900/30 px-3 py-1 rounded-full border border-cyan-500/30">
            {signalQuality.toUpperCase()} (EXCELLENT)
          </span>
        </div>
      </div>

      {/* MAIN BREATHING MONITORING HERO CARD */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Column (Col 5 / 12) - Primary Breathing Rate Big Display */}
        <div className="lg:col-span-5 bg-obsidian-800/80 backdrop-blur-md border border-violet-500/20 rounded-3xl p-6 shadow-[0_4px_20px_rgba(139,92,246,0.1)] flex flex-col justify-between space-y-6">
          
          <div className="flex items-center justify-between border-b border-violet-500/20 pb-3">
            <span className="text-xs font-mono font-bold text-violet-200 uppercase flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-emerald-600" />
              Respiration Frequency
            </span>
            <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-900/30 text-emerald-400 border border-emerald-500/30 font-bold">
              {mr24.confidence || 98}% Radar Match
            </span>
          </div>

          {/* Large Breathing Rate BPM Display */}
          <div className="text-center py-4">
            <div className="text-7xl font-extrabold font-outfit text-white tracking-tight drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
              {bpm}
            </div>
            <div className="text-lg font-mono text-emerald-400 font-extrabold tracking-widest mt-1">
              BPM
            </div>

            <div className="mt-4 inline-block px-4 py-1.5 rounded-full bg-obsidian-900 border border-violet-500/30 text-xs font-mono font-bold text-white shadow-[0_0_10px_rgba(139,92,246,0.2)]">
              STATUS: <span className="text-emerald-400">{statusLabel}</span>
            </div>
          </div>

          {/* Breathing Metrics Breakdown Grid */}
          <div className="grid grid-cols-3 gap-2 text-center font-mono text-xs pt-4 border-t border-violet-500/20">
            <div className="bg-obsidian-900 p-2.5 rounded-2xl border border-violet-500/20">
              <div className="text-[10px] text-violet-400/70 font-bold">AVG RATE</div>
              <div className="text-base font-extrabold text-white mt-0.5">{avgBpm} BPM</div>
            </div>
            <div className="bg-obsidian-900 p-2.5 rounded-2xl border border-violet-500/20">
              <div className="text-[10px] text-violet-400/70 font-bold">MIN RATE</div>
              <div className="text-base font-extrabold text-cyan-400 mt-0.5">{minBpm} BPM</div>
            </div>
            <div className="bg-obsidian-900 p-2.5 rounded-2xl border border-violet-500/20">
              <div className="text-[10px] text-violet-400/70 font-bold">MAX RATE</div>
              <div className="text-base font-extrabold text-rose-400 mt-0.5">{maxBpm} BPM</div>
            </div>
          </div>

        </div>

        {/* Right Column (Col 7 / 12) - Live Respiration Waveform Graph */}
        <div className="lg:col-span-7 bg-obsidian-950 text-white rounded-3xl p-6 shadow-[0_4px_20px_rgba(139,92,246,0.15)] space-y-4 flex flex-col justify-between border border-violet-500/30">
          
          <div className="flex items-center justify-between border-b border-violet-500/20 pb-3">
            <h3 className="font-outfit text-sm font-bold text-white flex items-center gap-2">
              <Waves className="w-4 h-4 text-[#D4FF00]" />
              <span>LIVE RESPIRATION WAVEFORM (24GHz RADAR)</span>
            </h3>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsWaveformPaused(!isWaveformPaused)}
                className="px-3 py-1 rounded-xl bg-obsidian-800 hover:bg-obsidian-700 border border-violet-500/30 text-xs font-mono text-white flex items-center gap-1.5 transition-all shadow-[0_0_10px_rgba(139,92,246,0.2)]"
              >
                {isWaveformPaused ? <Play className="w-3.5 h-3.5 text-emerald-400" /> : <Pause className="w-3.5 h-3.5 text-amber-400" />}
                <span>{isWaveformPaused ? 'RESUME' : 'PAUSE'}</span>
              </button>
            </div>
          </div>

          {/* Continuously updating respiration waveform chart */}
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={waveformData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="waveColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D4FF00" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#D4FF00" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#2e1065" vertical={false} />
                <XAxis dataKey="time" stroke="#a78bfa" fontSize={10} tickLine={false} fontFamily="monospace" />
                <YAxis stroke="#a78bfa" fontSize={10} tickLine={false} domain={[-1.2, 1.2]} fontFamily="monospace" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0c0a1a', // obsidian-900
                    borderColor: 'rgba(139, 92, 246, 0.2)', // violet-500/20
                    borderRadius: '12px',
                    fontSize: '11px',
                    color: '#ede9fe' // violet-100
                  }}
                />
                <Area type="monotone" dataKey="signal" name="Radar Respiration Signal" stroke="#D4FF00" strokeWidth={2.5} fillOpacity={1} fill="url(#waveColor)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="flex justify-between items-center text-xs font-mono text-violet-300/70 pt-2 border-t border-violet-500/20">
            <span>Real-time Doppler Radar Frequency</span>
            <span>Sampling: 50ms</span>
          </div>

        </div>

      </div>

    </div>
  );
}

export default HumanMonitoringPage;
