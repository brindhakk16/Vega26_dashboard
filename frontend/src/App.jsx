import React, { useState } from 'react';
import { useSensorStream } from './hooks/useSensorStream.js';
import { HeaderNav } from './components/layout/HeaderNav.jsx';
import { SidebarNav } from './components/layout/SidebarNav.jsx';

import { DashboardOverviewPage } from './pages/DashboardOverview.jsx';
import { ThermalMonitoringPage } from './pages/ThermalMonitoring.jsx';
import { HumanMonitoringPage } from './pages/HumanMonitoring.jsx';
import { GasMonitoringPage } from './pages/GasMonitoring.jsx';
import { AirQualityOverviewPage } from './pages/AirQualityOverview.jsx';
import { LiveTrendsPage } from './pages/LiveTrends.jsx';
import { AlertsEventsPage } from './pages/AlertsEvents.jsx';
import { SensorHealthPage } from './pages/SensorHealth.jsx';
import { SensorCalibrationPage } from './pages/SensorCalibration.jsx';
import { HistoricalTimelogPage } from './pages/HistoricalTimelog.jsx';
import { SettingsPage } from './pages/Settings.jsx';
import { LoginPage } from './pages/LoginPage.jsx';
import { AIChatbot } from './components/chat/AIChatbot.jsx';

export function App() {
  const {
    data,
    isPaused,
    togglePause,
    demoMode,
    setDemoMode,
    scenario,
    setScenario,
    acknowledgeAlert,
    clearAlert,
    clearAllAlerts,
    getHistory,
    thresholds,
    updateThresholds
  } = useSensorStream();

  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [warningThreshold, setWarningThreshold] = useState(30);
  const [criticalThreshold, setCriticalThreshold] = useState(35);
  const [palette, setPalette] = useState('ironbow');
  const [mode, setMode] = useState('smooth');
  const [unit, setUnit] = useState('C');

  const history = getHistory(500);
  const activeAlerts = (data.alerts || []).filter(a => a.status === 'ACTIVE');

  // If user is not authenticated, render Login/Sign In Screen (Doctor & Patient Login)
  if (!currentUser) {
    return <LoginPage onLogin={setCurrentUser} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#080312] text-slate-100 selection:bg-violet-600 selection:text-white font-jakarta">
      
      {/* Header Toolbar */}
      <HeaderNav
        data={data}
        isPaused={isPaused}
        onTogglePause={togglePause}
        demoMode={demoMode}
        onToggleDemoMode={setDemoMode}
        scenario={scenario}
        onSelectScenario={setScenario}
        activeAlertCount={activeAlerts.length}
        onOpenAlerts={() => setActiveTab('alerts')}
        user={currentUser}
        onLogout={() => setCurrentUser(null)}
      />

      {/* Main Body Layout with Responsive Navigation Sidebar */}
      <div className="flex-1 flex overflow-hidden p-3 sm:p-5 gap-4">
        
        {/* Navigation Sidebar */}
        <SidebarNav
          activeTab={activeTab}
          onTabChange={setActiveTab}
          activeAlertCount={activeAlerts.length}
        />

        {/* Dynamic Workspace Container */}
        <main className="flex-1 overflow-y-auto bg-[#0d061c]/90 border border-violet-900/40 rounded-[32px] shadow-2xl p-4 md:p-8 backdrop-blur-xl">
          
          {activeTab === 'dashboard' && (
            <DashboardOverviewPage
              data={data}
              thresholds={thresholds}
              onNavigate={setActiveTab}
            />
          )}

          {activeTab === 'thermal' && (
            <ThermalMonitoringPage
              data={data}
              history={history}
              thresholds={thresholds}
            />
          )}

          {activeTab === 'human' && (
            <HumanMonitoringPage
              data={data}
              history={history}
              thresholds={thresholds}
            />
          )}

          {activeTab === 'gas' && (
            <GasMonitoringPage
              data={data}
              thresholds={thresholds}
            />
          )}

          {activeTab === 'airquality' && (
            <AirQualityOverviewPage
              data={data}
              thresholds={thresholds}
            />
          )}

          {activeTab === 'trends' && (
            <LiveTrendsPage
              history={history}
              isPaused={isPaused}
              onTogglePause={togglePause}
            />
          )}

          {activeTab === 'alerts' && (
            <AlertsEventsPage
              alerts={data.alerts || []}
              onAcknowledge={acknowledgeAlert}
              onClear={clearAlert}
              onClearAll={clearAllAlerts}
            />
          )}

          {activeTab === 'health' && (
            <SensorHealthPage
              data={data}
            />
          )}

          {activeTab === 'calibration' && (
            <SensorCalibrationPage
              thresholds={thresholds}
              onUpdateThresholds={updateThresholds}
            />
          )}

          {activeTab === 'historical' && (
            <HistoricalTimelogPage
              history={history}
              alerts={data.alerts || []}
            />
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
              onToggleUnit={() => setUnit(unit === 'C' ? 'F' : 'C')}
              onResetDefaults={() => {
                setWarningThreshold(30);
                setCriticalThreshold(35);
                setPalette('ironbow');
                setMode('smooth');
                setUnit('C');
              }}
              onNavigateTab={setActiveTab}
            />
          )}

        </main>
      </div>

      {/* AI Chatbot Assistant - Bottom Right Corner */}
      <AIChatbot
        data={data}
        thresholds={thresholds}
        currentUser={currentUser}
        onNavigate={setActiveTab}
      />

    </div>
  );
}

export default App;
