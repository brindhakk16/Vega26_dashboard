/**
 * Smart Environment & Human Monitoring System - Multi-Sensor Generator Service
 */

import { DEFAULT_THRESHOLDS, getGasStatus, getBreathingStatus } from '../utils/sensorDefaults.js';

export class MockSensorGenerator {
  constructor() {
    this.demoMode = true;
    this.scenario = 'normal'; // 'normal', 'high_temp_alert', 'gas_surge_alert', 'person_absent', 'unstable_breathing', 'sensor_disconnected'
    this.updateIntervalMs = 1000;
    this.timer = null;
    this.listeners = new Set();

    this.frameIndex = 0;
    this.waveformBuffer = Array.from({ length: 30 }, (_, i) => Math.sin((i / 5) * Math.PI) * 0.8);
    
    this.thresholds = { ...DEFAULT_THRESHOLDS };

    // Active alert list
    this.alerts = [
      {
        id: 'alt-101',
        timestamp: new Date(Date.now() - 120000).toLocaleTimeString(),
        sensor: 'MQ-135',
        parameter: 'CO',
        value: '18 ppm',
        threshold: '15 ppm',
        severity: 'WARNING',
        status: 'ACTIVE',
        message: 'CO concentration approaching warning threshold'
      }
    ];

    this.historyBuffer = [];
    this.maxHistory = 300;
  }

  setDemoMode(enabled) {
    this.demoMode = enabled;
    this.notify();
  }

  setScenario(scen) {
    this.scenario = scen;
    this.generateNextPayload();
    this.notify();
  }

  updateThresholds(newThresh) {
    this.thresholds = { ...this.thresholds, ...newThresh };
    this.notify();
  }

  acknowledgeAlert(alertId) {
    this.alerts = this.alerts.map(a => a.id === alertId ? { ...a, status: 'ACKNOWLEDGED' } : a);
    this.notify();
  }

  clearAlert(alertId) {
    this.alerts = this.alerts.filter(a => a.id !== alertId);
    this.notify();
  }

  clearAllAlerts() {
    this.alerts = [];
    this.notify();
  }

  // Generates realistic 8x8 AMG8833 Thermal Array
  generateThermalMatrix(baseAmbient = 27.5, maxHotspot = 36.8) {
    const matrix = [];
    let hotspotRow = 3;
    let hotspotCol = 4;

    if (this.scenario === 'high_temp_alert') {
      maxHotspot = 39.4;
      hotspotRow = 2;
      hotspotCol = 5;
    } else if (this.scenario === 'person_absent') {
      maxHotspot = 28.2;
    }

    let minT = 999;
    let maxT = -999;
    let sumT = 0;

    for (let r = 0; r < 8; r++) {
      const row = [];
      for (let c = 0; c < 8; c++) {
        const distToHotspot = Math.sqrt(Math.pow(r - hotspotRow, 2) + Math.pow(c - hotspotCol, 2));
        const noise = (Math.random() - 0.5) * 0.4;
        
        let temp = baseAmbient + Math.max(0, (maxHotspot - baseAmbient) * Math.exp(-distToHotspot / 1.8)) + noise;
        temp = Number(temp.toFixed(1));

        if (temp < minT) minT = temp;
        if (temp > maxT) {
          maxT = temp;
          hotspotRow = r;
          hotspotCol = c;
        }
        sumT += temp;
        row.push(temp);
      }
      matrix.push(row);
    }

    const avgT = Number((sumT / 64).toFixed(1));

    return {
      temperature_matrix: matrix,
      min_temperature: minT,
      max_temperature: maxT,
      average_temperature: avgT,
      hotspot_row: hotspotRow + 1, // 1-indexed for display
      hotspot_col: hotspotCol + 1,
      status: this.scenario === 'sensor_disconnected' ? 'offline' : 'online'
    };
  }

  // Generates respiration waveform for MR24D11C10
  nextRespirationWaveform(presence, breathingRate) {
    const t = this.frameIndex * 0.2;
    let val = 0;
    if (presence) {
      const freq = (breathingRate / 60) * 2 * Math.PI;
      val = Math.sin(t * freq) + Math.sin(t * freq * 2) * 0.15 + (Math.random() - 0.5) * 0.08;
    } else {
      val = (Math.random() - 0.5) * 0.05;
    }

    this.waveformBuffer.shift();
    this.waveformBuffer.push(Number(val.toFixed(2)));
    return [...this.waveformBuffer];
  }

