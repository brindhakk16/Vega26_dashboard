import React from 'react';
import { LayoutDashboard, Wind, Camera, Settings } from 'lucide-react';

export function Sidebar({ activeTab = 'dashboard', onTabChange }) {
  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'airquality', label: 'Air Quality', icon: Wind },
    { id: 'babycamera', label: 'Baby Camera', icon: Camera },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-60 bg-[#0b1018] border-r border-white/15 p-4 select-none text-white font-jakarta">
        <div className="px-2 pb-3 mb-3 border-b border-white/10">
          <span className="font-outfit text-xs text-white/50 font-bold uppercase tracking-widest">
            Workspace Nav
          </span>
        </div>

        <nav className="flex-1 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-outfit text-sm transition-all ${
                  isActive
                    ? 'bg-white text-slate-950 font-bold shadow-lg'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-white/60'}`} />
                <span>{item.label}</span>
                {isActive && (
                  <span className="ml-auto w-2 h-2 rounded-full bg-[#D4FF00] shadow-[0_0_8px_#D4FF00]"></span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer info inside sidebar */}
        <div className="p-3.5 mt-auto bg-white/5 border border-white/10 rounded-2xl text-xs font-mono text-white/70">
          <div className="text-white font-bold">Thermal IR Matrix</div>
          <div className="text-[11px] text-white/50">8×8 Spatial Telemetry</div>
          <div className="text-[10px] text-[#D4FF00] mt-1 font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4FF00] animate-pulse" />
            <span>Active WebSocket</span>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0d1520]/95 backdrop-blur-xl border-t border-white/15 px-2 py-2 flex items-center justify-around select-none text-white">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex flex-col items-center py-1 px-2 rounded-xl font-outfit text-[11px] transition-all ${
                isActive ? 'text-[#D4FF00] font-bold' : 'text-white/60'
              }`}
            >
              <Icon className={`w-4 h-4 mb-0.5 ${isActive ? 'text-[#D4FF00]' : 'text-white/60'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
