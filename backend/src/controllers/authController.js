import { pool } from '../config/database.js';

// Sincronizar usuario después del login con Firebase
export const syncUser = async (req, res) => {
  try {
    const { uid, email, displayName } = req.user;
    
    // Verificar si el usuario ya existe
    const existingUser = await pool.query('SELECT * FROM users WHERE firebase_uid = $1', [uid]);
    
    if (existingUser.rows.length === 0) {
      // Crear nuevo usuario
      const newUser = await pool.query(
        'INSERT INTO users (firebase_uid, email, display_name, user_type) VALUES ($1, $2, $3, $4) RETURNING *',
        [uid, email, displayName || email.split('@')[0], 'client']
      );
      
      res.status(201).json({
        message: 'Usuario sincronizado correctamente',
        user: newUser.rows[0]
      });
    } else {
      // Actualizar último login
      await pool.query(
        'UPDATE users SET last_login_at = CURRENT_TIMESTAMP WHERE firebase_uid = $1',
        [uid]
      );
      
      res.json({
        message: 'Usuario ya existe, login actualizado',
        user: existingUser.rows[0]
      });
    }
  } catch (error) {
    console.error('Error sincronizando usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Obtener perfil del usuario autenticado
export const getProfile = async (req, res) => {
  try {
    const { uid } = req.user;
    
    const user = await pool.query('SELECT * FROM users WHERE firebase_uid = $1', [uid]);
    
    if (user.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    res.json({
      message: 'Perfil obtenido correctamente',
      user: user.rows[0]
    });
  } catch (error) {
    console.error('Error obteniendo perfil:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Actualizar perfil del usuario
export const updateProfile = async (req, res) => {
  try {
    const { uid } = req.user;
    const { display_name, phone } = req.body;
    
    const updatedUser = await pool.query(
      'UPDATE users SET display_name = $1, phone = $2, updated_at = CURRENT_TIMESTAMP WHERE firebase_uid = $3 RETURNING *',
      [display_name, phone, uid]
    );
    
    if (updatedUser.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    res.json({
      message: 'Perfil actualizado correctamente',
      user: updatedUser.rows[0]
    });
  } catch (error) {
    console.error('Error actualizando perfil:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Listar todos los usuarios (función de administrador)
export const listUsers = async (req, res) => {
  try {
    // Paginación simple (opcional, pero buena práctica)
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const offset = (page - 1) * limit;

    const usersQuery = `
      SELECT id, firebase_uid, email, display_name, user_type, is_active, created_at, last_login_at 
      FROM users 
      ORDER BY created_at DESC
      LIMIT $1 OFFSET $2
    `;
    const totalUsersQuery = 'SELECT COUNT(*) FROM users';

    const usersResult = await pool.query(usersQuery, [limit, offset]);
    const totalResult = await pool.query(totalUsersQuery);

    res.json({
      message: 'Usuarios listados correctamente.',
      data: usersResult.rows,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalResult.rows[0].count / limit),
        totalUsers: parseInt(totalResult.rows[0].count, 10),
        limit,
      }
    });
  } catch (error) {
    console.error('Error listando usuarios (admin):', error);
    res.status(500).json({ error: 'Error interno del servidor al listar usuarios.' });
  }
};

// Listar todos los servicios (con filtros opcionales)
export const listServices = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const offset = (page - 1) * limit;
    const statusFilter = req.query.status; // ej. 'pending', 'approved', 'rejected'

    let servicesQuery = `
      SELECT s.id, s.title, s.category, s.status, s.created_at, s.estimated_price as budget,
             prof_user.display_name as professional_name, 
             prof_user.email as professional_email, 
             p.id as professional_id,
             client_user.display_name as client_name
      FROM services s
      LEFT JOIN professionals p ON s.professional_id = p.id
      LEFT JOIN users prof_user ON p.user_id = prof_user.id
      LEFT JOIN users client_user ON s.client_id = client_user.id
    `;
    
    let countQuery = `
      SELECT COUNT(s.id) 
      FROM services s
      LEFT JOIN professionals p ON s.professional_id = p.id
      LEFT JOIN users prof_user ON p.user_id = prof_user.id
      LEFT JOIN users client_user ON s.client_id = client_user.id
    `;
    
    const queryParams = [];
    const countQueryParams = [];

    if (statusFilter) {
      servicesQuery += ' WHERE s.status = $1';
      countQuery += ' WHERE s.status = $1';
      queryParams.push(statusFilter);
      countQueryParams.push(statusFilter);
    }

    servicesQuery += ` ORDER BY s.created_at DESC LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`;
    queryParams.push(limit, offset);

    const servicesResult = await pool.query(servicesQuery, queryParams);
    const totalResult = await pool.query(countQuery, countQueryParams);

    res.json({
      message: 'Servicios listados correctamente.',
      data: servicesResult.rows,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalResult.rows[0].count / limit),
        totalServices: parseInt(totalResult.rows[0].count, 10),
        limit,
      }
    });
  } catch (error) {
    console.error('Error listando servicios (admin):', error);
    res.status(500).json({ error: 'Error interno del servidor al listar servicios.' });
  }
};

// Aprobar un servicio
export const approveService = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const updateQuery = "UPDATE services SET status = 'approved', updated_at = CURRENT_TIMESTAMP WHERE id = $1 AND status = 'pending' RETURNING *";

    const result = await pool.query(updateQuery, [serviceId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        error: 'Servicio no encontrado, no está pendiente de aprobación, o ya fue procesado.', 
        code: 'SERVICE_NOT_FOUND_OR_NOT_PENDING' 
      });
    }
    res.json({ message: 'Servicio aprobado correctamente.', data: result.rows[0] });
  } catch (error) {
    console.error('Error aprobando servicio (admin):', error);
    res.status(500).json({ error: 'Error interno del servidor al aprobar servicio.' });
  }
};

// Rechazar un servicio
export const rejectService = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const updateQuery = "UPDATE services SET status = 'rejected', updated_at = CURRENT_TIMESTAMP WHERE id = $1 AND status = 'pending' RETURNING *";
    
    const result = await pool.query(updateQuery, [serviceId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        error: 'Servicio no encontrado, no está pendiente de aprobación, o ya fue procesado.', 
        code: 'SERVICE_NOT_FOUND_OR_NOT_PENDING' 
      });
    }
    res.json({ message: 'Servicio rechazado correctamente.', data: result.rows[0] });
  } catch (error) {
    console.error('Error rechazando servicio (admin):', error);
    res.status(500).json({ error: 'Error interno del servidor al rechazar servicio.' });
  }
};

// Eliminar un servicio
export const deleteService = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const deleteQuery = "DELETE FROM services WHERE id = $1 RETURNING id";
    
    const result = await pool.query(deleteQuery, [serviceId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        error: 'Servicio no encontrado.', 
        code: 'SERVICE_NOT_FOUND' 
      });
    }
    res.status(200).json({ message: 'Servicio eliminado correctamente.', serviceId: result.rows[0].id });
  } catch (error) {
    console.error('Error eliminando servicio (admin):', error);
    res.status(500).json({ error: 'Error interno del servidor al eliminar servicio.' });
  }
};

