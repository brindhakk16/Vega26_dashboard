/**
 * CradleSense AMG8833 Thermal Heat Distribution & Noise Algorithm
 */

let globalFrameCounter = 0;

/**
 * Calculates temperature at grid position (x, y) based on ambient baseline,
 * spatial gradients, environmental heat sources, and minor sensor noise.
 */
export function calculatePixelTemperature(x, y, ambientTemp, sources) {
  let tempSum = ambientTemp;

  for (const source of sources) {
    const dx = x - source.x;
    const dy = y - source.y;
    const distSq = dx * dx + dy * dy;
    const radius = Math.max(source.radius || 1.5, 0.5);

    // Gaussian heat distribution
    const heatContribution = (source.temperature - ambientTemp) * Math.exp(-distSq / (2 * radius * radius));
    
    if (Math.abs(heatContribution) > 0) {
      tempSum += heatContribution;
    }
  }

  // Small subtle random sensor noise (±0.05 °C for smooth data changes)
  const noise = (Math.random() - 0.5) * 0.1;
  
  return Number((tempSum + noise).toFixed(2));
}

/**
 * Generates an 8x8 Thermal Frame given scenario settings and sources
 */
export function generateThermalFrame(sensorId, ambientTemp, sources) {
  globalFrameCounter++;
  const temperatures = Array.from({ length: 8 }, () => Array(8).fill(0));

  let minTemp = Infinity;
  let maxTemp = -Infinity;
  let sumTemp = 0;

  let warmestZone = { x: 0, y: 0, temperature: -Infinity };
  let coolestZone = { x: 0, y: 0, temperature: Infinity };

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const val = calculatePixelTemperature(c, r, ambientTemp, sources);
      temperatures[r][c] = val;

      sumTemp += val;

      if (val > maxTemp) {
        maxTemp = val;
        warmestZone = { x: c, y: r, temperature: val };
      }

      if (val < minTemp) {
        minTemp = val;
        coolestZone = { x: c, y: r, temperature: val };
      }
    }
  }

  const avgTemp = Number((sumTemp / 64).toFixed(2));
  const centerTemp = Number(
    ((temperatures[3][3] + temperatures[3][4] + temperatures[4][3] + temperatures[4][4]) / 4).toFixed(2)
  );
  const tempRange = Number((maxTemp - minTemp).toFixed(2));

  return {
    sensorId,
    timestamp: new Date().toISOString(),
    unit: 'C',
    width: 8,
    height: 8,
    temperatures,
    minTemperature: Number(minTemp.toFixed(2)),
    maxTemperature: Number(maxTemp.toFixed(2)),
    averageTemperature: avgTemp,
    centerTemperature: centerTemp,
    temperatureRange: tempRange,
    validPixels: 64,
    frameNumber: globalFrameCounter,
    hotspot: warmestZone,
    warmestZone,
    coolestZone
  };
}
