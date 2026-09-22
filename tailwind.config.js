/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#0b1220',
          900: '#0f1a2e',
          800: '#16243d',
          700: '#1e2f4d',
          600: '#2b4269',
        },
        accent: {
          DEFAULT: '#2dd4bf',
          dark: '#14b8a6',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
