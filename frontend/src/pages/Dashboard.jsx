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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            ¡Hola, {user?.displayName || user?.email?.split('@')[0]}!
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Bienvenido a tu panel de control de Toklen
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Servicios</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalServices}</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Servicios Activos</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeServices}</p>
              </div>
              <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completados</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completedServices}</p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ganancias</p>
                <p className="text-2xl font-bold text-gray-900">S/. {stats.totalEarnings}</p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Acciones Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => navigate('/request-service')}
              className="bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Solicitar Servicio</span>
            </button>
            
            <button
              onClick={() => navigate('/search-professionals')}
              className="bg-green-600 text-white p-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
            >
              <Search className="h-5 w-5" />
              <span>Buscar Profesionales</span>
            </button>
            
            <button
              onClick={() => navigate('/become-professional')}
              className="bg-purple-600 text-white p-4 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2"
            >
              <User className="h-5 w-5" />
              <span>Ser Profesional</span>
            </button>
          </div>
        </div>

        {/* Services Section */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Mis Servicios</h2>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {[
                { id: 'active', label: 'Activos', count: stats.activeServices },
                { id: 'completed', label: 'Completados', count: stats.completedServices },
                { id: 'cancelled', label: 'Cancelados', count: services.filter(s => s.status === 'cancelled').length }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}
                >
                  <span>{tab.label}</span>
                  <span className="bg-gray-100 text-gray-900 py-0.5 px-2 rounded-full text-xs">
                    {tab.count}
                  </span>
                </button>
              ))}
            </nav>
          </div>

          {/* Services List */}
          <div className="p-6">
            {filteredServices.length === 0 ? (
              <div className="text-center py-8">
                <div className="mx-auto h-12 w-12 text-gray-400">
                  <Calendar className="h-12 w-12" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">
                  No tienes servicios {activeTab === 'active' ? 'activos' : activeTab}
                </h3>
                <p className="mt-2 text-gray-500">
                  {activeTab === 'active' ? 'Solicita un servicio para empezar' : 'Los servicios aparecerán aquí cuando cambien de estado'}
                </p>
                {activeTab === 'active' && (
                  <button
                    onClick={() => navigate('/request-service')}
                    className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Solicitar Servicio
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredServices.map((service) => (
                  <div
                    key={service.id}
                    onClick={() => navigate(`/service/${service.id}`)}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          {getStatusIcon(service.status)}
                          <span className="text-sm font-medium text-gray-900">
                            {getStatusText(service.status)}
                          </span>
                        </div>
                        
                        <h3 className="text-lg font-medium text-gray-900 mb-1">
                          {service.title || service.category}
                        </h3>
                        
                        <p className="text-gray-600 text-sm mb-2">
                          {service.description}
                        </p>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-4 w-4" />
                            <span>{service.location}</span>
                          </div>
                          
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>{new Date(service.createdAt).toLocaleDateString()}</span>
                          </div>
                          
                          {service.price && (
                            <div className="flex items-center space-x-1">
                              <DollarSign className="h-4 w-4" />
                              <span>S/. {service.price}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {service.professional && (
                        <div className="ml-4 text-right">
                          <p className="text-sm font-medium text-gray-900">
                            {service.professional.name}
                          </p>
                          {service.professional.rating && (
                            <div className="flex items-center space-x-1 mt-1">
                              <Star className="h-4 w-4 text-yellow-400 fill-current" />
                              <span className="text-sm text-gray-600">
                                {service.professional.rating}
                              </span>
                            </div>
                          )}
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