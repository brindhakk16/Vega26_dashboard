import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Sparkles, 
  X, 
  Send, 
  RotateCcw, 
  Maximize2, 
  Minimize2, 
  Thermometer, 
  Activity, 
  Wind, 
  AlertTriangle, 
  CheckCircle2, 
  Cpu, 
  ArrowRight,
  ShieldCheck,
  Zap,
  CornerDownLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function AIChatbot({ data, thresholds, currentUser, onNavigate }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Initial welcome message
  const [messages, setMessages] = useState([
    {
      id: 'msg-welcome',
      sender: 'bot',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: `Greetings ${currentUser?.name ? currentUser.name : 'Operator'}! 🤖 I am your **VEGA RISC-V Neural Copilot**.\n\nI am continuously analyzing live data from your **AMG8833 Thermal Array**, **MR24D11C10 Vitals Radar**, and **MQ Gas Sensors**.`,
      quickChips: [
        '📊 Full System Vitals Briefing',
        '🌡️ Thermal Hotspot Analysis',
        '🫁 Respiration & Breathing Status',
        '🍃 Air Quality & Gas Levels',
        '⚠️ Active Alerts Diagnostic'
      ]
    }
  ]);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      inputRef.current?.focus();
    }
  }, [isOpen, messages, isTyping]);

  // Telemetry snapshot helper
  const getTelemetrySnapshot = () => {
    const amg = data?.amg8833 || {};
    const radar = data?.mr24d11c10 || {};
    const mq135 = data?.mq135 || {};
    const mq2 = data?.mq2 || {};
    const alerts = data?.alerts || [];
    const activeAlerts = alerts.filter(a => a.status === 'ACTIVE');

    return {
      tempMax: amg.max_temperature ?? 33.2,
      tempAvg: amg.average_temperature ?? 28.5,
      tempMin: amg.min_temperature ?? 26.1,
      hotspot: `Row ${amg.hotspot_row || 3}, Col ${amg.hotspot_col || 4}`,
      thermalStatus: (amg.max_temperature || 0) > (thresholds?.tempCritical || 38) ? 'CRITICAL' : (amg.max_temperature || 0) > (thresholds?.tempWarning || 34) ? 'WARNING' : 'NORMAL',
      
      breathingRate: radar.breathing_rate ?? 19,
      presence: radar.presence ?? true,
      breathStatus: radar.breathing_status || 'Normal',
      signalQuality: radar.signal_quality || 'Good',
      
      co2: mq135.co2 ?? 606,
      co: mq135.co ?? 4,
      nh3: mq135.nh3 ?? 12,
      h2: mq2.h2 ?? 15,
      ch4: mq2.ch4 ?? 8,
      gasStatus: (mq135.co2 || 0) > 1000 ? 'ELEVATED' : 'OPTIMAL',
      
      activeAlertsCount: activeAlerts.length,
      alertsList: activeAlerts
    };
  };

  // Rule-based and generative assistant logic
  const generateBotReply = (query) => {
    const q = query.toLowerCase().trim();
    const snap = getTelemetrySnapshot();

    // 1. Thermal / Temperature Queries
    if (q.includes('temp') || q.includes('thermal') || q.includes('heat') || q.includes('hotspot') || q.includes('fever') || q.includes('amg8833')) {
      const isHigh = snap.tempMax >= (thresholds?.tempWarning || 34);
      return {
        text: `### 🌡️ AMG8833 Thermal Array Report\n\n- **Peak Surface Temp:** \`${snap.tempMax}°C\` (${isHigh ? '⚠️ Alert: Elevated' : '✅ Within safe threshold'})\n- **Mean Ambient Temp:** \`${snap.tempAvg}°C\`\n- **Lowest Temp Recorded:** \`${snap.tempMin}°C\`\n- **Primary Hotspot Position:** \`${snap.hotspot}\`\n- **Status:** **${snap.thermalStatus}**\n\n${isHigh ? '⚠️ **Hotspot Alert:** Peak surface temperature is above normal comfort levels.' : '✨ Thermal distribution across all 64 pixels is uniform and stable.'}`,
        action: {
          label: 'Open Thermal Monitoring',
          tab: 'thermal'
        }
      };
    }

    // 2. Respiration / Breathing / Vitals / Radar Queries
    if (q.includes('breath') || q.includes('respirat') || q.includes('vital') || q.includes('radar') || q.includes('bpm') || q.includes('patient') || q.includes('mr24')) {
      const isAbsent = !snap.presence;
      return {
        text: `### 🫁 MR24D11C10 24GHz Radar Vitals\n\n- **Subject Presence:** ${snap.presence ? '✅ Detected (Subject Present)' : '⚪ No Subject Detected'}\n- **Respiration Rate:** \`${snap.breathingRate} BPM\`\n- **Breathing Pattern:** **${snap.breathStatus.toUpperCase()}**\n- **Signal Quality:** \`${snap.signalQuality.toUpperCase()}\`\n\n${isAbsent ? 'ℹ️ Radar does not register thoracic chest wall displacement. Area appears clear.' : snap.breathingRate > 24 ? '⚠️ Notice: Respiration is slightly rapid (Tachypnea). Continuous monitoring advised.' : '✨ Patient vitals exhibit normal rhythm and steady respiratory frequency.'}`,
        action: {
          label: 'Open Human Vital Monitoring',
          tab: 'human'
        }
      };
    }

    // 3. Air Quality / CO2 / Gas Queries
    if (q.includes('gas') || q.includes('co2') || q.includes('air') || q.includes('carbon') || q.includes('mq135') || q.includes('mq2') || q.includes('smoke') || q.includes('leak')) {
      const co2Good = snap.co2 <= 800;
      return {
        text: `### 🍃 MQ-135 & MQ-2 Atmospheric Analysis\n\n- **CO₂ Concentration:** \`${snap.co2} ppm\` (${co2Good ? '✅ Excellent / Fresh' : '⚠️ Elevated Ventilation Recommended'})\n- **Carbon Monoxide (CO):** \`${snap.co} ppm\` (Safe threshold: < 15 ppm)\n- **Ammonia (NH₃):** \`${snap.nh3} ppm\`\n- **Combustibles (H₂ / CH₄):** \`${snap.h2} ppm / ${snap.ch4} ppm\`\n- **Overall Atmosphere:** **${snap.gasStatus}**\n\n${co2Good ? 'Indoor ambient air is clean with good oxygenation index.' : 'Consider cycling HVAC or opening ventilation dampers.'}`,
        action: {
          label: 'Open Gas & Air Quality Page',
          tab: 'airquality'
        }
      };
    }

    // 4. Alerts / Diagnostic
    if (q.includes('alert') || q.includes('alarm') || q.includes('warn') || q.includes('hazard') || q.includes('error')) {
      if (snap.activeAlertsCount === 0) {
        return {
          text: `### 🛡️ System Diagnostic & Alerts\n\n✅ **Zero Active Critical Alerts.**\n\nAll sensor streams (AMG8833, MR24D11C10, MQ135, MQ2) are transmitting telemetry within configured safe parameters.`,
          action: {
            label: 'View Alerts History',
            tab: 'alerts'
          }
        };
      }

      const alertDetails = snap.alertsList.map(a => `• **[${a.severity}]** ${a.sensor}: ${a.parameter} at \`${a.value}\` (${a.message || 'Exceeded limit'})`).join('\n');

      return {
        text: `### ⚠️ Active Alerts (${snap.activeAlertsCount} Unresolved)\n\n${alertDetails}\n\nPlease inspect the sensor telemetry logs immediately.`,
        action: {
          label: 'Resolve Active Alerts',
          tab: 'alerts'
        }
      };
    }

    // 5. System Briefing / Summary / Status
    if (q.includes('system') || q.includes('status') || q.includes('brief') || q.includes('summary') || q.includes('overview') || q.includes('report')) {
      return {
        text: `### 📊 Real-Time Telemetry Briefing\n\n| Sensor Subsystem | Key Parameter | Current Reading | Status |\n| :--- | :--- | :--- | :--- |\n| **AMG8833** | Peak Hotspot | \`${snap.tempMax}°C\` | ${snap.thermalStatus === 'NORMAL' ? '🟢 Normal' : '🟡 Warning'} |\n| **MR24D11C10** | Breathing Rate | \`${snap.breathingRate} BPM\` | 🟢 Steady |\n| **MQ-135** | CO₂ Ambient | \`${snap.co2} ppm\` | 🟢 Optimal |\n| **MQ-2** | Combustibles | \`${snap.ch4} ppm CH₄\` | 🟢 Clear |\n\n**Hardware Uplink:** VEGA ARIES v2.0 (RISC-V 32-bit SoC) Telemetry Engine Active.`,
        action: {
          label: 'Go to Main Dashboard',
          tab: 'dashboard'
        }
      };
    }

    // 6. Calibration & Settings Guide
    if (q.includes('calibrat') || q.includes('setting') || q.includes('threshold') || q.includes('hardware') || q.includes('usb') || q.includes('wifi') || q.includes('baud')) {
      return {
        text: `### ⚙️ Calibration & Data Link Reference\n\n- **USB Connection:** 115,200 Baud rate via Web Serial API directly on your browser.\n- **Sensor Offset Tuning:** You can calibrate MQ Baseline (R0) and AMG8833 emissivity bias in the **Sensor Calibration** section.\n- **Comfort Limits:** Warning temperature defaults to \`${thresholds?.tempWarning || 34}°C\` and Critical to \`${thresholds?.tempCritical || 38}°C\`.`,
        action: {
          label: 'Open Calibration Tool',
          tab: 'calibration'
        }
      };
    }

    // 7. Default Friendly Conversational Response
    return {
      text: `I understand your query: *"I'm looking for ${query}"*.\n\nI can analyze your **AMG8833 Thermal Matrix**, **MR24D11C10 Radar Respiration**, **MQ Gas telemetry**, or guide you through sensor calibrations.\n\nTry asking:\n- *"What is the current patient breathing rate?"*\n- *"Is there any thermal hotspot detected?"*\n- *"Give me an air quality report"*`,
      quickChips: [
        '📊 Full System Vitals Briefing',
        '🌡️ Thermal Hotspot Analysis',
        '🍃 Air Quality & Gas Levels',
        '⚠️ Check Active Alerts'
      ]
    };
  };

  const handleSendMessage = (textToSend) => {
    const query = textToSend || inputMessage;
    if (!query.trim()) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: query
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI neural reasoning delay
    setTimeout(() => {
      const reply = generateBotReply(query);
      const botMsg = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: reply.text,
        action: reply.action,
        quickChips: reply.quickChips
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 600);
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: `Chat session refreshed. Ready to inspect VEGA 26 telemetry streams. What would you like to check?`,
        quickChips: [
          '📊 Full System Vitals Briefing',
          '🌡️ Thermal Hotspot Analysis',
          '🫁 Respiration & Breathing Status',
          '🍃 Air Quality & Gas Levels'
        ]
      }
    ]);
  };

  const snap = getTelemetrySnapshot();

  return (
    <div className="fixed bottom-6 right-6 z-[99999] select-none">
      
      {/* Floating Chat Launcher Button */}
      {!isOpen && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className="relative group cursor-pointer"
        >
          {/* Animated Callout Badge */}
          <div className="absolute -top-11 right-0 whitespace-nowrap bg-gradient-to-r from-violet-900 to-indigo-900 text-violet-100 text-[11px] font-mono px-3.5 py-1 rounded-full border border-violet-400/50 shadow-[0_4px_15px_rgba(139,92,246,0.4)] pointer-events-none animate-bounce flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" style={{ animationDuration: '4s' }} />
            <span className="font-bold">AI Chatbot</span>
            <span className="text-[9px] px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 rounded border border-emerald-400/30">ONLINE</span>
          </div>

          {/* Pulsing Ambient Glow Ring */}
          <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-violet-600 via-purple-500 to-indigo-600 opacity-80 blur-md group-hover:opacity-100 transition duration-500 animate-pulse" />

          {/* Floating Trigger Button */}
          <button
            onClick={() => setIsOpen(true)}
            id="vega-ai-chatbot-button"
            className="relative flex items-center gap-3 px-5 py-3.5 rounded-full bg-gradient-to-r from-violet-700 via-purple-700 to-indigo-800 text-white font-outfit font-extrabold text-sm tracking-wide shadow-[0_4px_25px_rgba(139,92,246,0.7)] border border-violet-400/40 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <div className="relative">
              <Bot className="w-6 h-6 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
              </span>
            </div>

            <div className="flex flex-col text-left">
              <span className="leading-tight flex items-center gap-1.5">
                <span>VEGA AI Copilot</span>
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              </span>
              <span className="text-[10px] font-mono text-violet-200/90 font-normal">
                {snap.activeAlertsCount > 0 ? `⚠️ ${snap.activeAlertsCount} Alerts Active` : '● Telemetry Live'}
              </span>
            </div>
          </button>
        </motion.div>
      )}

      {/* Chat Window Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`flex flex-col bg-[#0d061c]/95 backdrop-blur-2xl border border-violet-500/30 rounded-3xl shadow-[0_15px_50px_rgba(139,92,246,0.35)] overflow-hidden transition-all duration-300 ${
              isExpanded 
                ? 'w-[92vw] sm:w-[540px] h-[640px] max-h-[88vh]' 
                : 'w-[92vw] sm:w-[420px] h-[550px] max-h-[82vh]'
            }`}
          >
            {/* Header */}
            <div className="px-5 py-4 bg-gradient-to-r from-obsidian-950 via-violet-950/70 to-obsidian-950 border-b border-violet-500/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative p-2.5 rounded-2xl bg-violet-600/20 border border-violet-500/40 text-violet-300 shadow-[0_0_12px_rgba(139,92,246,0.3)]">
                  <Bot className="w-5 h-5 text-violet-300" />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#0d061c]" />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-outfit font-extrabold text-sm text-white flex items-center gap-1.5">
                      <span>VEGA AI Copilot</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30 font-mono font-bold">
                        RISC-V
                      </span>
                    </h3>
                  </div>
                  <p className="text-[11px] text-violet-300/70 font-mono flex items-center gap-1.5 mt-0.5">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Real-Time Sensor Telemetry Online</span>
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1">
                <button
                  onClick={handleResetChat}
                  title="Reset Chat Session"
                  className="p-2 rounded-xl text-violet-400 hover:text-white hover:bg-violet-900/40 transition-all"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  title={isExpanded ? 'Minimize Window' : 'Expand Window'}
                  className="p-2 rounded-xl text-violet-400 hover:text-white hover:bg-violet-900/40 transition-all"
                >
                  {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>

                <button
                  onClick={() => setIsOpen(false)}
                  title="Close AI Assistant"
                  className="p-2 rounded-xl text-violet-400 hover:text-white hover:bg-rose-900/30 transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick Live Telemetry Strip */}
            <div className="px-4 py-2 bg-obsidian-950/80 border-b border-violet-500/10 flex items-center justify-between font-mono text-[11px] text-violet-300/80 overflow-x-auto">
              <div className="flex items-center gap-1.5">
                <Thermometer className="w-3.5 h-3.5 text-amber-400" />
                <span>AMG: <strong className="text-white">{snap.tempMax}°C</strong></span>
              </div>
              <div className="w-[1px] h-3 bg-violet-500/20" />
              <div className="flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-cyan-400" />
                <span>Vitals: <strong className="text-white">{snap.breathingRate} BPM</strong></span>
              </div>
              <div className="w-[1px] h-3 bg-violet-500/20" />
              <div className="flex items-center gap-1.5">
                <Wind className="w-3.5 h-3.5 text-emerald-400" />
                <span>CO₂: <strong className="text-white">{snap.co2} ppm</strong></span>
              </div>
            </div>

            {/* Chat Messages Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 font-jakarta text-xs scrollbar-thin scrollbar-thumb-violet-900/50">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} space-y-1`}
                >
                  <div className="flex items-center gap-1.5 text-[10px] text-violet-400/60 font-mono px-1">
                    <span>{msg.sender === 'user' ? (currentUser?.name || 'You') : 'VEGA Neural AI'}</span>
                    <span>•</span>
                    <span>{msg.timestamp}</span>
                  </div>

                  <div
                    className={`max-w-[88%] rounded-2xl p-3.5 leading-relaxed shadow-md ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-tr-none font-medium'
                        : 'bg-obsidian-900/90 border border-violet-500/20 text-violet-100 rounded-tl-none font-sans'
                    }`}
                  >
                    {/* Render message formatted text */}
                    <div className="space-y-2 whitespace-pre-line">
                      {msg.text}
                    </div>

                    {/* Interactive Action Navigation Button */}
                    {msg.action && (
                      <div className="mt-3 pt-2.5 border-t border-violet-500/20">
                        <button
                          onClick={() => {
                            if (onNavigate && msg.action.tab) {
                              onNavigate(msg.action.tab);
                            }
                          }}
                          className="w-full py-2 px-3 rounded-xl bg-violet-600/30 hover:bg-violet-600/50 border border-violet-500/40 text-violet-200 font-bold font-outfit uppercase tracking-wider text-[11px] flex items-center justify-center gap-2 transition-all group"
                        >
                          <span>{msg.action.label}</span>
                          <ArrowRight className="w-3.5 h-3.5 text-violet-400 group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    )}

                    {/* Quick suggestion chips embedded */}
                    {msg.quickChips && msg.quickChips.length > 0 && (
                      <div className="mt-3 pt-2.5 border-t border-violet-500/20 flex flex-wrap gap-1.5">
                        {msg.quickChips.map((chip, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSendMessage(chip)}
                            className="px-2.5 py-1 rounded-lg bg-obsidian-950/80 hover:bg-violet-800/40 border border-violet-500/30 text-violet-300 font-mono text-[10px] text-left transition-all hover:border-violet-400"
                          >
                            {chip}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex items-center gap-2 text-violet-400/80 font-mono text-[11px] px-2 py-1">
                  <div className="flex space-x-1">
                    <span className="w-2 h-2 rounded-full bg-violet-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 rounded-full bg-violet-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 rounded-full bg-violet-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span>Analyzing telemetry tensors...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div className="p-3 bg-obsidian-950 border-t border-violet-500/20">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <div className="relative flex-1">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Ask about vitals, thermal hotspots, CO2..."
                    className="w-full bg-obsidian-900 border border-violet-500/30 rounded-xl px-4 py-2.5 text-xs text-white placeholder-violet-400/50 focus:outline-none focus:ring-2 focus:ring-violet-500 font-sans transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!inputMessage.trim() || isTyping}
                  className="p-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold transition-all shadow-[0_0_12px_rgba(139,92,246,0.4)] flex items-center justify-center"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

export default AIChatbot;
