/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          900: '#0b1220',
          800: '#111a2e',
          700: '#1b2740',
          100: '#eff4ff'
        },
        accent: {
          500: '#2b6fe8',
          600: '#1f5fd0'
        },
        sand: {
          50: '#faf7f0',
          100: '#f3ead8'
        }
      },
      boxShadow: {
        glow: '0 24px 80px rgba(31, 95, 208, 0.18)'
      }
    }
  },
  plugins: []
};
