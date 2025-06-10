/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#5B4FE9',
        secondary: '#8B7FF0',
        accent: '#FF6B6B',
        success: '#4ECDC4',
        warning: '#FFD93D',
        error: '#FF6B6B',
        info: '#4A9EFF',
        surface: {
          50: '#f8f9fc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a'
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        heading: ['Plus Jakarta Sans', 'Inter', 'ui-sans-serif', 'system-ui']
      },
      animation: {
        'spring-bounce': 'spring-bounce 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'slide-fade': 'slide-fade 0.4s ease-out',
        'progress-ring': 'progress-ring 1s ease-out'
      },
      keyframes: {
        'spring-bounce': {
          '0%': { transform: 'scale(0.3)', opacity: '0' },
          '50%': { transform: 'scale(1.1)', opacity: '0.8' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        },
        'slide-fade': {
          '0%': { transform: 'translateX(0)', opacity: '1' },
          '100%': { transform: 'translateX(20px)', opacity: '0' }
        },
        'progress-ring': {
          '0%': { 'stroke-dasharray': '0 100' },
          '100%': { 'stroke-dasharray': 'var(--progress) 100' }
        }
      }
    },
  },
  plugins: [],
}