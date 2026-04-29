import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0a0a0f',
        bg2: '#0d0d14',
        card: '#111118',
        card2: '#15151f',
        border: '#1e1e2e',
        accent: '#00ffa3',
        accent2: '#6c5cff',
        accent3: '#ff6b6b',
        accent4: '#ffa500',
        wolf: {
          text: '#eaeaf0',
          muted: '#7a7a90',
          muted2: '#4a4a60',
        },
      },
      fontFamily: {
        sans: ['var(--font-syne)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-space-mono)', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slide-in': 'slideIn 0.3s ease forwards',
        'fade-in': 'fadeIn 0.25s ease forwards',
        'badge-pulse': 'badgePulse 2s ease-in-out infinite',
        'scan': 'scan 8s linear infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        slideIn: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        badgePulse: {
          '0%,100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.1)', opacity: '0.8' },
        },
        scan: {
          from: { top: '0' },
          to: { top: '100%' },
        },
        glow: {
          from: { boxShadow: '0 0 5px rgba(0,255,163,0.3)' },
          to: { boxShadow: '0 0 20px rgba(0,255,163,0.6)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-wolf': 'linear-gradient(135deg, #6c5cff, #00ffa3)',
      },
    },
  },
  plugins: [],
};

export default config;
