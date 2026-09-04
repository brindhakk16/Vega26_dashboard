import { DEFAULT_CALIBRATION } from '../../../shared/thermal.js';

export class MockThermalProcessorService {
  constructor() {
    this.calibration = { ...DEFAULT_CALIBRATION };
    this.processedFramesCount = 0;
  }

  updateCalibration(newCalibration) {
    this.calibration = { ...this.calibration, ...newCalibration };
    return this.calibration;
  }

  getCalibration() {
    return this.calibration;
  }

  validate(rawFrame) {
    if (!rawFrame || !Array.isArray(rawFrame.temperatures) || rawFrame.temperatures.length !== 8) {
      return null;
    }
    return rawFrame;
  }

  filter(rawTemperatures) {
    // Clamps invalid sensor values to reasonable 0°C..80°C range
    const filtered = Array.from({ length: 8 }, () => new Float32Array(8));
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const val = rawTemperatures[r][c];
        filtered[r][c] = isNaN(val) ? 25.0 : Math.max(0, Math.min(80, val));
      }
    }
    return filtered;
  }

  normalize(temperatures, minTemp, maxTemp) {
    const range = Math.max(maxTemp - minTemp, 0.1);
    const normalized = Array.from({ length: 8 }, () => new Float32Array(8));
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        normalized[r][c] = (temperatures[r][c] - minTemp) / range;
      }
    }
    return normalized;
  }

  process(rawFrame) {
    const startTime = performance.now();
    const validated = this.validate(rawFrame);

    if (!validated) {
      return null;
    }

    this.processedFramesCount++;
    const filteredTemps = this.filter(validated.temperatures);

    // Calculate core statistics
    let minTemp = Infinity;
    let maxTemp = -Infinity;
    let sumTemp = 0;
    let warmestPixel = { x: 0, y: 0, temperature: -Infinity };
    let coolestPixel = { x: 0, y: 0, temperature: Infinity };

    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const val = filteredTemps[r][c];
        sumTemp += val;
        if (val > maxTemp) {
          maxTemp = val;
          warmestPixel = { x: c, y: r, temperature: val };
        }
        if (val < minTemp) {
          minTemp = val;
          coolestPixel = { x: c, y: r, temperature: val };
        }
      }
    }

    const avgTemp = Number((sumTemp / 64).toFixed(2));
    const centerTemp = Number(
      ((filteredTemps[3][3] + filteredTemps[3][4] + filteredTemps[4][3] + filteredTemps[4][4]) / 4).toFixed(2)
    );
    const tempRange = Number((maxTemp - minTemp).toFixed(2));
    const normalized = this.normalize(filteredTemps, minTemp, maxTemp);

    // Simulated edge processor execution duration (e.g. 2.8 ms - 4.2 ms)
    const processingTimeMs = Number((performance.now() - startTime + 2.5 + Math.random() * 1.5).toFixed(1));

    return {
      frameNumber: this.processedFramesCount,
      timestamp: validated.timestamp || new Date().toISOString(),
      sensorId: validated.sensorId || 'AMG8833-001',
      unit: validated.unit || 'C',
      rawTemperatures: validated.temperatures,
      normalizedTemperatures: normalized,
      minTemperature: Number(minTemp.toFixed(2)),
      maxTemperature: Number(maxTemp.toFixed(2)),
      averageTemperature: avgTemp,
      centerTemperature: centerTemp,
      temperatureRange: tempRange,
      warmestPixel,
      coolestPixel,
      calibration: this.calibration,
      processingTimeMs,
      validPixels: 64,
      totalPixels: 64,
      pipelineStages: [
        { name: 'RAW SENSOR', timeMs: 0.3, status: 'ok' },
        { name: 'VALIDATION', timeMs: 0.1, status: 'ok' },
        { name: 'FILTER', timeMs: 0.2, status: 'ok' },
        { name: 'NORMALIZATION', timeMs: 0.1, status: 'ok' },
        { name: 'INTERPOLATION', timeMs: 0.7, status: 'ok' },
        { name: 'CALIBRATION', timeMs: 0.2, status: 'ok' },
        { name: 'PROJECTION', timeMs: 0.4, status: 'ok' }
      ]
    };
  }
}

export const mockThermalProcessor = new MockThermalProcessorService();
