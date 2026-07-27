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
        terracotta: {
          DEFAULT: '#963200',
          dark: '#7A2800',
          hover: '#802B00',
          light: '#FFF0E6',
          border: '#F3D2C1',
        },
        cream: {
          bg: '#FFF9F5',
          card: '#FFFFFF',
          border: '#F3E8E2',
          pill: '#FFF0E6',
          section: '#FFF5F0',
          footer: '#FFEBE0',
        },
        brand: {
          primary: '#963200',
          orange: '#FF8A3D',
          'orange-hover': '#F97316',
          dark: '#1C1917',
          muted: '#78716C',
          border: '#F3E8E2',
        },
        darkcard: {
          DEFAULT: '#292524',
          border: '#44403C',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'reference': '0 8px 30px rgba(150, 50, 0, 0.04)',
        'reference-hover': '0 12px 35px rgba(150, 50, 0, 0.08)',
        'terracotta-glow': '0 8px 25px -4px rgba(150, 50, 0, 0.35)',
        'orange-pill': '0 6px 20px -2px rgba(255, 138, 61, 0.4)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 4s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
