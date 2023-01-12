const colors = require('tailwindcss/colors');

module.exports = {
  content: ["./app/**/*.jsx", "../signotator/src/*.js"],
  theme: {
    extend: {
      colors: {
        primary: colors.orange,
        secondary: colors.pink,
        current: 'currentColor',
      }
    }
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
