import Joi from 'joi'; // ✅ Para respaldo en validación

// ✅ Cargar variables desde .env
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import { connectDB } from './src/config/database.js';
import {
  setupSecurity,
  authLimiter,
  registerLimiter,
  verifyFirebaseToken,
  validateData,
  validationSchemas,
  requireRole
} from './src/middleware/security.js';

// Importar rutas de health check
import healthRoutes from './src/routes/health.js';

const app = express();
const PORT = process.env.PORT || 5000;

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
// RUTAS DE SALUD (ANTES DE LA CONEXIÓN DB)
// ===============================

// Health check básico que no requiere DB
app.get('/ping', (req, res) => {
  res.json({
    status: 'pong',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// ===============================
// CONEXIÓN A BASE DE DATOS
// ===============================

connectDB()
  .then(() => {
    console.log('✅ Conectado a PostgreSQL');

    // ===============================
    // RUTAS DE SALUD CON DB
    // ===============================
    
    // Usar las rutas de health check que requieren DB
    app.use('/api', healthRoutes);

    // Health check simple para compatibilidad
    app.get('/api/health-simple', (req, res) => {
      res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        env: process.env.NODE_ENV || 'development'
      });
    });

    // ===============================
    // RUTAS DE AUTENTICACIÓN
    // ===============================

    app.post('/api/auth/login',
      authLimiter,
      validateData(validationSchemas.login || Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required()
      })),
      (req, res) => {
        // TODO: Implementar lógica de login real
        res.json({ 
          message: 'Login exitoso (demo)',
          user: {
            id: 'demo-user-id',
            email: req.body.email,
            type: 'client'
          }
        });
      }
    );

    app.post('/api/auth/register',
      registerLimiter,
      validateData(validationSchemas.register || Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        userType: Joi.string().valid('client', 'provider').required()
      })),
      async (req, res) => {
        // TODO: Implementar lógica de registro real
        res.status(201).json({
          message: 'Usuario registrado (demo)',
          data: { 
            id: 'demo-new-user-id',
            email: req.body.email,
            type: req.body.userType
          }
        });
      }
    );

    // ===============================
    // RUTAS PÚBLICAS DE SERVICIOS
    // ===============================

    app.get('/api/services', (req, res) => {
      // TODO: Implementar consulta real a la DB
      res.json({
        services: [
          {
            id: 'demo-service-1',
            title: 'Desarrollo Web',
            description: 'Creación de sitios web profesionales',
            price: 50,
            priceType: 'hourly',
            category: 'Desarrollo'
          }
        ]
      });
    });

    app.get('/api/categories', (req, res) => {
      // TODO: Implementar consulta real a la DB
      res.json({
        categories: [
          { id: 'dev', name: 'Desarrollo Web' },
          { id: 'design', name: 'Diseño Gráfico' },
          { id: 'marketing', name: 'Marketing Digital' }
        ]
      });
    });

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
      validateData(validationSchemas.updateProfile || Joi.object({
        firstName: Joi.string(),
        lastName: Joi.string(),
        phone: Joi.string()
      })),
      (req, res) => {
        res.json({ message: 'Perfil actualizado' });
      }
    );

    app.post('/api/protected/service-requests',
      validateData(validationSchemas.createServiceRequest || Joi.object({
        serviceId: Joi.string().required(),
        description: Joi.string().required(),
        budget: Joi.number().positive()
      })),
      (req, res) => {
        res.status(201).json({ 
          message: 'Solicitud de servicio creada',
          id: 'demo-request-id'
        });
      }
    );

    // ===============================
    // RUTAS DE ADMINISTRADOR
    // ===============================
    app.use('/api/admin', verifyFirebaseToken, requireRole(['admin']));

    app.get('/api/admin/stats', (req, res) => {
      res.json({ 
        message: 'Estadísticas (demo)',
        stats: {
          totalUsers: 150,
          totalServices: 45,
          totalRequests: 89
        }
      });
    });

    // ===============================
    // RUTAS PROFESIONALES
    // ===============================
    app.use('/api/professional', verifyFirebaseToken, requireRole(['admin', 'professional']));

    app.get('/api/professional/requests', (req, res) => {
      res.json({ 
        message: 'Solicitudes del profesional (demo)',
        requests: []
      });
    });

    // ===============================
    // MANEJO DE ERRORES
    // ===============================

    app.use('*', (req, res) => {
      res.status(404).json({
        error: 'Ruta no encontrada',
        code: 'ROUTE_NOT_FOUND',
        path: req.originalUrl
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
    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Servidor iniciado en puerto ${PORT}`);
      console.log(`🌐 Accesible en: http://localhost:${PORT}`);
      console.log('🛡️ Seguridad activa:');
      console.log('   ✅ Helmet');
      console.log('   ✅ CORS');
      console.log('   ✅ Rate Limiting');
      console.log('   ✅ Sanitización SQL');
      console.log('   ✅ Validación de datos');
      console.log('   ✅ Firebase Auth');
      console.log('   ✅ Logging de seguridad');
      console.log(`🌍 Entorno: ${process.env.NODE_ENV || 'development'}`);
      console.log('📋 Endpoints disponibles:');
      console.log('   GET  /ping - Health check básico');
      console.log('   GET  /api/health - Health check completo');
      console.log('   GET  /api/status - Estado detallado');
      console.log('   POST /api/auth/login - Iniciar sesión');
      console.log('   POST /api/auth/register - Registrarse');
      console.log('   GET  /api/services - Listar servicios');
      console.log('   GET  /api/categories - Listar categorías');
    });

    // Manejo de cierre graceful
    process.on('SIGTERM', () => {
      console.log('🔄 Cerrando servidor...');
      server.close(() => {
        console.log('✅ Servidor cerrado correctamente');
        process.exit(0);
      });
    });

  })
  .catch((error) => {
    console.error('❌ Error al conectar a la base de datos:', error);
    console.error('💡 Verifica que PostgreSQL esté ejecutándose y la configuración sea correcta');
    process.exit(1);
  });

export default app;

