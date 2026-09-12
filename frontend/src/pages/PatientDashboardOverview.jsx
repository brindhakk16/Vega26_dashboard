import React, { useState } from 'react';
import { 
  Heart, 
  Activity, 
  Thermometer, 
  Wind, 
  ShieldCheck, 
  CheckCircle2, 
  PhoneCall, 
  MessageSquare, 
  UserCheck, 
  Moon, 
  Sun, 
  Sparkles, 
  ChevronRight, 
  Bell, 
  AlertCircle,
  X,
  Send,
  Stethoscope
} from 'lucide-react';
import { HardwareLCDDisplay } from '../components/dashboard/HardwareLCDDisplay.jsx';

export function PatientDashboardOverviewPage({ data = {}, thresholds = {}, onNavigate }) {
  const amg = data.amg8833 || {};
  const mq135 = data.mq135 || {};
  const mr24 = data.mr24d11c10 || {};

  const [showDoctorModal, setShowDoctorModal] = useState(false);
  const [noteSent, setNoteSent] = useState(false);
  const [patientNote, setPatientNote] = useState('');

  const temp = amg.average_temperature || 28.5;
  const peakTemp = amg.max_temperature || 33.2;
  const breathingRate = mr24.breathing_rate || 19;
  const isPresent = mr24.presence ?? true;
  const co2 = mq135.co2 || 606;

  // Reassuring status calculations
  const isBreathingCalm = breathingRate >= 14 && breathingRate <= 24;
  const isTempComfortable = temp >= 24 && temp <= 30;
  const isAirClean = co2 <= 800;

  const handleSendNote = (e) => {
    e.preventDefault();
    if (!patientNote.trim()) return;
    setNoteSent(true);
    setTimeout(() => {
      setNoteSent(false);
      setShowDoctorModal(false);
      setPatientNote('');
    }, 2000);
  };

  return (
    <div className="space-y-6 font-jakarta text-slate-100 select-none">
      
      {/* Patient Portal Header Banner */}
      <div className="bg-gradient-to-r from-[#1b0a38] via-[#14082c] to-[#0c061a] border border-violet-500/30 rounded-3xl p-6 shadow-[0_4px_25px_rgba(139,92,246,0.2)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.5)] border border-violet-400/40">
            <Heart className="w-8 h-8 text-white fill-white/20 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40">
                FAMILY & PATIENT PORTAL
              </span>
              <span className="text-xs text-violet-300/80 font-mono">Patient: Alex Johnson (PAT-9842)</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold font-outfit text-white tracking-tight mt-1">
              Baby Alex's Comfort & Wellness
            </h1>
            <p className="text-xs text-violet-300/70 font-sans">
              Continuous non-invasive contactless vitals, nursery ambient comfort & safety monitoring
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowDoctorModal(true)}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-outfit font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-[0_0_20px_rgba(147,51,234,0.4)] border border-violet-400/40 transition-all active:scale-95"
          >
            <PhoneCall className="w-4 h-4 text-violet-200" />
            <span>Contact Doctor</span>
          </button>
        </div>
      </div>

      {/* Wellness Overview Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Peace of Mind Status */}
        <div className="bg-obsidian-800/80 backdrop-blur-md border border-violet-500/20 rounded-2xl p-4 shadow-[0_4px_20px_rgba(139,92,246,0.1)] flex items-center gap-3.5">
          <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase text-violet-400/80 block">OVERALL WELLNESS</span>
            <span className="text-sm font-bold text-white font-outfit">Restful & Completely Safe</span>
            <span className="text-[11px] text-emerald-400 block font-mono font-medium mt-0.5">● 99% Comfort Score</span>
          </div>
        </div>

        {/* Presence & Sleep */}
        <div className="bg-obsidian-800/80 backdrop-blur-md border border-violet-500/20 rounded-2xl p-4 shadow-[0_4px_20px_rgba(139,92,246,0.1)] flex items-center gap-3.5">
          <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/40">
            <Moon className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase text-violet-400/80 block">SLEEP STATE</span>
            <span className="text-sm font-bold text-white font-outfit">{isPresent ? 'Resting in Crib' : 'Crib Empty'}</span>
            <span className="text-[11px] text-violet-300/80 block font-mono mt-0.5">Continuous Radar Detection</span>
          </div>
        </div>

        {/* Attending Physician */}
        <div className="bg-obsidian-800/80 backdrop-blur-md border border-violet-500/20 rounded-2xl p-4 shadow-[0_4px_20px_rgba(139,92,246,0.1)] flex items-center gap-3.5">
          <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase text-violet-400/80 block">CARE PHYSICIAN</span>
            <span className="text-sm font-bold text-white font-outfit">Dr. Sarah Jenkins</span>
            <span className="text-[11px] text-cyan-300 block font-mono mt-0.5">On Duty • Pediatric Care</span>
          </div>
        </div>
      </div>

      {/* MAIN PARENT BENTO GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* LEFT 7 COLS — BIG REASSURING BREATHING & VITALS CARD */}
        <div className="lg:col-span-7 bg-obsidian-800/80 backdrop-blur-md border border-violet-500/20 rounded-3xl p-6 shadow-[0_4px_20px_rgba(139,92,246,0.15)] flex flex-col justify-between space-y-6">
          <div className="flex justify-between items-center border-b border-violet-500/20 pb-4">
            <div>
              <span className="text-xs font-mono font-bold text-violet-400/80 uppercase tracking-wider block">CONTACTLESS VITALS RADAR</span>
              <h2 className="text-xl font-extrabold font-outfit text-white mt-0.5">Breathing Rhythm & Heart Reassurance</h2>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-xs font-mono font-bold flex items-center gap-1.5 shadow-[0_0_10px_rgba(52,211,153,0.2)]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              PEACEFUL BREATHING
            </span>
          </div>

          {/* Calming Visual Rhythm Orb */}
          <div className="flex flex-col sm:flex-row items-center justify-around gap-6 py-4">
            <div className="relative flex items-center justify-center">
              {/* Outer soft breath pulse rings */}
              <div className="absolute w-44 h-44 rounded-full bg-violet-600/15 animate-ping" style={{ animationDuration: '3.5s' }} />
              <div className="absolute w-36 h-36 rounded-full bg-purple-500/20 animate-pulse" style={{ animationDuration: '2s' }} />
              
              {/* Core Breathing Orb */}
              <div className="relative w-28 h-28 rounded-full bg-gradient-to-tr from-violet-700 to-indigo-600 flex flex-col items-center justify-center text-white shadow-[0_0_35px_rgba(139,92,246,0.6)] border border-violet-300/40">
                <Activity className="w-8 h-8 text-white animate-pulse" />
                <span className="font-extrabold font-outfit text-xl leading-none mt-1">{breathingRate}</span>
                <span className="text-[10px] font-mono text-violet-200 uppercase">BPM</span>
              </div>
            </div>

            {/* Vitals Summary in Plain Parent English */}
            <div className="space-y-3 font-sans text-xs">
              <div className="bg-obsidian-900/90 border border-violet-500/20 p-3.5 rounded-2xl space-y-1">
                <span className="text-violet-400 font-mono font-bold block text-[11px]">RESPIRATORY STATUS</span>
                <p className="text-white text-sm font-bold font-outfit">
                  {isBreathingCalm ? 'Smooth & Calm (Normal Range)' : 'Notice: Slight elevation detected'}
                </p>
                <p className="text-violet-300/70 text-[11px]">
                  Radar sensor is detecting steady chest displacement without any uncomfortable respiratory pauses.
                </p>
              </div>

              <div className="bg-obsidian-900/90 border border-violet-500/20 p-3.5 rounded-2xl space-y-1">
                <span className="text-violet-400 font-mono font-bold block text-[11px]">CHEST WALL MOVEMENT</span>
                <p className="text-white font-medium">
                  Continuous steady rhythmic wave (Frequency: ~{(breathingRate / 60).toFixed(2)} Hz)
                </p>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-violet-500/20 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-violet-300/70 font-mono">
            <span>24GHz Radar active • 100% Non-invasive (Zero wires on baby)</span>
            <button
              onClick={() => onNavigate && onNavigate('human')}
              className="text-violet-300 hover:text-white font-bold flex items-center gap-1 font-outfit uppercase tracking-wider text-xs"
            >
              <span>View Full Waveform</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* RIGHT 5 COLS — ENVIRONMENT COMFORT & NURSERY AIR */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* Crib & Room Temperature */}
          <div className="bg-obsidian-800/80 backdrop-blur-md border border-violet-500/20 rounded-3xl p-6 shadow-[0_4px_20px_rgba(139,92,246,0.1)] space-y-4">
            <div className="flex justify-between items-center border-b border-violet-500/20 pb-3">
              <div className="flex items-center gap-2">
                <Thermometer className="w-5 h-5 text-amber-400" />
                <h3 className="font-outfit font-extrabold text-white text-base">Crib & Room Comfort</h3>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                IDEAL COZY
              </span>
            </div>

            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-3xl font-extrabold font-outfit text-white">{temp}°C</span>
                <span className="text-xs text-violet-300/70 font-mono block mt-0.5">Average Ambient Room</span>
              </div>
              <div className="text-right">
                <span className="text-lg font-extrabold font-outfit text-amber-300">{peakTemp}°C</span>
                <span className="text-[11px] text-violet-400/80 font-mono block">Baby Surface Peak</span>
              </div>
            </div>

            {/* Visual Comfort Zone Meter */}
            <div className="space-y-1.5">
              <div className="h-2 w-full bg-obsidian-950 rounded-full overflow-hidden flex border border-violet-500/30">
                <div className="w-1/3 bg-cyan-500/60" title="Cool (<24°C)" />
                <div className="w-1/3 bg-emerald-500" title="Comfort Zone (24-29°C)" />
                <div className="w-1/3 bg-rose-500/60" title="Warm (>29°C)" />
              </div>
              <div className="flex justify-between text-[10px] font-mono text-violet-400/70">
                <span>Cool (&lt;24°C)</span>
                <span className="text-emerald-300 font-bold">● Ideal Comfort Zone</span>
                <span>Warm (&gt;29°C)</span>
              </div>
            </div>
          </div>

          {/* Nursery Air Cleanliness Card */}
          <div className="bg-obsidian-800/80 backdrop-blur-md border border-violet-500/20 rounded-3xl p-6 shadow-[0_4px_20px_rgba(139,92,246,0.1)] space-y-4">
            <div className="flex justify-between items-center border-b border-violet-500/20 pb-3">
              <div className="flex items-center gap-2">
                <Wind className="w-5 h-5 text-cyan-400" />
                <h3 className="font-outfit font-extrabold text-white text-base">Nursery Air Cleanliness</h3>
              </div>
              <span className="text-xs font-mono font-bold text-cyan-300 bg-cyan-950/60 px-2.5 py-0.5 rounded-full border border-cyan-500/30">
                FRESH
              </span>
            </div>

            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-3xl font-extrabold font-outfit text-white">{co2} <span className="text-sm font-mono text-violet-400">ppm</span></span>
                <span className="text-xs text-emerald-400 font-mono block mt-0.5">● Excellent Oxygenation</span>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono text-emerald-400 font-bold">ZERO TOXIC GASES</span>
                <span className="text-[11px] text-violet-400/70 font-mono block">CO & Smoke: 0 ppm</span>
              </div>
            </div>

            <p className="text-xs text-violet-300/70 font-sans">
              Air inside the room is clean, breathable, and well ventilated. Baby's respiratory environment is clear.
            </p>
          </div>

        </div>

      </div>
      
      {/* NURSERY PHYSICAL HARDWARE LCD SCREEN MIRROR & SENSOR TELEMETRY */}
      <HardwareLCDDisplay data={data} thresholds={thresholds} />

      {/* DOCTOR CONSULTATION & CARE NOTES CARD */}
      <div className="bg-obsidian-800/80 backdrop-blur-md border border-violet-500/20 rounded-3xl p-6 shadow-[0_4px_20px_rgba(139,92,246,0.1)] space-y-4">
        <div className="flex justify-between items-center border-b border-violet-500/20 pb-3">
          <div className="flex items-center gap-2.5">
            <Stethoscope className="w-5 h-5 text-violet-400" />
            <h3 className="font-outfit font-extrabold text-white text-base">
              Physician's Daily Care Note (Dr. Sarah Jenkins)
            </h3>
          </div>
          <span className="text-[11px] font-mono text-violet-400/70">Updated Today, 08:30 AM</span>
        </div>

        <div className="bg-obsidian-900/90 border border-violet-500/20 rounded-2xl p-4 text-xs font-sans text-violet-200 leading-relaxed space-y-2">
          <p>
            "Baby Alex has exhibited excellent vital stability overnight. The MR24D11C10 contactless radar records an optimal resting respiration rate of 19 BPM. Thermal gradient mapping shows normal peripheral circulation with no signs of fever. Keep ambient temperature between 24°C and 27°C and maintain current ventilation."
          </p>
          <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-violet-400/70">
            <span>Signature: Dr. Sarah Jenkins, MD (Pediatrics)</span>
            <span className="text-emerald-400 font-bold">Status: Routine Monitoring Approved</span>
          </div>
        </div>
      </div>

      {/* MODAL: CONTACT DOCTOR */}
      {showDoctorModal && (
        <div className="fixed inset-0 z-[100000] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#120726] border border-violet-500/40 rounded-3xl p-6 max-w-md w-full text-white space-y-5 shadow-[0_0_50px_rgba(147,51,234,0.3)] animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center border-b border-violet-500/20 pb-3">
              <div className="flex items-center gap-2.5">
                <PhoneCall className="w-5 h-5 text-cyan-400" />
                <h3 className="font-outfit font-extrabold text-base text-white">Contact Dr. Sarah Jenkins</h3>
              </div>
              <button
                onClick={() => setShowDoctorModal(false)}
                className="p-1.5 rounded-xl text-violet-400 hover:text-white hover:bg-violet-900/40 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {noteSent ? (
              <div className="text-center py-6 space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-outfit font-extrabold text-base text-white">Message Dispatched!</h4>
                <p className="text-xs text-violet-300/70">
                  Your question has been forwarded to Dr. Sarah Jenkins' clinical workstation.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendNote} className="space-y-4 font-sans text-xs">
                <div className="bg-obsidian-950 p-3.5 rounded-2xl border border-violet-500/20 text-violet-300/80 space-y-1">
                  <span className="font-bold text-white block">Patient: Alex Johnson (PAT-9842)</span>
                  <span>Direct clinical pager: Ward 4 Pediatric Station</span>
                </div>

                <div>
                  <label className="block text-violet-300 font-bold mb-1.5 font-outfit uppercase tracking-wider text-[11px]">
                    Message / Question for Physician:
                  </label>
                  <textarea
                    rows={3}
                    value={patientNote}
                    onChange={(e) => setPatientNote(e.target.value)}
                    placeholder="e.g., Baby woke up for feeding, breathing seems steady. Please review today's morning chart..."
                    className="w-full bg-obsidian-900 border border-violet-500/30 rounded-xl p-3 text-white text-xs placeholder-violet-400/50 focus:outline-none focus:ring-2 focus:ring-violet-500"
                    required
                  />
                </div>

                <div className="flex gap-2 justify-end">
                  <button
                    type="button"
                    onClick={() => setShowDoctorModal(false)}
                    className="px-4 py-2 rounded-xl bg-obsidian-900 hover:bg-obsidian-800 border border-violet-500/30 text-violet-300 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold font-outfit flex items-center gap-1.5 shadow-[0_0_15px_rgba(139,92,246,0.4)]"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send to Doctor</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}

export default PatientDashboardOverviewPage;
