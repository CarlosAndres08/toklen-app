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
    <div className="login-page min-h-screen flex items-center justify-center bg-base-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <img src="/logo.png" alt="Toklen Logo" className="mx-auto h-16 w-auto" />
          <h2 className="mt-6 text-3xl font-extrabold text-secondary">
            Bienvenido a Toklen
          </h2>
          <p className="mt-2 text-sm text-neutral">
            {/* El LoginForm ahora maneja los diferentes modos (login, register), así que este texto puede ser más genérico o eliminarse si el título del form es suficiente. */}
            Accede o crea tu cuenta para continuar
          </p>
        </div>
        
        <LoginForm />
        
        {/* El componente LoginForm ahora tiene sus propios enlaces para cambiar entre login/registro/olvido */}
      </div>
    </div>
  )
}

export default Login