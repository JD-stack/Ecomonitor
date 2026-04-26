/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // EcoMonitor Design System
        navy: {
          950: "#060d1a",
          900: "#0f172a",
          800: "#1e293b",
          700: "#253347",
          600: "#334155",
        },
        teal: {
          DEFAULT: "#2dd4bf",
          dark: "#0891b2",
          light: "#99f6e4",
          muted: "rgba(45,212,191,0.12)",
          border: "rgba(45,212,191,0.25)",
        },
      },
      fontFamily: {
        // Syne for display headings — geometric, authoritative
        display: ["Syne", "sans-serif"],
        // DM Sans for body — clean, professional
        body: ["DM Sans", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      animation: {
        "fade-up": "fadeUp 0.5s ease forwards",
        "fade-in": "fadeIn 0.4s ease forwards",
        pulse_slow: "pulse 3s infinite",
      },
      keyframes: {
        fadeUp: {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
