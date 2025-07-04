




import React, { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { usersAPI } from '../services/api'

import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Edit2, 
  Save, 
  X,
  Camera,
  Star,
  Calendar,
  Shield
} from 'lucide-react'

const Profile = () => {
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [editData, setEditData] = useState({
    displayName: '',
    email: '',
    phone: '',
    address: '',
    bio: ''
  })

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      setLoading(true)
      const response = await usersAPI.getProfile()
      setProfile(response.data)
      setEditData({
        displayName: response.data.displayName || '',
        email: response.data.email || '',
        phone: response.data.phone || '',
        address: response.data.address || '',
        bio: response.data.bio || ''
      })
    } catch (error) {
      console.error('Error cargando perfil:', error)
      setError('Error al cargar el perfil')
    } finally {
      setLoading(false)
    }
  }

  const handleEditToggle = () => {
    if (isEditing) {
      // Cancelar edición - restaurar datos originales
      setEditData({
        displayName: profile.displayName || '',
        email: profile.email || '',
        phone: profile.phone || '',
        address: profile.address || '',
        bio: profile.bio || ''
      })
    }
    setIsEditing(!isEditing)
    setError('')
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      setError('')
      
      // Validaciones básicas
      if (!editData.displayName.trim()) {
        setError('El nombre es requerido')
        return
      }
      
      if (!editData.email.trim()) {
        setError('El email es requerido')
        return
      }

      const response = await usersAPI.updateProfile(editData)
      setProfile(response.data)
      setIsEditing(false)
      
    } catch (error) {
      console.error('Error actualizando perfil:', error)
      setError('Error al actualizar el perfil')
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (field, value) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando perfil...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow mb-6 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="h-20 w-20 rounded-full bg-white flex items-center justify-center">
                    {user?.photoURL ? (
                      <img 
                        src={user.photoURL} 
                        alt="Profile" 
                        className="h-20 w-20 rounded-full object-cover"
                      />
                    ) : (
                      <User className="h-10 w-10 text-gray-400" />
                    )}
                  </div>
                  <button className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-2 shadow-lg hover:bg-blue-700 transition-colors">
                    <Camera className="h-4 w-4 text-white" />
                  </button>
                </div>
                <div className="text-white">
                  <h1 className="text-2xl font-bold">
                    {profile?.displayName || 'Usuario'}
                  </h1>
                  <p className="text-blue-100">{profile?.email}</p>
                  <div className="flex items-center mt-2">
                    <Shield className="h-4 w-4 mr-1" />
                    <span className="text-sm">
                      Miembro desde {new Date(profile?.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={handleEditToggle}
                className="bg-white/20 text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-colors flex items-center space-x-2"
              >
                {isEditing ? (
                  <>
                    <X className="h-4 w-4" />
                    <span>Cancelar</span>
                  </>
                ) : (
                  <>
                    <Edit2 className="h-4 w-4" />
                    <span>Editar</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="text-red-800 text-sm">{error}</div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Información Personal */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Información Personal
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre completo
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.displayName}
                      onChange={(e) => handleInputChange('displayName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <span>{profile?.displayName || 'No especificado'}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={editData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span>{profile?.email}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Teléfono
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Ingresa tu número de teléfono"
                    />
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span>{profile?.phone || 'No especificado'}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dirección
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Ingresa tu dirección"
                    />
                  ) : (
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span>{profile?.address || 'No especificado'}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Biografía
                  </label>
                  {isEditing ? (
                    <textarea
                      value={editData.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Cuéntanos sobre ti..."
                    />
                  ) : (
                    <p className="text-gray-700">
                      {profile?.bio || 'No has agregado una biografía aún.'}
                    </p>
                  )}
                </div>
              </div>

              {isEditing && (
                <div className="mt-6 flex space-x-3">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
                  >
                    <Save className="h-4 w-4" />
                    <span>{saving ? 'Guardando...' : 'Guardar cambios'}</span>
                  </button>
                  <button
                    onClick={handleEditToggle}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                  >
                    Cancelar
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Estadísticas y Actividad */}
          <div className="space-y-6">
            {/* Estadísticas */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Estadísticas
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Servicios solicitados</span>
                  <span className="font-semibold">{profile?.servicesCount || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Calificación promedio</span>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="font-semibold">{profile?.averageRating || 'N/A'}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Último servicio</span>
                  <span className="text-sm">
                    {profile?.lastService ? 
                      new Date(profile.lastService).toLocaleDateString() : 
                      'Ninguno'
                    }
                  </span>
                </div>
              </div>
            </div>

            {/* Actividad Reciente */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Actividad Reciente
              </h3>
              <div className="space-y-3">
                {profile?.recentActivity?.length > 0 ? (
                  profile.recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <div>
                        <p className="text-sm text-gray-700">{activity.description}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(activity.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">
                    No hay actividad reciente
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile