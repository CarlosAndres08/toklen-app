import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './hooks/useAuth'
import AuthGuard from './components/auth/AuthGuard'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import Home from './pages/Home'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import ProfessionalRegistration from './pages/ProfessionalRegistration'
import ServiceRequest from './pages/ServiceRequest'
import ServiceDetails from './pages/ServiceDetails'
import Profile from './pages/Profile'
import SearchProfessionals from './pages/SearchProfessionals'
import ErrorBoundary from './components/common/ErrorBoundary'


function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <div className="app">
            <Header />
            <main className="main-content">
              <Routes>
                {/* Rutas públicas */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                
                {/* Rutas protegidas */}
                <Route path="/dashboard" element={
                  <AuthGuard>
                    <Dashboard />
                  </AuthGuard>
                } />
                
                <Route path="/profile" element={
                  <AuthGuard>
                    <Profile />
                  </AuthGuard>
                } />
                
                <Route path="/become-professional" element={
                  <AuthGuard>
                    <ProfessionalRegistration />
                  </AuthGuard>
                } />
                
                <Route path="/request-service" element={
                  <AuthGuard>
                    <ServiceRequest />
                  </AuthGuard>
                } />
                
                <Route path="/search-professionals" element={
                  <AuthGuard>
                    <SearchProfessionals />
                  </AuthGuard>
                } />
                
                <Route path="/service/:id" element={
                  <AuthGuard>
                    <ServiceDetails />
                  </AuthGuard>
                } />
                
                {/* Ruta por defecto */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App