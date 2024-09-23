import { create } from 'twrnc';

// Map your custom styles from tailwind.config.js
const tw = create({
  theme: {
    extend: {
      colors: {
        primary: '#3d348b',   // Dark purple
        secondary: {
          DEFAULT: "#c9184a",
          100: "#ffb3c1",
          200: "#ff8fa3",
        },
        purple: {
          DEFAULT: "#240046",
          100: "#7161ef",
          200: "#b298dc",
        },
        gray: {
          100: "#CDCDE0",
        },
        highlight: '#35b04', // Bright Orange for Active/Highlight
      },
      fontFamily: {
        pthin: ["Poppins-Thin"],
        pextralight: ["Poppins-ExtraLight"],
        plight: ["Poppins-Light"],
        pregular: ["Poppins-Regular"],
        pmedium: ["Poppins-Medium"],
        psemibold: ["Poppins-SemiBold"],
        pbold: ["Poppins-Bold"],
        pextrabold: ["Poppins-ExtraBold"],
        pblack: ["Poppins-Black"],
      },
    },
  },
});

export default tw;