  generateNextPayload() {
    this.frameIndex++;
    const now = new Date();
    const timestampStr = now.toLocaleTimeString();

    const isDisconnected = this.scenario === 'sensor_disconnected';
    const isGasSurge = this.scenario === 'gas_surge_alert';
    const isPersonAbsent = this.scenario === 'person_absent';
    const isUnstableBreathing = this.scenario === 'unstable_breathing';

    // 1. AMG8833
    const amg8833 = this.generateThermalMatrix();

    // 2. MQ-135 Gas Sensor (CO2, NH3, CO, C6H6)
    const baseCo2 = isGasSurge ? 1340 : 620 + Math.floor(Math.sin(this.frameIndex * 0.1) * 35);
    const baseNh3 = isGasSurge ? 32 : 12 + Math.floor(Math.sin(this.frameIndex * 0.15) * 2);
    const baseCo = isGasSurge ? 38 : 4 + Math.floor(Math.cos(this.frameIndex * 0.1) * 1.5);
    const baseC6h6 = isGasSurge ? 7 : 2 + Number((Math.sin(this.frameIndex * 0.05) * 0.5).toFixed(1));
    const mq135Adc = isGasSurge ? 820 : 412 + Math.floor(Math.random() * 15);

    const mq135 = {
      co2: Math.max(350, baseCo2),
      nh3: Math.max(0, baseNh3),
      co: Math.max(0, baseCo),
      c6h6: Math.max(0, baseC6h6),
      raw_adc: mq135Adc,
      is_calibrated: true,
      status: isDisconnected ? 'offline' : 'online'
    };

    // 3. MQ-2 Combustible Gas Sensor (H2, CH4)
    const baseH2 = isGasSurge ? 42 : 15 + Math.floor(Math.sin(this.frameIndex * 0.2) * 3);
    const baseCh4 = isGasSurge ? 28 : 8 + Math.floor(Math.cos(this.frameIndex * 0.2) * 2);
    const mq2Adc = isGasSurge ? 760 : 380 + Math.floor(Math.random() * 12);

    const mq2 = {
      h2: Math.max(0, baseH2),
      ch4: Math.max(0, baseCh4),
      raw_adc: mq2Adc,
      calibration_state: 'Complete',
      status: isDisconnected ? 'offline' : 'online'
    };

    // 4. MR24D11C10 Radar Breathing Sensor
    const presence = !isPersonAbsent && !isDisconnected;
    const confidence = presence ? 98 : 0;
    let breathingRate = presence ? 18 + Math.floor(Math.sin(this.frameIndex * 0.15) * 2) : 0;
    if (isUnstableBreathing) breathingRate = 29; // Elevated / Unstable

    const breathingStatus = getBreathingStatus(breathingRate, presence, this.thresholds).label;
    const respirationWaveform = this.nextRespirationWaveform(presence, breathingRate);

    const mr24d11c10 = {
      presence,
      confidence,
      breathing_rate: breathingRate,
      breathing_status: breathingStatus,
      respiration_waveform: respirationWaveform,
      signal_quality: presence ? 'good' : 'poor',
      status: isDisconnected ? 'offline' : 'online'
    };

    // Check & push new alerts if threshold exceeded
    if (mq135.co >= this.thresholds.coCritical && !this.alerts.some(a => a.parameter === 'CO' && a.severity === 'CRITICAL')) {
      this.alerts.unshift({
        id: `alt-${Date.now()}`,
        timestamp: timestampStr,
        sensor: 'MQ-135',
        parameter: 'CO',
        value: `${mq135.co} ppm`,
        threshold: `${this.thresholds.coCritical} ppm`,
        severity: 'CRITICAL',
        status: 'ACTIVE',
        message: 'CO Carbon Monoxide level exceeded critical safety threshold!'
      });
    }

    if (amg8833.max_temperature >= this.thresholds.thermalWarningMax && !this.alerts.some(a => a.parameter === 'Temperature')) {
      this.alerts.unshift({
        id: `alt-${Date.now() + 1}`,
        timestamp: timestampStr,
        sensor: 'AMG8833',
        parameter: 'Temperature',
        value: `${amg8833.max_temperature}°C`,
        threshold: `${this.thresholds.thermalWarningMax}°C`,
        severity: amg8833.max_temperature >= this.thresholds.thermalCriticalMax ? 'CRITICAL' : 'WARNING',
        status: 'ACTIVE',
        message: `Thermal hotspot temp elevated to ${amg8833.max_temperature}°C`
      });
    }

    const payload = {
      timestamp: now.toISOString(),
      displayTimestamp: timestampStr,
      deviceId: 'IOT-MONITOR-001',
      deviceStatus: isDisconnected ? 'OFFLINE' : 'ONLINE',
      amg8833,
      mq135,
      mq2,
      mr24d11c10,
      alerts: this.alerts,
      demoMode: this.demoMode,
      scenario: this.scenario
    };

    // Add to rolling history
    this.historyBuffer.push({
      time: timestampStr,
      maxTemp: amg8833.max_temperature,
      avgTemp: amg8833.average_temperature,
      minTemp: amg8833.min_temperature,
      co2: mq135.co2,
      nh3: mq135.nh3,
      co: mq135.co,
      c6h6: mq135.c6h6,
      h2: mq2.h2,
      ch4: mq2.ch4,
      breathingRate: mr24d11c10.breathing_rate,
      presence: mr24d11c10.presence ? 1 : 0
    });

    if (this.historyBuffer.length > this.maxHistory) {
      this.historyBuffer.shift();
    }

    this.latestPayload = payload;
    return payload;
  }

  getLatestPayload() {
    if (!this.latestPayload) {
      return this.generateNextPayload();
    }
    return this.latestPayload;
  }

  getHistory(limit = 100) {
    return this.historyBuffer.slice(-limit);
  }

  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notify() {
    for (const cb of this.listeners) {
      try {
        cb(this.getLatestPayload());
      } catch (err) {
        console.error('Error notifying sensor subscriber:', err);
      }
    }
  }

  start() {
    if (this.timer) clearInterval(this.timer);
    this.timer = setInterval(() => {
      this.generateNextPayload();
      this.notify();
    }, this.updateIntervalMs);
  }

  stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
}

export const mockSensorGenerator = new MockSensorGenerator();
mockSensorGenerator.start();
