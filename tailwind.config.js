/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Your custom colors
        "brand-green": "#FF6600",
        "brand-yellow": "#00a958",
      },
    },
  },
  plugins: [],
};