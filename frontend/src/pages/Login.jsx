import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import LoginForm from '../components/auth/LoginForm'

const Login = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (user) {
      navigate('/dashboard')
    }
  }, [user, navigate])

  return (
    <div className="login-page min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Toklen
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Inicia sesión para continuar
          </p>
        </div>
        
        <LoginForm />
        
        <div className="text-center text-sm text-gray-600">
          <p>
            ¿No tienes una cuenta?{' '}
            <span className="font-medium text-blue-600 hover:text-blue-500">
              Regístrate con Google para comenzar
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login