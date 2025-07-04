import React from 'react'

const LoadingSpinner = ({ 
  size = 'md', 
  color = 'blue', 
  text = 'Cargando...', 
  fullScreen = false,
  overlay = false 
}) => {
  // Tamaños del spinner
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  }

  // Colores del spinner
  const colors = {
    blue: 'text-blue-600',
    gray: 'text-gray-600',
    green: 'text-green-600',
    red: 'text-red-600',
    yellow: 'text-yellow-600',
    indigo: 'text-indigo-600',
    purple: 'text-purple-600',
    pink: 'text-pink-600'
  }

  const spinnerElement = (
    <div className="flex flex-col items-center justify-center space-y-3">
      {/* Spinner */}
      <div className="relative">
        <div className={`${sizes[size]} ${colors[color]} animate-spin`}>
          <svg className="w-full h-full" viewBox="0 0 24 24" fill="none">
            <circle 
              className="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4"
            />
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>
      </div>
      
      {/* Text */}
      {text && (
        <div className={`text-sm ${colors[color]} font-medium`}>
          {text}
        </div>
      )}
    </div>
  )

  // Pantalla completa
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
        {spinnerElement}
      </div>
    )
  }

  // Con overlay
  if (overlay) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          {spinnerElement}
        </div>
      </div>
    )
  }

  // Normal
  return (
    <div className="flex items-center justify-center p-4">
      {spinnerElement}
    </div>
  )
}

// Componente para mostrar loading en línea
export const InlineLoader = ({ text = 'Cargando...', size = 'sm' }) => {
  return (
    <div className="flex items-center space-x-2">
      <div className={`${size === 'sm' ? 'h-4 w-4' : 'h-6 w-6'} animate-spin text-blue-600`}>
        <svg className="w-full h-full" viewBox="0 0 24 24" fill="none">
          <circle 
            className="opacity-25" 
            cx="12" 
            cy="12" 
            r="10" 
            stroke="currentColor" 
            strokeWidth="4"
          />
          <path 
            className="opacity-75" 
            fill="currentColor" 
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </div>
      <span className="text-sm text-gray-600">{text}</span>
    </div>
  )
}

// Componente para skeleton loading
export const SkeletonLoader = ({ lines = 3, className = '' }) => {
  return (
    <div className={`animate-pulse ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <div key={index} className="mb-2">
          <div className="h-4 bg-gray-300 rounded-lg" style={{
            width: `${Math.random() * 40 + 60}%`
          }} />
        </div>
      ))}
    </div>
  )
}

// Componente para card loading
export const CardLoader = ({ count = 1 }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="bg-white p-6 rounded-lg shadow-sm border animate-pulse">
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 bg-gray-300 rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-300 rounded w-3/4" />
              <div className="h-3 bg-gray-300 rounded w-1/2" />
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <div className="h-3 bg-gray-300 rounded" />
            <div className="h-3 bg-gray-300 rounded w-5/6" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default LoadingSpinner