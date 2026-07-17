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
          bg: '#0B0B0B',
          card: '#181818',
          border: '#262626',
          hover: '#262626',
        },
        brand: {
          primary: '#FF6B00',
          secondary: '#FF8A3D',
          cyan: '#FF8A3D',
          emerald: '#22C55E',
          pink: '#FF6B00',
        },
        indigo: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdbb74',
          400: '#FF8A3D',
          500: '#FF6B00',
          600: '#e66000',
          700: '#c24e00',
          800: '#9a3c00',
          900: '#7c3200',
          950: '#431700',
        },
        violet: {
          300: '#fdbb74',
          400: '#FF8A3D',
          500: '#FF6B00',
          600: '#e66000',
          700: '#c24e00',
        },
        cyan: {
          300: '#fdbb74',
          400: '#FF8A3D',
          500: '#FF6B00',
          600: '#e66000',
        },
        pink: {
          400: '#FF8A3D',
          500: '#FF6B00',
          600: '#e66000',
        },
        slate: {
          300: '#D1D5DB',
          400: '#A8A8A8',
          500: '#9CA3AF',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'neon-indigo': '0 0 25px -5px rgba(255, 107, 0, 0.45)',
        'neon-cyan': '0 0 25px -5px rgba(255, 138, 61, 0.35)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.5)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        }
      }
    },
  },
  plugins: [],
}
