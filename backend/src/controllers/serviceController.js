const { Pool } = require('pg')
const Joi = require('joi')

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
})

// Esquemas de validación
const createServiceSchema = Joi.object({
  title: Joi.string().min(5).max(255).required(),
  description: Joi.string().min(10).max(1000).required(),
  category: Joi.string().required(),
  address: Joi.string().required(), // Corresponde a serviceAddress en la tabla
  location: Joi.object({ // Contiene lat y lng
    lat: Joi.number().min(-90).max(90).required(),
    lng: Joi.number().min(-180).max(180).required()
  }).required(),
  budget: Joi.number().min(0).optional().allow(null, ''), // Corresponde a estimatedPrice
  preferredDate: Joi.date().iso().allow(null, '').optional(),
  preferredTime: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/).allow(null, '').optional(), // Formato HH:mm
  urgency: Joi.string().valid('low', 'medium', 'high', 'emergency').optional(),
  district: Joi.string().optional(),
  contactPhone: Joi.string().optional(), // TODO: Añadir validación de formato de teléfono
  additionalNotes: Joi.string().allow(null, '').max(1000).optional()
});

const updateStatusSchema = Joi.object({
  status: Joi.string().valid('pending', 'accepted', 'in_progress', 'completed', 'cancelled').required()
})

const rateServiceSchema = Joi.object({
  rating: Joi.number().min(1).max(5).required(),
  review: Joi.string().max(500).optional()
})

