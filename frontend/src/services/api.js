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

import { auth } from './firebase-config'; // Importar auth de Firebase

// Interceptor de solicitud: agrega token de Firebase a cada request
api.interceptors.request.use(
  async (config) => { // Convertido a async para poder usar await con getIdToken
    if (auth.currentUser) {
      try {
        const token = await auth.currentUser.getIdToken(true); // true fuerza la actualización si está expirado
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error("Error obteniendo token de Firebase:", error);
        // Opcional: Podrías manejar el error aquí, por ejemplo,
        // si no se puede obtener el token, cancelar la solicitud o redirigir.
        // Por ahora, solo lo logueamos y la solicitud continuará sin token si falla.
      }
    }
    // Eliminar la dependencia de localStorage para el token de autenticación
    // ya que Firebase maneja su propia persistencia de sesión.
    // localStorage.removeItem('authToken'); // Esta línea ya no es necesaria aquí.
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de respuesta: manejo de errores 401
api.interceptors.response.use(
  (response) => response,
  async (error) => { // Convertido a async si necesitamos hacer logout de Firebase
    if (error.response?.status === 401 && window.location.pathname !== '/login') {
      console.warn('Error 401: Token inválido o expirado. Redirigiendo a login.');
      // No es necesario limpiar 'authToken' de localStorage si ya no lo usamos para el token principal.
      // Firebase maneja su propia sesión. Si el backend rechaza el token de Firebase,
      // el usuario podría necesitar re-autenticarse o el token refrescarse.
      // Considerar desloguear al usuario de Firebase si el backend consistentemente da 401.
      // await auth.signOut(); // Opcional: forzar deslogueo de Firebase
      
      // Redirigir a login. Evitar bucles si ya está en /login.
      if (window.location.pathname !== '/login') {
         window.location.href = '/login?sessionExpired=true'; // Añadir un query param es opcional
      }
    }
    return Promise.reject(error);
  }
);

// ==========================
// SERVICIOS DE LA API
// ==========================

// 🔐 AUTH
export const authService = {
  // Enviar token de Firebase para sincronizar o crear usuario en el backend
  syncUser: (userData) => api.post('/auth/sync', userData), // Se ejecuta al loguearse/registrarse con Firebase

  // Obtener perfil del usuario autenticado (desde nuestra BD)
  getProfile: () => api.get('/auth/profile'),
  
  // Actualizar perfil del usuario autenticado (en nuestra BD)
  updateProfile: (profileData) => api.put('/auth/profile', profileData) // <--- AÑADIDO updateProfile
}

// 👤 PROFESIONAL
export const professionalService = {
  register: (professionalData) => api.post('/professionals/register', professionalData),
  search: (params) => api.get('/professionals/search', { params }), // <--- AÑADIDO search
  getNearby: (params) => api.get('/professionals/nearby', { params }),
  getProfile: () => api.get('/professionals/profile'), // Perfil del profesional logueado
  // Considerar si se necesita un getPublicProfileById para ver perfiles de otros
  // getPublicProfileById: (id) => api.get(`/professionals/${id}`), 
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
// api.js
export const usersAPI = authService // ← nuevo alias
export const professionalsAPI = professionalService
export const servicesAPI = serviceService



