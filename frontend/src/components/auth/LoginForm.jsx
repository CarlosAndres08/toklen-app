import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { useNavigate } from 'react-router-dom'

const LoginForm = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const { loginWithGoogle, loginWithEmail } = useAuth()
  const navigate = useNavigate()

  const handleGoogleLogin = async () => {
    try {
      setLoading(true)
      setError('')
      await loginWithGoogle()
      navigate('/dashboard')
    } catch (error) {
      setError('Error al iniciar sesión con Google')
    } finally {
      setLoading(false)
    }
  }

  const handleEmailLogin = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      setError('')
      await loginWithEmail(email, password)
      navigate('/dashboard')
    } catch (error) {
      setError('Credenciales inválidas')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-form">
      <h2>Iniciar Sesión en Toklen</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleEmailLogin}>
        <div className="form-group">
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        <button type="submit" disabled={loading}>
          {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </button>
      </form>
      
      <div className="divider">
        <span>O</span>
      </div>
      
      <button 
        onClick={handleGoogleLogin} 
        disabled={loading}
        className="google-login-btn"
      >
        {loading ? 'Conectando...' : 'Continuar con Google'}
      </button>
    </div>
  )
}

export default LoginForm