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

// Manejo de errores de PostgreSQL
const handlePostgreSQLError = (err) => {
  let message = 'Error de base de datos';
  
  switch (err.code) {
    case '23505': // unique_violation
      message = 'Este registro ya existe. Por favor usa valores únicos.';
      break;
    case '23503': // foreign_key_violation
      message = 'Referencia inválida. El registro relacionado no existe.';
      break;
    case '23502': // not_null_violation
      message = 'Campo requerido faltante.';
      break;
    case '22001': // string_data_right_truncation
      message = 'Datos demasiado largos para el campo.';
      break;
    case '42P01': // undefined_table
      message = 'Tabla no encontrada.';
      break;
    default:
      message = 'Error de base de datos.';
  }
  
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

    // Manejo específico de errores de PostgreSQL
    if (err.code && typeof err.code === 'string') {
      error = handlePostgreSQLError(error);
    }
    
    // Manejo de errores JWT
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendErrorProd(error, req, res);
  }
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
    console.log(`User ID: ${req.user.uid || req.user.id}`);
  }
  
  if (err.statusCode >= 500) {
    console.log(`Stack: ${err.stack}`);
  }
  
  next(err);
};

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

// Exportar funciones
export default globalErrorHandler;
export { AppError, catchAsync, validateSchema, errorLogger };

