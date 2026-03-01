/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        audax: {
          primary: '#5271ff',
          bg: '#f4f4f4',
          dark: '#1a1a1a',
          text: '#4a4844',
          black: '#000000',
        },
      },
      fontFamily: {
        clash: ['Clash Display', 'DM Sans', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
