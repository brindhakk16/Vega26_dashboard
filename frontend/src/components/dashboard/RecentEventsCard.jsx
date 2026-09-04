import React from 'react';
import { History, ShieldCheck, AlertTriangle, AlertOctagon, ExternalLink } from 'lucide-react';

export function RecentEventsCard({ events = [], unit = 'C', onNavigateToHistory }) {
  const displayEvents = events.slice(0, 3);

  return (
    <div 
      onClick={onNavigateToHistory}
      className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm cursor-pointer group hover:border-emerald-500/50 hover:shadow-md transition-all font-mono text-xs"
    >
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-orange-600" />
          <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] group-hover:text-emerald-600 transition-colors flex items-center gap-1.5">
            <span>RECENT EVENTS</span>
            <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
          </span>
        </div>
        <span className="text-[10px] text-slate-500 font-semibold">View All →</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {displayEvents && displayEvents.length > 0 ? (
          displayEvents.map((evt) => {
            const isCritical = evt.type === 'critical';
            const isWarning = evt.type === 'warning';

            const timeStr = new Date(evt.timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit'
            });

            return (
              <div
                key={evt.id}
                className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/80"
              >
                <div className="flex-shrink-0">
                  {isCritical ? (
                    <AlertOctagon className="w-4 h-4 text-red-600" />
                  ) : isWarning ? (
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                  ) : (
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className={`font-bold text-[11px] truncate ${
                      isCritical ? 'text-red-700' : isWarning ? 'text-amber-700' : 'text-slate-800'
                    }`}>
                      {evt.title}
                    </span>
                    <span className="text-[10px] text-slate-500">{timeStr}</span>
                  </div>
                  <p className="text-[10px] text-slate-600 truncate mt-0.5">
                    {evt.message}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-3 text-center py-2 text-slate-500 text-[11px]">
            No recent alert events recorded. System nominal.
          </div>
        )}
      </div>
    </div>
  );
}
