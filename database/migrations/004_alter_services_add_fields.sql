-- Añadir nuevas columnas a la tabla services
ALTER TABLE services
ADD COLUMN urgency VARCHAR(20) CHECK (urgency IN ('low', 'medium', 'high', 'emergency')),
ADD COLUMN district VARCHAR(100),
ADD COLUMN contact_phone VARCHAR(50),
ADD COLUMN additional_notes TEXT;

-- Renombrar requested_date a requested_datetime y cambiar tipo si es necesario
-- Primero, verificamos si la columna es de tipo DATE o TIMESTAMP sin zona horaria
-- Si es DATE, podríamos necesitar convertir los datos existentes o manejarlos.
-- Por simplicidad, si ya es TIMESTAMP, solo renombramos. Si es DATE, la cambiamos.
-- Esta migración asume que puede haber datos y trata de preservarlos si es DATE.
-- Si la tabla está vacía, es más simple: ALTER TABLE services RENAME COLUMN requested_date TO requested_datetime; ALTER TABLE services ALTER COLUMN requested_datetime TYPE TIMESTAMP WITH TIME ZONE;

DO $$
BEGIN
    IF EXISTS(SELECT 1 FROM information_schema.columns 
              WHERE table_name='services' AND column_name='requested_date' AND data_type='date') THEN
        ALTER TABLE services ADD COLUMN temp_requested_datetime TIMESTAMP WITH TIME ZONE;
        UPDATE services SET temp_requested_datetime = requested_date::TIMESTAMP WITH TIME ZONE WHERE requested_date IS NOT NULL;
        ALTER TABLE services DROP COLUMN requested_date;
        ALTER TABLE services RENAME COLUMN temp_requested_datetime TO requested_datetime;
    ELSIF EXISTS(SELECT 1 FROM information_schema.columns 
                 WHERE table_name='services' AND column_name='requested_date' AND (data_type LIKE 'timestamp%' OR data_type LIKE 'time without time zone' OR data_type LIKE 'time with time zone')) THEN
        ALTER TABLE services RENAME COLUMN requested_date TO requested_datetime;
        ALTER TABLE services ALTER COLUMN requested_datetime TYPE TIMESTAMP WITH TIME ZONE USING requested_datetime::TIMESTAMP WITH TIME ZONE;
    ELSIF NOT EXISTS(SELECT 1 FROM information_schema.columns WHERE table_name='services' AND column_name='requested_datetime') THEN
        ALTER TABLE services ADD COLUMN requested_datetime TIMESTAMP WITH TIME ZONE;
    END IF;
END $$;

-- Actualizar el CHECK constraint para status
ALTER TABLE services DROP CONSTRAINT IF EXISTS services_status_check;
ALTER TABLE services ADD CONSTRAINT services_status_check 
  CHECK (status IN (
    'pending',        -- Solicitud de cliente, o servicio de profesional esperando aprobación de admin
    'approved',       -- Servicio de profesional aprobado por admin, visible públicamente
    'rejected',       -- Servicio de profesional rechazado por admin
    'accepted',       -- Solicitud de cliente aceptada por un profesional
    'in_progress',    -- Servicio en curso
    'completed',      -- Servicio completado
    'cancelled'       -- Servicio cancelado por cliente o profesional
    -- 'pending_approval' -- Alternativa a 'pending' para servicios de profesionales esperando revisión
  ));


-- Cambiar nombres de columnas existentes para consistencia (opcional pero recomendado)
-- ALTER TABLE services RENAME COLUMN service_address TO address_text;
-- ALTER TABLE services RENAME COLUMN service_latitude TO latitude;
-- ALTER TABLE services RENAME COLUMN service_longitude TO longitude;
-- ALTER TABLE services RENAME COLUMN estimated_price TO budget;
-- Nota: Estos cambios de nombre requerirían actualizar todas las consultas existentes.
-- Por ahora, me centraré en añadir los nuevos campos y manejar los nombres en el código.
-- El schema Joi ya usa los nombres del frontend (address, location, budget).
-- El controlador mapeará estos a los nombres de columna actuales (service_address, service_latitude, etc.).

-- Asegurar que las nuevas columnas tengan valores por defecto o sean NULLables si no se proveen siempre
ALTER TABLE services ALTER COLUMN urgency SET DEFAULT 'medium';
-- district, contact_phone, additional_notes ya son NULLables por defecto.

COMMENT ON COLUMN services.urgency IS 'Nivel de urgencia de la solicitud del servicio.';
COMMENT ON COLUMN services.district IS 'Distrito donde se requiere el servicio.';
COMMENT ON COLUMN services.contact_phone IS 'Teléfono de contacto proporcionado para esta solicitud de servicio.';
COMMENT ON COLUMN services.additional_notes IS 'Notas adicionales o comentarios para la solicitud de servicio.';
COMMENT ON COLUMN services.requested_datetime IS 'Fecha y hora preferida para el servicio.';
