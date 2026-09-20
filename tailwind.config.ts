import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#FBFAF5",
        moss: {
          50: "#F2F7F0",
          100: "#E2EEDD",
          200: "#C4DDBB",
          300: "#9FC792",
          400: "#75AC66",
          500: "#4F8C42",
          600: "#3B7132",
          700: "#2E5B28",
          800: "#1F3D1C",
          900: "#152912",
        },
        soil: {
          100: "#F1E6D3",
          300: "#DEC08A",
          500: "#B98A3E",
          700: "#8A6329",
          900: "#4E3617",
        },
        ink: "#1C1E1A",
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      borderRadius: {
        blob: "42% 58% 63% 37% / 41% 45% 55% 59%",
      },
      boxShadow: {
        soft: "0 2px 10px rgba(31, 61, 28, 0.06), 0 10px 30px rgba(31, 61, 28, 0.05)",
        lift: "0 8px 24px rgba(31, 61, 28, 0.12)",
      },
      keyframes: {
        "rise-in": {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pop": {
          "0%": { transform: "scale(0.85)", opacity: "0" },
          "60%": { transform: "scale(1.05)", opacity: "1" },
          "100%": { transform: "scale(1)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.55" },
        },
        "sway": {
          "0%, 100%": { transform: "rotate(-1.5deg)" },
          "50%": { transform: "rotate(1.5deg)" },
        },
      },
      animation: {
        "rise-in": "rise-in 0.5s ease-out both",
        "pop": "pop 0.4s cubic-bezier(0.34,1.56,0.64,1) both",
        "pulse-soft": "pulse-soft 1.6s ease-in-out infinite",
        "sway": "sway 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
