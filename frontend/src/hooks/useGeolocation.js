import { useState, useEffect } from 'react'

const useGeolocation = () => {
  const [location, setLocation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocalización no soportada por este navegador')
      return
    }

    setLoading(true)
    setError(null)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
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
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000 // 1 minuto
      }
    )
  }

  useEffect(() => {
    getCurrentLocation()
  }, [])

  return {
    location,
    loading,
    error,
    refetch: getCurrentLocation
  }
}

export default useGeolocation