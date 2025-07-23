import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

// Cargar variables de entorno
dotenv.config();

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
// SEGURIDAD BÁSICA
// ===============================

// Helmet para headers de seguridad
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false
}));

// CORS básico
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    process.env.FRONTEND_URL
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Rate limiting básico
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por IP
  message: {
    error: 'Demasiadas peticiones. Intenta más tarde.',
    code: 'RATE_LIMIT_API'
  }
});

app.use('/api/', limiter);

// ===============================
// RUTAS DE PRUEBA
// ===============================

// Health check básico
app.get('/ping', (req, res) => {
  res.json({
    status: 'pong',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Health check de API
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0',
    uptime: process.uptime()
  });
});

// Ruta de información
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'API de Toklen funcionando correctamente',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      ping: '/ping'
    }
  });
});

// Rutas de prueba para autenticación
app.post('/api/auth/login', (req, res) => {
  res.json({ 
    message: 'Login exitoso (demo)',
    user: {
      id: 'demo-user-id',
      email: req.body.email || 'demo@example.com',
      type: 'client'
    }
  });
});

app.post('/api/auth/register', (req, res) => {
  res.status(201).json({
    message: 'Usuario registrado (demo)',
    data: { 
      id: 'demo-new-user-id',
      email: req.body.email || 'demo@example.com',
      type: req.body.userType || 'client'
    }
  });
});

// Rutas de servicios de prueba
app.get('/api/services', (req, res) => {
  res.json({
    services: [
      {
        id: 'demo-service-1',
        title: 'Desarrollo Web',
        description: 'Creación de sitios web profesionales',
        price: 50,
        priceType: 'hourly',
        category: 'Desarrollo'
      },
      {
        id: 'demo-service-2',
        title: 'Diseño Gráfico',
        description: 'Diseño de logos y material gráfico',
        price: 30,
        priceType: 'hourly',
        category: 'Diseño'
      }
    ]
  });
});

app.get('/api/categories', (req, res) => {
  res.json({
    categories: [
      { id: 'dev', name: 'Desarrollo Web' },
      { id: 'design', name: 'Diseño Gráfico' },
      { id: 'marketing', name: 'Marketing Digital' }
    ]
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
  console.log(`🚀 Servidor de prueba iniciado en puerto ${PORT}`);
  console.log(`🌐 Accesible en: http://localhost:${PORT}`);
  console.log('🛡️ Seguridad básica activa');
  console.log(`🌍 Entorno: ${process.env.NODE_ENV || 'development'}`);
  console.log('📋 Endpoints disponibles:');
  console.log('   GET  /ping - Health check básico');
  console.log('   GET  /api/health - Health check completo');
  console.log('   GET  /api - Información de la API');
  console.log('   POST /api/auth/login - Login de prueba');
  console.log('   POST /api/auth/register - Registro de prueba');
  console.log('   GET  /api/services - Servicios de prueba');
  console.log('   GET  /api/categories - Categorías de prueba');
});

// Manejo de cierre graceful
process.on('SIGTERM', () => {
  console.log('🔄 Cerrando servidor...');
  server.close(() => {
    console.log('✅ Servidor cerrado correctamente');
    process.exit(0);
  });
});

export default app;

