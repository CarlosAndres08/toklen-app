-- Categorías principales de servicios en Perú
INSERT INTO service_categories (name, description, icon) VALUES
('Plomería', 'Instalación y reparación de tuberías, grifos, inodoros', 'wrench'),
('Electricidad', 'Instalaciones eléctricas, reparaciones, iluminación', 'zap'),
('Carpintería', 'Muebles, puertas, ventanas, reparaciones de madera', 'hammer'),
('Limpieza', 'Limpieza de hogar, oficinas, post-construcción', 'sparkles'),
('Jardinería', 'Mantenimiento de jardines, poda, paisajismo', 'flower'),
('Pintura', 'Pintura de interiores y exteriores, decoración', 'palette'),
('Mecánica Automotriz', 'Reparación de vehículos, mantenimiento', 'car'),
('Tecnología', 'Reparación de computadoras, instalación de equipos', 'laptop'),
('Construcción', 'Albañilería, remodelaciones, construcción menor', 'hard-hat'),
('Belleza y Bienestar', 'Peluquería, masajes, cuidado personal', 'scissors');

-- Distritos principales de Lima
INSERT INTO districts (name, city, latitude, longitude) VALUES
('Miraflores', 'Lima', -12.1198, -77.0284),
('San Isidro', 'Lima', -12.0956, -77.0364),
('Barranco', 'Lima', -12.1400, -77.0200),
('Surco', 'Lima', -12.1500, -76.9900),
('La Molina', 'Lima', -12.0800, -76.9400),
('San Borja', 'Lima', -12.1100, -77.0000),
('Pueblo Libre', 'Lima', -12.0800, -77.0600),
('Jesús María', 'Lima', -12.0700, -77.0500),
('Lince', 'Lima', -12.0900, -77.0400),
('Magdalena', 'Lima', -12.0900, -77.0700);