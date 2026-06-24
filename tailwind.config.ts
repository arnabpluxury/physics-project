import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cyber: {
          cyan: '#00f0ff',
          magenta: '#ff00aa',
          void: '#0a0a0f',
          glass: 'rgba(255,255,255,0.08)',
        },
      },
      animation: {
        'overlay-in': 'overlayIn 0.35s ease-out forwards',
        'overlay-out': 'overlayOut 0.4s ease-in forwards',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'gif-zoom': 'gifZoom 2.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
      },
      keyframes: {
        overlayIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        overlayOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 12px rgba(0,240,255,0.35)' },
          '50%': { boxShadow: '0 0 24px rgba(0,240,255,0.65)' },
        },
        gifZoom: {
          '0%': { transform: 'scale(0.1)', opacity: '0.4' },
          '50%': { transform: 'scale(1.5)', opacity: '0.4' },
          '100%': { transform: 'scale(3)', opacity: '0' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};

export default config;
