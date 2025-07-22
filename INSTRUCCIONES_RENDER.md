# Proyecto Toklen - Versión Corregida para Render

## ✅ Correcciones Aplicadas

Este proyecto incluye las siguientes correcciones para solucionar los problemas de despliegue en Render:

### 1. Configuración de Base de Datos Corregida
- **Archivo modificado**: `backend/src/config/database.js`
- **Cambio**: Ahora usa `DATABASE_URL` cuando está disponible (Render) y variables individuales para desarrollo local
- **Beneficio**: Compatible tanto con desarrollo local como con producción en Render

### 2. Configuración de Render Optimizada
- **Archivo modificado**: `backend/render.yaml`
- **Cambios**: 
  - Eliminado comando de build innecesario
  - Especificada versión PostgreSQL 16
  - Configuración limpia de variables de entorno

## ⚠️ IMPORTANTE: Variables de Entorno Requeridas

**DEBES configurar manualmente** las siguientes variables en el dashboard de Render:

### Variables de Firebase:
- `FIREBASE_PROJECT_ID`
- `FIREBASE_PRIVATE_KEY`
- `FIREBASE_CLIENT_EMAIL`

### Variables de Stripe:
- `STRIPE_SECRET_KEY`
- `STRIPE_PUBLISHABLE_KEY`

**📖 Consulta el archivo `guia-variables-render.md` para instrucciones detalladas.**

## 🚀 Pasos para Desplegar

1. **Sube este proyecto** a tu repositorio GitHub
2. **Configura las variables de entorno** en Render (ver guía)
3. **Despliega** desde el dashboard de Render
4. **Verifica** que el health check pase correctamente

## 📁 Estructura del Proyecto

```
toklen-app-main/
├── backend/
│   ├── src/config/database.js    ← CORREGIDO
│   ├── render.yaml               ← CORREGIDO
│   └── ...
├── frontend/
└── ...
```

## 🔧 Para Desarrollo Local

Las correcciones son compatibles con desarrollo local. Asegúrate de tener:

1. PostgreSQL ejecutándose localmente
2. Archivo `.env` con las variables locales
3. Dependencias instaladas con `npm install`

## 📞 Soporte

Si encuentras problemas después de aplicar estas correcciones:

1. Revisa los logs de Render
2. Verifica que todas las variables de entorno estén configuradas
3. Confirma que la base de datos PostgreSQL esté en estado "Available"

