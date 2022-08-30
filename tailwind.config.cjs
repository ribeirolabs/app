/** @type {import('tailwindcss').Config} */
const { colors } = require("../theme.config.js");

module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}", "./app-common/**/*.{js,ts,jsx,tsx}"],
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
  daisyui: {
    darkTheme: "business",
    themes: [
      {
        light: {
          ...require("daisyui/src/colors/themes")["[data-theme=light]"],
          ...colors,
        },
        dark: {
          ...require("daisyui/src/colors/themes")["[data-theme=business]"],
          ...colors
        },
      },
    ],
  },
};
