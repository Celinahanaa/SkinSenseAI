/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'sans-serif'],
        display: ['Playfair Display', 'serif'],
      },
      colors: {
        brand: {
          blue: '#1a3c8f',
          dark: '#0f2460',
          light: '#3b5fc0',
          accent: '#4f86f7',
        }
      },
      boxShadow: {
        'card': '0 2px 20px rgba(30, 58, 138, 0.08)',
        'card-hover': '0 8px 40px rgba(30, 58, 138, 0.15)',
        'btn': '0 4px 15px rgba(37, 99, 235, 0.3)',
      }
    },
  },
  plugins: [],
}

