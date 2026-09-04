import React from 'react';
import { DetailedThermalView } from '../components/thermal/DetailedThermalView.jsx';

export function LiveThermalPage({ frame, processedFrame, status, palette, unit }) {
  return (
    <DetailedThermalView
      frame={frame}
      processedFrame={processedFrame}
      status={status}
      palette={palette}
      unit={unit}
    />
  );
}
