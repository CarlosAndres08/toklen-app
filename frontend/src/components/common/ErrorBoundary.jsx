import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    // Actualiza el estado para que la siguiente renderización muestre la UI de error
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    // Registra el error para debugging
    console.error('Error capturado por ErrorBoundary:', error, errorInfo)
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    })

    // Reportar error a servicio de monitoreo (opcional)
    if (import.meta.env.PROD) {
      this.reportErrorToService(error, errorInfo)
    }
  }

  reportErrorToService = (error, errorInfo) => {
    // Aquí integrarías con servicios como Sentry, LogRocket, etc.
    // Ejemplo básico:
    try {
      const errorData = {
        error: error.toString(),
        errorInfo: errorInfo.componentStack,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        url: window.location.href
      }
      
      // Enviar al servicio de logging
      console.error('Error Report:', errorData)
    } catch (reportingError) {
      console.error('Error al reportar error:', reportingError)
    }
  }

  handleReload = () => {
    window.location.reload()
  }

  handleGoHome = () => {
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
            {/* Icon */}
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
              <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>

            {/* Content */}
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              ¡Oops! Algo salió mal
            </h2>
            
            <p className="text-gray-600 mb-6">
              Ha ocurrido un error inesperado. Nuestro equipo ha sido notificado y estamos trabajando para solucionarlo.
            </p>

            {/* Error details (solo en desarrollo) */}
            {import.meta.env.DEV && this.state.error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-left">
                <h3 className="text-sm font-semibold text-red-800 mb-2">
                  Detalles del error:
                </h3>
                <pre className="text-xs text-red-600 overflow-auto max-h-32">
                  {this.state.error.toString()}
                  {this.state.errorInfo && this.state.errorInfo.componentStack}
                </pre>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={this.handleReload}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Recargar página
              </button>
              
              <button
                onClick={this.handleGoHome}
                className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors duration-200"
              >
                Ir al inicio
              </button>
            </div>

            {/* Support */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Si el problema persiste, puedes contactarnos en{' '}
                <a 
                  href="mailto:soporte@toklen.com" 
                  className="text-blue-600 hover:text-blue-700"
                >
                  soporte@toklen.com
                </a>
              </p>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary