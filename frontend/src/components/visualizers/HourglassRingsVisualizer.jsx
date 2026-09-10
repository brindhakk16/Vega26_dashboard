import React from 'react';

export function HourglassRingsVisualizer() {
  return (
    <div className="relative w-full h-40 flex items-center justify-center overflow-hidden select-none pointer-events-none">
      <svg
        viewBox="0 0 200 200"
        className="w-48 h-48 text-white/70"
      >
        <defs>
          <radialGradient id="ringNeonGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#D4FF00" stopOpacity="1" />
            <stop offset="100%" stopColor="#D4FF00" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Concentric Wireframe Lissajous Oval Ellipses */}
        <ellipse cx="100" cy="100" rx="75" ry="35" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" transform="rotate(-15 100 100)" />
        <ellipse cx="100" cy="100" rx="70" ry="42" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1" transform="rotate(15 100 100)" />
        <ellipse cx="100" cy="100" rx="60" ry="50" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1" transform="rotate(45 100 100)" />
        <ellipse cx="100" cy="100" rx="55" ry="55" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" transform="rotate(-45 100 100)" />
        <ellipse cx="100" cy="100" rx="40" ry="68" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.2" transform="rotate(75 100 100)" />
        <ellipse cx="100" cy="100" rx="35" ry="75" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" transform="rotate(-75 100 100)" />
        
        {/* Horizontal & Vertical Cross Axis Guides */}
        <line x1="25" y1="100" x2="175" y2="100" stroke="rgba(255,255,255,0.2)" strokeDasharray="2 3" />
        <line x1="100" y1="25" x2="100" y2="175" stroke="rgba(255,255,255,0.2)" strokeDasharray="2 3" />

        {/* Center Glowing Neon Dot */}
        <circle cx="100" cy="100" r="14" fill="url(#ringNeonGlow)" opacity="0.8" />
        <circle cx="100" cy="100" r="4.5" fill="#D4FF00" />
        <circle cx="100" cy="100" r="2" fill="#FFFFFF" />
      </svg>
    </div>
  );
}
