/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    screens: {
      xs: '375px',
      sm: '768px',
      md: '1024px',
      lg: '1280px',
      xl: '1650px'
    },
    extend: {
      colors: {
        primaryColor: 'var(--Oxford-Blue)'
      },
      fontFamily: {
        rubik: ['rubik', 'sans-serif'],
        publish: ['Public Sans', 'sans-serif']
      }
    }
  },
  plugins: []
}
