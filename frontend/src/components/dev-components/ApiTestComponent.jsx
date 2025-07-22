import React, { useState, useEffect } from 'react'
import { apiService, apiUtils } from '../services/api'

const ApiTestComponent = () => {
  const [connectionStatus, setConnectionStatus] = useState('checking')
  const [healthInfo, setHealthInfo] = useState(null)
  const [testResults, setTestResults] = useState({})
  const [loading, setLoading] = useState(false)

  // Verificar conexión al cargar el componente
  useEffect(() => {
    checkApiConnection()
  }, [])

  const checkApiConnection = async () => {
    setLoading(true)
    try {
      const isConnected = await apiUtils.checkConnection()
      setConnectionStatus(isConnected ? 'connected' : 'disconnected')
      
      if (isConnected) {
        const healthData = await apiUtils.getHealthInfo()
        setHealthInfo(healthData)
      }
    } catch (error) {
      setConnectionStatus('error')
      console.error('Error checking connection:', error)
    } finally {
      setLoading(false)
    }
  }

  const runApiTest = async (testName, apiCall) => {
    setTestResults(prev => ({
      ...prev,
      [testName]: { status: 'running', result: null, error: null }
    }))

    try {
      const result = await apiCall()
      setTestResults(prev => ({
        ...prev,
        [testName]: { status: 'success', result, error: null }
      }))
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        [testName]: { 
          status: 'error', 
          result: null, 
          error: apiUtils.handleApiError(error)
        }
      }))
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'connected':
      case 'success':
        return 'text-green-600'
      case 'disconnected':
      case 'error':
        return 'text-red-600'
      case 'running':
      case 'checking':
        return 'text-yellow-600'
      default:
        return 'text-gray-600'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'connected':
      case 'success':
        return '✅'
      case 'disconnected':
      case 'error':
        return '❌'
      case 'running':
      case 'checking':
        return '🔄'
      default:
        return '⚪'
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        🧪 Pruebas de Conexión API
      </h2>

      {/* Estado de Conexión */}
      <div className="mb-6 p-4 border rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Estado de Conexión</h3>
        <div className={`flex items-center space-x-2 ${getStatusColor(connectionStatus)}`}>
          <span className="text-xl">{getStatusIcon(connectionStatus)}</span>
          <span className="font-medium">
            {connectionStatus === 'connected' && 'API Conectada'}
            {connectionStatus === 'disconnected' && 'API Desconectada'}
            {connectionStatus === 'checking' && 'Verificando conexión...'}
            {connectionStatus === 'error' && 'Error de conexión'}
          </span>
        </div>
        
        <button
          onClick={checkApiConnection}
          disabled={loading}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Verificando...' : 'Verificar Conexión'}
        </button>
      </div>

      {/* Información de Salud */}
      {healthInfo && (
        <div className="mb-6 p-4 border rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Información del Servidor</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Estado:</strong> {healthInfo.health?.status || 'N/A'}
            </div>
            <div>
              <strong>Entorno:</strong> {healthInfo.health?.environment || 'N/A'}
            </div>
            <div>
              <strong>Base de Datos:</strong> {healthInfo.health?.database || 'N/A'}
            </div>
            <div>
              <strong>Tiempo:</strong> {healthInfo.health?.timestamp || 'N/A'}
            </div>
          </div>
        </div>
      )}

      {/* Pruebas de API */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Pruebas de Endpoints</h3>
        
        {/* Ping Test */}
        <div className="p-4 border rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium">Ping Test</span>
            <button
              onClick={() => runApiTest('ping', apiService.ping)}
              className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
            >
              Probar
            </button>
          </div>
          {testResults.ping && (
            <div className={`text-sm ${getStatusColor(testResults.ping.status)}`}>
              <span>{getStatusIcon(testResults.ping.status)}</span>
              {testResults.ping.status === 'success' && (
                <span> Respuesta: {JSON.stringify(testResults.ping.result)}</span>
              )}
              {testResults.ping.status === 'error' && (
                <span> Error: {testResults.ping.error}</span>
              )}
            </div>
          )}
        </div>

        {/* Categories Test */}
        <div className="p-4 border rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium">Obtener Categorías</span>
            <button
              onClick={() => runApiTest('categories', apiService.getCategories)}
              className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
            >
              Probar
            </button>
          </div>
          {testResults.categories && (
            <div className={`text-sm ${getStatusColor(testResults.categories.status)}`}>
              <span>{getStatusIcon(testResults.categories.status)}</span>
              {testResults.categories.status === 'success' && (
                <div className="mt-2">
                  <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
                    {JSON.stringify(testResults.categories.result, null, 2)}
                  </pre>
                </div>
              )}
              {testResults.categories.status === 'error' && (
                <span> Error: {testResults.categories.error}</span>
              )}
            </div>
          )}
        </div>

        {/* Services Test */}
        <div className="p-4 border rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium">Obtener Servicios</span>
            <button
              onClick={() => runApiTest('services', apiService.getServices)}
              className="px-3 py-1 bg-purple-500 text-white rounded text-sm hover:bg-purple-600"
            >
              Probar
            </button>
          </div>
          {testResults.services && (
            <div className={`text-sm ${getStatusColor(testResults.services.status)}`}>
              <span>{getStatusIcon(testResults.services.status)}</span>
              {testResults.services.status === 'success' && (
                <div className="mt-2">
                  <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
                    {JSON.stringify(testResults.services.result, null, 2)}
                  </pre>
                </div>
              )}
              {testResults.services.status === 'error' && (
                <span> Error: {testResults.services.error}</span>
              )}
            </div>
          )}
        </div>

        {/* Probar Todos */}
        <div className="pt-4 border-t">
          <button
            onClick={() => {
              runApiTest('ping', apiService.ping)
              runApiTest('categories', apiService.getCategories)
              runApiTest('services', apiService.getServices)
            }}
            className="w-full px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
          >
            🚀 Ejecutar Todas las Pruebas
          </button>
        </div>
      </div>
    </div>
  )
}

export default ApiTestComponent

