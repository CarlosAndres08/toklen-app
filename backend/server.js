const Joi = require('joi'); // ✅ Para respaldo en validación


// ✅ Cargar variables desde .env
require('dotenv').config();

const express = require('express');
const { connectDB } = require('./src/config/database');
const {
  setupSecurity,
  authLimiter,
  registerLimiter,
  verifyFirebaseToken,
  validateData,
  validationSchemas,
  requireRole
} = require('./src/middleware/security');

const app = express();
const PORT = process.env.PORT || 3000;

// ===============================
// CONFIGURACIÓN BÁSICA
// ===============================

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Render/Vercel necesitan esto para IP real
app.set('trust proxy', 1);

// ===============================
// APLICAR SEGURIDAD
// ===============================

setupSecurity(app);

// ===============================
// CONEXIÓN A BASE DE DATOS
// ===============================

connectDB()
  .then(() => {
    console.log('✅ Conectado a PostgreSQL');

    // ===============================
    // RUTAS DE SALUD
    // ===============================
    app.get('/api/health', (req, res) => {
      res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        env: process.env.NODE_ENV
      });
    });

    // ===============================
    // RUTAS DE AUTENTICACIÓN
    // ===============================

    app.post('/api/auth/login',
      authLimiter,
      validateData(validationSchemas.login || Joi.object({})), // Puedes definirlo después
      (req, res) => {
        res.json({ message: 'Login exitoso (demo)' });
      }
    );

    app.post('/api/auth/register-professional',
      registerLimiter,
      validateData(validationSchemas.registerProfessional),
      async (req, res) => {
        res.status(201).json({
          message: 'Profesional registrado (demo)',
          data: { id: 'temp-id' }
        });
      }
    );

    // ===============================
    // RUTAS PROTEGIDAS
    // ===============================
    app.use('/api/protected', verifyFirebaseToken);

    app.get('/api/protected/profile', (req, res) => {
      res.json({
        user: req.user,
        message: 'Perfil obtenido'
      });
    });

    app.put('/api/protected/profile',
      validateData(validationSchemas.updateProfile),
      (req, res) => {
        res.json({ message: 'Perfil actualizado' });
      }
    );

    app.post('/api/protected/appointments',
      validateData(validationSchemas.createAppointment),
      (req, res) => {
        res.status(201).json({ message: 'Cita creada' });
      }
    );

    // ===============================
    // RUTAS DE ADMINISTRADOR
    // ===============================
    app.use('/api/admin', verifyFirebaseToken, requireRole(['admin']));

    app.get('/api/admin/stats', (req, res) => {
      res.json({ message: 'Estadísticas (demo)' });
    });

    // ===============================
    // RUTAS PROFESIONALES
    // ===============================
    app.use('/api/professional', verifyFirebaseToken, requireRole(['admin', 'professional']));

    app.get('/api/professional/appointments', (req, res) => {
      res.json({ message: 'Citas del profesional (demo)' });
    });

    // ===============================
    // MANEJO DE ERRORES
    // ===============================

    app.use('*', (req, res) => {
      res.status(404).json({
        error: 'Ruta no encontrada',
        code: 'ROUTE_NOT_FOUND'
      });
    });

    app.use((error, req, res, next) => {
      console.error('❌ Error global:', error);

      if (error.message === 'No permitido por política CORS') {
        return res.status(403).json({
          error: 'Dominio no permitido',
          code: 'CORS_ERROR'
        });
      }

      if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
        return res.status(400).json({
          error: 'JSON malformado',
          code: 'INVALID_JSON'
        });
      }

      res.status(500).json({
        error: process.env.NODE_ENV === 'production' ? 'Error interno del servidor' : error.message,
        code: 'INTERNAL_ERROR'
      });
    });

    // ===============================
    // INICIAR SERVIDOR
    // ===============================
    app.listen(PORT, () => {
      console.log(`🚀 Servidor iniciado en puerto ${PORT}`);
      console.log('🛡️ Seguridad activa:');
      console.log('   ✅ Helmet');
      console.log('   ✅ CORS');
      console.log('   ✅ Rate Limiting');
      console.log('   ✅ Sanitización SQL');
      console.log('   ✅ Validación de datos');
      console.log('   ✅ Firebase Auth');
      console.log('   ✅ Logging de seguridad');
      console.log(`🌍 Entorno: ${process.env.NODE_ENV || 'development'}`);
    });
  })
  .catch((error) => {
    console.error('❌ Error al conectar a la base de datos:', error);
    process.exit(1);
  });

module.exports = app;
