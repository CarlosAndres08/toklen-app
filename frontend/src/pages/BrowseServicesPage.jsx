import React, { useState, useEffect } from 'react';
import { serviceService } from '../services/api'; // API para servicios
import { SERVICE_CATEGORIES, CATEGORY_LABELS } from '../utils/constants';
import ServiceCard from '../components/common/ServiceCard';
import Spinner from '../components/common/Spinner';
import { toast } from 'react-toastify';

const BrowseServicesPage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [filters, setFilters] = useState({
    category: '',
    search: '',
    // TODO: Añadir más filtros si es necesario (precio, ubicación, etc.)
  });
  
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalServices: 0,
    limit: 12, // 12 servicios por página
  });

  const fetchServices = async (page = 1, currentFilters = filters) => {
    setLoading(true);
    setError('');
    try {
      const params = {
        page,
        limit: pagination.limit,
        category: currentFilters.category || undefined, // Enviar undefined si está vacío
        search: currentFilters.search || undefined,   // Enviar undefined si está vacío
      };
      const response = await serviceService.listPublic(params);
      setServices(response.data.data || []);
      setPagination(response.data.pagination || { currentPage:1, totalPages:1, totalServices:0, limit: 12 });
    } catch (err) {
      console.error('Error cargando servicios:', err);
      const errorMessage = err.response?.data?.error || 'No se pudo cargar la lista de servicios.';
      setError(errorMessage);
      toast.error(errorMessage);
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices(1, filters); // Carga inicial y cuando cambian los filtros principales
  }, [filters.category, filters.search]); // No incluir pagination.limit aquí para evitar bucles si se cambia

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, currentPage: 1 })); // Resetear a página 1 en nueva búsqueda
    fetchServices(1, filters);
  };
  
  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, currentPage: newPage }));
    fetchServices(newPage, filters);
  };

  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-bold text-secondary mb-2">
            Explorar Servicios
          </h1>
          <p className="text-neutral text-lg">
            Encuentra los servicios ofrecidos por nuestros profesionales.
          </p>
        </div>

        {/* Filtros */}
        <div className="bg-base-100 rounded-xl shadow-lg p-6 mb-8">
          <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-secondary mb-1">
                Buscar por palabra clave
              </label>
              <input
                type="text"
                id="search"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Ej: plomería, reparación, electricista..."
                className="w-full px-3 py-2.5 border border-neutral rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-150 bg-base-100"
              />
            </div>
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-secondary mb-1">
                Categoría
              </label>
              <select
                id="category"
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="w-full px-3 py-2.5 border border-neutral rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-150 bg-base-100"
              >
                <option value="">Todas las categorías</option>
                {Object.entries(SERVICE_CATEGORIES).map(([key, value]) => (
                  <option key={key} value={value}>
                    {CATEGORY_LABELS[value]}
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-start-3 md:self-end">
              <button
                type="submit"
                className="btn btn-primary w-full md:w-auto py-2.5 px-6 text-sm"
                disabled={loading}
              >
                {loading ? <Spinner size="sm" /> : 'Buscar Servicios'}
              </button>
            </div>
          </form>
        </div>

        {/* Resultados */}
        {error && !loading && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md mb-6" role="alert">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        )}

        {loading && services.length === 0 ? (
          <div className="flex justify-center py-12">
            <Spinner size="lg" text="Buscando servicios..." />
          </div>
        ) : !loading && services.length === 0 && !error ? (
          <div className="text-center py-16">
             <svg className="w-20 h-20 text-neutral/50 mx-auto mb-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 10l4.545-4.545M10 10l-4.545 4.545" />
            </svg>
            <h3 className="text-xl font-semibold text-secondary mb-2">
              No se encontraron servicios
            </h3>
            <p className="text-neutral">
              Intenta ajustar los filtros de búsqueda.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        )}

        {/* Paginación */}
        {!loading && services.length > 0 && pagination.totalPages > 1 && (
          <div className="mt-10 flex justify-center items-center space-x-2">
            <button
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage <= 1}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
            >
              Anterior
            </button>
            {/* Podríamos renderizar algunos números de página aquí */}
            <span className="text-sm text-gray-700">
              Página {pagination.currentPage} de {pagination.totalPages}
            </span>
            <button
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage >= pagination.totalPages}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowseServicesPage;
