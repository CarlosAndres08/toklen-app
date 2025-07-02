import { useEffect, useRef, useState } from 'react'
import { Loader } from '@googlemaps/js-api-loader'

const GoogleMap = ({ 
  center, 
  zoom = 13, 
  markers = [], 
  onMapClick,
  height = '400px',
  width = '100%' 
}) => {
  const mapRef = useRef(null)
  const [map, setMap] = useState(null)
  const [googleMaps, setGoogleMaps] = useState(null)

  useEffect(() => {
    const initMap = async () => {
      const loader = new Loader({
        apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        version: 'weekly',
        libraries: ['places']
      })

      try {
        const google = await loader.load()
        setGoogleMaps(google)

        const mapInstance = new google.maps.Map(mapRef.current, {
          center: center || { lat: -12.0464, lng: -77.0428 }, // Lima, Perú por defecto
          zoom,
          styles: [
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }]
            }
          ]
        })

        setMap(mapInstance)

        // Agregar listener para clicks en el mapa
        if (onMapClick) {
          mapInstance.addListener('click', (event) => {
            onMapClick({
              lat: event.latLng.lat(),
              lng: event.latLng.lng()
            })
          })
        }

      } catch (error) {
        console.error('Error cargando Google Maps:', error)
      }
    }

    initMap()
  }, [])

  // Actualizar marcadores cuando cambien
  useEffect(() => {
    if (!map || !googleMaps || !markers.length) return

    // Limpiar marcadores existentes
    markers.forEach(markerData => {
      const marker = new googleMaps.maps.Marker({
        position: { lat: markerData.lat, lng: markerData.lng },
        map,
        title: markerData.title,
        icon: markerData.icon || undefined
      })

      if (markerData.onClick) {
        marker.addListener('click', () => markerData.onClick(markerData))
      }

      // InfoWindow si hay contenido
      if (markerData.infoContent) {
        const infoWindow = new googleMaps.maps.InfoWindow({
          content: markerData.infoContent
        })

        marker.addListener('click', () => {
          infoWindow.open(map, marker)
        })
      }
    })
  }, [map, googleMaps, markers])

  // Actualizar centro del mapa
  useEffect(() => {
    if (map && center) {
      map.setCenter(center)
    }
  }, [map, center])

  return (
    <div 
      ref={mapRef} 
      style={{ height, width }}
      className="google-map"
    />
  )
}

export default GoogleMap