/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  important: true,
  theme: {
    extend: {
      colors: {
        primary: '#0D47A1',
        secondary: '#2E7D32',
        danger: '#C62828',
        dangerDark: '#8E0000',
        info: '#01579B',

      },
    },
  },
  plugins: [],
};
