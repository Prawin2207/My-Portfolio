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
          DEFAULT: "#0a0a0b",
          light: "#141416",
        },
        bone: {
          DEFAULT: "#ede8df",
          dim: "#8f8a82",
        },
        // Signal colours for the "Workflow Engine" design
        accent: {
          DEFAULT: "#c6ff3d", // acid lime - live data
          light: "#dcff8a",
        },
        signal: "#ff5b2e", // status orange
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Syne", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
}
