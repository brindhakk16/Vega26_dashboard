import React, { useState } from 'react';
import { LineChart as ChartIcon, Download, Play, Pause, ZoomIn, RotateCcw, Activity } from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

export function LiveTrendsPage({ history = [], isPaused = false, onTogglePause }) {
  const [selectedParam, setSelectedParam] = useState('maxTemp');
  const [timeRange, setTimeRange] = useState('15m'); // 1m, 5m, 15m, 1h, 6h, 24h

  const parameters = [
    { id: 'maxTemp', label: 'Temperature (°C)', color: '#f43f5e', unit: '°C' },
    { id: 'co2', label: 'CO₂ Concentration', color: '#10b981', unit: 'ppm' },
    { id: 'nh3', label: 'NH₃ Ammonia', color: '#06b6d4', unit: 'ppm' },
    { id: 'co', label: 'CO Carbon Monoxide', color: '#f59e0b', unit: 'ppm' },
    { id: 'c6h6', label: 'C₆H₆ Benzene', color: '#8b5cf6', unit: 'ppm' },
    { id: 'h2', label: 'H₂ Hydrogen', color: '#ec4899', unit: 'ppm' },
    { id: 'ch4', label: 'CH₄ Methane', color: '#3b82f6', unit: 'ppm' },
    { id: 'breathingRate', label: 'Breathing Rate (BPM)', color: '#10b981', unit: 'BPM' }
  ];

  const currentParamObj = parameters.find(p => p.id === selectedParam) || parameters[0];

  const limitCount = timeRange === '1m' ? 12 : timeRange === '5m' ? 60 : timeRange === '15m' ? 180 : timeRange === '1h' ? 300 : 500;
  const filteredHistory = history.slice(-limitCount);

  // CSV Export Handler
  const handleExportCSV = () => {
    if (!history.length) return alert('No telemetry data available for export');
    
    const headers = ['Timestamp', 'MaxTemp_C', 'AvgTemp_C', 'CO2_ppm', 'NH3_ppm', 'CO_ppm', 'C6H6_ppm', 'H2_ppm', 'CH4_ppm', 'BreathingBPM'];
    const rows = history.map(h => [
      h.time,
      h.maxTemp,
      h.avgTemp,
      h.co2,
      h.nh3,
      h.co,
      h.c6h6,
      h.h2,
      h.ch4,
      h.breathingRate
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `IoT_Sensor_Telemetry_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 font-jakarta text-white select-none">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-violet-500/20 pb-5">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white font-outfit uppercase flex items-center gap-2.5 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
            <ChartIcon className="w-7 h-7 text-violet-400 drop-shadow-[0_0_10px_rgba(167,139,250,0.8)]" />
            <span>LIVE SENSOR TIME-SERIES TRENDS</span>
          </h1>
          <p className="text-xs text-violet-300/70 font-sans mt-1">
            Historical time-series analysis for thermal, atmospheric gas & respiratory parameters
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 rounded-xl bg-obsidian-800 border border-violet-500/30 text-white font-outfit font-bold text-xs flex items-center gap-2 shadow-[0_0_15px_rgba(139,92,246,0.2)] hover:bg-obsidian-700 transition-all"
          >
            <Download className="w-4 h-4 text-[#D4FF00]" />
            <span>EXPORT TELEMETRY CSV</span>
          </button>
        </div>
      </div>

      {/* PARAMETER SELECTOR & CHART CONTAINER */}
      <div className="bg-obsidian-800/80 backdrop-blur-md border border-violet-500/20 rounded-3xl p-6 shadow-[0_4px_20px_rgba(139,92,246,0.15)] space-y-6">
        
        {/* Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-violet-500/20 scrollbar-none font-mono text-xs">
          {parameters.map((p) => {
            const isSelected = selectedParam === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setSelectedParam(p.id)}
                className={`px-4 py-2 rounded-xl font-bold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-violet-600 text-white shadow-[0_0_15px_rgba(139,92,246,0.3)] border border-violet-500'
                    : 'bg-obsidian-900 border border-violet-500/20 text-violet-300 hover:bg-obsidian-700'
                }`}
              >
                {p.label}
              </button>
            );
          })}
        </div>

        {/* Toolbar: Time Range, Pause, Reset */}
        <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="text-violet-300/70 font-bold">TIME RANGE:</span>
            {['1m', '5m', '15m', '1h', '6h', '24h'].map((t) => (
              <button
                key={t}
                onClick={() => setTimeRange(t)}
                className={`px-3 py-1.5 rounded-xl border font-bold transition-all ${
                  timeRange === t
                    ? 'bg-violet-600 text-white border-violet-500 shadow-[0_0_10px_rgba(139,92,246,0.3)]'
                    : 'bg-obsidian-900 border-violet-500/20 text-violet-300 hover:bg-obsidian-700'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onTogglePause}
              className="px-3.5 py-1.5 rounded-xl bg-obsidian-900 border border-violet-500/30 hover:bg-obsidian-800 text-violet-200 font-bold flex items-center gap-1.5 transition-all shadow-[0_0_10px_rgba(139,92,246,0.1)]"
            >
              {isPaused ? <Play className="w-3.5 h-3.5 text-emerald-400" /> : <Pause className="w-3.5 h-3.5 text-amber-400" />}
              <span>{isPaused ? 'RESUME LIVE STREAM' : 'PAUSE UPDATES'}</span>
            </button>
          </div>
        </div>

        {/* Main Chart */}
        <div className="h-80 w-full pt-4">
          {filteredHistory.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={filteredHistory} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2e1065" vertical={false} />
                <XAxis dataKey="time" stroke="#a78bfa" fontSize={10} tickLine={false} fontFamily="monospace" />
                <YAxis stroke="#a78bfa" fontSize={10} tickLine={false} domain={['auto', 'auto']} fontFamily="monospace" unit={` ${currentParamObj.unit}`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0c0a1a', // obsidian-900
                    borderColor: 'rgba(139, 92, 246, 0.2)', // violet-500/20
                    borderRadius: '12px',
                    fontSize: '11px',
                    color: '#ede9fe' // violet-100
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace' }} />
                <Line
                  type="monotone"
                  dataKey={currentParamObj.id}
                  name={currentParamObj.label}
                  stroke={currentParamObj.color}
                  strokeWidth={2.5}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-xs font-mono text-violet-400/50">
              Waiting for live sensor data stream...
            </div>
          )}
        </div>

      </div>

    </div>
  );
}

export default LiveTrendsPage;
