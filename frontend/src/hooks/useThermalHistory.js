import { useState, useEffect } from 'react';
import { thermalService } from '../services/thermalService.js';

export function useThermalHistory(maxPoints = 60) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const unsubscribe = thermalService.subscribeFrames((frame) => {
      if (!frame) return;

      const timeLabel = new Date(frame.timestamp).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });

      const dataPoint = {
        timestamp: frame.timestamp,
        time: timeLabel,
        min: frame.minTemperature,
        max: frame.maxTemperature,
        avg: frame.averageTemperature,
        hotspotX: frame.hotspot ? frame.hotspot.x : 0,
        hotspotY: frame.hotspot ? frame.hotspot.y : 0,
      };

      setHistory((prev) => {
        const next = [...prev, dataPoint];
        if (next.length > maxPoints) {
          return next.slice(next.length - maxPoints);
        }
        return next;
      });
    });

    return () => unsubscribe();
  }, [maxPoints]);

  return { history, clearHistory: () => setHistory([]) };
}
