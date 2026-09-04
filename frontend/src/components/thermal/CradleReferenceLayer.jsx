import React, { useRef, useEffect } from 'react';

export function CradleReferenceLayer({ onResize, showImage = true }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || !onResize) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        onResize({
          width: entry.contentRect.width,
          height: entry.contentRect.height
        });
      }
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [onResize]);

  return (
    <div 
      ref={containerRef}
      className="relative w-full aspect-square max-w-[550px] mx-auto rounded-lg overflow-hidden bg-[#0a0d14] border border-dark-border select-none"
    >
      {showImage && (
        <div className="absolute inset-0 flex items-center justify-center p-4 opacity-40 pointer-events-none">
          {/* Technical Overhead Cradle Illustration Layer */}
          <svg className="w-full h-full" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Outer Room / Floor Outline */}
            <rect x="20" y="20" width="460" height="460" rx="16" stroke="#252A34" strokeWidth="2" strokeDasharray="4 4" />
            
            {/* Cradle Oval Outer Frame */}
            <ellipse cx="250" cy="250" rx="170" ry="210" stroke="#3b82f6" strokeWidth="3" strokeOpacity="0.5" fill="#11141B" />
            
            {/* Wooden Slat Rails */}
            {Array.from({ length: 16 }).map((_, i) => {
              const angle = (i / 16) * Math.PI * 2;
              const x1 = 250 + Math.cos(angle) * 150;
              const y1 = 250 + Math.sin(angle) * 190;
              const x2 = 250 + Math.cos(angle) * 170;
              const y2 = 250 + Math.sin(angle) * 210;
              return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#3b82f6" strokeWidth="2" strokeOpacity="0.4" />;
            })}

            {/* Inner Mattress Boundaries */}
            <ellipse cx="250" cy="250" rx="135" ry="175" fill="#161B26" stroke="#06b6d4" strokeWidth="2" strokeOpacity="0.6" />
            
            {/* Cradle Headrest Marker */}
            <path d="M 160 140 Q 250 110 340 140" stroke="#06b6d4" strokeWidth="2" strokeDasharray="6 4" strokeOpacity="0.5" fill="none" />
            
            <text x="250" y="80" textAnchor="middle" fill="#8D96A5" fontSize="11" fontFamily="JetBrains Mono">
              CRADLE HEADREST
            </text>
            <text x="250" y="440" textAnchor="middle" fill="#8D96A5" fontSize="11" fontFamily="JetBrains Mono">
              FOOTREST
            </text>
          </svg>
        </div>
      )}
    </div>
  );
}
