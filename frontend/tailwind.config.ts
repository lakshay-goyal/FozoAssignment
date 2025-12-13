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
        sans: ['Inter_400Regular', 'sans-serif'],
        thin: ['Inter_100Thin', 'sans-serif'],
        'extra-light': ['Inter_200ExtraLight', 'sans-serif'],
        light: ['Inter_300Light', 'sans-serif'],
        regular: ['Inter_400Regular', 'sans-serif'],
        medium: ['Inter_500Medium', 'sans-serif'],
        'semi-bold': ['Inter_600SemiBold', 'sans-serif'],
        bold: ['Inter_700Bold', 'sans-serif'],
        'extra-bold': ['Inter_800ExtraBold', 'sans-serif'],
        black: ['Inter_900Black', 'sans-serif'],
        cursive: ['cursive'],
      },
    },
  },
  plugins: [],
}