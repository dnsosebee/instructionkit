/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin')
const colors = require('tailwindcss/colors')

module.exports = {
  content: ['./pages/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    // colors: {
    //   teal: colors.teal,
    //   cyan: colors.cyan,
    // },
  },
  plugins: [
    plugin(function ({ addVariant }) {
      addVariant('not-last', '&:not(:last-child)')
    }),
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
  ],
}
