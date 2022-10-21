/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brandBlue: '#00b9ff',
        brandBlueHover: '#00a4df',
        brandBlueDown: '#008ec0',

        wiseNavyBlue: '#37517e', // used a lot
        wiseNavyMid: '#2e4369',
        wiseNavyDark: '#253655',

        bgGray: '#f2f5f7', // used a lot
        disabledGray: '#a8aaac',
        slateGray: '#5d7079', 

        wisePurple: '#485cc7', // accent color - bold statement / bring out element
        wiseAmber: '#ffb619', // accent color - bold statement / bring out element
      }
    },
  },
  plugins: [],
}
