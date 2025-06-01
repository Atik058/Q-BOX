/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
      extend: {
          colors: {
              button: '#3843FF', // Button color
              textfield: '#EAECF0', // Textfield background color
          },
      },
  },
  plugins: [],
};