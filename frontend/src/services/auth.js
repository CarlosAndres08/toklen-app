import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  sendEmailVerification
} from 'firebase/auth'
import { auth } from './firebase-config'

// Proveedor de Google
import { googleProvider } from './firebase-config'


// Servicios de autenticación
export const authService = {
  // Login con email y contraseña
  loginWithEmail: async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      return { user: userCredential.user, error: null }
    } catch (error) {
      return { user: null, error: error.message }
    }
  },

  // Registro con email y contraseña
  registerWithEmail: async (email, password, displayName) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      
      // Actualizar perfil con nombre
      if (displayName) {
        await updateProfile(userCredential.user, { displayName })
      }
      
      // Enviar email de verificación
      await sendEmailVerification(userCredential.user)
      
      return { user: userCredential.user, error: null }
    } catch (error) {
      return { user: null, error: error.message }
    }
  },

  // Login con Google
  loginWithGoogle: async () => {
    try {
      const userCredential = await signInWithPopup(auth, googleProvider)
      return { user: userCredential.user, error: null }
    } catch (error) {
      return { user: null, error: error.message }
    }
  },

  // Cerrar sesión
  logout: async () => {
    try {
      await signOut(auth)
      return { error: null }
    } catch (error) {
      return { error: error.message }
    }
  },

  // Restablecer contraseña
  resetPassword: async (email) => {
    try {
      await sendPasswordResetEmail(auth, email)
      return { error: null }
    } catch (error) {
      return { error: error.message }
    }
  },

  // Obtener usuario actual
  getCurrentUser: () => {
    return auth.currentUser
  },

  // Obtener token del usuario
  getIdToken: async () => {
    try {
      const user = auth.currentUser
      if (user) {
        return await user.getIdToken()
      }
      return null
    } catch (error) {
      console.error('Error obteniendo token:', error)
      return null
    }
  },

  // Escuchar cambios en el estado de autenticación
  onAuthStateChanged: (callback) => {
    return onAuthStateChanged(auth, callback)
  },

  // Actualizar perfil
  updateUserProfile: async (updates) => {
    try {
      const user = auth.currentUser
      if (user) {
        await updateProfile(user, updates)
        return { error: null }
      }
      return { error: 'No hay usuario autenticado' }
    } catch (error) {
      return { error: error.message }
    }
  },

  // Reenviar email de verificación
  resendVerificationEmail: async () => {
    try {
      const user = auth.currentUser
      if (user) {
        await sendEmailVerification(user)
        return { error: null }
      }
      return { error: 'No hay usuario autenticado' }
    } catch (error) {
      return { error: error.message }
    }
  }
}

export default authService