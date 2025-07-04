import { CATEGORY_LABELS, STATUS_LABELS, ERROR_MESSAGES } from './constants'

// Formatear precio en soles peruanos
export const formatPrice = (amount) => {
  if (typeof amount !== 'number') return 'S/ 0.00'
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
    minimumFractionDigits: 2
  }).format(amount)
}

// Formatear fecha
export const formatDate = (date, options = {}) => {
  if (!date) return ''
  
  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options
  }
  
  return new Date(date).toLocaleDateString('es-PE', defaultOptions)
}

// Formatear fecha y hora
export const formatDateTime = (date) => {
  if (!date) return ''
  
  return new Date(date).toLocaleString('es-PE', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Formatear tiempo relativo (hace X tiempo)
export const formatTimeAgo = (date) => {
  if (!date) return ''
  
  const now = new Date()
  const diff = now - new Date(date)
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  
  if (days > 0) return `hace ${days} día${days > 1 ? 's' : ''}`
  if (hours > 0) return `hace ${hours} hora${hours > 1 ? 's' : ''}`
  if (minutes > 0) return `hace ${minutes} minuto${minutes > 1 ? 's' : ''}`
  return 'hace un momento'
}

// Obtener etiqueta de categoría
export const getCategoryLabel = (category) => {
  return CATEGORY_LABELS[category] || category
}

// Obtener etiqueta de estado
export const getStatusLabel = (status) => {
  return STATUS_LABELS[status] || status
}

// Capitalizar primera letra
export const capitalize = (str) => {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

// Truncar texto
export const truncateText = (text, maxLength = 100) => {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

// Validar email
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Validar teléfono peruano
export const isValidPeruvianPhone = (phone) => {
  const phoneRegex = /^(\+51|51)?[9]\d{8}$/
  return phoneRegex.test(phone)
}

// Formatear teléfono
export const formatPhoneNumber = (phone) => {
  if (!phone) return ''
  
  // Remover caracteres no numéricos
  const cleanPhone = phone.replace(/\D/g, '')
  
  // Formatear como +51 9XX XXX XXX
  if (cleanPhone.length === 9 && cleanPhone.startsWith('9')) {
    return `+51 ${cleanPhone.substring(0, 3)} ${cleanPhone.substring(3, 6)} ${cleanPhone.substring(6)}`
  }
  
  if (cleanPhone.length === 11 && cleanPhone.startsWith('51')) {
    const number = cleanPhone.substring(2)
    return `+51 ${number.substring(0, 3)} ${number.substring(3, 6)} ${number.substring(6)}`
  }
  
  return phone
}

// Generar ID único
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

// Calcular distancia entre dos puntos (Haversine formula)
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371 // Radio de la Tierra en km
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}

// Formatear distancia
export const formatDistance = (distance) => {
  if (distance < 1) {
    return `${Math.round(distance * 1000)} m`
  }
  return `${distance.toFixed(1)} km`
}

// Debounce function
export const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Throttle function
export const throttle = (func, limit) => {
  let inThrottle
  return function() {
    const args = arguments
    const context = this
    if (!inThrottle) {
      func.apply(context, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

// Convertir a slug
export const slugify = (text) => {
  if (!text) return ''
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '')
}

// Obtener iniciales del nombre
export const getInitials = (name) => {
  if (!name) return ''
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2)
}

// Obtener color aleatorio
export const getRandomColor = () => {
  const colors = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
    '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6366F1'
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}

// Manejar errores de API
export const handleApiError = (error) => {
  console.error('API Error:', error)
  
  if (!error.response) {
    return ERROR_MESSAGES.NETWORK_ERROR
  }
  
  const status = error.response.status
  
  switch (status) {
    case 401:
      return ERROR_MESSAGES.UNAUTHORIZED
    case 404:
      return ERROR_MESSAGES.NOT_FOUND
    case 422:
      return ERROR_MESSAGES.VALIDATION_ERROR
    case 500:
      return ERROR_MESSAGES.SERVER_ERROR
    default:
      return error.response.data?.message || ERROR_MESSAGES.SERVER_ERROR
  }
}

// Obtener ubicación del usuario
export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation no es soportado por este navegador'))
      return
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        })
      },
      (error) => {
        reject(error)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutos
      }
    )
  })
}

// Generar avatar placeholder
export const generateAvatar = (name) => {
  const initials = getInitials(name)
  const color = getRandomColor()
  
  return `data:image/svg+xml;base64,${btoa(`
    <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" fill="${color}"/>
      <text x="50%" y="50%" text-anchor="middle" dy="0.35em" font-family="Arial, sans-serif" font-size="40" fill="white">${initials}</text>
    </svg>
  `)}`
}

export default {
  formatPrice,
  formatDate,
  formatDateTime,
  formatTimeAgo,
  getCategoryLabel,
  getStatusLabel,
  capitalize,
  truncateText,
  isValidEmail,
  isValidPeruvianPhone,
  formatPhoneNumber,
  generateId,
  calculateDistance,
  formatDistance,
  debounce,
  throttle,
  slugify,
  getInitials,
  getRandomColor,
  handleApiError,
  getCurrentLocation,
  generateAvatar
}