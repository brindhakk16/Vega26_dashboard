import React from 'react';

export function ArcScaleVisualizer({ activeLevel = 'Optimal' }) {
  // Levels map to x-positions along baseline y=80
  // Optimal: x=40, Mid: x=140, Moderate: x=210, High: x=270
  const getNodeX = (level) => {
    switch (level) {
      case 'Mid': return 140;
      case 'Moderate': return 210;
      case 'High': return 270;
      default: return 40; // Optimal
    }
  };

  const activeX = getNodeX(activeLevel);

  return (
    <div className="relative w-full h-32 overflow-hidden select-none pointer-events-none">
      <svg
        viewBox="0 0 300 120"
        className="w-full h-full text-white"
        preserveAspectRatio="none"
      >
        <defs>
          <radialGradient id="arcGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#D4FF00" stopOpacity="1" />
            <stop offset="100%" stopColor="#D4FF00" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Concentric Arc 1 (Widest Arc - connecting x=40 to x=270) */}
        <path
          d="M 40,80 A 115,65 0 0,1 275,80"
          fill="none"
          stroke="rgba(255, 255, 255, 0.5)"
          strokeWidth="1.2"
        />

        {/* Concentric Arc 2 (Middle Arc - connecting x=40 to x=235) */}
        <path
          d="M 40,80 A 97.5,50 0 0,1 235,80"
          fill="none"
          stroke="rgba(255, 255, 255, 0.65)"
          strokeWidth="1.2"
        />

        {/* Concentric Arc 3 (Inner Arc - connecting x=40 to x=180) */}
        <path
          d="M 40,80 A 70,35 0 0,1 180,80"
          fill="none"
          stroke="rgba(255, 255, 255, 0.85)"
          strokeWidth="1.5"
        />

        {/* Scale Nodes along horizontal axis */}
        {/* Intermediate small dots */}
        <circle cx="75" cy="80" r="1.5" fill="rgba(255,255,255,0.4)" />
        <circle cx="105" cy="80" r="1.5" fill="rgba(255,255,255,0.4)" />
        <circle cx="160" cy="80" r="1.5" fill="rgba(255,255,255,0.4)" />
        <circle cx="195" cy="80" r="1.5" fill="rgba(255,255,255,0.4)" />
        <circle cx="245" cy="80" r="1.5" fill="rgba(255,255,255,0.4)" />

        {/* Key Major Scale Dots */}
        {/* Optimal (x=40) */}
        <circle cx="40" cy="80" r={activeLevel === 'Optimal' ? "0" : "3.5"} fill="#FFFFFF" />

        {/* Mid (x=140) */}
        <circle cx="140" cy="80" r={activeLevel === 'Mid' ? "0" : "3.5"} fill="#FFFFFF" />

        {/* Moderate (x=210) */}
        <circle cx="210" cy="80" r={activeLevel === 'Moderate' ? "0" : "3.5"} fill="#FFFFFF" />

        {/* High (x=275) */}
        <circle cx="275" cy="80" r={activeLevel === 'High' ? "0" : "3.5"} fill="#FFFFFF" />

        {/* Active Neon Glowing Node (#D4FF00) */}
        <circle cx={activeX} cy="80" r="12" fill="url(#arcGlow)" opacity="0.7" />
        <circle cx={activeX} cy="80" r="5" fill="#D4FF00" />
        <circle cx={activeX} cy="80" r="2" fill="#FFFFFF" />

        {/* Text Labels under nodes */}
        <text x="40" y="104" fill={activeLevel === 'Optimal' ? '#FFFFFF' : 'rgba(255,255,255,0.6)'} fontSize="11" fontWeight={activeLevel === 'Optimal' ? '700' : '400'} fontFamily="sans-serif" textAnchor="middle">Optimal</text>
        <text x="140" y="104" fill={activeLevel === 'Mid' ? '#FFFFFF' : 'rgba(255,255,255,0.5)'} fontSize="10" fontFamily="sans-serif" textAnchor="middle">Mid</text>
        <text x="210" y="104" fill={activeLevel === 'Moderate' ? '#FFFFFF' : 'rgba(255,255,255,0.5)'} fontSize="10" fontFamily="sans-serif" textAnchor="middle">Moderate</text>
        <text x="275" y="104" fill={activeLevel === 'High' ? '#FFFFFF' : 'rgba(255,255,255,0.5)'} fontSize="10" fontFamily="sans-serif" textAnchor="middle">High</text>
      </svg>
    </div>
  );
}
