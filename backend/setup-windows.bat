@echo off
echo ========================================
echo    CONFIGURACION AUTOMATICA TOKLEN
echo ========================================
echo.

REM Verificar si PostgreSQL está instalado
where psql >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ PostgreSQL no encontrado en PATH
    echo 💡 Asegurate de haber instalado PostgreSQL
    echo 💡 Y agregado C:\Program Files\PostgreSQL\15\bin al PATH
    pause
    exit /b 1
)

echo ✅ PostgreSQL encontrado
echo.

REM Solicitar contraseña del usuario postgres
set /p POSTGRES_PASSWORD="Ingresa la contraseña del usuario 'postgres': "

echo.
echo 🔧 Creando base de datos y usuario...

REM Crear base de datos y usuario
psql -U postgres -c "CREATE DATABASE toklen_db;" 2>nul
psql -U postgres -c "CREATE USER toklen_user WITH PASSWORD 'toklen_password';" 2>nul
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE toklen_db TO toklen_user;" 2>nul

echo ✅ Base de datos configurada
echo.

REM Ejecutar script de inicialización
echo 🔧 Ejecutando script de inicialización...
psql -U toklen_user -d toklen_db -f "%~dp0database\init.sql"

if %ERRORLEVEL% EQU 0 (
    echo ✅ Script de inicialización ejecutado correctamente
) else (
    echo ❌ Error ejecutando script de inicialización
)

echo.

REM Crear archivo .env si no existe
if not exist ".env" (
    echo 🔧 Creando archivo .env...
    copy ".env.example" ".env"
    echo ✅ Archivo .env creado
) else (
    echo ℹ️  Archivo .env ya existe
)

echo.
echo ========================================
echo        CONFIGURACION COMPLETADA
echo ========================================
echo.
echo Para probar la conexión, ejecuta:
echo   npm run dev
echo.
pause

