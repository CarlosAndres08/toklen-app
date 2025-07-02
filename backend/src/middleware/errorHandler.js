const mongoose = require('mongoose');

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

// Manejo de errores de validación de Mongoose
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Datos inválidos: ${errors.join('. ')}`;
  return new AppError(message, 400);
};

// Manejo de errores de duplicados de MongoDB
const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Campo duplicado: ${value}. Por favor usa otro valor.`;
  return new AppError(message, 400);
};

// Manejo de errores de cast de MongoDB
const handleCastErrorDB = (err) => {
  const message = `ID inválido: ${err.value}`;
  return new AppError(message, 400);
};

// Manejo de errores JWT
const handleJWTError = () => 
  new AppError('Token inválido. Por favor inicia sesión nuevamente.', 401);

const handleJWTExpiredError = () => 
  new AppError('Tu token ha expirado. Por favor inicia sesión nuevamente.', 401);

// Envío de errores en desarrollo
const sendErrorDev = (err, req, res) => {
  console.error('ERROR 💥', err);
  
  return res.status(err.statusCode).json({
    success: false,
    error: err,
    message: err.message,
    stack: err.stack,
    request: {
      method: req.method,
      url: req.url,
      headers: req.headers,
      body: req.body
    }
  });
};

// Envío de errores en producción
const sendErrorProd = (err, req, res) => {
  // Errores operacionales: enviar mensaje al cliente
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message
    });
  }
  
  // Errores de programación: no filtrar detalles al cliente
  console.error('ERROR 💥', err);
  
  return res.status(500).json({
    success: false,
    message: 'Algo salió mal. Por favor intenta más tarde.'
  });
};

// Middleware principal de manejo de errores
const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else {
    let error = { ...err };
    error.message = err.message;

    // Manejo específico de errores de MongoDB/Mongoose
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendErrorProd(error, req, res);
  }
};

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

// Validador de errores de esquema
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
const errorRateLimit = () => {
  const attempts = new Map();
  
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
  
  for (const [ip, attempts] of attempts.entries()) {
    const recentAttempts = attempts.filter(time => now - time < windowMs);
    if (recentAttempts.length === 0) {
      attempts.delete(ip);
    } else {
      attempts.set(ip, recentAttempts);
    }
  }
}, 5 * 60 * 1000); // Limpia cada 5 minutos

// Manejo de errores no capturados
process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 💥 Cerrando aplicación...');
  console.log(err.name, err.message);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥 Cerrando aplicación...');
  console.log(err.name, err.message);
  process.exit(1);
});

// Exportar SOLO la función middleware principal
module.exports = globalErrorHandler;