/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eefbf5',
          100: '#d7f6e4',
          200: '#aeeccb',
          300: '#74dca7',
          400: '#33c47b',
          500: '#179b5a',
          600: '#11784a',
          700: '#0f5e3b',
          800: '#0d4a30',
          900: '#083624'
        }
      },
      boxShadow: {
        soft: '0 18px 50px rgba(15, 94, 59, 0.12)'
      },
      fontFamily: {
        display: ['"Avenir Next"', '"Segoe UI"', 'system-ui', 'sans-serif'],
        body: ['"Inter"', '"Segoe UI"', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: []
}
