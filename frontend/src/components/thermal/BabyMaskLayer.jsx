import React from 'react';
import { getFovBoundingBox } from '../../utils/thermalProjection.js';
import { DEFAULT_BABY_POLYGON } from '../../utils/babyMask.js';

export function BabyMaskLayer({ calibration, containerWidth, containerHeight, showBoundary = true }) {
  if (!calibration || !containerWidth || !containerHeight) return null;

  const fov = getFovBoundingBox(calibration, containerWidth, containerHeight);

  // Map normalized baby polygon coordinates to FOV pixel coordinates
  const polygonPoints = DEFAULT_BABY_POLYGON.map((p) => {
    const px = fov.x + p.x * fov.width;
    const py = fov.y + p.y * fov.height;
    return `${px},${py}`;
  }).join(' ');

  return (
    <svg className="absolute inset-0 pointer-events-none z-25 w-full h-full">
      {showBoundary && (
        <polygon
          points={polygonPoints}
          fill="rgba(6, 182, 212, 0.12)"
          stroke="#06b6d4"
          strokeWidth="2"
          strokeDasharray="6 4"
          className="drop-shadow-[0_0_8px_rgba(6,182,212,0.4)]"
        />
      )}
    </svg>
  );
}
