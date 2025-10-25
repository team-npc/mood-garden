/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sage: {
          50: '#f6f7f6',
          100: '#e3e6e3',
          200: '#c6cdc6',
          300: '#a3ada3',
          400: '#7e8a7e',
          500: '#636e63',
          600: '#4f584f',
          700: '#414841',
          800: '#363c36',
          900: '#2e322e',
        },
        earth: {
          50: '#faf7f0',
          100: '#f3ead8',
          200: '#e6d3b0',
          300: '#d4b87e',
          400: '#c49c5a',
          500: '#b5824a',
          600: '#9c6b3e',
          700: '#7f5335',
          800: '#694432',
          900: '#583a2e',
        }
      },
      fontFamily: {
        'sans': ['Inter', 'ui-sans-serif', 'system-ui'],
        'serif': ['Crimson Text', 'ui-serif', 'Georgia'],
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'grow': 'grow 0.5s ease-out',
        'bloom': 'bloom 1s ease-out',
        'wilt': 'wilt 2s ease-in-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        grow: {
          '0%': { transform: 'scale(0.8)', opacity: '0.5' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        bloom: {
          '0%': { transform: 'scale(0)', opacity: '0' },
          '50%': { transform: 'scale(1.2)', opacity: '0.8' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        wilt: {
          '0%': { transform: 'scale(1)', filter: 'saturate(1)' },
          '100%': { transform: 'scale(0.9)', filter: 'saturate(0.3)' },
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}