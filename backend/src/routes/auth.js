import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { syncUser, getProfile, updateProfile } from '../controllers/authController.js';

const router = express.Router();

// Sincronizar usuario después del login con Firebase
router.post('/sync', authMiddleware, syncUser);

// Obtener perfil del usuario autenticado
router.get('/profile', authMiddleware, getProfile);

// Actualizar perfil del usuario
router.put('/profile', authMiddleware, updateProfile);

// Verificar si el token es válido
router.get('/verify', authMiddleware, (req, res) => {
  res.json({ 
    valid: true, 
    user: req.user,
    message: 'Token válido'
  });
});

export default router;

