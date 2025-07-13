import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const sampleCategories = [
  { name: 'Plomería', id: 'plomeria', icon: '/icons/plomeria.png', bg: '/backgrounds/plomeria.jpg' },
  { name: 'Electricidad', id: 'electricidad', icon: '/icons/electricidad.png', bg: '/backgrounds/electricidad.jpg' },
  { name: 'Limpieza', id: 'limpieza', icon: '/icons/limpieza.png', bg: '/backgrounds/limpieza.jpg' },
  { name: 'Carpintería', id: 'carpinteria', icon: '/icons/carpinteria.png', bg: '/backgrounds/carpinteria.jpg' },
  { name: 'Pintura', id: 'pintura', icon: '/icons/pintura.png', bg: '/backgrounds/pintura.jpg' },
  { name: 'Jardinería', id: 'jardineria', icon: '/icons/jardineria.png', bg: '/backgrounds/jardineria.jpg' },
];

const slideImages = [
  '/IMG/FOTO1_ELECTRICISTA.jpg',
  '/IMG/FOTO1_ENFERMERA.jpg',
  '/IMG/FOTO1_FONTANERO.jpg',
  '/IMG/FOTO1_LLAVES.jpg',
  '/IMG/FOTO1_PINTOR.jpg',
];

const Home = () => {
  const { user } = useAuth();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slideImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const buttons = document.querySelectorAll('.swiper-button-next, .swiper-button-prev');
    buttons.forEach((btn) => {
      btn.style.color = '#E94567';
    });
  }, []);

  return (
    <div className="home-page-container">
      {/* Hero Section */}
      <section className="hero-section relative h-[100vh] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={slideImages[currentSlide]}
            alt={`Slide ${currentSlide + 1}`}
            className="w-full h-full object-cover transition-opacity duration-1000"
          />
        </div>

        <div className="relative z-10 flex items-center justify-center h-full px-4">
          <div className="bg-white/10 border border-white/20 backdrop-blur-md text-white p-8 rounded-xl max-w-3xl mx-auto text-center mt-24">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight font-nunito">
              Bienvenido a <span className="text-primary">Toklen</span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl mb-10 max-w-3xl mx-auto text-secondary">
              La plataforma que conecta a profesionales con clientes de manera rápida y confiable. Encuentra el servicio que necesitas o ofrece tus habilidades.
            </p>

            <div className="max-w-2xl mx-auto mb-10">
              <div className="flex flex-col sm:flex-row gap-2 p-2 bg-white/20 rounded-xl">
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
                <Link to="/login?mode=register" className="btn btn-primary text-base sm:text-lg px-10 py-3">
                  Comenzar Ahora
                </Link>
                <Link to="/login" className="btn btn-outline-light text-base sm:text-lg px-10 py-3">
                  Iniciar Sesión
                </Link>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/dashboard" className="btn btn-primary text-base sm:text-lg px-10 py-3">
                  Ir al Dashboard
                </Link>
                <Link to="/browse-services" className="btn btn-outline-light text-base sm:text-lg px-10 py-3"> {/* Cambiado */}
                  Buscar un Servicio
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Cómo Funciona */}
      <section className="how-it-works-section py-16 md:py-24 bg-base-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-secondary text-center mb-4 font-nunito">
            Simple, Rápido y Confiable
          </h2>
          <p className="text-center text-neutral text-lg mb-12 md:mb-16 max-w-2xl mx-auto">
            En Toklen, encontrar o proveer servicios es más fácil que nunca. Sigue estos simples pasos.
          </p>
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {[ 
              { title: '1. Busca', image: '/busca.svg', description: 'Encuentra y compara profesionales calificados cerca de ti para cualquier servicio que necesites.' },
              { title: '2. Conecta', image: '/conecta.svg', description: 'Contacta directamente, revisa perfiles, y agenda el servicio de forma segura y transparente.' },
              { title: '3. Disfruta', image: '/disfruta.svg', description: 'Recibe un servicio de calidad y califica tu experiencia para ayudar a nuestra comunidad a crecer.' },
            ].map((step, index) => (
              <div key={index} className="text-center p-6 bg-base-100 rounded-xl">
                <div className="flex justify-center items-center mb-5 w-24 h-24 rounded-full bg-primary/10 mx-auto overflow-hidden">
                  <img src={step.image} alt={step.title} className="w-[72px] h-[72px] object-contain" />
                </div>
                <h3 className="text-xl font-semibold text-secondary mb-2 font-nunito">{step.title}</h3>
                <p className="text-neutral text-sm leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categorías Populares */}
      <section className="categories-section py-16 md:py-24 bg-base-200">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-secondary text-center mb-12 md:mb-16 font-nunito">
            Explora por Categoría
          </h2>
          {sampleCategories.length > 0 && (
            <Swiper
              modules={[Navigation, Pagination]}
              navigation
              pagination={{ clickable: true }}
              spaceBetween={16}
              breakpoints={{
                0: { slidesPerView: 2 },
                640: { slidesPerView: 2 },
                768: { slidesPerView: 3 },
                1024: { slidesPerView: 4 },
              }}
              className="pb-12"
            >
              {sampleCategories.map((category) => (
                <SwiperSlide key={category.name}>
                  <Link
                    to={`/browse-services?category=${category.id}`} // Enlace a browse-services con filtro de categoría
                    className="relative card-compact text-center rounded-xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center justify-center aspect-square"
                    style={{
                      backgroundImage: `url(${category.bg})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  >
                    <div className="absolute inset-0 bg-black/40 z-0" />
                    <div className="relative z-10 text-white flex flex-col items-center justify-center p-6">
                      <img src={category.icon} alt={category.name} className="w-12 h-12 mb-3 object-contain" />
                      <h3 className="font-semibold text-sm md:text-base">{category.name}</h3>
                    </div>
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
          )}

          <div className="text-center mt-12">
            {/* TODO: Crear página de todas las categorías y habilitar enlace, o hacer que este botón vaya a /browse-services sin filtro */}
            <Link to="/browse-services" className="btn btn-outline-primary text-base"> {/* Cambiado */}
              Ver Todos los Servicios
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Profesionales */}
      <section className="cta-professionals-section py-16 md:py-24 bg-secondary text-white">
        <div
          className="container mx-auto text-center rounded-xl p-8"
          style={{
            backgroundImage: "url('/backgrounds/profesionales.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6 font-nunito">
            ¿Eres un Profesional de Servicios?
          </h2>
          <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto">
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


