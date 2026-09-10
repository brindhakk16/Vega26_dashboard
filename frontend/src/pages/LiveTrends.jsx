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
    <div className="space-y-6 font-jakarta text-slate-900 select-none">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 font-outfit uppercase flex items-center gap-2.5">
            <ChartIcon className="w-7 h-7 text-emerald-600" />
            <span>LIVE SENSOR TIME-SERIES TRENDS</span>
          </h1>
          <p className="text-xs text-slate-500 font-sans mt-1">
            Historical time-series analysis for thermal, atmospheric gas & respiratory parameters
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 rounded-xl bg-slate-900 text-white font-outfit font-bold text-xs flex items-center gap-2 shadow-md hover:bg-slate-800 transition-all"
          >
            <Download className="w-4 h-4 text-[#D4FF00]" />
            <span>EXPORT TELEMETRY CSV</span>
          </button>
        </div>
      </div>

      {/* PARAMETER SELECTOR & CHART CONTAINER */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-md space-y-6">
        
        {/* Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-100 scrollbar-none font-mono text-xs">
          {parameters.map((p) => {
            const isSelected = selectedParam === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setSelectedParam(p.id)}
                className={`px-4 py-2 rounded-xl font-bold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'bg-slate-100 border border-slate-200 text-slate-600 hover:bg-slate-200'
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
            <span className="text-slate-600 font-bold">TIME RANGE:</span>
            {['1m', '5m', '15m', '1h', '6h', '24h'].map((t) => (
              <button
                key={t}
                onClick={() => setTimeRange(t)}
                className={`px-3 py-1.5 rounded-xl border font-bold transition-all ${
                  timeRange === t
                    ? 'bg-emerald-500 text-white border-emerald-600 shadow-sm'
                    : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onTogglePause}
              className="px-3.5 py-1.5 rounded-xl bg-slate-100 border border-slate-200 hover:bg-slate-200 text-slate-700 font-bold flex items-center gap-1.5 transition-all"
            >
              {isPaused ? <Play className="w-3.5 h-3.5 text-emerald-600" /> : <Pause className="w-3.5 h-3.5 text-amber-600" />}
              <span>{isPaused ? 'RESUME LIVE STREAM' : 'PAUSE UPDATES'}</span>
            </button>
          </div>
        </div>

        {/* Main Chart */}
        <div className="h-80 w-full pt-4">
          {filteredHistory.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={filteredHistory} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                <XAxis dataKey="time" stroke="#64748B" fontSize={10} tickLine={false} fontFamily="monospace" />
                <YAxis stroke="#64748B" fontSize={10} tickLine={false} domain={['auto', 'auto']} fontFamily="monospace" unit={` ${currentParamObj.unit}`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    fontSize: '11px',
                    color: '#F8FAFC'
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
            <div className="h-full flex items-center justify-center text-xs font-mono text-slate-400">
              Waiting for live sensor data stream...
            </div>
          )}
        </div>

      </div>

    </div>
  );
}

export default LiveTrendsPage;
