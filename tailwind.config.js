/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: "#F7B90F",
          mid: "#E8A800",
          dark: "#8A6200",
          light: "#FEF9E7",
          border: "#FADA6A",
        },
        ink: {
          DEFAULT: "#292929",
          mid: "#3D3D3D",
          light: "#555555",
        },
        warm: {
          bg: "#F5F4F0",
          card: "#FAFAF8",
          border: "#E4E2DA",
          muted: "#9A9896",
          text: "#5C5A56",
        },
      },
      fontFamily: {
        sans: ["-apple-system", "BlinkMacSystemFont", "Segoe UI", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
}
