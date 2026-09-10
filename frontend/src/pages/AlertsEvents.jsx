import React, { useState } from 'react';
import { Bell, AlertTriangle, ShieldAlert, CheckCircle2, Trash2, Filter } from 'lucide-react';

export function AlertsEventsPage({ alerts = [], onAcknowledge, onClear, onClearAll }) {
  const [filterSeverity, setFilterSeverity] = useState('ALL');

  const filteredAlerts = alerts.filter(a => filterSeverity === 'ALL' || a.severity === filterSeverity);

  return (
    <div className="p-4 md:p-8 space-y-6 font-jakarta text-slate-900 select-none">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 font-outfit uppercase flex items-center gap-2.5">
            <Bell className="w-7 h-7 text-rose-600" />
            <span>ALERTS & EVENTS SYSTEM</span>
          </h1>
          <p className="text-xs text-slate-500 font-sans mt-1">
            Real-time threshold breaches, environmental warnings & hardware diagnostic alerts
          </p>
        </div>

        <div className="flex items-center gap-2">
          {alerts.length > 0 && (
            <button
              onClick={onClearAll}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-sm"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>CLEAR ALL ALERTS</span>
            </button>
          )}
        </div>
      </div>

      {/* FILTER BAR & SUMMARY */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm text-xs font-mono">
        <div className="flex flex-wrap items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-slate-600 font-bold">FILTER SEVERITY:</span>
          {['ALL', 'CRITICAL', 'WARNING', 'SENSOR ERROR'].map(sev => (
            <button
              key={sev}
              onClick={() => setFilterSeverity(sev)}
              className={`px-3 py-1.5 rounded-xl border font-bold transition-all ${
                filterSeverity === sev
                  ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                  : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>

        <div className="text-slate-500">
          Showing <strong className="text-slate-900">{filteredAlerts.length}</strong> of {alerts.length} Active Alerts
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
                className={`p-5 rounded-3xl border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${
                  isCritical 
                    ? 'bg-rose-50 border-rose-200 text-rose-950' 
                    : isWarning
                    ? 'bg-amber-50 border-amber-200 text-amber-950'
                    : 'bg-white border-slate-200 text-slate-900'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                    isCritical ? 'bg-rose-200 text-rose-700 border border-rose-300' : 'bg-amber-200 text-amber-800 border border-amber-300'
                  }`}>
                    {isCritical ? <ShieldAlert className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 font-mono text-xs">
                      <span className={`px-2.5 py-0.5 rounded-md font-bold text-[10px] ${
                        isCritical ? 'bg-rose-600 text-white' : 'bg-amber-500 text-slate-950'
                      }`}>
                        {alt.severity}
                      </span>
                      <span className="text-slate-500 font-bold">{alt.timestamp}</span>
                      <span className="text-slate-400">•</span>
                      <span className="text-slate-900 font-bold">{alt.sensor}</span>
                    </div>

                    <h4 className="font-outfit font-extrabold text-base text-slate-900 mt-1">
                      {alt.parameter}: <span className="text-rose-600 font-mono">{alt.value}</span> (Threshold: {alt.threshold})
                    </h4>
                    <p className="text-xs text-slate-600 font-sans mt-0.5">
                      {alt.message}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 border-t md:border-t-0 pt-3 md:pt-0 border-slate-200/80 font-mono text-xs">
                  {alt.status === 'ACKNOWLEDGED' ? (
                    <span className="px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" /> ACKNOWLEDGED
                    </span>
                  ) : (
                    <button
                      onClick={() => onAcknowledge(alt.id)}
                      className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition-all shadow-sm"
                    >
                      Acknowledge
                    </button>
                  )}

                  <button
                    onClick={() => onClear(alt.id)}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-rose-100 text-slate-500 hover:text-rose-600 border border-slate-200 transition-all"
                    title="Delete Alert Log"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-12 text-center bg-white border border-slate-200/80 rounded-3xl font-mono text-xs text-slate-500 space-y-2 shadow-sm">
            <CheckCircle2 className="w-9 h-9 text-emerald-500 mx-auto" />
            <div className="text-slate-900 font-bold text-base font-outfit">NO ACTIVE ALERTS</div>
            <div>All sensor modules operating safely within configured parameters.</div>
          </div>
        )}
      </div>

    </div>
  );
}

export default AlertsEventsPage;
