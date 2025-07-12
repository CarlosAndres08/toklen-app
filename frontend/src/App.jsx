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
import AdminGuard from './components/auth/AdminGuard' // Importar AdminGuard
import AdminDashboardPage from './pages/admin/AdminDashboardPage' // Importar páginas de Admin
import UserListPage from './pages/admin/UserListPage'
import ServiceListPageAdmin from './pages/admin/ServiceListPageAdmin'
import NotFoundPage from './pages/NotFoundPage';
import BrowseServicesPage from './pages/BrowseServicesPage'; // Importar BrowseServicesPage
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <div className="app">
            <Header />
            <main className="main-content">
              <ToastContainer 
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored" // o "light" o "dark"
              />
              <Routes>
                {/* Rutas públicas */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/browse-services" element={<BrowseServicesPage />} /> 
                
                {/* Rutas protegidas por Autenticación General */}
                <Route path="/dashboard" element={<AuthGuard><Dashboard /></AuthGuard>} />
                <Route path="/profile" element={<AuthGuard><Profile /></AuthGuard>} />
                <Route path="/become-professional" element={<AuthGuard><ProfessionalRegistration /></AuthGuard>} />
                <Route path="/request-service" element={<AuthGuard><ServiceRequest /></AuthGuard>} />
                <Route path="/search-professionals" element={<AuthGuard><SearchProfessionals /></AuthGuard>} />
                <Route path="/service/:id" element={<AuthGuard><ServiceDetails /></AuthGuard>} />

                {/* Rutas de Administración (protegidas por AdminGuard) */}
                <Route path="/admin" element={<AdminGuard><AdminDashboardPage /></AdminGuard>} />
                <Route path="/admin/users" element={<AdminGuard><UserListPage /></AdminGuard>} />
                <Route path="/admin/services" element={<AdminGuard><ServiceListPageAdmin /></AdminGuard>} />
                
                {/* Ruta por defecto (404) */}
                <Route path="*" element={<NotFoundPage />} />
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