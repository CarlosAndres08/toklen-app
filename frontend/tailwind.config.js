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
        // Nueva paleta de colores solicitada
        primary: {
          50: '#fef2f4',
          100: '#fce7ea',
          200: '#f9d2d9',
          300: '#f4adb8',
          400: '#ed7f91',
          500: '#e94567', // Color principal rosa
          600: '#d63862',
          700: '#b8294f',
          800: '#9a1e3d',
          900: '#7f1a30',
        },
        secondary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#b0bec5', // Gris medio solicitado
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#273c4a', // Gris oscuro solicitado
          900: '#1e2b37',
        },
        gray: {
          50: '#ffffff',   // Blanco
          100: '#f5f5f5',  // Gris claro solicitado
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#b0bec5',  // Gris medio solicitado
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#273c4a',  // Gris oscuro solicitado
          900: '#1e2b37',
        },
        // Paleta de colores Toklen actualizada
        'toklen': {
          'primary': '#e94567',      // Rosa principal
          'primary-hover': '#d63862', 
          'primary-light': '#f4adb8',
          'secondary': '#273c4a',    // Gris oscuro
          'secondary-hover': '#334155',
          'secondary-light': '#475569',
          'bg': '#ffffff',           // Blanco
          'bg-secondary': '#f5f5f5', // Gris claro
          'text': '#273c4a',         // Gris oscuro para texto
          'text-light': '#64748b',
          'text-muted': '#b0bec5',   // Gris medio
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-in-out',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'slider': 'slider 20s linear infinite',
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
        slider: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-100%)' },
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

