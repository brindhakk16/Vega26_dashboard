import React from 'react';
import { getFovBoundingBox, projectSensorPixel } from '../../utils/thermalProjection.js';
import { Target, Move, RotateCw } from 'lucide-react';

export function CalibrationOverlay({
  calibration,
  containerWidth,
  containerHeight,
  onCalibrationChange,
  showLabels = true
}) {
  if (!containerWidth || !containerHeight || !calibration) return null;

  const fov = getFovBoundingBox(calibration, containerWidth, containerHeight);

  // Calculate 4 corners of the 8x8 sensor matrix
  const topLeft = projectSensorPixel(0, 0, calibration, containerWidth, containerHeight);
  const topRight = projectSensorPixel(7, 0, calibration, containerWidth, containerHeight);
  const bottomLeft = projectSensorPixel(0, 7, calibration, containerWidth, containerHeight);
  const bottomRight = projectSensorPixel(7, 7, calibration, containerWidth, containerHeight);

  return (
    <div className="absolute inset-0 pointer-events-none z-20 font-mono text-[10px] select-none">
      {/* FOV Bounding Box */}
      <div
        className="absolute border-2 border-thermal-cyan/80 bg-thermal-cyan/5 rounded shadow-cyan-glow transition-all"
        style={{
          left: `${fov.x}px`,
          top: `${fov.y}px`,
          width: `${fov.width}px`,
          height: `${fov.height}px`
        }}
      >
        {/* FOV Header Label */}
        <div className="absolute -top-6 left-0 bg-thermal-cyan text-black px-2 py-0.5 rounded font-bold flex items-center gap-1 shadow">
          <Target className="w-3 h-3" />
          <span>AMG8833 SENSOR FOV BOUNDS</span>
        </div>

        {/* X / Y Direction Axes */}
        <div className="absolute top-2 left-2 text-thermal-cyan font-bold flex items-center gap-1">
          <span>X →</span>
          <span>Y ↓</span>
        </div>

        {/* Rotation & Offset Controls (Pointer Events Enabled) */}
        {onCalibrationChange && (
          <div className="absolute bottom-2 right-2 pointer-events-auto flex items-center gap-1.5 bg-black/85 backdrop-blur-md p-1.5 rounded border border-dark-border">
            <button
              onClick={() => {
                const nextRot = ((calibration.sensorRotation || 0) + 90) % 360;
                onCalibrationChange({ sensorRotation: nextRot });
              }}
              className="flex items-center gap-1 bg-dark-card border border-dark-border px-2 py-1 rounded text-white hover:border-thermal-cyan"
            >
              <RotateCw className="w-3 h-3 text-thermal-cyan" />
              <span>{calibration.sensorRotation || 0}°</span>
            </button>
          </div>
        )}
      </div>

      {/* Sensor Origin Marker (0,0) */}
      <div
        className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center gap-1 bg-black/90 text-thermal-cyan border border-thermal-cyan px-1.5 py-0.5 rounded font-bold shadow"
        style={{ left: `${topLeft.x}px`, top: `${topLeft.y}px` }}
      >
        <span>(0,0) ORIGIN</span>
      </div>
    </div>
  );
}
