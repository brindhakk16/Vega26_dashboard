import React from 'react';
import { Sun, Bell, User, Settings, Radio } from 'lucide-react';

export function DashboardNav({
  activeTab = 'dashboard',
  onTabChange,
  connected = true,
  sensorId = 'SYS-NODE-01',
  onOpenSettings
}) {
  const navItems = [
    { id: 'dashboard', label: 'Overview' },
    { id: 'heartbeat', label: 'Heartbeat' },
    { id: 'airquality', label: 'Air Quality' },
    { id: 'babycamera', label: 'Baby Camera' }
  ];

  return (
    <nav className="w-full bg-[#0d1520] border-b border-white/15 px-6 py-4 flex items-center justify-between shadow-lg select-none text-white rounded-t-3xl">
      {/* Brand Logo & Title */}
      <div className="flex items-center gap-8">
        <div
          className="flex items-center gap-2.5 cursor-pointer group"
          onClick={() => onTabChange('dashboard')}
        >
          <div className="w-8 h-8 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shadow-md group-hover:border-[#D4FF00] transition-colors">
            <Sun className="w-4 h-4 text-[#D4FF00] animate-spin-slow" />
          </div>
          <span className="font-outfit text-lg font-bold tracking-tight text-white group-hover:text-[#D4FF00] transition-colors">
            VEGA <span className="text-xs font-mono font-normal opacity-60 text-white">/ Workstation</span>
          </span>
        </div>

        {/* Navigation Tabs */}
        <div className="hidden md:flex items-center gap-1 font-outfit text-xs font-semibold">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`px-4 py-1.5 rounded-full transition-all ${
                  isActive
                    ? 'bg-white text-slate-900 font-bold shadow-md'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Header Right Action Icons */}
      <div className="flex items-center gap-3 font-mono text-xs">
        {/* Sensor Status Indicator */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-[11px]">
          <Radio className={`w-3 h-3 ${connected ? 'text-[#D4FF00] animate-pulse' : 'text-rose-400'}`} />
          <span>{connected ? sensorId : 'DISCONNECTED'}</span>
        </div>

        {/* Notification Bell Icon */}
        <button
          title="Notifications"
          className="relative p-2 rounded-full bg-white/10 border border-white/20 text-white/80 hover:text-white hover:bg-white/20 transition-all"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#D4FF00]" />
        </button>

        {/* Profile Avatar Icon */}
        <button
          title="User Profile"
          className="p-2 rounded-full bg-white/10 border border-white/20 text-white/80 hover:text-white hover:bg-white/20 transition-all"
        >
          <User className="w-4 h-4" />
        </button>

        {/* Settings Icon */}
        <button
          onClick={() => onTabChange('settings')}
          title="Settings"
          className="p-2 rounded-full bg-white/10 border border-white/20 text-white/80 hover:text-white hover:bg-white/20 transition-all"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </nav>
  );
}

export default DashboardNav;
