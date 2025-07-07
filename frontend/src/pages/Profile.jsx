





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
    <div className="min-h-screen bg-base-200 py-8"> {/* Fondo Gris Claro */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header del Perfil */}
        <div className="bg-gradient-to-br from-secondary to-toklen-blue-hover rounded-xl shadow-2xl mb-8 overflow-hidden"> {/* Gradiente con colores de la paleta */}
          <div className="px-6 py-10 md:px-8 md:py-12">
            <div className="flex flex-col sm:flex-row items-center justify-between">
              <div className="flex items-center space-x-4 sm:space-x-5">
                <div className="relative group">
                  <div className="h-24 w-24 md:h-28 md:w-28 rounded-full bg-base-100/20 flex items-center justify-center ring-4 ring-base-100/30">
                    {user?.photoURL ? (
                      <img 
                        src={user.photoURL} 
                        alt="Foto de Perfil" 
                        className="h-full w-full rounded-full object-cover"
                      />
                    ) : (
                      <User className="h-12 w-12 md:h-14 md:w-14 text-base-100/70" />
                    )}
                  </div>
                  <button className="absolute bottom-1 right-1 bg-primary text-white rounded-full p-2 shadow-md hover:bg-toklen-coral-hover transition-colors opacity-0 group-hover:opacity-100 duration-300">
                    <Camera className="h-4 w-4" />
                  </button>
                </div>
                <div className="text-white mt-3 sm:mt-0 text-center sm:text-left">
                  <h1 className="text-2xl md:text-3xl font-bold">
                    {profile?.displayName || 'Nombre de Usuario'}
                  </h1>
                  <p className="text-toklen-gray-blue/90 text-sm">{profile?.email}</p>
                  <div className="flex items-center mt-2 text-xs text-toklen-gray-blue/80 justify-center sm:justify-start">
                    <Shield className="h-3.5 w-3.5 mr-1.5" />
                    <span>
                      Miembro desde {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('es-ES', { year: 'numeric', month: 'long' }) : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={handleEditToggle}
                className="mt-4 sm:mt-0 btn bg-base-100/20 text-white hover:bg-base-100/30 text-sm py-2 px-5 flex items-center space-x-2"
              >
                {isEditing ? (
                  <>
                    <X className="h-4 w-4" />
                    <span>Cancelar</span>
                  </>
                ) : (
                  <>
                    <Edit2 className="h-4 w-4" />
                    <span>Editar Perfil</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mensaje de Error */}
        {error && (
          <div className="mb-6 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md" role="alert">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna Información Personal */}
          <div className="lg:col-span-2">
            <div className="card bg-base-100 shadow-xl p-6 md:p-8 rounded-xl"> {/* Usando .card global */}
              <h2 className="text-xl font-semibold text-secondary mb-6">
                Información Personal
              </h2>
              
              <div className="space-y-5">
                {/* Campo Nombre */}
                <div>
                  <label htmlFor="displayName" className="block text-sm font-medium text-neutral mb-1">
                    Nombre completo
                  </label>
                  {isEditing ? (
                    <input
                      id="displayName"
                      type="text"
                      value={editData.displayName}
                      onChange={(e) => handleInputChange('displayName', e.target.value)}
                      className="w-full px-4 py-2.5 border border-neutral rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-base-100 placeholder-neutral/60"
                    />
                  ) : (
                    <div className="flex items-center space-x-2 text-secondary py-2">
                      <User className="h-5 w-5 text-neutral/70" />
                      <span>{profile?.displayName || 'No especificado'}</span>
                    </div>
                  )}
                </div>

                {/* Campo Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-neutral mb-1">
                    Email
                  </label>
                  {isEditing ? (
                    <input
                      id="email"
                      type="email"
                      value={editData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-4 py-2.5 border border-neutral rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-base-100 placeholder-neutral/60"
                    />
                  ) : (
                    <div className="flex items-center space-x-2 text-secondary py-2">
                      <Mail className="h-5 w-5 text-neutral/70" />
                      <span>{profile?.email}</span>
                    </div>
                  )}
                </div>

                {/* Campo Teléfono */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-neutral mb-1">
                    Teléfono
                  </label>
                  {isEditing ? (
                    <input
                      id="phone"
                      type="tel"
                      value={editData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full px-4 py-2.5 border border-neutral rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-base-100 placeholder-neutral/60"
                      placeholder="Ej: +51 987654321"
                    />
                  ) : (
                    <div className="flex items-center space-x-2 text-secondary py-2">
                      <Phone className="h-5 w-5 text-neutral/70" />
                      <span>{profile?.phone || 'No especificado'}</span>
                    </div>
                  )}
                </div>

                {/* Campo Dirección */}
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-neutral mb-1">
                    Dirección
                  </label>
                  {isEditing ? (
                    <input
                      id="address"
                      type="text"
                      value={editData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className="w-full px-4 py-2.5 border border-neutral rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-base-100 placeholder-neutral/60"
                      placeholder="Ej: Av. Siempreviva 742, Lima"
                    />
                  ) : (
                    <div className="flex items-center space-x-2 text-secondary py-2">
                      <MapPin className="h-5 w-5 text-neutral/70" />
                      <span>{profile?.address || 'No especificado'}</span>
                    </div>
                  )}
                </div>

                {/* Campo Biografía */}
                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-neutral mb-1">
                    Sobre mí
                  </label>
                  {isEditing ? (
                    <textarea
                      id="bio"
                      value={editData.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      rows={4}
                      className="w-full px-4 py-2.5 border border-neutral rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-base-100 placeholder-neutral/60"
                      placeholder="Una breve descripción sobre ti, tus intereses o lo que buscas en Toklen..."
                    />
                  ) : (
                    <p className="text-secondary py-2 whitespace-pre-line">
                      {profile?.bio || 'Aún no has añadido una biografía.'}
                    </p>
                  )}
                </div>
              </div>

              {isEditing && (
                <div className="mt-8 flex space-x-3">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="btn btn-primary flex items-center space-x-2"
                  >
                    <Save className="h-4 w-4" />
                    <span>{saving ? 'Guardando...' : 'Guardar Cambios'}</span>
                  </button>
                  <button
                    onClick={handleEditToggle}
                    className="btn btn-neutral flex items-center space-x-2" // Usar btn-neutral o btn-outline-secondary
                  >
                    Cancelar
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Columna Estadísticas y Actividad */}
          <div className="space-y-8">
            {/* Panel de Estadísticas */}
            <div className="card bg-base-100 shadow-xl p-6 md:p-8 rounded-xl">
              <h3 className="text-xl font-semibold text-secondary mb-6">
                Mis Estadísticas
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral">Servicios solicitados</span>
                  <span className="font-semibold text-secondary text-lg">{profile?.servicesCount || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral">Calificación promedio</span>
                  <div className="flex items-center space-x-1">
                    <Star className="h-5 w-5 text-yellow-400 fill-current" />
                    <span className="font-semibold text-secondary text-lg">{profile?.averageRating || 'N/A'}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral">Último servicio</span>
                  <span className="text-sm text-secondary">
                    {profile?.lastService ? 
                      new Date(profile.lastService).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric'}) : 
                      'Ninguno'
                    }
                  </span>
                </div>
                {/* Aquí se podrían añadir más estadísticas relevantes */}
              </div>
            </div>

            {/* Panel de Actividad Reciente */}
            <div className="card bg-base-100 shadow-xl p-6 md:p-8 rounded-xl">
              <h3 className="text-xl font-semibold text-secondary mb-6">
                Actividad Reciente
              </h3>
              <div className="space-y-5">
                {profile?.recentActivity?.length > 0 ? (
                  profile.recentActivity.slice(0, 3).map((activity, index) => ( // Mostrar solo las 3 más recientes
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-2.5 h-2.5 bg-primary rounded-full mt-1.5 flex-shrink-0"></div>
                      <div>
                        <p className="text-sm text-secondary leading-snug">{activity.description}</p>
                        <p className="text-xs text-neutral mt-0.5">
                          {new Date(activity.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric'})}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-neutral italic">
                    No hay actividad reciente para mostrar.
                  </p>
                )}
                {profile?.recentActivity?.length > 3 && (
                  <Link to="/activity-log" className="text-sm text-primary hover:underline mt-4 inline-block">Ver toda la actividad</Link>
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