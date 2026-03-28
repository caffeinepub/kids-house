/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        nunito: ["'Nunito'", "sans-serif"],
        fredoka: ["'Fredoka One'", "cursive"],
      },
      colors: {
        learning: "#2FA9FF",
        games: "#F28A1F",
        drawing: "#63B63E",
        longvideos: "#8C5AD8",
        shortvideos: "#F4C21A",
        navy: "#1B2F66",
        background: "#F7F8FC",
        foreground: "#1B2F66",
        border: "#E0E7F0",
        primary: { DEFAULT: "#2FA9FF", foreground: "#FFFFFF" },
        secondary: { DEFAULT: "#F28A1F", foreground: "#FFFFFF" },
        card: { DEFAULT: "#FFFFFF", foreground: "#1B2F66" },
        muted: { DEFAULT: "#F0F4FA", foreground: "#6B7DB3" },
      },
      borderRadius: {
        xl: "16px",
        "2xl": "20px",
        "3xl": "28px",
        "4xl": "32px",
        tile: "28px",
      },
      boxShadow: {
        tile: "0 6px 20px rgba(0,0,0,0.12)",
        card: "0 4px 12px rgba(0,0,0,0.08)",
        hero: "0 8px 24px rgba(27,47,102,0.4)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
