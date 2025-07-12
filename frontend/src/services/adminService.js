import api from './api'; // Usamos la instancia de Axios configurada

export const adminService = {
  listUsers: (page = 1, limit = 20) => {
    return api.get('/admin/users', {
      params: { page, limit }
    });
  },

  listServices: (filters = {}) => {
    // TODO: Definir filtros (status, category, etc.)
    return api.get('/admin/services', {
      params: filters
    });
  },

  approveService: (serviceId) => {
    return api.patch(`/admin/services/${serviceId}/approve`);
  },

  rejectService: (serviceId) => {
    return api.patch(`/admin/services/${serviceId}/reject`);
  },

  deleteService: (serviceId) => {
    return api.delete(`/admin/services/${serviceId}`);
  },
  
  // deleteUser: (userId) => { // Opcional MVP
  //   return api.delete(`/admin/users/${userId}`);
  // }
};