const createService = async (req, res) => {
  try {
    // Validar datos
    const { error, value } = createServiceSchema.validate(req.body)
    if (error) {
      return res.status(400).json({ 
        error: 'Datos inválidos', 
        details: error.details 
      })
    }

    // Obtener ID del usuario cliente
    const userQuery = 'SELECT id FROM users WHERE firebase_uid = $1'
    const userResult = await pool.query(userQuery, [req.user.uid])
    
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' })
    }

    const clientId = userResult.rows[0].id

    const {
      title,
      description,
      category,
      serviceAddress,
      title,
      description,
      category,
      address, // del schema Joi
      location, // del schema Joi {lat, lng}
      budget, // del schema Joi
      preferredDate, // del schema Joi
      preferredTime, // del schema Joi
      urgency,
      district,
      contactPhone,
      additionalNotes
    } = value;

    let requestedDatetimeCombined = null;
    if (preferredDate) {
      if (preferredTime) {
        requestedDatetimeCombined = `${preferredDate}T${preferredTime}:00`; // Asume que preferredTime es HH:mm
      } else {
        requestedDatetimeCombined = `${preferredDate}T00:00:00`; // Si no hay hora, inicio del día
      }
      // Validar si es una fecha válida antes de convertir
      if (isNaN(new Date(requestedDatetimeCombined).getTime())) {
        requestedDatetimeCombined = new Date(); // Fallback a ahora si la fecha/hora combinada no es válida
      } else {
        requestedDatetimeCombined = new Date(requestedDatetimeCombined);
      }
    } else {
      requestedDatetimeCombined = new Date(); // Default a ahora si no se provee fecha
    }


    // Crear servicio
    // Nombres de columna de la BD: service_address, service_latitude, service_longitude, estimated_price, requested_datetime
    // Nuevas columnas: urgency, district, contact_phone, additional_notes
    const insertQuery = `
      INSERT INTO services (
        client_id, title, description, category, 
        service_address, service_latitude, service_longitude, 
        estimated_price, requested_datetime,
        urgency, district, contact_phone, additional_notes,
        status -- status se establece por DEFAULT 'pending' en la BD
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *
    `;

    const result = await pool.query(insertQuery, [
      clientId,
      title,
      description,
      category,
      address, // Mapeado a service_address
      location.lat, // Mapeado a service_latitude
      location.lng, // Mapeado a service_longitude
      budget, // Mapeado a estimated_price
      requestedDatetimeCombined, // Mapeado a requested_datetime
      urgency,
      district,
      contactPhone,
      additionalNotes
    ]);

    res.status(201).json({
      message: 'Servicio creado exitosamente',
      service: result.rows[0]
    })

  } catch (error) {
    console.error('Error creando servicio:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}

const getUserServices = async (req, res) => {
  try {
    // Obtener ID del usuario
    const userQuery = 'SELECT id, user_type FROM users WHERE firebase_uid = $1'
    const userResult = await pool.query(userQuery, [req.user.uid])
    
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' })
    }

    const { id: userId, user_type: userType } = userResult.rows[0]

    let servicesQuery
    let queryParams

    if (userType === 'client') {
      // Servicios como cliente
      servicesQuery = `
        SELECT s.*, 
               u.display_name as professional_name,
               u.phone_number as professional_phone,
               p.business_name,
               p.average_rating as professional_rating
        FROM services s
        LEFT JOIN professionals p ON s.professional_id = p.id
        LEFT JOIN users u ON p.user_id = u.id
        WHERE s.client_id = $1
        ORDER BY s.created_at DESC
      `
      queryParams = [userId]
    } else {
      // Servicios como profesional
      const professionalQuery = 'SELECT id FROM professionals WHERE user_id = $1'
      const professionalResult = await pool.query(professionalQuery, [userId])
      
      if (professionalResult.rows.length === 0) {
        return res.json({ services: [] })
      }

      const professionalId = professionalResult.rows[0].id

      servicesQuery = `
        SELECT s.*, 
               u.display_name as client_name,
               u.phone_number as client_phone
        FROM services s
        JOIN users u ON s.client_id = u.id
        WHERE s.professional_id = $1
        ORDER BY s.created_at DESC
      `
      queryParams = [professionalId]
    }

    const result = await pool.query(servicesQuery, queryParams)

    res.json({
      services: result.rows,
      userType
    })

  } catch (error) {
    console.error('Error obteniendo servicios:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}

const getNearbyServices = async (req, res) => {
  try {
    // Solo profesionales pueden ver servicios cercanos
    const userQuery = `
      SELECT u.id, u.user_type, p.id as professional_id, p.category, 
             p.latitude, p.longitude, p.service_radius_km
      FROM users u
      LEFT JOIN professionals p ON u.id = p.user_id
      WHERE u.firebase_uid = $1
    `
    const userResult = await pool.query(userQuery, [req.user.uid])
    
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' })
    }

    const user = userResult.rows[0]

    if (user.user_type !== 'professional' || !user.professional_id) {
      return res.status(403).json({ error: 'Solo profesionales pueden acceder a esta función' })
    }

    // Buscar servicios cercanos en su categoría
    const servicesQuery = `
      SELECT s.*, u.display_name as client_name, u.phone_number as client_phone,
             (
               6371 * acos(
                 cos(radians($1)) * 
                 cos(radians(s.service_latitude)) * 
                 cos(radians(s.service_longitude) - radians($2)) + 
                 sin(radians($1)) * 
                 sin(radians(s.service_latitude))
               )
             ) AS distance_km
      FROM services s
      JOIN users u ON s.client_id = u.id
      WHERE s.status = 'pending'
      AND s.category = $3
      HAVING distance_km <= $4
      ORDER BY distance_km ASC, s.created_at DESC
      LIMIT 20
    `

    const result = await pool.query(servicesQuery, [
      user.latitude,
      user.longitude,
      user.category,
      user.service_radius_km
    ])

    res.json({
      services: result.rows,
      professionalLocation: {
        latitude: user.latitude,
        longitude: user.longitude,
        radius: user.service_radius_km
      }
    })

  } catch (error) {
    console.error('Error obteniendo servicios cercanos:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}

const acceptService = async (req, res) => {
  try {
    const { id: serviceId } = req.params

    // Verificar que el usuario es profesional
    const userQuery = `
      SELECT u.id, p.id as professional_id
      FROM users u
      JOIN professionals p ON u.id = p.user_id
      WHERE u.firebase_uid = $1 AND p.is_available = true
    `
    const userResult = await pool.query(userQuery, [req.user.uid])
    
    if (userResult.rows.length === 0) {
      return res.status(403).json({ error: 'Solo profesionales disponibles pueden aceptar servicios' })
    }

    const professionalId = userResult.rows[0].professional_id

    // Verificar que el servicio existe y está pendiente
    const serviceQuery = 'SELECT * FROM services WHERE id = $1 AND status = $2'
    const serviceResult = await pool.query(serviceQuery, [serviceId, 'pending'])

    if (serviceResult.rows.length === 0) {
      return res.status(404).json({ error: 'Servicio no encontrado o ya no está disponible' })
    }

    // Aceptar el servicio
    const updateQuery = `
      UPDATE services 
      SET professional_id = $1, status = $2, accepted_at = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING *
    `

    const result = await pool.query(updateQuery, [professionalId, 'accepted', serviceId])

    res.json({
      message: 'Servicio aceptado exitosamente',
      service: result.rows[0]
    })

  } catch (error) {
    console.error('Error aceptando servicio:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}

const updateServiceStatus = async (req, res) => {
  try {
    const { id: serviceId } = req.params
    const { error, value } = updateStatusSchema.validate(req.body)
    
    if (error) {
      return res.status(400).json({ 
        error: 'Datos inválidos', 
        details: error.details 
      })
    }

    const { status } = value

    // Verificar permisos y obtener el servicio
    const serviceQuery = `
      SELECT s.*, u.firebase_uid as client_uid, pu.firebase_uid as professional_uid
      FROM services s
      JOIN users u ON s.client_id = u.id
      LEFT JOIN professionals p ON s.professional_id = p.id
      LEFT JOIN users pu ON p.user_id = pu.id
      WHERE s.id = $1
    `
    const serviceResult = await pool.query(serviceQuery, [serviceId])

    if (serviceResult.rows.length === 0) {
      return res.status(404).json({ error: 'Servicio no encontrado' })
    }

    const service = serviceResult.rows[0]

    // Verificar permisos según el estado
    const isClient = service.client_uid === req.user.uid
    const isProfessional = service.professional_uid === req.user.uid

    if (!isClient && !isProfessional) {
      return res.status(403).json({ error: 'No tienes permisos para actualizar este servicio' })
    }

    // Validar transiciones de estado
    const validTransitions = {
      'pending': ['accepted', 'cancelled'],
      'accepted': ['in_progress', 'cancelled'],
      'in_progress': ['completed', 'cancelled'],
      'completed': [],
      'cancelled': []
    }

    if (!validTransitions[service.status].includes(status)) {
      return res.status(400).json({ 
        error: `No se puede cambiar el estado de ${service.status} a ${status}` 
      })
    }

    // Actualizar estado
    let updateQuery = 'UPDATE services SET status = $1, updated_at = CURRENT_TIMESTAMP'
    const queryParams = [status, serviceId]
    let paramIndex = 3

    if (status === 'in_progress') {
      updateQuery += `, started_at = CURRENT_TIMESTAMP`
    } else if (status === 'completed') {
      updateQuery += `, completed_at = CURRENT_TIMESTAMP`
    }

    updateQuery += ` WHERE id = $2 RETURNING *`

    const result = await pool.query(updateQuery, queryParams)

    res.json({
      message: 'Estado del servicio actualizado correctamente',
      service: result.rows[0]
    })

  } catch (error) {
    console.error('Error actualizando estado del servicio:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}

const rateService = async (req, res) => {
  try {
    const { id: serviceId } = req.params
    const { error, value } = rateServiceSchema.validate(req.body)
    
    if (error) {
      return res.status(400).json({ 
        error: 'Datos inválidos', 
        details: error.details 
      })
    }

    const { rating, review } = value

    // Obtener el servicio y verificar permisos
    const serviceQuery = `
      SELECT s.*, u.firebase_uid as client_uid, pu.firebase_uid as professional_uid,
             p.id as professional_id
      FROM services s
      JOIN users u ON s.client_id = u.id
      LEFT JOIN professionals p ON s.professional_id = p.id
      LEFT JOIN users pu ON p.user_id = pu.id
      WHERE s.id = $1 AND s.status = 'completed'
    `
    const serviceResult = await pool.query(serviceQuery, [serviceId])

    if (serviceResult.rows.length === 0) {
      return res.status(404).json({ error: 'Servicio no encontrado o no completado' })
    }

    const service = serviceResult.rows[0]
    const isClient = service.client_uid === req.user.uid
    const isProfessional = service.professional_uid === req.user.uid

    if (!isClient && !isProfessional) {
      return res.status(403).json({ error: 'No tienes permisos para calificar este servicio' })
    }

    // Actualizar calificación
    let updateQuery
    let queryParams

    if (isClient) {
      // Cliente califica al profesional
      if (service.client_rating) {
        return res.status(400).json({ error: 'Ya has calificado este servicio' })
      }

      updateQuery = `
        UPDATE services 
        SET client_rating = $1, client_review = $2, updated_at = CURRENT_TIMESTAMP
        WHERE id = $3
        RETURNING *
      `
      queryParams = [rating, review, serviceId]

      // Actualizar promedio del profesional
      const avgQuery = `
        UPDATE professionals 
        SET average_rating = (
          SELECT AVG(client_rating)::DECIMAL(3,2) 
          FROM services 
          WHERE professional_id = $1 AND client_rating IS NOT NULL
        ),
        total_reviews = (
          SELECT COUNT(*) 
          FROM services 
          WHERE professional_id = $1 AND client_rating IS NOT NULL
        )
        WHERE id = $1
      `
      await pool.query(avgQuery, [service.professional_id])

    } else {
      // Profesional califica al cliente
      if (service.professional_rating) {
        return res.status(400).json({ error: 'Ya has calificado este servicio' })
      }

      updateQuery = `
        UPDATE services 
        SET professional_rating = $1, professional_review = $2, updated_at = CURRENT_TIMESTAMP
        WHERE id = $3
        RETURNING *
      `
      queryParams = [rating, review, serviceId]
    }

    const result = await pool.query(updateQuery, queryParams)

    res.json({
      message: 'Calificación registrada exitosamente',
      service: result.rows[0]
    })

  } catch (error) {
    console.error('Error calificando servicio:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}

const getServiceById = async (req, res) => {
  try {
    const { id: serviceId } = req.params

    const serviceQuery = `
      SELECT 
        s.id, s.title, s.description, s.category, s.status, 
        s.urgency, s.district, s.contact_phone, s.additional_notes,
        s.service_address AS address, 
        s.service_latitude AS latitude, 
        s.service_longitude AS longitude,
        s.estimated_price AS budget, 
        s.requested_datetime, 
        s.created_at, s.updated_at, s.accepted_at, s.started_at, s.completed_at,
        s.client_id, s.professional_id,
        s.client_rating, s.client_review, s.professional_rating, s.professional_review,
        uc.display_name AS client_name, 
        uc.phone_number AS client_contact_phone, -- Renombrado para evitar confusión con service.contact_phone
        up.display_name AS professional_name, 
        up.phone_number AS professional_contact_phone, -- Renombrado
        prof.business_name, 
        prof.average_rating AS professional_average_rating
      FROM services s
      JOIN users uc ON s.client_id = uc.id
      LEFT JOIN professionals prof ON s.professional_id = prof.id
      LEFT JOIN users up ON prof.user_id = up.id
      WHERE s.id = $1
    `;

    const result = await pool.query(serviceQuery, [serviceId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Servicio no encontrado' })
    }

    const service = result.rows[0]

    // Verificar permisos - solo cliente o profesional asignado
    const userQuery = 'SELECT id FROM users WHERE firebase_uid = $1'
    const userResult = await pool.query(userQuery, [req.user.uid])
    const userId = userResult.rows[0]?.id

    const hasAccess = service.client_id === userId || 
                     (service.professional_id && 
                      await pool.query('SELECT 1 FROM professionals WHERE id = $1 AND user_id = $2', 
                                     [service.professional_id, userId]).then(r => r.rows.length > 0))

    if (!hasAccess) {
      return res.status(403).json({ error: 'No tienes permisos para ver este servicio' })
    }

    res.json({ service: result.rows[0] })

  } catch (error) {
    console.error('Error obteniendo servicio:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}

module.exports = {
  createService,
  getUserServices,
  acceptService,
  updateServiceStatus,
  rateService,
  getServiceById,
  getNearbyServices,
  listPublicServices // Exportar la nueva función
}

// Nueva función para listar servicios públicos (aprobados)
exports.listPublicServices = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10; // Límite más bajo para vista pública
    const offset = (page - 1) * limit;
    const category = req.query.category;
    const searchTerm = req.query.search;

    let query = `
      SELECT s.id, s.title, s.description, s.category, s.service_address as address, 
             s.estimated_price as budget, s.status, s.created_at,
             u.display_name as professional_name, p.id as professional_id, p.average_rating as professional_rating
      FROM services s
      JOIN professionals p ON s.professional_id = p.id
      JOIN users u ON p.user_id = u.id
      WHERE s.status = 'approved'
    `;
    let countQuery = `
      SELECT COUNT(s.id) 
      FROM services s 
      JOIN professionals p ON s.professional_id = p.id
      JOIN users u ON p.user_id = u.id
      WHERE s.status = 'approved'
    `;
    
    const queryParams = [];
    const countQueryParams = [];
    let paramIndex = 1;

    if (category) {
      query += ` AND s.category = $${paramIndex}`;
      countQuery += ` AND s.category = $${paramIndex}`;
      queryParams.push(category);
      countQueryParams.push(category);
      paramIndex++;
    }

    if (searchTerm) {
      query += ` AND (s.title ILIKE $${paramIndex} OR s.description ILIKE $${paramIndex} OR u.display_name ILIKE $${paramIndex})`;
      countQuery += ` AND (s.title ILIKE $${paramIndex} OR s.description ILIKE $${paramIndex} OR u.display_name ILIKE $${paramIndex})`;
      queryParams.push(`%${searchTerm}%`);
      countQueryParams.push(`%${searchTerm}%`);
      paramIndex++;
    }

    query += ` ORDER BY s.created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    queryParams.push(limit, offset);

    const servicesResult = await pool.query(query, queryParams);
    const totalResult = await pool.query(countQuery, countQueryParams);

    res.json({
      message: 'Servicios públicos listados correctamente.',
      data: servicesResult.rows,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalResult.rows[0].count / limit),
        totalServices: parseInt(totalResult.rows[0].count, 10),
        limit,
      }
    });

  } catch (error) {
    console.error('Error listando servicios públicos:', error);
    res.status(500).json({ error: 'Error interno del servidor al listar servicios públicos.' });
  }
};