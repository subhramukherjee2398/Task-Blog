/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#281c59',
        secondary: '#594e8d',
        accent: '#85c79a',
        cream: '#edf7bd',
      }
    },
  },
  plugins: [],
}
