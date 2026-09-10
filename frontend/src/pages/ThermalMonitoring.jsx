import React, { useState } from 'react';
import { 
  Flame, 
  Layers, 
  Activity, 
  Cpu, 
  Radio, 
  Maximize2, 
  Sliders, 
  CheckCircle2, 
  Eye,
  Zap,
  TrendingUp,
  Crosshair,
  BatteryCharging,
  Tv,
  LayoutGrid,
  Settings2
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';
import { PALETTES, getTemperatureColor, formatTemp } from '../utils/thermalColor.js';
import { ThermalCanvas } from '../components/thermal/ThermalCanvas.jsx';

export function ThermalMonitoringPage({ data = {}, history = [], thresholds = {} }) {
  const [viewMode, setViewMode] = useState('lcd'); // 'lcd' (Hardware Imager LCD photo match) or 'workstation'
  const [palette, setPalette] = useState(PALETTES.IRONBOW);
  const [renderMode, setRenderMode] = useState('smooth'); // 'smooth', 'pixel', 'contour'
  const [showHotspotMarker, setShowHotspotMarker] = useState(true);
  const [showCenterCrosshair, setShowCenterCrosshair] = useState(true);
  const [emissivity, setEmissivity] = useState(0.95);
  const [unit, setUnit] = useState('C');
  const [timeWindow, setTimeWindow] = useState('1m');
  const [hoveredCell, setHoveredCell] = useState(null);

  const amg = data.amg8833 || {};
  const matrix = amg.temperature_matrix || Array.from({ length: 8 }, () => Array(8).fill(27.5));
  const maxTemp = amg.max_temperature || 36.8;
  const avgTemp = amg.average_temperature || 31.4;
  const minTemp = amg.min_temperature || 27.2;
  const hotspotRow = amg.hotspot_row || 3;
  const hotspotCol = amg.hotspot_col || 4;
  const centerTemp = matrix[3] ? matrix[3][3] : 31.0;

  // Filter history for charts
  const limitCount = timeWindow === 'live' ? 15 : timeWindow === '1m' ? 60 : timeWindow === '5m' ? 150 : timeWindow === '30m' ? 300 : 500;
  const chartHistory = history.slice(-limitCount).map(item => ({
    ...item,
    dispMax: unit === 'F' ? Number(((item.maxTemp * 9) / 5 + 32).toFixed(1)) : item.maxTemp,
    dispAvg: unit === 'F' ? Number(((item.avgTemp * 9) / 5 + 32).toFixed(1)) : item.avgTemp,
    dispMin: unit === 'F' ? Number(((item.minTemp * 9) / 5 + 32).toFixed(1)) : item.minTemp
  }));

  return (
    <div className="space-y-6 font-jakarta text-slate-900 select-none">
      
      {/* Title Header Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 font-outfit uppercase flex items-center gap-2.5">
            <Flame className="w-7 h-7 text-rose-500 animate-pulse" />
            <span>THERMAL IMAGER DISPLAY & TELEMETRY</span>
          </h1>
          <p className="text-xs text-slate-500 font-sans mt-1">
            Hardware TFT LCD Thermal Camera Simulation & 8×8 Infrared Telemetry
          </p>
        </div>

        {/* View Mode Switcher Pills */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <button
            onClick={() => setViewMode('lcd')}
            className={`px-4 py-2 rounded-full font-bold flex items-center gap-2 transition-all ${
              viewMode === 'lcd'
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Tv className="w-4 h-4" />
            <span>TFT LCD CAMERA VIEW</span>
          </button>

          <button
            onClick={() => setViewMode('workstation')}
            className={`px-4 py-2 rounded-full font-bold flex items-center gap-2 transition-all ${
              viewMode === 'workstation'
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span>WORKSTATION GRID VIEW</span>
          </button>

          <button
            onClick={() => setUnit(unit === 'C' ? 'F' : 'C')}
            className="px-3.5 py-2 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 font-bold transition-all"
          >
            °{unit}
          </button>
        </div>
      </div>

      {/* VIEW MODE 1: HARDWARE TFT LCD THERMAL CAMERA DISPLAY */}
      {viewMode === 'lcd' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left 7 Columns - The Physical LCD Device Screen Casing */}
          <div className="lg:col-span-7 flex flex-col items-center space-y-4">
            
            {/* HARDWARE THERMAL MONITOR CHASSIS */}
            <div className="relative w-full max-w-[620px] bg-slate-950 rounded-[32px] p-5 shadow-2xl border border-slate-800 select-none space-y-3.5">
              
              {/* Device Top Status Header */}
              <div className="flex justify-between items-center px-2 text-[11px] font-mono text-white/80 font-bold uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-white font-outfit text-xs font-extrabold tracking-wide">THERMAL IMAGER PRO-SERIES</span>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded-md border border-cyan-500/30 text-[10px]">10 FPS • LIVE</span>
                  <span className="flex items-center gap-1 text-[#D4FF00]">
                    <BatteryCharging className="w-3.5 h-3.5" />
                    <span>98%</span>
                  </span>
                </div>
              </div>

              {/* THE LCD TFT SCREEN CONTAINER */}
              <div className="relative w-full aspect-[4/3] bg-black rounded-2xl border border-cyan-500/30 shadow-2xl overflow-hidden font-mono">
                
                {/* Thermal Canvas Background Engine */}
                <div className="absolute inset-0">
                  <ThermalCanvas
                    temperatures={matrix}
                    minTemp={minTemp}
                    maxTemp={maxTemp}
                    palette={palette}
                    mode={renderMode}
                    showGrid={false}
                    showHotspot={showHotspotMarker}
                    showCradleOutline={false}
                    autoRange={true}
                    unit={unit}
                    width={512}
                    height={384}
                  />
                </div>

                {/* HARDWARE OSD OVERLAY */}
                <div className="absolute inset-0 pointer-events-none p-3.5 flex flex-col justify-between z-20 text-xs text-white font-bold drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
                  
                  {/* TOP OSD BAR */}
                  <div className="flex justify-between items-start">
                    <div className="bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-xl border border-cyan-400/40 text-cyan-300 text-xs font-mono font-bold shadow-lg flex items-center gap-1.5">
                      <span className="text-white/60 text-[10px]">MIN</span>
                      <span>{formatTemp(minTemp, unit)}</span>
                    </div>

                    <div className="flex flex-col items-center gap-1">
                      <div className="w-28 h-2.5 rounded-full border border-white/30 overflow-hidden bg-gradient-to-r from-blue-600 via-emerald-400 via-amber-400 to-rose-600 shadow-md" />
                      <span className="text-[9px] font-mono text-white/70 uppercase font-semibold">PALETTE: {palette}</span>
                    </div>

                    <div className="bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-xl border border-rose-500/40 text-rose-400 text-xs font-mono font-bold shadow-lg flex items-center gap-1.5">
                      <span className="text-white/60 text-[10px]">MAX</span>
                      <span>{formatTemp(maxTemp, unit)}</span>
                    </div>
                  </div>

                  {/* CENTER RETICLE CROSSHAIR */}
                  {showCenterCrosshair && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                      <Crosshair className="w-8 h-8 text-cyan-300 animate-pulse drop-shadow-[0_0_10px_#06b6d4]" />
                    </div>
                  )}

                  {/* BOTTOM OSD BAR */}
                  <div className="flex justify-between items-end text-[11px]">
                    <div className="bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-xl border border-emerald-400/40 text-emerald-300 font-mono text-xs flex items-center gap-1">
                      <span className="text-white/60 text-[10px]">EMISSIVITY</span>
                      <span>ε = {emissivity.toFixed(2)}</span>
                    </div>

                    <div className="bg-slate-950/85 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 text-white font-mono text-xs font-extrabold shadow-xl flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                      <span className="text-white/70 font-normal">SPOT:</span>
                      <span className="text-cyan-300 text-sm">{formatTemp(centerTemp, unit)}</span>
                    </div>

                    <div className="bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-xl border border-[#D4FF00]/40 text-[#D4FF00] font-mono text-[10px] font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#D4FF00]" />
                      <span>OPTICS AUTO-CAL</span>
                    </div>
                  </div>

                </div>

              </div>

              {/* Hardware Tactile Control Buttons */}
              <div className="flex justify-between items-center pt-2 px-1 text-xs font-mono">
                <button 
                  onClick={() => setPalette(palette === PALETTES.IRONBOW ? PALETTES.FLIR : palette === PALETTES.FLIR ? PALETTES.RAINBOW : PALETTES.IRONBOW)}
                  className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-xl transition-all text-[#D4FF00] font-bold flex items-center gap-1.5 shadow"
                >
                  <Eye className="w-3.5 h-3.5 text-[#D4FF00]" />
                  <span>PALETTE</span>
                </button>
                <button 
                  onClick={() => setShowCenterCrosshair(!showCenterCrosshair)}
                  className={`px-3.5 py-1.5 border rounded-xl transition-all font-bold flex items-center gap-1.5 shadow ${
                    showCenterCrosshair 
                      ? 'bg-cyan-900 border-cyan-500 text-cyan-300' 
                      : 'bg-slate-800 border-slate-700 text-slate-400'
                  }`}
                >
                  <Crosshair className="w-3.5 h-3.5" />
                  <span>HUD CROSSHAIR</span>
                </button>
                <button 
                  onClick={() => setRenderMode(renderMode === 'smooth' ? 'pixel' : 'smooth')}
                  className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-xl transition-all text-white font-bold flex items-center gap-1.5 shadow"
                >
                  <Layers className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{renderMode === 'smooth' ? 'SMOOTH' : 'PIXEL GRID'}</span>
                </button>
                <button 
                  onClick={() => setShowHotspotMarker(!showHotspotMarker)}
                  className={`px-3.5 py-1.5 border rounded-xl transition-all font-bold flex items-center gap-1.5 shadow ${
                    showHotspotMarker 
                      ? 'bg-rose-900 border-rose-500 text-rose-300' 
                      : 'bg-slate-800 border-slate-700 text-slate-400'
                  }`}
                >
                  <Flame className="w-3.5 h-3.5" />
                  <span>HOTSPOT</span>
                </button>
              </div>

            </div>

          </div>

          {/* Right 5 Columns - Hardware Controls & Telemetry Data Panel */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Quick Metrics Cards */}
            <div className="grid grid-cols-2 gap-4 font-mono">
              <div className="bg-white border border-slate-200/80 p-4 rounded-3xl space-y-1 shadow-md">
                <div className="text-xs text-rose-600 font-bold uppercase">MAX TEMP</div>
                <div className="text-3xl font-extrabold font-outfit text-slate-900">
                  {formatTemp(maxTemp, unit)}
                </div>
                <div className="text-[10px] text-slate-500">Hotspot Coordinates</div>
              </div>

              <div className="bg-white border border-slate-200/80 p-4 rounded-3xl space-y-1 shadow-md">
                <div className="text-xs text-cyan-600 font-bold uppercase">MIN TEMP</div>
                <div className="text-3xl font-extrabold font-outfit text-slate-900">
                  {formatTemp(minTemp, unit)}
                </div>
                <div className="text-[10px] text-slate-500">Coolest Region</div>
              </div>
            </div>

            {/* Emissivity & Imager Settings Panel */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-md space-y-4 font-mono text-xs">
              <h3 className="font-outfit text-sm font-bold text-slate-900 uppercase flex items-center gap-2 border-b border-slate-100 pb-3">
                <Settings2 className="w-4 h-4 text-emerald-600" />
                <span>Thermal Imager OSD Parameters</span>
              </h3>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1.5 text-slate-700 font-bold">
                    <span>Emissivity Coefficient (ε):</span>
                    <span className="text-emerald-700 font-extrabold">{emissivity.toFixed(2)} (Human Skin / Matte)</span>
                  </div>
                  <input
                    type="range"
                    min="0.10"
                    max="1.00"
                    step="0.01"
                    value={emissivity}
                    onChange={(e) => setEmissivity(Number(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
                  />
                  <span className="text-[10px] text-slate-500 block mt-1">Standard skin thermal emissivity: 0.95 - 0.98</span>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                    <div className="text-slate-500 text-[10px] font-bold">Hotspot Region</div>
                    <div className="text-sm font-bold text-slate-900 font-outfit mt-0.5">Row {hotspotRow} / Col {hotspotCol}</div>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                    <div className="text-slate-500 text-[10px] font-bold">Center Spot Temp</div>
                    <div className="text-sm font-bold text-cyan-600 font-outfit mt-0.5">{formatTemp(centerTemp, unit)}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Maximum Temperature vs Time Chart */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-md space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3 font-mono text-xs">
                <span className="font-outfit text-sm font-bold text-slate-900 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-rose-600" />
                  <span>Maximum Temperature vs Time</span>
                </span>

                <div className="flex items-center gap-1">
                  {['live', '1m', '5m', '30m'].map(t => (
                    <button
                      key={t}
                      onClick={() => setTimeWindow(t)}
                      className={`px-2 py-0.5 rounded-md border transition-all uppercase ${
                        timeWindow === t
                          ? 'bg-slate-900 text-white font-bold border-slate-900'
                          : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartHistory} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                    <XAxis dataKey="time" stroke="#64748B" fontSize={10} tickLine={false} fontFamily="monospace" />
                    <YAxis stroke="#64748B" fontSize={10} tickLine={false} domain={['auto', 'auto']} fontFamily="monospace" unit={`°${unit}`} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0F172A',
                        borderColor: '#334155',
                        borderRadius: '12px',
                        fontSize: '11px',
                        color: '#F8FAFC'
                      }}
                    />
                    <Line type="monotone" dataKey="dispMax" name={`Max Temp (°${unit})`} stroke="#f43f5e" strokeWidth={2.5} dot={false} />
                    <Line type="monotone" dataKey="dispAvg" name={`Avg Temp (°${unit})`} stroke="#10b981" strokeWidth={1.5} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* VIEW MODE 2: FULL WORKSTATION GRID VIEW */}
      {viewMode === 'workstation' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          <div className="lg:col-span-7 bg-white border border-slate-200/80 rounded-3xl p-6 shadow-md space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-mono font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-600" />
                <span>64-Cell Thermopile Matrix Display</span>
              </span>
              <span className="text-[11px] font-mono text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300 font-bold">
                ● Live Stream Active
              </span>
            </div>

            <div className="relative p-5 bg-slate-950 rounded-2xl border border-slate-800 shadow-xl">
              <div className="flex justify-between items-center text-xs font-mono mb-4 bg-slate-900 px-4 py-2 rounded-xl border border-slate-800 text-white">
                <span className="text-slate-400">
                  {hoveredCell ? `Inspecting Cell: Row ${hoveredCell.row} / Col ${hoveredCell.col}` : 'Hover over any cell to inspect temperature'}
                </span>
                <span className="text-[#D4FF00] font-bold text-sm">
                  {hoveredCell 
                    ? formatTemp(hoveredCell.val, unit)
                    : `Hotspot: Row ${hotspotRow} / Col ${hotspotCol} (${formatTemp(maxTemp, unit)})`
                  }
                </span>
              </div>

              <div className="grid grid-cols-8 gap-2 aspect-square max-w-md mx-auto">
                {matrix.flatMap((row, r) =>
                  row.map((val, c) => {
                    const isHotspot = showHotspotMarker && (r + 1 === hotspotRow) && (c + 1 === hotspotCol);
                    const colorCss = getTemperatureColor(val, minTemp, maxTemp, palette);

                    return (
                      <div
                        key={`${r}-${c}`}
                        onMouseEnter={() => setHoveredCell({ row: r + 1, col: c + 1, val })}
                        onMouseLeave={() => setHoveredCell(null)}
                        className={`relative flex flex-col items-center justify-center rounded-xl text-xs font-mono font-bold cursor-pointer transition-all duration-300 select-none ${
                          isHotspot 
                            ? 'ring-4 ring-[#D4FF00] scale-105 z-20 shadow-lg' 
                            : 'hover:scale-105 hover:z-10 hover:ring-2 hover:ring-white'
                        }`}
                        style={{
                          backgroundColor: colorCss,
                          color: '#ffffff'
                        }}
                      >
                        <span className="text-[11px] font-extrabold drop-shadow">
                          {unit === 'F' ? ((val * 9)/5 + 32).toFixed(1) : val.toFixed(1)}°
                        </span>
                        <span className="text-[8px] text-white/80 font-normal drop-shadow">r{r+1}c{c+1}</span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-6">
            <div className="grid grid-cols-2 gap-4 font-mono">
              <div className="bg-white border border-slate-200/80 p-4 rounded-3xl space-y-1 shadow-md">
                <div className="text-xs text-rose-600 font-bold uppercase">MAX TEMP</div>
                <div className="text-3xl font-extrabold font-outfit text-slate-900">
                  {formatTemp(maxTemp, unit)}
                </div>
                <div className="text-[10px] text-slate-500">Hotspot Peak</div>
              </div>

              <div className="bg-white border border-slate-200/80 p-4 rounded-3xl space-y-1 shadow-md">
                <div className="text-xs text-slate-500 font-bold uppercase">AVERAGE TEMP</div>
                <div className="text-3xl font-extrabold font-outfit text-slate-900">
                  {formatTemp(avgTemp, unit)}
                </div>
                <div className="text-[10px] text-slate-500">64 Cell Mean</div>
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}

export default ThermalMonitoringPage;
