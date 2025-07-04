import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { getInitials } from '../../utils/helpers'

const Header = () => {
  const { isAuthenticated, user, userProfile, logout } = useAuth()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/')
    setShowUserMenu(false)
  }

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu)
  }

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu)
  }

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
  {/* Nuevo logo con imagen */}
  <div className="w-8 h-8 rounded-lg overflow-hidden">
    <img src="/logo.png" alt="Logo Toklen" className="w-full h-full object-cover" />
  </div>

  {/* Toklen con fuente moderna y color personalizado */}
  <span
    className="text-xl font-bold"
    style={{
      fontFamily: 'Poppins, sans-serif',
      color: '#253a48'
    }}
  >
    Toklen
  </span>
</Link>

          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex space-x-8">
            <Link
              to="/"
              className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
            >
              Inicio
            </Link>
            <Link
              to="/search-professionals"
              className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
            >
              Buscar Profesionales
            </Link>
            <Link
              to="/become-professional"
              className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
            >
              Ser Profesional
            </Link>
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={toggleUserMenu}
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 focus:outline-none"
                >
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {getInitials(user?.displayName || userProfile?.name || 'Usuario')}
                    </span>
                  </div>
                  <span className="hidden md:block text-sm font-medium">
                    {user?.displayName || userProfile?.name || 'Usuario'}
                  </span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* User Dropdown */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <Link
                      to="/dashboard"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Panel de Control
                    </Link>
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Mi Perfil
                    </Link>
                    <Link
                      to="/request-service"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Solicitar Servicio
                    </Link>
                    <div className="border-t border-gray-100"></div>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      Cerrar Sesión
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  to="/login"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Registrarse
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden text-gray-700 hover:text-blue-600 focus:outline-none"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {showMobileMenu && (
          <div className="md:hidden border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                to="/"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md"
                onClick={() => setShowMobileMenu(false)}
              >
                Inicio
              </Link>
              <Link
                to="/search-professionals"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md"
                onClick={() => setShowMobileMenu(false)}
              >
                Buscar Profesionales
              </Link>
              <Link
                to="/become-professional"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md"
                onClick={() => setShowMobileMenu(false)}
              >
                Ser Profesional
              </Link>
              
              {isAuthenticated && (
                <>
                  <div className="border-t border-gray-200 pt-2">
                    <Link
                      to="/dashboard"
                      className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      Panel de Control
                    </Link>
                    <Link
                      to="/profile"
                      className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      Mi Perfil
                    </Link>
                    <Link
                      to="/request-service"
                      className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      Solicitar Servicio
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-3 py-2 text-base font-medium text-red-600 hover:bg-gray-50 rounded-md"
                    >
                      Cerrar Sesión
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header