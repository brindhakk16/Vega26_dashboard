import React, { useState } from 'react';
import { DashboardNav } from '../components/dashboard/DashboardNav.jsx';
import { 
  Wind, 
  Sparkles, 
  Thermometer, 
  Droplets, 
  Activity, 
  ShieldCheck, 
  Zap, 
  Volume2, 
  RefreshCw, 
  Sliders, 
  CheckCircle2, 
  AlertCircle,
  Fan,
  Sun,
  Flame,
  CloudLightning,
  Filter
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

export function AirQualityPage({ status = {}, environmentStatus = {}, onNavigateTab }) {
  const [fanSpeed, setFanSpeed] = useState(2); // 1: Quiet, 2: Auto, 3: High, 4: Turbo
  const [ionizerActive, setIonizerActive] = useState(true);
  const [uvcActive, setUvcActive] = useState(true);
  const [nightMode, setNightMode] = useState(false);
  const [hepaFilterLife, setHepaFilterLife] = useState(94);
  const [selectedZone, setSelectedZone] = useState('cradle');

  // Simulated 24-hour AQI Telemetry Data
  const [aqiHistory] = useState([
    { time: '04:00', aqi: 24, pm25: 5.1, pm10: 11.2, co2: 430, humidity: 52 },
    { time: '05:00', aqi: 22, pm25: 4.8, pm10: 10.5, co2: 425, humidity: 53 },
    { time: '06:00', aqi: 20, pm25: 4.5, pm10: 10.1, co2: 420, humidity: 54 },
    { time: '07:00', aqi: 19, pm25: 4.3, pm10: 9.9, co2: 418, humidity: 54 },
    { time: '08:00', aqi: 18, pm25: 4.2, pm10: 9.8, co2: 415, humidity: 55 },
    { time: '09:00', aqi: 18, pm25: 4.2, pm10: 9.7, co2: 416, humidity: 54 },
  ]);

  const zones = [
    { id: 'cradle', name: 'Cradle Micro-Zone', aqi: 18, temp: 24.5, humidity: 54, status: 'Pristine' },
    { id: 'nursery', name: 'Nursery Center', aqi: 21, temp: 24.2, humidity: 52, status: 'Optimal' },
    { id: 'window', name: 'Window Perimeter', aqi: 28, temp: 23.8, humidity: 49, status: 'Good' },
    { id: 'doorway', name: 'Hallway Intake', aqi: 32, temp: 24.8, humidity: 48, status: 'Moderate' },
  ];

  const currentZoneData = zones.find(z => z.id === selectedZone) || zones[0];

  return (
    <div className="min-h-screen bg-[#07090e] p-2 md:p-6 text-white font-jakarta">
      {/* Workstation Frame Container */}
      <div className="max-w-[1550px] mx-auto bg-[#0b1018] border border-white/20 rounded-[32px] shadow-2xl overflow-hidden backdrop-blur-3xl">
        
        {/* Navigation Bar */}
        <DashboardNav
          activeTab="airquality"
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
                  Surrounding Air Quality Monitor
                </h1>
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 font-mono text-xs font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  AQI 18 • PRISTINE
                </span>
              </div>
              <p className="text-xs text-white/60 font-sans mt-1">
                Real-time atmospheric telemetry, HEPA micro-particulate filter & ambient nursery comfort
              </p>
            </div>

            {/* Quick Action Badges */}
            <div className="flex flex-wrap items-center gap-2.5 text-xs">
              <button 
                onClick={() => setNightMode(!nightMode)}
                className={`px-3.5 py-1.5 rounded-full border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  nightMode 
                    ? 'bg-[#D4FF00] text-slate-950 border-[#D4FF00] font-bold shadow-md' 
                    : 'bg-white/10 text-white border-white/20 hover:bg-white/15'
                }`}
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>{nightMode ? 'Silent Night Mode ON' : 'Night Mode OFF'}</span>
              </button>

              <button 
                onClick={() => setIonizerActive(!ionizerActive)}
                className={`px-3.5 py-1.5 rounded-full border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  ionizerActive 
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40 font-bold' 
                    : 'bg-white/10 text-white/60 border-white/20'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Plasma Ionizer</span>
              </button>

              <button 
                onClick={() => setUvcActive(!uvcActive)}
                className={`px-3.5 py-1.5 rounded-full border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  uvcActive 
                    ? 'bg-indigo-500/20 text-indigo-300 border-indigo-400/40 font-bold' 
                    : 'bg-white/10 text-white/60 border-white/20'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>UV-C Sterilizer</span>
              </button>
            </div>
          </div>

          {/* TOP METRICS ROW (4 Cards) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            
            {/* Card 1: AQI Gauge */}
            <div className="bg-gradient-to-br from-emerald-950/40 via-slate-900/80 to-slate-950 border border-emerald-500/30 rounded-3xl p-5 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-bold text-emerald-400 tracking-wider uppercase flex items-center gap-1.5">
                  <Wind className="w-4 h-4" />
                  Air Quality Index
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  EPA Excellent
                </span>
              </div>
              <div className="flex items-baseline justify-between mt-2">
                <div>
                  <div className="text-4xl font-extrabold font-outfit text-white tracking-tight">18</div>
                  <div className="text-xs text-emerald-300 font-medium mt-1">Pristine Pure Air</div>
                </div>
                {/* Visual Circle Meter */}
                <div className="w-16 h-16 rounded-full border-4 border-emerald-500/30 border-t-emerald-400 flex items-center justify-center font-mono text-xs font-bold text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                  98%
                </div>
              </div>
              <div className="w-full bg-white/10 h-1.5 rounded-full mt-4 overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-400 to-[#D4FF00] h-full w-[18%]" />
              </div>
              <div className="flex justify-between text-[10px] text-white/50 font-mono mt-1.5">
                <span>0 Pristine</span>
                <span>50 Good</span>
                <span>100+ Moderate</span>
              </div>
            </div>

            {/* Card 2: Particulates PM2.5 & PM10 */}
            <div className="bg-gradient-to-br from-cyan-950/40 via-slate-900/80 to-slate-950 border border-cyan-500/30 rounded-3xl p-5 shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-bold text-cyan-400 tracking-wider uppercase flex items-center gap-1.5">
                  <Filter className="w-4 h-4" />
                  Particulates (PM)
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  HEPA Active
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-2">
                <div className="bg-white/5 p-2.5 rounded-2xl border border-white/10">
                  <div className="text-[11px] text-white/60">PM 2.5 Micro</div>
                  <div className="text-xl font-bold font-outfit text-white">4.2 <span className="text-xs font-mono text-cyan-400">µg/m³</span></div>
                  <div className="text-[10px] text-emerald-400 mt-0.5">Ultra Low</div>
                </div>
                <div className="bg-white/5 p-2.5 rounded-2xl border border-white/10">
                  <div className="text-[11px] text-white/60">PM 10 Dust</div>
                  <div className="text-xl font-bold font-outfit text-white">9.8 <span className="text-xs font-mono text-cyan-400">µg/m³</span></div>
                  <div className="text-[10px] text-emerald-400 mt-0.5">Optimal</div>
                </div>
              </div>
            </div>

            {/* Card 3: Gas & CO2 Safety */}
            <div className="bg-gradient-to-br from-amber-950/30 via-slate-900/80 to-slate-950 border border-amber-500/30 rounded-3xl p-5 shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-bold text-amber-400 tracking-wider uppercase flex items-center gap-1.5">
                  <CloudLightning className="w-4 h-4" />
                  CO₂ & VOC Safety
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  Fresh Air
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-2">
                <div className="bg-white/5 p-2.5 rounded-2xl border border-white/10">
                  <div className="text-[11px] text-white/60">CO₂ Level</div>
                  <div className="text-xl font-bold font-outfit text-white">415 <span className="text-xs font-mono text-amber-400">ppm</span></div>
                  <div className="text-[10px] text-amber-300 mt-0.5">Fresh Oxygen</div>
                </div>
                <div className="bg-white/5 p-2.5 rounded-2xl border border-white/10">
                  <div className="text-[11px] text-white/60">TVOC</div>
                  <div className="text-xl font-bold font-outfit text-white">0.03 <span className="text-xs font-mono text-amber-400">mg/m³</span></div>
                  <div className="text-[10px] text-emerald-400 mt-0.5">Non-toxic</div>
                </div>
              </div>
            </div>

            {/* Card 4: Nursery Climate & Hydration */}
            <div className="bg-gradient-to-br from-indigo-950/30 via-slate-900/80 to-slate-950 border border-indigo-500/30 rounded-3xl p-5 shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-bold text-indigo-400 tracking-wider uppercase flex items-center gap-1.5">
                  <Droplets className="w-4 h-4" />
                  Humidity & Temp
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                  Ideal Hydration
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-2">
                <div className="bg-white/5 p-2.5 rounded-2xl border border-white/10">
                  <div className="text-[11px] text-white/60">Relative Humid.</div>
                  <div className="text-xl font-bold font-outfit text-white">54%</div>
                  <div className="text-[10px] text-emerald-400 mt-0.5">Infant Ideal</div>
                </div>
                <div className="bg-white/5 p-2.5 rounded-2xl border border-white/10">
                  <div className="text-[11px] text-white/60">Ambient Temp</div>
                  <div className="text-xl font-bold font-outfit text-white">24.5°C</div>
                  <div className="text-[10px] text-cyan-300 mt-0.5">Comfort Zone</div>
                </div>
              </div>
            </div>

          </div>

          {/* MAIN WORKSPACE 2-COLUMN GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* LEFT COLUMN (Col 7 / 12) - Air Purification Controls & Room Micro-Zones Map */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Purifier Control Station Card */}
              <div className="bg-slate-900/80 border border-white/15 rounded-3xl p-6 shadow-xl space-y-5">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#D4FF00]/10 border border-[#D4FF00]/30 flex items-center justify-center">
                      <Fan className="w-5 h-5 text-[#D4FF00] animate-spin-slow" />
                    </div>
                    <div>
                      <h3 className="font-outfit text-lg font-bold text-white">
                        Cradle Air Purification Station
                      </h3>
                      <p className="text-xs text-white/60 font-sans">
                        Multi-layer True HEPA H13 Filtration & Ion Air Circulation
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-[#D4FF00] font-bold">
                      HEPA Filter: {hepaFilterLife}% Life
                    </span>
                  </div>
                </div>

                {/* Fan Speed Selection Bar */}
                <div>
                  <div className="flex justify-between items-center text-xs font-semibold mb-2">
                    <span className="text-white/70">AIRFLOW CIRCULATION SPEED:</span>
                    <span className="text-[#D4FF00] font-mono font-bold">
                      {fanSpeed === 1 ? 'Level 1 (Whisper Quiet - 22dB)' : fanSpeed === 2 ? 'Level 2 (Auto Eco Balance)' : fanSpeed === 3 ? 'Level 3 (High Fresh Flow)' : 'Level 4 (Turbo Clean)'}
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { speed: 1, label: 'Whisper 1', sub: '22 dB' },
                      { speed: 2, label: 'Auto Eco 2', sub: '28 dB' },
                      { speed: 3, label: 'High 3', sub: '35 dB' },
                      { speed: 4, label: 'Turbo 4', sub: '42 dB' },
                    ].map((item) => (
                      <button
                        key={item.speed}
                        onClick={() => setFanSpeed(item.speed)}
                        className={`p-3 rounded-2xl border text-center transition-all ${
                          fanSpeed === item.speed
                            ? 'bg-[#D4FF00] text-slate-950 border-[#D4FF00] font-bold shadow-[0_0_15px_rgba(212,255,0,0.3)]'
                            : 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10'
                        }`}
                      >
                        <div className="text-xs font-bold">{item.label}</div>
                        <div className={`text-[10px] font-mono mt-0.5 ${fanSpeed === item.speed ? 'text-slate-900' : 'text-white/50'}`}>
                          {item.sub}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Micro-Zones Room Layout Map */}
                <div className="pt-2">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-mono font-bold text-white/80 uppercase">
                      Nursery Micro-Zone Air Quality Distribution
                    </span>
                    <span className="text-[11px] text-white/50">Click zone to view metrics</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {zones.map((zone) => {
                      const isSelected = selectedZone === zone.id;
                      return (
                        <button
                          key={zone.id}
                          onClick={() => setSelectedZone(zone.id)}
                          className={`p-3.5 rounded-2xl border text-left transition-all ${
                            isSelected
                              ? 'bg-white/15 border-[#D4FF00] shadow-[0_0_12px_rgba(212,255,0,0.2)]'
                              : 'bg-white/5 border-white/10 hover:bg-white/10'
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-white font-outfit">{zone.name}</span>
                            <span className={`w-2 h-2 rounded-full ${zone.aqi < 20 ? 'bg-emerald-400' : zone.aqi < 30 ? 'bg-cyan-400' : 'bg-amber-400'}`} />
                          </div>
                          <div className="text-xl font-extrabold font-outfit text-white mt-1.5">
                            AQI {zone.aqi}
                          </div>
                          <div className="flex items-center gap-2 text-[10px] text-white/60 font-mono mt-1">
                            <span>{zone.temp}°C</span>
                            <span>•</span>
                            <span>{zone.humidity}% RH</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* Selected Zone Deep Dive Info */}
              <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-4 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <div>
                    <div className="text-white font-bold">{currentZoneData.name} Sensor Active</div>
                    <div className="text-white/60 text-[11px]">
                      Air Quality is <span className="text-emerald-400 font-bold">{currentZoneData.status}</span> with ideal infant respiration parameters.
                    </div>
                  </div>
                </div>
                <div className="font-mono text-emerald-400 font-bold text-sm bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
                  AQI {currentZoneData.aqi}
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN (Col 5 / 12) - Real-time Trend Graph & Filter Status */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* 24-Hour AQI Trend Chart */}
              <div className="bg-slate-900/80 border border-white/15 rounded-3xl p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <h3 className="font-outfit text-sm font-bold text-white flex items-center gap-2">
                    <Activity className="w-4 h-4 text-[#D4FF00]" />
                    <span>Real-Time AQI & PM2.5 Telemetry Trend</span>
                  </h3>
                  <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    Live WebSocket
                  </span>
                </div>

                <div className="h-60 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={aqiHistory} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                      <defs>
                        <linearGradient id="aqiColor" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#252A34" vertical={false} />
                      <XAxis dataKey="time" stroke="#8D96A5" fontSize={10} tickLine={false} fontFamily="monospace" />
                      <YAxis stroke="#8D96A5" fontSize={10} tickLine={false} domain={[0, 40]} fontFamily="monospace" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#0d1520',
                          borderColor: '#252A34',
                          borderRadius: '12px',
                          fontSize: '11px',
                          color: '#F4F7FA'
                        }}
                      />
                      <Area type="monotone" dataKey="aqi" name="AQI Index" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#aqiColor)" />
                      <Area type="monotone" dataKey="pm25" name="PM 2.5 (µg/m³)" stroke="#06b6d4" strokeWidth={1.5} fillOpacity={0} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Maintenance & Safety Diagnostic Cards */}
              <div className="bg-slate-900/80 border border-white/15 rounded-3xl p-6 shadow-xl space-y-4">
                <h3 className="font-outfit text-sm font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  <span>Purification & Filter Diagnostics</span>
                </h3>

                <div className="space-y-3 text-xs font-mono">
                  <div className="flex justify-between items-center bg-white/5 p-3 rounded-2xl border border-white/10">
                    <span className="text-white/70">Main H13 HEPA Filter</span>
                    <span className="text-emerald-400 font-bold">{hepaFilterLife}% (Good for 180 days)</span>
                  </div>
                  <div className="flex justify-between items-center bg-white/5 p-3 rounded-2xl border border-white/10">
                    <span className="text-white/70">Activated Carbon Layer</span>
                    <span className="text-emerald-400 font-bold">91% (Odor Neutralized)</span>
                  </div>
                  <div className="flex justify-between items-center bg-white/5 p-3 rounded-2xl border border-white/10">
                    <span className="text-white/70">Air Turnover Rate</span>
                    <span className="text-[#D4FF00] font-bold">6.2 Air Changes / Hour</span>
                  </div>
                </div>

                <button 
                  onClick={() => alert('Initiating HEPA filter self-diagnostic cycle...')}
                  className="w-full py-2.5 rounded-2xl bg-white/10 border border-white/20 hover:bg-white/20 text-white font-outfit font-semibold text-xs transition-all flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Run Air System Self-Diagnostic</span>
                </button>
              </div>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

export default AirQualityPage;
