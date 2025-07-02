const express = require('express')
const authMiddleware = require('../middleware/authMiddleware')
const { 
  createService, 
  getUserServices, 
  acceptService, 
  updateServiceStatus,
  rateService,
  getServiceById,
  getNearbyServices
} = require('../controllers/serviceController')

const router = express.Router()

// Crear nueva solicitud de servicio
router.post('/', authMiddleware, createService)

// Obtener servicios del usuario (como cliente o profesional)
router.get('/user', authMiddleware, getUserServices)

// Obtener servicios cercanos (para profesionales)
router.get('/nearby', authMiddleware, getNearbyServices)

// Obtener servicio específico por ID
router.get('/:id', authMiddleware, getServiceById)

// Aceptar servicio (solo profesionales)
router.patch('/:id/accept', authMiddleware, acceptService)

// Actualizar estado del servicio
router.patch('/:id/status', authMiddleware, updateServiceStatus)

// Calificar servicio
router.post('/:id/rate', authMiddleware, rateService)

module.exports = router