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
        brand: {
          primary: '#FF6B00',
          secondary: '#FF9D42',
          orange: '#FF6B00',
          'orange-hover': '#E66000',
          'orange-light': '#FFF7ED',
          'orange-border': '#FFD8A8',
          slate: '#0F172A',
          dark: '#111827',
          muted: '#64748B',
          surface: '#F8FAFC',
          border: '#E2E8F0',
        },
        slate: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
          950: '#0B0F17',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'luxury': '0 10px 30px -5px rgba(0, 0, 0, 0.04), 0 2px 8px -2px rgba(0, 0, 0, 0.02)',
        'luxury-hover': '0 20px 40px -10px rgba(0, 0, 0, 0.08), 0 8px 16px -4px rgba(255, 107, 0, 0.12)',
        'orange-glow': '0 10px 30px -5px rgba(255, 107, 0, 0.35)',
        'orange-glow-lg': '0 20px 40px -5px rgba(255, 107, 0, 0.45)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.04)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 4s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s infinite linear',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      }
    },
  },
  plugins: [],
}
