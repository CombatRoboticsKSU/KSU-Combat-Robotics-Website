/** @type {import('tailwindcss').Config} */
module.exports = {
  // enable class-based dark mode so we can toggle with the `dark` class on <html>
  darkMode: 'class',
  // Include CSS too so @apply references in CSS files are discovered by Tailwind
  content: ['./src/**/*.{html,js,svelte,ts,css}'],
  // (No safelist) Component utilities live in `src/app.css` and are referenced
  // from markup via reusable class names. Keep `content` including CSS so
  // Tailwind discovers utilities referenced in project files.
  theme: {
    extend: {
      fontFamily: {
        // Prefer National as the default, include Soho as an available alternate
        sans: ['National', 'Soho', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans', 'sans-serif']
      },
      colors: {
        // Brand palette grouped for nicer Tailwind utility names
        ksu: {
          blue: '#003976', // use as bg-ksu-blue
          gold: '#FFAB1B'  // use as bg-ksu-gold
        },
        main: {
          black: '#242526',
          white: '#f9f9f9'
        },
        text: {
          black: '#232323',
          white: '#ffffff'
        }
      }
    },
  },
  plugins: [],
};
