/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          dark: "#050814",
          card: "rgba(10, 18, 36, 0.45)",
          cyan: "#00f2fe",
          green: "#00ff87",
          purple: "#d946ef",
          rose: "#ff007f",
          warning: "#f59e0b",
          border: "rgba(255, 255, 255, 0.08)",
          text: "#a0aec0"
        }
      },
      boxShadow: {
        cyan: "0 0 15px rgba(0, 242, 254, 0.3)",
        green: "0 0 15px rgba(0, 255, 135, 0.3)",
        purple: "0 0 15px rgba(217, 70, 239, 0.3)",
        rose: "0 0 15px rgba(255, 0, 127, 0.3)",
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 12s linear infinite',
        'glow-pulse': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(0, 242, 254, 0.2)' },
          '100%': { boxShadow: '0 0 20px rgba(0, 242, 254, 0.6)' },
        }
      }
    },
  },
  plugins: [],
}
