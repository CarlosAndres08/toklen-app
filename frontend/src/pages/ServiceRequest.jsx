import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { servicesAPI } from '../services/api'
import { SERVICE_CATEGORIES, CATEGORY_LABELS, LIMA_DISTRICTS } from '../utils/constants'
import { formatPrice } from '../utils/helpers'
import useGeolocation from '../hooks/useGeolocation'
import GoogleMap from '../components/maps/GoogleMap'
import LoadingSpinner from '../components/common/LoadingSpinner'

const ServiceRequest = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { location, getCurrentLocation, loading: locationLoading } = useGeolocation()
  
  const [formData, setFormData] = useState({
    category: '',
    title: '',
    description: '',
    urgency: 'medium',
    preferredDate: '',
    preferredTime: '',
    address: '',
    district: '',
    location: null,
    budget: '',
    contactPhone: '',
    additionalNotes: ''
  })
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [mapCenter, setMapCenter] = useState({ lat: -12.0464, lng: -77.0428 })
  const [mapMarkers, setMapMarkers] = useState([])

  // Obtener ubicación al cargar
  useEffect(() => {
    getCurrentLocation()
  }, [])

  // Actualizar ubicación en el formulario
  useEffect(() => {
    if (location) {
      setFormData(prev => ({
        ...prev,
        location: { lat: location.lat, lng: location.lng }
      }))
      setMapCenter(location)
      setMapMarkers([{
        lat: location.lat,
        lng: location.lng,
        title: 'Tu ubicación',
        color: '#3B82F6'
      }])
    }
  }, [location])

  // Manejar cambios en los inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Manejar click en el mapa
  const handleMapClick = (position) => {
    setFormData(prev => ({
      ...prev,
      location: position
    }))
    setMapMarkers([{
      lat: position.lat,
      lng: position.lng,
      title: 'Ubicación del servicio',
      color: '#10B981'
    }])
  }

  // Validar formulario
  const validateForm = () => {
    if (!formData.category) {
      setError('Selecciona una categoría de servicio')
      return false
    }
    if (!formData.title.trim()) {
      setError('Ingresa un título para el servicio')
      return false
    }
    if (!formData.description.trim()) {
      setError('Describe el servicio que necesitas')
      return false
    }
    if (!formData.address.trim()) {
      setError('Ingresa la dirección del servicio')
      return false
    }
    if (!formData.district) {
      setError('Selecciona un distrito')
      return false
    }
    if (!formData.contactPhone.trim()) {
      setError('Ingresa tu número de teléfono')
      return false
    }
    if (!formData.location) {
      setError('Selecciona la ubicación en el mapa')
      return false
    }
    return true
  }

  // Enviar solicitud
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setLoading(true)
    setError('')

    try {
      const requestData = {
        ...formData,
        clientId: user.uid,
        status: 'pending',
        createdAt: new Date().toISOString()
      }

      const response = await servicesAPI.create(requestData)
      
      if (response.data) {
        setSuccess(true)
        setTimeout(() => {
          navigate('/dashboard')
        }, 2000)
      }
    } catch (error) {
      console.error('Error creando solicitud:', error)
      setError('Error al crear la solicitud. Intenta nuevamente.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Solicitud Enviada!</h2>
          <p className="text-gray-600 mb-4">
            Tu solicitud ha sido enviada exitosamente. Los profesionales cercanos podrán verla y contactarte.
          </p>
          <p className="text-sm text-gray-500">
            Redirigiendo al panel de control...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Solicitar Servicio</h1>
          
          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Categoría */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoría del Servicio *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Selecciona una categoría</option>
                  {Object.entries(SERVICE_CATEGORIES).map(([key, value]) => (
                    <option key={key} value={value}>
                      {CATEGORY_LABELS[value]}
                    </option>
                  ))}
                </select>
              </div>

              {/* Urgencia */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Urgencia
                </label>
                <select
                  name="urgency"
                  value={formData.urgency}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="low">Baja - Puedo esperar</option>
                  <option value="medium">Media - En unos días</option>
                  <option value="high">Alta - Lo antes posible</option>
                  <option value="emergency">Emergencia - Inmediato</option>
                </select>
              </div>
            </div>

            {/* Título */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título del Servicio *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: Reparación de tubería en la cocina"
                required
              />
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción del Servicio *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe detalladamente el servicio que necesitas..."
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Fecha preferida */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha Preferida
                </label>
                <input
                  type="date"
                  name="preferredDate"
                  value={formData.preferredDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              {/* Hora preferida */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hora Preferida
                </label>
                <input
                  type="time"
                  name="preferredTime"
                  value={formData.preferredTime}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Dirección */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dirección Completa *
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: Av. Larco 123, Miraflores"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Distrito */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Distrito *
                </label>
                <select
                  name="district"
                  value={formData.district}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Selecciona un distrito</option>
                  {LIMA_DISTRICTS.map(district => (
                    <option key={district} value={district}>
                      {district}
                    </option>
                  ))}
                </select>
              </div>

              {/* Presupuesto */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Presupuesto Aproximado (S/)
                </label>
                <input
                  type="number"
                  name="budget"
                  value={formData.budget}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: 100"
                  min="0"
                />
              </div>
            </div>

            {/* Teléfono */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Número de Teléfono *
              </label>
              <input
                type="tel"
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: 999123456"
                required
              />
            </div>

            {/* Ubicación en el mapa */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ubicación en el Mapa *
              </label>
              <p className="text-sm text-gray-500 mb-3">
                Haz clic en el mapa para marcar la ubicación exacta del servicio
              </p>
              <div className="border border-gray-300 rounded-lg overflow-hidden">
                <GoogleMap
                  center={mapCenter}
                  zoom={15}
                  markers={mapMarkers}
                  onMapClick={handleMapClick}
                  className="w-full h-64"
                />
              </div>
              {locationLoading && (
                <p className="text-sm text-blue-600 mt-2">Obteniendo tu ubicación...</p>
              )}
            </div>

            {/* Notas adicionales */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notas Adicionales
              </label>
              <textarea
                name="additionalNotes"
                value={formData.additionalNotes}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Cualquier información adicional que pueda ser útil..."
              />
            </div>

            {/* Botones */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {loading ? (
                  <>
                    <LoadingSpinner size="small" />
                    <span className="ml-2">Enviando...</span>
                  </>
                ) : (
                  'Enviar Solicitud'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ServiceRequest