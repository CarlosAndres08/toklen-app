# 🚀 TOKLEN - Plataforma de Servicios Profesionales

Una aplicación web tipo Uber para conectar clientes con proveedores de servicios profesionales.

## 📋 Estado del Proyecto

✅ **Frontend**: Completamente funcional  
✅ **Backend**: Configurado y operativo  
✅ **Base de Datos**: PostgreSQL configurada (local y producción)  
✅ **Despliegue**: Listo para Render  
✅ **Documentación**: Completa y actualizada  

## 🚀 Inicio Rápido

### Prerrequisitos
- Node.js >= 18.0.0
- PostgreSQL 15+
- Git

### Configuración Local (Windows)

```bash
# 1. Clonar el repositorio
git clone https://github.com/CarlosAndres08/toklen-app.git
cd toklen-app

# 2. Configurar backend
cd backend
npm install

# 3. Configurar PostgreSQL (automático)
setup-windows.bat

# 4. Configurar variables de entorno
copy .env.example .env

# 5. Probar conexión
npm run test-db

# 6. Iniciar backend
npm run dev
```

```bash
# En otra terminal - Frontend
cd frontend
npm install
npm run dev
```

### Acceso
- **Backend**: http://localhost:5000
- **Frontend**: http://localhost:3000
- **API Health**: http://localhost:5000/api/health

## 📁 Estructura del Proyecto

```
toklen-app/
├── backend/                 # Servidor Node.js + Express
│   ├── src/
│   │   ├── config/         # Configuración de BD y servicios
│   │   ├── controllers/    # Lógica de negocio
│   │   ├── middleware/     # Middleware de seguridad
│   │   ├── models/         # Modelos de datos
│   │   ├── routes/         # Rutas de API
│   │   └── utils/          # Utilidades
│   ├── database/           # Scripts de BD
│   ├── scripts/            # Scripts de configuración
│   └── server.js           # Punto de entrada
├── frontend/               # Aplicación React
│   ├── src/
│   │   ├── components/     # Componentes React
│   │   ├── config/         # Configuración de API
│   │   ├── services/       # Servicios de API
│   │   └── ...
│   └── dist/               # Build de producción
└── database/               # Esquemas y datos iniciales
```

## 🛠️ Tecnologías

### Backend
- **Node.js** + **Express.js** - Servidor web
- **PostgreSQL** - Base de datos
- **JWT** - Autenticación
- **Socket.io** - Comunicación en tiempo real
- **Stripe** - Procesamiento de pagos
- **Firebase Admin** - Notificaciones push
- **Helmet** + **CORS** - Seguridad

### Frontend
- **React** + **Vite** - Interfaz de usuario
- **Tailwind CSS** - Estilos
- **Axios** - Cliente HTTP
- **React Router** - Navegación
- **Lucide React** - Iconos

### Base de Datos
- **PostgreSQL** - Base de datos principal
- **Esquema completo** - Usuarios, servicios, pagos, chat, calificaciones

## 🌐 Despliegue

### Desarrollo Local
Sigue las instrucciones en `INSTALACION_POSTGRESQL_WINDOWS.md`

### Producción (Render)
Sigue las instrucciones en `DESPLIEGUE_RENDER.md`

## 📚 Documentación

- **[DOCUMENTACION_COMPLETA.md](DOCUMENTACION_COMPLETA.md)** - Guía completa del proyecto
- **[INSTALACION_POSTGRESQL_WINDOWS.md](INSTALACION_POSTGRESQL_WINDOWS.md)** - Configuración local
- **[DESPLIEGUE_RENDER.md](DESPLIEGUE_RENDER.md)** - Despliegue en producción

## 🧪 Pruebas

```bash
# Probar conexión a base de datos
npm run test-db

# Probar endpoints de API
# Usar el componente ApiTestComponent en el frontend
```

## 🔧 Scripts Disponibles

### Backend
```bash
npm run dev          # Desarrollo con nodemon
npm start            # Producción
npm run test-db      # Probar conexión BD
npm run init-prod    # Inicializar BD producción
```

### Frontend
```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build para producción
npm run preview      # Preview del build
```

## 🚨 Solución de Problemas

### Error de Conexión a BD
```bash
# Verificar que PostgreSQL esté ejecutándose
net start postgresql-x64-15

# Probar conexión
npm run test-db
```

### Error de CORS
Verificar configuración en `.env`:
```env
CORS_ORIGIN=http://localhost:3000
```

### Más información
Consulta la sección "Solución de Problemas" en `DOCUMENTACION_COMPLETA.md`

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 👨‍💻 Autor

**Carlos Andrés** - [GitHub](https://github.com/CarlosAndres08)

## 🙏 Agradecimientos

- Comunidad de React y Node.js
- Documentación de PostgreSQL
- Plataforma Render por el hosting gratuito

---

**¡Tu plataforma de servicios profesionales está lista para conquistar el mundo! 🌟**

