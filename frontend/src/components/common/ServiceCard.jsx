import React from 'react';
import { Link } from 'react-router-dom';
import { getCategoryLabel, formatPrice } from '../../utils/helpers'; // Asumiendo que estas funciones existen y son adecuadas

// Placeholder para estrellas, similar al de SearchProfessionals
const renderStars = (rating) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  // const hasHalfStar = rating % 1 !== 0; // Para media estrella si se implementa
  
  for (let i = 0; i < 5; i++) {
    stars.push(
      <svg 
        key={i} 
        className={`w-4 h-4 fill-current ${i < fullStars ? 'text-yellow-400' : 'text-gray-300'}`} 
        viewBox="0 0 24 24"
      >
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
    );
  }
  return stars;
};


const ServiceCard = ({ service }) => {
  if (!service) return null;

  const professionalName = service.professional_name || 'Profesional Toklen';
  // Asumiendo que service.id es el ID del servicio y service.professional_id es el ID del profesional.
  // La imagen del profesional no está en los datos de listPublicServices, se podría añadir o usar un placeholder.

  return (
    <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col overflow-hidden rounded-lg">
      {/* Idealmente aquí iría una imagen del servicio o del profesional */}
      <div className="h-40 bg-gray-200 flex items-center justify-center text-gray-400">
        {/* Imagen Placeholder */}
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
      
      <div className="p-5 flex-grow flex flex-col">
        <p className="text-xs text-primary font-semibold uppercase tracking-wider mb-1">
          {getCategoryLabel(service.category) || service.category}
        </p>
        <h3 className="text-lg font-semibold text-secondary leading-tight mb-2 truncate" title={service.title}>
          {service.title}
        </h3>
        
        <div className="flex items-center mb-3">
          <div className="flex items-center">
            {renderStars(service.professional_rating || 0)}
          </div>
          {/* Podríamos añadir número de reseñas si el backend lo provee para el profesional */}
        </div>

        <p className="text-sm text-neutral mb-3 line-clamp-2 flex-grow" title={service.description}>
          {service.description}
        </p>

        <div className="text-xs text-neutral mb-3">
          Ofrecido por: <span className="font-medium text-secondary">{professionalName}</span>
        </div>
        
        <div className="flex justify-between items-center mb-1 text-sm">
          <span className="font-semibold text-primary text-lg">
            {service.budget ? formatPrice(service.budget) : 'Consultar'}
            {service.budget ? <span className="text-xs text-neutral font-normal"> (aprox)</span> : ''}
          </span>
          {/* Aquí podría ir la ubicación del servicio si está disponible y es relevante */}
        </div>
      </div>
      
      <div className="p-4 border-t border-neutral/10 mt-auto">
        <Link
          to={`/service/${service.id}`} // Ruta al detalle del servicio
          className="btn btn-primary w-full text-sm py-2.5"
        >
          Ver Detalles
        </Link>
      </div>
    </div>
  );
};

export default ServiceCard;
