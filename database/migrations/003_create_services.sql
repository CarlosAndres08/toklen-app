-- Tabla de servicios/trabajos
CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES users(id) ON DELETE CASCADE,
    professional_id UUID REFERENCES professionals(id) ON DELETE CASCADE,
    
    -- Detalles del servicio
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    
    -- Ubicación del servicio
    service_address TEXT NOT NULL,
    service_latitude DECIMAL(10, 8),
    service_longitude DECIMAL(11, 8),
    
    -- Precios y pagos
    estimated_price DECIMAL(8,2),
    final_price DECIMAL(8,2),
    payment_method VARCHAR(50),
    payment_status VARCHAR(20) DEFAULT 'pending',
    
    -- Estados del servicio
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'in_progress', 'completed', 'cancelled')),
    
    -- Fechas importantes
    requested_date TIMESTAMP WITH TIME ZONE,
    accepted_at TIMESTAMP WITH TIME ZONE,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    
    -- Reseñas
    client_rating INTEGER CHECK (client_rating >= 1 AND client_rating <= 5),
    client_review TEXT,
    professional_rating INTEGER CHECK (professional_rating >= 1 AND professional_rating <= 5),
    professional_review TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices para optimizar consultas
CREATE INDEX idx_services_client_id ON services(client_id);
CREATE INDEX idx_services_professional_id ON services(professional_id);
CREATE INDEX idx_services_status ON services(status);
CREATE INDEX idx_services_category ON services(category);
CREATE INDEX idx_services_date ON services(requested_date);