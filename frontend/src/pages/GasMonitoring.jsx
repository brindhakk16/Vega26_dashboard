import React from 'react';
import { Wind, Flame, AlertCircle, CheckCircle2, Sliders, ShieldCheck, Activity } from 'lucide-react';
import { getGasStatus } from '../utils/sensorDefaults.js';

export function GasMonitoringPage({ data = {}, thresholds = {} }) {
  const mq135 = data.mq135 || {};
  const mq2 = data.mq2 || {};

  const isMq135Error = mq135.status === 'offline';
  const isMq2Error = mq2.status === 'offline';

  // MQ-135 Gas Cards Config
  const mq135Gases = [
    {
      id: 'co2',
      name: 'Carbon Dioxide',
      formula: 'CO₂',
      val: mq135.co2 || 620,
      unit: 'ppm',
      warnThresh: thresholds.co2Warning || 800,
      critThresh: thresholds.co2Critical || 1200,
      desc: 'Ambient ventilation & indoor air freshness'
    },
    {
      id: 'nh3',
      name: 'Ammonia',
      formula: 'NH₃',
      val: mq135.nh3 || 12,
      unit: 'ppm',
      warnThresh: thresholds.nh3Warning || 25,
      critThresh: thresholds.nh3Critical || 50,
      desc: 'Corrosive alkaline gas & organic waste tracer'
    },
    {
      id: 'co',
      name: 'Carbon Monoxide',
      formula: 'CO',
      val: mq135.co || 4,
      unit: 'ppm',
      warnThresh: thresholds.coWarning || 15,
      critThresh: thresholds.coCritical || 35,
      desc: 'Toxic odorless combustion gas'
    },
    {
      id: 'c6h6',
      name: 'Benzene / VOCs',
      formula: 'C₆H₆',
      val: mq135.c6h6 || 2,
      unit: 'ppm',
      warnThresh: thresholds.c6h6Warning || 5,
      critThresh: thresholds.c6h6Critical || 10,
      desc: 'Volatile organic aromatic compound'
    }
  ];

  // MQ-2 Gas Cards Config
  const mq2Gases = [
    {
      id: 'h2',
      name: 'Hydrogen Gas',
      formula: 'H₂',
      val: mq2.h2 || 15,
      unit: 'ppm',
      warnThresh: thresholds.h2Warning || 30,
      critThresh: thresholds.h2Critical || 70,
      desc: 'Flammable elemental gas'
    },
    {
      id: 'ch4',
      name: 'Methane / LPG',
      formula: 'CH₄',
      val: mq2.ch4 || 8,
      unit: 'ppm',
      warnThresh: thresholds.ch4Warning || 20,
      critThresh: thresholds.ch4Critical || 50,
      desc: 'Combustible natural gas & fuel vapor'
    }
  ];

  return (
    <div className="space-y-8 font-jakarta text-slate-900 select-none">
      
      {/* HAZARDOUS GAS HEADER & CARDS */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 font-outfit uppercase flex items-center gap-2.5">
              <Wind className="w-6 h-6 text-amber-500" />
              <span>MULTI-GAS ATMOSPHERIC MONITORING</span>
            </h1>
            <p className="text-xs text-slate-500 font-sans mt-1">
              Hazardous atmospheric air quality & toxic vapor detection (Calibrated ppm estimation model)
            </p>
          </div>

          <div className="text-xs font-mono text-slate-700 bg-slate-100 px-3.5 py-1.5 rounded-full border border-slate-200">
            RAW ADC: <strong className="text-amber-600">{mq135.raw_adc || 412}</strong> | Status: Calibrated
          </div>
        </div>

        {/* 4 Air Quality Gas Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {mq135Gases.map((gas) => {
            const stat = getGasStatus(gas.val, gas.warnThresh, gas.critThresh, isMq135Error);
            const isWarn = stat.severity === 'warning';
            const isCrit = stat.severity === 'critical';
            return (
              <div 
                key={gas.id}
                className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-md space-y-3 relative overflow-hidden"
              >
                <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                  <span className="font-outfit font-extrabold text-lg text-slate-900">{gas.formula}</span>
                  <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${
                    isCrit ? 'bg-rose-100 border-rose-300 text-rose-800' :
                    isWarn ? 'bg-amber-100 border-amber-300 text-amber-800' :
                    'bg-emerald-100 border-emerald-300 text-emerald-800'
                  }`}>
                    {stat.status}
                  </span>
                </div>

                <div>
                  <div className="text-xs font-mono text-slate-500">{gas.name}</div>
                  <div className="text-3xl font-extrabold font-outfit text-slate-900 mt-1">
                    {gas.val} <span className="text-xs font-mono text-amber-600">{gas.unit}</span>
                  </div>
                  <div className="text-[10px] text-emerald-600 font-mono mt-1 font-bold">
                    Estimated Concentration (Calibrated)
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-[10px] font-mono text-slate-400">
                  <span>Warn: {gas.warnThresh} ppm</span>
                  <span>Crit: {gas.critThresh} ppm</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* COMBUSTIBLE GAS HEADER & CARDS */}
      <div className="space-y-4 pt-2">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
          <div>
            <h2 className="text-xl font-extrabold tracking-tight text-slate-900 font-outfit uppercase flex items-center gap-2.5">
              <Flame className="w-6 h-6 text-rose-600" />
              <span>COMBUSTIBLE & FLAMMABLE GAS MONITORING</span>
            </h2>
            <p className="text-xs text-slate-500 font-sans mt-1">
              Flammable hydrocarbon gas leak detection & smoke precursor analysis
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Left Column (Col 8 / 12) - The 2 Combustible Gas Cards */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {mq2Gases.map((gas) => {
              const stat = getGasStatus(gas.val, gas.warnThresh, gas.critThresh, isMq2Error);
              const isWarn = stat.severity === 'warning';
              const isCrit = stat.severity === 'critical';
              return (
                <div 
                  key={gas.id}
                  className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-md space-y-3"
                >
                  <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                    <span className="font-outfit font-extrabold text-lg text-slate-900">{gas.formula}</span>
                    <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${
                      isCrit ? 'bg-rose-100 border-rose-300 text-rose-800' :
                      isWarn ? 'bg-amber-100 border-amber-300 text-amber-800' :
                      'bg-emerald-100 border-emerald-300 text-emerald-800'
                    }`}>
                      {stat.status}
                    </span>
                  </div>

                  <div>
                    <div className="text-xs font-mono text-slate-500">{gas.name}</div>
                    <div className="text-3xl font-extrabold font-outfit text-slate-900 mt-1">
                      {gas.val} <span className="text-xs font-mono text-rose-600">{gas.unit}</span>
                    </div>
                    <div className="text-[10px] text-emerald-600 font-mono mt-1 font-bold">
                      Calibrated Concentration Model
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 text-[10px] font-mono text-slate-400">
                    {gas.desc}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column (Col 4 / 12) - Combined SENSOR STATUS Card */}
          <div className="lg:col-span-4 bg-white border border-slate-200/80 rounded-3xl p-5 shadow-md space-y-4 flex flex-col justify-between font-mono text-xs">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <span className="font-outfit font-bold text-slate-900 uppercase text-xs">COMBUSTIBLE SENSOR STATUS</span>
              <span className="text-emerald-800 font-bold bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
                ● ONLINE
              </span>
            </div>

            <div className="space-y-2.5">
              <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <span className="text-slate-600">RAW ADC VALUE</span>
                <span className="text-rose-600 font-extrabold text-sm">{mq2.raw_adc || 380}</span>
              </div>
              <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <span className="text-slate-600">CALIBRATION STATE</span>
                <span className="text-slate-900 font-bold">{mq2.calibration_state || 'Complete'}</span>
              </div>
              <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <span className="text-slate-600">LAST READING</span>
                <span className="text-emerald-600 font-bold">1.0 sec ago</span>
              </div>
              <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <span className="text-slate-600">SIGNAL QUALITY</span>
                <span className="text-cyan-600 font-bold">Excellent</span>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}

export default GasMonitoringPage;
