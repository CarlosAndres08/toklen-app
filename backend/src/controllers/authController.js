const { Pool } = require('pg')
const Joi = require('joi')

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
})

// Esquemas de validación
const syncUserSchema = Joi.object({
  displayName: Joi.string().min(2).max(100),
  email: Joi.string().email().required(),
  phoneNumber: Joi.string().optional(),
  profilePicture: Joi.string().uri().optional(),
  userType: Joi.string().valid('client', 'professional').default('client')
})

const updateProfileSchema = Joi.object({
  displayName: Joi.string().min(2).max(100),
  phoneNumber: Joi.string().optional(),
  profilePicture: Joi.string().uri().optional()
})

const syncUser = async (req, res) => {
  try {
    // Validar datos de entrada
    const { error, value } = syncUserSchema.validate(req.body)
    if (error) {
      return res.status(400).json({ 
        error: 'Datos inválidos', 
        details: error.details 
      })
    }

    const { displayName, email, phoneNumber, profilePicture, userType } = value

    // Verificar si el usuario ya existe
    const existingUser = await pool.query(
      'SELECT * FROM users WHERE firebase_uid = $1',
      [req.user.uid]
    )

    let user

    if (existingUser.rows.length > 0) {
      // Actualizar usuario existente
      const updateQuery = `
        UPDATE users 
        SET display_name = $1, phone_number = $2, profile_picture_url = $3, 
            updated_at = CURRENT_TIMESTAMP
        WHERE firebase_uid = $4
        RETURNING *
      `
      const result = await pool.query(updateQuery, [
        displayName || existingUser.rows[0].display_name,
        phoneNumber || existingUser.rows[0].phone_number,
        profilePicture || existingUser.rows[0].profile_picture_url,
        req.user.uid
      ])
      user = result.rows[0]
    } else {
      // Crear nuevo usuario
      const insertQuery = `
        INSERT INTO users (firebase_uid, email, display_name, phone_number, profile_picture_url, user_type)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
      `
      const result = await pool.query(insertQuery, [
        req.user.uid,
        email,
        displayName,
        phoneNumber,
        profilePicture,
        userType
      ])
      user = result.rows[0]
    }

    res.json({
      message: 'Usuario sincronizado correctamente',
      user: {
        id: user.id,
        email: user.email,
        displayName: user.display_name,
        phoneNumber: user.phone_number,
        profilePicture: user.profile_picture_url,
        userType: user.user_type,
        isActive: user.is_active
      }
    })

  } catch (error) {
    console.error('Error sincronizando usuario:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}

const getProfile = async (req, res) => {
  try {
    const userQuery = `
      SELECT u.*, p.id as professional_id, p.business_name, p.category, 
             p.is_verified, p.average_rating, p.is_available
      FROM users u
      LEFT JOIN professionals p ON u.id = p.user_id
      WHERE u.firebase_uid = $1
    `
    
    const result = await pool.query(userQuery, [req.user.uid])
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' })
    }

    const user = result.rows[0]
    
    res.json({
      user: {
        id: user.id,
        email: user.email,
        displayName: user.display_name,
        phoneNumber: user.phone_number,
        profilePicture: user.profile_picture_url,
        userType: user.user_type,
        isActive: user.is_active,
        professional: user.professional_id ? {
          id: user.professional_id,
          businessName: user.business_name,
          category: user.category,
          isVerified: user.is_verified,
          averageRating: user.average_rating,
          isAvailable: user.is_available
        } : null
      }
    })

  } catch (error) {
    console.error('Error obteniendo perfil:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}

const updateProfile = async (req, res) => {
  try {
    const { error, value } = updateProfileSchema.validate(req.body)
    if (error) {
      return res.status(400).json({ 
        error: 'Datos inválidos', 
        details: error.details 
      })
    }

    const { displayName, phoneNumber, profilePicture } = value

    const updateQuery = `
      UPDATE users 
      SET display_name = COALESCE($1, display_name),
          phone_number = COALESCE($2, phone_number),
          profile_picture_url = COALESCE($3, profile_picture_url),
          updated_at = CURRENT_TIMESTAMP
      WHERE firebase_uid = $4
      RETURNING *
    `

    const result = await pool.query(updateQuery, [
      displayName,
      phoneNumber,
      profilePicture,
      req.user.uid
    ])

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' })
    }

    const user = result.rows[0]

    res.json({
      message: 'Perfil actualizado correctamente',
      user: {
        id: user.id,
        email: user.email,
        displayName: user.display_name,
        phoneNumber: user.phone_number,
        profilePicture: user.profile_picture_url,
        userType: user.user_type
      }
    })

  } catch (error) {
    console.error('Error actualizando perfil:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}

module.exports = {
  syncUser,
  getProfile,
  updateProfile
}