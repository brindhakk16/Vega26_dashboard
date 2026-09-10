import React, { useState, useEffect } from 'react';
import { DashboardNav } from '../components/dashboard/DashboardNav.jsx';
import { 
  Heart, 
  Activity, 
  ShieldCheck, 
  Zap, 
  Volume2, 
  RefreshCw, 
  SlidersHorizontal, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  TrendingUp,
  Waves,
  Radio
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  AreaChart,
  Area
} from 'recharts';

export function HeartbeatPage({ status = {}, onNavigateTab }) {
  const [bpm, setBpm] = useState(124);
  const [spo2, setSpo2] = useState(99);
  const [hrv, setHrv] = useState(48); // RMSSD ms
  const [ecgMode, setEcgMode] = useState('ecg'); // 'ecg', 'ppg', 'hrv'
  const [timeWindow, setTimeWindow] = useState(30);

  // Live pulse animation & random telemetry fluctuation
  useEffect(() => {
    const interval = setInterval(() => {
      setBpm(prev => Math.min(135, Math.max(115, prev + Math.floor(Math.random() * 5 - 2))));
      setHrv(prev => Math.min(55, Math.max(40, prev + Math.floor(Math.random() * 3 - 1))));
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  // Simulated 30-point ECG / Pulse Stream
  const generateEcgData = () => {
    const data = [];
    for (let i = 0; i < 30; i++) {
      const angle = (i / 5) * Math.PI;
      let wave = Math.sin(angle) * 8 + Math.cos(angle * 3) * 5;
      if (i % 6 === 3) wave += 35; // R-peak Spike
      if (i % 6 === 2) wave -= 12; // Q-wave Dip
      if (i % 6 === 4) wave -= 15; // S-wave Dip
      data.push({
        time: `${i}s`,
        ecg: Number((120 + wave).toFixed(1)),
        ppg: Number((122 + Math.sin(angle) * 12).toFixed(1)),
        baseline: 120
      });
    }
    return data;
  };

  const [waveData] = useState(generateEcgData());

  const cardiacEvents = [
    { time: '09:34:12', event: 'Normal Resting Sinus Rhythm', bpm: 124, status: 'Optimal' },
    { time: '09:28:45', event: 'Dream State REM Pulse Surge', bpm: 132, status: 'Normal' },
    { time: '09:15:30', event: 'Deep Sleep Slow Pulse Phase', bpm: 118, status: 'Optimal' },
    { time: '08:50:00', event: 'Cradle Motion Pulse Sync', bpm: 126, status: 'Optimal' },
  ];

  return (
    <div className="min-h-screen bg-[#07090e] p-2 md:p-6 text-white font-jakarta">
      {/* Workstation Frame Container */}
      <div className="max-w-[1550px] mx-auto bg-[#0b1018] border border-white/20 rounded-[32px] shadow-2xl overflow-hidden backdrop-blur-3xl">
        
        {/* Navigation Bar */}
        <DashboardNav
          activeTab="heartbeat"
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
                  Heartbeat & Cardiac Telemetry Monitor
                </h1>
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 font-mono text-xs font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                  {bpm} BPM • NORMAL INFANT SINUS RHYTHM
                </span>
              </div>
              <p className="text-xs text-white/60 font-sans mt-1">
                Non-invasive infrared micro-vascular pulse wave analysis & ballistocardiographic cradle telemetry
              </p>
            </div>

            {/* Quick Action Badges */}
            <div className="flex flex-wrap items-center gap-2.5 text-xs">
              <button 
                onClick={() => setEcgMode(ecgMode === 'ecg' ? 'ppg' : 'ecg')}
                className={`px-3.5 py-1.5 rounded-full border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  ecgMode === 'ecg'
                    ? 'bg-[#D4FF00] text-slate-950 border-[#D4FF00] font-bold shadow-md'
                    : 'bg-white/10 text-white border-white/20 hover:bg-white/15'
                }`}
              >
                <Activity className="w-3.5 h-3.5" />
                <span>{ecgMode === 'ecg' ? 'Wave: ECG PQRST' : 'Wave: Micro-PPG Pulse'}</span>
              </button>

              <button 
                className="px-3.5 py-1.5 rounded-full border border-rose-400/40 bg-rose-500/10 text-rose-300 text-xs font-semibold flex items-center gap-1.5"
              >
                <Heart className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                <span>Cardio Sensor Sync Active</span>
              </button>
            </div>
          </div>

          {/* TOP METRICS ROW (4 Cards) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            
            {/* Card 1: Heart Rate BPM */}
            <div className="bg-gradient-to-br from-rose-950/40 via-slate-900/80 to-slate-950 border border-rose-500/30 rounded-3xl p-5 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-bold text-rose-400 tracking-wider uppercase flex items-center gap-1.5">
                  <Heart className="w-4 h-4 text-rose-400 animate-pulse" />
                  Heart Rate (BPM)
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  Infant Normal
                </span>
              </div>
              <div className="flex items-baseline justify-between mt-2">
                <div>
                  <div className="text-4xl font-extrabold font-outfit text-white tracking-tight flex items-baseline gap-2">
                    {bpm}
                    <span className="text-sm font-mono text-rose-400 font-normal">BPM</span>
                  </div>
                  <div className="text-xs text-emerald-400 font-medium mt-1">Resting Sleep Rhythm</div>
                </div>
                <div className="text-right font-mono text-xs text-white/60">
                  <div>Min: 118 BPM</div>
                  <div>Max: 132 BPM</div>
                </div>
              </div>
              <div className="w-full bg-white/10 h-1.5 rounded-full mt-4 overflow-hidden">
                <div className="bg-gradient-to-r from-rose-500 via-[#D4FF00] to-emerald-400 h-full w-[65%]" />
              </div>
              <div className="flex justify-between text-[10px] text-white/50 font-mono mt-1.5">
                <span>100 Brady</span>
                <span>120 Ideal</span>
                <span>160 Tachy</span>
              </div>
            </div>

            {/* Card 2: Heart Rate Variability (HRV) */}
            <div className="bg-gradient-to-br from-emerald-950/40 via-slate-900/80 to-slate-950 border border-emerald-500/30 rounded-3xl p-5 shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-bold text-emerald-400 tracking-wider uppercase flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4" />
                  HRV Stress Score
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  Low Stress
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-2">
                <div className="bg-white/5 p-2.5 rounded-2xl border border-white/10">
                  <div className="text-[11px] text-white/60">RMSSD Index</div>
                  <div className="text-xl font-bold font-outfit text-white">{hrv} <span className="text-xs font-mono text-emerald-400">ms</span></div>
                  <div className="text-[10px] text-emerald-400 mt-0.5">High Resilience</div>
                </div>
                <div className="bg-white/5 p-2.5 rounded-2xl border border-white/10">
                  <div className="text-[11px] text-white/60">Vagal Tone</div>
                  <div className="text-xl font-bold font-outfit text-white">8.4 <span className="text-xs font-mono text-emerald-400">PNS</span></div>
                  <div className="text-[10px] text-cyan-300 mt-0.5">Calm / Rested</div>
                </div>
              </div>
            </div>

            {/* Card 3: Blood Oxygen SpO2 */}
            <div className="bg-gradient-to-br from-cyan-950/40 via-slate-900/80 to-slate-950 border border-cyan-500/30 rounded-3xl p-5 shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-bold text-cyan-400 tracking-wider uppercase flex items-center gap-1.5">
                  <Waves className="w-4 h-4" />
                  Oxygen Saturation
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  Optimal 99%
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-2">
                <div className="bg-white/5 p-2.5 rounded-2xl border border-white/10">
                  <div className="text-[11px] text-white/60">Est. SpO₂</div>
                  <div className="text-xl font-bold font-outfit text-white">{spo2}%</div>
                  <div className="text-[10px] text-emerald-400 mt-0.5">Full Saturation</div>
                </div>
                <div className="bg-white/5 p-2.5 rounded-2xl border border-white/10">
                  <div className="text-[11px] text-white/60">Perfusion Index</div>
                  <div className="text-xl font-bold font-outfit text-white">6.8%</div>
                  <div className="text-[10px] text-cyan-300 mt-0.5">Strong Pulse</div>
                </div>
              </div>
            </div>

            {/* Card 4: Ballistocardiography (BCG) Motion Coupling */}
            <div className="bg-gradient-to-br from-indigo-950/30 via-slate-900/80 to-slate-950 border border-indigo-500/30 rounded-3xl p-5 shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-bold text-indigo-400 tracking-wider uppercase flex items-center gap-1.5">
                  <Zap className="w-4 h-4" />
                  BCG Cardio Coupling
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                  Synchronized
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-2">
                <div className="bg-white/5 p-2.5 rounded-2xl border border-white/10">
                  <div className="text-[11px] text-white/60">Cardio-Resp Sync</div>
                  <div className="text-xl font-bold font-outfit text-white">98%</div>
                  <div className="text-[10px] text-emerald-400 mt-0.5">Optimal Lock</div>
                </div>
                <div className="bg-white/5 p-2.5 rounded-2xl border border-white/10">
                  <div className="text-[11px] text-white/60">Pulse Vigor</div>
                  <div className="text-xl font-bold font-outfit text-white">Normal</div>
                  <div className="text-[10px] text-cyan-300 mt-0.5">Regular Beats</div>
                </div>
              </div>
            </div>

          </div>

          {/* MAIN WORKSPACE 2-COLUMN GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* LEFT COLUMN (Col 7 / 12) - Live Cardiac Waveform Visualizer */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="bg-slate-900/80 border border-white/15 rounded-3xl p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center">
                      <Heart className="w-5 h-5 text-rose-400 animate-pulse" />
                    </div>
                    <div>
                      <h3 className="font-outfit text-lg font-bold text-white">
                        Live Continuous Electro-Cardiogram (ECG) Stream
                      </h3>
                      <p className="text-xs text-white/60 font-sans">
                        PQRST Waveform analysis & micro-vascular thermal contraction telemetry
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 font-mono text-xs">
                    <span className="text-xs text-[#D4FF00] font-bold bg-[#D4FF00]/10 px-3 py-1 rounded-full border border-[#D4FF00]/30">
                      LIVE 250 Hz
                    </span>
                  </div>
                </div>

                {/* ECG Waveform Chart */}
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={waveData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                      <defs>
                        <linearGradient id="ecgColor" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#252A34" vertical={false} />
                      <XAxis dataKey="time" stroke="#8D96A5" fontSize={10} tickLine={false} fontFamily="monospace" />
                      <YAxis stroke="#8D96A5" fontSize={10} tickLine={false} domain={[90, 170]} fontFamily="monospace" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#0d1520',
                          borderColor: '#252A34',
                          borderRadius: '12px',
                          fontSize: '11px',
                          color: '#F4F7FA'
                        }}
                      />
                      <Area type="monotone" dataKey={ecgMode} name="Cardiac Amplitude" stroke="#f43f5e" strokeWidth={2.5} fillOpacity={1} fill="url(#ecgColor)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* Rhythm Diagnostics Status Bar */}
                <div className="grid grid-cols-3 gap-3 pt-2">
                  <div className="bg-white/5 p-3 rounded-2xl border border-white/10 text-center">
                    <div className="text-[10px] text-white/50 font-mono">P-R INTERVAL</div>
                    <div className="text-sm font-bold text-white font-outfit mt-0.5">128 ms (Normal)</div>
                  </div>
                  <div className="bg-white/5 p-3 rounded-2xl border border-white/10 text-center">
                    <div className="text-[10px] text-white/50 font-mono">QRS DURATION</div>
                    <div className="text-sm font-bold text-white font-outfit mt-0.5">64 ms (Optimal)</div>
                  </div>
                  <div className="bg-white/5 p-3 rounded-2xl border border-white/10 text-center">
                    <div className="text-[10px] text-white/50 font-mono">Q-T INTERVAL</div>
                    <div className="text-sm font-bold text-white font-outfit mt-0.5">340 ms (Normal)</div>
                  </div>
                </div>

              </div>

            </div>

            {/* RIGHT COLUMN (Col 5 / 12) - Anomaly Scanner & Event Log */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Cardiac Anomaly AI Scanner */}
              <div className="bg-slate-900/80 border border-white/15 rounded-3xl p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <h3 className="font-outfit text-sm font-bold text-white flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Cardiac Anomaly AI Scanner</span>
                  </h3>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    CLEAN
                  </span>
                </div>

                <div className="space-y-3 font-mono text-xs">
                  <div className="flex justify-between items-center bg-white/5 p-3 rounded-2xl border border-white/10">
                    <span className="text-white/70">Bradycardia Risk</span>
                    <span className="text-emerald-400 font-bold">0% (Safe)</span>
                  </div>
                  <div className="flex justify-between items-center bg-white/5 p-3 rounded-2xl border border-white/10">
                    <span className="text-white/70">Tachycardia Risk</span>
                    <span className="text-emerald-400 font-bold">0% (Safe)</span>
                  </div>
                  <div className="flex justify-between items-center bg-white/5 p-3 rounded-2xl border border-white/10">
                    <span className="text-white/70">Arrhythmia Index</span>
                    <span className="text-emerald-400 font-bold">None Detected</span>
                  </div>
                  <div className="flex justify-between items-center bg-white/5 p-3 rounded-2xl border border-white/10">
                    <span className="text-white/70">Vascular Perfusion</span>
                    <span className="text-[#D4FF00] font-bold">High Flow</span>
                  </div>
                </div>
              </div>

              {/* Recent Cardiac Event Log */}
              <div className="bg-slate-900/80 border border-white/15 rounded-3xl p-6 shadow-xl space-y-4">
                <h3 className="font-outfit text-sm font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
                  <Clock className="w-4 h-4 text-cyan-400" />
                  <span>Recent Cardiac & Pulse Telemetry Log</span>
                </h3>

                <div className="space-y-2.5">
                  {cardiacEvents.map((ev, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-white/5 p-3 rounded-2xl border border-white/10 text-xs font-mono">
                      <div>
                        <div className="text-white font-bold font-sans">{ev.event}</div>
                        <div className="text-[10px] text-white/50 mt-0.5">{ev.time}</div>
                      </div>
                      <div className="text-right">
                        <span className="text-rose-400 font-bold">{ev.bpm} BPM</span>
                        <div className="text-[10px] text-emerald-400 font-semibold">{ev.status}</div>
                      </div>
                    </div>
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

export default HeartbeatPage;
