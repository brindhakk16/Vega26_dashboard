/**
 * VEGA ARIES v2.0 Direct USB Serial Communication Service
 * Uses Web Serial API to connect directly to C-DAC RISC-V VEGA ARIES v2.0 microcontroller over USB UART.
 */

import { mockSensorGenerator } from './mockSensorGenerator.js';

export class VegaAriesSerialService {
  constructor() {
    this.port = null;
    this.reader = null;
    this.writer = null;
    this.readableStreamClosed = null;
    this.writableStreamClosed = null;
    
    this.isConnected = false;
    this.isConnecting = false;
    this.baudRate = 115200;
    this.portInfo = null;
    this.error = null;
    this.bytesReceived = 0;
    this.packetsReceived = 0;
    this.lastPacketTime = null;

    this.listeners = new Set();
    this.lineBuffer = '';

    // Check Web Serial API support
    this.isSupported = typeof navigator !== 'undefined' && 'serial' in navigator;

    // Listen for disconnect events if browser supports it
    if (this.isSupported) {
      navigator.serial.addEventListener('disconnect', (event) => {
        if (event.target === this.port) {
          this.disconnect();
        }
      });
    }
  }

  setBaudRate(baud) {
    this.baudRate = Number(baud);
    this.notify();
  }

  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notify() {
    const statusState = this.getStatus();
    for (const cb of this.listeners) {
      try {
        cb(statusState);
      } catch (err) {
        console.error('VEGA Serial listener error:', err);
      }
    }
  }

  getStatus() {
    return {
      isSupported: this.isSupported,
      isConnected: this.isConnected,
      isConnecting: this.isConnecting,
      baudRate: this.baudRate,
      portInfo: this.portInfo,
      error: this.error,
      bytesReceived: this.bytesReceived,
      packetsReceived: this.packetsReceived,
      lastPacketTime: this.lastPacketTime
    };
  }

  /**
   * Request user permission and connect to VEGA ARIES v2.0 USB Serial Port
   */
  async connect(customBaud = null) {
    if (!this.isSupported) {
      this.error = 'Web Serial API is not supported in this browser. Use Chrome, Edge, or Opera.';
      this.notify();
      throw new Error(this.error);
    }

    if (customBaud) {
      this.baudRate = Number(customBaud);
    }

    this.isConnecting = true;
    this.error = null;
    this.notify();

    try {
      // Filter for typical FTDI / CP2102 / CH340 / VEGA ARIES USB Vendor IDs if desired, or prompt all
      this.port = await navigator.serial.requestPort();

      // Open USB Serial connection at requested baud rate
      await this.port.open({
        baudRate: this.baudRate,
        dataBits: 8,
        stopBits: 1,
        parity: 'none',
        flowControl: 'none'
      });

      const info = this.port.getInfo();
      this.portInfo = {
        usbVendorId: info.usbVendorId ? `0x${info.usbVendorId.toString(16).padStart(4, '0')}` : '0x0403 (FTDI)',
        usbProductId: info.usbProductId ? `0x${info.usbProductId.toString(16).padStart(4, '0')}` : '0x6001 (VEGA ARIES v2.0)',
        displayName: `VEGA ARIES v2.0 USB (${info.usbVendorId ? `VID:${info.usbVendorId}` : 'FTDI UART'})`
      };

      this.isConnected = true;
      this.isConnecting = false;
      this.notify();

      // Auto-turn off synthetic demo generator mode so live hardware feeds the dashboard
      mockSensorGenerator.setDemoMode(false);

      // Start reading background stream
      this.startReading();

      return true;
    } catch (err) {
      console.error('Failed to connect to VEGA ARIES v2.0 USB port:', err);
      this.isConnected = false;
      this.isConnecting = false;
      this.error = err.message || 'Connection cancelled or failed.';
      this.notify();
      return false;
    }
  }

  /**
   * Continuous stream reader from VEGA ARIES v2.0 UART output
   */
  async startReading() {
    const textDecoder = new TextDecoderStream();
    this.readableStreamClosed = this.port.readable.pipeTo(textDecoder.writable);
    this.reader = textDecoder.readable.getReader();

    try {
      while (this.isConnected) {
        const { value, done } = await this.reader.read();
        if (done) {
          // Stream was closed
          break;
        }

        if (value) {
          this.bytesReceived += value.length;
          this.lineBuffer += value;

          // Process line by line
          const lines = this.lineBuffer.split(/\r?\n/);
          // Keep the incomplete last line in the buffer
          this.lineBuffer = lines.pop();

          for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed.length > 0) {
              this.processTelemetryLine(trimmed);
            }
          }
        }
      }
    } catch (err) {
      if (this.isConnected) {
        console.error('Error reading VEGA USB serial stream:', err);
        this.error = `Stream read error: ${err.message}`;
      }
    } finally {
      if (this.reader) {
        try {
          this.reader.releaseLock();
        } catch (e) {
          // ignore
        }
      }
    }
  }

  /**
   * Process a complete line of telemetry sent from VEGA ARIES v2.0
   */
  processTelemetryLine(line) {
    this.packetsReceived++;
    this.lastPacketTime = new Date().toLocaleTimeString();

    try {
      // 1. Try parsing JSON directly
      if (line.startsWith('{') && line.endsWith('}')) {
        const payload = JSON.parse(line);
        this.injectHardwareData(payload);
        return;
      }

      // 2. Parse key-value comma delimited legacy string from VEGA UART (e.g. "AMG:28.5,29.1...|MQ135:620|MQ2:380|BR:18")
      if (line.includes(':') || line.includes(',')) {
        const parsed = this.parseKeyValueLine(line);
        if (parsed) {
          this.injectHardwareData(parsed);
          return;
        }
      }

      console.log('VEGA ARIES v2.0 Raw Serial Line:', line);
    } catch (err) {
      console.warn('Malformed line received from VEGA ARIES USB:', line, err);
    }
  }

  /**
   * Injects parsed hardware packet into central sensor state generator
   */
  injectHardwareData(data) {
    // Fill required dashboard defaults if missing in raw firmware packet
    const basePayload = mockSensorGenerator.getLatestPayload();

    const merged = {
      ...basePayload,
      timestamp: new Date().toISOString(),
      displayTimestamp: new Date().toLocaleTimeString(),
      deviceId: data.deviceId || 'VEGA-ARIES-V2.0-USB',
      deviceStatus: 'ONLINE',
      amg8833: data.amg8833 ? { ...basePayload.amg8833, ...data.amg8833 } : basePayload.amg8833,
      mq135: data.mq135 ? { ...basePayload.mq135, ...data.mq135 } : basePayload.mq135,
      mq2: data.mq2 ? { ...basePayload.mq2, ...data.mq2 } : basePayload.mq2,
      mr24d11c10: data.mr24d11c10 ? { ...basePayload.mr24d11c10, ...data.mr24d11c10 } : basePayload.mr24d11c10,
      demoMode: false
    };

    // Update mock sensor generator active data
    mockSensorGenerator.latestPayload = merged;
    mockSensorGenerator.notify();
    this.notify();
  }

  /**
   * Fallback line parser for lightweight CSV / key-value firmware formats
   */
  parseKeyValueLine(line) {
    try {
      const parts = line.split('|');
      const kv = {};
      parts.forEach(part => {
        const [k, v] = part.split(':');
        if (k && v) kv[k.trim()] = v.trim();
      });

      return {
        deviceId: 'VEGA-ARIES-V2.0-USB',
        mq135: kv.MQ135 ? { co2: Number(kv.MQ135), co: kv.CO ? Number(kv.CO) : 4 } : null,
        mq2: kv.MQ2 ? { raw_adc: Number(kv.MQ2) } : null,
        mr24d11c10: kv.BR ? { breathing_rate: Number(kv.BR), presence: true } : null
      };
    } catch (e) {
      return null;
    }
  }

  /**
   * Send a command string back to VEGA ARIES v2.0 via USB UART (e.g. CLI calibration command)
   */
  async sendCommand(commandString) {
    if (!this.isConnected || !this.port || !this.port.writable) {
      throw new Error('VEGA ARIES v2.0 USB is not connected.');
    }

    const textEncoder = new TextEncoderStream();
    this.writableStreamClosed = textEncoder.readable.pipeTo(this.port.writable);
    const writer = textEncoder.writable.getWriter();

    try {
      const formattedCmd = commandString.endsWith('\n') ? commandString : commandString + '\n';
      await writer.write(formattedCmd);
      console.log('Sent CLI command to VEGA ARIES v2.0:', formattedCmd);
    } finally {
      writer.releaseLock();
    }
  }

  /**
   * Disconnect USB Serial connection safely
   */
  async disconnect() {
    this.isConnected = false;
    this.isConnecting = false;

    if (this.reader) {
      try {
        await this.reader.cancel();
      } catch (e) {
        // ignore
      }
    }

    if (this.readableStreamClosed) {
      try {
        await this.readableStreamClosed.catch(() => {});
      } catch (e) {
        // ignore
      }
    }

    if (this.port) {
      try {
        await this.port.close();
      } catch (e) {
        // ignore
      }
    }

    this.port = null;
    this.portInfo = null;
    this.reader = null;
    this.error = null;

    // Restore demo mode if desired
    mockSensorGenerator.setDemoMode(true);

    this.notify();
  }
}

export const vegaAriesSerialService = new VegaAriesSerialService();
