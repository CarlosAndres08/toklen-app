// Clase personalizada para errores de la aplicación
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Middleware para rutas no encontradas
const notFoundHandler = (req, res, next) => {
  const err = new AppError(`No se encontró la ruta ${req.originalUrl}`, 404);
  next(err);
};

// Captura de errores asíncronos no manejados
const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

// Validador de errores de esquema (requiere Joi)
const validateSchema = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      const message = error.details.map(detail => detail.message).join(', ');
      return next(new AppError(message, 400));
    }
    next();
  };
};

// Middleware de logging de errores
const errorLogger = (err, req, res, next) => {
  const timestamp = new Date().toISOString();
  const logLevel = err.statusCode >= 500 ? 'ERROR' : 'WARN';
  
  console.log(`[${timestamp}] ${logLevel}: ${err.message}`);
  console.log(`Request: ${req.method} ${req.url}`);
  console.log(`IP: ${req.ip}`);
  console.log(`User Agent: ${req.get('User-Agent')}`);
  
  if (req.user) {
    console.log(`User ID: ${req.user.id}`);
  }
  
  if (err.statusCode >= 500) {
    console.log(`Stack: ${err.stack}`);
  }
  
  next(err);
};

// Middleware de rate limiting para errores
const attempts = new Map();

const errorRateLimit = () => {
  return (err, req, res, next) => {
    if (err.statusCode === 429) {
      const ip = req.ip;
      const now = Date.now();
      const windowMs = 15 * 60 * 1000; // 15 minutos
      
      if (!attempts.has(ip)) {
        attempts.set(ip, []);
      }
      
      const userAttempts = attempts.get(ip);
      const recentAttempts = userAttempts.filter(time => now - time < windowMs);
      
      if (recentAttempts.length >= 5) {
        return res.status(429).json({
          success: false,
          message: 'Demasiados errores. Intenta más tarde.',
          retryAfter: Math.ceil(windowMs / 1000)
        });
      }
      
      recentAttempts.push(now);
      attempts.set(ip, recentAttempts);
    }
    
    next(err);
  };
};

// Cleanup de memoria para el rate limiting
setInterval(() => {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000;
  
  for (const [ip, attemptList] of attempts.entries()) {
    const recentAttempts = attemptList.filter(time => now - time < windowMs);
    if (recentAttempts.length === 0) {
      attempts.delete(ip);
    } else {
      attempts.set(ip, recentAttempts);
    }
  }
}, 5 * 60 * 1000); // Limpia cada 5 minutos

// Función helper para crear errores rápidamente
const createError = (message, statusCode = 500) => {
  return new AppError(message, statusCode);
};

// Middleware para validar IDs de MongoDB
const validateObjectId = (req, res, next) => {
  const { id } = req.params;
  if (id && !id.match(/^[0-9a-fA-F]{24}$/)) {
    return next(new AppError('ID inválido', 400));
  }
  next();
};

// Middleware para capturar y formatear errores de validación
const handleValidationError = (err, req, res, next) => {
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    const message = `Error de validación: ${errors.join(', ')}`;
    return next(new AppError(message, 400));
  }
  next(err);
};

module.exports = {
  AppError,
  notFoundHandler,
  catchAsync,
  validateSchema,
  errorLogger,
  errorRateLimit,
  createError,
  validateObjectId,
  handleValidationError
};