/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        'nunito': ['Nunito', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#fef2f4',
          100: '#fce7ea',
          200: '#f9d2d9',
          300: '#f4adb8',
          400: '#ed7f91',
          500: '#e94567',
          600: '#d63862',
          700: '#b8294f',
          800: '#9a1e3d',
          900: '#7f1a30',
        },
        gray: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#273c4a',
          900: '#1e2b37',
        },
        // Paleta de colores Toklen
        'toklen': {
          'primary': '#e94567',
          'primary-hover': '#d63862',
          'primary-light': '#f4adb8',
          'secondary': '#273c4a',
          'secondary-hover': '#334155',
          'secondary-light': '#475569',
          'bg': '#ffffff',
          'bg-secondary': '#f8fafc',
          'text': '#273c4a',
          'text-light': '#64748b',
          'text-muted': '#94a3b8',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-in-out',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      boxShadow: {
        'soft': '0 2px 8px 0 rgba(0, 0, 0, 0.05)',
        'medium': '0 4px 12px 0 rgba(0, 0, 0, 0.1)',
        'strong': '0 8px 24px 0 rgba(0, 0, 0, 0.15)',
      },
    },
  },
  plugins: [],
}

