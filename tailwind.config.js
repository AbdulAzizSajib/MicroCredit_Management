/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  important: true,
  theme: {
    extend: {
      colors: {
        primary: '#009688',
        secondary: '#28A745',
        danger: '#E91E63',
        dangerDark: '#AA0035',
        info: '#00b4d8',

      },
    },
  },
  plugins: [],
};
