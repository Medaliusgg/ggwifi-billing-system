/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // GGWIFI Brand Colors - Official Brand Palette
        'gg-gold': '#FFC72C', // Golden Yellow - Primary Brand Color
        'gg-gold-dark': '#E6B800', // Darker Golden Yellow
        'gg-gold-light': '#FFD700', // Bright Golden Yellow
        'gg-black': '#000000', // Black - Main text, headings, overlays
        'gg-blue': '#0072CE', // Blue - Secondary Accent Color
        'gg-white': '#FFFFFF', // White - Backgrounds, clean layout areas
        'gg-text-primary': '#000000', // Black - Main text
        'gg-text-secondary': '#333333', // Dark Gray - Secondary text
        'gg-text-muted': '#666666', // Medium Gray - Muted text
      },
      fontFamily: {
        'sans': ['Inter', 'Poppins', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'gg-glow': '0 0 15px rgba(255, 215, 0, 0.3)',
        'gg-glow-strong': '0 0 25px rgba(255, 215, 0, 0.5)',
        'gg-glow-subtle': '0 0 10px rgba(255, 215, 0, 0.2)',
      },
      animation: {
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite alternate',
        'fade-in': 'fade-in 0.5s ease-out',
        'slide-up': 'slide-up 0.3s ease-out',
      },
      keyframes: {
        'glow-pulse': {
          '0%': { boxShadow: '0 0 5px rgba(255, 215, 0, 0.2)' },
          '100%': { boxShadow: '0 0 20px rgba(255, 215, 0, 0.4)' },
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [
    function({ addUtilities }) {
      const newUtilities = {
        '.hover\\:gg-glow:hover': {
          boxShadow: '0 0 15px rgba(255, 215, 0, 0.3)',
        },
        '.gg-glow': {
          boxShadow: '0 0 15px rgba(255, 215, 0, 0.3)',
        },
        '.gg-glow-strong': {
          boxShadow: '0 0 25px rgba(255, 215, 0, 0.5)',
        },
        '.gg-glow-subtle': {
          boxShadow: '0 0 10px rgba(255, 215, 0, 0.2)',
        },
      }
      addUtilities(newUtilities)
    }
  ],
}
