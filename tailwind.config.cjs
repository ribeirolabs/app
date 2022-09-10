const { theme } = require("../src/app.config.js");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}", "./app-common/src/**/*.{js,ts,jsx,tsx}"],
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
  theme: {
    extend: {
      gridTemplateColumns: {
        'page': 'auto max-content'
      }
    }
  },
  daisyui: {
    darkTheme: "business",
    themes: [
      {
        light: {
          ...require("daisyui/src/colors/themes")["[data-theme=light]"],
          ...theme.colors,
          "--rounded-box": "0.25rem",
          "--rounded-btn": ".125rem",
          "--rounded-badge": ".125rem",
        },
        dark: {
          ...require("daisyui/src/colors/themes")["[data-theme=business]"],
          ...theme.colors
        },
      },
    ],
  },
};
