/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)', 'monospace'],
        body: ['var(--font-body)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      colors: {
        mars: {
          red:    '#C1440E',
          orange: '#E8651A',
          dust:   '#D4956A',
        },
        space: {
          900: '#04070F',
          800: '#080E1C',
          700: '#0D1629',
          600: '#162035',
          500: '#1E2E48',
          400: '#2A3F61',
        },
        glow: '#4A90E2',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'blink': 'blink 1.2s step-end infinite',
        'scan': 'scan 4s linear infinite',
        'drift': 'drift 20s linear infinite',
      },
      keyframes: {
        blink: { '0%,100%': { opacity: 1 }, '50%': { opacity: 0 } },
        scan: { '0%': { transform: 'translateY(-100%)' }, '100%': { transform: 'translateY(400%)' } },
        drift: { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
      },
    },
  },
  plugins: [],
}
