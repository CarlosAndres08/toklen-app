import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api'; // CAMBIO AQUI: Importar apiService
import ServiceCard from '../components/common/ServiceCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const { currentUser, userProfile, loading: authLoading } = useAuth();
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServicesAndCategories = async () => {
      try {
        // Fetch Services
        const servicesResponse = await apiService.getServices(); // CAMBIO AQUI: Usar apiService
        setServices(servicesResponse.services);
        setLoadingServices(false);

        // Fetch Categories
        const categoriesResponse = await apiService.getCategories(); // CAMBIO AQUI: Usar apiService
        setCategories(categoriesResponse.categories);
        setLoadingCategories(false);

      } catch (err) {
        console.error('Error fetching data for dashboard:', err);
        setError('No se pudieron cargar los datos del dashboard.');
        toast.error('Error al cargar servicios y categorías.');
        setLoadingServices(false);
        setLoadingCategories(false);
      }
    };

    if (!authLoading) {
      fetchServicesAndCategories();
    }
  }, [authLoading]);

  if (authLoading || loadingServices || loadingCategories) {
    return <GlobalSpinner />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error al cargar el Dashboard</h2>
          <p className="text-gray-700">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Bienvenido, {userProfile?.first_name || currentUser?.displayName || 'Usuario'}!</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Servicios Destacados</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.length > 0 ? (
            services.map(service => (
              <ServiceCard key={service.id} service={service} />
            ))
          ) : (
            <p className="text-gray-600">No hay servicios disponibles en este momento.</p>
          )}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Explorar Categorías</h2>
        <div className="flex flex-wrap gap-4">
          {categories.length > 0 ? (
            categories.map(category => (
              <span
                key={category.id}
                className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium"
              >
                {category.name}
              </span>
            ))
          ) : (
            <p className="text-gray-600">No hay categorías disponibles.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
