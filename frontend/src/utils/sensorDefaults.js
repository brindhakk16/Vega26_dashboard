/**
 * Smart Environment & Human Monitoring System - Sensor Specs & Default Thresholds
 */

export const DEVICE_SPECS = {
  id: 'IOT-MONITOR-001',
  name: 'Smart Environment & Human Safety Workstation',
  firmware: 'v2.4.1-PROD',
  refreshRateMs: 1000,
  sensors: {
    amg8833: { name: 'Grid-EYE Thermal IR Sensor', interface: 'I2C (0x69)', matrix: '8x8' },
    mq135: { name: 'Air Quality & Hazardous Gas Sensor', interface: 'ADC (GPIO34)', gases: ['CO2', 'NH3', 'CO', 'C6H6'] },
    mq2: { name: 'Combustible & Flammable Gas Sensor', interface: 'ADC (GPIO35)', gases: ['H2', 'CH4'] },
    mr24d11c10: { name: '24GHz mmWave Radar Breathing Sensor', interface: 'UART (115200 baud)', features: ['Presence', 'Breathing BPM', 'Waveform'] }
  }
};

export const DEFAULT_THRESHOLDS = {
  // AMG8833 Thermal (°C)
  thermalWarningMax: 35.0,
  thermalCriticalMax: 38.0,
  thermalWarningMin: 20.0,

  // MR24D11C10 Breathing (BPM)
  breathingMinNormal: 12,
  breathingMaxNormal: 24,
  breathingLowWarning: 10,
  breathingHighWarning: 28,

  // MQ-135 Gases (ppm)
  co2Warning: 800,
  co2Critical: 1200,

  nh3Warning: 25,
  nh3Critical: 50,

  coWarning: 15,
  coCritical: 35,

  c6h6Warning: 5,
  c6h6Critical: 10,

  // MQ-2 Gases (ppm)
  h2Warning: 30,
  h2Critical: 70,

  ch4Warning: 20,
  ch4Critical: 50,

  // MQ Raw ADC Baselines
  mq135R0BaselineAdc: 400,
  mq2R0BaselineAdc: 350
};

/**
 * Evaluates individual gas reading against threshold
 */
export function getGasStatus(value, warningThresh, criticalThresh, isSensorError = false) {
  if (isSensorError) return { status: 'SENSOR ERROR', severity: 'error', color: 'rose-500' };
  if (value >= criticalThresh) return { status: 'CRITICAL', severity: 'critical', color: 'rose-500' };
  if (value >= warningThresh) return { status: 'WARNING', severity: 'warning', color: 'amber-400' };
  return { status: 'NORMAL', severity: 'normal', color: 'emerald-400' };
}

/**
 * Calculates overall Air Quality status (GOOD, MODERATE, POOR, CRITICAL)
 */
export function calculateOverallAirQuality(mq135Data, mq2Data, thresholds = DEFAULT_THRESHOLDS) {
  if (!mq135Data || !mq2Data) return { label: 'UNKNOWN', severity: 'normal', color: 'gray-400' };

  const co2Stat = getGasStatus(mq135Data.co2, thresholds.co2Warning, thresholds.co2Critical);
  const nh3Stat = getGasStatus(mq135Data.nh3, thresholds.nh3Warning, thresholds.nh3Critical);
  const coStat = getGasStatus(mq135Data.co, thresholds.coWarning, thresholds.coCritical);
  const c6h6Stat = getGasStatus(mq135Data.c6h6, thresholds.c6h6Warning, thresholds.c6h6Critical);
  const h2Stat = getGasStatus(mq2Data.h2, thresholds.h2Warning, thresholds.h2Critical);
  const ch4Stat = getGasStatus(mq2Data.ch4, thresholds.ch4Warning, thresholds.ch4Critical);

  const statuses = [co2Stat, nh3Stat, coStat, c6h6Stat, h2Stat, ch4Stat];
  const criticalCount = statuses.filter(s => s.severity === 'critical').length;
  const warningCount = statuses.filter(s => s.severity === 'warning').length;

  if (criticalCount >= 1) return { label: 'CRITICAL', severity: 'critical', color: 'rose-500', summary: `${criticalCount} Critical Gas Leak Detected` };
  if (warningCount >= 2) return { label: 'POOR', severity: 'warning', color: 'rose-400', summary: `${warningCount} Gas Warnings Active` };
  if (warningCount === 1) return { label: 'MODERATE', severity: 'warning', color: 'amber-400', summary: '1 Elevated Gas Warning' };
  
  return { label: 'GOOD', severity: 'normal', color: 'emerald-400', summary: 'All 6 Gases in Safe Range' };
}

/**
 * Calculates breathing rate status
 */
export function getBreathingStatus(bpm, presence, thresholds = DEFAULT_THRESHOLDS) {
  if (!presence) return { label: 'NO PERSON DETECTED', severity: 'normal', color: 'gray-400' };
  if (bpm <= 0) return { label: 'UNSTABLE', severity: 'warning', color: 'amber-400' };
  if (bpm < thresholds.breathingLowWarning) return { label: 'LOW', severity: 'warning', color: 'amber-400' };
  if (bpm > thresholds.breathingHighWarning) return { label: 'HIGH', severity: 'warning', color: 'rose-500' };
  if (bpm < thresholds.breathingMinNormal || bpm > thresholds.breathingMaxNormal) return { label: 'UNSTABLE', severity: 'warning', color: 'amber-400' };
  return { label: 'NORMAL', severity: 'normal', color: 'emerald-400' };
}
