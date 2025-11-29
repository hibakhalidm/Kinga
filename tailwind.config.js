/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'kinga-orange': '#e67e22', // Burnt orange for alerts
        'kinga-amber': '#f1c40f',
        'kinga-blue': '#3498db',
        'kinga-dark': '#2c3e50',
      },
    },
  },
  plugins: [],
}
