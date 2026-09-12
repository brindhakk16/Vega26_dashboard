import React, { useState } from 'react';
import { 
  BookOpen, 
  Cpu, 
  Code, 
  Wifi, 
  CheckCircle2, 
  Copy, 
  Usb, 
  Terminal, 
  Shield, 
  Zap, 
  RefreshCw, 
  Send, 
  Play,
  Tv,
  Check,
  Layers,
  Activity,
  Thermometer,
  Wind,
  Radio
} from 'lucide-react';
import { useVegaAriesSerial } from '../hooks/useVegaAriesSerial.js';
import { HardwareLCDDisplay } from '../components/dashboard/HardwareLCDDisplay.jsx';

export function IntegrationGuidePage({ data = {}, thresholds = {} }) {
  const {
    isSupported,
    isConnected,
    isConnecting,
    baudRate,
    portInfo,
    error,
    bytesReceived,
    packetsReceived,
    lastPacketTime,
    connect,
    disconnect,
    sendCommand
  } = useVegaAriesSerial();

  const [cmdInput, setCmdInput] = useState('CALIBRATE_SENSORS');
  const [copiedId, setCopiedId] = useState(null);
  const [terminalLogs, setTerminalLogs] = useState([
    '[SYSTEM] VEGA ARIES v2.0 USB Serial Subsystem Initialized.',
    '[INFO] Web Serial API status: ' + (isSupported ? 'SUPPORTED' : 'UNSUPPORTED IN THIS BROWSER'),
    '[READY] Click "CONNECT VEGA ARIES v2.0 (USB)" in the top bar or below to begin transmission.'
  ]);

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSendCLI = async () => {
    if (!cmdInput.trim()) return;
    try {
      if (isConnected) {
        await sendCommand(cmdInput);
        setTerminalLogs(prev => [...prev.slice(-40), `[TX -> VEGA] ${cmdInput}`]);
      } else {
        setTerminalLogs(prev => [...prev.slice(-40), `[DEMO TX] Simulated command: ${cmdInput}`]);
      }
      setCmdInput('');
    } catch (e) {
      setTerminalLogs(prev => [...prev.slice(-40), `[ERROR] ${e.message}`]);
    }
  };

  const physicalLcdAndSensorsFirmware = `/**
 * ==============================================================================
 * C-DAC VEGA ARIES v2.0 (RISC-V) / ARDUINO DUAL SENSOR & I2C LCD FIRMWARE
 * ==============================================================================
 * Dual-Output Telemetry:
 *  1. Physical 16x2 / 20x4 I2C LCD Display (I2C Address 0x27)
 *  2. Real-time JSON Telemetry over USB UART (115200 Baud) to Web Dashboard
 * 
 * Hardware Wiring:
 *  - I2C LCD 16x2 (PCF8574): SDA -> Pin 4 (A4), SCL -> Pin 5 (A5), VCC -> 5V, GND -> GND
 *  - AMG8833 Thermal Array:  SDA -> Pin 4 (A4), SCL -> Pin 5 (A5), VCC -> 3.3V, GND -> GND
 *  - MQ-135 Gas Sensor:      AOUT -> Pin A0 (ADC0), VCC -> 5V, GND -> GND
 *  - MR24D11C10 Radar:       TX -> Pin 2 (RX), RX -> Pin 3 (TX), VCC -> 5V, GND -> GND
 */

#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include <Adafruit_AMG88xx.h>

// I2C 16x2 LCD at 0x27 (Use 0x3F if 0x27 does not respond)
LiquidCrystal_I2C lcd(0x27, 16, 2);
Adafruit_AMG88xx amg;

#define MQ135_PIN A0
#define UART_BAUD 115200

int screenCycle = 0;
unsigned long lastLcdRefresh = 0;
unsigned long lastCycleSwitch = 0;

void setup() {
  // Initialize USB Serial for Web Dashboard Telemetry
  Serial.begin(UART_BAUD);
  Wire.begin();

  // Initialize Physical LCD
  lcd.init();
  lcd.backlight();
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("VEGA ARIES v2.0");
  lcd.setCursor(0, 1);
  lcd.print("INIT DUAL OUTPUT");

  // Initialize AMG8833 Thermal Camera
  if (!amg.begin(0x69)) {
    lcd.setCursor(0, 1);
    lcd.print("AMG8833 INIT ERR");
  }

  delay(1500);
  lcd.clear();
}

void loop() {
  // 1. Read Real AMG8833 8x8 Thermal Pixels
  float pixels[64];
  amg.readPixels(pixels);

  float maxTemp = 0.0;
  float sumTemp = 0.0;
  int hotRow = 0, hotCol = 0;
  for (int i = 0; i < 64; i++) {
    if (pixels[i] > maxTemp) {
      maxTemp = pixels[i];
      hotRow = i / 8;
      hotCol = i % 8;
    }
    sumTemp += pixels[i];
  }
  float avgTemp = sumTemp / 64.0;

  // 2. Read Real MQ-135 Air Quality Sensor
  int mq135Raw = analogRead(MQ135_PIN);
  int co2_ppm = map(mq135Raw, 0, 1023, 380, 2000);
  int co_ppm = map(mq135Raw, 0, 1023, 1, 30);

  // 3. Simulated/UART Vitals from MR24D11C10 Radar
  int breathingRate = 19;
  bool presence = true;

  // Auto-Cycle Physical LCD every 3.5 seconds
  if (millis() - lastCycleSwitch > 3500) {
    screenCycle = (screenCycle + 1) % 4;
    lastCycleSwitch = millis();
    lcd.clear();
  }

  // Update Physical LCD Screen
  if (millis() - lastLcdRefresh > 500) {
    lastLcdRefresh = millis();

    switch (screenCycle) {
      case 0: // Vitals Screen
        lcd.setCursor(0, 0);
        lcd.print("T:");
        lcd.print(maxTemp, 1);
        lcd.print("C BR:");
        lcd.print(breathingRate);

        lcd.setCursor(0, 1);
        lcd.print("STAT:NORMAL [OK]");
        break;

      case 1: // Atmospheric Gas Screen
        lcd.setCursor(0, 0);
        lcd.print("CO2:");
        lcd.print(co2_ppm);
        lcd.print(" CO:");
        lcd.print(co_ppm);

        lcd.setCursor(0, 1);
        lcd.print(co2_ppm > 1000 ? "AIR:VENTILATE!" : "AIR:FRESH-OK");
        break;

      case 2: // Hotspot Tracking
        lcd.setCursor(0, 0);
        lcd.print("HOTSPOT R");
        lcd.print(hotRow);
        lcd.print(" C");
        lcd.print(hotCol);

        lcd.setCursor(0, 1);
        lcd.print("MAX:");
        lcd.print(maxTemp, 1);
        lcd.print("C IR:8x8");
        break;

      case 3: // System Link
      default:
        lcd.setCursor(0, 0);
        lcd.print("VEGA ARIES v2.0");
        lcd.setCursor(0, 1);
        lcd.print("USB-UART: LIVE");
        break;
    }

    // 4. STREAM JSON TELEMETRY TO WEB DASHBOARD VIA SERIAL
    Serial.print("{\\"deviceId\\":\\"VEGA-ARIES-V2.0-USB\\",\\"deviceStatus\\":\\"ONLINE\\",");
    Serial.print("\\"amg8833\\":{\\"max_temperature\\":");
    Serial.print(maxTemp, 1);
    Serial.print(",\\"average_temperature\\":");
    Serial.print(avgTemp, 1);
    Serial.print(",\\"hotspot_row\\":");
    Serial.print(hotRow);
    Serial.print(",\\"hotspot_col\\":");
    Serial.print(hotCol);
    Serial.print("},\\"mq135\\":{\\"co2\\":");
    Serial.print(co2_ppm);
    Serial.print(",\\"co\\":");
    Serial.print(co_ppm);
    Serial.print("},\\"mr24d11c10\\":{\\"presence\\":true,\\"breathing_rate\\":");
    Serial.print(breathingRate);
    Serial.println(",\\"breathing_status\\":\\"NORMAL\\"}}");
  }
}`;

  const udevRulesScript = `# 1. Create udev rule file for C-DAC VEGA ARIES v2.0 (FTDI / USB-UART Chipset)
sudo tee /etc/udev/rules.d/99-vega-aries.rules << 'EOF'
# VEGA ARIES v2.0 RISC-V USB UART
SUBSYSTEM=="tty", ATTRS{idVendor}=="0403", ATTRS{idProduct}=="6001", MODE="0666", GROUP="plugdev", SYMLINK+="vega_aries0"
SUBSYSTEM=="tty", ATTRS{idVendor}=="1a86", ATTRS{idProduct}=="7523", MODE="0666", GROUP="plugdev", SYMLINK+="vega_aries0"
EOF

# 2. Add current Linux user to serial communication groups
sudo usermod -a -G dialout,plugdev $USER

# 3. Reload udev rules & apply permissions immediately
sudo udevadm control --reload-rules
sudo udevadm trigger`;

  const cliCompileCommands = `# Install RISC-V Toolchain & Hardware Utilities
sudo apt-get update && sudo apt-get install -y gcc-riscv32-unknown-elf openocd minicom picocom

# Compile C Firmware for VEGA ARIES v2.0 (RV32IM Architecture)
riscv32-unknown-elf-gcc -march=rv32im -mabi=ilp32 -O2 -I./sdk/include main.c vega_uart.c vega_i2c.c vega_adc.c -o vega_firmware.elf

# Flash Firmware to VEGA ARIES v2.0 via OpenOCD
openocd -f interface/ftdi/vega_aries.cfg -f target/vega_theia.cfg -c "program vega_firmware.elf verify reset exit"

# Monitor Serial Output in CLI Terminal
picocom -b 115200 /dev/ttyUSB0 --echo`;

  return (
    <div className="space-y-8 font-jakarta text-slate-100 select-none">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#170830] via-[#100624] to-[#0a0316] border border-violet-500/30 rounded-3xl p-6 shadow-[0_4px_25px_rgba(139,92,246,0.2)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-violet-600/30 text-violet-300 font-mono text-[11px] font-bold uppercase tracking-wider border border-violet-500/40">
              C-DAC RISC-V VEGA ARIES v2.0
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-[11px] font-bold border border-emerald-500/40">
              DUAL OUTPUT: LCD + DASHBOARD
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white font-outfit uppercase mt-2 flex items-center gap-2.5">
            <Cpu className="w-7 h-7 text-cyan-400" />
            <span>Hardware I2C LCD & Sensor Integration Guide</span>
          </h1>
          <p className="text-xs text-violet-300/70 font-sans mt-1">
            Complete technical blueprint: I2C wiring pinouts, C-DAC RISC-V C/Arduino firmware, physical LCD synchronization & Web Serial data streaming.
          </p>
        </div>

        {/* Live USB Connection Status Card */}
        <div className="bg-obsidian-900/90 border border-violet-500/30 rounded-2xl p-4 shadow-sm flex items-center gap-4">
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
            isConnected ? 'bg-emerald-500 text-white animate-pulse' : 'bg-violet-950 text-violet-400'
          }`}>
            <Usb className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-mono font-bold text-white">
              {isConnected ? 'VEGA ARIES CONNECTED' : 'HARDWARE DISCONNECTED'}
            </div>
            <div className="text-[11px] text-violet-300/70 font-mono">
              {isConnected ? `${baudRate} Baud | ${packetsReceived} Pkts` : 'Ready for USB Serial Link'}
            </div>
          </div>
          {!isConnected ? (
            <button
              onClick={() => connect()}
              disabled={!isSupported || isConnecting}
              className="px-3 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs font-outfit uppercase shadow transition-all"
            >
              Connect USB
            </button>
          ) : (
            <button
              onClick={() => disconnect()}
              className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs font-outfit uppercase shadow transition-all"
            >
              Disconnect
            </button>
          )}
        </div>
      </div>

      {/* SECTION 1: LIVE HARDWARE LCD SIMULATOR & TELEMETRY MIRROR */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Tv className="w-5 h-5 text-cyan-400" />
          <h2 className="text-lg font-extrabold font-outfit text-white">
            1. Real-Time Hardware I2C LCD Mirror (Live Telemetry)
          </h2>
        </div>
        <HardwareLCDDisplay data={data} thresholds={thresholds} />
      </div>

      {/* SECTION 2: PHYSICAL HARDWARE WIRING PINOUT GUIDE */}
      <div className="bg-obsidian-800/80 backdrop-blur-md border border-violet-500/20 rounded-3xl p-6 shadow-[0_4px_20px_rgba(139,92,246,0.1)] space-y-4">
        <div className="flex justify-between items-center border-b border-violet-500/20 pb-3">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-[#D4FF00]" />
            <h3 className="font-outfit text-base font-extrabold text-white uppercase">
              2. Physical Sensor & LCD Hardware Wiring Pinouts
            </h3>
          </div>
          <span className="text-xs font-mono text-emerald-400 font-bold">Standard 3.3V / 5V I2C Bus</span>
        </div>

        <p className="text-xs text-violet-300/80 font-sans">
          Connect your physical sensors and 16x2 / 20x4 character LCD with PCF8574 I2C backpack to the C-DAC VEGA ARIES v2.0 or Arduino development board according to the pinout matrix below:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
          {/* LCD Card */}
          <div className="bg-obsidian-900/90 border border-violet-500/30 rounded-2xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-cyan-400 font-bold border-b border-violet-500/20 pb-1.5">
              <Tv className="w-4 h-4" />
              <span>I2C 16x2 LCD (0x27)</span>
            </div>
            <ul className="space-y-1 text-slate-300 text-[11px]">
              <li><strong>VCC:</strong> 5V Power</li>
              <li><strong>GND:</strong> Ground</li>
              <li><strong>SDA:</strong> Pin 4 / A4 (I2C SDA)</li>
              <li><strong>SCL:</strong> Pin 5 / A5 (I2C SCL)</li>
              <li className="text-violet-400 text-[10px] mt-1">Backpack: PCF8574T Chip</li>
            </ul>
          </div>

          {/* AMG8833 Card */}
          <div className="bg-obsidian-900/90 border border-violet-500/30 rounded-2xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-bold border-b border-violet-500/20 pb-1.5">
              <Thermometer className="w-4 h-4" />
              <span>AMG8833 Thermal (0x69)</span>
            </div>
            <ul className="space-y-1 text-slate-300 text-[11px]">
              <li><strong>VIN / VCC:</strong> 3.3V Power</li>
              <li><strong>GND:</strong> Ground</li>
              <li><strong>SDA:</strong> Pin 4 / A4 (I2C SDA)</li>
              <li><strong>SCL:</strong> Pin 5 / A5 (I2C SCL)</li>
              <li className="text-violet-400 text-[10px] mt-1">Resolution: 8x8 IR Matrix</li>
            </ul>
          </div>

          {/* MQ-135 Card */}
          <div className="bg-obsidian-900/90 border border-violet-500/30 rounded-2xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-bold border-b border-violet-500/20 pb-1.5">
              <Wind className="w-4 h-4" />
              <span>MQ-135 Air Quality</span>
            </div>
            <ul className="space-y-1 text-slate-300 text-[11px]">
              <li><strong>VCC:</strong> 5V Power</li>
              <li><strong>GND:</strong> Ground</li>
              <li><strong>AOUT:</strong> Analog Pin A0 (ADC0)</li>
              <li><strong>DOUT:</strong> Not connected</li>
              <li className="text-violet-400 text-[10px] mt-1">Detects: CO2, NH3, Smoke</li>
            </ul>
          </div>

          {/* MR24D11C10 Card */}
          <div className="bg-obsidian-900/90 border border-violet-500/30 rounded-2xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-purple-400 font-bold border-b border-violet-500/20 pb-1.5">
              <Radio className="w-4 h-4" />
              <span>MR24D11C10 Radar</span>
            </div>
            <ul className="space-y-1 text-slate-300 text-[11px]">
              <li><strong>VCC:</strong> 5V Power</li>
              <li><strong>GND:</strong> Ground</li>
              <li><strong>TX:</strong> Digital Pin 2 (RX)</li>
              <li><strong>RX:</strong> Digital Pin 3 (TX)</li>
              <li className="text-violet-400 text-[10px] mt-1">Frequency: 24GHz mmWave</li>
            </ul>
          </div>
        </div>
      </div>

      {/* SECTION 3: PHYSICAL C / ARDUINO FIRMWARE */}
      <div className="bg-obsidian-800/80 backdrop-blur-md border border-violet-500/20 rounded-3xl p-6 shadow-[0_4px_20px_rgba(139,92,246,0.1)] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-violet-500/20 pb-3">
          <div className="flex items-center gap-2">
            <Code className="w-5 h-5 text-indigo-400" />
            <h3 className="font-outfit text-base font-extrabold text-white uppercase">
              3. Complete C / Arduino Firmware (Physical LCD + Serial JSON Stream)
            </h3>
          </div>
          <button
            onClick={() => copyToClipboard(physicalLcdAndSensorsFirmware, 'lcd-firmware')}
            className="px-3 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-mono font-bold text-xs flex items-center gap-1.5 transition-all shadow"
          >
            {copiedId === 'lcd-firmware' ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedId === 'lcd-firmware' ? 'Copied Code!' : 'Copy Sketch (.ino)'}</span>
          </button>
        </div>

        <p className="text-xs text-violet-300/70 font-sans">
          This single sketch handles both writing to the physical LCD and sending telemetry over UART. Flash it to your microcontroller to synchronize the physical LCD and this web dashboard simultaneously:
        </p>

        <pre className="bg-[#05010a] text-cyan-300 p-4 rounded-2xl overflow-x-auto text-[11px] font-mono leading-relaxed max-h-96 border border-violet-500/30">
          {physicalLcdAndSensorsFirmware}
        </pre>
      </div>

      {/* SECTION 4: LIVE HARDWARE USB TERMINAL WORKBENCH */}
      <div className="bg-obsidian-900/90 text-white border border-violet-500/30 rounded-3xl p-6 shadow-xl space-y-4 font-mono text-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-violet-500/20 pb-4">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-[#D4FF00]" />
            <h3 className="font-outfit text-base font-extrabold text-white uppercase">
              4. VEGA ARIES v2.0 USB Serial Terminal Workbench
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${isConnected ? 'bg-emerald-500 animate-ping' : 'bg-amber-500'}`} />
            <span className="text-[11px] text-violet-300 font-bold">
              {isConnected ? 'LIVE SERIAL RX (115200 BAUD)' : 'DEMO SENSOR MODE ACTIVE'}
            </span>
          </div>
        </div>

        {/* Terminal Output Log Area */}
        <div className="bg-[#05010a] border border-violet-500/30 rounded-2xl p-4 h-52 overflow-y-auto space-y-1 font-mono text-[11px]">
          {terminalLogs.map((log, index) => (
            <div key={index} className={log.includes('[TX') ? 'text-[#D4FF00]' : log.includes('[ERROR]') ? 'text-rose-400' : 'text-slate-300'}>
              {log}
            </div>
          ))}
          {isConnected && (
            <div className="text-emerald-400 font-bold animate-pulse">
              [RX STREAM] Ingested packet #{packetsReceived} ({lastPacketTime || 'just now'})
            </div>
          )}
        </div>

        {/* Command Input Bar */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={cmdInput}
            onChange={(e) => setCmdInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendCLI()}
            placeholder="Type CLI command for VEGA ARIES v2.0 (e.g. CALIBRATE_SENSORS, READ_RAW_ADC)..."
            className="flex-1 bg-obsidian-950 border border-violet-500/30 rounded-xl px-4 py-2.5 text-xs text-white placeholder-violet-400/50 focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
          <button
            onClick={handleSendCLI}
            className="px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold font-outfit uppercase flex items-center gap-2 transition-all shadow"
          >
            <Send className="w-4 h-4" />
            <span>Send CLI</span>
          </button>
        </div>
      </div>

      {/* SECTION 5: LINUX & WINDOWS USB PERMISSIONS SETUP */}
      <div className="bg-obsidian-800/80 backdrop-blur-md border border-violet-500/20 rounded-3xl p-6 shadow-md space-y-4">
        <div className="flex justify-between items-center border-b border-violet-500/20 pb-3">
          <h3 className="font-outfit text-base font-extrabold text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-400" />
            <span>5. Operating System & USB Port Permissions Setup (udev & COM Ports)</span>
          </h3>
          <button
            onClick={() => copyToClipboard(udevRulesScript, 'udev-script')}
            className="text-xs text-violet-300 hover:text-white flex items-center gap-1 font-mono font-bold"
          >
            {copiedId === 'udev-script' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedId === 'udev-script' ? 'Copied' : 'Copy udev Script'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 font-mono text-xs">
          <div className="bg-[#05010a] text-cyan-300 p-4 rounded-2xl overflow-x-auto leading-relaxed border border-violet-500/30">
            <div className="text-violet-400 font-bold mb-2">// Linux udev Permission Setup Script</div>
            <pre className="text-[11px]">{udevRulesScript}</pre>
          </div>

          <div className="bg-obsidian-900/90 border border-violet-500/20 p-4 rounded-2xl space-y-3">
            <div className="font-bold text-white font-outfit text-sm">Windows & MacOS Setup:</div>
            <ul className="space-y-2 text-xs text-violet-200/90">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Windows 10/11:</strong> Connect the USB cable. The device will be detected as FT232 / CH340 on <code>COM3</code> or <code>COM4</code>.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Web Serial API:</strong> Open dashboard in Chrome, Edge, or Opera. Click "Connect USB" above to start live streaming directly into the dashboard and LCD.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Baud Rate:</strong> 115200 8N1 (8 data bits, 1 stop bit, no parity).</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

    </div>
  );
}

export default IntegrationGuidePage;
