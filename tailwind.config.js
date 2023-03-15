/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx,jsx,js}", "./node_modules/flowbite/**/*.{ts,tsx,jsx,js}", "./node_modules/flowbite-react/**/*.{ts,tsx,jsx,js}"],
  theme: {
    extend: {
      width: {
        320: "32rem",
        640: "64rem",
      },
      height: {
        "screen-75": "75vh",
      },
      colors: {
        earth: { 100: "#e7e5d7", 200: "#D8D3C1", 300: "#B9AF9A" },
      },
    },
  },
  plugins: [require("flowbite/plugin"), require("@tailwindcss/forms")],
};
