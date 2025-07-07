import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth'; // Asegúrate que la ruta a useAuth sea correcta

// Asumiendo que tienes algunas categorías y servicios de ejemplo
// Podrías mover esto a un archivo de constantes o obtenerlo de una API más adelante
const sampleCategories = [
  { name: 'Plomería', icon: '🔧', path: '/search/plomeria' },
  { name: 'Electricidad', icon: '⚡', path: '/search/electricidad' },
  { name: 'Limpieza', icon: '🧹', path: '/search/limpieza' },
  { name: 'Carpintería', icon: '🔨', path: '/search/carpinteria' },
];

const sampleHowItWorks = [
  {
    icon: <svg className="w-12 h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>,
    title: '1. Busca',
    description: 'Encuentra y compara profesionales calificados cerca de ti para cualquier servicio que necesites.',
  },
  {
    icon: <svg className="w-12 h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.46 4.383c.29.872.036 1.84-.64 2.457l-1.136.946a11.03 11.03 0 005.516 5.516l.946-1.136a1.648 1.648 0 012.457-.64l4.383 1.46A1 1 0 0121 15.72V19a2 2 0 01-2 2h-1C6.477 21 2 16.523 2 10V9a2 2 0 012-2z"></path></svg>,
    title: '2. Conecta',
    description: 'Contacta directamente, revisa perfiles, y agenda el servicio de forma segura y transparente.',
  },
  {
    icon: <svg className="w-12 h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.323-.013-.484-.04M14 10V3M14 10L9 14M5 10h1.73c.474 0 .898.224 1.174.586l2.552 3.402a1.5 1.5 0 002.338-2.042L9.11 4.42A2.25 2.25 0 007.05 3H5V10z"></path></svg>,
    title: '3. Disfruta',
    description: 'Recibe un servicio de calidad y califica tu experiencia para ayudar a nuestra comunidad a crecer.',
  },
];

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="home-page-container"> 
      {/* Hero Section */}
      <section className="hero-section bg-secondary text-white py-20 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight font-nunito">
            Bienvenido a <span className="text-primary">Toklen</span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl mb-10 max-w-3xl mx-auto text-toklen-gray-blue">
            La plataforma que conecta a profesionales con clientes de manera rápida y confiable. 
            Encuentra el servicio que necesitas o ofrece tus habilidades.
          </p>
          
          {/* BARRA DE BÚSQUEDA (Placeholder) */}
          <div className="max-w-2xl mx-auto mb-10">
            <div className="flex flex-col sm:flex-row gap-2 p-2 bg-white/10 rounded-xl">
              <input 
                type="text" 
                placeholder="¿Qué servicio necesitas? Ej: Plomero, Electricista..." 
                className="flex-grow px-4 py-3 rounded-lg text-secondary placeholder-neutral/70 focus:ring-2 focus:ring-primary outline-none"
              />
              <button className="btn btn-primary text-base sm:text-lg px-8 py-3">
                Buscar
              </button>
            </div>
          </div>

          {!user ? (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/login?mode=register" 
                className="btn btn-primary text-base sm:text-lg px-10 py-3"
              >
                Comenzar Ahora
              </Link>
              <Link 
                to="/login"
                className="btn btn-outline-light text-base sm:text-lg px-10 py-3"
              >
                Iniciar Sesión
              </Link>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/dashboard" 
                className="btn btn-primary text-base sm:text-lg px-10 py-3"
              >
                Ir al Dashboard
              </Link>
              <Link 
                to="/search-professionals" 
                className="btn btn-outline-light text-base sm:text-lg px-10 py-3"
              >
                Buscar un Servicio
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Sección Cómo Funciona */}
      <section className="how-it-works-section py-16 md:py-24 bg-base-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-secondary text-center mb-4 font-nunito">
            Simple, Rápido y Confiable
          </h2>
          <p className="text-center text-neutral text-lg mb-12 md:mb-16 max-w-2xl mx-auto">
            En Toklen, encontrar o proveer servicios es más fácil que nunca. Sigue estos simples pasos.
          </p>
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {sampleHowItWorks.map((step, index) => (
              <div key={index} className="text-center p-6 bg-base-100 rounded-xl">
                <div className="flex justify-center items-center mb-5 w-20 h-20 rounded-full bg-primary/10 mx-auto">
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold text-secondary mb-2 font-nunito">{step.title}</h3>
                <p className="text-neutral text-sm leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sección Categorías Populares */}
      <section className="categories-section py-16 md:py-24 bg-base-200">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-secondary text-center mb-12 md:mb-16 font-nunito">
            Explora por Categoría
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {sampleCategories.map((category) => (
              <Link 
                to={category.path} 
                key={category.name} 
                className="card-compact p-6 text-center bg-base-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center justify-center aspect-square"
              >
                <div className="text-4xl md:text-5xl mb-3">{category.icon}</div>
                <h3 className="font-semibold text-secondary text-sm md:text-base">{category.name}</h3>
              </Link>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link to="/categories" className="btn btn-outline-primary text-base">
              Ver Todas las Categorías
            </Link>
          </div>
        </div>
      </section>

      {/* Sección CTA para Profesionales */}
      <section className="cta-professionals-section py-16 md:py-24 bg-secondary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 font-nunito">
            ¿Eres un Profesional de Servicios?
          </h2>
          <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto text-toklen-gray-blue">
            Únete a nuestra creciente comunidad de expertos y conecta con cientos de clientes en tu área.
          </p>
          <Link 
            to="/become-professional" 
            className="btn btn-primary text-base sm:text-lg px-10 py-3 transform hover:scale-105"
          >
            Regístrate como Profesional
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;