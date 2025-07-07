```markdown
# Toklen App - Wireframes en Texto

Este documento describe la estructura visual básica y el flujo de las principales pantallas de la aplicación Toklen. Está pensado para guiar el desarrollo de la UI/UX.

## Paleta de Colores Principal (Recordatorio)

-   **Azul oscuro (text-secondary, bg-secondary):** `#273C4A`
-   **Coral (text-primary, bg-primary):** `#E94567`
-   **Blanco (text-white, bg-base-100):** `#FFFFFF`
-   **Gris claro (bg-base-200):** `#F5F5F5`
-   **Gris azulado (text-neutral, border-neutral):** `#B0BEC5`

---

## 1. Pantalla Cliente

### 1.1. Home (Pantalla Principal del Cliente - Ya parcialmente implementada)

-   **Navbar:**
    -   Logo Toklen (izquierda)
    -   Enlaces: "Buscar Servicios", "Categorías", "Ayuda" (centro/derecha)
    -   Si usuario no logueado: Botones "Iniciar Sesión", "Registrarse" (derecha)
    -   Si usuario logueado: Icono de perfil con menú desplegable (Dashboard, Mis Solicitudes, Perfil, Cerrar Sesión) (derecha)
-   **Hero Section (Fondo: Azul Oscuro o Gradiente con Azul Oscuro, Texto: Blanco/Gris Claro)**
    -   Título Principal: "Encuentra el profesional perfecto para cada tarea" (Grande, llamativo)
    -   Subtítulo: "Servicios de confianza, a tu alcance. Rápido, fácil y seguro."
    -   **Barra de Búsqueda Principal (Prominente):**
        -   Input: "¿Qué servicio necesitas?" (Placeholder, autocompletado de servicios/categorías, ícono de lupa)
        -   Input: "¿Dónde?" (Placeholder, autocompletado de ubicación con Google Maps API, ícono de marcador)
        -   Botón: "Buscar" (Color Coral)
-   **Sección: Categorías Populares (Fondo: Gris Claro)**
    -   Título: "Explora por Categoría"
    -   Grid de Tarjetas (4-6 categorías destacadas):
        -   Cada tarjeta: Ícono grande representativo, Nombre de la categoría.
        -   Al hacer clic, lleva a la página de resultados de búsqueda filtrada por esa categoría.
        -   Enlace: "Ver todas las categorías"
-   **Sección: Cómo Funciona (Fondo: Blanco)**
    -   Título: "¿Cómo funciona Toklen?"
    -   Grid de 3 Pasos (Tarjetas con ícono, título y descripción breve):
        1.  Busca: "Encuentra y compara profesionales."
        2.  Conecta: "Contacta, agenda y paga de forma segura."
        3.  Disfruta: "Recibe el servicio y califica tu experiencia."
-   **Sección: Profesionales Destacados (Opcional, Fondo: Gris Claro)**
    -   Título: "Profesionales Recomendados"
    -   Slider/Grid de Tarjetas de Profesionales:
        -   Cada tarjeta: Foto del profesional, Nombre, Categoría principal, Calificación (estrellas), Precio/hora (si aplica), Botón "Ver Perfil".
-   **Sección: CTA para Profesionales (Fondo: Azul Oscuro, Texto: Blanco)**
    -   Título: "¿Eres un profesional y quieres ofrecer tus servicios?"
    -   Texto breve invitando a registrarse.
    -   Botón: "Regístrate como Profesional" (Color Coral)
-   **Footer:** (Detallado más abajo)

### 1.2. Resultados de Búsqueda de Profesionales

-   **Navbar:** (Igual que Home)
-   **Encabezado de Página:**
    -   Título: "Resultados para '[Término de búsqueda]' en '[Ubicación]'"
    -   Número de resultados encontrados.
