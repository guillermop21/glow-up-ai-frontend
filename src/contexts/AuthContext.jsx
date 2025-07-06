import React, { createContext, useContext, useState, useEffect } from 'react'
import { api } from '../services/api'

export const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState(localStorage.getItem('token'))

  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      getCurrentUser()
    } else {
      setLoading(false)
    }
  }, [token])

  const getCurrentUser = async () => {
    try {
      const response = await api.get('/auth/me')
      setUser(response.data.user)
    } catch (error) {
      console.error('Error getting current user:', error)
      logout()
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      console.log('Intentando login con:', { email })
      const response = await api.post('/auth/login', { email, password })
      const { access_token, user } = response.data
      
      setToken(access_token)
      setUser(user)
      localStorage.setItem('token', access_token)
      api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
      
      return { success: true, user }
    } catch (error) {
      console.error('Error en login:', error)
      const message = error.response?.data?.error || error.message || 'Error al iniciar sesión'
      return { success: false, error: message }
    }
  }

  const register = async (userData) => {
    try {
      console.log('Intentando registro con:', { 
        name: userData.name, 
        email: userData.email,
        url: api.defaults.baseURL + '/auth/register'
      })
      
      const response = await api.post('/auth/register', userData)
      console.log('Respuesta del registro:', response.data)
      
      const { access_token, user } = response.data
      
      setToken(access_token)
      setUser(user)
      localStorage.setItem('token', access_token)
      api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
      
      return { success: true, user }
    } catch (error) {
      console.error('Error completo en registro:', error)
      console.error('Error response:', error.response)
      console.error('Error request:', error.request)
      
      let message = 'Error al registrarse'
      
      if (error.response) {
        // El servidor respondió con un código de error
        message = error.response.data?.error || error.response.data?.message || `Error ${error.response.status}`
      } else if (error.request) {
        // La solicitud se hizo pero no se recibió respuesta
        message = 'No se pudo conectar con el servidor. Verifica tu conexión a internet.'
      } else {
        // Algo más pasó
        message = error.message || 'Error desconocido'
      }
      
      return { success: false, error: message }
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('token')
    delete api.defaults.headers.common['Authorization']
  }

  const updateUser = (userData) => {
    setUser(prev => ({ ...prev, ...userData }))
  }

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
