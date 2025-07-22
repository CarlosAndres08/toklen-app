const { Pool } = require("pg");

const isProduction = process.env.NODE_ENV === "production";

// Configuración que funciona tanto local como en Render
let poolConfig;

if (process.env.DATABASE_URL) {
  // Usar DATABASE_URL (Render y otros servicios cloud)
  poolConfig = {
    connectionString: process.env.DATABASE_URL,
    ssl: isProduction ? { rejectUnauthorized: false } : false,
  };
} else {
  // Usar variables individuales (desarrollo local)
  poolConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    database: process.env.DB_NAME || 'toklen_db',
    user: process.env.DB_USER || 'toklen_user',
    password: process.env.DB_PASSWORD,
    ssl: false,
  };
}

// Configuración común
poolConfig.max = 20;
poolConfig.idleTimeoutMillis = 30000;
poolConfig.connectionTimeoutMillis = 2000;

const pool = new Pool(poolConfig);

const connectDB = async () => {
  try {
    const client = await pool.connect();
    console.log(`✅ PostgreSQL conectado correctamente (${isProduction ? 'PRODUCCIÓN' : 'DESARROLLO'})`);
    
    // Verificar que las tablas existen
    const tablesQuery = `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `;
    const result = await client.query(tablesQuery);
    console.log('📊 Tablas disponibles:', result.rows.map(row => row.table_name));
    
    client.release();
    return true;

  } catch (error) {
    console.error('❌ Error conectando a PostgreSQL:', error.message);
    console.error('💡 Verifica que PostgreSQL esté ejecutándose y la configuración sea correcta');
    throw error;
  }
};

// Función para cerrar la conexión limpiamente
const closeDB = async () => {
  try {
    await pool.end();
    console.log('🔒 Conexión a PostgreSQL cerrada');
  } catch (error) {
    console.error('❌ Error cerrando conexión:', error.message);
  }
};

// Manejar cierre de aplicación
process.on('SIGINT', async () => {
  await closeDB();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await closeDB();
  process.exit(0);
});

module.exports = { pool, connectDB, closeDB };



