import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { professionalsAPI } from '../services/api'
import { SERVICE_CATEGORIES, CATEGORY_LABELS, LIMA_DISTRICTS } from '../utils/constants'
import { formatPrice, formatDistance, getCategoryLabel } from '../utils/helpers'
import useGeolocation from '../hooks/useGeolocation'
import GoogleMap from '../components/maps/GoogleMap'
import LoadingSpinner from '../components/common/LoadingSpinner'

const SearchProfessionals = () => {
  const { location, getCurrentLocation } = useGeolocation()
  const [professionals, setProfessionals] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedProfessional, setSelectedProfessional] = useState(null)
  
  // Filtros
  const [filters, setFilters] = useState({
    category: '',
    district: '',
    minPrice: '',
    maxPrice: '',
    rating: '',
    availability: 'all'
  })
  
  // Vista
  const [viewMode, setViewMode] = useState('grid') // 'grid' o 'map'
  const [mapMarkers, setMapMarkers] = useState([])
  const [mapCenter, setMapCenter] = useState({ lat: -12.0464, lng: -77.0428 })

  // Cargar profesionales al iniciar
  useEffect(() => {
    loadProfessionals()
    getCurrentLocation()
  }, [])

  // Actualizar centro del mapa con la ubicación del usuario
  useEffect(() => {
    if (location) {
      setMapCenter(location)
    }
  }, [location])

  // Actualizar marcadores del mapa
  useEffect(() => {
    const markers = professionals.map(professional => ({
      lat: professional.location?.lat || -12.0464,
      lng: professional.location?.lng || -77.0428,
      title: professional.name,
      color: '#10B981',
      infoWindow: `
        <div class="p-2">
          <h3 class="font-bold">${professional.name}</h3>
          <p class="text-sm text-gray-600">${getCategoryLabel(professional.category)}</p>
          <p class="text-sm">${formatPrice(professional.pricePerHour)}/hora</p>
          <p class="text-xs text-gray-500">${professional.district}</p>
        </div>
      `,
      professional
    }))
    
    setMapMarkers(markers)
  }, [professionals])

  // Cargar profesionales
  const loadProfessionals = async (searchFilters = {}) => {
    setLoading(true)
    setError('')
    
    try {
      const params = {
        ...filters,
        ...searchFilters,
        limit: 20
      }
      
      const response = await professionalsAPI.search(params)
      setProfessionals(response.data || [])
    } catch (error) {
      console.error('Error cargando profesionales:', error)
      setError('Error al cargar profesionales. Intenta nuevamente.')
    } finally {
      setLoading(false)
    }
  }

  // Manejar cambios en filtros
  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Aplicar filtros
  const handleApplyFilters = () => {
    loadProfessionals(filters)
  }

  // Limpiar filtros
  const handleClearFilters = () => {
    setFilters({
      category: '',
      district: '',
      minPrice: '',
      maxPrice: '',
      rating: '',
      availability: 'all'
    })
    loadProfessionals({})
  }

  // Manejar click en marcador del mapa
  const handleMarkerClick = (markerData) => {
    setSelectedProfessional(markerData.professional)
  }

  // Renderizar estrellas de calificación
  const renderStars = (rating) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      )
    }
    
    if (hasHalfStar) {
      stars.push(
        <svg key="half" className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      )
    }
    
    return stars
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Encuentra Profesionales
          </h1>
          <p className="text-gray-600">
            Busca y conecta con profesionales calificados en tu área
          </p>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoría
              </label>
              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todas las categorías</option>
                {Object.entries(SERVICE_CATEGORIES).map(([key, value]) => (
                  <option key={key} value={value}>
                    {CATEGORY_LABELS[value]}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Distrito
              </label>
              <select
                name="district"
                value={filters.district}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todos los distritos</option>
                {LIMA_DISTRICTS.map(district => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Precio por hora
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  name="minPrice"
                  value={filters.minPrice}
                  onChange={handleFilterChange}
                  placeholder="Min"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  name="maxPrice"
                  value={filters.maxPrice}
                  onChange={handleFilterChange}
                  placeholder="Max"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Calificación mínima
              </label>
              <select
                name="rating"
                value={filters.rating}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Cualquier calificación</option>
                <option value="4">4+ estrellas</option>
                <option value="3">3+ estrellas</option>
                <option value="2">2+ estrellas</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 items-center">
            <button
              onClick={handleApplyFilters}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Aplicar Filtros
            </button>
            <button
              onClick={handleClearFilters}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Limpiar Filtros
            </button>
            
            <div className="flex ml-auto">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2 rounded-l-md border ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`px-3 py-2 rounded-r-md border ${viewMode === 'map' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Resultados */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="large" />
          </div>
        ) : (
          <>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {professionals.map((professional) => (
                  <div key={professional.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div className="p-6">
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold">
                            {professional.name?.charAt(0) || 'P'}
                          </span>
                        </div>
                        <div className="ml-4">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {professional.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {getCategoryLabel(professional.category)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center mb-2">
                        <div className="flex items-center">
                          {renderStars(professional.rating || 5)}
                        </div>
                        <span className="ml-2 text-sm text-gray-600">
                          ({professional.reviewCount || 0} reseñas)
                        </span>
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-3">
                        {professional.description || 'Profesional experimentado en su área'}
                      </p>
                      
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-lg font-bold text-blue-600">
                          {formatPrice(professional.pricePerHour || 50)}/hora
                        </span>
                        <span className="text-sm text-gray-500">
                          {professional.district}
                        </span>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Link
                          to={`/professional/${professional.id}`}
                          className="flex-1 bg-blue-600 text-white text-center py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                        >
                          Ver Perfil
                        </Link>
                        <button className="flex-1 border border-blue-600 text-blue-600 py-2 px-4 rounded-md hover:bg-blue-50 transition-colors">
                          Contactar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm">
                <GoogleMap
                  center={mapCenter}
                  zoom={12}
                  markers={mapMarkers}
                  onMarkerClick={handleMarkerClick}
                  className="w-full h-96"
                />
              </div>
            )}
          </>
        )}

        {!loading && professionals.length === 0 && (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No se encontraron profesionales
            </h3>
            <p className="text-gray-500">
              Intenta ajustar los filtros de búsqueda
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default SearchProfessionals