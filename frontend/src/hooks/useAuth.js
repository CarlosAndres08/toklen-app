import { useContext } from 'react'
import AuthContext, { AuthProvider } from '../contexts/AuthContext'

const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider')
  }
  return context
}

export { useAuth, AuthProvider }

