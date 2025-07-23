import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import cors from 'cors';
import Joi from 'joi';
import admin from 'firebase-admin';
import { pool } from '../config/database.js';

// ===============================
// 1. RATE LIMITING
// ===============================

// Rate limiting específico para auth
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // máximo 5 intentos de login por IP
  message: {
    error: 'Demasiados intentos de login. Intenta en 15 minutos.',
    code: 'RATE_LIMIT_AUTH'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Rate limiting para registro de profesionales
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora  
  max: 3, // máximo 3 registros por hora por IP
  message: {
    error: 'Demasiados registros. Intenta en 1 hora.',
    code: 'RATE_LIMIT_REGISTER'
  }
});

// Rate limiting general para API
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por IP
  message: {
    error: 'Demasiadas peticiones. Intenta más tarde.',
    code: 'RATE_LIMIT_API'
  }
});

// Rate limiting estricto para operaciones sensibles
const strictLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutos
  max: 3, // máximo 3 intentos
  message: {
    error: 'Operación bloqueada temporalmente por seguridad.',
    code: 'RATE_LIMIT_STRICT'
  }
});

// ===============================
// 2. CORS CONFIGURACIÓN
// ===============================

const corsOptions = {
  origin: function (origin, callback) {
    // Dominios permitidos
    const allowedOrigins = [
      process.env.FRONTEND_URL,
      'http://localhost:3000',
      'http://localhost:5173',
      'https://tu-frontend-app.vercel.app' // Actualizar con tu dominio real
    ];

    // Permitir requests sin origin (mobile apps, Postman)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por política CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  maxAge: 86400 // 24 horas
};

// ===============================
// 3. HELMET CONFIGURACIÓN
// ===============================

const helmetOptions = {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'", process.env.FRONTEND_URL]
    }
  },
  crossOriginEmbedderPolicy: false
};

// ===============================
// 4. FIREBASE AUTH VERIFICATION
// ===============================

const verifyFirebaseToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Token de autorización requerido',
        code: 'AUTH_MISSING_TOKEN'
      });
    }

    const idToken = authHeader.split('Bearer ')[1];
    
    // Verificar token con Firebase Admin
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    
    // Agregar info del usuario al request
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      emailVerified: decodedToken.email_verified
    };

    next();
  } catch (error) {
    console.error('Error verificando token Firebase:', error);
    
    let errorMessage = 'Token inválido';
    let errorCode = 'AUTH_INVALID_TOKEN';
    
    if (error.code === 'auth/id-token-expired') {
      errorMessage = 'Token expirado';
      errorCode = 'AUTH_TOKEN_EXPIRED';
    }
    
    return res.status(401).json({
      error: errorMessage,
      code: errorCode
    });
  }
};

// ===============================
// 5. VALIDACIÓN DE DATOS CON JOI
// ===============================

// Esquemas de validación
const validationSchemas = {
  // Login
  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
  }),

  // Registro
  register: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    userType: Joi.string().valid('client', 'provider').required()
  }),

  // Registro de profesional
  registerProfessional: Joi.object({
    email: Joi.string().email().required().max(255),
    firstName: Joi.string().trim().min(2).max(50).required(),
    lastName: Joi.string().trim().min(2).max(50).required(),
    phone: Joi.string().pattern(/^\+?[1-9]\d{8,14}$/).required(),
    specialties: Joi.array().items(Joi.string().max(100)).min(1).max(5).required(),
    licenseNumber: Joi.string().trim().min(5).max(50).required(),
    yearsExperience: Joi.number().integer().min(0).max(50).required(),
    bio: Joi.string().trim().max(1000).optional(),
    availability: Joi.object({
      timezone: Joi.string().required(),
      schedule: Joi.object().pattern(
        Joi.string().valid('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'),
        Joi.object({
          start: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/),
          end: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
        })
      )
    }).required()
  }),

  // Crear cita
  createAppointment: Joi.object({
    professionalId: Joi.string().uuid().required(),
    startTime: Joi.date().iso().greater('now').required(),
    duration: Joi.number().valid(30, 45, 60, 90).required(),
    notes: Joi.string().trim().max(500).optional(),
    appointmentType: Joi.string().valid('consultation', 'therapy', 'evaluation').required()
  }),

  // Crear solicitud de servicio
  createServiceRequest: Joi.object({
    serviceId: Joi.string().required(),
    description: Joi.string().required(),
    budget: Joi.number().positive()
  }),

  // Actualizar perfil
  updateProfile: Joi.object({
    firstName: Joi.string().trim().min(2).max(50).optional(),
    lastName: Joi.string().trim().min(2).max(50).optional(),
    phone: Joi.string().pattern(/^\+?[1-9]\d{8,14}$/).optional(),
    bio: Joi.string().trim().max(1000).optional(),
    avatar: Joi.string().uri().optional()
  })
};

