/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./index.css", // 👈 add this line!
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
