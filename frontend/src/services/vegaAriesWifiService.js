/**
 * VEGA ARIES v2.0 WiFi Transmission Client Service
 * Connects React frontend dashboard to backend WebSocket ws://localhost:5000/ws/vega-wifi
 */

import { mockSensorGenerator } from './mockSensorGenerator.js';

export class VegaAriesWifiService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.isConnecting = false;
    this.serverUrl = 'ws://localhost:5000/ws/vega-wifi';
    this.error = null;
    this.packetsReceived = 0;
    this.bytesReceived = 0;
    this.lastPacketTime = null;
    this.listeners = new Set();
  }

  getStatus() {
    return {
      isConnected: this.isConnected,
      isConnecting: this.isConnecting,
      serverUrl: this.serverUrl,
      error: this.error,
      packetsReceived: this.packetsReceived,
      bytesReceived: this.bytesReceived,
      lastPacketTime: this.lastPacketTime
    };
  }

  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notify() {
    const status = this.getStatus();
    for (const cb of this.listeners) {
      try {
        cb(status);
      } catch (err) {
        console.error('[VEGA WiFi Client] Listener error:', err);
      }
    }
  }

  connect(customUrl = null) {
    if (customUrl) {
      this.serverUrl = customUrl;
    }

    if (this.socket && (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING)) {
      return;
    }

    this.isConnecting = true;
    this.error = null;
    this.notify();

    try {
      this.socket = new WebSocket(this.serverUrl);

      this.socket.onopen = () => {
        console.log('[VEGA WiFi Client] Connected to WiFi WebSocket stream server:', this.serverUrl);
        this.isConnected = true;
        this.isConnecting = false;
        this.error = null;
        this.notify();

        // Switch off synthetic demo generator
        mockSensorGenerator.setDemoMode(false);
      };

      this.socket.onmessage = (event) => {
        this.packetsReceived++;
        this.bytesReceived += event.data.length;
        this.lastPacketTime = new Date().toLocaleTimeString();

        try {
          const message = JSON.parse(event.data);

          if (message.type === 'vega_wifi_telemetry' && message.data) {
            this.injectHardwareData(message.data);
          }
        } catch (e) {
          console.warn('[VEGA WiFi Client] Raw line:', event.data);
        }

        this.notify();
      };

      this.socket.onerror = (err) => {
        console.error('[VEGA WiFi Client] WebSocket error:', err);
        this.error = 'Failed to connect to backend WiFi server at ' + this.serverUrl;
        this.isConnecting = false;
        this.isConnected = false;
        this.notify();
      };

      this.socket.onclose = () => {
        console.log('[VEGA WiFi Client] Disconnected from WiFi server');
        this.isConnected = false;
        this.isConnecting = false;
        this.notify();
      };
    } catch (err) {
      this.isConnecting = false;
      this.isConnected = false;
      this.error = err.message;
      this.notify();
    }
  }

  injectHardwareData(data) {
    const basePayload = mockSensorGenerator.getLatestPayload();

    const merged = {
      ...basePayload,
      timestamp: new Date().toISOString(),
      displayTimestamp: new Date().toLocaleTimeString(),
      deviceId: data.deviceId || 'VEGA-ARIES-V2.0-WIFI',
      deviceStatus: 'ONLINE',
      amg8833: data.amg8833 ? { ...basePayload.amg8833, ...data.amg8833 } : basePayload.amg8833,
      mq135: data.mq135 ? { ...basePayload.mq135, ...data.mq135 } : basePayload.mq135,
      mq2: data.mq2 ? { ...basePayload.mq2, ...data.mq2 } : basePayload.mq2,
      mr24d11c10: data.mr24d11c10 ? { ...basePayload.mr24d11c10, ...data.mr24d11c10 } : basePayload.mr24d11c10,
      demoMode: false
    };

    mockSensorGenerator.latestPayload = merged;
    mockSensorGenerator.notify();
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    this.isConnected = false;
    this.isConnecting = false;
    mockSensorGenerator.setDemoMode(true);
    this.notify();
  }
}

export const vegaAriesWifiService = new VegaAriesWifiService();
