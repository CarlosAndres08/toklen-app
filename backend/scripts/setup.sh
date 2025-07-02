#!/bin/bash

echo "🚀 Configurando proyecto Toklen..."

# Crear directorios principales
mkdir -p toklen/{frontend,backend,database/{migrations,seeds}}

# Configurar Frontend
echo "📦 Configurando Frontend..."
cd toklen/frontend
npm create vite@latest . -- --template react
npm install firebase axios socket.io-client @googlemaps/js-api-loader

# Configurar Backend
echo "📦 Configurando Backend..."
cd ../backend
npm init -y
npm install express cors helmet pg firebase-admin joi socket.io stripe bcryptjs jsonwebtoken dotenv express-rate-limit
npm install -D nodemon jest

# Crear estructura de carpetas backend
mkdir -p src/{controllers,middleware,models,routes,config,utils}

echo "✅ Proyecto configurado. Siguiente pasos:"
echo "1. Configurar Firebase en https://console.firebase.google.com/"
echo "2. Crear base de datos PostgreSQL"
echo "3. Configurar variables de entorno"
echo "4. Ejecutar migraciones de base de datos"
echo "5. Iniciar desarrollo con 'npm run dev' en ambas carpetas"