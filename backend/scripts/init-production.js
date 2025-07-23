require("dotenv").config(); // Asegurarse de cargar las variables de entorno
const { Pool } = require("pg");
const fs = require("fs");
const path = require("path");

async function initializeProductionDB() {
  console.log("🚀 Inicializando base de datos de producción...");

  const isProduction = process.env.NODE_ENV === "production";

  const pool = new Pool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10),
    database: process.env.DB_NAME || 'toklen_bd',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: isProduction
      ? {
          rejectUnauthorized: false,
        }
      : false,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });

  try {
    const client = await pool.connect();
    console.log(
      `✅ PostgreSQL conectado correctamente a ${process.env.DB_NAME || 'toklen_bd'} (${isProduction ? "PRODUCCIÓN" : "DESARROLLO"})`
    );

    // Leer y ejecutar el script de inicialización
    const sqlScript = fs.readFileSync(
      path.join(__dirname, "../database/init.sql"),
      "utf8"
    );

    // Ejecutar el script completo
    await client.query(sqlScript);

    console.log("✅ Base de datos inicializada correctamente");
    console.log("📊 Tablas creadas y datos de ejemplo insertados");

    // Verificar que las tablas fueron creadas
    const tablesQuery = `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `;
    const result = await client.query(tablesQuery);
    console.log("📋 Tablas disponibles:", result.rows.map((row) => row.table_name));

    client.release();
  } catch (error) {
    console.error("❌ Error inicializando base de datos:", error.message);
    if (error.code === "ECONNREFUSED") {
      console.error("💡 Asegúrate de que PostgreSQL esté ejecutándose localmente");
      console.error("💡 Verifica que la DATABASE_URL sea correcta en tu archivo .env");
    }
    throw error;
  } finally {
    await pool.end();
  }
}

// Ejecutar solo si es llamado directamente
if (require.main === module) {
  initializeProductionDB()
    .then(() => {
      console.log("🎉 Inicialización completada");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Error fatal:", error);
      process.exit(1);
    });
}



