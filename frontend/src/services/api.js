import axios from 'axios'

// Base de la API (desde tu .env)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

// Instancia de Axios
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Interceptor de solicitud: agrega token a cada request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Interceptor de respuesta: manejo de errores 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && window.location.pathname !== '/login') {
      localStorage.removeItem('authToken')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// ==========================
// SERVICIOS DE LA API
// ==========================

// 🔐 AUTH
export const authService = {
  // Enviar token de Firebase para sincronizar o crear usuario en el backend
  syncUser: (userData) => api.post('/auth/sync', userData),

  // Obtener perfil del usuario autenticado
  getProfile: () => api.get('/auth/profile')
}

// 👤 PROFESIONAL
export const professionalService = {
  register: (professionalData) => api.post('/professionals/register', professionalData),
  getNearby: (params) => api.get('/professionals/nearby', { params }),
  getProfile: () => api.get('/professionals/profile'),
  updateAvailability: (isAvailable) =>
    api.patch('/professionals/availability', { isAvailable })
}

// 🛠️ SERVICIOS
export const serviceService = {
  create: (serviceData) => api.post('/services', serviceData),
  getUserServices: () => api.get('/services/user'),
  acceptService: (serviceId) => api.patch(`/services/${serviceId}/accept`),
  updateStatus: (serviceId, status) =>
    api.patch(`/services/${serviceId}/status`, { status }),
  rateService: (serviceId, rating, review) =>
    api.post(`/services/${serviceId}/rate`, { rating, review })
}

// Exporta la instancia en caso de necesitarla directamente
export default api
