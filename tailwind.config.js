/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#6C5DD3',
        'primary-light': '#8B7FE8',
        secondary: '#00D4AA',
        accent: '#FF6B9D',
        'accent-2': '#FFB347',
        'bg-dark': '#0a0a1a',
        'bg-card': 'rgba(255, 255, 255, 0.05)',
        glass: 'rgba(255, 255, 255, 0.08)',
        'glass-border': 'rgba(255, 255, 255, 0.15)',
      },
      fontFamily: {
        outfit: ['Outfit', 'sans-serif'],
        space: ['Space Grotesk', 'sans-serif'],
      },
      animation: {
        'float': 'float 20s infinite ease-in-out',
        'pulse-slow': 'pulse 2s infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '25%': { transform: 'translate(50px, -50px) scale(1.1)' },
          '50%': { transform: 'translate(-30px, 30px) scale(0.9)' },
          '75%': { transform: 'translate(40px, 20px) scale(1.05)' },
        },
      },
    },
  },
  plugins: [],
}