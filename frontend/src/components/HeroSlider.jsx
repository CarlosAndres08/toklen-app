import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import HeroSlider from '../components/HeroSlider'

const Home = () => {
  const { user } = useAuth()

  return (
    <div className="home-page">
      {/* Hero Slider Section */}
      <HeroSlider />

      {/* Features Section */}
      <section className="features-section py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-toklen-secondary">
            ¿Cómo funciona Toklen?
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Para Clientes */}
            <div className="card text-center p-8 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-toklen-primary bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-toklen-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-toklen-secondary">Busca Profesionales</h3>
              <p className="text-toklen-text-muted">
                Encuentra profesionales cercanos a tu ubicación con las habilidades que necesitas.
              </p>
            </div>

            <div className="card text-center p-8 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-toklen-primary bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-toklen-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-toklen-secondary">Conecta y Solicita</h3>
              <p className="text-toklen-text-muted">
                Contacta directamente con profesionales y solicita el servicio que necesitas.
              </p>
            </div>

            <div className="card text-center p-8 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-toklen-primary bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-toklen-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-toklen-secondary">Servicio Completado</h3>
              <p className="text-toklen-text-muted">
                Recibe el servicio y califica la experiencia para ayudar a otros usuarios.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="services-section py-20 bg-toklen-bg-secondary">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-toklen-secondary">
            Servicios Disponibles
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'Plomería', icon: '🔧', color: 'bg-toklen-primary' },
              { name: 'Electricidad', icon: '⚡', color: 'bg-toklen-secondary' },
              { name: 'Limpieza', icon: '🧹', color: 'bg-toklen-primary' },
              { name: 'Carpintería', icon: '🔨', color: 'bg-toklen-secondary' },
              { name: 'Jardinería', icon: '🌱', color: 'bg-toklen-primary' },
              { name: 'Pintura', icon: '🎨', color: 'bg-toklen-secondary' },
              { name: 'Reparaciones', icon: '🔧', color: 'bg-toklen-primary' },
              { name: 'Delivery', icon: '📦', color: 'bg-toklen-secondary' }
            ].map((service) => (
              <div key={service.name} className="card p-6 text-center hover:shadow-lg transition-shadow">
                <div className={`w-12 h-12 ${service.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <span className="text-2xl">{service.icon}</span>
                </div>
                <h3 className="font-semibold text-toklen-secondary">{service.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section py-20 bg-toklen-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            ¿Listo para comenzar?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Únete a miles de usuarios que ya confían en Toklen para sus necesidades de servicios.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/request-service" 
              className="btn bg-white text-toklen-primary hover:bg-gray-100 text-lg px-8 py-3 transform hover:scale-105 transition-all duration-300"
            >
              Solicitar Servicio
            </Link>
            <Link 
              to="/become-professional" 
              className="btn border-2 border-white text-white hover:bg-white hover:text-toklen-primary text-lg px-8 py-3 transform hover:scale-105 transition-all duration-300"
            >
              Ser Profesional
            </Link>
          </div>
        </div>
      </section>

      {/* Footer info */}
      <section className="py-12 bg-toklen-secondary text-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Toklen</h3>
              <p className="text-toklen-text-muted">
                Conectando profesionales con clientes de manera rápida y confiable.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Enlaces Rápidos</h4>
              <ul className="space-y-2 text-toklen-text-muted">
                <li><Link to="/about" className="hover:text-white">Acerca de</Link></li>
                <li><Link to="/contact" className="hover:text-white">Contacto</Link></li>
                <li><Link to="/help" className="hover:text-white">Ayuda</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contacto</h4>
              <p className="text-toklen-text-muted">
                Email: info@toklen.com<br />
                Teléfono: +51 123 456 789
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home