module.exports = {
  // Use the standard tailwindcss PostCSS plugin. This is compatible with the
  // installed `tailwindcss` package and ensures @tailwind directives are processed.
  plugins: [
    require('@tailwindcss/postcss'),
    require('autoprefixer'),
  ],
};
