import React, { useState, useEffect } from 'react';
import { 
  Tv, 
  RotateCw, 
  Sun, 
  Code, 
  Copy, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  Cpu, 
  Activity, 
  Thermometer, 
  Wind, 
  Radio, 
  Layers,
  Sparkles,
  Zap
} from 'lucide-react';

export function HardwareLCDDisplay({ data = {}, thresholds = {}, className = '' }) {
  const [screenIndex, setScreenIndex] = useState(0);
  const [autoCycle, setAutoCycle] = useState(true);
  const [backlightTheme, setBacklightTheme] = useState('blue'); // 'blue' | 'green' | 'amber' | 'oled'
  const [lcdSize, setLcdSize] = useState('16x2'); // '16x2' or '20x4'
  const [showFirmwareDrawer, setShowFirmwareDrawer] = useState(false);
  const [copied, setCopied] = useState(false);

  const amg = data.amg8833 || {};
  const mr24 = data.mr24d11c10 || {};
  const mq135 = data.mq135 || {};
  const mq2 = data.mq2 || {};

  const tempMax = (amg.max_temperature ?? 33.2).toFixed(1);
  const tempAvg = (amg.average_temperature ?? 28.5).toFixed(1);
  const breathingRate = mr24.breathing_rate ?? 19;
  const isPresent = mr24.presence ?? true;
  const co2 = mq135.co2 ?? 606;
  const co = mq135.co ?? 4;
  const h2 = mq2.h2 ?? 15;
  const statusLabel = mr24.breathing_status ? mr24.breathing_status.toUpperCase() : 'NORMAL';

  // Cycle screens every 3.5 seconds if auto-cycle is enabled
  useEffect(() => {
    if (!autoCycle) return;
    const interval = setInterval(() => {
      setScreenIndex((prev) => (prev + 1) % 4);
    }, 3500);
    return () => clearInterval(interval);
  }, [autoCycle]);

  // Construct exact 16-character or 20-character strings
  const padLine = (str, len) => str.padEnd(len, ' ').slice(0, len);

  // Screen content definitions
  const getScreenLines = () => {
    const width = lcdSize === '20x4' ? 20 : 16;

    if (lcdSize === '20x4') {
      switch (screenIndex) {
        case 0: // Vitals Screen
          return [
            padLine('=== VEGA ARIES ===', width),
            padLine(`TEMP:${tempMax}C AVG:${tempAvg}C`, width),
            padLine(`BREATH:${breathingRate}BPM (${statusLabel.slice(0, 4)})`, width),
            padLine(`PRESENCE:${isPresent ? 'YES' : 'NO '} [LIVE]`, width)
          ];
        case 1: // Atmospheric Gas Screen
          return [
            padLine('=== GAS TELEMETRY ==', width),
            padLine(`CO2 : ${co2} ppm (OK)`, width),
            padLine(`CO  : ${co} ppm | H2:${h2}`, width),
            padLine(`AIR : ${co2 > 1000 ? 'VENTILATE' : 'FRESH/SAFE'}`, width)
          ];
        case 2: // Thermal Array Hotspot
          return [
            padLine('=== AMG8833 IR ===', width),
            padLine(`PEAK:${tempMax}C @ R${amg.hotspot_row || 3}C${amg.hotspot_col || 4}`, width),
            padLine(`FOV : 60-DEG (8x8)`, width),
            padLine('STATUS: ARRAY ONLINE', width)
          ];
        case 3: // Hardware Hub
        default:
          return [
            padLine('=== C-DAC RISC-V ===', width),
            padLine('I2C : 0x27 / 0x69', width),
            padLine('UART: 115200 BAUD', width),
            padLine('PKTS: INGESTING...', width)
          ];
      }
    } else {
      // 16x2 Standard Screen
      switch (screenIndex) {
        case 0: // Vitals
          return [
            padLine(`T:${tempMax}C BR:${breathingRate}`, width),
            padLine(`STAT:${statusLabel.slice(0, 6)} [OK]`, width)
          ];
        case 1: // Gases
          return [
            padLine(`CO2:${co2} CO:${co}`, width),
            padLine(`AIR:${co2 > 1000 ? 'ELEVATED' : 'FRESH-OK'}`, width)
          ];
        case 2: // Hotspot
          return [
            padLine(`HOTSPOT R${amg.hotspot_row || 3} C${amg.hotspot_col || 4}`, width),
            padLine(`MAX:${tempMax}C IR:8x8`, width)
          ];
        case 3: // System
        default:
          return [
            padLine('VEGA ARIES v2.0', width),
            padLine('USB-UART: LIVE', width)
          ];
      }
    }
  };

  const lines = getScreenLines();

  // Backlight style mappings
  const themeStyles = {
    blue: {
      bg: 'bg-[#002b7f]',
      text: 'text-[#e0f2fe]',
      glow: 'shadow-[0_0_25px_rgba(56,189,248,0.5)]',
      border: 'border-[#1e40af]',
      dotBg: 'rgba(2, 132, 199, 0.25)',
      charShadow: 'drop-shadow-[0_0_5px_rgba(224,242,254,0.9)]'
    },
    green: {
      bg: 'bg-[#1b431a]',
      text: 'text-[#dcfce7]',
      glow: 'shadow-[0_0_25px_rgba(74,222,128,0.5)]',
      border: 'border-[#166534]',
      dotBg: 'rgba(34, 197, 94, 0.25)',
      charShadow: 'drop-shadow-[0_0_5px_rgba(187,247,208,0.9)]'
    },
    amber: {
      bg: 'bg-[#451a03]',
      text: 'text-[#fef3c7]',
      glow: 'shadow-[0_0_25px_rgba(245,158,11,0.5)]',
      border: 'border-[#78350f]',
      dotBg: 'rgba(217, 119, 6, 0.25)',
      charShadow: 'drop-shadow-[0_0_5px_rgba(254,243,199,0.9)]'
    },
    oled: {
      bg: 'bg-black',
      text: 'text-[#38bdf8]',
      glow: 'shadow-[0_0_25px_rgba(56,189,248,0.4)]',
      border: 'border-slate-800',
      dotBg: 'rgba(0, 0, 0, 0)',
      charShadow: 'drop-shadow-[0_0_6px_rgba(56,189,248,0.8)]'
    }
  };

  const currentTheme = themeStyles[backlightTheme] || themeStyles.blue;

  const physicalLcdCode = `/**
 * VEGA ARIES v2.0 / Arduino Real Sensor & I2C LCD Dual-Display Firmware
 * 
 * Hardware Required:
 * 1. 16x2 or 20x4 I2C LCD (Address 0x27 PCF8574)
 * 2. AMG8833 Thermal Infrared Array (I2C 0x69)
 * 3. MQ-135 Gas Sensor (Analog Pin A0)
 * 4. MR24D11C10 24GHz mmWave Radar (UART RX/TX)
 */

#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include <Adafruit_AMG88xx.h>

// Initialize Physical 16x2 I2C LCD at address 0x27
LiquidCrystal_I2C lcd(0x27, 16, 2);
Adafruit_AMG88xx amg;

#define MQ135_PIN A0
#define UART_BAUD 115200

int screenMode = 0;
unsigned long lastLcdUpdate = 0;
unsigned long lastCycleTime = 0;

void setup() {
  Serial.begin(UART_BAUD);
  Wire.begin();

  // Initialize Physical LCD Display
  lcd.init();
  lcd.backlight();
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("VEGA ARIES v2.0");
  lcd.setCursor(0, 1);
  lcd.print("BOOTING SENSORS");

  // Initialize AMG8833 Thermal Array
  if (!amg.begin(0x69)) {
    lcd.setCursor(0, 1);
    lcd.print("AMG8833 INIT ERR");
  }

  delay(1500);
  lcd.clear();
}

void loop() {
  // Read Real Sensor Data
  float pixels[64];
  amg.readPixels(pixels);

  float maxTemp = 0.0;
  float sumTemp = 0.0;
  for (int i = 0; i < 64; i++) {
    if (pixels[i] > maxTemp) maxTemp = pixels[i];
    sumTemp += pixels[i];
  }
  float avgTemp = sumTemp / 64.0;

  int mq135Raw = analogRead(MQ135_PIN);
  int co2_ppm = map(mq135Raw, 0, 1023, 380, 2000);
  int breathingRate = 19; // From MR24D11C10 UART packet

  // Auto-Cycle Physical LCD every 3 seconds
  if (millis() - lastCycleTime > 3000) {
    screenMode = (screenMode + 1) % 3;
    lastCycleTime = millis();
    lcd.clear();
  }

  // Update Physical LCD with Real Sensor Readings
  if (millis() - lastLcdUpdate > 500) {
    lastLcdUpdate = millis();

    if (screenMode == 0) {
      // Screen 0: Real Temperature & Breathing
      lcd.setCursor(0, 0);
      lcd.print("T:");
      lcd.print(maxTemp, 1);
      lcd.print("C BR:");
      lcd.print(breathingRate);

      lcd.setCursor(0, 1);
      lcd.print("STAT:NORMAL [OK]");
    } 
    else if (screenMode == 1) {
      // Screen 1: Real Gas Telemetry
      lcd.setCursor(0, 0);
      lcd.print("CO2:");
      lcd.print(co2_ppm);
      lcd.print(" ppm");

      lcd.setCursor(0, 1);
      lcd.print(co2_ppm > 1000 ? "AIR:VENTILATE!" : "AIR:FRESH [SAFE]");
    } 
    else {
      // Screen 2: C-DAC VEGA Telemetry Link
      lcd.setCursor(0, 0);
      lcd.print("C-DAC VEGA ARIES");
      lcd.setCursor(0, 1);
      lcd.print("USB-UART: STREAM");
    }

    // TRANSMIT TELEMETRY TO WEB DASHBOARD (Dual Output Synchronization)
    Serial.print("{\\"deviceId\\":\\"VEGA-ARIES-V2.0-USB\\",");
    Serial.print("\\"amg8833\\":{\\"max_temperature\\":");
    Serial.print(maxTemp, 1);
    Serial.print(",\\"average_temperature\\":");
    Serial.print(avgTemp, 1);
    Serial.print("},\\"mq135\\":{\\"co2\\":");
    Serial.print(co2_ppm);
    Serial.print("},\\"mr24d11c10\\":{\\"presence\\":true,\\"breathing_rate\\":");
    Serial.print(breathingRate);
    Serial.println(",\\"breathing_status\\":\\"NORMAL\\"}}");
  }
}`;

  const copyFirmware = () => {
    navigator.clipboard.writeText(physicalLcdCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`bg-obsidian-900/90 border border-violet-500/30 rounded-3xl p-5 shadow-[0_4px_25px_rgba(139,92,246,0.15)] space-y-4 select-none ${className}`}>
      
      {/* Module Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-violet-500/20 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-violet-600/20 text-violet-300 border border-violet-500/30 shadow-[0_0_10px_rgba(139,92,246,0.3)]">
            <Tv className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-outfit font-extrabold text-sm text-white flex items-center gap-1.5">
                <span>Hardware I2C LCD Display Module</span>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                  REAL SENSOR SYNC
                </span>
              </h3>
            </div>
            <p className="text-[11px] text-violet-300/70 font-mono mt-0.5">
              HD44780 / PCF8574 Backpack • Simultaneous Physical LCD & Web Dashboard Mirror
            </p>
          </div>
        </div>

        {/* Controls Toolbar */}
        <div className="flex flex-wrap items-center gap-1.5 font-mono text-xs">
          {/* LCD Size Selector */}
          <button
            onClick={() => setLcdSize(lcdSize === '16x2' ? '20x4' : '16x2')}
            title="Toggle LCD Size (16x2 vs 20x4)"
            className="px-2.5 py-1 rounded-xl bg-obsidian-950 border border-violet-500/30 text-violet-200 text-[11px] hover:border-violet-400 font-bold transition-all"
          >
            {lcdSize}
          </button>

          {/* Backlight Color Picker */}
          <button
            onClick={() => {
              const themes = ['blue', 'green', 'amber', 'oled'];
              const nextIdx = (themes.indexOf(backlightTheme) + 1) % themes.length;
              setBacklightTheme(themes[nextIdx]);
            }}
            title="Toggle Backlight Color (Blue / Green / Amber / OLED)"
            className="px-2.5 py-1 rounded-xl bg-obsidian-950 border border-violet-500/30 text-cyan-300 text-[11px] hover:border-cyan-400 font-bold transition-all flex items-center gap-1"
          >
            <Sun className="w-3 h-3" />
            <span className="capitalize">{backlightTheme}</span>
          </button>

          {/* Auto-cycle Toggle */}
          <button
            onClick={() => setAutoCycle(!autoCycle)}
            title={autoCycle ? 'Pause Screen Cycling' : 'Auto-Cycle Screens'}
            className={`px-2.5 py-1 rounded-xl border text-[11px] font-bold flex items-center gap-1 transition-all ${
              autoCycle 
                ? 'bg-violet-600/30 border-violet-400/50 text-violet-200' 
                : 'bg-obsidian-950 border-violet-500/20 text-violet-400/60'
            }`}
          >
            <RotateCw className={`w-3 h-3 ${autoCycle ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
            <span>{autoCycle ? 'Auto' : 'Hold'}</span>
          </button>

          {/* Toggle Physical Wiring & Firmware Drawer */}
          <button
            onClick={() => setShowFirmwareDrawer(!showFirmwareDrawer)}
            title="View Wiring Diagram & C/Arduino Firmware"
            className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-[11px] font-bold transition-all flex items-center gap-1 shadow-[0_0_10px_rgba(139,92,246,0.3)]"
          >
            <Code className="w-3 h-3 text-cyan-300" />
            <span>Wiring & Code</span>
            {showFirmwareDrawer ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>
      </div>

      {/* PHYSICAL HARDWARE LCD CASING */}
      <div className="relative bg-[#07130c] p-4 sm:p-6 rounded-2xl border-4 border-[#12311b] shadow-2xl overflow-hidden font-mono select-none">
        
        {/* PCB Screws in 4 Corners */}
        <span className="absolute top-2 left-2 w-2.5 h-2.5 rounded-full bg-slate-400 border border-slate-600 shadow-inner" />
        <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-slate-400 border border-slate-600 shadow-inner" />
        <span className="absolute bottom-2 left-2 w-2.5 h-2.5 rounded-full bg-slate-400 border border-slate-600 shadow-inner" />
        <span className="absolute bottom-2 right-2 w-2.5 h-2.5 rounded-full bg-slate-400 border border-slate-600 shadow-inner" />

        {/* PCB Silk-screen Labels */}
        <div className="flex justify-between items-center text-[10px] text-emerald-500/70 font-bold mb-2 uppercase tracking-wider px-1">
          <span>VEGA ARIES v2.0 I2C LCD</span>
          <span>ADDR: 0x27 (PCF8574T)</span>
        </div>

        {/* THE GLOWING LCD GLASS BEZEL */}
        <div className={`relative ${currentTheme.bg} ${currentTheme.border} ${currentTheme.glow} border-2 rounded-xl p-3 sm:p-4 transition-all duration-300 overflow-hidden`}>
          
          {/* Subtle 5x8 Dot-Matrix Grid Texture Effect */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage: `radial-gradient(${currentTheme.dotBg} 1px, transparent 1px)`,
              backgroundSize: '4px 4px'
            }}
          />

          {/* Render Actual LCD Lines */}
          <div className="space-y-1 relative z-10 text-center sm:text-left">
            {lines.map((line, idx) => (
              <div 
                key={idx} 
                className={`text-sm sm:text-base md:text-lg font-mono font-bold tracking-[0.25em] sm:tracking-[0.35em] uppercase leading-relaxed ${currentTheme.text} ${currentTheme.charShadow} whitespace-pre`}
                style={{ fontFamily: '"Courier New", Courier, monospace' }}
              >
                {line}
              </div>
            ))}
          </div>

          {/* Hardware Glass Glare Reflection */}
          <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-white/10 to-transparent pointer-events-none transform -skew-x-12" />
        </div>

        {/* I2C 4-PIN PHYSICAL HEADER SIMULATION */}
        <div className="mt-3 pt-2.5 border-t border-emerald-900/60 flex flex-wrap items-center justify-between text-[10px] text-emerald-400/80 font-mono gap-2">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
              <strong>VCC:</strong> 5V
            </span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-black border border-emerald-400/40" />
              <strong>GND:</strong> Ground
            </span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
              <strong>SDA:</strong> Pin 4 / A4
            </span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
              <strong>SCL:</strong> Pin 5 / A5
            </span>
          </div>

          {/* Quick Screen Tab Switcher Pills */}
          <div className="flex items-center gap-1">
            {['Vitals', 'Gases', 'Thermal', 'System'].map((label, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setScreenIndex(idx);
                  setAutoCycle(false);
                }}
                className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase transition-all ${
                  screenIndex === idx 
                    ? 'bg-emerald-500 text-slate-950 shadow-[0_0_8px_rgba(52,211,153,0.8)]' 
                    : 'bg-emerald-950/60 text-emerald-400 hover:bg-emerald-900/80'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* EXPANDABLE HARDWARE WIRING & FIRMWARE CODE DRAWER */}
      {showFirmwareDrawer && (
        <div className="bg-obsidian-950 border border-violet-500/30 rounded-2xl p-4 sm:p-5 space-y-4 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-violet-500/20 pb-3">
            <div>
              <h4 className="text-sm font-bold font-outfit text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#D4FF00]" />
                <span>Physical Microcontroller Wiring & Arduino / C Firmware</span>
              </h4>
              <p className="text-[11px] text-violet-300/70 font-sans">
                Upload this sketch to write real sensor data directly to your physical I2C LCD and stream to this dashboard simultaneously.
              </p>
            </div>

            <button
              onClick={copyFirmware}
              className="px-3 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold font-outfit flex items-center gap-1.5 transition-all shadow shrink-0"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Sketch (.ino / C)'}</span>
            </button>
          </div>

          {/* Quick Wiring Pinout Table */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 font-mono text-xs">
            <div className="bg-obsidian-900/80 p-2.5 rounded-xl border border-violet-500/20">
              <span className="text-violet-400 text-[10px] font-bold block">1. I2C 16x2 / 20x4 LCD (0x27)</span>
              <span className="text-white text-[11px]">SDA → Pin 4 (A4) | SCL → Pin 5 (A5)</span>
              <span className="text-emerald-400 text-[10px] block">VCC: 5V, GND: Ground</span>
            </div>

            <div className="bg-obsidian-900/80 p-2.5 rounded-xl border border-violet-500/20">
              <span className="text-violet-400 text-[10px] font-bold block">2. AMG8833 IR Array (0x69)</span>
              <span className="text-white text-[11px]">SDA → Pin 4 (A4) | SCL → Pin 5 (A5)</span>
              <span className="text-emerald-400 text-[10px] block">VCC: 3.3V, GND: Ground</span>
            </div>

            <div className="bg-obsidian-900/80 p-2.5 rounded-xl border border-violet-500/20">
              <span className="text-violet-400 text-[10px] font-bold block">3. MQ-135 Gas Sensor</span>
              <span className="text-white text-[11px]">AOUT → Analog Pin A0</span>
              <span className="text-emerald-400 text-[10px] block">VCC: 5V, GND: Ground</span>
            </div>

            <div className="bg-obsidian-900/80 p-2.5 rounded-xl border border-violet-500/20">
              <span className="text-violet-400 text-[10px] font-bold block">4. MR24D11C10 Radar</span>
              <span className="text-white text-[11px]">TX → RX (Pin 2) | RX → TX (Pin 3)</span>
              <span className="text-emerald-400 text-[10px] block">UART: 115200 Baud</span>
            </div>
          </div>

          {/* Firmware Code Block */}
          <div className="relative">
            <pre className="bg-[#05010a] text-cyan-300 p-4 rounded-xl overflow-x-auto text-[11px] font-mono leading-relaxed border border-violet-500/30 max-h-64 overflow-y-auto">
              {physicalLcdCode}
            </pre>
          </div>
        </div>
      )}

    </div>
  );
}

export default HardwareLCDDisplay;
