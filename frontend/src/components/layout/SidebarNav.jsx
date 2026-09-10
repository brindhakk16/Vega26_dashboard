import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Flame, 
  UserCheck, 
  Wind, 
  Gauge, 
  LineChart, 
  Cpu, 
  SlidersHorizontal, 
  History, 
  Settings, 
  Menu, 
  X,
  Bell,
  ChevronLeft,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';

export function SidebarNav({ activeTab = 'dashboard', onTabChange, activeAlertCount = 0 }) {
  const [isOpen, setIsOpen] = useState(false); // Mobile drawer open
  const [isCollapsed, setIsCollapsed] = useState(false); // Desktop collapse toggle

  const navItems = [
    { id: 'dashboard', label: 'Dashboard Overview', shortLabel: 'Overview', icon: LayoutDashboard },
    { id: 'thermal', label: 'Thermal Monitoring', shortLabel: 'Thermal', icon: Flame },
    { id: 'human', label: 'Human Vital Monitoring', shortLabel: 'Human', icon: UserCheck },
    { id: 'gas', label: 'Gas Monitoring', shortLabel: 'Gases', icon: Wind },
    { id: 'airquality', label: 'Air Quality Overview', shortLabel: 'Air Quality', icon: Gauge },
    { id: 'trends', label: 'Live Sensor Trends', shortLabel: 'Trends', icon: LineChart },
    { id: 'alerts', label: 'Alerts & Events', shortLabel: 'Alerts', icon: Bell, badge: activeAlertCount > 0 ? activeAlertCount : null },
    { id: 'health', label: 'Sensor Health', shortLabel: 'Health', icon: Cpu },
    { id: 'calibration', label: 'Sensor Calibration', shortLabel: 'Calibration', icon: SlidersHorizontal },
    { id: 'historical', label: 'Historical Data & Timelog', shortLabel: 'Timelog', icon: History },
    { id: 'settings', label: 'Workstation Settings & USB', shortLabel: 'Settings', icon: Settings },
  ];

  const handleSelect = (id) => {
    onTabChange(id);
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Hamburger Toggle Bar */}
      <div className="lg:hidden bg-[#090B10] border-b border-white/10 px-4 py-2.5 flex justify-between items-center z-30 select-none">
        <span className="text-xs font-outfit font-bold uppercase text-white/70 tracking-wider">
          SYSTEM NAVIGATION
        </span>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all"
        >
          {isOpen ? <X className="w-5 h-5 text-rose-400" /> : <Menu className="w-5 h-5 text-[#D4FF00]" />}
        </button>
      </div>

      {/* Navigation Drawer Container */}
      <aside className={`
        fixed lg:relative top-16 lg:top-auto bottom-0 lg:bottom-auto left-0 z-30 lg:z-auto h-[calc(100vh-4.5rem)] lg:h-full bg-white/95 border border-slate-200/80 p-3.5 flex flex-col justify-between text-slate-900 font-jakarta transition-all duration-300 select-none rounded-[32px] shadow-lg
        ${isOpen ? 'translate-x-0 shadow-2xl w-72' : '-translate-x-full lg:translate-x-0'}
        ${isCollapsed ? 'lg:w-20' : 'lg:w-72'}
      `}>
        <div className="space-y-4">
          
          {/* Header Title & Collapse/Expand Toggle Button */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 px-1">
            {!isCollapsed && (
              <span className="font-outfit text-xs text-slate-400 font-bold uppercase tracking-widest truncate">
                WORKSPACE NAV
              </span>
            )}
            
            {/* Desktop Collapse Toggle Button */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
              className="hidden lg:flex p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-600 transition-all ml-auto"
            >
              {isCollapsed ? <PanelLeftOpen className="w-4 h-4 text-slate-900" /> : <PanelLeftClose className="w-4 h-4" />}
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <div key={item.id} className="relative group">
                  <button
                    onClick={() => handleSelect(item.id)}
                    className={`w-full flex items-center ${isCollapsed ? 'justify-center px-2' : 'justify-between px-3.5'} py-2.5 rounded-2xl font-outfit text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-slate-900 text-white font-bold shadow-md'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-[#D4FF00]' : 'text-slate-500'}`} />
                      {!isCollapsed && <span className="truncate">{item.label}</span>}
                    </div>

                    {isActive && (
                      <span className="w-2 h-2 rounded-full bg-[#D4FF00] shadow-[0_0_8px_#D4FF00]" />
                    )}

                    {!isCollapsed && !isActive && item.badge && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-500 text-white">
                        {item.badge}
                      </span>
                    )}
                  </button>

                  {/* Pop-Out Tooltip when Sidebar is Collapsed */}
                  {isCollapsed && (
                    <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 hidden group-hover:flex items-center z-50 pointer-events-none">
                      <div className="bg-slate-900 text-white text-xs font-outfit font-bold px-3 py-1.5 rounded-xl shadow-2xl whitespace-nowrap flex items-center gap-2">
                        <span>{item.label}</span>
                        {item.badge && (
                          <span className="px-1.5 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-mono">
                            {item.badge}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        {/* Footer Hardware Info Badge */}
        <div className={`p-3 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs font-mono text-slate-600 transition-all ${isCollapsed ? 'text-center' : 'space-y-1'}`}>
          <div className="text-slate-900 font-bold flex items-center justify-between">
            {!isCollapsed ? <span>VEGA ARIES HUB</span> : <span className="text-[10px] text-emerald-600">IOT</span>}
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse mx-auto lg:mx-0" />
          </div>
          {!isCollapsed && (
            <>
              <div className="text-[11px] text-slate-500">RISC-V USB UART</div>
              <div className="text-[10px] text-emerald-600 pt-1 border-t border-slate-200 font-semibold">
                Status: Live Telemetry
              </div>
            </>
          )}
        </div>
      </aside>

      {/* Overlay Backdrop for Mobile Drawer */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="lg:hidden fixed inset-0 z-30 bg-black/60 backdrop-blur-sm"
        />
      )}
    </>
  );
}

export default SidebarNav;
