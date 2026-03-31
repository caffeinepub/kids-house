/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Nunito', 'sans-serif'],
      },
      colors: {
        background: "oklch(var(--background) / <alpha-value>)",
        foreground: "oklch(var(--foreground) / <alpha-value>)",
        card: "oklch(var(--card) / <alpha-value>)",
        "card-foreground": "oklch(var(--card-foreground) / <alpha-value>)",
        primary: "oklch(var(--primary) / <alpha-value>)",
        "primary-foreground": "oklch(var(--primary-foreground) / <alpha-value>)",
        secondary: "oklch(var(--secondary) / <alpha-value>)",
        "secondary-foreground": "oklch(var(--secondary-foreground) / <alpha-value>)",
        muted: "oklch(var(--muted) / <alpha-value>)",
        "muted-foreground": "oklch(var(--muted-foreground) / <alpha-value>)",
        accent: "oklch(var(--accent) / <alpha-value>)",
        "accent-foreground": "oklch(var(--accent-foreground) / <alpha-value>)",
        destructive: "oklch(var(--destructive) / <alpha-value>)",
        border: "oklch(var(--border) / <alpha-value>)",
        input: "oklch(var(--input) / <alpha-value>)",
        ring: "oklch(var(--ring) / <alpha-value>)",
        // Kids brand colors
        "kids-blue": "oklch(var(--kids-blue) / <alpha-value>)",
        "kids-red": "oklch(var(--kids-red) / <alpha-value>)",
        "kids-green": "oklch(var(--kids-green) / <alpha-value>)",
        "kids-purple": "oklch(var(--kids-purple) / <alpha-value>)",
        "kids-amber": "oklch(var(--kids-amber) / <alpha-value>)",
      },
      borderRadius: {
        lg: "var(--radius)",
        xl: "calc(var(--radius) + 4px)",
        "2xl": "1.25rem",
        "3xl": "1.75rem",
      },
      boxShadow: {
        card: "0 8px 32px 0 oklch(0.55 0.15 270 / 0.12), 0 2px 8px 0 oklch(0.55 0.15 270 / 0.08)",
        "card-hover": "0 16px 48px 0 oklch(0.55 0.15 270 / 0.18), 0 4px 12px 0 oklch(0.55 0.15 270 / 0.12)",
        btn: "0 4px 14px 0 oklch(0.55 0.18 270 / 0.30)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
