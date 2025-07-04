// Constantes de la aplicación Toklen

// Categorías de servicios profesionales
export const SERVICE_CATEGORIES = {
  PLUMBING: 'plomeria',
  ELECTRICAL: 'electricidad',
  CLEANING: 'limpieza',
  CARPENTRY: 'carpinteria',
  PAINTING: 'pintura',
  GARDENING: 'jardineria',
  APPLIANCE_REPAIR: 'reparacion_electrodomesticos',
  AIR_CONDITIONING: 'aire_acondicionado',
  LOCKSMITH: 'cerrajeria',
  MASONRY: 'albañileria',
  PEST_CONTROL: 'control_plagas',
  ROOFING: 'techado',
  FLOORING: 'pisos',
  SECURITY: 'seguridad',
  BEAUTY: 'belleza',
  TUTORING: 'tutoria',
  DELIVERY: 'delivery',
  MOVING: 'mudanza',
  PHOTOGRAPHY: 'fotografia',
  CATERING: 'catering'
}

// Etiquetas de categorías para mostrar
export const CATEGORY_LABELS = {
  [SERVICE_CATEGORIES.PLUMBING]: 'Plomería',
  [SERVICE_CATEGORIES.ELECTRICAL]: 'Electricidad',
  [SERVICE_CATEGORIES.CLEANING]: 'Limpieza',
  [SERVICE_CATEGORIES.CARPENTRY]: 'Carpintería',
  [SERVICE_CATEGORIES.PAINTING]: 'Pintura',
  [SERVICE_CATEGORIES.GARDENING]: 'Jardinería',
  [SERVICE_CATEGORIES.APPLIANCE_REPAIR]: 'Reparación de Electrodomésticos',
  [SERVICE_CATEGORIES.AIR_CONDITIONING]: 'Aire Acondicionado',
  [SERVICE_CATEGORIES.LOCKSMITH]: 'Cerrajería',
  [SERVICE_CATEGORIES.MASONRY]: 'Albañilería',
  [SERVICE_CATEGORIES.PEST_CONTROL]: 'Control de Plagas',
  [SERVICE_CATEGORIES.ROOFING]: 'Techado',
  [SERVICE_CATEGORIES.FLOORING]: 'Pisos',
  [SERVICE_CATEGORIES.SECURITY]: 'Seguridad',
  [SERVICE_CATEGORIES.BEAUTY]: 'Belleza',
  [SERVICE_CATEGORIES.TUTORING]: 'Tutoría',
  [SERVICE_CATEGORIES.DELIVERY]: 'Delivery',
  [SERVICE_CATEGORIES.MOVING]: 'Mudanza',
  [SERVICE_CATEGORIES.PHOTOGRAPHY]: 'Fotografía',
  [SERVICE_CATEGORIES.CATERING]: 'Catering'
}

// Estados de servicios
export const SERVICE_STATUSES = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
}

// Etiquetas de estados
export const STATUS_LABELS = {
  [SERVICE_STATUSES.PENDING]: 'Pendiente',
  [SERVICE_STATUSES.CONFIRMED]: 'Confirmado',
  [SERVICE_STATUSES.IN_PROGRESS]: 'En Progreso',
  [SERVICE_STATUSES.COMPLETED]: 'Completado',
  [SERVICE_STATUSES.CANCELLED]: 'Cancelado'
}

// Colores para estados
export const STATUS_COLORS = {
  [SERVICE_STATUSES.PENDING]: 'bg-yellow-100 text-yellow-800',
  [SERVICE_STATUSES.CONFIRMED]: 'bg-blue-100 text-blue-800',
  [SERVICE_STATUSES.IN_PROGRESS]: 'bg-purple-100 text-purple-800',
  [SERVICE_STATUSES.COMPLETED]: 'bg-green-100 text-green-800',
  [SERVICE_STATUSES.CANCELLED]: 'bg-red-100 text-red-800'
}

// Distritos de Lima
export const LIMA_DISTRICTS = [
  'Ate', 'Barranco', 'Breña', 'Carabayllo', 'Chaclacayo', 'Chorrillos',
  'Cieneguilla', 'Comas', 'El Agustino', 'Independencia', 'Jesús María',
  'La Molina', 'La Victoria', 'Lima', 'Lince', 'Los Olivos', 'Lurigancho',
  'Lurin', 'Magdalena del Mar', 'Miraflores', 'Pachacamac', 'Pucusana',
  'Pueblo Libre', 'Puente Piedra', 'Punta Hermosa', 'Punta Negra',
  'Rímac', 'San Bartolo', 'San Borja', 'San Isidro', 'San Juan de Lurigancho',
  'San Juan de Miraflores', 'San Luis', 'San Martín de Porres', 'San Miguel',
  'Santa Anita', 'Santa María del Mar', 'Santa Rosa', 'Santiago de Surco',
  'Surquillo', 'Villa El Salvador', 'Villa María del Triunfo'
]

// Rangos de precios
export const PRICE_RANGES = {
  BUDGET: { min: 0, max: 50, label: 'Económico (S/ 0 - 50)' },
  MEDIUM: { min: 51, max: 150, label: 'Medio (S/ 51 - 150)' },
  PREMIUM: { min: 151, max: 300, label: 'Premium (S/ 151 - 300)' },
  LUXURY: { min: 301, max: 999999, label: 'Luxury (S/ 301+)' }
}

// Tipos de usuario
export const USER_TYPES = {
  CLIENT: 'client',
  PROFESSIONAL: 'professional',
  ADMIN: 'admin'
}

// Configuración de Google Maps
export const GOOGLE_MAPS_CONFIG = {
  DEFAULT_CENTER: {
    lat: -12.0464,
    lng: -77.0428
  },
  DEFAULT_ZOOM: 12,
  SEARCH_RADIUS: 10000, // 10km en metros
  MARKER_COLORS: {
    USER: '#3B82F6',
    PROFESSIONAL: '#10B981',
    SERVICE: '#F59E0B'
  }
}

// Configuración de paginación
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 50
}

// Mensajes de error comunes
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Error de conexión. Verifica tu internet.',
  UNAUTHORIZED: 'No tienes permisos para realizar esta acción.',
  NOT_FOUND: 'El recurso solicitado no fue encontrado.',
  VALIDATION_ERROR: 'Los datos ingresados no son válidos.',
  SERVER_ERROR: 'Error del servidor. Intenta más tarde.',
  GEOLOCATION_ERROR: 'No se pudo obtener tu ubicación.',
  FIREBASE_ERROR: 'Error de autenticación. Intenta nuevamente.'
}

// Configuración de validación
export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^(\+51|51)?[9]\d{8}$/,
  MIN_PASSWORD_LENGTH: 6,
  MAX_NAME_LENGTH: 50,
  MAX_DESCRIPTION_LENGTH: 500
}

// URLs de la aplicación
export const APP_URLS = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  SEARCH: '/search-professionals',
  REQUEST_SERVICE: '/request-service',
  BECOME_PROFESSIONAL: '/become-professional'
}

export default {
  SERVICE_CATEGORIES,
  CATEGORY_LABELS,
  SERVICE_STATUSES,
  STATUS_LABELS,
  STATUS_COLORS,
  LIMA_DISTRICTS,
  PRICE_RANGES,
  USER_TYPES,
  GOOGLE_MAPS_CONFIG,
  PAGINATION,
  ERROR_MESSAGES,
  VALIDATION,
  APP_URLS
}