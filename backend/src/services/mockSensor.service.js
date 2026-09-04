import { generateThermalFrame } from '../simulation/heatSource.js';
import { ScenarioController } from '../simulation/scenarios.js';
import { mockThermalProcessor } from '../processors/mockThermalProcessor.service.js';
import { CRADLE_SCENARIOS, DEFAULT_THRESHOLDS, ENVIRONMENT_STATES, calculateUniformity } from '../../../shared/thermal.js';

export class MockSensorService {
  constructor() {
    this.sensorId = 'AMG8833-001';
    this.scenarioController = new ScenarioController();
    this.isRunning = true;
    this.fps = 3; // Slower realistic update rate (3 FPS)
    this.timer = null;
    this.subscribers = new Set();
    this.history = [];
    this.maxHistoryLength = 500;
    this.latestFrame = null;
    this.startTime = new Date().toISOString();

    // Environmental Threshold Config
    this.config = {
      preferredMin: DEFAULT_THRESHOLDS.preferredMin,
      preferredMax: DEFAULT_THRESHOLDS.preferredMax,
      warningMin: DEFAULT_THRESHOLDS.warningMin,
      warningMax: DEFAULT_THRESHOLDS.warningMax,
      criticalMin: DEFAULT_THRESHOLDS.criticalMin,
      criticalMax: DEFAULT_THRESHOLDS.criticalMax,
      debounceSeconds: 3
    };

    // Environmental state tracking & debouncing
    this.currentState = ENVIRONMENT_STATES.NORMAL;
    this.stateDurationSeconds = 0;
    this.recentEvents = [
      {
        id: 'evt-1',
        type: 'info',
        timestamp: new Date().toISOString(),
        title: 'Cradle Monitoring Initialized',
        message: 'AMG8833 sensor array connected. Environmental temperature stable.',
        temp: 26.8
      }
    ];

    // Start simulation tick
    this.start();
  }

  start() {
    if (this.timer) clearInterval(this.timer);
    this.isRunning = true;
    const interval = Math.floor(1000 / this.fps);
    this.timer = setInterval(() => this.tick(), interval);
  }

  stop() {
    this.isRunning = false;
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  setFps(fps) {
    const validFps = Math.max(1, Math.min(20, Number(fps) || 3));
    this.fps = validFps;
    if (this.isRunning) {
      this.start();
    }
  }

  setScenario(scenarioName) {
    const success = this.scenarioController.setScenario(scenarioName);
    if (success && this.isRunning) {
      this.tick();
    }
    return success;
  }

  getScenario() {
    return this.scenarioController.getCurrentScenario();
  }

  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
    return this.config;
  }

  getConfig() {
    return this.config;
  }

  evaluateEnvironmentState(frame) {
    if (!frame || this.scenarioController.getCurrentScenario() === CRADLE_SCENARIOS.SENSOR_OFFLINE) {
      return { state: ENVIRONMENT_STATES.SENSOR_ERROR, severity: 'error' };
    }

    const current = frame.averageTemperature;
    const peak = frame.maxTemperature;

    if (peak >= this.config.criticalMax || current >= this.config.criticalMax) {
      return { state: ENVIRONMENT_STATES.CRITICAL_HIGH, severity: 'critical', temp: peak, limit: this.config.criticalMax };
    }
    if (current <= this.config.criticalMin) {
      return { state: ENVIRONMENT_STATES.CRITICAL_LOW, severity: 'critical', temp: current, limit: this.config.criticalMin };
    }
    if (peak >= this.config.warningMax || current >= this.config.warningMax) {
      return { state: ENVIRONMENT_STATES.WARNING_HIGH, severity: 'warning', temp: peak, limit: this.config.warningMax };
    }
    if (current <= this.config.warningMin) {
      return { state: ENVIRONMENT_STATES.WARNING_LOW, severity: 'warning', temp: current, limit: this.config.warningMin };
    }

    return { state: ENVIRONMENT_STATES.NORMAL, severity: 'normal', temp: current };
  }

