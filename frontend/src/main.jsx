import React from 'react'
import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'
import App from './App.jsx'
import './styles/globals.css'
import './styles/index.css';

// Configurar variables de entorno en modo desarrollo
if (import.meta.env.DEV) {
  console.log('🚀 Toklen App iniciando en modo desarrollo')
  console.log('API Base URL:', import.meta.env.VITE_API_BASE_URL)
}

// Inicializar la aplicación
const container = document.getElementById('root')
const root = createRoot(container)

root.render(
  <StrictMode>
    <App />
  </StrictMode>
)

// Hot Module Replacement (HMR) para desarrollo
if (import.meta.hot) {
  import.meta.hot.accept()
}

// Service Worker para PWA (opcional)
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration)
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError)
      })
  })
}