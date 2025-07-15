import axios from 'axios'
import { API_BASE_URL, API_TIMEOUT, DEFAULT_HEADERS, DEV_CONFIG } from '../config/api.js'

// Crear instancia de axios
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: DEFAULT_HEADERS,
})

// Interceptor para requests
apiClient.interceptors.request.use(
  (config) => {
    // Agregar token de autenticación si existe
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // Log en desarrollo
    if (DEV_CONFIG.enableLogs) {
      console.log('🚀 API Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        data: config.data
      })
    }

    return config
  },
  (error) => {
    console.error('❌ Request Error:', error)
    return Promise.reject(error)
  }
)

// Interceptor para responses
apiClient.interceptors.response.use(
  (response) => {
    // Log en desarrollo
    if (DEV_CONFIG.enableLogs) {
      console.log('✅ API Response:', {
        status: response.status,
        url: response.config.url,
        data: response.data
      })
    }

    return response
  },
  (error) => {
    // Log de errores
    console.error('❌ API Error:', {
      status: error.response?.status,
      message: error.response?.data?.error || error.message,
      url: error.config?.url
    })

    // Manejar errores específicos
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem('authToken')
      window.location.href = '/login'
    }

    return Promise.reject(error)
  }
)

// Servicios de API
export const apiService = {
  // Health checks
  async ping() {
    const response = await apiClient.get('/ping')
    return response.data
  },

  async healthCheck() {
    const response = await apiClient.get('/health')
    return response.data
  },

  async getStatus() {
    const response = await apiClient.get('/status')
    return response.data
  },

  // Autenticación
  async login(credentials) {
    const response = await apiClient.post('/auth/login', credentials)
    return response.data
  },

  async register(userData) {
    const response = await apiClient.post('/auth/register', userData)
    return response.data
  },

  // Servicios públicos
  async getServices(filters = {}) {
    const response = await apiClient.get('/services', { params: filters })
    return response.data
  },

  async getCategories() {
    const response = await apiClient.get('/categories')
    return response.data
  },

  // Perfil de usuario (protegido)
  async getProfile() {
    const response = await apiClient.get('/protected/profile')
    return response.data
  },

  async updateProfile(profileData) {
    const response = await apiClient.put('/protected/profile', profileData)
    return response.data
  },

  // Solicitudes de servicio (protegido)
  async createServiceRequest(requestData) {
    const response = await apiClient.post('/protected/service-requests', requestData)
    return response.data
  },

  async getServiceRequests() {
    const response = await apiClient.get('/protected/service-requests')
    return response.data
  },

  // Administración (admin)
  async getAdminStats() {
    const response = await apiClient.get('/admin/stats')
    return response.data
  },

  // Profesionales
  async getProfessionalRequests() {
    const response = await apiClient.get('/professional/requests')
    return response.data
  },
}

// Utilidades
export const apiUtils = {
  // Verificar si la API está disponible
  async checkConnection() {
    try {
      await apiService.ping()
      return true
    } catch (error) {
      console.error('❌ API no disponible:', error.message)
      return false
    }
  },

  // Obtener información de salud completa
  async getHealthInfo() {
    try {
      const [health, status] = await Promise.all([
        apiService.healthCheck(),
        apiService.getStatus()
      ])
      return { health, status, connected: true }
    } catch (error) {
      return { connected: false, error: error.message }
    }
  },

  // Manejar errores de API de forma consistente
  handleApiError(error, defaultMessage = 'Error en la operación') {
    if (error.response?.data?.error) {
      return error.response.data.error
    }
    if (error.message) {
      return error.message
    }
    return defaultMessage
  }
}

export default apiClient

