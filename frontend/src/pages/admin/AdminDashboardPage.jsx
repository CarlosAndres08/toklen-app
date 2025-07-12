import React from 'react';
import { Link } from 'react-router-dom';

const AdminDashboardPage = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Panel de Administración</h1>
      <p className="mb-4">Bienvenido al panel de administración. Desde aquí puedes gestionar usuarios y servicios.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link to="/admin/users" className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
          <h2 className="text-xl font-semibold mb-2 text-secondary">Gestionar Usuarios</h2>
          <p className="text-neutral">Ver y administrar la lista de usuarios registrados.</p>
        </Link>
        
        <Link to="/admin/services" className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
          <h2 className="text-xl font-semibold mb-2 text-secondary">Gestionar Servicios</h2>
          <p className="text-neutral">Aprobar, rechazar o eliminar servicios publicados.</p>
        </Link>
        
        {/* Añadir más tarjetas de navegación aquí para otras funcionalidades del admin */}
      </div>
    </div>
  );
};

export default AdminDashboardPage;

