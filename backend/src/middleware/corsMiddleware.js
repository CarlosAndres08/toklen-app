const cors = require('cors');

// Configuración de CORS para desarrollo y producción
const corsOptions = {
  origin: function (origin, callback) {
    // Lista de orígenes permitidos
    const allowedOrigins = [
      'http://localhost:3000',     // React development server
      'http://localhost:5173',     // Vite development server
      'http://127.0.0.1:3000',     // Alternative localhost
      'http://127.0.0.1:5173',     // Alternative localhost for Vite
      process.env.FRONTEND_URL     // URL del frontend en producción
    ];

    // Permitir requests sin origin (ej: aplicaciones móviles, Postman)
    if (!origin) return callback(null, true);

    // En desarrollo, permitir cualquier origen localhost
    if (process.env.NODE_ENV === 'development') {
      if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
        return callback(null, true);
      }
    }

    // Verificar si el origin está en la lista permitida
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
  
  // Métodos HTTP permitidos
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  
  // Headers permitidos
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'Cache-Control',
    'Pragma'
  ],
  
  // Headers que el navegador puede acceder
  exposedHeaders: [
    'X-Total-Count',
    'X-Page-Count',
    'X-Current-Page'
  ],
  
  // Permitir cookies y credenciales
  credentials: true,
  
  // Tiempo de cache para preflight requests
  optionsSuccessStatus: 200, // Para soportar navegadores legacy
  maxAge: 86400 // 24 horas
};

// Middleware de CORS personalizado
const corsMiddleware = (req, res, next) => {
  // Configurar CORS usando las opciones definidas
  cors(corsOptions)(req, res, (err) => {
    if (err) {
      console.error('Error de CORS:', err.message);
      return res.status(403).json({
        success: false,
        message: 'CORS: Origen no permitido',
        error: err.message
      });
    }
    next();
  });
};

// Middleware específico para preflight requests
const preflightHandler = (req, res, next) => {
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,PATCH,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin,X-Requested-With,Content-Type,Accept,Authorization,Cache-Control,Pragma');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Max-Age', '86400');
    return res.status(200).end();
  }
  next();
};

// Configuración de seguridad adicional
const securityHeaders = (req, res, next) => {
  // Prevenir clickjacking
  res.header('X-Frame-Options', 'DENY');
  
  // Prevenir MIME type sniffing
  res.header('X-Content-Type-Options', 'nosniff');
  
  // Habilitar XSS protection
  res.header('X-XSS-Protection', '1; mode=block');
  
  // Referrer policy
  res.header('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Content Security Policy básico
  if (process.env.NODE_ENV === 'production') {
    res.header('Content-Security-Policy', "default-src 'self'");
  }
  
  next();
};

// Logging de requests CORS (solo en desarrollo)
const corsLogger = (req, res, next) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`CORS - ${req.method} ${req.url} - Origin: ${req.headers.origin || 'No origin'}`);
  }
  next();
};

module.exports = {
  corsMiddleware,
  preflightHandler,
  securityHeaders,
  corsLogger,
  corsOptions
};