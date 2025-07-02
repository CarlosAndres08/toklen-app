const express = require('express')
const authMiddleware = require('../middleware/authMiddleware')
const { registerProfessional, getNearbyProfessionals } = require('../controllers/professionalController')

const router = express.Router()

// Registrar profesional (requiere autenticación)
router.post('/register', authMiddleware, registerProfessional)

// Buscar profesionales cercanos
router.get('/nearby', getNearbyProfessionals)

module.exports = router