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
  serviceAddress: Joi.string().required(),
  serviceLatitude: Joi.number().min(-90).max(90).required(),
  serviceLongitude: Joi.number().min(-180).max(180).required(),
  estimatedPrice: Joi.number().min(0).optional(),
  requestedDate: Joi.date().iso().optional()
})

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
      serviceLatitude,
      serviceLongitude,
      estimatedPrice,
      requestedDate
    } = value

    // Crear servicio
    const insertQuery = `
      INSERT INTO services (
        client_id, title, description, category, service_address,
        service_latitude, service_longitude, estimated_price, requested_date
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `

    const result = await pool.query(insertQuery, [
      clientId,
      title,
      description,
      category,
      serviceAddress,
      serviceLatitude,
      serviceLongitude,
      estimatedPrice,
      requestedDate || new Date()
    ])

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
      SELECT s.*, 
             u.display_name as client_name, u.phone_number as client_phone,
             pu.display_name as professional_name, pu.phone_number as professional_phone,
             p.business_name, p.average_rating as professional_rating
      FROM services s
      JOIN users u ON s.client_id = u.id
      LEFT JOIN professionals p ON s.professional_id = p.id
      LEFT JOIN users pu ON p.user_id = pu.id
      WHERE s.id = $1
    `

    const result = await pool.query(serviceQuery, [serviceId])

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
  getNearbyServices
}