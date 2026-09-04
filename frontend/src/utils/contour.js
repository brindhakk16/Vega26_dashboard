import { isPointInPolygon, DEFAULT_BABY_POLYGON } from './babyMask.js';

/**
 * Marching Squares Isothermal Contour Extraction Engine
 * Extracts equal-temperature contour lines from interpolated 64x64 thermal grid
 * and clips line segments strictly against the baby spatial mask polygon.
 */

export function extractIsothermalContours({
  grid,
  minTemp = 24,
  maxTemp = 32,
  interval = 1.0, // 0.5°C, 1.0°C, 2.0°C
  polygon = DEFAULT_BABY_POLYGON
}) {
  if (!grid || grid.length < 2) return [];

  const rows = grid.length;
  const cols = grid[0].length;

  // Determine contour levels within temperature range
  const startLevel = Math.ceil(minTemp / interval) * interval;
  const endLevel = Math.floor(maxTemp / interval) * interval;
  const levels = [];

  for (let lvl = startLevel; lvl <= endLevel; lvl += interval) {
    levels.push(Number(lvl.toFixed(1)));
  }

  const contours = [];

  // Process each contour level
  for (const targetTemp of levels) {
    const lines = [];
    const labels = [];

    for (let r = 0; r < rows - 1; r++) {
      for (let c = 0; c < cols - 1; c++) {
        // Normalized coordinates of 4 cell corners
        const nX0 = c / (cols - 1);
        const nY0 = r / (rows - 1);
        const nX1 = (c + 1) / (cols - 1);
        const nY1 = (r + 1) / (rows - 1);

        // Check if cell is within baby mask polygon
        const centerNX = (nX0 + nX1) / 2;
        const centerNY = (nY0 + nY1) / 2;
        if (!isPointInPolygon(centerNX, centerNY, polygon)) {
          continue;
        }

        // Cell corners temperature values
        const v0 = grid[r][c];       // Top-Left
        const v1 = grid[r][c + 1];   // Top-Right
        const v2 = grid[r + 1][c + 1]; // Bottom-Right
        const v3 = grid[r + 1][c];   // Bottom-Left

        // Marching squares 4-bit binary index
        let caseIdx = 0;
        if (v0 >= targetTemp) caseIdx |= 8;
        if (v1 >= targetTemp) caseIdx |= 4;
        if (v2 >= targetTemp) caseIdx |= 2;
        if (v3 >= targetTemp) caseIdx |= 1;

        if (caseIdx === 0 || caseIdx === 15) continue;

        // Linear interpolation helper along cell edges
        const interp = (valA, valB, posA, posB) => {
          if (Math.abs(valB - valA) < 0.001) return (posA + posB) / 2;
          const t = (targetTemp - valA) / (valB - valA);
          return posA + t * (posB - posA);
        };

        const topEdge    = { x: interp(v0, v1, nX0, nX1), y: nY0 };
        const rightEdge  = { x: nX1, y: interp(v1, v2, nY0, nY1) };
        const bottomEdge = { x: interp(v3, v2, nX0, nX1), y: nY1 };
        const leftEdge   = { x: nX0, y: interp(v0, v3, nY0, nY1) };

        // Generate line segments based on marching squares case
        switch (caseIdx) {
          case 1:  lines.push({ p1: leftEdge, p2: bottomEdge }); break;
          case 2:  lines.push({ p1: bottomEdge, p2: rightEdge }); break;
          case 3:  lines.push({ p1: leftEdge, p2: rightEdge }); break;
          case 4:  lines.push({ p1: topEdge, p2: rightEdge }); break;
          case 5:  lines.push({ p1: topEdge, p2: leftEdge }); lines.push({ p1: bottomEdge, p2: rightEdge }); break;
          case 6:  lines.push({ p1: topEdge, p2: bottomEdge }); break;
          case 7:  lines.push({ p1: topEdge, p2: leftEdge }); break;
          case 8:  lines.push({ p1: topEdge, p2: leftEdge }); break;
          case 9:  lines.push({ p1: topEdge, p2: bottomEdge }); break;
          case 10: lines.push({ p1: topEdge, p2: rightEdge }); lines.push({ p1: leftEdge, p2: bottomEdge }); break;
          case 11: lines.push({ p1: topEdge, p2: rightEdge }); break;
          case 12: lines.push({ p1: leftEdge, p2: rightEdge }); break;
          case 13: lines.push({ p1: bottomEdge, p2: rightEdge }); break;
          case 14: lines.push({ p1: leftEdge, p2: bottomEdge }); break;
        }

        // Add contour text label near center of major levels
        if (lines.length > 0 && r % 16 === 0 && c % 16 === 0) {
          labels.push({ x: centerNX, y: centerNY, text: `${targetTemp}°C` });
        }
      }
    }

    if (lines.length > 0) {
      const isMajor = Math.round(targetTemp) % 2 === 0;
      contours.push({
        level: targetTemp,
        isMajor,
        lines,
        labels
      });
    }
  }

  return contours;
}
