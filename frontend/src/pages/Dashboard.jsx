import React, { useState } from 'react';
import { DashboardNav } from '../components/dashboard/DashboardNav.jsx';
import { SilhouetteHeatmapVisualizer } from '../components/visualizers/SilhouetteHeatmapVisualizer.jsx';
import { CradleAgeStabilityCard } from '../components/dashboard/CradleAgeStabilityCard.jsx';
import { BloodOxygenCard } from '../components/dashboard/BloodOxygenCard.jsx';
import { InflammationCard } from '../components/dashboard/InflammationCard.jsx';
import { MeasurementsCard } from '../components/dashboard/MeasurementsCard.jsx';
import { SpatialMicroZonesCard } from '../components/dashboard/SpatialMicroZonesCard.jsx';
import { LiveStreamSnapshotCard } from '../components/dashboard/LiveStreamSnapshotCard.jsx';
import { SpatialZonesCard } from '../components/dashboard/SpatialZonesCard.jsx';
import { TemperatureChart } from '../components/charts/TemperatureChart.jsx';
import { RecentEventsCard } from '../components/dashboard/RecentEventsCard.jsx';
import { CRADLE_SCENARIOS } from '../../../shared/thermal.js';
import { Calendar, Clock, ChevronDown, Activity, SlidersHorizontal } from 'lucide-react';

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
  const [showDetailedAnalytics, setShowDetailedAnalytics] = useState(false);

  const temps = frame ? frame.temperatures : [];
  const minTemp = frame ? frame.minTemperature : 24.5;
  const maxTemp = frame ? frame.maxTemperature : 29.8;
  const avgTemp = frame ? frame.averageTemperature : 27.2;

  const events = environmentStatus ? environmentStatus.events : [];

  return (
    <div className="min-h-screen bg-[#07090e] p-2 md:p-6 text-white font-jakarta">
      {/* Sleek Curved Monitor Container (Matching Image 4 Workstation Frame) */}
      <div className="max-w-[1550px] mx-auto bg-[#0b1018] border border-white/20 rounded-[32px] shadow-2xl overflow-hidden backdrop-blur-3xl">
        
        {/* Top Header Bar */}
        <DashboardNav
          activeTab="dashboard"
          onTabChange={onNavigateTab}
          connected={status.connected}
          sensorId={status.sensorId || 'SYS-NODE-01'}
          onOpenSettings={() => onNavigateTab('settings')}
        />

        {/* Dashboard Main Workspace */}
        <div className="p-4 md:p-8 space-y-6">
          
          {/* Top Title & Quick Filters Toolbar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-5">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white font-outfit">
                Heart & Circulation Overview
              </h1>
              <p className="text-xs text-white/60 font-sans mt-1">
                Real-time non-invasive infrared spatial cradle diagnostics
              </p>
            </div>

            {/* Quick Filter Badges */}
            <div className="flex flex-wrap items-center gap-2.5 text-xs">
              {/* Date Selector Badge */}
              <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-white font-medium cursor-pointer hover:bg-white/15 transition-all">
                <Calendar className="w-3.5 h-3.5 text-[#D4FF00]" />
                <span>Today</span>
                <ChevronDown className="w-3 h-3 text-white/50" />
              </div>

              {/* Window Filter */}
              <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-white font-medium cursor-pointer hover:bg-white/15 transition-all">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span>Last 30 min</span>
                <ChevronDown className="w-3 h-3 text-white/50" />
              </div>

              {/* Scenario Selector */}
              <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-white font-semibold">
                <select
                  value={scenario}
                  onChange={(e) => onScenarioChange(e.target.value)}
                  className="bg-transparent text-white focus:outline-none cursor-pointer font-sans"
                >
                  <option value={CRADLE_SCENARIOS.NORMAL_CRADLE} className="bg-slate-900 text-white">Normal Cradle</option>
                  <option value={CRADLE_SCENARIOS.GRADUAL_WARMING} className="bg-slate-900 text-white">Gradual Warming</option>
                  <option value={CRADLE_SCENARIOS.GRADUAL_COOLING} className="bg-slate-900 text-white">Gradual Cooling</option>
                  <option value={CRADLE_SCENARIOS.LOCAL_WARM_REGION} className="bg-slate-900 text-white">Local Warm Region</option>
                  <option value={CRADLE_SCENARIOS.UNEVEN_ENVIRONMENT} className="bg-slate-900 text-white">Uneven Environment</option>
                  <option value={CRADLE_SCENARIOS.SUDDEN_TEMP_CHANGE} className="bg-slate-900 text-white">Sudden Temp Change</option>
                </select>
              </div>

              {/* °C / °F Unit Toggle */}
              <button
                onClick={onToggleUnit}
                className="px-3.5 py-1.5 rounded-full bg-[#D4FF00] text-slate-950 font-bold hover:bg-[#c2ed00] transition-all shadow-md"
              >
                °{unit}
              </button>

              {/* Toggle Detailed Breakdown Button */}
              <button
                onClick={() => setShowDetailedAnalytics(!showDetailedAnalytics)}
                className={`px-3.5 py-1.5 rounded-full border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  showDetailedAnalytics
                    ? 'bg-white text-slate-900 border-white'
                    : 'bg-white/10 text-white border-white/20 hover:bg-white/15'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>{showDetailedAnalytics ? 'Hide Detail Charts' : 'Show Detail Charts'}</span>
              </button>
            </div>
          </div>

          {/* MAIN 2-COLUMN DASHBOARD GRID (Matching Image 4 Layout!) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* LEFT HERO COLUMN (Col 5 / 12) - Silhouette & Vitals Panel */}
            <div className="lg:col-span-5 h-full">
              <SilhouetteHeatmapVisualizer
                temperatures={temps}
                minTemp={minTemp}
                maxTemp={maxTemp}
                avgTemp={avgTemp}
                unit={unit}
                scenario={scenario}
              />
            </div>

            {/* RIGHT COLUMN (Col 7 / 12) - 6 Mesh Cards Grid */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              
              {/* Card 1: Large Green Card (Spans 2 columns / left side of right grid) */}
              <div className="sm:col-span-2 lg:col-span-2">
                <CradleAgeStabilityCard
                  avgTemp={avgTemp}
                  minTemp={minTemp}
                  maxTemp={maxTemp}
                  unit={unit}
                />
              </div>

              {/* Card 2: Golden-Yellow Card (Blood Oxygen / Peak Temp - Image 1) */}
              <div className="sm:col-span-1 lg:col-span-1">
                <BloodOxygenCard
                  maxTemp={maxTemp}
                  unit={unit}
                />
              </div>

              {/* Card 3: Terracotta-Slate Card (Inflammation / Disparity - Image 2) */}
              <div className="sm:col-span-1 lg:col-span-1">
                <InflammationCard
                  minTemp={minTemp}
                  maxTemp={maxTemp}
                  unit={unit}
                />
              </div>

              {/* Card 4: Amber Card (+2000 Measurements - Image 3) */}
              <div className="sm:col-span-1 lg:col-span-1">
                <MeasurementsCard
                  frameCount={history.length * 20}
                />
              </div>

              {/* Card 5: Green-Yellow Card (16 Spatial Micro-Zones - Image 3) */}
              <div className="sm:col-span-1 lg:col-span-1">
                <SpatialMicroZonesCard
                  zoneCount={16}
                />
              </div>

              {/* Card 6: Live Stream Snapshot Card (Image 4) */}
              <div className="sm:col-span-2 lg:col-span-3">
                <LiveStreamSnapshotCard
                  temperatures={temps}
                  minTemp={minTemp}
                  maxTemp={maxTemp}
                  palette={palette}
                  mode={mode}
                  unit={unit}
                  onNavigateToLive={() => onNavigateTab('babycamera')}
                />
              </div>

            </div>
          </div>

          {/* COLLAPSIBLE DETAILED ANALYTICS SECTION */}
          {showDetailedAnalytics && (
            <div className="pt-6 border-t border-white/10 space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold font-outfit text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-[#D4FF00]" />
                  <span>Telemetry & Spatial Micro-Zone Analysis</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                <div className="md:col-span-6 bg-slate-900/60 border border-white/10 rounded-2xl p-5">
                  <TemperatureChart
                    history={history}
                    unit={unit}
                    warningMax={warningThreshold}
                    warningMin={22}
                  />
                </div>

                <div className="md:col-span-6 bg-slate-900/60 border border-white/10 rounded-2xl p-5">
                  <SpatialZonesCard
                    temperatures={temps}
                    minTemp={minTemp}
                    maxTemp={maxTemp}
                    palette={palette}
                    unit={unit}
                  />
                </div>

                <div className="md:col-span-12 bg-slate-900/60 border border-white/10 rounded-2xl p-5">
                  <RecentEventsCard
                    events={events}
                    unit={unit}
                    onNavigateToHistory={() => onNavigateTab('airquality')}
                  />
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
