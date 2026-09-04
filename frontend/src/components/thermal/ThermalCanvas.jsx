import React, { useRef, useEffect, useState, useCallback } from 'react';
import { interpolateBilinear, generateContourLines } from '../../utils/interpolation.js';
import { getRGBForNormalizedValue, PALETTES, formatTemp } from '../../utils/thermalColor.js';
import { Crosshair } from 'lucide-react';

export function ThermalCanvas({
  temperatures,
  minTemp = 20,
  maxTemp = 45,
  palette = PALETTES.IRONBOW,
  mode = 'smooth', // 'pixel', 'smooth', 'contour', 'infrared'
  showGrid = true,
  showHotspot = true,
  showCradleOutline = true,
  autoRange = true,
  unit = 'C',
  width = 512,
  height = 512,
  onPixelSelect
}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [hoveredPixel, setHoveredPixel] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Calculate actual frame statistics
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

  const effectiveMin = autoRange ? calcMin : minTemp;
  const effectiveMax = autoRange ? calcMax : maxTemp;
  const range = Math.max(effectiveMax - effectiveMin, 0.1);

  // High resolution offscreen Canvas thermal rendering engine
  const renderThermalFrame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !temperatures || temperatures.length !== 8) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = width;
    canvas.height = height;

    const renderPalette = mode === 'infrared' ? PALETTES.FLIR : palette;

    if (mode === 'pixel') {
      const cellW = width / 8;
      const cellH = height / 8;

      for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
          const val = temperatures[r][c];
          const norm = (val - effectiveMin) / range;
          const [red, green, blue] = getRGBForNormalizedValue(norm, renderPalette);

          ctx.fillStyle = `rgb(${red}, ${green}, ${blue})`;
          ctx.fillRect(c * cellW, r * cellH, cellW, cellH);
        }
      }
    } else {
      const interpolatedGrid = interpolateBilinear(temperatures, 64);
      const imgData = ctx.createImageData(64, 64);
      const data = imgData.data;

      const contourMask = mode === 'contour' ? generateContourLines(interpolatedGrid, 2.0) : null;

      for (let r = 0; r < 64; r++) {
        for (let c = 0; c < 64; c++) {
          const idx = (r * 64 + c) * 4;
          const val = interpolatedGrid[r][c];
          const norm = (val - effectiveMin) / range;
          
          let [red, green, blue] = getRGBForNormalizedValue(norm, renderPalette);

          if (mode === 'contour' && contourMask && contourMask[r][c] === 1) {
            red = 255;
            green = 255;
            blue = 255;
          }

          data[idx] = red;
          data[idx + 1] = green;
          data[idx + 2] = blue;
          data[idx + 3] = 255;
        }
      }

      const offscreen = document.createElement('canvas');
      offscreen.width = 64;
      offscreen.height = 64;
      const offCtx = offscreen.getContext('2d');
      if (offCtx) {
        offCtx.putImageData(imgData, 0, 0);
        ctx.imageSmoothingEnabled = mode === 'smooth' || mode === 'infrared';
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(offscreen, 0, 0, width, height);
      }
    }

    // Optional Cradle Boundary Outline
    if (showCradleOutline) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 6]);
      const pad = width * 0.15;
      const cradleW = width * 0.7;
      const cradleH = height * 0.7;
      
      // Draw rounded rectangle representing cradle boundary
      ctx.beginPath();
      ctx.roundRect(pad, pad, cradleW, cradleH, 16);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Grid overlay
    if (showGrid) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = 1;
      const cellW = width / 8;
      const cellH = height / 8;

      for (let i = 1; i < 8; i++) {
        ctx.beginPath();
        ctx.moveTo(i * cellW, 0);
        ctx.lineTo(i * cellW, height);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, i * cellH);
        ctx.lineTo(width, i * cellH);
        ctx.stroke();
      }
    }
  }, [temperatures, effectiveMin, effectiveMax, range, palette, mode, showGrid, showCradleOutline, width, height]);

  useEffect(() => {
    renderThermalFrame();
  }, [renderThermalFrame]);

  // Handle mouse / touch events for pixel inspection
  const handleMouseMove = (e) => {
    if (!containerRef.current || !temperatures) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const gridX = Math.min(7, Math.max(0, Math.floor((x / rect.width) * 8)));
    const gridY = Math.min(7, Math.max(0, Math.floor((y / rect.height) * 8)));

    const tempVal = temperatures[gridY] ? temperatures[gridY][gridX] : null;

    setMousePos({ x: e.clientX, y: e.clientY });
    setHoveredPixel({ x: gridX, y: gridY, val: tempVal });
  };

  const handleMouseLeave = () => {
    setHoveredPixel(null);
  };

  const handleClick = () => {
    if (hoveredPixel && onPixelSelect) {
      onPixelSelect(hoveredPixel);
    }
  };

  // Warmest Zone Marker position
  const warmestPxX = (warmestZone.x + 0.5) * (100 / 8);
  const warmestPxY = (warmestZone.y + 0.5) * (100 / 8);

  return (
    <div 
      ref={containerRef}
      className="thermal-canvas-container relative w-full aspect-square max-w-[550px] mx-auto rounded-lg overflow-hidden border border-dark-border bg-black shadow-panel"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      <canvas 
        ref={canvasRef}
        className="w-full h-full block cursor-crosshair"
      />

      {/* Warmest Zone Marker Overlay */}
      {showHotspot && warmestZone.val > -Infinity && (
        <div 
          className="absolute z-10 pointer-events-none transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
          style={{ left: `${warmestPxX}%`, top: `${warmestPxY}%` }}
        >
          <div className="relative flex items-center justify-center">
            <span className="absolute w-8 h-8 rounded-full border-2 border-thermal-orange animate-ping-slow opacity-75"></span>
            <Crosshair className="w-6 h-6 text-thermal-orange hotspot-anim" />
          </div>
          <div className="mt-1 bg-black/85 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-mono text-thermal-orange font-bold border border-thermal-orange/40 shadow-lg whitespace-nowrap">
            WARMEST ZONE: {formatTemp(warmestZone.val, unit)}
          </div>
        </div>
      )}

      {/* Pixel Inspection Tooltip */}
      {hoveredPixel && hoveredPixel.val !== null && (
        <div 
          className="pointer-events-none fixed z-50 bg-[#11141B]/95 text-white border border-thermal-cyan/60 rounded-md p-2.5 shadow-2xl backdrop-blur-md font-mono text-xs text-left"
          style={{ 
            left: `${mousePos.x + 12}px`, 
            top: `${mousePos.y + 12}px` 
          }}
        >
          <div className="flex items-center gap-1.5 text-thermal-cyan font-bold border-b border-dark-border pb-1 mb-1 text-[11px]">
            <span className="w-2 h-2 rounded-full bg-thermal-cyan animate-pulse"></span>
            ZONE TEMPERATURE READING
          </div>
          <div className="grid grid-cols-2 gap-x-3 text-[11px] text-gray-300">
            <span>Grid Coordinates:</span>
            <span className="text-white font-bold">X: {hoveredPixel.x}, Y: {hoveredPixel.y}</span>
            <span>Local Temperature:</span>
            <span className="text-thermal-orange font-bold text-sm">
              {formatTemp(hoveredPixel.val, unit)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
