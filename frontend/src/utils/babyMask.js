/**
 * Baby Spatial Mask Provider Engine
 * Generates normalized polygon boundaries and point-in-polygon spatial testing
 */

export const DEFAULT_BABY_POLYGON = [
  { x: 0.42, y: 0.16 }, // Head Top
  { x: 0.58, y: 0.16 }, // Head Right
  { x: 0.68, y: 0.30 }, // Right Shoulder
  { x: 0.70, y: 0.55 }, // Right Torso / Hand
  { x: 0.61, y: 0.78 }, // Right Foot
  { x: 0.38, y: 0.78 }, // Left Foot
  { x: 0.30, y: 0.55 }, // Left Torso / Hand
  { x: 0.34, y: 0.30 }  // Left Shoulder
];

/**
 * Ray-casting algorithm to test if normalized point (px, py) is inside polygon
 */
export function isPointInPolygon(px, py, polygon = DEFAULT_BABY_POLYGON) {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].x;
    const yi = polygon[i].y;
    const xj = polygon[j].x;
    const yj = polygon[j].y;

    const intersect = ((yi > py) !== (yj > py)) &&
      (px < (xj - xi) * (py - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

/**
 * Generates a 2D mask array (gridWidth x gridHeight) where 1 = Inside Baby, 0 = Outside
 */
export function generateBabyMaskGrid(gridWidth = 64, gridHeight = 64, polygon = DEFAULT_BABY_POLYGON) {
  const mask = Array.from({ length: gridHeight }, () => new Uint8Array(gridWidth));

  for (let r = 0; r < gridHeight; r++) {
    const normY = r / (gridHeight - 1);
    for (let c = 0; c < gridWidth; c++) {
      const normX = c / (gridWidth - 1);
      if (isPointInPolygon(normX, normY, polygon)) {
        mask[r][c] = 1;
      }
    }
  }

  return mask;
}
