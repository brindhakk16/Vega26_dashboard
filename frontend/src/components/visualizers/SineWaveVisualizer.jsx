import React from 'react';

export function SineWaveVisualizer({ active = true, frequency = 1 }) {
  // Generates overlapping sine curves starting at a white left node (x=30, y=55)
  // and converging towards a neon yellow right node (x=270, y=30)
  return (
    <div className="relative w-full h-24 overflow-hidden select-none pointer-events-none">
      <svg
        viewBox="0 0 300 100"
        className="w-full h-full text-white/80"
        preserveAspectRatio="none"
      >
        <defs>
          <radialGradient id="neonGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#D4FF00" stopOpacity="1" />
            <stop offset="100%" stopColor="#D4FF00" stopOpacity="0" />
          </radialGradient>
          <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Baseline Axis Line */}
        <line
          x1="10"
          y1="55"
          x2="290"
          y2="55"
          stroke="rgba(255, 255, 255, 0.25)"
          strokeWidth="1"
          strokeDasharray="2 4"
        />

        {/* Multi-thread Wave 1 */}
        <path
          d="M 30,55 C 60,20 90,80 120,40 C 150,0 180,90 210,45 C 240,15 255,30 270,30"
          fill="none"
          stroke="rgba(255, 255, 255, 0.9)"
          strokeWidth="1.5"
          className="transition-all duration-700 ease-in-out"
        />

        {/* Multi-thread Wave 2 */}
        <path
          d="M 30,55 C 60,80 90,20 120,65 C 150,90 180,20 210,35 C 240,60 255,25 270,30"
          fill="none"
          stroke="rgba(255, 255, 255, 0.7)"
          strokeWidth="1.2"
        />

        {/* Multi-thread Wave 3 */}
        <path
          d="M 30,55 C 70,30 100,75 140,45 C 170,15 190,80 230,30 C 250,15 260,35 270,30"
          fill="none"
          stroke="rgba(255, 255, 255, 0.5)"
          strokeWidth="1"
        />

        {/* Multi-thread Wave 4 */}
        <path
          d="M 30,55 C 50,70 110,30 150,60 C 190,80 220,25 250,40 C 260,30 265,30 270,30"
          fill="none"
          stroke="rgba(255, 255, 255, 0.4)"
          strokeWidth="1"
        />

        {/* Left Origin Node (Solid White) */}
        <circle cx="30" cy="55" r="4" fill="#FFFFFF" />
        <circle cx="30" cy="55" r="7" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />

        {/* Right Terminal Node (Neon Yellow Glow #D4FF00) */}
        <circle cx="270" cy="30" r="10" fill="url(#neonGlow)" opacity="0.6" />
        <circle cx="270" cy="30" r="4.5" fill="#D4FF00" filter="url(#glowEffect)" />
        <circle cx="270" cy="30" r="2" fill="#FFFFFF" />

        {/* Scale labels 1 and 100 */}
        <text x="30" y="80" fill="rgba(255,255,255,0.5)" fontSize="9" fontFamily="sans-serif" textAnchor="middle">1</text>
        <text x="270" y="80" fill="rgba(255,255,255,0.5)" fontSize="9" fontFamily="sans-serif" textAnchor="middle">100</text>
      </svg>
    </div>
  );
}
