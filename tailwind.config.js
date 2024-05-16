/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      "colors": {
        "ownprimary": {
          50: "#409EFF",
          100: "#2E96FF",
          200: "#0F87FF",
          300: "#0078F0",
          400: "#0069D1",
          500: "#0057AD",
          600: "#00478F",
          700: "#003870",
          800: "#002952",
          900: "#00172E",
          950: "#000F1F"
        }
      }
    },
  },
  plugins: [],
}

