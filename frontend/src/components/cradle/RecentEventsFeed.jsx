import React from 'react';
import { History, ShieldCheck, AlertTriangle, AlertOctagon, Info } from 'lucide-react';
import { formatTemp } from '../../utils/thermalColor.js';

export function RecentEventsFeed({ events = [], unit = 'C' }) {
  return (
    <div className="bg-dark-panel border border-dark-border rounded-lg p-4 shadow-panel">
      <div className="flex items-center gap-2 mb-3 border-b border-dark-border pb-2">
        <History className="w-4 h-4 text-thermal-orange" />
        <h3 className="font-mono text-xs font-bold text-gray-200 tracking-wider">
          RECENT ENVIRONMENTAL EVENTS
        </h3>
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
        {events && events.length > 0 ? (
          events.map((evt) => {
            const isCritical = evt.type === 'critical';
            const isWarning = evt.type === 'warning';
            const isNormal = evt.type === 'normal' || evt.type === 'info';

            const timeStr = new Date(evt.timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit'
            });

            return (
              <div
                key={evt.id}
                className="flex items-start gap-2.5 p-2 rounded bg-dark-card border border-dark-border text-xs font-mono"
              >
                <div className="mt-0.5">
                  {isCritical ? (
                    <AlertOctagon className="w-4 h-4 text-thermal-red" />
                  ) : isWarning ? (
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                  ) : (
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className={`font-bold ${
                      isCritical ? 'text-thermal-red' : isWarning ? 'text-amber-400' : 'text-gray-200'
                    }`}>
                      {evt.title}
                    </span>
                    <span className="text-[10px] text-gray-500">{timeStr}</span>
                  </div>

                  <p className="text-[11px] text-gray-400 mt-0.5 truncate">
                    {evt.message}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-6 text-xs font-mono text-gray-500">
            No environmental alert events recorded. System nominal.
          </div>
        )}
      </div>
    </div>
  );
}
