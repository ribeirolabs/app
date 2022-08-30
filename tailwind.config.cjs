/** @type {import('tailwindcss').Config} */
const { theme } = require("../src/app.config.js");

module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}", "./app-common/src/**/*.{js,ts,jsx,tsx}"],
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
  daisyui: {
    darkTheme: "business",
    themes: [
      {
        light: {
          ...require("daisyui/src/colors/themes")["[data-theme=light]"],
          ...theme.colors,
        },
        dark: {
          ...require("daisyui/src/colors/themes")["[data-theme=business]"],
          ...theme.colors
        },
      },
    ],
  },
};
