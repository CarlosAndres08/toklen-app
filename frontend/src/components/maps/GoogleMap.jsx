import React, { useEffect, useRef, useState } from 'react'
import { Loader } from '@googlemaps/js-api-loader'

const GoogleMap = ({ 
  center = { lat: -12.0464, lng: -77.0428 }, 
  zoom = 12, 
  markers = [],
  onMapClick = null,
  onMarkerClick = null,
  className = "w-full h-96",
  showUserLocation = true
}) => {
  const mapRef = useRef(null)
  const [map, setMap] = useState(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState(null)
  const markersRef = useRef([])

  // Cargar Google Maps
  useEffect(() => {
    const loader = new Loader({
      apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
      version: "weekly",
      libraries: ["places"]
    })

    loader.load().then(() => {
      setIsLoaded(true)
    }).catch(error => {
      console.error('Error loading Google Maps:', error)
      setError('Error al cargar el mapa')
    })
  }, [])

  // Inicializar mapa
  useEffect(() => {
    if (isLoaded && mapRef.current && !map) {
      const newMap = new window.google.maps.Map(mapRef.current, {
        center,
        zoom,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        styles: [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }]
          }
        ]
      })

      // Agregar listener para clicks en el mapa
      if (onMapClick) {
        newMap.addListener('click', (event) => {
          const lat = event.latLng.lat()
          const lng = event.latLng.lng()
          onMapClick({ lat, lng })
        })
      }

      setMap(newMap)
    }
  }, [isLoaded, center, zoom, onMapClick, map])

  // Mostrar ubicación del usuario
  useEffect(() => {
    if (map && showUserLocation) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const userLocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            }

            // Agregar marcador de usuario
            const userMarker = new window.google.maps.Marker({
              position: userLocation,
              map: map,
              title: 'Tu ubicación',
              icon: {
                path: window.google.maps.SymbolPath.CIRCLE,
                scale: 8,
                fillColor: '#4285F4',
                fillOpacity: 1,
                strokeColor: '#ffffff',
                strokeWeight: 2
              }
            })

            markersRef.current.push(userMarker)
          },
          (error) => {
            console.log('Error obteniendo ubicación:', error)
          }
        )
      }
    }
  }, [map, showUserLocation])

  // Manejar marcadores
  useEffect(() => {
    if (map && markers.length > 0) {
      // Limpiar marcadores existentes
      markersRef.current.forEach(marker => {
        marker.setMap(null)
      })
      markersRef.current = []

      // Agregar nuevos marcadores
      markers.forEach((markerData, index) => {
        const marker = new window.google.maps.Marker({
          position: { lat: markerData.lat, lng: markerData.lng },
          map: map,
          title: markerData.title || `Marcador ${index + 1}`,
          icon: markerData.icon || {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: markerData.color || '#10B981',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 2
          }
        })

        // Agregar listener para click en marcador
        if (onMarkerClick) {
          marker.addListener('click', () => {
            onMarkerClick(markerData, index)
          })
        }

        // Agregar info window si hay contenido
        if (markerData.infoWindow) {
          const infoWindow = new window.google.maps.InfoWindow({
            content: markerData.infoWindow
          })

          marker.addListener('click', () => {
            infoWindow.open(map, marker)
          })
        }

        markersRef.current.push(marker)
      })

      // Ajustar vista para mostrar todos los marcadores
      if (markers.length > 1) {
        const bounds = new window.google.maps.LatLngBounds()
        markers.forEach(marker => {
          bounds.extend({ lat: marker.lat, lng: marker.lng })
        })
        map.fitBounds(bounds)
      }
    }
  }, [map, markers, onMarkerClick])

  // Centrar mapa
  useEffect(() => {
    if (map && center) {
      map.setCenter(center)
    }
  }, [map, center])

  // Actualizar zoom
  useEffect(() => {
    if (map && zoom) {
      map.setZoom(zoom)
    }
  }, [map, zoom])

  if (error) {
    return (
      <div className={`${className} bg-gray-100 flex items-center justify-center rounded-lg`}>
        <div className="text-center">
          <p className="text-red-600 mb-2">{error}</p>
          <p className="text-gray-500 text-sm">
            Verifica tu conexión a internet
          </p>
        </div>
      </div>
    )
  }

  if (!isLoaded) {
    return (
      <div className={`${className} bg-gray-100 flex items-center justify-center rounded-lg`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-500 text-sm">Cargando mapa...</p>
        </div>
      </div>
    )
  }

  return <div ref={mapRef} className={className} />
}

export default GoogleMap