// Middleware de validación
const validateData = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errorDetails = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
        value: detail.context?.value
      }));

      return res.status(400).json({
        error: 'Datos de entrada inválidos',
        code: 'VALIDATION_ERROR',
        details: errorDetails
      });
    }

    // Reemplazar req.body con datos validados y sanitizados
    req.body = value;
    next();
  };
};

// ===============================
// 6. PREVENCIÓN SQL INJECTION
// ===============================

// Middleware para sanitizar queries
const sanitizeQuery = (req, res, next) => {
  // Lista de patrones SQL peligrosos
  const dangerousPatterns = [
    /(\b(union|select|insert|delete|update|drop|create|alter|exec|execute)\b)/gi,
    /(--|\/\*|\*\/|;|'|"|`)/g,
    /(\b(or|and)\b\s+\d+\s*=\s*\d+)/gi
  ];

  const checkForSQLInjection = (obj) => {
    for (let key in obj) {
      if (typeof obj[key] === 'string') {
        for (let pattern of dangerousPatterns) {
          if (pattern.test(obj[key])) {
            return true;
          }
        }
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        if (checkForSQLInjection(obj[key])) {
          return true;
        }
      }
    }
    return false;
  };

  // Verificar query parameters
  if (checkForSQLInjection(req.query)) {
    return res.status(400).json({
      error: 'Parámetros de consulta inválidos',
      code: 'INVALID_QUERY_PARAMS'
    });
  }

  // Verificar body
  if (req.body && checkForSQLInjection(req.body)) {
    return res.status(400).json({
      error: 'Datos de entrada inválidos',
      code: 'INVALID_INPUT_DATA'
    });
  }

  next();
};

// ===============================
// 7. LOGGING DE SEGURIDAD
// ===============================

const securityLogger = (req, res, next) => {
  const startTime = Date.now();
  
  // Log request básico
  console.log(`🔐 [${new Date().toISOString()}] ${req.method} ${req.originalUrl} - IP: ${req.ip}`);
  
  // Log headers sospechosos
  const suspiciousHeaders = ['x-forwarded-for', 'x-real-ip', 'user-agent'];
  suspiciousHeaders.forEach(header => {
    if (req.headers[header]) {
      console.log(`🔍 Header ${header}: ${req.headers[header]}`);
    }
  });

  res.on('finish', () => {
    const duration = Date.now() - startTime;
    console.log(`✅ Response: ${res.statusCode} - ${duration}ms`);
  });

  next();
};

// ===============================
// 8. MIDDLEWARE DE ROLES Y DATOS DE USUARIO DE BD
// ===============================

// Middleware para obtener el usuario de la BD y adjuntarlo a req.dbUser
const fetchUserFromDbAndAttach = async (req, res, next) => {
  if (!req.user || !req.user.uid) {
    return res.status(401).json({
      error: 'Usuario no autenticado (sin UID de Firebase)',
      code: 'AUTH_NO_FIREBASE_UID'
    });
  }

  try {
    const result = await pool.query('SELECT id, firebase_uid, email, display_name, user_type, is_active FROM users WHERE firebase_uid = $1', [req.user.uid]);
    if (result.rows.length === 0) {
      return res.status(403).json({ 
        error: 'Usuario no encontrado en la base de datos local.', 
        code: 'USER_NOT_IN_DB' 
      });
    }
    req.dbUser = result.rows[0];
    next();
  } catch (error) {
    console.error('Error fetching user from DB:', error);
    return res.status(500).json({ error: 'Error interno al obtener datos del usuario', code: 'DB_USER_FETCH_ERROR' });
  }
};

const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.dbUser || !req.dbUser.user_type) {
      return res.status(403).json({
        error: 'Información de rol no disponible. Acceso denegado.',
        code: 'ROLE_INFO_MISSING'
      });
    }

    const userRole = req.dbUser.user_type;
      
    if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({
          error: 'Permisos insuficientes',
          code: 'INSUFFICIENT_PERMISSIONS'
        });
      }
      
      next();
  };
};

// ===============================
// 9. SETUP DE SEGURIDAD GLOBAL
// ===============================

const setupSecurity = (app) => {
  app.use(helmet(helmetOptions));       // Protección de cabeceras
  app.use(cors(corsOptions));           // Permitir CORS
  app.use('/api/', apiLimiter);         // Limitar peticiones
  app.use(securityLogger);              // Log de seguridad
  app.use(sanitizeQuery);               // Limpieza de inputs
  console.log('🛡️ Middleware de seguridad configurado correctamente');
};

// ===============================
// EXPORTAR TODO
// ===============================

export {
  // Rate limiters
  authLimiter,
  registerLimiter,
  apiLimiter,
  strictLimiter,

  // CORS
  corsOptions,

  // Helmet
  helmetOptions,

  // Auth
  verifyFirebaseToken,

  // Validación
  validateData,
  validationSchemas,

  // Seguridad
  sanitizeQuery,
  securityLogger,
  fetchUserFromDbAndAttach,
  requireRole,

  // Configuración completa de seguridad
  setupSecurity
};

