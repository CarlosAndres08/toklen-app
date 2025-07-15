const { Pool } = require('pg')

// Configuración que funciona tanto local como en Render
const isProduction = process.env.NODE_ENV === 'production'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isProduction ? {
    rejectUnauthorized: false // Render exige SSL en producción
  } : false, // Sin SSL para desarrollo local
  max: 20, // Máximo de conexiones en el pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

const connectDB = async () => {
  try {
    const client = await pool.connect()
    console.log(`✅ PostgreSQL conectado correctamente (${isProduction ? 'PRODUCCIÓN' : 'DESARROLLO'})`)
    
    // Verificar que las tablas existen
    const tablesQuery = `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `
    const result = await client.query(tablesQuery)
    console.log('📊 Tablas disponibles:', result.rows.map(row => row.table_name))
    
    client.release()
    return true

  } catch (error) {
    console.error('❌ Error conectando a PostgreSQL:', error.message)
    
    if (error.code === 'ECONNREFUSED') {
      console.error('💡 Asegúrate de que PostgreSQL esté ejecutándose localmente')
      console.error('💡 Verifica que la DATABASE_URL sea correcta en tu archivo .env')
    }
    
    throw error
  }
}

// Función para cerrar la conexión limpiamente
const closeDB = async () => {
  try {
    await pool.end()
    console.log('🔒 Conexión a PostgreSQL cerrada')
  } catch (error) {
    console.error('❌ Error cerrando conexión:', error.message)
  }
}

// Manejar cierre de aplicación
process.on('SIGINT', async () => {
  await closeDB()
  process.exit(0)
})

process.on('SIGTERM', async () => {
  await closeDB()
  process.exit(0)
})

module.exports = { pool, connectDB, closeDB }
