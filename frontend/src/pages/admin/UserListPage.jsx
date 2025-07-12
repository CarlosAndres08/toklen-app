import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import { useAuth } from '../../contexts/AuthContext';
import Spinner from '../../components/common/Spinner'; // Importar Spinner

const UserListPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalUsers: 0, limit: 20 });
  const { userProfile } = useAuth(); // Para verificar rol si es necesario, aunque AdminGuard ya lo hace

  const fetchUsers = async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminService.listUsers(page, pagination.limit);
      setUsers(response.data.data || []);
      setPagination(response.data.pagination || { currentPage: 1, totalPages: 1, totalUsers: 0, limit: 20 });
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(err.response?.data?.error || 'No se pudo cargar la lista de usuarios.');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Asegurarse de que solo los admins puedan intentar cargar esto (aunque AdminGuard debería prevenirlo)
    if (userProfile?.user_type === 'admin') {
      fetchUsers(pagination.currentPage);
    } else {
      setError("Acceso no autorizado.");
      setLoading(false);
    }
  }, [userProfile, pagination.currentPage]); // Depender de currentPage para re-fetch al cambiar de página

  if (loading && users.length === 0) { // Mostrar spinner solo si no hay datos y está cargando
    return (
      <div className="container mx-auto p-4 flex justify-center items-center min-h-[300px]">
        <Spinner text="Cargando usuarios..." />
      </div>
    );
  }

  if (error && users.length === 0) { // Mostrar error solo si no hay datos
    return <div className="container mx-auto p-4 text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Lista de Usuarios</h1>
      
      {users.length === 0 ? (
        <p>No se encontraron usuarios.</p>
      ) : (
        <>
          <div className="overflow-x-auto shadow-md rounded-lg">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registrado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map(user => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.display_name || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.user_type === 'admin' ? 'bg-red-100 text-red-800' :
                        user.user_type === 'professional' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {user.user_type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {user.is_active ? (
                        <span className="text-green-600 font-semibold">Sí</span>
                      ) : (
                        <span className="text-red-600 font-semibold">No</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Paginación */}
          <div className="mt-6 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-700">
                Mostrando <span className="font-medium">{(pagination.currentPage - 1) * pagination.limit + 1}</span>
                {' '}a <span className="font-medium">{Math.min(pagination.currentPage * pagination.limit, pagination.totalUsers)}</span>
                {' '}de <span className="font-medium">{pagination.totalUsers}</span> resultados
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => fetchUsers(pagination.currentPage - 1)}
                disabled={pagination.currentPage <= 1 || loading}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
              >
                Anterior
              </button>
              <button
                onClick={() => fetchUsers(pagination.currentPage + 1)}
                disabled={pagination.currentPage >= pagination.totalPages || loading}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
              >
                Siguiente
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UserListPage;

