import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { userService, workoutService, nutritionService, progressService } from '../services/api'
import { 
  Dumbbell, 
  Apple, 
  TrendingUp, 
  Target, 
  Calendar,
  Plus,
  Activity,
  Award
} from 'lucide-react'

const Dashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [recentWorkouts, setRecentWorkouts] = useState([])
  const [recentNutrition, setRecentNutrition] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const [statsRes, workoutsRes, nutritionRes] = await Promise.all([
        userService.getStats(),
        workoutService.getPlans(),
        nutritionService.getPlans()
      ])

      setStats(statsRes.data.stats)
      setRecentWorkouts(workoutsRes.data.plans.slice(0, 3))
      setRecentNutrition(nutritionRes.data.plans.slice(0, 3))
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const quickActions = [
    {
      title: 'Nuevo Plan de Entrenamiento',
      description: 'Genera un plan personalizado con IA',
      icon: <Dumbbell className="h-8 w-8" />,
      link: '/workouts',
      color: 'bg-blue-500'
    },
    {
      title: 'Plan Nutricional',
      description: 'Crea tu dieta personalizada',
      icon: <Apple className="h-8 w-8" />,
      link: '/nutrition',
      color: 'bg-green-500'
    },
    {
      title: 'Registrar Progreso',
      description: 'Actualiza tus medidas y peso',
      icon: <TrendingUp className="h-8 w-8" />,
      link: '/progress',
      color: 'bg-purple-500'
    },
    {
      title: 'Ver Perfil',
      description: 'Actualiza tu información',
      icon: <Target className="h-8 w-8" />,
      link: '/profile',
      color: 'bg-orange-500'
    }
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="container mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            ¡Hola, {user?.name}! 👋
          </h1>
          <p className="text-white/70 text-lg">
            Bienvenido de vuelta a tu dashboard de transformación
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <Dumbbell className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-1">
              {stats?.total_workout_plans || 0}
            </h3>
            <p className="text-gray-600">Planes de Entrenamiento</p>
          </div>

          <div className="card text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-green-100 rounded-full">
                <Apple className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-1">
              {stats?.total_nutrition_plans || 0}
            </h3>
            <p className="text-gray-600">Planes Nutricionales</p>
          </div>

          <div className="card text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-purple-100 rounded-full">
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-1">
              {stats?.total_progress_entries || 0}
            </h3>
            <p className="text-gray-600">Registros de Progreso</p>
          </div>

          <div className="card text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-orange-100 rounded-full">
                <Award className="h-8 w-8 text-orange-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-1">
              {stats?.subscription_type || 'Básico'}
            </h3>
            <p className="text-gray-600">Plan Actual</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Acciones Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                to={action.link}
                className="card hover-lift group cursor-pointer"
              >
                <div className={`${action.color} text-white p-4 rounded-lg mb-4 group-hover:scale-110 transition-transform`}>
                  {action.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {action.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {action.description}
                </p>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Workouts */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">
                Entrenamientos Recientes
              </h3>
              <Link to="/workouts" className="text-blue-600 hover:text-blue-800 text-sm font-semibold">
                Ver todos
              </Link>
            </div>
            {recentWorkouts.length > 0 ? (
              <div className="space-y-4">
                {recentWorkouts.map((workout) => (
                  <div key={workout.id} className="flex items-center p-4 bg-gray-50 rounded-lg">
                    <div className="p-2 bg-blue-100 rounded-lg mr-4">
                      <Dumbbell className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800">{workout.name}</h4>
                      <p className="text-gray-600 text-sm">{workout.description}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm text-gray-500">
                        {workout.status || 'Activo'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Dumbbell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">No tienes planes de entrenamiento aún</p>
                <Link to="/workouts" className="btn btn-primary">
                  Crear tu primer plan
                </Link>
              </div>
            )}
          </div>

          {/* Recent Nutrition */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">
                Planes Nutricionales
              </h3>
              <Link to="/nutrition" className="text-green-600 hover:text-green-800 text-sm font-semibold">
                Ver todos
              </Link>
            </div>
            {recentNutrition.length > 0 ? (
              <div className="space-y-4">
                {recentNutrition.map((nutrition) => (
                  <div key={nutrition.id} className="flex items-center p-4 bg-gray-50 rounded-lg">
                    <div className="p-2 bg-green-100 rounded-lg mr-4">
                      <Apple className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800">{nutrition.name}</h4>
                      <p className="text-gray-600 text-sm">
                        {nutrition.daily_calories} cal/día
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm text-gray-500">
                        {nutrition.status || 'Activo'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Apple className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">No tienes planes nutricionales aún</p>
                <Link to="/nutrition" className="btn btn-primary">
                  Crear tu primer plan
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

