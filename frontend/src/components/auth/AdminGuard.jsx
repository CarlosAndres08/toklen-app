import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const AdminGuard = ({ children }) => {
  const { isAuthenticated, userProfile, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    // Puedes mostrar un spinner de carga aquí si lo deseas
    return <div>Cargando...</div>; 
  }

  if (!isAuthenticated) {
    // Si no está autenticado, redirigir a login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (userProfile && userProfile.user_type === 'admin') {
    // Si está autenticado y es admin, renderizar el contenido protegido
    return children;
  } else {
    // Si está autenticado pero NO es admin, redirigir a una página de "Acceso Denegado" o a Home.
    // Por ahora, redirigimos a Home. Considera crear una página de Acceso Denegado.
    console.warn('Acceso denegado: Se requiere rol de administrador.');
    return <Navigate to="/" replace />;
  }
};

export default AdminGuard;

