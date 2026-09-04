import React from 'react';
import { DashboardNav } from '../components/dashboard/DashboardNav.jsx';
import { EnvironmentSummaryCard } from '../components/dashboard/EnvironmentSummaryCard.jsx';
import { ThermalOverviewCard } from '../components/dashboard/ThermalOverviewCard.jsx';
import { EnvironmentalInsightCard } from '../components/dashboard/EnvironmentalInsightCard.jsx';
import { SpatialZonesCard } from '../components/dashboard/SpatialZonesCard.jsx';
import { RecentEventsCard } from '../components/dashboard/RecentEventsCard.jsx';
import { TemperatureChart } from '../components/charts/TemperatureChart.jsx';
import { CRADLE_SCENARIOS } from '../../../shared/thermal.js';
import { Calendar, Clock, ChevronDown } from 'lucide-react';

export function DashboardPage({
  frame,
  status,
  environmentStatus,
  history,
  scenario,
  onScenarioChange,
  fps,
  onFpsChange,
  palette,
  onPaletteChange,
  mode,
  onModeChange,
  showGrid,
  onToggleGrid,
  showCradleOutline,
  onToggleCradleOutline,
  autoRange,
  onToggleAutoRange,
  unit,
  onToggleUnit,
  warningThreshold,
  criticalThreshold,
  onStart,
  onStop,
  onReset,
  onNavigateTab
}) {
  const temps = frame ? frame.temperatures : [];
  const minTemp = frame ? frame.minTemperature : 24.5;
  const maxTemp = frame ? frame.maxTemperature : 29.8;
  const avgTemp = frame ? frame.averageTemperature : 27.2;

  const events = environmentStatus ? environmentStatus.events : [];

  return (
    <div className="min-h-screen bg-[#F4F6F9] p-2 md:p-4 text-slate-800">
      {/* Large Rounded Surface Container (White Zentra Shell Style) */}
      <div className="max-w-[1400px] mx-auto bg-white border border-slate-200/80 rounded-3xl shadow-xl overflow-hidden">
        
        {/* Top Horizontal Navigation Bar */}
        <DashboardNav
          activeTab="dashboard"
          onTabChange={onNavigateTab}
          connected={status.connected}
          sensorId={status.sensorId || 'AMG8833-001'}
          onOpenSettings={() => onNavigateTab('settings')}
        />

        {/* Dashboard Body Area */}
        <div className="p-4 md:p-6 space-y-6">
          
          {/* Header Title & Compact Controls Toolbar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 font-sans">
                Overview
              </h1>
              <p className="font-mono text-xs text-slate-500 mt-1">
                Real-time thermal environment around the cradle
              </p>
            </div>

            {/* Horizontal Controls Toolbar */}
            <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
              {/* Date Filter Badge */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 font-medium">
                <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                <span>Today</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </div>

              {/* Window Filter */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 font-medium">
                <Clock className="w-3.5 h-3.5 text-cyan-600" />
                <span>Last 30 min</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </div>

              {/* Scenario Selector */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-800 font-semibold">
                <select
                  value={scenario}
                  onChange={(e) => onScenarioChange(e.target.value)}
                  className="bg-transparent text-slate-800 focus:outline-none cursor-pointer"
                >
                  <option value={CRADLE_SCENARIOS.NORMAL_CRADLE}>Normal Cradle</option>
                  <option value={CRADLE_SCENARIOS.GRADUAL_WARMING}>Gradual Warming</option>
                  <option value={CRADLE_SCENARIOS.GRADUAL_COOLING}>Gradual Cooling</option>
                  <option value={CRADLE_SCENARIOS.LOCAL_WARM_REGION}>Local Warm Region</option>
                  <option value={CRADLE_SCENARIOS.UNEVEN_ENVIRONMENT}>Uneven Environment</option>
                  <option value={CRADLE_SCENARIOS.SUDDEN_TEMP_CHANGE}>Sudden Temp Change</option>
                </select>
              </div>

              {/* Display Unit Toggle */}
              <button
                onClick={onToggleUnit}
                className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold hover:bg-emerald-100 transition-all"
              >
                °{unit}
              </button>
            </div>
          </div>

          {/* Asymmetric 12-Column Dashboard Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
            
            {/* ROW 1: Thermal Overview Card (Col 8) + Environment Summary Card (Col 4) */}
            <div className="md:col-span-8">
              <ThermalOverviewCard
                temperatures={temps}
                minTemp={minTemp}
                maxTemp={maxTemp}
                palette={palette}
                mode={mode}
                showGrid={showGrid}
                showCradleOutline={showCradleOutline}
                unit={unit}
                onNavigateToLive={() => onNavigateTab('live')}
              />
            </div>

            <div className="md:col-span-4">
              <EnvironmentSummaryCard
                avgTemp={avgTemp}
                minTemp={minTemp}
                maxTemp={maxTemp}
                preferredMin={24.0}
                preferredMax={28.0}
                trend={0.2}
                unit={unit}
              />
            </div>

            {/* ROW 2: Trend Chart (Col 5) + Spatial Zones (Col 4) + Environmental Insight (Col 3) */}
            <div className="md:col-span-5">
              <TemperatureChart
                history={history}
                unit={unit}
                warningMax={warningThreshold}
                warningMin={22}
              />
            </div>

            <div className="md:col-span-4">
              <SpatialZonesCard
                temperatures={temps}
                minTemp={minTemp}
                maxTemp={maxTemp}
                palette={palette}
                unit={unit}
              />
            </div>

            <div className="md:col-span-3">
              <EnvironmentalInsightCard
                avgTemp={avgTemp}
                minTemp={minTemp}
                maxTemp={maxTemp}
                durationMinutes={18}
                unit={unit}
              />
            </div>

            {/* ROW 3: Recent Events Feed Card (Col 12) */}
            <div className="md:col-span-12">
              <RecentEventsCard
                events={events}
                unit={unit}
                onNavigateToHistory={() => onNavigateTab('history')}
              />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
