import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  const currentYear = new Date().getFullYear();

  // Idealmente, estos datos vendrían de una configuración o CMS
  const quickLinks = [
    { name: 'Inicio', path: '/' },
    { name: 'Buscar Profesionales', path: '/search-professionals' },
    { name: 'Ser Profesional', path: '/become-professional' },
    { name: 'Sobre Nosotros', path: '/about' },
    { name: 'Blog', path: '/blog' },
  ];

  const categoriesLinks = [
    { name: 'Plomería', path: '/search/plomeria' },
    { name: 'Electricidad', path: '/search/electricidad' },
    { name: 'Limpieza', path: '/search/limpieza' },
    { name: 'Carpintería', path: '/search/carpinteria' },
    { name: 'Ver todas', path: '/categories' },
  ];
  
  const legalLinks = [
    { name: 'Privacidad', path: '/privacy' },
    { name: 'Términos de Uso', path: '/terms' },
    { name: 'Contacto', path: '/contact' },
    { name: 'Ayuda y FAQ', path: '/help' },
  ];

  // Placeholder para iconos de redes sociales (reemplazar con SVGs reales o librería de iconos)
  const SocialIcon = ({ href, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-toklen-gray-blue hover:text-primary transition-colors duration-150">
      {children}
    </a>
  );

  return (
    <footer className="bg-secondary text-toklen-gray-blue pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
          {/* Columna 1: Logo y Descripción */}
          <div className="md:col-span-2 lg:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-5">
              <div className="w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center bg-primary/10">
                <img src="/logo.png" alt="Logo Toklen" className="w-7 h-7 object-contain" />
              </div>
              <span className="text-2xl font-bold text-white font-nunito">Toklen</span>
            </Link>
            <p className="text-sm mb-5 leading-relaxed">
              Conectamos a clientes con profesionales calificados de manera rápida y confiable. Encuentra el servicio que necesitas o expande tu alcance como profesional.
            </p>
            <div className="flex space-x-5">
              <SocialIcon href="#"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919C8.356 2.175 8.734 2.163 12 2.163m0-2.163C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12s.014 3.667.072 4.947c.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24s3.667-.014 4.947-.072c4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948s-.014-3.667-.072-4.947c-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zm0 10.162a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.88 1.44 1.44 0 000-2.88z"/></svg></SocialIcon> {/* Instagram */}
              <SocialIcon href="#"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35C.59 0 0 .59 0 1.325v21.351C0 23.41.59 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.735 0 1.325-.59 1.325-1.325V1.325C24 .59 23.41 0 22.675 0z"/></svg></SocialIcon> {/* Facebook */}
              <SocialIcon href="#"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0C.484 3.409 0 4.949 0 8.758v6.484c0 3.809.484 5.35 4.385 5.576 3.6.245 11.626.246 15.23 0 3.897-.226 4.385-1.766 4.385-5.576V8.758c0-3.81-.488-5.35-4.385-5.574zM9.545 15.568V7.949l6.525 3.81z"/></svg></SocialIcon> {/* YouTube */}
            </div>
          </div>

          {/* Columna 2: Enlaces Rápidos */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-5">Navegación</h3>
            <ul className="space-y-3">
              {quickLinks.map(link => (
                <li key={link.name}>
                  <Link to={link.path} className="text-sm hover:text-primary transition-colors duration-150">{link.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Columna 3: Categorías Populares */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-5">Categorías</h3>
            <ul className="space-y-3">
              {categoriesLinks.map(link => (
                <li key={link.name}>
                  <Link to={link.path} className="text-sm hover:text-primary transition-colors duration-150">{link.name}</Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Columna 4: Legal y Ayuda */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-5">Soporte</h3>
            <ul className="space-y-3">
              {legalLinks.map(link => (
                <li key={link.name}>
                  <Link to={link.path} className="text-sm hover:text-primary transition-colors duration-150">{link.name}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-neutral/20 mt-10 pt-8 text-center md:text-left">
          <p className="text-xs">
            © {currentYear} Toklen. Todos los derechos reservados. Hecho con <span className="text-primary">&hearts;</span> en Perú.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer