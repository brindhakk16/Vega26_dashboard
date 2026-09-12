import React, { useState } from 'react';
import { Bell, AlertTriangle, ShieldAlert, CheckCircle2, Trash2, Filter } from 'lucide-react';

export function AlertsEventsPage({ alerts = [], onAcknowledge, onClear, onClearAll }) {
  const [filterSeverity, setFilterSeverity] = useState('ALL');

  const filteredAlerts = alerts.filter(a => filterSeverity === 'ALL' || a.severity === filterSeverity);

  return (
    <div className="p-4 md:p-8 space-y-6 font-jakarta text-white select-none">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-violet-500/20 pb-5">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white font-outfit uppercase flex items-center gap-2.5 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
            <Bell className="w-7 h-7 text-rose-500 drop-shadow-[0_0_10px_rgba(244,63,94,0.8)]" />
            <span>ALERTS & EVENTS SYSTEM</span>
          </h1>
          <p className="text-xs text-violet-300/70 font-sans mt-1">
            Real-time threshold breaches, environmental warnings & hardware diagnostic alerts
          </p>
        </div>

        <div className="flex items-center gap-2">
          {alerts.length > 0 && (
            <button
              onClick={onClearAll}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(244,63,94,0.3)]"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>CLEAR ALL ALERTS</span>
            </button>
          )}
        </div>
      </div>

      {/* FILTER BAR & SUMMARY */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-obsidian-800/80 backdrop-blur-md border border-violet-500/20 rounded-2xl p-4 shadow-[0_4px_20px_rgba(139,92,246,0.1)] text-xs font-mono">
        <div className="flex flex-wrap items-center gap-2">
          <Filter className="w-4 h-4 text-violet-400/60" />
          <span className="text-violet-300/70 font-bold">FILTER SEVERITY:</span>
          {['ALL', 'CRITICAL', 'WARNING', 'SENSOR ERROR'].map(sev => (
            <button
              key={sev}
              onClick={() => setFilterSeverity(sev)}
              className={`px-3 py-1.5 rounded-xl border font-bold transition-all ${
                filterSeverity === sev
                  ? 'bg-violet-600 text-white border-violet-500 shadow-[0_0_10px_rgba(139,92,246,0.3)]'
                  : 'bg-obsidian-900 border-violet-500/20 text-violet-300 hover:bg-obsidian-700'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>

        <div className="text-violet-400/60">
          Showing <strong className="text-white">{filteredAlerts.length}</strong> of {alerts.length} Active Alerts
        </div>
      </div>

      {/* ALERTS LIST */}
      <div className="space-y-4">
        {filteredAlerts.length > 0 ? (
          filteredAlerts.map((alt) => {
            const isCritical = alt.severity === 'CRITICAL';
            const isWarning = alt.severity === 'WARNING';
            return (
              <div 
                key={alt.id}
                className={`p-5 rounded-3xl border shadow-[0_4px_20px_rgba(139,92,246,0.1)] flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${
                  isCritical 
                    ? 'bg-rose-950/40 border-rose-500/30 text-rose-100' 
                    : isWarning
                    ? 'bg-amber-950/40 border-amber-500/30 text-amber-100'
                    : 'bg-obsidian-800/80 border-violet-500/20 text-white'
                } backdrop-blur-md`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                    isCritical ? 'bg-rose-900/50 text-rose-400 border border-rose-500/30' : 'bg-amber-900/50 text-amber-400 border border-amber-500/30'
                  }`}>
                    {isCritical ? <ShieldAlert className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 font-mono text-xs">
                      <span className={`px-2.5 py-0.5 rounded-md font-bold text-[10px] ${
                        isCritical ? 'bg-rose-600 text-white shadow-[0_0_8px_rgba(244,63,94,0.4)]' : 'bg-amber-500 text-obsidian-950 shadow-[0_0_8px_rgba(251,191,36,0.4)]'
                      }`}>
                        {alt.severity}
                      </span>
                      <span className="text-violet-300/60 font-bold">{alt.timestamp}</span>
                      <span className="text-violet-500/40">•</span>
                      <span className="text-white font-bold">{alt.sensor}</span>
                    </div>

                    <h4 className="font-outfit font-extrabold text-base text-white mt-1">
                      {alt.parameter}: <span className="text-rose-400 font-mono drop-shadow-[0_0_5px_rgba(244,63,94,0.5)]">{alt.value}</span> (Threshold: {alt.threshold})
                    </h4>
                    <p className="text-xs text-violet-200/80 font-sans mt-0.5">
                      {alt.message}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 border-t md:border-t-0 pt-3 md:pt-0 border-violet-500/20 font-mono text-xs">
                  {alt.status === 'ACKNOWLEDGED' ? (
                    <span className="px-3.5 py-1.5 rounded-full bg-emerald-900/30 text-emerald-400 border border-emerald-500/30 font-bold flex items-center gap-1 shadow-[0_0_10px_rgba(52,211,153,0.1)]">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" /> ACKNOWLEDGED
                    </span>
                  ) : (
                    <button
                      onClick={() => onAcknowledge(alt.id)}
                      className="px-4 py-2 rounded-xl bg-obsidian-900 border border-violet-500/30 hover:bg-obsidian-800 text-white font-bold transition-all shadow-[0_0_10px_rgba(139,92,246,0.1)]"
                    >
                      Acknowledge
                    </button>
                  )}

                  <button
                    onClick={() => onClear(alt.id)}
                    className="p-2 rounded-xl bg-obsidian-900 hover:bg-rose-900/50 text-violet-300/70 hover:text-rose-400 border border-violet-500/30 hover:border-rose-500/30 transition-all shadow-[0_0_10px_rgba(139,92,246,0.1)]"
                    title="Delete Alert Log"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-12 text-center bg-obsidian-800/80 backdrop-blur-md border border-violet-500/20 rounded-3xl font-mono text-xs text-violet-300/70 space-y-2 shadow-[0_4px_20px_rgba(139,92,246,0.1)]">
            <CheckCircle2 className="w-9 h-9 text-emerald-400 mx-auto drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
            <div className="text-white font-bold text-base font-outfit drop-shadow-[0_0_5px_rgba(255,255,255,0.2)]">NO ACTIVE ALERTS</div>
            <div>All sensor modules operating safely within configured parameters.</div>
          </div>
        )}
      </div>

    </div>
  );
}

export default AlertsEventsPage;
