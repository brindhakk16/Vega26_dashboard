import React, { useState, useEffect } from 'react';
import { useThermalStream } from './hooks/useThermalStream.js';
import { useThermalHistory } from './hooks/useThermalHistory.js';
import { TopBar } from './components/layout/TopBar.jsx';
import { Sidebar } from './components/layout/Sidebar.jsx';
import { DashboardPage } from './pages/Dashboard.jsx';
import { LiveThermalPage } from './pages/LiveThermal.jsx';
import { AnalyticsPage } from './pages/Analytics.jsx';
import { HistoryPage } from './pages/History.jsx';
import { SensorPage } from './pages/Sensor.jsx';
import { SettingsPage } from './pages/Settings.jsx';
import { PALETTES } from './utils/thermalColor.js';
import { CRADLE_SCENARIOS } from '../../shared/thermal.js';

export function App() {
  const { frame, processedFrame, status, environmentStatus, connected, reconnecting, setScenario, setFps, start, stop } = useThermalStream();
  const { history, clearHistory } = useThermalHistory(100);

  // Application State with localStorage persistence
  const [activeTab, setActiveTab] = useState('dashboard');
  const [scenario, setScenarioState] = useState(CRADLE_SCENARIOS.NORMAL_CRADLE);
  const [fps, setFpsState] = useState(3);
  const [palette, setPalette] = useState(() => localStorage.getItem('thermal_palette') || PALETTES.IRONBOW);
  const [mode, setMode] = useState(() => localStorage.getItem('thermal_mode') || 'smooth');
  const [showGrid, setShowGrid] = useState(() => localStorage.getItem('thermal_grid') !== 'false');
  const [showCradleOutline, setShowCradleOutline] = useState(() => localStorage.getItem('thermal_cradle_outline') !== 'false');
  const [autoRange, setAutoRange] = useState(() => localStorage.getItem('thermal_autorange') !== 'false');
  const [unit, setUnit] = useState(() => localStorage.getItem('thermal_unit') || 'C');
  const [warningThreshold, setWarningThreshold] = useState(() => Number(localStorage.getItem('thermal_warn_thresh')) || 30);
  const [criticalThreshold, setCriticalThreshold] = useState(() => Number(localStorage.getItem('thermal_crit_thresh')) || 32);

  // Sync state changes with localStorage
  useEffect(() => { localStorage.setItem('thermal_palette', palette); }, [palette]);
  useEffect(() => { localStorage.setItem('thermal_mode', mode); }, [mode]);
  useEffect(() => { localStorage.setItem('thermal_grid', showGrid.toString()); }, [showGrid]);
  useEffect(() => { localStorage.setItem('thermal_cradle_outline', showCradleOutline.toString()); }, [showCradleOutline]);
  useEffect(() => { localStorage.setItem('thermal_autorange', autoRange.toString()); }, [autoRange]);
  useEffect(() => { localStorage.setItem('thermal_unit', unit); }, [unit]);
  useEffect(() => { localStorage.setItem('thermal_warn_thresh', warningThreshold.toString()); }, [warningThreshold]);
  useEffect(() => { localStorage.setItem('thermal_crit_thresh', criticalThreshold.toString()); }, [criticalThreshold]);

  const handleScenarioChange = (newScenario) => {
    setScenarioState(newScenario);
    setScenario(newScenario);
  };

  const handleFpsChange = (newFps) => {
    setFpsState(newFps);
    setFps(newFps);
  };

  const handleToggleUnit = () => {
    setUnit((prev) => (prev === 'C' ? 'F' : 'C'));
  };

  const handleResetDefaults = () => {
    setPalette(PALETTES.IRONBOW);
    setMode('smooth');
    setShowGrid(true);
    setShowCradleOutline(true);
    setAutoRange(true);
    setUnit('C');
    setWarningThreshold(30);
    setCriticalThreshold(32);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#090B10] text-[#F4F7FA] selection:bg-emerald-500 selection:text-white">
      {/* Header Bar */}
      <TopBar
        connected={connected}
        reconnecting={reconnecting}
        sensorId={status.sensorId || 'AMG8833-001'}
        fps={status.refreshRate || fps}
        onOpenSettings={() => setActiveTab('settings')}
      />

      {/* Main Layout Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Navigation Sidebar (For non-dashboard routes) */}
        {activeTab !== 'dashboard' && (
          <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        )}

        {/* Dynamic Content Workspace Area */}
        <main className={`flex-1 overflow-y-auto ${activeTab === 'dashboard' ? 'p-0 bg-[#090B10]' : 'p-4 md:p-6 bg-[#090B10]'}`}>
          {activeTab === 'dashboard' && (
            <DashboardPage
              frame={frame}
              status={status}
              environmentStatus={environmentStatus}
              history={history}
              scenario={scenario}
              onScenarioChange={handleScenarioChange}
              fps={fps}
              onFpsChange={handleFpsChange}
              palette={palette}
              onPaletteChange={setPalette}
              mode={mode}
              onModeChange={setMode}
              showGrid={showGrid}
              onToggleGrid={() => setShowGrid(!showGrid)}
              showCradleOutline={showCradleOutline}
              onToggleCradleOutline={() => setShowCradleOutline(!showCradleOutline)}
              autoRange={autoRange}
              onToggleAutoRange={() => setAutoRange(!autoRange)}
              unit={unit}
              onToggleUnit={handleToggleUnit}
              warningThreshold={warningThreshold}
              criticalThreshold={criticalThreshold}
              onStart={start}
              onStop={stop}
              onReset={clearHistory}
              onNavigateTab={setActiveTab}
            />
          )}

          {activeTab === 'live' && (
            <LiveThermalPage
              frame={frame}
              processedFrame={processedFrame}
              status={status}
              palette={palette}
              unit={unit}
            />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsPage
              history={history}
              frame={frame}
              unit={unit}
            />
          )}

          {activeTab === 'history' && (
            <HistoryPage
              history={history}
              palette={palette}
              unit={unit}
            />
          )}

          {activeTab === 'sensor' && (
            <SensorPage status={status} />
          )}

          {activeTab === 'settings' && (
            <SettingsPage
              warningThreshold={warningThreshold}
              onWarningThresholdChange={setWarningThreshold}
              criticalThreshold={criticalThreshold}
              onCriticalThresholdChange={setCriticalThreshold}
              palette={palette}
              onPaletteChange={setPalette}
              mode={mode}
              onModeChange={setMode}
              unit={unit}
              onToggleUnit={handleToggleUnit}
              onResetDefaults={handleResetDefaults}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
