import React, { createContext, useContext, useState, useEffect } from 'react';

// Simulación de Firebase Auth para desarrollo
const mockAuth = {
  currentUser: null,
  
  signInWithEmailAndPassword: async (email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email === 'test@test.com' && password === 'password') {
          const user = {
            uid: 'mock-uid-123',
            email: email,
            displayName: 'Usuario Test',
            getIdToken: async () => 'mock-token-123'
          };
          mockAuth.currentUser = user;
          resolve({ user });
        } else {
          reject(new Error('Credenciales inválidas'));
        }
      }, 1000);
    });
  },
  
  createUserWithEmailAndPassword: async (email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email && password) {
          const user = {
            uid: 'mock-uid-' + Date.now(),
            email: email,
            displayName: email.split('@')[0],
            getIdToken: async () => 'mock-token-' + Date.now()
          };
          mockAuth.currentUser = user;
          resolve({ user });
        } else {
          reject(new Error('Datos inválidos'));
        }
      }, 1000);
    });
  },
  
  signOut: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        mockAuth.currentUser = null;
        resolve();
      }, 500);
    });
  },
  
  onAuthStateChanged: (callback) => {
    // Simular cambio de estado de autenticación
    setTimeout(() => {
      callback(mockAuth.currentUser);
    }, 100);
    
    // Retornar función de limpieza
    return () => {};
  }
};

const AuthContext = createContext({
  currentUser: null,
  login: () => {},
  register: () => {},
  logout: () => {},
  loading: true
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular verificación de estado de autenticación
    const unsubscribe = mockAuth.onAuthStateChanged(user => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      const result = await mockAuth.signInWithEmailAndPassword(email, password);
      setCurrentUser(result.user);
      return result;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email, password, displayName) => {
    try {
      setLoading(true);
      const result = await mockAuth.createUserWithEmailAndPassword(email, password);
      
      // Simular actualización del perfil
      result.user.displayName = displayName;
      setCurrentUser(result.user);
      
      return result;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await mockAuth.signOut();
      setCurrentUser(null);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    currentUser,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;