-   **Layout Principal (2 columnas en desktop, 1 en mobile):**
    -   **Columna Izquierda (Filtros):**
        -   Filtro por Categoría (Dropdown/Lista seleccionable)
        -   Filtro por Precio (Slider de rango o inputs Min/Max)
        -   Filtro por Calificación (Estrellas seleccionables)
        -   Filtro por Disponibilidad (ej. "Disponible hoy", "Fin de semana")
        -   Botón: "Aplicar Filtros"
        -   Botón: "Limpiar Filtros"
    -   **Columna Derecha (Lista de Profesionales):**
        -   Opciones de Ordenamiento: "Relevancia", "Precio (Asc/Desc)", "Calificación (Asc/Desc)"
        -   Grid/Lista de Tarjetas de Profesionales:
            -   Cada tarjeta:
                -   Foto del profesional (o avatar genérico)
                -   Nombre del profesional
                -   Categoría principal + (opcional) otras habilidades/servicios como tags
                -   Calificación promedio (estrellas) + número de opiniones
                -   Ubicación general (ej. Distrito, "A 5km de ti")
                -   Precio por hora o "Consultar precio"
                -   Pequeña descripción o eslogan
                -   Botón: "Ver Perfil" (Color Coral)
                -   Botón: "Contactar" (o "Solicitar Presupuesto") (Color Azul Oscuro)
        -   Paginación (si hay muchos resultados)
-   **Footer:**

### 1.3. Perfil del Profesional

-   **Navbar:**
-   **Layout Principal (Puede ser una o dos columnas):**
    -   **Sección de Encabezado del Perfil:**
        -   Foto de perfil grande
        -   Nombre completo del profesional
        -   Categoría principal
        -   Calificación promedio (estrellas) + Enlace "Ver todas las opiniones ([Número])"
        -   Ubicación general (Ciudad, Distrito)
        -   Botones de Acción:
            -   "Solicitar Servicio" (o "Pedir Presupuesto") (Color Coral, prominente)
            -   "Contactar por Chat" (si el chat está implementado)
            -   "Guardar en Favoritos" (Icono corazón)
    -   **Sección "Acerca de mí":**
        -   Descripción detallada del profesional, su experiencia, lo que ofrece.
    -   **Sección "Servicios Ofrecidos":**
        -   Lista de servicios específicos que ofrece (puede incluir precios individuales si aplica).
        -   Ej: "Instalación de grifos", "Reparación de fugas", "Desatoros".
    -   **Sección "Habilidades":**
        -   Tags de habilidades.
    -   **Sección "Portafolio / Galería de Trabajos" (Opcional):**
        -   Imágenes de trabajos anteriores.
    -   **Sección "Disponibilidad":**
        -   Vista de calendario o lista de días/horas disponibles.
    -   **Sección "Opiniones de Clientes":**
        -   Lista de opiniones:
            -   Nombre del cliente (o "Usuario Anónimo")
            -   Calificación (estrellas)
            -   Comentario
            -   Fecha
        -   Paginación para más opiniones.
-   **Footer:**

### 1.4. Proceso de Reserva/Solicitud de Servicio (Modal o Página Dedicada)

-   **Título:** "Solicitar Servicio a [Nombre del Profesional]" o "Detalles de tu Solicitud"
-   **Resumen del Profesional/Servicio:** (Nombre, categoría)
-   **Formulario de Solicitud:**
    -   Campo: Descripción detallada del trabajo requerido (Textarea)
    -   Campo: Dirección exacta del servicio (Input con autocompletado o selección de mapa)
    -   Campo: Fecha y Hora preferida para el servicio (Selector de fecha y hora, basado en la disponibilidad del profesional)
    -   Campo: Subir Archivos (opcional, para fotos del problema, etc.)
    -   Campo: Teléfono de contacto del cliente (auto-rellenado si está logueado)
-   **Resumen de Costos (si el profesional tiene precio fijo o por hora visible):**
    -   Precio estimado (si es posible calcularlo)
    -   Advertencia: "El precio final puede variar."
-   **Botones:**
    -   "Enviar Solicitud" (Color Coral)
    -   "Cancelar"

---

## 2. Pantalla Profesional

### 2.1. Registro de Profesional (Ya implementada, solo como referencia de flujo)

-   Página de múltiples pasos:
    1.  Información Básica (Nombre, Categoría, Descripción)
    2.  Detalles de Contacto y Precio (Teléfono, Dirección, Precio/hora, Disponibilidad)
    3.  Experiencia y Habilidades (Años de experiencia, Lista de habilidades)
-   Confirmación de registro.

### 2.2. Dashboard del Profesional

