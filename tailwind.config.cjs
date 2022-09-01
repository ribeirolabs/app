const { theme } = require("../src/app.config.js");

/** @type {import('tailwindcss').Config} */
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
