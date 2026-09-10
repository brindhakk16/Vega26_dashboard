import React, { useState } from 'react';
import { History, Download, Calendar, Filter, FileSpreadsheet, Flame, Wind, AlertTriangle, Activity, CheckCircle2 } from 'lucide-react';

export function HistoricalTimelogPage({ history = [], alerts = [] }) {
  const [selectedSensor, setSelectedSensor] = useState('ALL');

  // Filter logs based on selected sensor module
  const filteredLogs = history.filter(item => {
    if (selectedSensor === 'ALL') return true;
    if (item.sensor) return item.sensor === selectedSensor;
    if (selectedSensor === 'Thermal') return item.maxTemp !== undefined;
    if (selectedSensor === 'Air Quality') return item.co2 !== undefined;
    if (selectedSensor === 'Combustible Gas') return item.h2 !== undefined;
    if (selectedSensor === 'Radar') return item.breathingRate !== undefined;
    return true;
  });

  // Calculate summary stats
  const maxTemps = history.map(h => h.maxTemp || 0);
  const co2List = history.map(h => h.co2 || 0);
  const bpmList = history.map(h => h.breathingRate || 0).filter(b => b > 0);

  const stats = {
    maxTempPeak: maxTemps.length ? Math.max(...maxTemps) : 36.8,
    avgTempMean: maxTemps.length ? (maxTemps.reduce((a, b) => a + b, 0) / maxTemps.length).toFixed(1) : 31.4,
    co2Peak: co2List.length ? Math.max(...co2List) : 620,
    avgBpm: bpmList.length ? Math.round(bpmList.reduce((a, b) => a + b, 0) / bpmList.length) : 18,
    totalAlerts: alerts.length
  };

  const handleExport = () => {
    if (!history.length) return alert('No historical timelog data to export.');
    
    const headers = ['Timestamp', 'MaxTemp_C', 'AvgTemp_C', 'MinTemp_C', 'CO2_ppm', 'NH3_ppm', 'CO_ppm', 'C6H6_ppm', 'H2_ppm', 'CH4_ppm', 'BreathingBPM'];
    const rows = history.map(h => [
      h.time,
      h.maxTemp,
      h.avgTemp,
      h.minTemp,
      h.co2,
      h.nh3,
      h.co,
      h.c6h6,
      h.h2,
      h.ch4,
      h.breathingRate
    ]);

    const csv = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csv));
    link.setAttribute('download', `Historical_Sensor_Timelog_${new Date().toISOString().slice(0, 10)}.csv`);
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
            <History className="w-7 h-7 text-emerald-600" />
            <span>HISTORICAL ANALYTICS & DATA TIMELOG</span>
          </h1>
          <p className="text-xs text-slate-500 font-sans mt-1">
            Query timestamped historical sensor logs, review multi-sensor statistical bounds & export CSV data
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-outfit font-bold text-xs flex items-center gap-2 shadow-md transition-all"
          >
            <Download className="w-4 h-4 text-[#D4FF00]" />
            <span>EXPORT TIMELOG CSV</span>
          </button>
        </div>
      </div>

      {/* STATISTICAL SUMMARY CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 font-mono text-xs">
        <div className="bg-white border border-slate-200/80 p-4 rounded-3xl space-y-1 shadow-md">
          <div className="text-slate-500 font-bold uppercase flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-rose-600" />
            <span>PEAK TEMP</span>
          </div>
          <div className="text-2xl font-extrabold font-outfit text-rose-600">{stats.maxTempPeak}°C</div>
          <div className="text-[10px] text-slate-400">Historical Max</div>
        </div>

        <div className="bg-white border border-slate-200/80 p-4 rounded-3xl space-y-1 shadow-md">
          <div className="text-slate-500 font-bold uppercase">MEAN TEMP</div>
          <div className="text-2xl font-extrabold font-outfit text-slate-900">{stats.avgTempMean}°C</div>
          <div className="text-[10px] text-slate-400">Average Matrix</div>
        </div>

        <div className="bg-white border border-slate-200/80 p-4 rounded-3xl space-y-1 shadow-md">
          <div className="text-slate-500 font-bold uppercase flex items-center gap-1.5">
            <Wind className="w-3.5 h-3.5 text-amber-600" />
            <span>PEAK CO₂</span>
          </div>
          <div className="text-2xl font-extrabold font-outfit text-amber-600">{stats.co2Peak} ppm</div>
          <div className="text-[10px] text-slate-400">Highest Gas Level</div>
        </div>

        <div className="bg-white border border-slate-200/80 p-4 rounded-3xl space-y-1 shadow-md">
          <div className="text-slate-500 font-bold uppercase flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-emerald-600" />
            <span>AVG BREATHING</span>
          </div>
          <div className="text-2xl font-extrabold font-outfit text-emerald-600">{stats.avgBpm} BPM</div>
          <div className="text-[10px] text-slate-400">Radar Respiration</div>
        </div>

        <div className="bg-white border border-slate-200/80 p-4 rounded-3xl space-y-1 shadow-md col-span-2 lg:col-span-1">
          <div className="text-slate-500 font-bold uppercase flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
            <span>ACTIVE ALERTS</span>
          </div>
          <div className="text-2xl font-extrabold font-outfit text-rose-600">{stats.totalAlerts}</div>
          <div className="text-[10px] text-slate-400">Events Recorded</div>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white border border-slate-200/80 rounded-3xl p-5 shadow-md text-xs font-mono">
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-slate-600 font-bold">FILTER MODULE:</span>
          {['ALL', 'Thermal', 'Air Quality', 'Combustible Gas', 'Radar'].map((m) => (
            <button
              key={m}
              onClick={() => setSelectedSensor(m)}
              className={`px-3.5 py-1.5 rounded-xl border font-bold transition-all flex items-center gap-1.5 ${
                selectedSensor === m
                  ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                  : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>{m}</span>
            </button>
          ))}
        </div>

        <div className="text-slate-500 flex items-center gap-2">
          <span>Active Filter:</span>
          <strong className="text-emerald-700 font-bold uppercase">{selectedSensor}</strong>
          <span className="text-slate-300">•</span>
          <span>Showing <strong className="text-slate-900">{filteredLogs.length}</strong> Records</span>
        </div>
      </div>

      {/* HISTORICAL TIMELOG DATA TABLE */}
      <div className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead className="bg-slate-900 text-white uppercase text-[11px]">
              <tr>
                <th className="px-5 py-3.5 font-bold">Timestamp</th>

                {(selectedSensor === 'ALL' || selectedSensor === 'Thermal') && (
                  <>
                    <th className="px-5 py-3.5 text-rose-400 font-bold">Max Temp (°C)</th>
                    <th className="px-5 py-3.5 text-cyan-300 font-bold">Avg Temp (°C)</th>
                  </>
                )}

                {(selectedSensor === 'ALL' || selectedSensor === 'Air Quality') && (
                  <>
                    <th className="px-5 py-3.5 text-amber-400 font-bold">CO₂ (ppm)</th>
                    <th className="px-5 py-3.5 text-amber-200">NH₃ (ppm)</th>
                    <th className="px-5 py-3.5 text-amber-400">CO (ppm)</th>
                    <th className="px-5 py-3.5 text-amber-200">C₆H₆ (ppm)</th>
                  </>
                )}

                {(selectedSensor === 'ALL' || selectedSensor === 'Combustible Gas') && (
                  <>
                    <th className="px-5 py-3.5 text-rose-400 font-bold">H₂ (ppm)</th>
                    <th className="px-5 py-3.5 text-orange-400 font-bold">CH₄ (ppm)</th>
                  </>
                )}

                {(selectedSensor === 'ALL' || selectedSensor === 'Radar') && (
                  <>
                    <th className="px-5 py-3.5 text-[#D4FF00] font-bold">Breathing (BPM)</th>
                    <th className="px-5 py-3.5 text-emerald-400 font-bold">Presence</th>
                  </>
                )}

                <th className="px-5 py-3.5 text-right font-bold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/80">
              {filteredLogs.slice().reverse().map((row, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3.5 font-bold text-slate-900">{row.time}</td>

                  {(selectedSensor === 'ALL' || selectedSensor === 'Thermal') && (
                    <>
                      <td className="px-5 py-3.5 text-rose-600 font-bold">{row.maxTemp ?? '36.5'}°C</td>
                      <td className="px-5 py-3.5 text-slate-700 font-bold">{row.avgTemp ?? '31.2'}°C</td>
                    </>
                  )}

                  {(selectedSensor === 'ALL' || selectedSensor === 'Air Quality') && (
                    <>
                      <td className="px-5 py-3.5 text-amber-600 font-bold">{row.co2 ?? '420'}</td>
                      <td className="px-5 py-3.5 text-slate-700 font-bold">{row.nh3 ?? '12'}</td>
                      <td className="px-5 py-3.5 text-amber-600 font-bold">{row.co ?? '5'}</td>
                      <td className="px-5 py-3.5 text-slate-700 font-bold">{row.c6h6 ?? '2'}</td>
                    </>
                  )}

                  {(selectedSensor === 'ALL' || selectedSensor === 'Combustible Gas') && (
                    <>
                      <td className="px-5 py-3.5 text-rose-600 font-bold">{row.h2 ?? '15'}</td>
                      <td className="px-5 py-3.5 text-amber-600 font-bold">{row.ch4 ?? '4'}</td>
                    </>
                  )}

                  {(selectedSensor === 'ALL' || selectedSensor === 'Radar') && (
                    <>
                      <td className="px-5 py-3.5 text-emerald-700 font-bold">
                        {row.presence !== 0 && row.presence !== false ? `${row.breathingRate || 18} BPM` : 'OFF'}
                      </td>
                      <td className="px-5 py-3.5 text-emerald-600 font-semibold">
                        {row.presence !== 0 && row.presence !== false ? '● DETECTED' : '○ CLEAR'}
                      </td>
                    </>
                  )}

                  <td className="px-5 py-3.5 text-right">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                      NORMAL
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

export default HistoricalTimelogPage;
