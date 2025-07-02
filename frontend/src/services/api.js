import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

// Crear instancia de axios
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Interceptor para agregar token de autenticación
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor para manejar respuestas
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem('authToken')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Servicios de API
export const authService = {
  // Sincronizar usuario con backend después del login
  syncUser: (userData) => api.post('/auth/sync', userData),
  
  // Obtener perfil del usuario
  getProfile: () => api.get('/auth/profile')
}

export const professionalService = {
  // Registrar como profesional
  register: (professionalData) => api.post('/professionals/register', professionalData),
  
  // Buscar profesionales cercanos
  getNearby: (params) => api.get('/professionals/nearby', { params }),
  
  // Obtener perfil profesional
  getProfile: () => api.get('/professionals/profile'),
  
  // Actualizar disponibilidad
  updateAvailability: (isAvailable) => 
    api.patch('/professionals/availability', { isAvailable })
}

export const serviceService = {
  // Crear solicitud de servicio
  create: (serviceData) => api.post('/services', serviceData),
  
  // Obtener servicios del usuario
  getUserServices: () => api.get('/services/user'),
  
  // Aceptar servicio (profesional)
  acceptService: (serviceId) => api.patch(`/services/${serviceId}/accept`),
  
  // Actualizar estado del servicio
  updateStatus: (serviceId, status) => 
    api.patch(`/services/${serviceId}/status`, { status }),
  
  // Calificar servicio
  rateService: (serviceId, rating, review) =>
    api.post(`/services/${serviceId}/rate`, { rating, review })
}

export default api