/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#3d348b',   // Dark purple
        secondary: { // Pink gradient
          DEFAULT: "#c9184a",
          100: "#ffb3c1",
          200: "#ff8fa3",
        },
        purple:{
          DEFAULT: "#240046",
          100: "#9d4edd",
          200: "#b298dc"
        },
        gray: {
          100: "#CDCDE0",
        },
        highlight: '#35b04', // Bright Orange for Active/Highlight
      }
    },
    fontFamily: {
      pthin: ["Poppins-Thin", "sans-serif"],
      pextralight: ["Poppins-ExtraLight", "sans-serif"],
      plight: ["Poppins-Light", "sans-serif"],
      pregular: ["Poppins-Regular", "sans-serif"],
      pmedium: ["Poppins-Medium", "sans-serif"],
      psemibold: ["Poppins-SemiBold", "sans-serif"],
      pbold: ["Poppins-Bold", "sans-serif"],
      pextrabold: ["Poppins-ExtraBold", "sans-serif"],
      pblack: ["Poppins-Black", "sans-serif"],
    },
  },
  plugins: [],
}

