import api from './api'; // Suponiendo que api.js configura Axios

/**
 * Sincroniza el usuario de Firebase con el backend.
 * Se debe llamar después de un inicio de sesión o registro exitoso.
 */
export const syncUserWithBackend = async () => {
  try {
    // api.js debe estar configurado para incluir el token de autenticación automáticamente
    const response = await api.post('/auth/sync'); 
    console.log('User synced with backend:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error syncing user with backend:', error.response ? error.response.data : error.message);
    return { 
      success: false, 
      error: error.response ? error.response.data : { message: error.message } 
    };
  }
};

