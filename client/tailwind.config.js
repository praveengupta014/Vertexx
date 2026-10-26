const c = (n) => `rgb(var(--${n}) / <alpha-value>)`;

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: { bg: c('bg'), surface: c('surface'), ink: c('ink'), mut: c('mut'), line: c('line'), brand: c('brand'), tint: c('tint'), sig: c('sig') },
      fontFamily: {
        head: ['"Bricolage Grotesque"', 'Segoe UI', 'sans-serif'],
        body: ['"Instrument Sans"', 'Segoe UI', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
