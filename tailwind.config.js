/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx,jsx,js}",'./node_modules/flowbite/**/*.{ts,tsx,jsx,js}', "./node_modules/flowbite-react/**/*.{ts,tsx,jsx,js}"],
  theme: {
    extend: {},
  },
  plugins: [require("flowbite/plugin")],
};
