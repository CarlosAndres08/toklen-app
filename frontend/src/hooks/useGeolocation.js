import { useState, useEffect } from 'react'

// Hook personalizado para manejar geolocalización
const useGeolocation = () => {
  const [location, setLocation] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  // Obtener ubicación actual
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocalización no es soportada por este navegador')
      return
    }

    setLoading(true)
    setError(null)

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000 // 5 minutos
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy
        })
        setLoading(false)
      },
      (error) => {
        let errorMessage = 'Error obteniendo ubicación'
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Permiso de ubicación denegado'
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Información de ubicación no disponible'
            break
          case error.TIMEOUT:
            errorMessage = 'Tiempo de espera agotado'
            break
          default:
            errorMessage = 'Error desconocido obteniendo ubicación'
            break
        }
        
        setError(errorMessage)
        setLoading(false)
      },
      options
    )
  }

  // Observar cambios en la ubicación
  const watchLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocalización no es soportada por este navegador')
      return null
    }

    setLoading(true)
    setError(null)

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000 // 1 minuto
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy
        })
        setLoading(false)
      },
      (error) => {
        let errorMessage = 'Error obteniendo ubicación'
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Permiso de ubicación denegado'
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Información de ubicación no disponible'
            break
          case error.TIMEOUT:
            errorMessage = 'Tiempo de espera agotado'
            break
          default:
            errorMessage = 'Error desconocido obteniendo ubicación'
            break
        }
        
        setError(errorMessage)
        setLoading(false)
      },
      options
    )

    return watchId
  }

  // Parar de observar la ubicación
  const stopWatching = (watchId) => {
    if (watchId) {
      navigator.geolocation.clearWatch(watchId)
    }
  }

  // Calcular distancia entre dos puntos usando la fórmula de Haversine
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371 // Radio de la Tierra en km
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLon = (lon2 - lon1) * Math.PI / 180
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }

  // Verificar si la geolocalización está disponible
  const isGeolocationAvailable = 'geolocation' in navigator

  // Verificar si hay permisos de geolocalización
  const checkPermissions = async () => {
    if (!('permissions' in navigator)) {
      return 'unsupported'
    }

    try {
      const permission = await navigator.permissions.query({ name: 'geolocation' })
      return permission.state // 'granted', 'denied', 'prompt'
    } catch (error) {
      return 'error'
    }
  }

  // Limpiar error
  const clearError = () => setError(null)

  return {
    location,
    error,
    loading,
    getCurrentLocation,
    watchLocation,
    stopWatching,
    calculateDistance,
    isGeolocationAvailable,
    checkPermissions,
    clearError
  }
}

export default useGeolocation