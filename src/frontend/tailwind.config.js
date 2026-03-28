/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Nunito', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1.25rem',
        '3xl': '1.75rem',
      },
      boxShadow: {
        card: '0 8px 32px 0 oklch(0.55 0.15 270 / 0.12), 0 2px 8px 0 oklch(0.55 0.15 270 / 0.08)',
        'card-hover': '0 16px 48px 0 oklch(0.55 0.15 270 / 0.18), 0 4px 12px 0 oklch(0.55 0.15 270 / 0.12)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
