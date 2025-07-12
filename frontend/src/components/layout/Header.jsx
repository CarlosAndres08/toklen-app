import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getInitials } from '../../utils/helpers';

const Header = () => {
  const { isAuthenticated, user, userProfile, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const navigate = useNavigate();

  const NavLinkItem = ({ to, children }) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ${
          isActive
            ? 'text-primary bg-primary/10 font-semibold'
            : 'text-secondary hover:text-primary hover:bg-primary/5'
        }`
      }
    >
      {children}
    </NavLink>
  );

  const NavLinkDropdownItem = ({ to, children, onClick }) => (
    <Link
      to={to}
      onClick={onClick}
      className="block px-4 py-2 text-sm text-secondary hover:bg-base-200 hover:text-primary transition-colors duration-150 rounded"
    >
      {children}
    </Link>
  );

  const NavLinkMobileItem = ({ to, children, className = '', onClick }) => (
    <Link
      to={to}
      onClick={onClick}
      className={`block px-3 py-3 text-base font-medium text-secondary hover:bg-primary/10 hover:text-primary rounded-md transition-colors duration-150 ${className}`}
    >
      {children}
    </Link>
  );

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setShowUserMenu(false);
    setShowMobileMenu(false);
  };

  const toggleUserMenu = () => setShowUserMenu(!showUserMenu);
  const toggleMobileMenu = () => setShowMobileMenu(!showMobileMenu);

  return (
    <header className="bg-base-100 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center bg-primary/10">
                <img src="/logo.png" alt="Logo Toklen" className="w-7 h-7 object-contain" />
              </div>
              <span className="text-2xl font-bold text-secondary font-nunito">Toklen</span>
            </Link>
          </div>

          {/* Menú Desktop */}
          <nav className="hidden md:flex items-center space-x-6">
            <NavLinkItem to="/">Inicio</NavLinkItem>
            <NavLinkItem to="/browse-services">Buscar Servicios</NavLinkItem> {/* Cambiado */}
            <NavLinkItem to="/search-professionals">Buscar Profesionales</NavLinkItem> {/* Mantener o decidir si se fusiona */}
            <NavLinkItem to="/become-professional">Ser Profesional</NavLinkItem>
          </nav>

          {/* Acciones de usuario */}
          <div className="flex items-center space-x-3">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={toggleUserMenu}
                  className="flex items-center space-x-2 text-secondary hover:text-primary focus:outline-none transition-colors duration-150"
                >
                  <div className="w-9 h-9 bg-primary text-white rounded-full flex items-center justify-center text-sm font-semibold">
                    {getInitials(user?.displayName || userProfile?.name || 'U')}
                  </div>
                  <span className="hidden lg:block text-sm font-medium">
                    {user?.displayName?.split(' ')[0] ||
                      userProfile?.name?.split(' ')[0] ||
                      'Usuario'}
                  </span>
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${
                      showUserMenu ? 'transform rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Dropdown del usuario */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-base-100 rounded-md shadow-xl py-1 z-50 ring-1 ring-black ring-opacity-5">
                    <div className="px-4 py-3 border-b border-neutral/20">
                      <p className="text-sm font-semibold text-secondary">
                        {user?.displayName || userProfile?.name || 'Usuario'}
                      </p>
                      <p className="text-xs text-neutral truncate">{user?.email}</p>
                    </div>
                    <NavLinkDropdownItem to="/dashboard" onClick={toggleUserMenu}>
                      Panel de Control
                    </NavLinkDropdownItem>
                    <NavLinkDropdownItem to="/profile" onClick={toggleUserMenu}>
                      Mi Perfil
                    </NavLinkDropdownItem>
                    {/* TODO: Crear página Mis Solicitudes y habilitar enlace */}
                    {/* <NavLinkDropdownItem to="/my-requests" onClick={toggleUserMenu}>
                      Mis Solicitudes
                    </NavLinkDropdownItem> */}
                    <div className="border-t border-neutral/20 my-1"></div>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-500/10 hover:text-red-700 transition-colors duration-150 rounded-b-md"
                    >
                      Cerrar Sesión
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-secondary hover:text-primary px-4 py-2 text-sm font-medium transition-colors duration-150"
                >
                  Iniciar Sesión
                </Link>
                <Link to="/login?mode=register" className="btn btn-primary text-sm px-5 py-2">
                  Registrarse
                </Link>
              </div>
            )}

            {/* Botón de menú móvil */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden text-secondary hover:text-primary focus:outline-none p-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {showMobileMenu ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Menú móvil */}
        {showMobileMenu && (
          <div className="md:hidden border-t border-neutral/20 bg-base-100 absolute left-0 right-0 shadow-lg">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <NavLinkMobileItem to="/" onClick={toggleMobileMenu}>
                Inicio
              </NavLinkMobileItem>
              <NavLinkMobileItem to="/browse-services" onClick={toggleMobileMenu}>
                Buscar Servicios {/* Cambiado */}
              </NavLinkMobileItem>
              <NavLinkMobileItem to="/search-professionals" onClick={toggleMobileMenu}>
                Buscar Profesionales {/* Mantener */}
              </NavLinkMobileItem>
              <NavLinkMobileItem to="/become-professional" onClick={toggleMobileMenu}>
                Ser Profesional
              </NavLinkMobileItem>

              {!isAuthenticated && (
                <>
                  <div className="border-t border-neutral/20 pt-3 mt-2 space-y-1">
                    <NavLinkMobileItem to="/login" onClick={toggleMobileMenu}>
                      Iniciar Sesión
                    </NavLinkMobileItem>
                    <NavLinkMobileItem
                      to="/login?mode=register"
                      className="bg-primary/10 text-primary hover:bg-primary/20"
                      onClick={toggleMobileMenu}
                    >
                      Registrarse
                    </NavLinkMobileItem>
                  </div>
                </>
              )}

              {isAuthenticated && (
                <div className="border-t border-neutral/20 pt-4 mt-3">
                  <div className="flex items-center px-3 mb-2">
                    <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center text-base font-semibold">
                      {getInitials(user?.displayName || userProfile?.name || 'U')}
                    </div>
                    <div className="ml-3">
                      <p className="text-base font-medium text-secondary">
                        {user?.displayName || userProfile?.name || 'Usuario'}
                      </p>
                      <p className="text-sm text-neutral truncate">{user?.email}</p>
                    </div>
                  </div>
                  <NavLinkMobileItem to="/dashboard" onClick={toggleMobileMenu}>
                    Panel de Control
                  </NavLinkMobileItem>
                  <NavLinkMobileItem to="/profile" onClick={toggleMobileMenu}>
                    Mi Perfil
                  </NavLinkMobileItem>
                  {/* TODO: Crear página Mis Solicitudes y habilitar enlace */}
                  {/* <NavLinkMobileItem to="/my-requests" onClick={toggleMobileMenu}>
                    Mis Solicitudes
                  </NavLinkMobileItem> */}
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-3 py-3 text-base font-medium text-red-600 hover:bg-red-500/10 hover:text-red-700 rounded-md transition-colors duration-150"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;