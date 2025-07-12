const express = require('express')
const authMiddleware = require('../middleware/authMiddleware')
const { 
  createService, 
  getUserServices, 
  acceptService, 
  updateServiceStatus,
  rateService,
  getServiceById,
  getNearbyServices,
  listPublicServices // Importar la nueva función
} = require('../controllers/serviceController')

const router = express.Router()

// Ruta pública para listar servicios aprobados (para búsqueda/exploración)
router.get('/', listPublicServices); 

// Crear nueva solicitud de servicio (protegida)
router.post('/', authMiddleware, createService)

// Obtener servicios del usuario (como cliente o profesional) (protegida)
router.get('/user', authMiddleware, getUserServices)

// Obtener servicios cercanos (para profesionales) (protegida)
router.get('/nearby', authMiddleware, getNearbyServices)

// Obtener servicio específico por ID (protegida, ya que puede tener datos sensibles antes de ser público)
// O podría ser pública si solo muestra datos generales de servicios aprobados.
// Por ahora la mantengo protegida. El frontend decidirá si se necesita una versión pública.
router.get('/:id', authMiddleware, getServiceById)

// Aceptar servicio (solo profesionales) (protegida)
router.patch('/:id/accept', authMiddleware, acceptService)

// Actualizar estado del servicio
router.patch('/:id/status', authMiddleware, updateServiceStatus)

// Calificar servicio
router.post('/:id/rate', authMiddleware, rateService)

module.exports = router