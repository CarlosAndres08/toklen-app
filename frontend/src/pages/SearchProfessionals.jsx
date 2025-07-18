import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { apiService } from '../services/api' // Importar apiService
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
      
      const response = await apiService.searchProfessionals(params) // Usar apiService.searchProfessionals()
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
    <div className="min-h-screen bg-base-200"> {/* Fondo Gris Claro */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header de la página */}
        <div className="mb-8 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-bold text-secondary mb-2">
            Encuentra Profesionales
          </h1>
          <p className="text-neutral text-lg">
            Busca y conecta con profesionales calificados en tu área.
          </p>
        </div>

        {/* Filtros */}
        <div className="bg-base-100 rounded-xl shadow-lg p-6 mb-8"> {/* Sombra y bordes más pronunciados */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-4 mb-6">
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

            <div>
              <label htmlFor="district" className="block text-sm font-medium text-secondary mb-1">
                Distrito
              </label>
              <select
                id="district"
                name="district"
                value={filters.district}
                onChange={handleFilterChange}
                className="w-full px-3 py-2.5 border border-neutral rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-150 bg-base-100"
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
              <label className="block text-sm font-medium text-secondary mb-1">
                Precio por hora (S/.)
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  name="minPrice"
                  value={filters.minPrice}
                  onChange={handleFilterChange}
                  placeholder="Min"
                  className="w-full px-3 py-2.5 border border-neutral rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-150 bg-base-100"
                />
                <input
                  type="number"
                  name="maxPrice"
                  value={filters.maxPrice}
                  onChange={handleFilterChange}
                  placeholder="Max"
                  className="w-full px-3 py-2.5 border border-neutral rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-150 bg-base-100"
                />
              </div>
            </div>

            <div>
              <label htmlFor="rating" className="block text-sm font-medium text-secondary mb-1">
                Calificación mínima
              </label>
              <select
                id="rating"
                name="rating"
                value={filters.rating}
                onChange={handleFilterChange}
                className="w-full px-3 py-2.5 border border-neutral rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-150 bg-base-100"
              >
                <option value="">Cualquiera</option>
                <option value="5">5 estrellas</option>
                <option value="4">4+ estrellas</option>
                <option value="3">3+ estrellas</option>
                <option value="2">2+ estrellas</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex gap-3">
              <button
                onClick={handleApplyFilters}
                className="btn btn-primary py-2.5 px-6 text-sm" // Usando clases globales
              >
                Aplicar Filtros
              </button>
              <button
                onClick={handleClearFilters}
                className="btn btn-outline-secondary py-2.5 px-6 text-sm" // Usando clases globales
              >
                Limpiar Filtros
              </button>
            </div>
            
            <div className="flex self-start sm:self-center">
              <button
                onClick={() => setViewMode('grid')}
                title="Vista de Cuadrícula"
                className={`p-2.5 rounded-l-lg border border-neutral/50 transition-colors duration-150 ${viewMode === 'grid' ? 'bg-primary text-white' : 'bg-base-100 text-secondary hover:bg-neutral/10'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('map')}
                title="Vista de Mapa"
                className={`p-2.5 rounded-r-lg border border-l-0 border-neutral/50 transition-colors duration-150 ${viewMode === 'map' ? 'bg-primary text-white' : 'bg-base-100 text-secondary hover:bg-neutral/10'}`}
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
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md mb-6" role="alert">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="large" color="text-primary" />
          </div>
        ) : (
          <>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {professionals.map((professional) => (
                  // Idealmente, esto sería un componente <ProfessionalCard professional={professional} />
                  <div key={professional.id} className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
                    <div className="p-5 flex-grow">
                      <div className="flex items-start mb-4">
                        <div className="w-14 h-14 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xl font-bold">
                          {professional.name?.charAt(0)?.toUpperCase() || 'P'}
                        </div>
                        <div className="ml-4 flex-1">
                          <h3 className="text-lg font-semibold text-secondary leading-tight">
                            {professional.name}
                          </h3>
                          <p className="text-sm text-primary font-medium">
                            {getCategoryLabel(professional.category)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center mb-3">
                        <div className="flex items-center text-yellow-400">
                          {renderStars(professional.rating || 0)}
                        </div>
                        <span className="ml-2 text-xs text-neutral">
                          ({professional.reviewCount || 0} {professional.reviewCount === 1 ? 'reseña' : 'reseñas'})
                        </span>
                      </div>
                      
                      <p className="text-neutral text-sm mb-3 line-clamp-3 min-h-[3.75rem]"> {/* min-h para altura consistente */}
                        {professional.description || 'Profesional experimentado listo para ayudarte.'}
                      </p>
                      
                      <div className="flex justify-between items-center mb-1 text-sm">
                        <span className="font-semibold text-primary text-lg">
                          {formatPrice(professional.pricePerHour || 0)}/hr
                        </span>
                        <span className="text-neutral">
                          {professional.district || 'Lima'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-5 border-t border-neutral/10 mt-auto"> {/* mt-auto para empujar al fondo */}
                      <div className="flex space-x-3">
                        <Link
                          to={`/professional/${professional.id}`} // Asumiendo que la ruta es /professional/:id
                          className="btn btn-primary flex-1 text-sm py-2.5"
                        >
                          Ver Perfil
                        </Link>
                        <button className="btn btn-outline-secondary flex-1 text-sm py-2.5">
                          Contactar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-base-100 rounded-xl shadow-lg overflow-hidden">
                <GoogleMap
                  center={mapCenter}
                  zoom={12}
                  markers={mapMarkers}
                  onMarkerClick={handleMarkerClick}
                  className="w-full h-[500px] md:h-[600px]" // Altura aumentada
                />
              </div>
            )}
          </>
        )}

        {!loading && professionals.length === 0 && !error && (
          <div className="text-center py-16">
            <svg className="w-20 h-20 text-neutral/50 mx-auto mb-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 10l4.545-4.545M10 10l-4.545 4.545" />
            </svg>
            <h3 className="text-xl font-semibold text-secondary mb-2">
              No se encontraron profesionales
            </h3>
            <p className="text-neutral">
              Intenta ajustar los filtros de búsqueda o ampliar tu área.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default SearchProfessionals