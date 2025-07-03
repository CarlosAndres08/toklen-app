const { Pool } = require('pg')

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Render exige SSL, incluso si NODE_ENV no está seteado
  }
})

const connectDB = async () => {
  try {
    await pool.connect()
    console.log('✅ PostgreSQL conectado correctamente')

    // Verificar que las tablas existen
    const tablesQuery = `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `
    const result = await pool.query(tablesQuery)
    console.log('📊 Tablas disponibles:', result.rows.map(row => row.table_name))

  } catch (error) {
    console.error('❌ Error conectando a PostgreSQL:', error)
    throw error
  }
}

module.exports = { pool, connectDB }
