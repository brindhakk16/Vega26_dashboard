import { useState, useEffect, useCallback } from 'react';
import { mockSensorGenerator } from '../services/mockSensorGenerator.js';

export function useSensorStream() {
  const [data, setData] = useState(() => mockSensorGenerator.getLatestPayload());
  const [isPaused, setIsPaused] = useState(false);
  const [demoMode, setDemoModeState] = useState(() => mockSensorGenerator.demoMode);
  const [scenario, setScenarioState] = useState(() => mockSensorGenerator.scenario);

  useEffect(() => {
    const unsubscribe = mockSensorGenerator.subscribe((newPayload) => {
      if (!isPaused) {
        setData(newPayload);
        setDemoModeState(newPayload.demoMode);
        setScenarioState(newPayload.scenario);
      }
    });

    return () => unsubscribe();
  }, [isPaused]);

  const togglePause = useCallback(() => {
    setIsPaused(prev => !prev);
  }, []);

  const setDemoMode = useCallback((enabled) => {
    mockSensorGenerator.setDemoMode(enabled);
    setDemoModeState(enabled);
  }, []);

  const setScenario = useCallback((scen) => {
    mockSensorGenerator.setScenario(scen);
    setScenarioState(scen);
  }, []);

  const acknowledgeAlert = useCallback((id) => {
    mockSensorGenerator.acknowledgeAlert(id);
  }, []);

  const clearAlert = useCallback((id) => {
    mockSensorGenerator.clearAlert(id);
  }, []);

  const clearAllAlerts = useCallback(() => {
    mockSensorGenerator.clearAllAlerts();
  }, []);

  const getHistory = useCallback((limit = 100) => {
    return mockSensorGenerator.getHistory(limit);
  }, []);

  return {
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
    thresholds: mockSensorGenerator.thresholds,
    updateThresholds: (t) => mockSensorGenerator.updateThresholds(t)
  };
}
