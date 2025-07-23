import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

// Importar middlewares personalizados
import { corsMiddleware, securityHeaders, corsLogger } from './middleware/corsMiddleware.js';
import errorHandler from './middleware/errorHandler.js';
import { notFoundHandler, errorLogger } from './middleware/errorUtils.js';

// Importar rutas
import authRoutes from './routes/auth.js';
import professionalRoutes from './routes/professionals.js';
import serviceRoutes from './routes/services.js';
import adminRoutes from './routes/admin.js';

const app = express();

// Configuración de seguridad avanzada
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));

// Headers de seguridad adicionales
app.use(securityHeaders);

// CORS con configuración avanzada
app.use(corsLogger); // Solo en desarrollo
app.use(corsMiddleware);

// Rate limiting más sofisticado
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por IP por ventana
  message: {
    success: false,
    message: 'Demasiadas solicitudes desde esta IP, intenta más tarde.',
    retryAfter: 15 * 60 // segundos
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  skip: (req) => {
    // Omitir rate limiting para rutas de salud
    return req.path === '/api/health';
  }
});

// Rate limiting especial para autenticación
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // máximo 5 intentos de login por IP
  message: {
    success: false,
    message: 'Demasiados intentos de autenticación, intenta más tarde.',
    retryAfter: 15 * 60
  },
  skipSuccessfulRequests: true // No contar requests exitosos
});

app.use(limiter);

// Trust proxy (importante para obtener IP real en producción)
app.set('trust proxy', 1);

// Body parser con límites de seguridad
app.use(express.json({ 
  limit: '10mb',
  verify: (req, res, buf) => {
    try {
      JSON.parse(buf);
    } catch (e) {
      res.status(400).json({
        success: false,
        message: 'JSON inválido'
      });
      return;
    }
  }
}));

app.use(express.urlencoded({ 
  extended: true,
  limit: '10mb'
}));

// Middleware de logging para requests
app.use((req, res, next) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - IP: ${req.ip}`);
  }
  next();
});

// Rutas con rate limiting específico para auth
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/professionals', professionalRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/admin', adminRoutes);

// Ruta de salud mejorada
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || '1.0.0',
    uptime: process.uptime()
  });
});

// Ruta para información de la API
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'API de Toklen funcionando correctamente',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      professionals: '/api/professionals',
      services: '/api/services',
      admin: '/api/admin',
      health: '/api/health'
    }
  });
});

// Middleware de logging de errores (antes del error handler)
app.use(errorLogger);

// Middleware para rutas no encontradas (DEBE ir antes del error handler)
app.all('*', notFoundHandler);

// Middleware global de manejo de errores (SIEMPRE al final)
app.use(errorHandler);

// Manejo graceful de cierre de la aplicación
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM recibido. Cerrando servidor HTTP...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('👋 SIGINT recibido. Cerrando servidor HTTP...');
  process.exit(0);
});

export default app;

