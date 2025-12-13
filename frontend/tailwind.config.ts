/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        'fozo': {
          'primary': '#EDFFA9',
          'light': '#EDFFA9',
          'dark': '#D6EE72',
        },
      },
      fontFamily: {
        'cursive': ['cursive'], // You can add a custom font later if needed
      },
    },
  },
  plugins: [],
}