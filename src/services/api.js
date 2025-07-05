import axios from 'axios'

// Configuración base de la API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://glow-up-ai-backend-production.up.railway.app/api'

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor para requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor para responses
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Servicios de autenticación
export const authService = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (userData) => api.post('/auth/register', userData),
  getCurrentUser: () => api.get('/auth/me'),
  refreshToken: () => api.post('/auth/refresh'),
  changePassword: (currentPassword, newPassword) => 
    api.post('/auth/change-password', { current_password: currentPassword, new_password: newPassword })
}

// Servicios de usuario
export const userService = {
  getProfile: () => api.get('/user/profile'),
  updateProfile: (userData) => api.put('/user/profile', userData),
  getStats: () => api.get('/user/stats'),
  getSubscription: () => api.get('/user/subscription'),
  deleteAccount: () => api.delete('/user/delete')
}

// Servicios de planes de entrenamiento
export const workoutService = {
  getPlans: () => api.get('/workouts/'),
  getPlan: (id) => api.get(`/workouts/${id}`),
  createPlan: (planData) => api.post('/workouts/', planData),
  updatePlan: (id, planData) => api.put(`/workouts/${id}`, planData),
  deletePlan: (id) => api.delete(`/workouts/${id}`),
  startPlan: (id) => api.post(`/workouts/${id}/start`),
  completePlan: (id) => api.post(`/workouts/${id}/complete`),
  updateProgress: (id, progress) => api.post(`/workouts/${id}/progress`, { progress })
}

// Servicios de planes nutricionales
export const nutritionService = {
  getPlans: () => api.get('/nutrition/'),
  getPlan: (id) => api.get(`/nutrition/${id}`),
  createPlan: (planData) => api.post('/nutrition/', planData),
  updatePlan: (id, planData) => api.put(`/nutrition/${id}`, planData),
  deletePlan: (id) => api.delete(`/nutrition/${id}`),
  calculateCalories: (userData) => api.post('/nutrition/calculate-calories', userData)
}

// Servicios de progreso
export const progressService = {
  getEntries: () => api.get('/progress/'),
  createEntry: (entryData) => api.post('/progress/', entryData),
  updateEntry: (id, entryData) => api.put(`/progress/${id}`, entryData),
  deleteEntry: (id) => api.delete(`/progress/${id}`),
  getStats: () => api.get('/progress/stats'),
  getAnalytics: () => api.get('/progress/analytics'),
  getGoals: () => api.get('/progress/goals')
}

// Servicios de IA
export const aiService = {
  generateWorkoutPlan: (planData) => api.post('/ai/generate-workout', planData),
  generateNutritionPlan: (planData) => api.post('/ai/generate-nutrition', planData),
  chat: (message) => api.post('/ai/chat', { message })
}

export default api

