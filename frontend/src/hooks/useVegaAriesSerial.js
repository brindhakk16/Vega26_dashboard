/**
 * React Hook for VEGA ARIES v2.0 USB Serial Connection Management
 */

import { useState, useEffect, useCallback } from 'react';
import { vegaAriesSerialService } from '../services/vegaAriesSerialService.js';

export function useVegaAriesSerial() {
  const [statusState, setStatusState] = useState(() => vegaAriesSerialService.getStatus());

  useEffect(() => {
    const unsubscribe = vegaAriesSerialService.subscribe((newStatus) => {
      setStatusState({ ...newStatus });
    });

    return () => unsubscribe();
  }, []);

  const connect = useCallback(async (baud = null) => {
    return await vegaAriesSerialService.connect(baud);
  }, []);

  const disconnect = useCallback(async () => {
    return await vegaAriesSerialService.disconnect();
  }, []);

  const setBaudRate = useCallback((baud) => {
    vegaAriesSerialService.setBaudRate(baud);
  }, []);

  const sendCommand = useCallback(async (cmd) => {
    return await vegaAriesSerialService.sendCommand(cmd);
  }, []);

  return {
    ...statusState,
    connect,
    disconnect,
    setBaudRate,
    sendCommand
  };
}
