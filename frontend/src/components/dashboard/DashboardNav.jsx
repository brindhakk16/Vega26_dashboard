import React from 'react';
import { HeartPulse, ShieldCheck, Settings } from 'lucide-react';

export function DashboardNav({ activeTab = 'overview', onTabChange, connected = true, sensorId = 'AMG8833-001', onOpenSettings }) {
  const navItems = [
    { id: 'dashboard', label: 'Overview' },
    { id: 'live', label: 'Live Thermal' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'history', label: 'History' }
  ];

  return (
    <nav className="w-full bg-white border-b border-slate-200 px-6 py-3.5 flex items-center justify-between shadow-sm select-none rounded-t-2xl">
      {/* Brand & Horizontal Nav Links */}
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => onTabChange('dashboard')}>
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shadow-xs">
            <HeartPulse className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="font-mono text-sm font-bold tracking-wider text-slate-900">
            CRADLESENSE
          </span>
        </div>

        {/* Horizontal Navigation Items */}
        <div className="hidden md:flex items-center gap-1 font-mono text-xs">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`px-3.5 py-1.5 rounded-lg font-medium transition-all ${
                  isActive
                    ? 'bg-emerald-500/10 text-emerald-700 font-bold border border-emerald-500/30 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Connection Status & Action Icons */}
      <div className="flex items-center gap-3 font-mono text-xs">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-semibold text-[11px]">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>● ONLINE</span>
        </div>

        <div className="hidden sm:flex items-center gap-1 px-3 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 text-[11px]">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>{sensorId}</span>
        </div>

        <div className="flex items-center gap-1 border-l border-slate-200 pl-2 text-slate-500">
          <button
            onClick={() => onTabChange('settings')}
            title="Settings"
            className="p-1.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition-all"
          >
            <Settings className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </nav>
  );
}
