import React from 'react';

export function OrbitalLoopVisualizer() {
  return (
    <div className="relative w-full h-24 flex items-center justify-center overflow-hidden select-none pointer-events-none">
      <svg
        viewBox="0 0 160 100"
        className="w-36 h-24 text-white/70"
      >
        <defs>
          <radialGradient id="orbitalGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#D4FF00" stopOpacity="1" />
            <stop offset="100%" stopColor="#D4FF00" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Floating 3D Wireframe Oval Loops */}
        <ellipse cx="80" cy="50" rx="65" ry="25" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" transform="rotate(-10 80 50)" />
        <ellipse cx="80" cy="50" rx="55" ry="32" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1" transform="rotate(10 80 50)" />
        <ellipse cx="80" cy="50" rx="45" ry="38" fill="none" stroke="rgba(255,255,255,0.75)" strokeWidth="1.2" transform="rotate(30 80 50)" />
        <ellipse cx="80" cy="50" rx="35" ry="42" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="0.8" transform="rotate(-30 80 50)" />

        {/* Center Glowing Neon Dot */}
        <circle cx="80" cy="50" r="10" fill="url(#orbitalGlow)" opacity="0.8" />
        <circle cx="80" cy="50" r="3.5" fill="#D4FF00" />
        <circle cx="80" cy="50" r="1.5" fill="#FFFFFF" />
      </svg>
    </div>
  );
}
