// Configuración de API para diferentes entornos

const API_CONFIG = {
  development: {
    baseURL: 'http://localhost:5000/api',
    timeout: 10000,
  },
  production: {
    baseURL: 'https://tu-backend.onrender.com/api', // Cambiar por tu URL de Render
    timeout: 15000,
  }
}

// Detectar entorno actual
const environment = import.meta.env.MODE || 'development'
const config = API_CONFIG[environment] || API_CONFIG.development

// Configuración de axios
export const API_BASE_URL = config.baseURL
export const API_TIMEOUT = config.timeout

// Endpoints de la API
export const API_ENDPOINTS = {
  // Autenticación
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  
  // Servicios públicos
  SERVICES: '/services',
  CATEGORIES: '/categories',
  
  // Health checks
  HEALTH: '/health',
  STATUS: '/status',
  PING: '/ping',
  
  // Rutas protegidas
  PROFILE: '/protected/profile',
  SERVICE_REQUESTS: '/protected/service-requests',
  
  // Rutas de administrador
  ADMIN_STATS: '/admin/stats',
  
  // Rutas de profesionales
  PROFESSIONAL_REQUESTS: '/professional/requests',
}

// Headers por defecto
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
}

// Configuración de desarrollo
export const DEV_CONFIG = {
  enableLogs: environment === 'development',
  mockData: false, // Cambiar a true para usar datos de prueba
}

console.log(`🌐 API configurada para: ${environment}`)
console.log(`🔗 Base URL: ${API_BASE_URL}`)

export default {
  API_BASE_URL,
  API_TIMEOUT,
  API_ENDPOINTS,
  DEFAULT_HEADERS,
  DEV_CONFIG,
  environment
}

