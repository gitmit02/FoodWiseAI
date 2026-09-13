/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        canopy: {
          950: "#0E241C",
          900: "#153A2C",
          800: "#1D4F3B",
          700: "#276A4D",
          600: "#33865F",
          100: "#DCEEE2",
          50: "#F1F8F3",
        },
        sand: {
          100: "#F5F3EC",
          200: "#EDE9DC",
        },
        harvest: {
          500: "#C98A2B",
          100: "#F6E7CE",
        },
        clay: {
          600: "#C1502E",
          100: "#F7E1D8",
        },
        ink: "#20241F",
      },
      fontFamily: {
        sans: ["Manrope", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
