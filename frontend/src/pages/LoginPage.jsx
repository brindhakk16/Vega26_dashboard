import React, { useState } from 'react';
import { UserCheck, Stethoscope, Heart, Lock, Mail, ShieldAlert, ArrowRight, Activity, CheckCircle2 } from 'lucide-react';

export function LoginPage({ onLogin }) {
  const [role, setRole] = useState('doctor'); // 'doctor' or 'patient'
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [patientId, setPatientId] = useState('PAT-9842');

  const handleSubmit = (e) => {
    e.preventDefault();
    const userEmail = email || (role === 'doctor' ? 'dr.jenkins@hospital.org' : 'parent@cradlesense.io');
    const userName = fullName || (role === 'doctor' ? 'Dr. Sarah Jenkins' : 'Alex Johnson (Parent)');
    
    onLogin({
      email: userEmail,
      name: userName,
      role: role,
      patientId: patientId || 'PAT-9842'
    });
  };

  const handleOAuthLogin = (provider) => {
    onLogin({
      email: `${provider.toLowerCase()}user@example.com`,
      name: role === 'doctor' ? `Dr. ${provider} User` : `${provider} Parent User`,
      role: role,
      patientId: 'PAT-9842'
    });
  };

  return (
    <div className="min-h-screen bg-[#080312] text-[#f1f0f7] flex flex-col items-center justify-center p-4 font-jakarta relative overflow-hidden select-none">
      
      {/* Background Neon Glowing Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-700/20 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md space-y-6 z-10">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-3xl bg-gradient-to-br from-violet-600 to-indigo-800 border border-violet-400/40 shadow-[0_0_25px_rgba(168,85,247,0.4)] mb-2">
            <Activity className="w-8 h-8 text-white animate-pulse" />
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold font-outfit uppercase tracking-tight text-white">
            SMART HEALTH & SAFETY
          </h1>
          <p className="text-xs text-violet-300/70 font-sans">
            Real-Time Environmental & Human Monitoring Portal
          </p>
        </div>

        {/* Role Selector Tabs (Doctor vs Patient/Parent) */}
        <div className="bg-[#120726]/90 border border-violet-900/60 p-1.5 rounded-2xl flex gap-1 shadow-xl backdrop-blur-xl">
          <button
            type="button"
            onClick={() => setRole('doctor')}
            className={`flex-1 py-2.5 px-3 rounded-xl font-outfit font-bold text-xs flex items-center justify-center gap-2 transition-all ${
              role === 'doctor'
                ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-[0_0_20px_rgba(147,51,234,0.5)] border border-violet-400/40'
                : 'text-violet-300/70 hover:text-white hover:bg-violet-950/40'
            }`}
          >
            <Stethoscope className="w-4 h-4" />
            <span>Doctor / Physician</span>
          </button>

          <button
            type="button"
            onClick={() => setRole('patient')}
            className={`flex-1 py-2.5 px-3 rounded-xl font-outfit font-bold text-xs flex items-center justify-center gap-2 transition-all ${
              role === 'patient'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.5)] border border-violet-400/40'
                : 'text-violet-300/70 hover:text-white hover:bg-violet-950/40'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>Patient / Parent</span>
          </button>
        </div>

        {/* AUTH CARD FORM CONTAINER */}
        <div className="bg-[#120726]/95 text-white rounded-[32px] p-6 sm:p-8 shadow-[0_0_50px_rgba(126,34,206,0.25)] space-y-5 border border-violet-800/50 backdrop-blur-2xl">
          
          <div className="text-center space-y-1">
            <h2 className="text-xl font-extrabold font-outfit text-white">
              {isSignUp ? 'Create Your Account' : `Sign in as ${role === 'doctor' ? 'Doctor' : 'Patient/Parent'}`}
            </h2>
            <p className="text-xs text-violet-300/70 font-sans">
              {role === 'doctor' 
                ? 'Access clinical patient diagnostics, telemetry & sensor arrays'
                : 'View live vital monitoring, baby environment & room safety data'
              }
            </p>
          </div>

          {/* Social Login Buttons */}
          <div className="space-y-2.5">
            <button
              type="button"
              onClick={() => handleOAuthLogin('Google')}
              className="w-full py-2.5 px-4 rounded-2xl border border-violet-800/60 hover:border-violet-600 bg-[#1a0c38] hover:bg-[#251050] text-violet-100 font-semibold text-xs flex items-center justify-center gap-3 transition-all shadow-sm active:scale-98"
            >
              {/* Google Colored Logo SVG */}
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>Continue with Google</span>
            </button>

            <button
              type="button"
              onClick={() => handleOAuthLogin('Facebook')}
              className="w-full py-2.5 px-4 rounded-2xl border border-violet-800/60 hover:border-violet-600 bg-[#1a0c38] hover:bg-[#251050] text-violet-100 font-semibold text-xs flex items-center justify-center gap-3 transition-all shadow-sm active:scale-98"
            >
              {/* Facebook Logo SVG */}
              <svg className="w-4 h-4 fill-[#1877F2]" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <span>Continue with Facebook</span>
            </button>
          </div>

          {/* OR Divider Line */}
          <div className="relative flex py-1 items-center justify-center">
            <div className="flex-grow border-t border-violet-900/60"></div>
            <span className="flex-shrink mx-4 text-[11px] font-bold text-violet-400/60 uppercase tracking-widest">OR</span>
            <div className="flex-grow border-t border-violet-900/60"></div>
          </div>

          {/* Direct Email Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {isSignUp && (
              <div>
                <label className="block text-xs font-semibold text-violet-200 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder={role === 'doctor' ? 'Dr. Sarah Jenkins' : 'Alex Johnson'}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-violet-800/70 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 text-xs font-sans text-white placeholder-violet-400/40 bg-[#0b0416] transition-all outline-none"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-violet-200 mb-1">Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-3 text-violet-400" />
                <input
                  type="email"
                  required
                  placeholder={role === 'doctor' ? 'doctor@hospital.org' : 'you@example.com'}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-violet-800/70 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 text-xs font-sans text-white placeholder-violet-400/40 bg-[#0b0416] transition-all outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-violet-200 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-3 text-violet-400" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-violet-800/70 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 text-xs font-sans text-white placeholder-violet-400/40 bg-[#0b0416] transition-all outline-none"
                />
              </div>
            </div>

            {role === 'patient' && (
              <div>
                <label className="block text-xs font-semibold text-violet-200 mb-1">Patient Monitoring ID</label>
                <input
                  type="text"
                  placeholder="PAT-9842"
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-violet-800/70 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 text-xs font-sans text-white placeholder-violet-400/40 bg-[#0b0416] transition-all outline-none"
                />
              </div>
            )}

            {/* Sign in Button */}
            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-outfit font-bold text-xs shadow-[0_0_20px_rgba(147,51,234,0.45)] border border-violet-400/40 transition-all flex items-center justify-center gap-2 active:scale-98"
            >
              <span>{isSignUp ? 'Create Account & Access Workstation' : `Sign in as ${role === 'doctor' ? 'Doctor' : 'Parent/Patient'}`}</span>
              <ArrowRight className="w-4 h-4 text-violet-200" />
            </button>
          </form>

          {/* Footer Links */}
          <div className="flex items-center justify-between pt-2 text-[11px] text-violet-400/70 font-sans">
            <button 
              type="button"
              onClick={() => alert('Password reset link sent to your registered email address.')}
              className="hover:text-violet-200 transition-colors font-medium"
            >
              Forgot password?
            </button>

            <button 
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="hover:text-white transition-colors font-semibold text-violet-300"
            >
              {isSignUp ? 'Already have an account? Sign in' : 'Need an account? Sign up'}
            </button>
          </div>

        </div>

        {/* Quick Demo Access Bar */}
        <div className="bg-[#0e0520]/90 border border-violet-900/60 p-4 rounded-2xl text-xs space-y-2 backdrop-blur-xl">
          <div className="text-violet-400/70 font-mono text-[10px] uppercase font-bold text-center">QUICK ONE-CLICK DEMO SIGN IN</div>
          <div className="grid grid-cols-2 gap-2 font-mono">
            <button
              type="button"
              onClick={() => onLogin({ email: 'dr.jenkins@hospital.org', name: 'Dr. Sarah Jenkins', role: 'doctor', patientId: 'PAT-9842' })}
              className="px-3 py-2 rounded-xl bg-violet-950/60 hover:bg-violet-900/60 border border-violet-800/60 text-violet-300 font-bold text-[11px] flex items-center justify-center gap-1.5 transition-all shadow-sm"
            >
              <Stethoscope className="w-3.5 h-3.5 text-violet-400" />
              <span>Doctor Demo</span>
            </button>

            <button
              type="button"
              onClick={() => onLogin({ email: 'parent@cradlesense.io', name: 'Alex Johnson (Parent)', role: 'patient', patientId: 'PAT-9842' })}
              className="px-3 py-2 rounded-xl bg-violet-950/60 hover:bg-violet-900/60 border border-violet-800/60 text-purple-300 font-bold text-[11px] flex items-center justify-center gap-1.5 transition-all shadow-sm"
            >
              <Heart className="w-3.5 h-3.5 text-purple-400" />
              <span>Parent Demo</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}

export default LoginPage;
