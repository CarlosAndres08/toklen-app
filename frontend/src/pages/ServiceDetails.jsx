import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { servicesAPI } from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import { formatPrice, formatDateTime, getCategoryLabel, getStatusLabel } from '../utils/helpers'
import { SERVICE_STATUSES, STATUS_COLORS } from '../utils/constants'
import GoogleMap from '../components/maps/GoogleMap'
import LoadingSpinner from '../components/common/LoadingSpinner'

const ServiceDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, userProfile } = useAuth()
  
  const [service, setService] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updating, setUpdating] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)

  // Cargar detalles del servicio
  useEffect(() => {
    loadServiceDetails()
  }, [id])

  const loadServiceDetails = async () => {
    try {
      const response = await servicesAPI.getById(id)
      setService(response.data)
    } catch (error) {
      console.error('Error cargando servicio:', error)
      setError('Error al cargar los detalles del servicio')
    } finally {
      setLoading(false)
    }
  }

  // Actualizar estado del servicio
  const updateServiceStatus = async (newStatus) => {
    setUpdating(true)
    try {
      await servicesAPI.updateStatus(id, newStatus)
      setService(prev => ({ ...prev, status: newStatus }))
    } catch (error) {
      console.error('Error actualizando estado:', error)
      setError('Error al actualizar el estado del servicio')
    } finally {
      setUpdating(false)
    }
  }

  // Cancelar servicio
  const cancelService = async () => {
    setUpdating(true)
    try {
      await servicesAPI.cancel(id)
      setShowCancelModal(false)
      navigate('/dashboard')
    } catch (error) {
      console.error('Error cancelando servicio:', error)
      setError('Error al cancelar el servicio')
    } finally {
      setUpdating(false)
    }
  }

  // Verificar si el usuario puede realizar acciones
  const canUpdateStatus = () => {
    if (!service || !userProfile) return false
    
    // El profesional asignado puede actualizar el estado
    if (userProfile.userType === 'professional' && service.professionalId === user.uid) {
      return true
    }
    
    // El admin puede actualizar cualquier servicio
    if (userProfile.userType === 'admin') {
      return true
    }
    
    return false
  }

  const canCancelService = () => {
    if (!service || !userProfile) return false
    
    // El cliente puede cancelar si el servicio no está en progreso o completado
    if (service.clientId === user.uid && !['in_progress', 'completed'].includes(service.status)) {
      return true
    }
    
    return false
  }

  // Obtener acciones disponibles según el estado
  const getAvailableActions = () => {
    if (!canUpdateStatus()) return []
    
    const actions = []
    
    switch (service.status) {
      case SERVICE_STATUSES.PENDING:
        actions.push({ 
          label: 'Confirmar', 
          status: SERVICE_STATUSES.CONFIRMED, 
          color: 'bg-blue-600 hover:bg-blue-700' 
        })
        break
      case SERVICE_STATUSES.CONFIRMED:
        actions.push({ 
          label: 'Iniciar Servicio', 
          status: SERVICE_STATUSES.IN_PROGRESS, 
          color: 'bg-purple-600 hover:bg-purple-700' 
        })
        break
      case SERVICE_STATUSES.IN_PROGRESS:
        actions.push({ 
          label: 'Completar Servicio', 
          status: SERVICE_STATUSES.COMPLETED, 
          color: 'bg-green-600 hover:bg-green-700' 
        })
        break
    }
    
    return actions
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  if (error || !service) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Error al cargar el servicio
          </h2>
          <p className="text-gray-600 mb-6">{error || 'Servicio no encontrado'}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Volver al Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md">
          {/* Header */}
          <div className="border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {service.title}
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  Servicio #{service.id}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${STATUS_COLORS[service.status]}`}>
                  {getStatusLabel(service.status)}
                </span>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Información básica */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Información del Servicio
                </h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-gray-500">Categoría:</span>
                    <p className="font-medium">{getCategoryLabel(service.category)}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Urgencia:</span>
                    <p className="font-medium capitalize">{service.urgency}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Fecha solicitada:</span>
                    <p className="font-medium">
                      {service.preferredDate ? formatDateTime(service.preferredDate) : 'Flexible'}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Presupuesto:</span>
                    <p className="font-medium">
                      {service.budget ? formatPrice(service.budget) : 'Por definir'}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Información de Contacto
                </h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-gray-500">Cliente:</span>
                    <p className="font-medium">{service.clientName || 'Usuario'}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Teléfono:</span>
                    <p className="font-medium">{service.contactPhone}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Dirección:</span>
                    <p className="font-medium">{service.address}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Distrito:</span>
                    <p className="font-medium">{service.district}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Descripción */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Descripción
              </h3>
              <p className="text-gray-700 whitespace-pre-line">
                {service.description}
              </p>
            </div>

            {/* Notas adicionales */}
            {service.additionalNotes && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Notas Adicionales
                </h3>
                <p className="text-gray-700 whitespace-pre-line">
                  {service.additionalNotes}
                </p>
              </div>
            )}

            {/* Mapa */}
            {service.location && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Ubicación
                </h3>
                <div className="border border-gray-300 rounded-lg overflow-hidden">
                  <GoogleMap
                    center={service.location}
                    zoom={15}
                    markers={[{
                      lat: service.location.lat,
                      lng: service.location.lng,
                      title: service.title,
                      color: '#3B82F6'
                    }]}
                    className="w-full h-64"
                  />
                </div>
              </div>
            )}

            {/* Acciones */}
            <div className="flex flex-wrap gap-4 pt-6 border-t border-gray-200">
              {getAvailableActions().map((action, index) => (
                <button
                  key={index}
                  onClick={() => updateServiceStatus(action.status)}
                  disabled={updating}
                  className={`px-4 py-2 text-white rounded-md ${action.color} disabled:opacity-50 disabled:cursor-not-allowed flex items-center`}
                >
                  {updating ? (
                    <LoadingSpinner size="small" />
                  ) : (
                    action.label
                  )}
                </button>
              ))}

              {canCancelService() && (
                <button
                  onClick={() => setShowCancelModal(true)}
                  className="px-4 py-2 border border-red-600 text-red-600 rounded-md hover:bg-red-50 transition-colors"
                >
                  Cancelar Servicio
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de cancelación */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Confirmar Cancelación
            </h3>
            <p className="text-gray-600 mb-6">
              ¿Estás seguro de que deseas cancelar este servicio? Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cerrar
              </button>
              <button
                onClick={cancelService}
                disabled={updating}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {updating ? (
                  <LoadingSpinner size="small" />
                ) : (
                  'Cancelar Servicio'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ServiceDetails