# Guía de Despliegue en Render

## PASO 1: Preparar el Repositorio

### 1.1 Subir cambios a GitHub
```bash
git add .
git commit -m "Configuración para desarrollo local y producción"
git push origin main
```

## PASO 2: Configurar Render

### 2.1 Crear cuenta en Render
1. Ve a https://render.com
2. Regístrate con tu cuenta de GitHub
3. Conecta tu repositorio `toklen-app`

### 2.2 Crear la Base de Datos
1. En el dashboard de Render, click "New +"
2. Selecciona "PostgreSQL"
3. Configuración:
   - **Name**: `toklen-postgres`
   - **Database**: `toklen_db`
   - **User**: `toklen_user`
   - **Region**: Oregon (US West)
   - **Plan**: Free (para pruebas)

### 2.3 Desplegar el Backend
1. Click "New +" → "Web Service"
2. Conecta tu repositorio `toklen-app`
3. Configuración:
   - **Name**: `toklen-backend`
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Root Directory**: `backend`

### 2.4 Configurar Variables de Entorno
En la sección "Environment Variables":

**Variables Automáticas:**
- `NODE_ENV` = `production`
- `PORT` = `10000`
- `DATABASE_URL` = (selecciona tu base de datos PostgreSQL)

**Variables Manuales:**
```
JWT_SECRET = tu_jwt_secret_muy_seguro_para_produccion
CORS_ORIGIN = *
RATE_LIMIT_WINDOW_MS = 900000
RATE_LIMIT_MAX_REQUESTS = 100
```

**Variables de Firebase (opcional):**
```
FIREBASE_PROJECT_ID = tu-proyecto-firebase
FIREBASE_PRIVATE_KEY = "-----BEGIN PRIVATE KEY-----\nTU_KEY\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL = firebase-adminsdk-xxxxx@tu-proyecto.iam.gserviceaccount.com
```

**Variables de Stripe:**
```
STRIPE_SECRET_KEY = sk_live_tu_clave_secreta
STRIPE_PUBLISHABLE_KEY = pk_live_tu_clave_publica
```

## PASO 3: Inicializar Base de Datos

### 3.1 Conectar a la Base de Datos
1. En Render, ve a tu base de datos PostgreSQL
2. Copia la "External Connection String"
3. Usa un cliente PostgreSQL (como pgAdmin o DBeaver)

### 3.2 Ejecutar Script de Inicialización
```sql
-- Pega el contenido completo del archivo backend/database/init.sql
-- O usa la consola de Render para ejecutar el script
```

### 3.3 Verificar Despliegue
1. Ve a la URL de tu servicio web
2. Visita: `https://tu-app.onrender.com/api/health`
3. Deberías ver: `{"status": "healthy", ...}`

## PASO 4: Configurar Frontend

### 4.1 Actualizar URL del Backend
En tu frontend, actualiza la URL del API:
```javascript
const API_BASE_URL = 'https://tu-backend.onrender.com/api'
```

### 4.2 Desplegar Frontend
- **Vercel**: Conecta tu repo y despliega automáticamente
- **Netlify**: Sube la carpeta `frontend/build`
- **GitHub Pages**: Configura desde la carpeta `frontend/build`

## PASO 5: Configuración de Dominio (Opcional)

### 5.1 Dominio Personalizado
1. En Render, ve a tu servicio web
2. Click "Settings" → "Custom Domains"
3. Agrega tu dominio personalizado
4. Configura los DNS según las instrucciones

## Solución de Problemas

### Error: "Application failed to respond"
- Verifica que el puerto sea 10000
- Revisa los logs en Render Dashboard
- Asegúrate de que todas las variables de entorno estén configuradas

### Error: "Database connection failed"
- Verifica que la DATABASE_URL esté configurada
- Asegúrate de que la base de datos esté ejecutándose
- Revisa que el script de inicialización se haya ejecutado

### Error: "Build failed"
- Verifica que el archivo package.json esté correcto
- Asegúrate de que todas las dependencias estén listadas
- Revisa los logs de build en Render

## URLs Importantes

Después del despliegue tendrás:
- **Backend**: `https://toklen-backend.onrender.com`
- **API Health**: `https://toklen-backend.onrender.com/api/health`
- **API Status**: `https://toklen-backend.onrender.com/api/status`
- **Base de Datos**: Acceso desde el dashboard de Render

## Comandos Útiles

```bash
# Probar localmente antes de desplegar
npm run test-db

# Ver logs en tiempo real
# (desde el dashboard de Render)

# Reiniciar servicio
# (desde el dashboard de Render)
```

