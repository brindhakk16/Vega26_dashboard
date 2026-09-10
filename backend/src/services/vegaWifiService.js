/**
 * VEGA ARIES v2.0 WiFi Telemetry Ingestion Service
 * Handles WiFi REST POST and WebSocket data transmission from C-DAC RISC-V VEGA ARIES v2.0 board.
 */

export class VegaWifiService {
  constructor() {
    this.isConnected = false;
    this.deviceIp = null;
    this.deviceId = 'VEGA-ARIES-V2.0-WIFI';
    this.packetsReceived = 0;
    this.bytesReceived = 0;
    this.lastPacketTime = null;
    this.rssi = -62; // dBm signal strength

    this.latestTelemetry = {
      timestamp: new Date().toISOString(),
      displayTimestamp: new Date().toLocaleTimeString(),
      deviceId: 'VEGA-ARIES-V2.0-WIFI',
      deviceStatus: 'ONLINE',
      amg8833: {
        temperature_matrix: Array.from({ length: 8 }, () => Array(8).fill(28.0)),
        min_temperature: 27.2,
        max_temperature: 36.8,
        average_temperature: 31.4,
        hotspot_row: 3,
        hotspot_col: 4,
        status: 'online'
      },
      mq135: { co2: 620, nh3: 12, co: 4, c6h6: 2, raw_adc: 412, status: 'online' },
      mq2: { h2: 15, ch4: 8, raw_adc: 380, calibration_state: 'Complete', status: 'online' },
      mr24d11c10: { presence: true, confidence: 98, breathing_rate: 18, breathing_status: 'NORMAL', signal_quality: 'good', status: 'online' }
    };

    this.historyBuffer = [];
    this.maxHistory = 300;
    this.subscribers = new Set();
  }

  subscribe(callback) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  notify(event) {
    for (const cb of this.subscribers) {
      try {
        cb(event);
      } catch (err) {
        console.error('[VEGA WiFi Service] Subscriber error:', err);
      }
    }
  }

  getStatus() {
    return {
      isConnected: this.isConnected,
      deviceIp: this.deviceIp,
      deviceId: this.deviceId,
      packetsReceived: this.packetsReceived,
      bytesReceived: this.bytesReceived,
      lastPacketTime: this.lastPacketTime,
      rssi: this.rssi
    };
  }

  /**
   * Ingest raw JSON payload received from VEGA ARIES v2.0 over WiFi HTTP or WebSocket
   */
  ingestTelemetry(payload, clientIp = '192.168.1.120') {
    this.isConnected = true;
    this.deviceIp = clientIp;
    this.packetsReceived++;
    const payloadStr = JSON.stringify(payload);
    this.bytesReceived += payloadStr.length;
    this.lastPacketTime = new Date().toLocaleTimeString();

    // Merge incoming packet with default telemetry schema
    const merged = {
      ...this.latestTelemetry,
      ...payload,
      timestamp: new Date().toISOString(),
      displayTimestamp: this.lastPacketTime,
      deviceId: payload.deviceId || 'VEGA-ARIES-V2.0-WIFI',
      deviceStatus: 'ONLINE'
    };

    this.latestTelemetry = merged;

    // Push to rolling history
    this.historyBuffer.push({
      time: this.lastPacketTime,
      maxTemp: merged.amg8833?.max_temperature || 36.8,
      avgTemp: merged.amg8833?.average_temperature || 31.4,
      co2: merged.mq135?.co2 || 620,
      nh3: merged.mq135?.nh3 || 12,
      co: merged.mq135?.co || 4,
      h2: merged.mq2?.h2 || 15,
      ch4: merged.mq2?.ch4 || 8,
      breathingRate: merged.mr24d11c10?.breathing_rate || 18,
      presence: merged.mr24d11c10?.presence ? 1 : 0
    });

    if (this.historyBuffer.length > this.maxHistory) {
      this.historyBuffer.shift();
    }

    // Broadcast to WebSocket subscribers
    this.notify({
      type: 'vega_wifi_telemetry',
      data: merged,
      status: this.getStatus()
    });

    return merged;
  }

  getLatestTelemetry() {
    return this.latestTelemetry;
  }

  getHistory(limit = 100) {
    return this.historyBuffer.slice(-limit);
  }
}

export const vegaWifiService = new VegaWifiService();
