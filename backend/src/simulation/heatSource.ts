import { HeatSource, ThermalFrame, ThermalPoint } from '../../../shared/types/thermal';

/**
 * Calculates temperature at grid position (x, y) based on ambient temperature
 * and multiple Gaussian heat sources with realistic falloff and noise.
 */
export function calculatePixelTemperature(
  x: number,
  y: number,
  ambientTemp: number,
  sources: HeatSource[]
): number {
  let tempSum = ambientTemp;

  for (const source of sources) {
    const dx = x - source.x;
    const dy = y - source.y;
    const distSq = dx * dx + dy * dy;
    const radius = Math.max(source.radius, 0.5);

    // Gaussian heat distribution: heat = delta * exp(-dist^2 / (2 * radius^2))
    const heatContribution = (source.temperature - ambientTemp) * Math.exp(-distSq / (2 * radius * radius));
    
    if (heatContribution > 0) {
      tempSum += heatContribution;
    }
  }

  // Small random sensor noise (±0.15 °C)
  const noise = (Math.random() - 0.5) * 0.3;
  
  return Number((tempSum + noise).toFixed(2));
}

/**
 * Generates an 8x8 Thermal Frame given scenario settings and sources
 */
export function generateThermalFrame(
  sensorId: string,
  ambientTemp: number,
  sources: HeatSource[]
): ThermalFrame {
  const temperatures: number[][] = Array.from({ length: 8 }, () => Array(8).fill(0));

  let minTemp = Infinity;
  let maxTemp = -Infinity;
  let sumTemp = 0;

  let hotspot: ThermalPoint = { x: 0, y: 0, temperature: -Infinity };
  let coldspot: ThermalPoint = { x: 0, y: 0, temperature: Infinity };

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const val = calculatePixelTemperature(c, r, ambientTemp, sources);
      temperatures[r][c] = val;

      sumTemp += val;

      if (val > maxTemp) {
        maxTemp = val;
        hotspot = { x: c, y: r, temperature: val };
      }

      if (val < minTemp) {
        minTemp = val;
        coldspot = { x: c, y: r, temperature: val };
      }
    }
  }

  const avgTemp = Number((sumTemp / 64).toFixed(2));

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
    hotspot,
    coldspot,
  };
}
