/** @type {import('tailwindcss').Config} */

const colors = require("tailwindcss/colors");

module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./screens/**/*.{js,jsx,ts,tsx}",
    "./components/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
    colors: {
      primary: "#3b82f6",
      lightPrimary: "#60a5fa",
      secondary: "#676767",
      background: "#EFF2F5",
      shadow: "#1d4ed8",
      error: "#ef4444",
      inputBackground: "#f1f5f9",
      iconBackground: "#dbeafe",
      secondaryText: "#4b5563",
      editButton: "#22c55e",
      editButtonShadow: "#16a34a",
      deleteButton: "#ef4444",
      deleteButtonShadow: "#dc2626",
      white: colors.white,
      gray: colors.gray,
    },
  },
  plugins: [],
};
