import React from 'react'
import { Link } from 'react-router-dom'
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  LinkedIn, 
  Mail, 
  Phone, 
  MapPin,
  Heart
} from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const companyLinks = [
    { name: 'Sobre Nosotros', href: '/about' },
    { name: 'Carreras', href: '/careers' },
    { name: 'Blog', href: '/blog' },
    { name: 'Prensa', href: '/press' },
    { name: 'Contacto', href: '/contact' }
  ]

  const serviceLinks = [
    { name: 'Buscar Profesionales', href: '/search-professionals' },
    { name: 'Solicitar Servicio', href: '/request-service' },
    { name: 'Registrarse como Profesional', href: '/become-professional' },
    { name: 'Cómo Funciona', href: '/how-it-works' },
    { name: 'Precios', href: '/pricing' }
  ]

  const supportLinks = [
    { name: 'Centro de Ayuda', href: '/help' },
    { name: 'Términos y Condiciones', href: '/terms' },
    { name: 'Política de Privacidad', href: '/privacy' },
    { name: 'Política de Cookies', href: '/cookies' },
    { name: 'Reportar Problema', href: '/report' }
  ]

  const socialLinks = [
    { 
      name: 'Facebook', 
      href: 'https://facebook.com/toklen', 
      icon: Facebook,
      color: 'hover:text-blue-600'
    },
    { 
      name: 'Twitter', 
      href: 'https://twitter.com/toklen', 
      icon: Twitter,
      color: 'hover:text-blue-400'
    },
    { 
      name: 'Instagram', 
      href: 'https://instagram.com/toklen', 
      icon: Instagram,
      color: 'hover:text-pink-600'
    },
    { 
      name: 'LinkedIn', 
      href: 'https://linkedin.com/company/toklen', 
      icon: LinkedIn,
      color: 'hover:text-blue-700'
    }
  ]

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="bg-blue-600 p-2 rounded-lg">
                <div className="h-6 w-6 bg-white rounded-sm" />
              </div>
              <span className="text-xl font-bold">Toklen</span>
            </div>
            
            <p className="text-gray-300 text-sm leading-relaxed">
              Conectamos clientes con profesionales calificados para servicios 
              de calidad en el hogar y empresas. Tu satisfacción es nuestra prioridad.
            </p>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <MapPin className="h-4 w-4 text-blue-400" />
                <span>Lima, Perú</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <Phone className="h-4 w-4 text-blue-400" />
                <span>+51 1 234-5678</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <Mail className="h-4 w-4 text-blue-400" />
                <span>contacto@toklen.com</span>
              </div>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Empresa</h3>
            <ul className="space-y-2">
              {companyLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.href}
                    className="text-gray-300 hover:text-white text-sm transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Servicios</h3>
            <ul className="space-y-2">
              {serviceLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.href}
                    className="text-gray-300 hover:text-white text-sm transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Soporte</h3>
            <ul className="space-y-2">
              {supportLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.href}
                    className="text-gray-300 hover:text-white text-sm transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Subscription */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="max-w-md mx-auto text-center">
            <h3 className="text-lg font-semibold mb-2">
              Mantente informado
            </h3>
            <p className="text-gray-300 text-sm mb-4">
              Recibe las últimas noticias, ofertas y actualizaciones de Toklen
            </p>
            <form className="flex space-x-2">
              <input
                type="email"
                placeholder="Tu correo electrónico"
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
              />
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-200 font-medium"
              >
                Suscribirse
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom footer */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            
            {/* Copyright */}
            <div className="flex items-center space-x-2 text-sm text-gray-300">
              <span>&copy; {currentYear} Toklen. Todos los derechos reservados.</span>
              <span className="flex items-center space-x-1">
                <span>Hecho con</span>
                <Heart className="h-4 w-4 text-red-500" />
                <span>en Perú</span>
              </span>
            </div>

            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-gray-400 ${social.color} transition-colors duration-200`}
                    aria-label={`Seguir en ${social.name}`}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer