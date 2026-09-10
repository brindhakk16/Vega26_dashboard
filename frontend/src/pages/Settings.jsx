import React, { useState } from 'react';
import { 
  Settings, 
  ShieldAlert, 
  Palette, 
  RotateCcw, 
  Sliders, 
  Usb, 
  Wifi, 
  Terminal, 
  Shield, 
  Zap, 
  Copy, 
  Send, 
  Cpu, 
  CheckCircle2, 
  AlertTriangle,
  Globe
} from 'lucide-react';
import { PALETTES } from '../utils/thermalColor.js';
import { useVegaAriesSerial } from '../hooks/useVegaAriesSerial.js';
import { useVegaAriesWifi } from '../hooks/useVegaAriesWifi.js';

export function SettingsPage({
  warningThreshold = 30,
  onWarningThresholdChange,
  criticalThreshold = 35,
  onCriticalThresholdChange,
  palette = 'ironbow',
  onPaletteChange,
  mode = 'smooth',
  onModeChange,
  unit = 'C',
  onToggleUnit,
  onResetDefaults
}) {
  // USB Serial Hook
  const {
    isSupported: isUsbSupported,
    isConnected: isUsbConnected,
    isConnecting: isUsbConnecting,
    baudRate,
    portInfo,
    error: usbError,
    bytesReceived: usbBytes,
    packetsReceived: usbPackets,
    lastPacketTime: usbLastTime,
    connect: connectUsb,
    disconnect: disconnectUsb,
    sendCommand,
    setBaudRate
  } = useVegaAriesSerial();

  // WiFi Hook
  const {
    isConnected: isWifiConnected,
    isConnecting: isWifiConnecting,
    serverUrl,
    error: wifiError,
    packetsReceived: wifiPackets,
    bytesReceived: wifiBytes,
    lastPacketTime: wifiLastTime,
    connectWifi,
    disconnectWifi
  } = useVegaAriesWifi();

  const [activeConnMode, setActiveConnMode] = useState('usb'); // 'usb' or 'wifi'
  const [customWifiUrl, setCustomWifiUrl] = useState('ws://localhost:5000/ws/vega-wifi');
  const [cmdInput, setCmdInput] = useState('CALIBRATE_SENSORS');
  const [terminalLogs, setTerminalLogs] = useState([
    '[SYSTEM] VEGA ARIES v2.0 Subsystem Ready.',
    '[INFO] Web Serial API status: ' + (isUsbSupported ? 'SUPPORTED' : 'UNSUPPORTED IN THIS BROWSER'),
    '[INFO] Backend WiFi Server Endpoint: ws://localhost:5000/ws/vega-wifi'
  ]);

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    alert(`${label} copied to clipboard!`);
  };

  const handleSendCLI = async () => {
    if (!cmdInput.trim()) return;
    try {
      if (isUsbConnected) {
        await sendCommand(cmdInput);
        setTerminalLogs(prev => [...prev.slice(-30), `[TX USB -> VEGA] ${cmdInput}`]);
      } else {
        setTerminalLogs(prev => [...prev.slice(-30), `[DEMO TX] Command: ${cmdInput}`]);
      }
      setCmdInput('');
    } catch (e) {
      setTerminalLogs(prev => [...prev.slice(-30), `[ERROR] ${e.message}`]);
    }
  };

  const wifiFirmwareCode = `/**
 * C-DAC VEGA ARIES v2.0 RISC-V - WiFi Telemetry Transmission (ESP8266 / ESP32 / ESP-AT)
 * Target Backend: http://192.168.1.100:5000/api/sensor/vega-wifi
 */

#include <WiFi.h>
#include <HTTPClient.h>

const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";
const char* serverEndpoint = "http://192.168.1.100:5000/api/sensor/vega-wifi";

void setup() {
    Serial.begin(115200);
    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print(".");
    }
    Serial.println("\\r\\n[VEGA WiFi] Connected to Local Network!");
}

void loop() {
    if (WiFi.status() == WL_CONNECTED) {
        HTTPClient http;
        http.begin(serverEndpoint);
        http.addHeader("Content-Type", "application/json");

        // Construct JSON Payload
        String jsonPayload = "{\\"deviceId\\":\\"VEGA-ARIES-V2.0-WIFI\\",\\"amg8833\\":{\\"max_temperature\\":36.8},\\"mq135\\":{\\"co2\\":620},\\"mr24d11c10\\":{\\"breathing_rate\\":18}}";

        int httpResponseCode = http.POST(jsonPayload);
        Serial.printf("[VEGA WiFi HTTP] Response Code: %d\\r\\n", httpResponseCode);
        http.end();
    }
    delay(1000);
}`;

  const udevRulesScript = `# 1. Create udev rule file for C-DAC VEGA ARIES v2.0 (FTDI / USB-UART)
sudo tee /etc/udev/rules.d/99-vega-aries.rules << 'EOF'
SUBSYSTEM=="tty", ATTRS{idVendor}=="0403", ATTRS{idProduct}=="6001", MODE="0666", GROUP="plugdev", SYMLINK+="vega_aries0"
EOF
sudo usermod -a -G dialout,plugdev $USER
sudo udevadm control --reload-rules && sudo udevadm trigger`;

  return (
    <div className="p-4 md:p-8 space-y-8 font-jakarta text-slate-900 select-none">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 font-outfit uppercase flex items-center gap-2.5">
            <Settings className="w-7 h-7 text-emerald-600" />
            <span>WORKSTATION SETTINGS & HARDWARE DATA LINK</span>
          </h1>
          <p className="text-xs text-slate-500 font-sans mt-1">
            Configure direct USB hardware serial link, WiFi remote streaming, backend server endpoints & display preferences
          </p>
        </div>

        <button
          onClick={onResetDefaults}
          className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-bold text-xs font-mono flex items-center gap-1.5 transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>RESET DEFAULTS</span>
        </button>
      </div>

      {/* SECTION 1: HARDWARE DATA CONNECTION SELECTOR (USB SERIAL vs LOCAL WIFI) */}
      <div className="bg-slate-900 text-white rounded-[32px] p-6 sm:p-8 shadow-2xl space-y-6 border border-slate-800">
        
        {/* Mode Selector Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30">
              {activeConnMode === 'usb' ? <Usb className="w-7 h-7 text-[#D4FF00]" /> : <Wifi className="w-7 h-7 text-cyan-400" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-outfit font-extrabold text-xl text-white">
                  VEGA ARIES v2.0 Telemetry Data Link
                </h2>
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/40">
                  C-DAC RISC-V HARDWARE
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Select Hardware Connection Protocol (Direct USB Serial or Local WiFi Server)
              </p>
            </div>
          </div>

          {/* Connection Mode Toggle Pills */}
          <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 font-mono text-xs">
            <button
              onClick={() => setActiveConnMode('usb')}
              className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-all ${
                activeConnMode === 'usb'
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Usb className="w-4 h-4" />
              <span>DIRECT USB SERIAL</span>
            </button>

            <button
              onClick={() => setActiveConnMode('wifi')}
              className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-all ${
                activeConnMode === 'wifi'
                  ? 'bg-cyan-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Wifi className="w-4 h-4" />
              <span>WIFI BACKEND STREAM</span>
            </button>
          </div>
        </div>

        {/* CONTROLS FOR USB MODE */}
        {activeConnMode === 'usb' && (
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="text-xs font-mono text-slate-300">
                Protocol: <strong className="text-[#D4FF00]">Direct Web Serial API (Zero Backend Required)</strong>
              </div>

              <div>
                {!isUsbConnected ? (
                  <button
                    onClick={() => connectUsb()}
                    disabled={!isUsbSupported || isUsbConnecting}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-slate-950 font-extrabold text-xs font-outfit uppercase tracking-wider flex items-center gap-2 shadow-lg transition-all active:scale-95"
                  >
                    <Zap className="w-4 h-4 text-slate-950" />
                    <span>{isUsbConnecting ? 'Requesting USB Port...' : 'CONNECT USB PORT'}</span>
                  </button>
                ) : (
                  <button
                    onClick={() => disconnectUsb()}
                    className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs font-outfit uppercase shadow-lg transition-all"
                  >
                    Disconnect USB
                  </button>
                )}
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 font-mono text-xs">
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
                <div className="text-slate-400">USB Status:</div>
                <div className={`font-bold text-sm ${isUsbConnected ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {isUsbConnected ? '● CONNECTED' : '○ DISCONNECTED'}
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
                <div className="text-slate-400">Target USB Port:</div>
                <div className="text-white font-bold truncate">
                  {portInfo ? portInfo.displayName : '/dev/ttyUSB0 or COMx'}
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
                <div className="text-slate-400">Baud Rate:</div>
                <select
                  value={baudRate}
                  onChange={(e) => setBaudRate(e.target.value)}
                  disabled={isUsbConnected}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-[#D4FF00] font-bold outline-none cursor-pointer"
                >
                  <option value="115200">115200 Baud (Standard)</option>
                  <option value="9600">9600 Baud</option>
                  <option value="230400">230400 Baud</option>
                </select>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
                <div className="text-slate-400">Packets Ingested:</div>
                <div className="text-cyan-400 font-bold">{usbPackets} pkts ({usbBytes} B)</div>
              </div>
            </div>
          </div>
        )}

        {/* CONTROLS FOR WIFI MODE */}
        {activeConnMode === 'wifi' && (
          <div className="space-y-5 font-mono text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="text-slate-300">
                Protocol: <strong className="text-cyan-400">Backend Node.js WiFi Server (REST / WebSocket)</strong>
              </div>

              <div>
                {!isWifiConnected ? (
                  <button
                    onClick={() => connectWifi(customWifiUrl)}
                    disabled={isWifiConnecting}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-slate-950 font-extrabold text-xs font-outfit uppercase tracking-wider flex items-center gap-2 shadow-lg transition-all active:scale-95"
                  >
                    <Globe className="w-4 h-4 text-slate-950" />
                    <span>{isWifiConnecting ? 'Connecting WebSocket...' : 'CONNECT TO BACKEND WIFI'}</span>
                  </button>
                ) : (
                  <button
                    onClick={() => disconnectWifi()}
                    className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs font-outfit uppercase shadow-lg transition-all"
                  >
                    Disconnect WiFi Stream
                  </button>
                )}
              </div>
            </div>

            {/* WiFi Server Address Input */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex justify-between items-center text-slate-300 font-bold">
                <span>Backend WebSocket Server Endpoint:</span>
                <span className="text-[#D4FF00]">{isWifiConnected ? '● CONNECTED' : '○ DISCONNECTED'}</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customWifiUrl}
                  onChange={(e) => setCustomWifiUrl(e.target.value)}
                  disabled={isWifiConnected}
                  placeholder="ws://localhost:5000/ws/vega-wifi"
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-xs focus:ring-2 focus:ring-cyan-500 outline-none"
                />
                <button
                  onClick={() => connectWifi(customWifiUrl)}
                  disabled={isWifiConnected}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold rounded-xl"
                >
                  Test Connection
                </button>
              </div>
            </div>

            {/* WiFi Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
                <div className="text-slate-400">REST Ingestion Endpoint:</div>
                <div className="text-cyan-400 font-bold text-[11px]">http://localhost:5000/api/sensor/vega-wifi</div>
              </div>
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
                <div className="text-slate-400">WiFi Packets Received:</div>
                <div className="text-emerald-400 font-bold text-sm">{wifiPackets} pkts ({wifiBytes} B)</div>
              </div>
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
                <div className="text-slate-400">Last Telemetry Packet:</div>
                <div className="text-[#D4FF00] font-bold text-sm">{wifiLastTime || 'Idle'}</div>
              </div>
            </div>
          </div>
        )}

        {/* TERMINAL CONSOLE */}
        <div className="space-y-3 pt-2 font-mono text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-300 font-bold flex items-center gap-2">
              <Terminal className="w-4 h-4 text-[#D4FF00]" />
              <span>VEGA ARIES v2.0 Live Stream Console</span>
            </span>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 h-36 overflow-y-auto space-y-1 text-[11px]">
            {terminalLogs.map((log, index) => (
              <div key={index} className={log.includes('[TX') ? 'text-[#D4FF00]' : log.includes('[ERROR]') ? 'text-rose-400' : 'text-slate-300'}>
                {log}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={cmdInput}
              onChange={(e) => setCmdInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendCLI()}
              placeholder="Send command string (e.g. CALIBRATE_SENSORS)..."
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
            />
            <button
              onClick={handleSendCLI}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold font-outfit uppercase flex items-center gap-1.5 transition-all shadow"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </button>
          </div>
        </div>

      </div>

      {/* SECTION 2: WORKSTATION THRESHOLD & VISUAL PREFERENCES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Environmental Thresholds */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-md font-mono text-xs space-y-5">
          <h3 className="text-slate-900 font-extrabold font-outfit text-base border-b border-slate-100 pb-3 flex items-center gap-2 uppercase">
            <Sliders className="w-5 h-5 text-emerald-600" />
            <span>ENVIRONMENT COMFORT THRESHOLDS (°C)</span>
          </h3>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1.5">
                <span className="text-amber-600 font-bold">WARNING THRESHOLD (UPPER):</span>
                <span className="text-slate-900 font-extrabold">{warningThreshold}°C</span>
              </div>
              <input
                type="range"
                min={25}
                max={35}
                value={warningThreshold}
                onChange={(e) => onWarningThresholdChange && onWarningThresholdChange(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-200 rounded-lg"
              />
              <span className="text-[11px] text-slate-500 font-sans block mt-1">Triggers warm warning status when ambient temp exceeds value.</span>
            </div>

            <div>
              <div className="flex justify-between mb-1.5">
                <span className="text-rose-600 font-bold">CRITICAL THRESHOLD (UPPER):</span>
                <span className="text-slate-900 font-extrabold">{criticalThreshold}°C</span>
              </div>
              <input
                type="range"
                min={30}
                max={40}
                value={criticalThreshold}
                onChange={(e) => onCriticalThresholdChange && onCriticalThresholdChange(Number(e.target.value))}
                className="w-full accent-rose-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
              />
              <span className="text-[11px] text-slate-500 font-sans block mt-1">Triggers critical alert when ambient temp reaches high threshold.</span>
            </div>
          </div>
        </div>

        {/* Display & Palette Settings */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-md font-mono text-xs space-y-5">
          <h3 className="text-slate-900 font-extrabold font-outfit text-base border-b border-slate-100 pb-3 flex items-center gap-2 uppercase">
            <Palette className="w-5 h-5 text-cyan-600" />
            <span>THERMAL MAP DISPLAY PREFERENCES</span>
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-slate-600 font-bold mb-1.5 font-sans">DEFAULT PALETTE:</label>
              <select
                value={palette}
                onChange={(e) => onPaletteChange && onPaletteChange(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 font-bold rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-sans"
              >
                <option value={PALETTES?.IRONBOW || 'ironbow'}>Ironbow (Default Thermal)</option>
                <option value={PALETTES?.RAINBOW || 'rainbow'}>Rainbow</option>
                <option value={PALETTES?.INFERNO || 'inferno'}>Inferno High Contrast</option>
                <option value={PALETTES?.GRAYSCALE || 'grayscale'}>Grayscale</option>
                <option value={PALETTES?.FLIR || 'flir'}>FLIR Camera</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-600 font-bold mb-1.5 font-sans">INTERPOLATION RENDER:</label>
              <select
                value={mode}
                onChange={(e) => onModeChange && onModeChange(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 font-bold rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-sans"
              >
                <option value="smooth">Smooth (Bilinear Upscale)</option>
                <option value="pixel">Pixelated (Raw 8x8 matrix)</option>
                <option value="contour">Isothermal Contour</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-600 font-bold mb-1.5 font-sans font-mono">TEMPERATURE UNIT:</label>
              <button
                onClick={onToggleUnit}
                className="px-5 py-2.5 bg-slate-900 text-white rounded-xl font-bold font-sans shadow-md hover:bg-slate-800 transition-all text-xs"
              >
                ACTIVE UNIT: °{unit}
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* SECTION 3: VEGA ARIES v2.0 WIFI FIRMWARE CODE TEMPLATE */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-md space-y-4">
        <div className="flex justify-between items-center border-b border-slate-200 pb-3">
          <h3 className="font-outfit text-base font-extrabold text-slate-900 flex items-center gap-2">
            <Wifi className="w-5 h-5 text-cyan-600" />
            <span>VEGA ARIES v2.0 WiFi C Code Transmission Snippet (ESP32 / ESP8266)</span>
          </h3>
          <button
            onClick={() => copyToClipboard(wifiFirmwareCode, 'WiFi Firmware')}
            className="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1 font-mono font-bold"
          >
            <Copy className="w-3.5 h-3.5" /> Copy C Code
          </button>
        </div>

        <pre className="bg-slate-900 text-cyan-300 p-4 rounded-2xl overflow-x-auto text-[11px] font-mono leading-relaxed border border-slate-800 max-h-72">
          {wifiFirmwareCode}
        </pre>
      </div>

    </div>
  );
}

export default SettingsPage;
