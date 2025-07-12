const express = require('express');
const router = express.Router();
const { verifyFirebaseToken, fetchUserFromDbAndAttach, requireRole } = require('../middleware/security');
const adminController = require('../controllers/adminController');

// Aplicar middlewares a todas las rutas de admin
// 1. Verifica el token de Firebase y pone datos básicos en req.user
// 2. Obtiene el usuario de nuestra BD (incluyendo user_type) y lo pone en req.dbUser
// 3. Verifica que req.dbUser.user_type sea 'admin'
router.use(verifyFirebaseToken, fetchUserFromDbAndAttach, requireRole(['admin']));

// Rutas específicas de admin
router.get('/users', adminController.listUsers);
router.get('/services', adminController.listServices);
router.patch('/services/:serviceId/approve', adminController.approveService);
router.patch('/services/:serviceId/reject', adminController.rejectService); // Asumiendo que rechazar es una actualización de estado
router.delete('/services/:serviceId', adminController.deleteService);
// router.delete('/users/:userId', adminController.deleteUser); // Opcional para MVP

module.exports = router;


