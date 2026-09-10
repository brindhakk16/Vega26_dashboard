/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#F4F6F9',         // Outer light background
          panel: '#FFFFFF',      // White panel
          card: '#F8FAFC',       // Card background
          border: '#E2E8F0',     // Light slate border
          hover: '#F1F5F9',
        },
        neon: {
          lime: '#D4FF00',
          yellow: '#CCFF00',
          cyan: '#00F0FF',
        },
        thermal: {
          blue: '#2563eb',
          cyan: '#0891b2',
          green: '#059669',
          yellow: '#d97706',
          orange: '#ea580c',
          red: '#dc2626',
          hotspot: '#e11d48',
          coldspot: '#0284c7'
        }
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        outfit: ['Inter', 'sans-serif'],
        jakarta: ['Inter', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'thermal-glow': '0 0 20px -5px rgba(234, 88, 12, 0.2)',
        'cyan-glow': '0 0 15px -3px rgba(8, 145, 178, 0.2)',
        'neon-glow': '0 0 15px 2px rgba(212, 255, 0, 0.4)',
        'panel': '0 4px 24px -4px rgba(0, 0, 0, 0.06)',
        'card-glass': '0 8px 32px 0 rgba(0, 0, 0, 0.15)',
      }
    },
  },
  plugins: [],
};
