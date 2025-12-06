/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // ✅ GG WiFi — OFFICIAL BRAND COLORS
        gg: {
          white: "#FFFFFF",
          black: "#0A0A0A",
          gold: "#F2C94C",
          goldStrong: "#E0B335",
        },
        // Secondary UI Colors (Packages, Analytics, Highlights Only)
        sec: {
          blue: "#3A8DFF",
          blueLight: "#EAF4FF",
          green: "#10B981",
          greenLight: "#ECFDF5",
          purple: "#A855F7",
          purpleLight: "#F5E8FF",
          orange: "#FF8A3D",
          orangeLight: "#FFF3E6",
        },
        // Neutrals
        neutral: {
          50: "#FAFAFA",
          100: "#F6F6F6",
          200: "#EEEEEE",
          300: "#E0E0E0",
          600: "#666666",
        },
      },
      fontFamily: {
        primary: ["Inter", "sans-serif"],
        sans: ["Inter", "sans-serif"],
      },
      borderRadius: {
        sm: "8px",
        md: "12px",
        lg: "16px",
      },
      boxShadow: {
        xs: "0 1px 2px rgba(0,0,0,0.04)",
        sm: "0 4px 12px rgba(0,0,0,0.06)",
        lg: "0 12px 36px rgba(0,0,0,0.10)",
        'gg-glow': '0 0 15px rgba(242, 201, 76, 0.3)',
        'gg-glow-strong': '0 0 25px rgba(242, 201, 76, 0.5)',
        'gg-glow-subtle': '0 0 10px rgba(242, 201, 76, 0.2)',
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
