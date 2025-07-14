const express = require('express')
const { pool } = require('../config/database')

const router = express.Router()

// Health check endpoint para Render
router.get('/health', async (req, res) => {
  try {
    // Verificar conexión a la base de datos
    const dbCheck = await pool.query('SELECT 1 as healthy')
    
    // Verificar que las tablas principales existen
    const tablesCheck = await pool.query(`
      SELECT COUNT(*) as table_count 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('users', 'services', 'service_requests')
    `)
    
    const isHealthy = dbCheck.rows[0].healthy === 1 && 
                     parseInt(tablesCheck.rows[0].table_count) >= 3
    
    if (isHealthy) {
      res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        database: 'connected',
        tables: 'available',
        environment: process.env.NODE_ENV || 'development'
      })
    } else {
      throw new Error('Database or tables not properly configured')
    }
    
  } catch (error) {
    console.error('Health check failed:', error.message)
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message,
      environment: process.env.NODE_ENV || 'development'
    })
  }
})

// Status endpoint con más detalles
router.get('/status', async (req, res) => {
  try {
    const dbInfo = await pool.query('SELECT version() as version, NOW() as current_time')
    const tablesInfo = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `)
    
    res.json({
      status: 'operational',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      database: {
        version: dbInfo.rows[0].version.split(' ')[0],
        current_time: dbInfo.rows[0].current_time,
        tables: tablesInfo.rows.map(row => row.table_name)
      },
      server: {
        node_version: process.version,
        uptime: process.uptime(),
        memory_usage: process.memoryUsage()
      }
    })
    
  } catch (error) {
    res.status(500).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: error.message
    })
  }
})

module.exports = router
