const express = require('express')
const authMiddleware = require('../middleware/authMiddleware')
const { syncUser, getProfile, updateProfile } = require('../controllers/authController')

const router = express.Router()

// Sincronizar usuario después del login con Firebase
router.post('/sync', authMiddleware, syncUser)

// Obtener perfil del usuario autenticado
router.get('/profile', authMiddleware, getProfile)

// Actualizar perfil del usuario
router.put('/profile', authMiddleware, updateProfile)

// Verificar si el token es válido
router.get('/verify', authMiddleware, (req, res) => {
  res.json({ 
    valid: true, 
    user: req.user,
    message: 'Token válido'
  })
})

module.exports = router