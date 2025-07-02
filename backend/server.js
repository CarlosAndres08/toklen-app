const app = require('./src/app');
const { connectDB } = require('./src/config/database');

const PORT = process.env.PORT || 5000;

// Conectar a la base de datos
connectDB()
  .then(() => {
    console.log('✅ Conectado a PostgreSQL');
    
    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ Error conectando a la base de datos:', error);
    process.exit(1);
  });