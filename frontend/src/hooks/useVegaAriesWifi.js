import { useState, useEffect, useCallback } from 'react';
import { vegaAriesWifiService } from '../services/vegaAriesWifiService.js';

export function useVegaAriesWifi() {
  const [statusState, setStatusState] = useState(() => vegaAriesWifiService.getStatus());

  useEffect(() => {
    const unsubscribe = vegaAriesWifiService.subscribe((newStatus) => {
      setStatusState({ ...newStatus });
    });

    return () => unsubscribe();
  }, []);

  const connectWifi = useCallback((url = null) => {
    vegaAriesWifiService.connect(url);
  }, []);

  const disconnectWifi = useCallback(() => {
    vegaAriesWifiService.disconnect();
  }, []);

  return {
    ...statusState,
    connectWifi,
    disconnectWifi
  };
}
