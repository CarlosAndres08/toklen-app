require('dotenv').config();

console.log('🛡️ Verificando configuración de seguridad...\n');

// Verificar variables de entorno
const requiredEnvVars = [
  'DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME',
  'JWT_SECRET', 'FRONTEND_URL'
];

let missingVars = [];
requiredEnvVars.forEach(varName => {
  if (!process.env[varName]) {
    missingVars.push(varName);
  } else {
    console.log(`✅ ${varName}: SET`);
  }
});

if (missingVars.length > 0) {
  console.error(`\n❌ Variables de entorno faltantes:`);
  missingVars.forEach(varName => {
    console.error(`   - ${varName}`);
  });
  process.exit(1);
}

// Verificar JWT_SECRET strength
const jwtSecret = process.env.JWT_SECRET;
if (jwtSecret.length < 32) {
  console.warn('⚠️  JWT_SECRET debería tener al menos 32 caracteres');
}

// Verificar FRONTEND_URL
const frontendUrl = process.env.FRONTEND_URL;
if (frontendUrl.includes('localhost')) {
  console.warn('⚠️  FRONTEND_URL apunta a localhost (desarrollo)');
}

console.log('\n🔒 Configuración de seguridad verificada');