/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#334155', // slate-700
          DEFAULT: '#0F172A', // slate-900 (Midnight Blue)
          dark: '#020617', // slate-950
        },
        accent: {
          light: '#fb923c', // orange-400
          DEFAULT: '#F97316', // orange-500 (Vibrant Orange)
          dark: '#ea580c', // orange-600
        },
        background: {
          DEFAULT: '#F8FAFC', // slate-50 (Off-White)
          paper: '#FFFFFF',
        },
        text: {
          primary: '#1e293b', // slate-800
          secondary: '#64748b', // slate-500
          light: '#f1f5f9', // slate-100
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
      container: {
        center: true,
        padding: '1rem',
        screens: {
          sm: '600px',
          md: '728px',
          lg: '984px',
          xl: '1240px',
          '2xl': '1496px',
        },
      }
    },
  },
  plugins: [],
}
