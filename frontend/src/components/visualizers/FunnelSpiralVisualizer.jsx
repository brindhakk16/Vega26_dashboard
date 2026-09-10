import React from 'react';

export function FunnelSpiralVisualizer() {
  return (
    <div className="relative w-full h-24 flex items-center justify-center overflow-hidden select-none pointer-events-none">
      <svg
        viewBox="0 0 160 110"
        className="w-36 h-24 text-white/70"
      >
        <defs>
          <radialGradient id="funnelGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#D4FF00" stopOpacity="1" />
            <stop offset="100%" stopColor="#D4FF00" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Vertical Axis Line */}
        <line x1="80" y1="10" x2="80" y2="95" stroke="rgba(255,255,255,0.3)" strokeDasharray="2 2" />

        {/* Stacked Concentric Ellipses forming a 3D Funnel Cone */}
        <ellipse cx="80" cy="18" rx="55" ry="12" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
        <ellipse cx="80" cy="32" rx="45" ry="10" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1" />
        <ellipse cx="80" cy="46" rx="36" ry="8" fill="none" stroke="rgba(255,255,255,0.65)" strokeWidth="1" />
        <ellipse cx="80" cy="60" rx="26" ry="6" fill="none" stroke="rgba(255,255,255,0.75)" strokeWidth="1.2" />
        <ellipse cx="80" cy="74" rx="16" ry="4" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="1.2" />

        {/* Bottom Node Glow (#D4FF00) */}
        <circle cx="80" cy="88" r="8" fill="url(#funnelGlow)" opacity="0.8" />
        <circle cx="80" cy="88" r="3.5" fill="#D4FF00" />
        <circle cx="80" cy="88" r="1.5" fill="#FFFFFF" />
      </svg>
    </div>
  );
}
