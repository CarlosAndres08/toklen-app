import React from 'react';

const Spinner = ({ size = 'md', text = null, className = '' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-4',
    lg: 'w-16 h-16 border-4',
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div 
        className={`border-dashed rounded-full animate-spin border-primary ${sizeClasses[size] || sizeClasses.md}`}
      ></div>
      {text && <p className="mt-3 text-sm text-secondary">{text}</p>}
    </div>
  );
};

export default Spinner;

