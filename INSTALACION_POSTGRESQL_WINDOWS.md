# Guía de Configuración de PostgreSQL Local para Windows

## PASO 1: Instalar PostgreSQL

### Opción A: Descarga Oficial (Recomendada)
1. Ve a https://www.postgresql.org/download/windows/
2. Descarga PostgreSQL 15 o superior
3. Ejecuta el instalador como administrador
4. Durante la instalación:
   - Puerto: **5432** (por defecto)
   - Usuario: **postgres** 
   - Contraseña: **Anota la contraseña que elijas**
   - Instalar pgAdmin (recomendado)

### Opción B: Usando Chocolatey (si tienes Chocolatey instalado)
```cmd
choco install postgresql
```

## PASO 2: Configurar la Base de Datos

### 2.1 Abrir Command Prompt como Administrador
```cmd
# Navegar al directorio de PostgreSQL (ajusta la versión si es diferente)
cd "C:\Program Files\PostgreSQL\15\bin"

# Conectar a PostgreSQL
psql -U postgres
```

### 2.2 Crear la Base de Datos y Usuario
```sql
-- Crear la base de datos
CREATE DATABASE toklen_db;

-- Crear usuario para la aplicación
CREATE USER toklen_user WITH PASSWORD 'toklen_password';

-- Dar permisos al usuario
GRANT ALL PRIVILEGES ON DATABASE toklen_db TO toklen_user;

-- Salir de psql
\q
```

### 2.3 Ejecutar el Script de Inicialización
```cmd
# Ejecutar el script de inicialización
psql -U toklen_user -d toklen_db -f "RUTA_A_TU_PROYECTO\toklen-app\backend\database\init.sql"
```

## PASO 3: Configurar Variables de Entorno

### 3.1 Crear archivo .env
1. Copia el archivo `.env.example` a `.env` en la carpeta `backend`
2. Edita el archivo `.env` con tus datos:

```env
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://toklen_user:toklen_password@localhost:5432/toklen_db
JWT_SECRET=tu_jwt_secret_muy_seguro_aqui_2024
```

## PASO 4: Verificar la Instalación

### 4.1 Probar Conexión
```cmd
# En la carpeta backend de tu proyecto
cd toklen-app\backend
npm run dev
```

Si ves el mensaje "✅ PostgreSQL conectado correctamente (DESARROLLO)", ¡todo está funcionando!

## Solución de Problemas Comunes

### Error: "ECONNREFUSED"
- Verifica que PostgreSQL esté ejecutándose
- En Windows, busca "Services" y verifica que "postgresql-x64-15" esté ejecutándose

### Error: "password authentication failed"
- Verifica que la contraseña en DATABASE_URL sea correcta
- Asegúrate de haber creado el usuario toklen_user

### Error: "database does not exist"
- Verifica que hayas creado la base de datos toklen_db
- Ejecuta nuevamente los comandos de creación de base de datos

## Comandos Útiles

```cmd
# Iniciar PostgreSQL (si no está ejecutándose)
net start postgresql-x64-15

# Detener PostgreSQL
net stop postgresql-x64-15

# Conectar a la base de datos
psql -U toklen_user -d toklen_db

# Ver tablas en la base de datos
\dt

# Salir de psql
\q
```

