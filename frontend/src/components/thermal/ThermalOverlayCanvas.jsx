import React, { useRef, useEffect, useCallback, useState } from 'react';
import { interpolateBilinear } from '../../utils/interpolation.js';
import { getRGBForNormalizedValue, PALETTES, formatTemp } from '../../utils/thermalColor.js';
import { getFovBoundingBox, projectSensorPixel } from '../../utils/thermalProjection.js';
import { Crosshair } from 'lucide-react';

export function ThermalOverlayCanvas({
  temperatures,
  minTemp = 20,
  maxTemp = 45,
  palette = PALETTES.IRONBOW,
  mode = 'smooth',
  opacity = 0.5, // 0.0 to 1.0 (Default 50%)
  calibration,
  containerWidth,
  containerHeight,
  showThermal = true,
  showGrid = true,
  showWarmest = true,
  showCoolest = true,
  showValues = false,
  unit = 'C',
  onPixelSelect
}) {
  const canvasRef = useRef(null);
  const [hoveredPixel, setHoveredPixel] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  let calcMin = Infinity;
  let calcMax = -Infinity;
  let warmestZone = { x: 4, y: 4, val: -Infinity };
  let coolestZone = { x: 0, y: 0, val: Infinity };

  if (temperatures && temperatures.length === 8) {
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const v = temperatures[r][c];
        if (v < calcMin) calcMin = v;
        if (v > calcMax) {
          calcMax = v;
          warmestZone = { x: c, y: r, val: v };
        }
        if (v < coolestZone.val) {
          coolestZone = { x: c, y: r, val: v };
        }
      }
    }
  }

  const range = Math.max(maxTemp - minTemp, 0.1);

  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !containerWidth || !containerHeight || !temperatures || temperatures.length !== 8) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = containerWidth;
    canvas.height = containerHeight;
    ctx.clearRect(0, 0, containerWidth, containerHeight);

    if (!calibration) return;

    const fov = getFovBoundingBox(calibration, containerWidth, containerHeight);

    // 1. Render Transparent Thermal Heatmap inside FOV
    if (showThermal && opacity > 0) {
      const interpolatedGrid = interpolateBilinear(temperatures, 64);
      const imgData = ctx.createImageData(64, 64);
      const data = imgData.data;
      const alphaVal = Math.round(opacity * 255);

      for (let r = 0; r < 64; r++) {
        for (let c = 0; c < 64; c++) {
          const idx = (r * 64 + c) * 4;
          const val = interpolatedGrid[r][c];
          const norm = Math.max(0, Math.min(1, (val - minTemp) / range));
          
          const [red, green, blue] = getRGBForNormalizedValue(norm, palette);

          data[idx] = red;
          data[idx + 1] = green;
          data[idx + 2] = blue;
          data[idx + 3] = alphaVal;
        }
      }

      const offscreen = document.createElement('canvas');
      offscreen.width = 64;
      offscreen.height = 64;
      const offCtx = offscreen.getContext('2d');
      if (offCtx) {
        offCtx.putImageData(imgData, 0, 0);
        ctx.imageSmoothingEnabled = mode === 'smooth';
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(offscreen, fov.x, fov.y, fov.width, fov.height);
      }
    }

    // 2. Render Sensor Grid Boundaries & Optional Cell Values
    if (showGrid) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);

      const cellW = fov.width / 8;
      const cellH = fov.height / 8;

      for (let r = 0; r <= 8; r++) {
        ctx.beginPath();
        ctx.moveTo(fov.x, fov.y + r * cellH);
        ctx.lineTo(fov.x + fov.width, fov.y + r * cellH);
        ctx.stroke();
      }

      for (let c = 0; c <= 8; c++) {
        ctx.beginPath();
        ctx.moveTo(fov.x + c * cellW, fov.y);
        ctx.lineTo(fov.x + c * cellW, fov.y + fov.height);
        ctx.stroke();
      }
      ctx.setLineDash([]);

      // Optional Temperature Values inside cells
      if (showValues) {
        ctx.font = '10px JetBrains Mono, monospace';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        for (let r = 0; r < 8; r++) {
          for (let c = 0; c < 8; c++) {
            const val = temperatures[r][c];
            const px = fov.x + (c + 0.5) * cellW;
            const py = fov.y + (r + 0.5) * cellH;
            ctx.fillText(`${val.toFixed(1)}°`, px, py);
          }
        }
      }
    }
  }, [temperatures, minTemp, maxTemp, range, palette, mode, opacity, calibration, containerWidth, containerHeight, showThermal, showGrid, showValues]);

  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  // Projected Warmest & Coolest Marker coordinates
  const warmestPos = projectSensorPixel(warmestZone.x, warmestZone.y, calibration, containerWidth, containerHeight);
  const coolestPos = projectSensorPixel(coolestZone.x, coolestZone.y, calibration, containerWidth, containerHeight);

  // Mouse hover pixel inspector
  const handleMouseMove = (e) => {
    if (!canvasRef.current || !calibration || !temperatures) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const fov = getFovBoundingBox(calibration, rect.width, rect.height);
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (x >= fov.x && x <= fov.x + fov.width && y >= fov.y && y <= fov.y + fov.height) {
      const normX = (x - fov.x) / fov.width;
      const normY = (y - fov.y) / fov.height;
      const gridX = Math.min(7, Math.max(0, Math.floor(normX * 8)));
      const gridY = Math.min(7, Math.max(0, Math.floor(normY * 8)));
      const val = temperatures[gridY] ? temperatures[gridY][gridX] : null;

      setMousePos({ x: e.clientX, y: e.clientY });
      setHoveredPixel({ x: gridX, y: gridY, val });
    } else {
      setHoveredPixel(null);
    }
  };

  return (
    <div 
      className="absolute inset-0 z-10"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setHoveredPixel(null)}
      onClick={() => hoveredPixel && onPixelSelect && onPixelSelect(hoveredPixel)}
    >
      <canvas ref={canvasRef} className="w-full h-full block cursor-crosshair" />

      {/* Projected Warmest Zone Marker */}
      {showWarmest && warmestZone.val > -Infinity && (
        <div 
          className="absolute pointer-events-none -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center"
          style={{ left: `${warmestPos.x}px`, top: `${warmestPos.y}px` }}
        >
          <div className="relative flex items-center justify-center">
            <span className="absolute w-7 h-7 rounded-full border-2 border-thermal-orange animate-ping-slow opacity-75"></span>
            <Crosshair className="w-5 h-5 text-thermal-orange hotspot-anim" />
          </div>
          <div className="bg-black/90 backdrop-blur-md px-1.5 py-0.5 rounded text-[10px] font-mono text-thermal-orange font-bold border border-thermal-orange/40 shadow-lg whitespace-nowrap">
            WARMEST {formatTemp(warmestZone.val, unit)}
          </div>
        </div>
      )}

      {/* Hover Pixel Inspection Tooltip */}
      {hoveredPixel && hoveredPixel.val !== null && (
        <div 
          className="pointer-events-none fixed z-50 bg-[#11141B]/95 text-white border border-thermal-cyan/60 rounded-md p-2 shadow-2xl backdrop-blur-md font-mono text-xs text-left"
          style={{ left: `${mousePos.x + 12}px`, top: `${mousePos.y + 12}px` }}
        >
          <div className="text-thermal-cyan font-bold text-[11px] mb-1">
            SPATIAL CELL (X:{hoveredPixel.x}, Y:{hoveredPixel.y})
          </div>
          <div className="text-thermal-orange font-bold text-sm">
            {formatTemp(hoveredPixel.val, unit)}
          </div>
        </div>
      )}
    </div>
  );
}
