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
          bg: '#080312',         // Deep obsidian background
          surface: '#0d061c',    // Secondary midnight surface
          panel: '#120726',      // Midnight violet panel
          card: '#180a32',       // Violet card background
          border: '#2a144e',     // Violet border
          hover: '#220e45',      // Interactive hover
          muted: '#8b7ca8',      // Muted violet text
        },
        violet: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7e22ce',
          800: '#6b21a8',
          900: '#581c87',
          950: '#3b0764',
        },
        neon: {
          lime: '#D4FF00',
          yellow: '#CCFF00',
          cyan: '#00F0FF',
          violet: '#c084fc',
          purple: '#a855f7',
          pink: '#f43f5e',
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
        'violet-glow': '0 0 25px 2px rgba(168, 85, 247, 0.4)',
        'violet-subtle': '0 4px 20px -2px rgba(139, 92, 246, 0.25)',
        'violet-lg': '0 10px 40px -5px rgba(126, 34, 206, 0.35)',
        'thermal-glow': '0 0 20px -5px rgba(234, 88, 12, 0.3)',
        'cyan-glow': '0 0 15px -3px rgba(8, 145, 178, 0.3)',
        'neon-glow': '0 0 15px 2px rgba(212, 255, 0, 0.4)',
        'panel': '0 12px 40px -4px rgba(0, 0, 0, 0.8)',
        'card-glass': '0 8px 32px 0 rgba(7, 3, 15, 0.7)',
      }
    },
  },
  plugins: [],
};
