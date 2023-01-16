const colors = require('tailwindcss/colors');

module.exports = {
  content: ["./app/**/*.jsx", "../signotator/src/*.js"],
  theme: {
    extend: {
      colors: {
        primary: colors.orange,
        secondary: colors.indigo,
        current: 'currentColor',
        signotatormain: colors.orange,
        signotatorbtns: colors.indigo,
        signotatorbg: "#f4f6f9",
      }
    }
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
