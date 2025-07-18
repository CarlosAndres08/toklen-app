import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  signInWithPopup,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';
import { auth, googleProvider } from '../services/firebase-config';
import { syncUserWithBackend } from '../services/userService';
import { apiService } from '../services/api'; // CAMBIO AQUI: Importar apiService
import GlobalSpinner from '../components/common/GlobalSpinner';
import { toast } from 'react-toastify';

// Mensajes de error
const getFirebaseAuthErrorMessage = (errorCode) => {
  switch (errorCode) {
    case 'auth/invalid-email':
      return 'El formato del correo electrónico no es válido.';
    case 'auth/user-disabled':
      return 'Este usuario ha sido deshabilitado.';
    case 'auth/user-not-found':
      return 'No se encontró ningún usuario con este correo electrónico.';
    case 'auth/wrong-password':
      return 'La contraseña es incorrecta.';
    case 'auth/email-already-in-use':
      return 'Este correo electrónico ya está en uso por otra cuenta.';
    case 'auth/operation-not-allowed':
      return 'El inicio de sesión con correo y contraseña no está habilitado.';
    case 'auth/weak-password':
      return 'La contraseña es demasiado débil. Debe tener al menos 6 caracteres.';
    default:
      return 'Ocurrió un error de autenticación. Inténtalo de nuevo más tarde.';
  }
};

// Contexto base
const AuthContext = createContext({
  currentUser: null,
  login: async () => ({ success: false, error: 'Not implemented' }),
  register: async () => ({ success: false, error: 'Not implemented' }),
  logout: async () => {},
  loginWithGoogle: async () => ({ success: false, error: 'Not implemented' }),
  resetPassword: async () => ({ success: false, error: 'Not implemented' }),
  loading: true,
  error: null,
  setError: () => {},
  isAuthenticated: false,
});

// Hook personalizado
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  }
  return context;
};

// Provider
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          // CAMBIO AQUI: Usar apiService.getProfile()
          const response = await apiService.getProfile(); 
          setUserProfile(response.data.user);
        } catch (err) {
          console.error("Error fetching user profile after auth state change:", err);
          setUserProfile(null);
        }
      } else {
        setUserProfile(null);
      }
      setLoading(false);
      setError(null);
    });
    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      if (userCredential.user) {
        // CAMBIO AQUI: Usar apiService.login() si fuera necesario sincronizar
        // Actualmente syncUserWithBackend es suficiente para el backend
        const syncResponse = await syncUserWithBackend();
        if (syncResponse.success && syncResponse.data.user) {
          setUserProfile(syncResponse.data.user);
          toast.success(`¡Bienvenido de nuevo, ${syncResponse.data.user.display_name || 'Usuario'}!`);
        } else {
          setUserProfile(null);
          toast.warn('Login exitoso, pero hubo un problema al sincronizar tu perfil.');
        }
      }
      return { success: true, user: userCredential.user };
    } catch (err) {
      const friendlyError = getFirebaseAuthErrorMessage(err.code);
      setError(friendlyError);
      return { success: false, error: friendlyError };
    } finally {
      setLoading(false);
    }
  };

  const register = async (email, password, displayName) => {
    setLoading(true);
    setError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName });
      setCurrentUser(prev => ({ ...prev, ...userCredential.user, displayName }));

      // CAMBIO AQUI: Usar apiService.register() si fuera necesario sincronizar
      // Actualmente syncUserWithBackend es suficiente para el backend
      const syncResponse = await syncUserWithBackend();
      if (syncResponse.success && syncResponse.data.user) {
        setUserProfile(syncResponse.data.user);
        toast.success(`¡Registro exitoso, ${syncResponse.data.user.display_name}!`);
      } else {
        setUserProfile(null);
        toast.warn('Registro exitoso, pero hubo un problema al crear tu perfil local.');
      }

      return { success: true, user: { ...userCredential.user, displayName } };
    } catch (err) {
      const friendlyError = getFirebaseAuthErrorMessage(err.code);
      setError(friendlyError);
      return { success: false, error: friendlyError };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    setError(null);
    try {
      await signOut(auth);
      setUserProfile(null);
      toast.info('Has cerrado sesión.');
    } catch (err) {
      console.error("Error al cerrar sesión:", err);
      toast.error("Error al cerrar sesión.");
      setError("Error al cerrar sesión.");
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user) {
        // CAMBIO AQUI: Usar apiService.loginWithGoogle() si fuera necesario sincronizar
        // Actualmente syncUserWithBackend es suficiente para el backend
        const syncResponse = await syncUserWithBackend();
        if (syncResponse.success && syncResponse.data.user) {
          setUserProfile(syncResponse.data.user);
          toast.success(`¡Hola, ${syncResponse.data.user.display_name || 'Usuario'}!`);
        } else {
          setUserProfile(null);
          toast.warn('Inicio con Google exitoso, pero hubo un problema con tu perfil.');
        }
      }
      return { success: true, user: result.user };
    } catch (err) {
      const friendlyError = getFirebaseAuthErrorMessage(err.code);
      setError(friendlyError);
      return { success: false, error: friendlyError };
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email) => {
    setLoading(true);
    setError(null);
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success('Si tu correo está registrado, recibirás un enlace para restablecer tu contraseña.');
      return { success: true };
    } catch (err) {
      const friendlyError = getFirebaseAuthErrorMessage(err.code);
      setError(friendlyError);
      return { success: false, error: friendlyError };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    currentUser,
    userProfile,
    isAuthenticated: !!currentUser,
    login,
    register,
    logout,
    loginWithGoogle,
    resetPassword,
    loading,
    error,
    setError
  };

  return (
    <AuthContext.Provider value={value}>
      {loading && <GlobalSpinner />}
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;


