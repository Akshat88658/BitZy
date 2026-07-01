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
        primary: {
          50:  '#fcfaf2',
          100: '#f7f2de',
          200: '#ede0bc',
          300: '#e0c891',
          400: '#d0ac61',
          500: '#c59b27', // Premium Gold
          600: '#a7801a',
          700: '#856412',
          800: '#62480b',
          900: '#443105',
          950: '#241a02',
        },
        accent: {
          emerald: '#10b981',
          rose:    '#f43f5e',
          amber:   '#f59e0b',
          violet:  '#8b5cf6',
          sky:     '#0ea5e9',
        },
        // Rich dark backgrounds
        dark: {
          900: '#080c14',
          800: '#0d1220',
          700: '#0f1829',
          600: '#0f1623',
          500: '#141c2e',
        }
      },
      fontFamily: {
        sans:    ['Space Grotesk', 'Inter', 'sans-serif'],
        display: ['Playfair Display', 'serif'],
        mono:    ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'glass':      '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
        'glass-dark': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'glow-gold':  '0 0 40px rgba(197,155,39,0.25)',
        'glow-sm':    '0 0 20px rgba(197,155,39,0.15)',
      },
      animation: {
        'pulse-slow':  'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in':     'fadeIn 0.3s ease-out',
        'slide-up':    'slideUp 0.4s ease-out',
        'ticker':      'ticker 30s linear infinite',
        'float':       'float 4s ease-in-out infinite',
      },
      keyframes: {
        fadeIn:  { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: 'translateY(20px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        ticker:  { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-10px)' },
        },
      },
      backgroundImage: {
        'gold-gradient':  'linear-gradient(135deg, #c59b27, #a7801a)',
        'dark-gradient':  'linear-gradient(180deg, #080c14, #0d1220)',
      },
    },
  },
  plugins: [],
}
