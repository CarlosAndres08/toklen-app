const { Pool } = require("pg");

const isProduction = process.env.NODE_ENV === "production";

// Configuración profesional: prioriza variables individuales para mayor seguridad
let poolConfig;

if (isProduction && process.env.DATABASE_URL) {
  // En producción, usar DATABASE_URL si está disponible (Render, Heroku, etc.)
  poolConfig = {
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  };
  console.log('🔗 Usando DATABASE_URL para conexión en producción');
} else {
  // Usar variables individuales (más seguro y flexible)
  poolConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    database: process.env.DB_NAME || 'toklen_bd',
    user: process.env.DB_USER || 'toklen_user',
    password: process.env.DB_PASSWORD,
    ssl: isProduction ? { rejectUnauthorized: false } : false,
  };
  console.log(`🔗 Usando variables individuales para conexión a ${poolConfig.database}`);
}

// Validar que las variables críticas estén definidas
if (!isProduction || !process.env.DATABASE_URL) {
  if (!process.env.DB_PASSWORD) {
    console.error('❌ ERROR: DB_PASSWORD no está definida en las variables de entorno');
    process.exit(1);
  }
  if (!process.env.DB_NAME) {
    console.error('❌ ERROR: DB_NAME no está definida en las variables de entorno');
    process.exit(1);
  }
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

