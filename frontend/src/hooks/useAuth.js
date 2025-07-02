import { useState, useEffect, useContext, createContext } from 'react'
import { 
  signInWithPopup, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth'
import { auth, googleProvider } from '../services/firebase-config'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Obtener token y enviarlo al backend
        const token = await user.getIdToken()
        localStorage.setItem('authToken', token)
        setUser(user)
      } else {
        localStorage.removeItem('authToken')
        setUser(null)
      }
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider)
      return result.user
    } catch (error) {
      throw error
    }
  }

  const loginWithEmail = async (email, password) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password)
      return result.user
    } catch (error) {
      throw error
    }
  }

  const registerWithEmail = async (email, password) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password)
      return result.user
    } catch (error) {
      throw error
    }
  }

  const logout = async () => {
    try {
      await signOut(auth)
      localStorage.removeItem('authToken')
    } catch (error) {
      throw error
    }
  }

  const value = {
    user,
    loading,
    loginWithGoogle,
    loginWithEmail,
    registerWithEmail,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}