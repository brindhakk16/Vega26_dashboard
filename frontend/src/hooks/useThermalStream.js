import { useState, useEffect } from 'react';
import { thermalService } from '../services/thermalService.js';
import { CRADLE_SCENARIOS } from '../../../shared/thermal.js';

export function useThermalStream() {
  const [frame, setFrame] = useState(null);
  const [processedFrame, setProcessedFrame] = useState(null);
  const [environmentStatus, setEnvironmentStatus] = useState(null);
  const [status, setStatus] = useState({
    connected: false,
    sensorId: 'SYS-NODE-01',
    refreshRate: 3,
    scenario: CRADLE_SCENARIOS.NORMAL_CRADLE,
    isRunning: true
  });

  useEffect(() => {
    thermalService.connect();

    const unsubscribeFrames = thermalService.subscribeFrames((newFrame) => {
      setFrame(newFrame);
    });

    const unsubscribeStatus = thermalService.subscribeStatus((newStatus) => {
      setStatus(newStatus);
    });

    // Subscribe to processed frame & environment status events
    const unsubscribeEvents = thermalService.subscribeEvents((event) => {
      if (event.type === 'processed_frame') {
        setProcessedFrame(event.data);
      } else if (event.type === 'environment_status') {
        setEnvironmentStatus(event.data);
      }
    });

    return () => {
      unsubscribeFrames();
      unsubscribeStatus();
      unsubscribeEvents();
    };
  }, []);

  return {
    frame,
    processedFrame,
    status,
    environmentStatus,
    connected: status.connected,
    setScenario: (scenario) => thermalService.setScenario(scenario),
    setFps: (fps) => thermalService.setFps(fps),
    start: () => thermalService.start(),
    stop: () => thermalService.stop()
  };
}
