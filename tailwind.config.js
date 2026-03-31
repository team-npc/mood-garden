/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Sophisticated sage green - primary brand color
        sage: {
          50: '#f6f8f6',
          100: '#e8ede8',
          200: '#d1dbd1',
          300: '#b0c2b0',
          400: '#8fa48f',
          500: '#7a8a7a',
          600: '#637063',
          700: '#4f5a4f',
          800: '#3f483f',
          900: '#343b34',
          950: '#1c211c',
        },
        // Warm earth tones - elegant neutrals
        earth: {
          50: '#faf9f7',
          100: '#f2efe9',
          200: '#e5dfd4',
          300: '#d3c9b8',
          400: '#bfb09a',
          500: '#a89782',
          600: '#8f7d6a',
          700: '#756658',
          800: '#61544a',
          900: '#52473f',
        },
        // Deep charcoal - for dark mode
        deep: {
          50: '#f5f5f4',
          100: '#e7e5e4',
          200: '#d6d3d1',
          300: '#a8a29e',
          400: '#78716c',
          500: '#57534e',
          600: '#44403c',
          700: '#3a342a',
          800: '#2e2820',
          900: '#1a1612',
          950: '#0f0d0a',
        },
        // Warm cream - light accents
        cream: {
          50: '#fffefa',
          100: '#fefcf5',
          200: '#faf6ec',
          300: '#f5f0e1',
          400: '#ebe3d0',
          500: '#ddd3bb',
          600: '#c4b89d',
          700: '#a69878',
          800: '#867862',
          900: '#6b5f4f',
        },
        // Soft muted greens - nature accents
        leaf: {
          50: '#f6f8f6',
          100: '#e9ede9',
          200: '#d4dbd4',
          300: '#b5c2b5',
          400: '#94a594',
          500: '#7a8a7a',
          600: '#637063',
          700: '#505a50',
          800: '#404840',
          900: '#363c36',
          950: '#1e221e',
        },
      },
      fontFamily: {
        'sans': ['Inter', 'ui-sans-serif', 'system-ui'],
        'serif': ['Crimson Text', 'ui-serif', 'Georgia'],
        'display': ['Playfair Display', 'Georgia', 'serif'],
        'elegant': ['Cormorant Garamond', 'Georgia', 'serif'],
      },
      fontSize: {
        'xxs': ['0.625rem', { lineHeight: '0.875rem' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(0, 0, 0, 0.06)',
        'soft-md': '0 4px 12px rgba(0, 0, 0, 0.08)',
        'soft-lg': '0 8px 24px rgba(0, 0, 0, 0.1)',
        'soft-xl': '0 12px 32px rgba(0, 0, 0, 0.12)',
        'card': '0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.03)',
        'card-hover': '0 4px 12px rgba(0, 0, 0, 0.08)',
        'inner-soft': 'inset 0 1px 2px rgba(0, 0, 0, 0.04)',
      },
      backdropBlur: {
        'xs': '2px',
        '3xl': '64px',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'fade-in-up': 'fadeInUp 0.4s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'gentle-bounce': 'gentleBounce 2s ease-in-out infinite',
        'breathe': 'breathe 4s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        gentleBounce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        breathe: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.02)' },
        },
      },
      backgroundImage: {
        'subtle-gradient': 'linear-gradient(135deg, #f8f9f8 0%, #f2efe9 100%)',
      },
      transitionTimingFunction: {
        'bounce-in': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'spring': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      },
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
        '800': '800ms',
        '1200': '1200ms',
        '2000': '2000ms',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}