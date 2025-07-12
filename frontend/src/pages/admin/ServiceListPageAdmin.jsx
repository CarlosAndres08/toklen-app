import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import { useAuth } from '../../contexts/AuthContext';
import Spinner from '../../components/common/Spinner';
import { toast } from 'react-toastify'; // Importar toast

const ServiceListPageAdmin = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalServices: 0, limit: 10 });
  const [filterStatus, setFilterStatus] = useState('pending'); // Por defecto mostrar los pendientes de aprobación
  const { userProfile } = useAuth();

  const fetchServices = async (page = 1, status = filterStatus) => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminService.listServices({ page, limit: pagination.limit, status });
      setServices(response.data.data || []);
      setPagination(response.data.pagination || { currentPage: 1, totalPages: 1, totalServices: 0, limit: 10 });
    } catch (err) {
      console.error("Error fetching services:", err);
      setError(err.response?.data?.error || 'No se pudo cargar la lista de servicios.');
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userProfile?.user_type === 'admin') {
      fetchServices(pagination.currentPage, filterStatus);
    } else {
      setError("Acceso no autorizado.");
      setLoading(false);
    }
  }, [userProfile, pagination.currentPage, filterStatus]);

  const handleApprove = async (serviceId) => {
    if (!confirm('¿Estás seguro de que deseas aprobar este servicio?')) return;
    try {
      await adminService.approveService(serviceId);
      fetchServices(pagination.currentPage, filterStatus); 
      toast.success('Servicio aprobado con éxito.');
    } catch (err) {
      console.error("Error approving service:", err);
      toast.error(err.response?.data?.error || 'Error al aprobar el servicio.');
    }
  };

  const handleReject = async (serviceId) => {
    if (!confirm('¿Estás seguro de que deseas rechazar este servicio?')) return;
    try {
      await adminService.rejectService(serviceId);
      fetchServices(pagination.currentPage, filterStatus);
      toast.success('Servicio rechazado con éxito.');
    } catch (err) {
      console.error("Error rejecting service:", err);
      toast.error(err.response?.data?.error || 'Error al rechazar el servicio.');
    }
  };
  
  const handleDelete = async (serviceId) => {
    if (!confirm('¿Estás seguro de que deseas ELIMINAR PERMANENTEMENTE este servicio? Esta acción no se puede deshacer.')) return;
    try {
      await adminService.deleteService(serviceId);
      fetchServices(pagination.currentPage, filterStatus);
      toast.success('Servicio eliminado con éxito.');
    } catch (err) {
      console.error("Error deleting service:", err);
      toast.error(err.response?.data?.error || 'Error al eliminar el servicio.');
    }
  };

  if (loading && services.length === 0) {
    return (
      <div className="container mx-auto p-4 flex justify-center items-center min-h-[300px]">
        <Spinner text="Cargando servicios..." />
      </div>
    );
  }

  if (error && services.length === 0) { 
    return <div className="container mx-auto p-4 text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Gestionar Servicios</h1>
      
      <div className="mb-4">
        <label htmlFor="statusFilter" className="mr-2 font-medium">Filtrar por estado:</label>
        <select 
          id="statusFilter"
          value={filterStatus} 
          onChange={(e) => {
            setFilterStatus(e.target.value);
            setPagination(prev => ({ ...prev, currentPage: 1 })); 
          }}
          className="p-2 border rounded-md shadow-sm"
        >
          <option value="pending">Pendientes</option>
          <option value="approved">Aprobados</option>
          <option value="rejected">Rechazados</option>
          <option value="completed">Completados</option>
          <option value="cancelled">Cancelados</option>
          <option value="">Todos</option> 
        </select>
      </div>

      {loading && <Spinner className="my-4" />} {/* Mostrar spinner pequeño si ya hay datos pero se está actualizando */}
      {error && !loading && <p className="text-center my-4 text-red-500">Error al actualizar: {error}</p>}

      {services.length === 0 && !loading ? (
        <p>No se encontraron servicios con el filtro actual.</p>
      ) : (
        <>
          <div className="overflow-x-auto shadow-md rounded-lg">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profesional</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Creado</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {services.map(service => (
                  <tr key={service.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-800 max-w-xs truncate" title={service.title}>{service.title}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700" title={service.professional_email}>{service.professional_name || 'N/A'}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{service.category}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        service.status === 'approved' ? 'bg-green-100 text-green-800' :
                        service.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        service.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        service.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                        service.status === 'cancelled' ? 'bg-gray-100 text-gray-800' :
                        'bg-gray-200 text-gray-700' // Default
                      }`}>
                        {service.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                      {new Date(service.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                      {service.status === 'pending' && (
                        <>
                          <button 
                            onClick={() => handleApprove(service.id)}
                            className="text-green-600 hover:text-green-900 mr-3 transition-colors duration-150"
                            title="Aprobar Servicio"
                          >
                            Aprobar
                          </button>
                          <button 
                            onClick={() => handleReject(service.id)}
                            className="text-red-600 hover:text-red-900 mr-3 transition-colors duration-150"
                            title="Rechazar Servicio"
                          >
                            Rechazar
                          </button>
                        </>
                      )}
                       <button 
                        onClick={() => handleDelete(service.id)}
                        className="text-gray-500 hover:text-red-700 transition-colors duration-150"
                        title="Eliminar Servicio Permanentemente"
                      >
                        Eliminar
                      </button>
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
                Mostrando <span className="font-medium">{Math.min((pagination.currentPage - 1) * pagination.limit + 1, pagination.totalServices)}</span>
                {' '}a <span className="font-medium">{Math.min(pagination.currentPage * pagination.limit, pagination.totalServices)}</span>
                {' '}de <span className="font-medium">{pagination.totalServices}</span> resultados
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => fetchServices(pagination.currentPage - 1)}
                disabled={pagination.currentPage <= 1 || loading}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
              >
                Anterior
              </button>
              <button
                onClick={() => fetchServices(pagination.currentPage + 1)}
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

export default ServiceListPageAdmin;

