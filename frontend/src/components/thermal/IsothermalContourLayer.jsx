import React from 'react';
import { extractIsothermalContours } from '../../utils/contour.js';
import { getFovBoundingBox } from '../../utils/thermalProjection.js';
import { DEFAULT_BABY_POLYGON } from '../../utils/babyMask.js';

export function IsothermalContourLayer({
  grid,
  minTemp = 24,
  maxTemp = 32,
  interval = 1.0,
  opacity = 0.9,
  calibration,
  containerWidth,
  containerHeight,
  showLabels = true
}) {
  if (!grid || !calibration || !containerWidth || !containerHeight) return null;

  const fov = getFovBoundingBox(calibration, containerWidth, containerHeight);

  // Extract isothermal contours using Marching Squares
  const contours = extractIsothermalContours({
    grid,
    minTemp,
    maxTemp,
    interval,
    polygon: DEFAULT_BABY_POLYGON
  });

  return (
    <svg 
      className="absolute inset-0 pointer-events-none z-30 w-full h-full"
      style={{ opacity }}
    >
      {contours.map((contour) => {
        const pathData = contour.lines.map((line) => {
          const x1 = fov.x + line.p1.x * fov.width;
          const y1 = fov.y + line.p1.y * fov.height;
          const x2 = fov.x + line.p2.x * fov.width;
          const y2 = fov.y + line.p2.y * fov.height;
          return `M ${x1} ${y1} L ${x2} ${y2}`;
        }).join(' ');

        const strokeColor = contour.isMajor ? '#ffffff' : 'rgba(255, 255, 255, 0.7)';
        const strokeWidth = contour.isMajor ? 2.0 : 1.2;

        return (
          <g key={contour.level}>
            {/* Contour Lines */}
            <path
              d={pathData}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
            />

            {/* Contour Temperature Labels */}
            {showLabels && contour.labels.map((lbl, idx) => {
              const lx = fov.x + lbl.x * fov.width;
              const ly = fov.y + lbl.y * fov.height;
              return (
                <g key={idx}>
                  <rect
                    x={lx - 14}
                    y={ly - 7}
                    width={28}
                    height={14}
                    rx={3}
                    fill="#11141B"
                    fillOpacity="0.85"
                    stroke="#252A34"
                    strokeWidth="1"
                  />
                  <text
                    x={lx}
                    y={ly + 3}
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="9"
                    fontFamily="JetBrains Mono, monospace"
                    fontWeight="bold"
                  >
                    {lbl.text}
                  </text>
                </g>
              );
            })}
          </g>
        );
      })}
    </svg>
  );
}
