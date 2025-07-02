const { Pool } = require('pg')
const Joi = require('joi')

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
})

// Esquema de validación para registro de profesional
const professionalSchema = Joi.object({
  businessName: Joi.string().min(2).max(255).required(),
  description: Joi.string().min(10).max(1000).required(),
  category: Joi.string().required(),
  subcategory: Joi.string().optional(),
  experienceYears: Joi.number().min(0).max(50).default(0),
  hourlyRate: Joi.number().min(0).max(10000).required(),
  serviceRadius: Joi.number().min(1).max(50).default(10),
  address: Joi.string().required(),
  latitude: Joi.number().min(-90).max(90).required(),
  longitude: Joi.number().min(-180).max(180).required(),
  city: Joi.string().required(),
  district: Joi.string().required()
})

const registerProfessional = async (req, res) => {
  try {
    // Validar datos de entrada
    const { error, value } = professionalSchema.validate(req.body)
    if (error) {
      return res.status(400).json({ 
        error: 'Datos inválidos', 
        details: error.details 
      })
    }

    const {
      businessName,
      description,
      category,
      subcategory,
      experienceYears,
      hourlyRate,
      serviceRadius,
      address,
      latitude,
      longitude,
      city,
      district
    } = value

    // Obtener el user_id del usuario autenticado
    const userQuery = 'SELECT id FROM users WHERE firebase_uid = $1'
    const userResult = await pool.query(userQuery, [req.user.uid])
    
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' })
    }

    const userId = userResult.rows[0].id

    // Verificar si ya existe un perfil profesional
    const existingProfessional = await pool.query(
      'SELECT id FROM professionals WHERE user_id = $1',
      [userId]
    )

    if (existingProfessional.rows.length > 0) {
      return res.status(400).json({ 
        error: 'Ya existe un perfil profesional para este usuario' 
      })
    }

    // Insertar nuevo profesional
    const insertQuery = `
      INSERT INTO professionals (
        user_id, business_name, description, category, subcategory,
        experience_years, hourly_rate, service_radius_km, address,
        latitude, longitude, city, district
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *
    `

    const result = await pool.query(insertQuery, [
      userId, businessName, description, category, subcategory,
      experienceYears, hourlyRate, serviceRadius, address,
      latitude, longitude, city, district
    ])

    // Actualizar tipo de usuario
    await pool.query(
      'UPDATE users SET user_type = $1 WHERE id = $2',
      ['professional', userId]
    )

    res.status(201).json({
      message: 'Perfil profesional creado exitosamente',
      professional: result.rows[0]
    })

  } catch (error) {
    console.error('Error registrando profesional:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}

const getNearbyProfessionals = async (req, res) => {
  try {
    const { latitude, longitude, category, radius = 10 } = req.query

    if (!latitude || !longitude) {
      return res.status(400).json({ 
        error: 'Latitud y longitud son requeridas' 
      })
    }

    let query = `
      SELECT 
        p.*,
        u.display_name,
        u.profile_picture_url,
        u.phone_number,
        (
          6371 * acos(
            cos(radians($1)) * 
            cos(radians(p.latitude)) * 
            cos(radians(p.longitude) - radians($2)) + 
            sin(radians($1)) * 
            sin(radians(p.latitude))
          )
        ) AS distance_km
      FROM professionals p
      JOIN users u ON p.user_id = u.id
      WHERE p.is_available = true
      AND p.is_verified = true
    `

    const queryParams = [parseFloat(latitude), parseFloat(longitude)]
    let paramIndex = 3

    if (category) {
      query += ` AND p.category = $${paramIndex}`
      queryParams.push(category)
      paramIndex++
    }

    query += ` 
      HAVING distance_km <= $${paramIndex}
      ORDER BY distance_km ASC, p.average_rating DESC
      LIMIT 20
    `
    queryParams.push(parseFloat(radius))

    const result = await pool.query(query, queryParams)

    res.json({
      professionals: result.rows,
      total: result.rows.length
    })

  } catch (error) {
    console.error('Error obteniendo profesionales:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}

module.exports = {
  registerProfessional,
  getNearbyProfessionals
}