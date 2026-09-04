/**
 * CradleSense Scenario Controllers - Slower Environmental Simulation Scenarios
 */
import { CRADLE_SCENARIOS } from '../../../shared/thermal.js';

export class ScenarioController {
  constructor() {
    this.scenario = CRADLE_SCENARIOS.NORMAL_CRADLE;
    this.tick = 0;
    this.rampTemp = 26.5;
  }

  setScenario(name) {
    if (Object.values(CRADLE_SCENARIOS).includes(name)) {
      this.scenario = name;
      this.tick = 0;
      if (name === CRADLE_SCENARIOS.GRADUAL_WARMING) this.rampTemp = 26.5;
      if (name === CRADLE_SCENARIOS.GRADUAL_COOLING) this.rampTemp = 28.5;
      return true;
    }
    return false;
  }

  getCurrentScenario() {
    return this.scenario;
  }

  getNextSourcesAndAmbient() {
    this.tick++;

    switch (this.scenario) {
      case CRADLE_SCENARIOS.NORMAL_CRADLE: {
        // Very slow, smooth ambient drift (27.0°C ± 0.2°C)
        const centerSway = 27.2 + Math.sin(this.tick * 0.01) * 0.2;
        return {
          ambientTemp: 26.6,
          sources: [
            { x: 3.5, y: 3.5, temperature: centerSway, radius: 2.5 }
          ]
        };
      }

      case CRADLE_SCENARIOS.GRADUAL_WARMING: {
        // Slow realistic environmental warming (+0.005°C per frame)
        this.rampTemp = Math.min(31.5, this.rampTemp + 0.005);
        return {
          ambientTemp: this.rampTemp - 0.8,
          sources: [
            { x: 3.5, y: 3.5, temperature: this.rampTemp, radius: 3.0 }
          ]
        };
      }

      case CRADLE_SCENARIOS.GRADUAL_COOLING: {
        // Slow realistic environmental cooling (-0.005°C per frame)
        this.rampTemp = Math.max(22.0, this.rampTemp - 0.005);
        return {
          ambientTemp: this.rampTemp - 0.5,
          sources: [
            { x: 3.5, y: 3.5, temperature: this.rampTemp, radius: 3.0 }
          ]
        };
      }

      case CRADLE_SCENARIOS.LOCAL_WARM_REGION: {
        // Localized warmth near upper center region with slow breathing pulse
        const pulse = 29.8 + Math.sin(this.tick * 0.015) * 0.3;
        return {
          ambientTemp: 26.2,
          sources: [
            { x: 3.5, y: 2.0, temperature: pulse, radius: 1.8 }
          ]
        };
      }

      case CRADLE_SCENARIOS.UNEVEN_ENVIRONMENT: {
        // Temperature gradient: Right side warmer than Left side
        return {
          ambientTemp: 25.4,
          sources: [
            { x: 6.5, y: 3.5, temperature: 29.8, radius: 3.5 },
            { x: 0.5, y: 3.5, temperature: 24.8, radius: 3.5 }
          ]
        };
      }

      case CRADLE_SCENARIOS.SUDDEN_TEMP_CHANGE: {
        // Gradual transition to higher temperature
        const spike = this.tick > 60 ? 31.5 : 27.0;
        return {
          ambientTemp: spike - 1.5,
          sources: [
            { x: 3.5, y: 3.5, temperature: spike, radius: 2.5 }
          ]
        };
      }

      case CRADLE_SCENARIOS.SENSOR_OFFLINE: {
        return {
          ambientTemp: 0,
          sources: []
        };
      }

      case CRADLE_SCENARIOS.SENSOR_RECOVERY: {
        return {
          ambientTemp: 26.8,
          sources: [
            { x: 3.5, y: 3.5, temperature: 27.5, radius: 2.5 }
          ]
        };
      }

      default:
        return { ambientTemp: 26.5, sources: [] };
    }
  }
}
