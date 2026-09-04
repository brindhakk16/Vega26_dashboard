import React from 'react';
import { LayoutDashboard, Eye, BarChart3, History, Cpu, Settings } from 'lucide-react';

export function Sidebar({ activeTab = 'dashboard', onTabChange }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'live', label: 'Live Thermal', icon: Eye },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'history', label: 'History', icon: History },
    { id: 'sensor', label: 'Sensor Specs', icon: Cpu },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Desktop Sidebar (lg:flex) */}
      <aside className="hidden lg:flex flex-col w-56 bg-dark-panel border-r border-dark-border py-4 px-2 select-none">
        <div className="px-3 pb-3 mb-2 border-b border-dark-border">
          <span className="font-mono text-[10px] text-gray-500 font-bold uppercase tracking-wider">
            Navigation
          </span>
        </div>

        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md font-mono text-xs transition-all ${
                  isActive
                    ? 'bg-thermal-orange/15 text-thermal-orange font-bold border border-thermal-orange/30 shadow-sm'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-dark-hover'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-thermal-orange' : 'text-gray-400'}`} />
                <span>{item.label}</span>
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-thermal-orange shadow-thermal-glow"></span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer info inside sidebar */}
        <div className="p-3 mt-auto bg-dark-card border border-dark-border rounded-md text-[10px] font-mono text-gray-500">
          <div>Grid-EYE AMG8833</div>
          <div className="text-gray-400 font-semibold">64 Pixel Array (8×8)</div>
          <div className="text-[9px] text-emerald-400/80 mt-1">WebSocket Active</div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar (lg:hidden) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-dark-panel border-t border-dark-border px-2 py-1.5 flex items-center justify-around select-none backdrop-blur-md">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex flex-col items-center py-1 px-2 rounded font-mono text-[10px] transition-all ${
                isActive ? 'text-thermal-orange font-bold' : 'text-gray-400'
              }`}
            >
              <Icon className={`w-4 h-4 mb-0.5 ${isActive ? 'text-thermal-orange' : 'text-gray-400'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
