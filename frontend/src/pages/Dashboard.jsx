import React, { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import { 
  MapPin, 
  Clock, 
  Star, 
  Plus, 
  Search, 
  Filter,
  Calendar,
  DollarSign,
  User,
  CheckCircle,
  AlertCircle,
  XCircle
} from 'lucide-react'
import { serviceService } from '../services/api'

const Dashboard = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('active')
  const [stats, setStats] = useState({
    totalServices: 0,
    activeServices: 0,
    completedServices: 0,
    totalEarnings: 0
  })

  useEffect(() => {
    fetchUserServices()
  }, [])

  const fetchUserServices = async () => {
    try {
      const response = await serviceService.getUserServices()
      setServices(response.data)
      calculateStats(response.data)
    } catch (error) {
      console.error('Error fetching services:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (servicesData) => {
    const total = servicesData.length
    const active = servicesData.filter(s => s.status === 'active' || s.status === 'in_progress').length
    const completed = servicesData.filter(s => s.status === 'completed').length
    const earnings = servicesData
      .filter(s => s.status === 'completed')
      .reduce((sum, s) => sum + (s.price || 0), 0)

    setStats({
      totalServices: total,
      activeServices: active,
      completedServices: completed,
      totalEarnings: earnings
    })
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case 'active':
      case 'in_progress':
        return <Clock className="h-4 w-4 text-blue-500" />
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusText = (status) => {
    const statusMap = {
      pending: 'Pendiente',
      active: 'Activo',
      in_progress: 'En Progreso',
      completed: 'Completado',
      cancelled: 'Cancelado'
    }
    return statusMap[status] || status
  }

  const filteredServices = services.filter(service => {
    if (activeTab === 'active') {
      return service.status === 'active' || service.status === 'in_progress' || service.status === 'pending'
    } else if (activeTab === 'completed') {
      return service.status === 'completed'
    } else if (activeTab === 'cancelled') {
      return service.status === 'cancelled'
    }
    return true
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="text-center">
          {/* Reemplazar con componente LoadingSpinner si se prefiere */}
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-neutral">Cargando dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-base-200"> {/* Fondo Gris Claro */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header de la página */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-secondary">
            ¡Hola, {user?.displayName?.split(' ')[0] || user?.email?.split('@')[0]}!
          </h1>
          <p className="mt-1 text-lg text-neutral">
            Bienvenido a tu panel de control de Toklen.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {/* Card Total Servicios */}
          <div className="card bg-base-100 shadow-lg p-6 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral">Total Servicios</p>
                <p className="text-3xl font-bold text-secondary">{stats.totalServices}</p>
              </div>
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
            </div>
          </div>

          {/* Card Servicios Activos */}
          <div className="card bg-base-100 shadow-lg p-6 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral">Servicios Activos</p>
                <p className="text-3xl font-bold text-secondary">{stats.activeServices}</p>
              </div>
              <div className="h-12 w-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <Clock className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </div>

          {/* Card Completados */}
          <div className="card bg-base-100 shadow-lg p-6 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral">Completados</p>
                <p className="text-3xl font-bold text-secondary">{stats.completedServices}</p>
              </div>
              <div className="h-12 w-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </div>

          {/* Card Ganancias */}
          <div className="card bg-base-100 shadow-lg p-6 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral">Ganancias Estimadas</p>
                <p className="text-3xl font-bold text-secondary">S/. {stats.totalEarnings.toFixed(2)}</p>
              </div>
              <div className="h-12 w-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-secondary mb-4">Acciones Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => navigate('/request-service')} // Asumiendo esta ruta existe
              className="btn btn-primary p-4 text-base flex items-center justify-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Solicitar Nuevo Servicio</span>
            </button>
            
            <button
              onClick={() => navigate('/search-professionals')}
              className="btn btn-secondary p-4 text-base flex items-center justify-center space-x-2"
            >
              <Search className="h-5 w-5" />
              <span>Buscar Profesionales</span>
            </button>
            
            <button
              onClick={() => navigate('/become-professional')} // Asumiendo esta ruta existe
              className="btn btn-outline-primary p-4 text-base flex items-center justify-center space-x-2" // Cambiado a outline
            >
              <User className="h-5 w-5" />
              <span>Ser Profesional</span>
            </button>
          </div>
        </div>

        {/* Services Section */}
        <div className="card bg-base-100 shadow-lg rounded-xl overflow-hidden">
          <div className="p-6 border-b border-neutral/20">
            <h2 className="text-xl font-semibold text-secondary">Mis Solicitudes de Servicio</h2>
          </div>

          {/* Tabs */}
          <div className="border-b border-neutral/20">
            <nav className="flex space-x-1 sm:space-x-4 px-3 sm:px-6 -mb-px" aria-label="Tabs"> {/* -mb-px para que el borde inferior de la tab activa se una con el borde de la sección */}
              {[
                { id: 'active', label: 'Activos', count: stats.activeServices },
                { id: 'completed', label: 'Completados', count: stats.completedServices },
                { id: 'cancelled', label: 'Cancelados', count: services.filter(s => s.status === 'cancelled').length }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`whitespace-nowrap py-4 px-2 sm:px-4 border-b-2 font-medium text-sm flex items-center space-x-2 focus:outline-none transition-colors duration-150
                    ${
                      activeTab === tab.id
                        ? 'border-primary text-primary'
                        : 'border-transparent text-neutral hover:text-secondary hover:border-neutral/40'
                    }`}
                >
                  <span>{tab.label}</span>
                  <span className={`py-0.5 px-2 rounded-full text-xs font-semibold ${activeTab === tab.id ? 'bg-primary/10 text-primary' : 'bg-neutral/10 text-neutral/80'}`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </nav>
          </div>

          {/* Services List */}
          <div className="p-4 sm:p-6">
            {filteredServices.length === 0 ? (
              <div className="text-center py-12">
                <div className="mx-auto h-16 w-16 text-neutral/40">
                  <Calendar className="h-full w-full" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-secondary">
                  No tienes servicios {activeTab === 'active' ? 'activos' : (activeTab === 'completed' ? 'completados' : 'cancelados')}
                </h3>
                <p className="mt-2 text-neutral text-sm">
                  {activeTab === 'active' ? 'Solicita un servicio para empezar.' : 'Los servicios aparecerán aquí cuando cambien de estado.'}
                </p>
                {activeTab === 'active' && (
                  <button
                    onClick={() => navigate('/request-service')} // Asumiendo ruta
                    className="btn btn-primary mt-6 text-sm"
                  >
                    Solicitar Servicio Ahora
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredServices.map((service) => (
                  <div
                    key={service.id}
                    onClick={() => navigate(`/service/${service.id}`)} // Asumiendo ruta
                    className="border border-neutral/20 rounded-lg p-4 hover:bg-base-200/30 hover:shadow-md cursor-pointer transition-all duration-150"
                  >
                    <div className="flex flex-col sm:flex-row items-start justify-between">
                      <div className="flex-1 mb-3 sm:mb-0">
                        <div className="flex items-center space-x-2 mb-2">
                          {getStatusIcon(service.status)}
                          <span className="text-xs font-semibold uppercase tracking-wider text-secondary">
                            {getStatusText(service.status)}
                          </span>
                        </div>
                        
                        <h3 className="text-lg font-semibold text-secondary hover:text-primary transition-colors mb-1">
                          {service.title || getCategoryLabel(service.category) || 'Servicio Detallado'}
                        </h3>
                        
                        <p className="text-neutral text-sm mb-2 line-clamp-2">
                          {service.description || 'Sin descripción detallada.'}
                        </p>
                        
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-neutral/80">
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-3.5 w-3.5" />
                            <span>{service.location || 'Ubicación no especificada'}</span>
                          </div>
                          
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3.5 w-3.5" />
                            <span>{new Date(service.createdAt).toLocaleDateString()}</span>
                          </div>
                          
                          {service.price && (
                            <div className="flex items-center space-x-1">
                              <DollarSign className="h-3.5 w-3.5" />
                              <span className="font-medium">S/. {service.price.toFixed(2)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {service.professional && (
                        <div className="ml-0 sm:ml-4 text-left sm:text-right flex-shrink-0">
                          <p className="text-sm font-semibold text-secondary">
                            {service.professional.name}
                          </p>
                          {service.professional.rating && (
                            <div className="flex items-center space-x-1 mt-1 justify-start sm:justify-end">
                              <Star className="h-4 w-4 text-yellow-400 fill-current" />
                              <span className="text-xs text-neutral">
                                {service.professional.rating.toFixed(1)}
                              </span>
                            </div>
                          )}
                          <Link 
                            to={`/professional/${service.professional.id}`} // Asumiendo ruta
                            className="text-xs text-primary hover:underline mt-1 inline-block"
                          >
                            Ver Profesional
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard