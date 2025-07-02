-- Tabla de profesionales
CREATE TABLE professionals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    business_name VARCHAR(255),
    description TEXT,
    category VARCHAR(100) NOT NULL,
    subcategory VARCHAR(100),
    experience_years INTEGER DEFAULT 0,
    hourly_rate DECIMAL(8,2),
    service_radius_km INTEGER DEFAULT 10,
    
    -- Ubicación
    address TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    city VARCHAR(100),
    district VARCHAR(100),
    
    -- Verificación y ratings
    is_verified BOOLEAN DEFAULT false,
    average_rating DECIMAL(3,2) DEFAULT 0.0,
    total_reviews INTEGER DEFAULT 0,
    total_jobs_completed INTEGER DEFAULT 0,
    
    -- Disponibilidad
    is_available BOOLEAN DEFAULT true,
    availability_schedule JSONB, -- Horarios de disponibilidad
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices para geolocalización y búsqueda
CREATE INDEX idx_professionals_user_id ON professionals(user_id);
CREATE INDEX idx_professionals_category ON professionals(category);
CREATE INDEX idx_professionals_location ON professionals(latitude, longitude);
CREATE INDEX idx_professionals_available ON professionals(is_available);
CREATE INDEX idx_professionals_rating ON professionals(average_rating);