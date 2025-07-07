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
        'toklen-blue': '#273C4A', // Azul oscuro
        'toklen-coral': '#E94567', // Coral
        'toklen-white': '#FFFFFF', // Blanco
        'toklen-gray-light': '#F5F5F5', // Gris claro
        'toklen-gray-blue': '#B0BEC5', // Gris azulado
        
        // Asignaciones semánticas para TailwindCSS
        primary: '#E94567', // Coral como primario
        secondary: '#273C4A', // Azul oscuro como secundario
        neutral: '#B0BEC5', // Gris azulado como neutral
        'base-100': '#FFFFFF', // Blanco para fondo base
        'base-200': '#F5F5F5', // Gris claro para fondos secundarios
        info: '#273C4A', // Azul oscuro para texto informativo
        success: '#16a34a', // Manteniendo un verde para éxito
        warning: '#facc15', // Manteniendo un amarillo para advertencia
        error: '#dc2626', // Manteniendo un rojo para error

        // Paleta de colores Toklen (si se prefiere usar con el prefijo 'toklen-')
        // Esta sección puede ser redundante si se usan los nombres semánticos de arriba
        // pero se mantiene por si se quiere ser explícito.
        'toklen': {
          'blue': '#273C4A',
          'coral': '#E94567',
          'white': '#FFFFFF',
          'gray-light': '#F5F5F5',
          'gray-blue': '#B0BEC5',
          // Variaciones para hover, focus, etc. (ejemplos)
          'coral-hover': '#d63862', // Un coral más oscuro para hover
          'blue-hover': '#334155',   // Un azul más oscuro para hover
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