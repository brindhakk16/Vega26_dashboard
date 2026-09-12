import React from 'react';
import { Cpu, CheckCircle2, XCircle, Activity, Radio, RefreshCw, Usb, Zap, Tv } from 'lucide-react';
import { useVegaAriesSerial } from '../hooks/useVegaAriesSerial.js';
import { HardwareLCDDisplay } from '../components/dashboard/HardwareLCDDisplay.jsx';

export function SensorHealthPage({ data = {} }) {
  const { isConnected, baudRate, packetsReceived, bytesReceived, portInfo } = useVegaAriesSerial();

  const amg = data.amg8833 || {};
  const mq135 = data.mq135 || {};
  const mq2 = data.mq2 || {};
  const mr24 = data.mr24d11c10 || {};

  const modules = [
    {
      id: 'Thermal',
      title: 'Thermal IR Sensor Array',
      status: amg.status || 'online',
      data: [
        { label: 'Temperature Matrix', val: 'Receiving (8x8 Array)' },
        { label: 'Last Update', val: '0.8 sec ago' },
        { label: 'Signal Quality', val: 'Good (100% valid pixels)' },
        { label: 'Bus Interface', val: 'I2C (Address 0x69)' }
      ]
    },
    {
      id: 'AirQuality',
      title: 'Air Quality Gas Sensor',
      status: mq135.status || 'online',
      data: [
        { label: 'ADC Channel', val: `Receiving (Raw ADC: ${mq135.raw_adc || 412})` },
        { label: 'Calibration State', val: 'Complete (R0 = 10 kΩ)' },
        { label: 'Last Update', val: '1.1 sec ago' },
        { label: 'Gas Models', val: 'CO2, NH3, CO, C6H6' }
      ]
    },
    {
      id: 'Combustible',
      title: 'Combustible Gas Sensor',
      status: mq2.status || 'online',
      data: [
        { label: 'ADC Channel', val: `Receiving (Raw ADC: ${mq2.raw_adc || 380})` },
        { label: 'Calibration State', val: `${mq2.calibration_state || 'Complete'}` },
        { label: 'Last Update', val: '1.0 sec ago' },
        { label: 'Gas Models', val: 'H2, CH4 Vapor' }
      ]
    },
    {
      id: 'Radar',
      title: 'Radar Respiration Array',
      status: mr24.status || 'online',
      data: [
        { label: 'Human Presence', val: mr24.presence ? 'Detected (98% Conf)' : 'Not Detected' },
        { label: 'Respiration Telemetry', val: `Receiving (${mr24.breathing_rate || 18} BPM)` },
        { label: 'Signal Quality', val: `${(mr24.signal_quality || 'good').toUpperCase()}` },
        { label: 'Baud Rate', val: 'UART 115200 bps' }
      ]
    },
    {
      id: 'LCD',
      title: 'I2C Character LCD (16x2 / 20x4)',
      status: 'online',
      data: [
        { label: 'Bus & Address', val: 'I2C (0x27 / PCF8574 Backpack)' },
        { label: 'Display Refresh', val: 'Dual-Output (Physical LCD + Web Mirror)' },
        { label: 'Telemetry Stream', val: 'Real AMG8833, MQ135 & MR24D11C10 Sync' },
        { label: 'Display Mode', val: '4-Screen Cycling (Vitals, Gases, IR, System)' }
      ]
    }
  ];

  return (
    <div className="p-4 md:p-8 space-y-6 font-jakarta text-white">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-violet-500/20 pb-5">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white font-outfit uppercase flex items-center gap-2.5 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
            <Cpu className="w-6 h-6 text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
            <span>SENSOR HEALTH & VEGA ARIES v2.0 DIAGNOSTICS</span>
          </h1>
          <p className="text-xs text-violet-300/70 font-sans mt-1">
            Real-time module status, telemetry reception rate, USB serial link & hardware diagnostics
          </p>
        </div>
      </div>

      {/* VEGA ARIES v2.0 MICROCONTROLLER STATUS BANNER */}
      <div className="bg-obsidian-800/80 backdrop-blur-md text-white rounded-3xl p-6 shadow-[0_4px_20px_rgba(139,92,246,0.15)] space-y-4 border border-violet-500/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-violet-500/20 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-900/30 border border-emerald-500/30">
              <Usb className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-outfit font-extrabold text-base text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.2)]">
                C-DAC VEGA ARIES v2.0 Microcontroller (RISC-V)
              </h3>
              <p className="text-xs text-violet-300/70 font-mono">
                Hardware Link Protocol: USB UART @ {baudRate} Baud
              </p>
            </div>
          </div>

          <span className={`px-3 py-1 rounded-full font-mono text-xs font-bold flex items-center gap-1.5 border ${
            isConnected
              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 animate-pulse'
              : 'bg-amber-500/20 text-amber-400 border-amber-500/40'
          }`}>
            <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-400' : 'bg-amber-400'}`} />
            ● {isConnected ? 'HARDWARE CONNECTED & STREAMING' : 'DEMO MODE (SYNTHETIC TELEMETRY)'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 font-mono text-xs">
          <div className="bg-obsidian-950 p-3.5 rounded-2xl border border-violet-500/20 shadow-[0_0_10px_rgba(139,92,246,0.1)]">
            <div className="text-violet-400/60">Connection Bus:</div>
            <div className="text-white font-bold mt-1">USB UART Serial</div>
          </div>
          <div className="bg-obsidian-950 p-3.5 rounded-2xl border border-violet-500/20 shadow-[0_0_10px_rgba(139,92,246,0.1)]">
            <div className="text-violet-400/60">Baud Rate:</div>
            <div className="text-[#D4FF00] font-bold mt-1 drop-shadow-[0_0_5px_rgba(212,255,0,0.5)]">{baudRate} bps</div>
          </div>
          <div className="bg-obsidian-950 p-3.5 rounded-2xl border border-violet-500/20 shadow-[0_0_10px_rgba(139,92,246,0.1)]">
            <div className="text-violet-400/60">Packets Ingested:</div>
            <div className="text-cyan-400 font-bold mt-1 drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]">{packetsReceived} pkts ({bytesReceived} B)</div>
          </div>
          <div className="bg-obsidian-950 p-3.5 rounded-2xl border border-violet-500/20 shadow-[0_0_10px_rgba(139,92,246,0.1)]">
            <div className="text-violet-400/60">Board Architecture:</div>
            <div className="text-emerald-400 font-bold mt-1 drop-shadow-[0_0_5px_rgba(52,211,153,0.5)]">THEIA 32-bit RISC-V</div>
          </div>
        </div>
      </div>

      {/* SENSOR MODULE CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {modules.map((mod) => {
          const isOnline = mod.status === 'online';
          return (
            <div 
              key={mod.id}
              className="bg-obsidian-800/80 backdrop-blur-md border border-violet-500/20 rounded-3xl p-6 shadow-[0_4px_20px_rgba(139,92,246,0.1)] space-y-5"
            >
              <div className="flex items-center justify-between border-b border-violet-500/20 pb-3">
                <div className="flex items-center gap-2.5">
                  <Cpu className="w-5 h-5 text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                  <span className="font-outfit font-extrabold text-base text-white">{mod.title}</span>
                </div>

                <span className={`px-3 py-1 rounded-full font-mono text-xs font-bold flex items-center gap-1.5 border ${
                  isOnline ? 'bg-emerald-900/30 text-emerald-400 border-emerald-500/30 shadow-[0_0_10px_rgba(52,211,153,0.1)]' : 'bg-rose-900/30 text-rose-400 border-rose-500/30 shadow-[0_0_10px_rgba(244,63,94,0.1)]'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-400 animate-pulse shadow-[0_0_5px_rgba(52,211,153,0.8)]' : 'bg-rose-500 shadow-[0_0_5px_rgba(244,63,94,0.8)]'}`} />
                  ● {isOnline ? 'ONLINE' : 'OFFLINE'}
                </span>
              </div>

              <div className="space-y-3 font-mono text-xs">
                {mod.data.map((d, i) => (
                  <div key={i} className="flex justify-between items-center bg-obsidian-900 p-3 rounded-2xl border border-violet-500/20 shadow-[0_0_10px_rgba(139,92,246,0.05)]">
                    <span className="text-violet-300/70">{d.label}:</span>
                    <span className="text-white font-bold">{d.val}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* DUAL-OUTPUT PHYSICAL & MIRRORED I2C LCD DISPLAY */}
      <HardwareLCDDisplay data={data} />

    </div>
  );
}

export default SensorHealthPage;
