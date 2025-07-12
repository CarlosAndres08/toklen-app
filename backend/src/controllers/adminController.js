const { pool } = require('../config/database');

// Listar todos los usuarios
exports.listUsers = async (req, res) => {
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
exports.listServices = async (req, res) => {
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
    // El count query también debe reflejar los LEFT JOINs si el WHERE clause depende de ellos,
    // pero si el WHERE es solo sobre s.status, puede ser más simple.
    // Por ahora, para ser seguro, reflejamos la estructura, aunque para status en s no es estrictamente necesario.
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
exports.approveService = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const updateQuery = "UPDATE services SET status = 'approved', updated_at = CURRENT_TIMESTAMP WHERE id = $1 AND status = 'pending' RETURNING *";
    // Asumimos que 'pending' es el estado que requiere aprobación.
    // Y 'approved' es el nuevo estado. Podríamos necesitar añadir 'approved' a la lista de CHECK de la tabla.

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
exports.rejectService = async (req, res) => {
  try {
    const { serviceId } = req.params;
    // Asumimos que 'rejected' es un estado válido. Podríamos necesitar añadirlo al CHECK constraint.
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
exports.deleteService = async (req, res) => {
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
    // Podría haber un error si, por ejemplo, hay claves foráneas que impiden el borrado (ON DELETE RESTRICT)
    // Esto dependerá de la configuración de la BD. Por ahora, un error genérico.
    res.status(500).json({ error: 'Error interno del servidor al eliminar servicio.' });
  }
};

// Eliminar/Desactivar un usuario (Opcional MVP)
// exports.deleteUser = async (req, res) => {
//   try {
//     const { userId } = req.params;
//     // TODO: Implementar lógica para eliminar o desactivar un usuario
//     // Considerar eliminar también de Firebase Auth o solo desactivar localmente.
//     res.status(501).json({ message: `Funcionalidad Eliminar Usuario ID: ${userId} (Admin) no implementada.` });
//   } catch (error) {
//     console.error('Error eliminando usuario (admin):', error);
//     res.status(500).json({ error: 'Error interno del servidor al eliminar usuario.' });
//   }
// };


