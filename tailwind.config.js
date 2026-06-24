/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#7C3AED',
        'primary-light': '#A78BFA',
        'primary-dark': '#5B21B6',
        secondary: '#8B5CF6',
        'secondary-light': '#C4B5FD',
        accent: '#EC4899',
        'accent-2': '#F59E0B',
        'bg-dark': '#0F0A1A',
        'bg-card': 'rgba(124, 58, 237, 0.05)',
        glass: 'rgba(124, 58, 237, 0.08)',
        'glass-border': 'rgba(167, 139, 250, 0.15)',
        'glass-hover': 'rgba(167, 139, 250, 0.2)',
      },
      fontFamily: {
        outfit: ['Outfit', 'sans-serif'],
        space: ['Space Grotesk', 'sans-serif'],
      },
      animation: {
        'float': 'float 20s infinite ease-in-out',
        'pulse-slow': 'pulse 3s infinite',
        'spin-slow': 'spin 3s linear infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '25%': { transform: 'translate(50px, -50px) scale(1.1)' },
          '50%': { transform: 'translate(-30px, 30px) scale(0.9)' },
          '75%': { transform: 'translate(40px, 20px) scale(1.05)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(124, 58, 237, 0.3)' },
          '100%': { boxShadow: '0 0 40px rgba(124, 58, 237, 0.6), 0 0 60px rgba(167, 139, 250, 0.3)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}