  tick() {
    if (!this.isRunning) return;

    const scenario = this.scenarioController.getCurrentScenario();
    if (scenario === CRADLE_SCENARIOS.SENSOR_OFFLINE) {
      this.notifySubscribers({ type: 'sensor_status', data: { ...this.getStatus(), connected: false } });
      return;
    }

    const { ambientTemp, sources } = this.scenarioController.getNextSourcesAndAmbient();
    const rawFrame = generateThermalFrame(this.sensorId, ambientTemp, sources);
    const processedFrame = mockThermalProcessor.process(rawFrame);
    this.latestFrame = rawFrame;
    this.latestProcessedFrame = processedFrame;

    // Buffer frame into history
    this.history.push(rawFrame);
    if (this.history.length > this.maxHistoryLength) {
      this.history.shift();
    }

    // Evaluate state & debounced events
    const evalRes = this.evaluateEnvironmentState(rawFrame);
    if (evalRes.state !== this.currentState) {
      this.currentState = evalRes.state;
      this.stateDurationSeconds = 0;

      // Add debounced event entry
      const eventEntry = {
        id: `evt-${Date.now()}`,
        type: evalRes.severity,
        timestamp: new Date().toISOString(),
        title: evalRes.severity === 'critical' ? 'High Temperature Alert' : evalRes.severity === 'warning' ? 'Elevated Temperature' : 'Environment Stable',
        message: evalRes.severity !== 'normal' 
          ? `Measured ${evalRes.temp}°C exceeding threshold (${evalRes.limit}°C)` 
          : `Temperature returned to preferred comfort range (${this.config.preferredMin}°C - ${this.config.preferredMax}°C)`,
        temp: evalRes.temp || rawFrame.averageTemperature
      };
      this.recentEvents.unshift(eventEntry);
      if (this.recentEvents.length > 30) this.recentEvents.pop();

      if (evalRes.severity !== 'normal') {
        this.notifySubscribers({ type: 'environment_alert', data: eventEntry });
      }
    } else {
      this.stateDurationSeconds += 1 / this.fps;
    }

    const environmentStatus = {
      state: this.currentState,
      currentTemperature: rawFrame.averageTemperature,
      centerTemperature: rawFrame.centerTemperature,
      warmestZone: rawFrame.warmestZone,
      coolestZone: rawFrame.coolestZone,
      temperatureRange: rawFrame.temperatureRange,
      uniformity: calculateUniformity(rawFrame.temperatures, rawFrame.averageTemperature),
      lowerThreshold: this.config.preferredMin,
      upperThreshold: this.config.preferredMax,
      trend: Number((Math.sin(rawFrame.frameNumber * 0.02) * 0.2).toFixed(2)),
      durationOutsideThreshold: this.currentState !== ENVIRONMENT_STATES.NORMAL ? Math.round(this.stateDurationSeconds) : 0,
      events: this.recentEvents
    };

    this.notifySubscribers({ type: 'thermal_frame', data: rawFrame });
    this.notifySubscribers({ type: 'processed_frame', data: processedFrame });
    this.notifySubscribers({ type: 'environment_status', data: environmentStatus });
  }

  subscribe(callback) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  notifySubscribers(event) {
    for (const callback of this.subscribers) {
      try {
        callback(event);
      } catch (err) {
        console.error('Error notifying subscriber:', err);
      }
    }
  }

  getStatus() {
    return {
      connected: this.scenarioController.getCurrentScenario() !== CRADLE_SCENARIOS.SENSOR_OFFLINE,
      sensorId: this.sensorId,
      model: 'AMG8833 Grid-EYE (Cradle Monitor)',
      resolution: '8x8 (64 pixels)',
      refreshRate: this.fps,
      scenario: this.scenarioController.getCurrentScenario(),
      isRunning: this.isRunning,
      lastUpdate: this.latestFrame ? this.latestFrame.timestamp : new Date().toISOString(),
      sessionStarted: this.startTime,
      bufferedFrames: this.history.length,
      dataQuality: 'Excellent (64/64 valid pixels)',
      droppedFrames: 0,
      reconnects: 0
    };
  }

  getEnvironmentStatus() {
    const frame = this.getLatestFrame();
    return {
      state: this.currentState,
      currentTemperature: frame ? frame.averageTemperature : 27.0,
      centerTemperature: frame ? frame.centerTemperature : 27.2,
      temperatureRange: frame ? frame.temperatureRange : 2.5,
      uniformity: frame ? calculateUniformity(frame.temperatures, frame.averageTemperature) : 92,
      lowerThreshold: this.config.preferredMin,
      upperThreshold: this.config.preferredMax,
      trend: 0.2,
      durationOutsideThreshold: this.currentState !== ENVIRONMENT_STATES.NORMAL ? Math.round(this.stateDurationSeconds) : 0,
      events: this.recentEvents
    };
  }

  getLatestFrame() {
    if (!this.latestFrame) {
      this.tick();
    }
    return this.latestFrame;
  }

  getHistory(limit = 100) {
    const sliceCount = Math.min(limit, this.history.length);
    return this.history.slice(-sliceCount);
  }

  clearHistory() {
    this.history = [];
  }
}

export const mockSensorService = new MockSensorService();
