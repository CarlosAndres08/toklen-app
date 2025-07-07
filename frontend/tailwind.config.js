/** @type {import('tailwindcss').Config */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        nunito: ['Nunito', 'sans-serif']
      },
      colors: {
        primary: {
          DEFAULT: '#E94567',
          hover: '#d63862'
        },
        secondary: {
          DEFAULT: '#273C4A',
          hover: '#334155'
        },
        neutral: '#B0BEC5',
        'base-100': '#FFFFFF',
        'base-200': '#F5F5F5',
        info: '#273C4A',
        success: '#16a34a',
        warning: '#facc15',
        error: '#dc2626',
        toklen: {
          blue: '#273C4A',
          coral: '#E94567',
          white: '#FFFFFF',
          'gray-light': '#F5F5F5',
          'gray-blue': '#B0BEC5',
          'coral-hover': '#d63862',
          'blue-hover': '#334155'
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-in-out',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'slider': 'slider 20s linear infinite'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideIn: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        slider: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-100%)' }
        }
      },
      boxShadow: {
        soft: '0 2px 8px 0 rgba(0, 0, 0, 0.05)',
        medium: '0 4px 12px 0 rgba(0, 0, 0, 0.1)',
        strong: '0 8px 24px 0 rgba(0, 0, 0, 0.15)'
      }
    }
  },
  plugins: []
};
