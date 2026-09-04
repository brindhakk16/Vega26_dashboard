/**
 * AMG8833 CradleSense Thermal Data Models & Constants
 */

export const SENSOR_SPECS = {
  id: 'AMG8833-001',
  name: 'AMG8833 Grid-EYE Thermal Sensor (Cradle Monitor)',
  width: 8,
  height: 8,
  totalPixels: 64,
  minRange: 0,
  maxRange: 80,
  accuracy: 2.5,
  refreshRates: [1, 2, 3, 5, 10, 15],
  defaultFps: 3,
  defaultUnit: 'C'
};

export const CRADLE_SCENARIOS = {
  NORMAL_CRADLE: 'normal_cradle',
  GRADUAL_WARMING: 'gradual_warming',
  GRADUAL_COOLING: 'gradual_cooling',
  LOCAL_WARM_REGION: 'local_warm_region',
  UNEVEN_ENVIRONMENT: 'uneven_environment',
  SUDDEN_TEMP_CHANGE: 'sudden_temp_change',
  SENSOR_OFFLINE: 'sensor_offline',
  SENSOR_RECOVERY: 'sensor_recovery'
};

export const DEFAULT_THRESHOLDS = {
  preferredMin: 24.0,
  preferredMax: 28.0,
  warningMin: 22.0,
  warningMax: 30.0,
  criticalMin: 20.0,
  criticalMax: 32.0,
  hysteresisSeconds: 5
};

export const DEFAULT_CALIBRATION = {
  imageX: 0.15,       // Normalized X offset of FOV rectangle
  imageY: 0.12,       // Normalized Y offset of FOV rectangle
  imageWidth: 0.70,   // Normalized FOV width (70% of image width)
  imageHeight: 0.76,  // Normalized FOV height (76% of image height)
  sensorRotation: 0,  // 0, 90, 180, 270 degrees
  flipHorizontal: false,
  flipVertical: false
};

export const DEFAULT_PLACEMENT = {
  mountX: 0.5,
  mountY: 0.1,
  heightCm: 120,
  tiltX: 0,
  tiltY: 0,
  rotation: 0
};

export const ENVIRONMENT_STATES = {
  NORMAL: 'normal',
  WARMING: 'warming',
  COOLING: 'cooling',
  WARNING_HIGH: 'warning-high',
  WARNING_LOW: 'warning-low',
  CRITICAL_HIGH: 'critical-high',
  CRITICAL_LOW: 'critical-low',
  SENSOR_ERROR: 'sensor-error'
};

/**
 * Validates a thermal frame object structure
 */
export function isValidThermalFrame(frame) {
  return (
    frame &&
    typeof frame.sensorId === 'string' &&
    Array.isArray(frame.temperatures) &&
    frame.temperatures.length === 8 &&
    frame.temperatures.every(row => Array.isArray(row) && row.length === 8) &&
    typeof frame.minTemperature === 'number' &&
    typeof frame.maxTemperature === 'number' &&
    typeof frame.averageTemperature === 'number'
  );
}

/**
 * Calculates 4x4 (16 spatial micro-zones) from 8x8 matrix
 * Each 2x2 thermopile block forms one spatial zone.
 */
export function calculateSpatialZones4x4(matrix) {
  if (!matrix || matrix.length !== 8) return null;

  const zones = [];
  const labels = [
    ['TL1', 'TL2', 'TR1', 'TR2'],
    ['ML1', 'C1',  'C2',  'MR1'],
    ['ML2', 'C3',  'C4',  'MR2'],
    ['BL1', 'BL2', 'BR1', 'BR2']
  ];

  for (let rBlock = 0; rBlock < 4; rBlock++) {
    for (let cBlock = 0; cBlock < 4; cBlock++) {
      let sum = 0;
      for (let r = rBlock * 2; r < rBlock * 2 + 2; r++) {
        for (let c = cBlock * 2; c < cBlock * 2 + 2; c++) {
          sum += matrix[r][c];
        }
      }
      const avg = Number((sum / 4).toFixed(1));
      const code = labels[rBlock][cBlock];
      const isCenter = (rBlock === 1 || rBlock === 2) && (cBlock === 1 || cBlock === 2);
      zones.push({
        id: `z-${rBlock}-${cBlock}`,
        row: rBlock,
        col: cBlock,
        code,
        avg,
        isCenter
      });
    }
  }

  return zones;
}

/**
 * Calculates 9 spatial zones from 8x8 matrix with directional asymmetry metrics
 */
export function calculateSpatialZones(matrix) {
  if (!matrix || matrix.length !== 8) return null;

  const getAvg = (rStart, rEnd, cStart, cEnd) => {
    let sum = 0;
    let count = 0;
    for (let r = rStart; r <= rEnd; r++) {
      for (let c = cStart; c <= cEnd; c++) {
        sum += matrix[r][c];
        count++;
      }
    }
    return Number((sum / count).toFixed(1));
  };

  const zones = {
    topLeft: getAvg(0, 2, 0, 2),
    topCenter: getAvg(0, 2, 3, 4),
    topRight: getAvg(0, 2, 5, 7),
    middleLeft: getAvg(3, 4, 0, 2),
    center: getAvg(3, 4, 3, 4),
    middleRight: getAvg(3, 4, 5, 7),
    bottomLeft: getAvg(5, 7, 0, 2),
    bottomCenter: getAvg(5, 7, 3, 4),
    bottomRight: getAvg(5, 7, 5, 7)
  };

  // Directional thermal gradients
  const topAvg = Number(((zones.topLeft + zones.topCenter + zones.topRight) / 3).toFixed(1));
  const bottomAvg = Number(((zones.bottomLeft + zones.bottomCenter + zones.bottomRight) / 3).toFixed(1));
  const leftAvg = Number(((zones.topLeft + zones.middleLeft + zones.bottomLeft) / 3).toFixed(1));
  const rightAvg = Number(((zones.topRight + zones.middleRight + zones.bottomRight) / 3).toFixed(1));
  const perimeterAvg = Number(((zones.topLeft + zones.topCenter + zones.topRight + zones.middleLeft + zones.middleRight + zones.bottomLeft + zones.bottomCenter + zones.bottomRight) / 8).toFixed(1));

  const topToBottomDelta = Number((topAvg - bottomAvg).toFixed(1));
  const leftToRightDelta = Number((leftAvg - rightAvg).toFixed(1));
  const centerToPerimeterDelta = Number((zones.center - perimeterAvg).toFixed(1));

  return {
    ...zones,
    topAvg,
    bottomAvg,
    leftAvg,
    rightAvg,
    perimeterAvg,
    topToBottomDelta,
    leftToRightDelta,
    centerToPerimeterDelta
  };
}

/**
 * Calculates Thermal Uniformity percentage (0..100%)
 */
export function calculateUniformity(matrix, avgTemp) {
  if (!matrix || matrix.length !== 8) return 100;
  let varianceSum = 0;
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const diff = matrix[r][c] - avgTemp;
      varianceSum += diff * diff;
    }
  }
  const stdDev = Math.sqrt(varianceSum / 64);
  const uniformity = Math.max(0, Math.min(100, 100 - stdDev * 10));
  return Number(uniformity.toFixed(0));
}
