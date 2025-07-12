import React from 'react';

const GlobalSpinner = () => {
  return (
    <div className="fixed inset-0 bg-base-100/80 backdrop-blur-sm flex flex-col items-center justify-center z-[9999]">
      <img 
        src="/logo.png" 
        alt="Cargando Toklen..." 
        className="h-20 w-auto mb-6 animate-pulse" 
      />
      {/* Simple spinner de Tailwind CSS */}
      <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-primary"></div>
      <p className="mt-4 text-lg font-medium text-secondary">Cargando aplicación...</p>
    </div>
  );
};

export default GlobalSpinner;

