/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        indigo: {
          50: '#f4f6ff',
          100: '#e8ecfe',
          200: '#d5dcfe',
          300: '#b5c1fd',
          400: '#8e9efa',
          500: '#6474f7',
          600: '#3d4cee', // Refined executive logistics blue-indigo
          700: '#323ec9',
          800: '#2b33a5',
          900: '#262c84',
          950: '#171951',
        },
        slate: {
          50: '#f8fafc',
          900: '#0f172a',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', '"IBM Plex Sans Arabic"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'premium': '0 4px 20px -2px rgba(15, 23, 42, 0.04), 0 2px 8px -1px rgba(15, 23, 42, 0.02)',
        'subtle': '0 1px 3px 0 rgba(15, 23, 42, 0.03), 0 1px 2px -1px rgba(15, 23, 42, 0.02)',
      }
    },
  },
  plugins: [],
}
