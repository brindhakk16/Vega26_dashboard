import React, { useState } from 'react';
import { BookOpen, Cpu, Code, Wifi, CheckCircle2, Copy, Usb, Terminal, Shield, Zap, RefreshCw, Send, Play } from 'lucide-react';
import { useVegaAriesSerial } from '../hooks/useVegaAriesSerial.js';

export function IntegrationGuidePage() {
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
  const [terminalLogs, setTerminalLogs] = useState([
    '[SYSTEM] VEGA ARIES v2.0 USB Serial Subsystem Initialized.',
    '[INFO] Web Serial API status: ' + (isSupported ? 'SUPPORTED' : 'UNSUPPORTED IN THIS BROWSER'),
    '[READY] Click "CONNECT VEGA ARIES v2.0 (USB)" in the top bar or below to begin transmission.'
  ]);

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    alert(`${label} copied to clipboard!`);
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

  const vegaCFirmware = `/**
 * C-DAC VEGA ARIES v2.0 RISC-V Microcontroller - Direct USB Serial Telemetry Firmware
 * Target: THEIA 32-bit RISC-V (RV32IM)
 * Baud Rate: 115200 8N1
 */

#include <stdio.h>
#include <string.h>
#include "vega_aries.h"
#include "vega_uart.h"
#include "vega_i2c.h"
#include "vega_adc.h"

#define UART_BAUD 115200
#define AMG8833_I2C_ADDR 0x69

void setup() {
    // Initialize VEGA ARIES UART0 for USB Serial Debug & Data Output
    vega_uart_init(UART0, UART_BAUD);
    vega_uart_print(UART0, "[VEGA ARIES v2.0] Initializing Sensors...\\r\\n");

    // Initialize I2C for AMG8833 Thermal Sensor
    vega_i2c_init(I2C0, FAST_MODE_400KHZ);

    // Initialize ADC Pins for Gas Sensors (MQ-135 on ADC0, MQ-2 on ADC1)
    vega_adc_init(ADC_CHANNEL_0);
    vega_adc_init(ADC_CHANNEL_1);
}

void loop() {
    float thermal_pixels[64];
    uint16_t mq135_raw = vega_adc_read(ADC_CHANNEL_0);
    uint16_t mq2_raw   = vega_adc_read(ADC_CHANNEL_1);

    // Read AMG8833 Thermal Array
    vega_i2c_read_bytes(I2C0, AMG8833_I2C_ADDR, 0x80, (uint8_t*)thermal_pixels, 128);

    // Construct JSON Telemetry Packet
    char json_buffer[1024];
    snprintf(json_buffer, sizeof(json_buffer),
        "{\\"deviceId\\":\\"VEGA-ARIES-V2.0-USB\\",\\"deviceStatus\\":\\"ONLINE\\","
        "\\"mq135\\":{\\"co2\\":%d,\\"nh3\\":%d,\\"co\\":%d,\\"c6h6\\":%d,\\"raw_adc\\":%d},"
        "\\"mq2\\":{\\"h2\\":%d,\\"ch4\\":%d,\\"raw_adc\\":%d},"
        "\\"mr24d11c10\\":{\\"presence\\":true,\\"breathing_rate\\":18,\\"breathing_status\\":\\"NORMAL\\"}}\\r\\n",
        (int)(400 + mq135_raw * 0.5), (int)(10 + mq135_raw * 0.02), (int)(4 + mq135_raw * 0.01), 2, mq135_raw,
        (int)(12 + mq2_raw * 0.03), (int)(6 + mq2_raw * 0.01), mq2_raw
    );

    // Send line out USB UART to Neka Web Dashboard
    vega_uart_print(UART0, json_buffer);

    vega_delay_ms(1000);
}

int main(void) {
    setup();
    while (1) {
        loop();
    }
    return 0;
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
    <div className="p-4 md:p-8 space-y-8 font-jakarta text-slate-900">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-slate-900 text-[#D4FF00] font-mono text-[11px] font-bold uppercase tracking-wider">
              RISC-V VEGA ARIES v2.0
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-mono text-[11px] font-bold border border-emerald-300">
              DIRECT USB UART
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 font-outfit uppercase mt-2 flex items-center gap-2.5">
            <Cpu className="w-7 h-7 text-emerald-600" />
            <span>VEGA ARIES v2.0 Hardware Integration & CLI Guide</span>
          </h1>
          <p className="text-xs text-slate-600 font-sans mt-1">
            Complete technical specification, Linux/Windows USB permissions, CLI commands, C-DAC firmware, and Web Serial connection workbench.
          </p>
        </div>

        {/* Live USB Status Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex items-center gap-4">
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
            isConnected ? 'bg-emerald-500 text-white animate-pulse' : 'bg-slate-100 text-slate-500'
          }`}>
            <Usb className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-mono font-bold text-slate-800">
              {isConnected ? 'VEGA ARIES CONNECTED' : 'HARDWARE DISCONNECTED'}
            </div>
            <div className="text-[11px] text-slate-500 font-mono">
              {isConnected ? `${baudRate} Baud | ${packetsReceived} Pkts` : 'Click below to connect USB'}
            </div>
          </div>
          {!isConnected ? (
            <button
              onClick={() => connect()}
              disabled={!isSupported || isConnecting}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs font-outfit uppercase shadow transition-all"
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

      {/* SECTION 1: LIVE HARDWARE USB TERMINAL WORKBENCH */}
      <div className="bg-slate-900 text-white border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 font-mono text-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-[#D4FF00]" />
            <h3 className="font-outfit text-base font-extrabold text-white uppercase">
              1. VEGA ARIES v2.0 USB Serial Terminal Workbench
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${isConnected ? 'bg-emerald-500 animate-ping' : 'bg-amber-500'}`} />
            <span className="text-[11px] text-slate-300 font-bold">
              {isConnected ? 'LIVE SERIAL RX (115200 BAUD)' : 'DEMO MODE ACTIVE'}
            </span>
          </div>
        </div>

        {/* Terminal Output Log Area */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 h-52 overflow-y-auto space-y-1 font-mono text-[11px]">
          {terminalLogs.map((log, index) => (
            <div key={index} className={log.includes('[TX') ? 'text-[#D4FF00]' : log.includes('[ERROR]') ? 'text-rose-400' : 'text-slate-300'}>
              {log}
            </div>
          ))}
          {isConnected && (
            <div className="text-emerald-400 font-bold animate-pulse">
              [RX STREAM] Received data packet #{packetsReceived} ({lastPacketTime || 'just now'})
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
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button
            onClick={handleSendCLI}
            className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold font-outfit uppercase flex items-center gap-2 transition-all shadow"
          >
            <Send className="w-4 h-4" />
            <span>Send CLI</span>
          </button>
        </div>
      </div>

      {/* SECTION 2: LINUX & WINDOWS USB PERMISSIONS SETUP */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-md space-y-4">
        <div className="flex justify-between items-center border-b border-slate-200 pb-3">
          <h3 className="font-outfit text-base font-extrabold text-slate-900 flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-600" />
            <span>2. Operating System & USB Port Permissions Setup (udev & Dialout)</span>
          </h3>
          <button
            onClick={() => copyToClipboard(udevRulesScript, 'udev script')}
            className="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1 font-mono font-bold"
          >
            <Copy className="w-3.5 h-3.5" /> Copy Linux udev Script
          </button>
        </div>

        <p className="text-xs text-slate-600 font-sans">
          To permit browser and command-line access to VEGA ARIES v2.0 USB Serial ports without requiring root (`sudo`), grant permissions using the script below:
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 font-mono text-xs">
          <div className="bg-slate-900 text-cyan-300 p-4 rounded-2xl overflow-x-auto leading-relaxed border border-slate-800">
            <div className="text-slate-400 font-bold mb-2">// Linux udev Permission Setup Script</div>
            <pre className="text-[11px]">{udevRulesScript}</pre>
          </div>

          <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-3">
            <div className="font-bold text-slate-900 font-outfit text-sm">Windows & MacOS Driver Instructions:</div>
            <ul className="space-y-2 text-xs text-slate-700">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Windows 10/11:</strong> Install FTDI VCP (Virtual COM Port) or CP210x Driver. Device will appear as <code>COM3</code> or <code>COM4</code> in Device Manager.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Web Serial API Access:</strong> Open dashboard in Chrome, Edge, or Opera. Click "CONNECT VEGA ARIES v2.0 (USB)" in top bar and select the COM/tty port.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Baud Rate Matching:</strong> Default baud rate is <strong>115200</strong>, 8 data bits, 1 stop bit, no parity (8N1).</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* SECTION 3: RISC-V TOOLCHAIN & CLI COMMANDS */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-md space-y-4">
        <div className="flex justify-between items-center border-b border-slate-200 pb-3">
          <h3 className="font-outfit text-base font-extrabold text-slate-900 flex items-center gap-2">
            <Terminal className="w-5 h-5 text-cyan-600" />
            <span>3. VEGA ARIES RISC-V Toolchain Compilation & OpenOCD Flashing CLI</span>
          </h3>
          <button
            onClick={() => copyToClipboard(cliCompileCommands, 'CLI build script')}
            className="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1 font-mono font-bold"
          >
            <Copy className="w-3.5 h-3.5" /> Copy CLI Build Commands
          </button>
        </div>

        <pre className="bg-slate-900 text-emerald-400 p-4 rounded-2xl overflow-x-auto text-[11px] font-mono leading-relaxed border border-slate-800">
          {cliCompileCommands}
        </pre>
      </div>

      {/* SECTION 4: NATIVE VEGA ARIES C FIRMWARE SOURCE CODE */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-md space-y-4">
        <div className="flex justify-between items-center border-b border-slate-200 pb-3">
          <h3 className="font-outfit text-base font-extrabold text-slate-900 flex items-center gap-2">
            <Code className="w-5 h-5 text-indigo-600" />
            <span>4. C-DAC VEGA ARIES v2.0 Native C Sensor Transmission Firmware</span>
          </h3>
          <button
            onClick={() => copyToClipboard(vegaCFirmware, 'C Firmware')}
            className="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1 font-mono font-bold"
          >
            <Copy className="w-3.5 h-3.5" /> Copy C Code
          </button>
        </div>

        <pre className="bg-slate-900 text-cyan-300 p-4 rounded-2xl overflow-x-auto text-[11px] font-mono leading-relaxed max-h-96 border border-slate-800">
          {vegaCFirmware}
        </pre>
      </div>

    </div>
  );
}

export default IntegrationGuidePage;