-   **Navbar Profesional:** (Logo, Enlaces: "Mis Solicitudes", "Mi Perfil", "Calendario", "Pagos", Icono de Perfil con "Cerrar Sesión")
-   **Encabezado del Dashboard:**
    -   "Bienvenido de nuevo, [Nombre del Profesional]!"
    -   Resumen Rápido (Widgets/Tarjetas):
        -   Nuevas Solicitudes Pendientes ([Número])
        -   Servicios Agendados para Hoy/Esta Semana ([Número])
        -   Ingresos del Mes (Estimado)
        -   Calificación Promedio Actual
-   **Sección Principal (Pestañas o Secciones Separadas):**
    -   **Pestaña/Sección: Solicitudes de Servicio:**
        -   Filtros: "Nuevas", "Aceptadas", "En Progreso", "Completadas", "Canceladas"
        -   Lista de Solicitudes:
            -   Cada item: Nombre del Cliente, Servicio solicitado (resumen), Fecha de solicitud, Estado.
            -   Acciones por solicitud (dependiendo del estado): "Ver Detalles", "Aceptar", "Rechazar", "Marcar como Completado", "Contactar Cliente".
    -   **Pestaña/Sección: Mi Calendario:**
        -   Vista de Calendario (Mes/Semana/Día) mostrando servicios agendados.
        -   Posibilidad de añadir bloqueos de tiempo manuales.
    -   **Pestaña/Sección: Gestión de Perfil:**
        -   Enlace para editar la información pública del perfil (la misma del formulario de registro).
        -   Gestionar fotos de portafolio.
    -   **Pestaña/Sección: Historial de Servicios y Pagos:**
        -   Lista de todos los servicios realizados.
        -   Detalles de pagos recibidos (si se integra Stripe).
-   **Footer:**

### 2.3. Edición de Perfil Profesional

-   Similar al formulario de registro, pero con los campos pre-rellenados.
-   Permitir actualizar todos los aspectos: información básica, contacto, precios, disponibilidad, habilidades, fotos.
-   Botón "Guardar Cambios".

---

## 3. Panel de Administrador

### 3.1. Login de Administrador (Ruta Segura)

-   Formulario simple: Email, Contraseña.

### 3.2. Dashboard del Administrador

-   **Navbar de Admin:** (Logo, Enlaces: "Profesionales", "Usuarios", "Servicios", "Estadísticas", "Logout")
-   **Resumen General (Widgets/Tarjetas):**
    -   Profesionales Pendientes de Aprobación ([Número])
    -   Total Profesionales Activos ([Número])
    -   Total Usuarios Registrados ([Número])
    -   Total Servicios Creados/Solicitados ([Número])
-   **Secciones Principales:**
    -   **Gestión de Profesionales:**
        -   Tabla/Lista de profesionales.
        -   Columnas: Nombre, Email, Categoría, Estado (Pendiente, Aprobado, Rechazado, Suspendido), Fecha de Registro.
        -   Filtros por estado.
        -   Acciones por profesional: "Ver Perfil Completo", "Aprobar", "Rechazar" (con motivo), "Suspender", "Editar".
    -   **Gestión de Usuarios:**
        -   Tabla/Lista de usuarios clientes.
        -   Columnas: Nombre, Email, Fecha de Registro, Número de Solicitudes.
        -   Acciones: "Ver Detalles", "Suspender Usuario".
    -   **Gestión de Categorías de Servicios (Opcional, si se quiere dinámico):**
        -   CRUD para categorías (Nombre, Ícono).
    -   **Estadísticas Generales:**
        -   Gráficos básicos: Nuevos usuarios/profesionales por periodo, servicios más solicitados, etc.
    -   **Configuraciones (Opcional):**
        -   Parámetros de la aplicación.

---

## Common Components

### Footer

-   **Layout:** Múltiples columnas.
-   **Columna 1:** Logo Toklen, breve descripción. Iconos de Redes Sociales.
-   **Columna 2 (Empresa):** "Acerca de Nosotros", "Trabaja con Nosotros", "Prensa".
-   **Columna 3 (Soporte):** "Ayuda y FAQ", "Contacto", "Términos y Condiciones", "Política de Privacidad".
-   **Columna 4 (Descarga la App - si aplica):** Botones App Store / Google Play.
-   **Línea Inferior:** Copyright "© [Año] Toklen. Todos los derechos reservados."

---
```
