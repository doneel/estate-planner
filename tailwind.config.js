/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx,jsx,js}",'./node_modules/flowbite/**/*.{ts,tsx,jsx,js}', "./node_modules/flowbite-react/**/*.{ts,tsx,jsx,js}"],
  theme: {
    extend: {
      width: {
        '320': '32rem',
        '640': '64rem',
      },
      height: {
        'screen-75': '75vh'
      }
    },
  },
  plugins: [require("flowbite/plugin")],
};
