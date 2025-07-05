import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Menu, X, User, LogOut, Dumbbell } from 'lucide-react'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { user, logout, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/')
    setIsOpen(false)
  }

  const isActive = (path) => location.pathname === path

  const publicLinks = [
    { path: '/', label: 'Inicio' },
    { path: '/login', label: 'Iniciar Sesión' },
    { path: '/register', label: 'Registrarse' }
  ]

  const privateLinks = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/workouts', label: 'Entrenamientos' },
    { path: '/nutrition', label: 'Nutrición' },
    { path: '/progress', label: 'Progreso' },
    { path: '/profile', label: 'Perfil' }
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 text-white font-bold text-xl">
            <Dumbbell className="h-8 w-8" />
            <span>Glow-Up AI</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {isAuthenticated ? (
              <>
                {privateLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`text-white hover:text-blue-200 transition-colors ${
                      isActive(link.path) ? 'text-blue-200 font-semibold' : ''
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="flex items-center space-x-4">
                  <span className="text-white text-sm">
                    Hola, {user?.name}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 text-white hover:text-red-200 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Salir</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                {publicLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`text-white hover:text-blue-200 transition-colors ${
                      isActive(link.path) ? 'text-blue-200 font-semibold' : ''
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-blue-200 transition-colors"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white/10 backdrop-blur-md rounded-lg mt-2">
              {isAuthenticated ? (
                <>
                  <div className="px-3 py-2 text-white text-sm border-b border-white/20">
                    Hola, {user?.name}
                  </div>
                  {privateLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setIsOpen(false)}
                      className={`block px-3 py-2 text-white hover:bg-white/10 rounded transition-colors ${
                        isActive(link.path) ? 'bg-white/20 font-semibold' : ''
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 text-white hover:bg-red-500/20 rounded transition-colors flex items-center space-x-2"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Cerrar Sesión</span>
                  </button>
                </>
              ) : (
                <>
                  {publicLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setIsOpen(false)}
                      className={`block px-3 py-2 text-white hover:bg-white/10 rounded transition-colors ${
                        isActive(link.path) ? 'bg-white/20 font-semibold' : ''
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar

