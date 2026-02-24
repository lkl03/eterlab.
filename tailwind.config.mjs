// tailwind.config.ts
/** @type {import('tailwindcss').Config} */

export default {
  content: [
    "./app/**/*.{ts,tsx,mdx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Colors via CSS variables so Tailwind utilities like `text-ink/70`
        // work reliably and so the palette can be tweaked from CSS.
        ink: "rgb(var(--ink) / <alpha-value>)",
        paper: "rgb(var(--paper) / <alpha-value>)",
        paperMuted: "rgb(var(--paper-muted) / <alpha-value>)",
        // Optional kebab-case alias (handy if you prefer `bg-paper-muted`)
        "paper-muted": "rgb(var(--paper-muted) / <alpha-value>)",
      },
      screens: {
        desk: "1440px",
        big: "1920px",
      },
    },
  },
  plugins: [],
}
