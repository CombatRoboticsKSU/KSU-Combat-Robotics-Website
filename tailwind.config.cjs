/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        'ksu-blue': '#0A0D6F',
        'ksu-gold': '#FFAB1B',
        'white': '#fefefe',
        'black': '#231f20',

        'main-dark-text-color': '#333333',
        'main-light-text-color': '#fefefe',
        'main-dark-background': '#6a4c93',
        'main-light-background': '#6a4c93',
        'main-dark-footer': '#333333',
        'main-light-footer': '#333333'
      }
    },
  },
  plugins: [],
};
