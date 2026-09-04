import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine
} from 'recharts';
import { Activity } from 'lucide-react';
import { celsiusToFahrenheit } from '../../utils/thermalColor.js';

export function TemperatureChart({ history = [], unit = 'C', warningMax = 30, warningMin = 22 }) {
  const [timeWindow, setTimeWindow] = useState(30);

  const filteredHistory = history.slice(-timeWindow).map((item) => ({
    ...item,
    displayMin: unit === 'F' ? Number(celsiusToFahrenheit(item.min).toFixed(1)) : item.min,
    displayMax: unit === 'F' ? Number(celsiusToFahrenheit(item.max).toFixed(1)) : item.max,
    displayAvg: unit === 'F' ? Number(celsiusToFahrenheit(item.avg).toFixed(1)) : item.avg,
  }));

  const displayWarnMax = unit === 'F' ? celsiusToFahrenheit(warningMax) : warningMax;
  const displayWarnMin = unit === 'F' ? celsiusToFahrenheit(warningMin) : warningMin;

  return (
    <div className="bg-dark-panel border border-dark-border rounded-lg p-4 shadow-panel">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3 border-b border-dark-border pb-2">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-400" />
          <h3 className="font-mono text-xs font-bold text-gray-200 tracking-wider">
            ENVIRONMENT TEMPERATURE TREND (°{unit})
          </h3>
        </div>

        <div className="flex items-center gap-1 text-[11px] font-mono">
          <span className="text-gray-500 mr-1 font-bold">WINDOW:</span>
          {[10, 30, 60].map((count) => (
            <button
              key={count}
              onClick={() => setTimeWindow(count)}
              className={`px-2 py-0.5 rounded border transition-all ${
                timeWindow === count
                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                  : 'bg-dark-card border-dark-border text-gray-400 hover:text-white'
              }`}
            >
              {count === 10 ? '10s' : count === 30 ? '30s' : '1m'}
            </button>
          ))}
        </div>
      </div>

      <div className="h-56 w-full">
        {filteredHistory.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={filteredHistory} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#252A34" vertical={false} />
              <XAxis 
                dataKey="time" 
                stroke="#8D96A5" 
                fontSize={10} 
                tickLine={false}
                fontFamily="JetBrains Mono"
              />
              <YAxis 
                stroke="#8D96A5" 
                fontSize={10} 
                tickLine={false}
                domain={['auto', 'auto']}
                fontFamily="JetBrains Mono"
                unit={`°${unit}`}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#11141B', 
                  borderColor: '#252A34', 
                  borderRadius: '6px',
                  fontFamily: 'JetBrains Mono',
                  fontSize: '11px',
                  color: '#F4F7FA'
                }}
                formatter={(val) => [`${val}°${unit}`]}
              />
              <Legend 
                wrapperStyle={{ fontSize: '11px', fontFamily: 'JetBrains Mono', paddingTop: '8px' }} 
              />
              
              <ReferenceLine y={displayWarnMax} stroke="#f97316" strokeDasharray="4 4" label={{ value: 'Warn High', fill: '#f97316', fontSize: 9 }} />
              <ReferenceLine y={displayWarnMin} stroke="#06b6d4" strokeDasharray="4 4" label={{ value: 'Warn Low', fill: '#06b6d4', fontSize: 9 }} />

              <Line 
                type="monotone" 
                dataKey="displayAvg" 
                name="Avg Environment" 
                stroke="#10b981" 
                strokeWidth={2.5} 
                dot={false}
                isAnimationActive={false}
              />
              <Line 
                type="monotone" 
                dataKey="displayMax" 
                name="Warmest Zone" 
                stroke="#f97316" 
                strokeWidth={1.5} 
                dot={false}
                isAnimationActive={false}
              />
              <Line 
                type="monotone" 
                dataKey="displayMin" 
                name="Coolest Zone" 
                stroke="#06b6d4" 
                strokeWidth={1.5} 
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center font-mono text-xs text-gray-500">
            Waiting for live environmental telemetry stream data...
          </div>
        )}
      </div>
    </div>
  );
}
