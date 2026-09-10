/**
 * CradleSense Thermal Sensor Service & WebSocket Provider
 * Abstracts backend WebSocket stream & REST API for Cradle environment telemetry
 */

class ThermalService {
  constructor() {
    this.ws = null;
    this.statusListeners = new Set();
    this.frameListeners = new Set();
    this.eventListeners = new Set();
    this.connected = false;
    this.reconnecting = false;
    this.reconnectTimer = null;
    this.sensorStatus = {
      connected: false,
      sensorId: 'SYS-NODE-01',
      refreshRate: 10,
      scenario: 'normal_cradle',
      isRunning: true,
      lastUpdate: null
    };
    this.latestFrame = null;
  }

  connect() {
    if (this.ws && (this.ws.readyState === WebSocket.CONNECTING || this.ws.readyState === WebSocket.OPEN)) {
      return;
    }

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = process.env.NODE_ENV === 'production' 
      ? `${protocol}//${window.location.host}/ws/thermal`
      : `${protocol}//${window.location.hostname}:5000/ws/thermal`;

    this.reconnecting = true;
    this.notifyStatusListeners();

    try {
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        this.connected = true;
        this.reconnecting = false;
        if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
        this.notifyStatusListeners();
      };

      this.ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          
          if (message.type === 'thermal_frame' && message.data) {
            this.latestFrame = message.data;
            this.notifyFrameListeners(message.data);
          } else if (message.type === 'sensor_status' && message.data) {
            this.sensorStatus = { ...this.sensorStatus, ...message.data, connected: true };
            this.notifyStatusListeners();
          } else {
            this.notifyEventListeners(message);
          }
        } catch (err) {
          console.error('[ThermalService] Failed to parse message:', err);
        }
      };

      this.ws.onclose = () => {
        this.connected = false;
        this.sensorStatus.connected = false;
        this.notifyStatusListeners();
        this.scheduleReconnect();
      };

      this.ws.onerror = (err) => {
        this.connected = false;
        this.sensorStatus.connected = false;
        this.notifyStatusListeners();
      };
    } catch (err) {
      this.scheduleReconnect();
    }
  }

  scheduleReconnect() {
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.reconnectTimer = setTimeout(() => {
      this.connect();
    }, 3000);
  }

  subscribeFrames(callback) {
    this.frameListeners.add(callback);
    if (this.latestFrame) callback(this.latestFrame);
    return () => this.frameListeners.delete(callback);
  }

  subscribeStatus(callback) {
    this.statusListeners.add(callback);
    callback(this.sensorStatus);
    return () => this.statusListeners.delete(callback);
  }

  subscribeEvents(callback) {
    this.eventListeners.add(callback);
    return () => this.eventListeners.delete(callback);
  }

  notifyFrameListeners(frame) {
    for (const listener of this.frameListeners) {
      listener(frame);
    }
  }

  notifyStatusListeners() {
    for (const listener of this.statusListeners) {
      listener({ ...this.sensorStatus, connected: this.connected, reconnecting: this.reconnecting });
    }
  }

  notifyEventListeners(event) {
    for (const listener of this.eventListeners) {
      listener(event);
    }
  }

  sendAction(action, payload = {}) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ action, ...payload }));
    } else {
      fetch(`/api/sensor/simulation/${action}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).catch(err => console.error('[ThermalService] REST action failed:', err));
    }
  }

  setScenario(scenario) {
    this.sendAction('set_scenario', { scenario });
  }

  setFps(fps) {
    this.sendAction('set_fps', { fps });
  }

  start() {
    this.sendAction('start');
  }

  stop() {
    this.sendAction('stop');
  }
}

export const thermalService = new ThermalService();
