/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'kinga-pink': '#E05263', // Deep Rose/Pink
        'kinga-teal': '#4B8F8C', // Muted Teal (Safety Accent)
        'kinga-orange': '#D35400', // Burnt Orange (Alert)
        'kinga-dark': '#2c3e50',
        'kinga-gray': '#F7F9FC', // Soft background
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
