module.exports = {
  // Use the Tailwind PostCSS plugin package which is now separate from core
  plugins: [
    require('@tailwindcss/postcss'),
    require('autoprefixer'),
  ],
};
