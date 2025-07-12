import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-base-200 text-center px-4">
      <div className="max-w-md">
        <img 
          src="/logo.png" // O alguna imagen específica para 404
          alt="Logo Toklen" 
          className="mx-auto h-20 w-auto mb-8 opacity-80" 
        />
        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-3xl font-semibold text-secondary mb-6">Página No Encontrada</h2>
        <p className="text-neutral mb-8 text-lg">
          Lo sentimos, la página que estás buscando no existe o ha sido movida.
        </p>
        <Link
          to="/"
          className="btn btn-primary text-lg px-8 py-3"
        >
          Volver al Inicio
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;

