import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { isValidEmail } from '../../utils/helpers'
import LoadingSpinner from '../common/LoadingSpinner'

const LoginForm = ({ onToggleMode }) => {
  const { login, loginWithGoogle, register, resetPassword, loading, error } = useAuth()
  const [mode, setMode] = useState('login') // 'login', 'register', 'forgot'
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    displayName: ''
  })
  const [localError, setLocalError] = useState('')
  const [message, setMessage] = useState('')

  // Manejar cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setLocalError('')
  }

  // Validar formulario
  const validateForm = () => {
    const { email, password, confirmPassword, displayName } = formData

    if (!email || !isValidEmail(email)) {
      setLocalError('Ingresa un email válido')
      return false
    }

    if (mode === 'login') {
      if (!password) {
        setLocalError('Ingresa tu contraseña')
        return false
      }
    } else if (mode === 'register') {
      if (!displayName.trim()) {
        setLocalError('Ingresa tu nombre completo')
        return false
      }
      if (!password || password.length < 6) {
        setLocalError('La contraseña debe tener al menos 6 caracteres')
        return false
      }
      if (password !== confirmPassword) {
        setLocalError('Las contraseñas no coinciden')
        return false
      }
    }

    return true
  }

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setLocalError('')
    setMessage('')

    try {
      if (mode === 'login') {
        const result = await login(formData.email, formData.password)
        if (!result.success) {
          setLocalError(result.error)
        }
      } else if (mode === 'register') {
        const result = await register(formData.email, formData.password, formData.displayName)
        if (result.success) {
          setMessage('Registro exitoso. Verifica tu email para continuar.')
          setMode('login')
        } else {
          setLocalError(result.error)
        }
      } else if (mode === 'forgot') {
        const result = await resetPassword(formData.email)
        if (result.success) {
          setMessage('Email de restablecimiento enviado. Revisa tu bandeja de entrada.')
          setMode('login')
        } else {
          setLocalError(result.error)
        }
      }
    } catch (error) {
      setLocalError('Error inesperado. Intenta nuevamente.')
    }
  }

  // Manejar login con Google
  const handleGoogleLogin = async () => {
    setLocalError('')
    const result = await loginWithGoogle()
    if (!result.success) {
      setLocalError(result.error)
    }
  }

  const currentError = localError || error

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-center mb-6">
          {mode === 'login' && 'Iniciar Sesión'}
          {mode === 'register' && 'Crear Cuenta'}
          {mode === 'forgot' && 'Restablecer Contraseña'}
        </h2>

        {message && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            {message}
          </div>
        )}

        {currentError && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {currentError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre Completo
              </label>
              <input
                type="text"
                name="displayName"
                value={formData.displayName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Tu nombre completo"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="tu@email.com"
              required
            />
          </div>

          {mode !== 'forgot' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Tu contraseña"
                required
              />
            </div>
          )}

          {mode === 'register' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirmar Contraseña
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Confirma tu contraseña"
                required
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <LoadingSpinner size="small" />
            ) : (
              <>
                {mode === 'login' && 'Iniciar Sesión'}
                {mode === 'register' && 'Crear Cuenta'}
                {mode === 'forgot' && 'Enviar Email'}
              </>
            )}
          </button>
        </form>

        {mode === 'login' && (
          <div className="mt-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">O</span>
              </div>
            </div>

            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="mt-4 w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <LoadingSpinner size="small" />
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continuar con Google
                </>
              )}
            </button>
          </div>
        )}

        <div className="mt-6 text-center text-sm">
          {mode === 'login' && (
            <>
              <button
                onClick={() => setMode('forgot')}
                className="text-blue-600 hover:text-blue-800 mr-4"
              >
                ¿Olvidaste tu contraseña?
              </button>
              <div className="mt-2">
                ¿No tienes cuenta?{' '}
                <button
                  onClick={() => setMode('register')}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Regístrate
                </button>
              </div>
            </>
          )}

          {mode === 'register' && (
            <div>
              ¿Ya tienes cuenta?{' '}
              <button
                onClick={() => setMode('login')}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Iniciar sesión
              </button>
            </div>
          )}

          {mode === 'forgot' && (
            <div>
              ¿Recordaste tu contraseña?{' '}
              <button
                onClick={() => setMode('login')}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Iniciar sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default LoginForm