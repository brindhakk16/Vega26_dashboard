import React from 'react';
import { Cpu, CheckCircle2, Clock, Zap, Activity } from 'lucide-react';

export function ProcessorDebugPanel({ processedFrame, status }) {
  if (!processedFrame) return null;

  const stages = processedFrame.pipelineStages || [
    { name: 'RAW SENSOR', timeMs: 0.3, status: 'ok' },
    { name: 'VALIDATION', timeMs: 0.1, status: 'ok' },
    { name: 'FILTER', timeMs: 0.2, status: 'ok' },
    { name: 'NORMALIZATION', timeMs: 0.1, status: 'ok' },
    { name: 'INTERPOLATION', timeMs: 0.7, status: 'ok' },
    { name: 'CALIBRATION', timeMs: 0.2, status: 'ok' },
    { name: 'PROJECTION', timeMs: 0.4, status: 'ok' }
  ];

  return (
    <div className="bg-dark-panel border border-dark-border rounded-lg p-4 shadow-panel font-mono text-xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-dark-border pb-2">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-thermal-orange" />
          <h3 className="font-bold text-gray-200 tracking-wider">
            MOCK EDGE PROCESSOR PIPELINE DEBUG
          </h3>
        </div>
        <span className="flex items-center gap-1 bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/40 text-[10px] font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          ● RUNNING
        </span>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px]">
        <div className="p-2.5 bg-dark-card border border-dark-border rounded">
          <div className="text-gray-400 text-[10px]">FRAME COUNTER</div>
          <div className="text-sm font-bold text-white">#{processedFrame.frameNumber || 1}</div>
        </div>

        <div className="p-2.5 bg-dark-card border border-dark-border rounded">
          <div className="text-gray-400 text-[10px]">PROCESSING LATENCY</div>
          <div className="text-sm font-bold text-thermal-cyan">{processedFrame.processingTimeMs || 3.8} ms</div>
        </div>

        <div className="p-2.5 bg-dark-card border border-dark-border rounded">
          <div className="text-gray-400 text-[10px]">RAW SENSOR RES</div>
          <div className="text-sm font-bold text-gray-200">8 × 8 (64 Thermopiles)</div>
        </div>

        <div className="p-2.5 bg-dark-card border border-dark-border rounded">
          <div className="text-gray-400 text-[10px]">DISPLAY GRID RES</div>
          <div className="text-sm font-bold text-thermal-orange">64 × 64 (4096 Samples)</div>
        </div>
      </div>

      {/* Processing Pipeline Stages */}
      <div>
        <div className="text-gray-400 text-[10px] uppercase font-bold mb-2 flex items-center gap-1">
          <Activity className="w-3 h-3 text-thermal-cyan" />
          <span>STAGE EXECUTION TIMINGS</span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
          {stages.map((stg, idx) => (
            <React.Fragment key={stg.name}>
              <div className="flex items-center gap-1 bg-dark-card border border-dark-border px-2 py-1 rounded">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span className="text-gray-300">{stg.name}</span>
                <span className="text-thermal-cyan font-bold">{stg.timeMs}ms</span>
              </div>
              {idx < stages.length - 1 && <span className="text-gray-600 font-bold">→</span>}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Resolution Disclaimer */}
      <div className="p-2 bg-dark-card border border-dark-border rounded text-[10px] text-gray-400">
        <strong className="text-gray-200">TECHNICAL NOTE:</strong> Physical sensor array resolution is strictly 8×8 (64 pixels).
        Display resolution of 64×64 is produced via 2D bilinear interpolation during spatial mapping for smooth visualization.
      </div>
    </div>
  );
}
