/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#0b0c10",
          light: "#181a22",
        },
        court: {
          DEFAULT: "#0f2f25",
          dark: "#0b201a",
        },
        accent: {
          DEFAULT: "#76e3d7", // oklch(0.78 0.14 235) is a cyan-like color
          light: "#a5f3fc",
        },
      },
      fontFamily: {
        sans: ["Inter", "Geist", "sans-serif"],
        display: ["Bricolage Grotesque", "Geist", "sans-serif"],
        mono: ["Geist Mono", "monospace"],
      },
    },
  },
  plugins: [],
}


