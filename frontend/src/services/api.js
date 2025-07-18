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

// Servicios de API (exportados individualmente para compatibilidad con código existente)
export const authService = {
  login: async (credentials) => {
    const response = await apiClient.post('/auth/login', credentials)
    return response.data
  },
  register: async (userData) => {
    const response = await apiClient.post('/auth/register', userData)
    return response.data
  },
  getProfile: async () => {
    const response = await apiClient.get('/protected/profile')
    return response.data
  },
  updateProfile: async (profileData) => {
    const response = await apiClient.put('/protected/profile', profileData)
    return response.data
  },
}

export const serviceService = {
  getServices: async (filters = {}) => {
    const response = await apiClient.get('/services', { params: filters })
    return response.data
  },
  getCategories: async () => {
    const response = await apiClient.get('/categories')
    return response.data
  },
  createServiceRequest: async (requestData) => {
    const response = await apiClient.post('/protected/service-requests', requestData)
    return response.data
  },
  getServiceRequests: async () => {
    const response = await apiClient.get('/protected/service-requests')
    return response.data
  },
  getServiceById: async (id) => {
    const response = await apiClient.get(`/protected/service-requests/${id}`)
    return response.data
  },
  updateServiceStatus: async (id, newStatus) => {
    const response = await apiClient.put(`/protected/service-requests/${id}/status`, { status: newStatus })
    return response.data
  },
  getUserServices: async () => {
    const response = await apiClient.get('/protected/user-services')
    return response.data
  },
}

export const professionalsAPI = {
  searchProfessionals: async (params) => {
    const response = await apiClient.get('/professionals', { params })
    return response.data
  },
  getProfessionalById: async (id) => {
    const response = await apiClient.get(`/professionals/${id}`)
    return response.data
  },
  registerProfessional: async (professionalData) => {
    const response = await apiClient.post('/professional/register', professionalData)
    return response.data
  },
}

export const usersAPI = {
  getProfile: async () => {
    const response = await apiClient.get('/protected/profile')
    return response.data
  },
  updateProfile: async (profileData) => {
    const response = await apiClient.put('/protected/profile', profileData)
    return response.data
  },
}

// Exportar apiService unificado (para nuevas implementaciones o si se prefiere)
export const apiService = {
  // Health checks
  ping: async () => {
    const response = await apiClient.get('/ping')
    return response.data
  },
  healthCheck: async () => {
    const response = await apiClient.get('/health')
    return response.data
  },
  getStatus: async () => {
    const response = await apiClient.get('/status')
    return response.data
  },

  // Autenticación
  login: authService.login,
  register: authService.register,

  // Servicios públicos y protegidos
  getServices: serviceService.getServices,
  getCategories: serviceService.getCategories,
  createServiceRequest: serviceService.createServiceRequest,
  getServiceRequests: serviceService.getServiceRequests,
  getServiceById: serviceService.getServiceById,
  updateServiceStatus: serviceService.updateServiceStatus,
  getUserServices: serviceService.getUserServices,

  // Perfil de usuario
  getProfile: usersAPI.getProfile,
  updateProfile: usersAPI.updateProfile,

  // Profesionales
  searchProfessionals: professionalsAPI.searchProfessionals,
  getProfessionalById: professionalsAPI.getProfessionalById,
  registerProfessional: professionalsAPI.registerProfessional,

  // Administración (admin)
  getAdminStats: async () => {
    const response = await apiClient.get('/admin/stats')
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


