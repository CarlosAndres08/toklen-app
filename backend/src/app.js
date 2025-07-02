const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
require('dotenv').config()

// Importar rutas
const authRoutes = require('./routes/auth')
const professionalRoutes = require('./routes/professionals')
const serviceRoutes = require('./routes/services')

// Middleware
const errorHandler = require('./middleware/errorHandler')

const app = express()

// Configuración de seguridad
app.use(helmet())

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // máximo 100 requests por IP por ventana
})
app.use(limiter)

// CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}))

// Body parser
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Rutas
app.use('/api/auth', authRoutes)
app.use('/api/professionals', professionalRoutes)
app.use('/api/services', serviceRoutes)

// Ruta de salud
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() })
})

// Middleware de manejo de errores
app.use(errorHandler)

module.exports = app