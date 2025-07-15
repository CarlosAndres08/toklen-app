const { connectDB, pool } = require('./src/config/database')

async function testConnection() {
  console.log('🔍 Probando conexión a la base de datos...')
  console.log('=====================================')
  
  try {
    // Probar conexión
    await connectDB()
    
    // Probar una consulta simple
    const result = await pool.query('SELECT NOW() as current_time, version() as pg_version')
    console.log('⏰ Hora actual:', result.rows[0].current_time)
    console.log('🐘 Versión PostgreSQL:', result.rows[0].pg_version.split(' ')[0])
    
    // Contar registros en tablas principales
    const tables = ['users', 'service_categories', 'services', 'service_requests']
    
    for (const table of tables) {
      try {
        const count = await pool.query(`SELECT COUNT(*) FROM ${table}`)
        console.log(`📊 ${table}: ${count.rows[0].count} registros`)
      } catch (error) {
        console.log(`❌ Error consultando ${table}: ${error.message}`)
      }
    }
    
    console.log('=====================================')
    console.log('✅ ¡Conexión exitosa! Todo funciona correctamente')
    
  } catch (error) {
    console.log('=====================================')
    console.error('❌ Error de conexión:', error.message)
    
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 Soluciones posibles:')
      console.log('   - Verifica que PostgreSQL esté ejecutándose')
      console.log('   - Revisa la DATABASE_URL en tu archivo .env')
      console.log('   - Asegúrate de que el puerto 5432 esté disponible')
    }
  } finally {
    await pool.end()
    process.exit(0)
  }
}

testConnection()

