const { pool, connectDB } = require('../src/config/database')
const fs = require('fs')
const path = require('path')

async function initializeProductionDB() {
  console.log('🚀 Inicializando base de datos de producción...')
  
  try {
    // Conectar a la base de datos
    await connectDB()
    
    // Leer y ejecutar el script de inicialización
    const sqlScript = fs.readFileSync(
      path.join(__dirname, '../database/init.sql'), 
      'utf8'
    )
    
    // Ejecutar el script completo
    await pool.query(sqlScript)
    
    console.log('✅ Base de datos inicializada correctamente')
    console.log('📊 Tablas creadas y datos de ejemplo insertados')
    
    // Verificar que las tablas fueron creadas
    const tablesQuery = `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `
    const result = await pool.query(tablesQuery)
    console.log('📋 Tablas disponibles:', result.rows.map(row => row.table_name))
    
  } catch (error) {
    console.error('❌ Error inicializando base de datos:', error.message)
    throw error
  } finally {
    await pool.end()
  }
}

// Ejecutar solo si es llamado directamente
if (require.main === module) {
  initializeProductionDB()
    .then(() => {
      console.log('🎉 Inicialización completada')
      process.exit(0)
    })
    .catch((error) => {
      console.error('💥 Error fatal:', error)
      process.exit(1)
    })
}

module.exports = { initializeProductionDB }



