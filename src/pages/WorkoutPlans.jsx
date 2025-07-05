import React, { useState, useEffect } from 'react'
import { workoutService, aiService } from '../services/api'
import { Dumbbell, Plus, Play, Trash2, Edit, Target } from 'lucide-react'

const WorkoutPlans = () => {
  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [formData, setFormData] = useState({
    fitness_goal: 'muscle_gain',
    activity_level: 'beginner',
    duration_weeks: 4
  })

  useEffect(() => {
    loadPlans()
  }, [])

  const loadPlans = async () => {
    try {
      const response = await workoutService.getPlans()
      setPlans(response.data.plans)
    } catch (error) {
      console.error('Error loading plans:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreatePlan = async (e) => {
    e.preventDefault()
    setCreating(true)

    try {
      const response = await aiService.generateWorkoutPlan(formData)
      setPlans([response.data.plan, ...plans])
      setShowCreateForm(false)
      setFormData({
        fitness_goal: 'muscle_gain',
        activity_level: 'beginner',
        duration_weeks: 4
      })
    } catch (error) {
      console.error('Error creating plan:', error)
    } finally {
      setCreating(false)
    }
  }

  const handleDeletePlan = async (planId) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este plan?')) return

    try {
      await workoutService.deletePlan(planId)
      setPlans(plans.filter(plan => plan.id !== planId))
    } catch (error) {
      console.error('Error deleting plan:', error)
    }
  }

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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Planes de Entrenamiento
            </h1>
            <p className="text-white/70">
              Planes personalizados generados por IA para alcanzar tus objetivos
            </p>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="btn btn-primary flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Nuevo Plan</span>
          </button>
        </div>

        {/* Create Form Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="card max-w-md w-full">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Crear Nuevo Plan de Entrenamiento
              </h2>
              
              <form onSubmit={handleCreatePlan} className="space-y-4">
                <div className="form-group">
                  <label className="form-label">Objetivo de Fitness</label>
                  <select
                    value={formData.fitness_goal}
                    onChange={(e) => setFormData({...formData, fitness_goal: e.target.value})}
                    className="form-input"
                  >
                    <option value="weight_loss">Pérdida de Peso</option>
                    <option value="muscle_gain">Ganancia Muscular</option>
                    <option value="endurance">Resistencia</option>
                    <option value="strength">Fuerza</option>
                    <option value="general_fitness">Fitness General</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Nivel de Actividad</label>
                  <select
                    value={formData.activity_level}
                    onChange={(e) => setFormData({...formData, activity_level: e.target.value})}
                    className="form-input"
                  >
                    <option value="beginner">Principiante</option>
                    <option value="intermediate">Intermedio</option>
                    <option value="advanced">Avanzado</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Duración (semanas)</label>
                  <select
                    value={formData.duration_weeks}
                    onChange={(e) => setFormData({...formData, duration_weeks: parseInt(e.target.value)})}
                    className="form-input"
                  >
                    <option value={2}>2 semanas</option>
                    <option value={4}>4 semanas</option>
                    <option value={8}>8 semanas</option>
                    <option value={12}>12 semanas</option>
                  </select>
                </div>

                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="btn btn-secondary flex-1"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={creating}
                    className="btn btn-primary flex-1 flex items-center justify-center"
                  >
                    {creating ? (
                      <>
                        <div className="loading mr-2"></div>
                        Generando...
                      </>
                    ) : (
                      'Crear Plan'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Plans Grid */}
        {plans.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div key={plan.id} className="card hover-lift">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Dumbbell className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleDeletePlan(plan.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {plan.name}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {plan.description}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Dificultad:</span>
                    <span className="font-semibold capitalize">{plan.difficulty}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Progreso:</span>
                    <span className="font-semibold">{plan.progress || 0}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Estado:</span>
                    <span className={`font-semibold ${
                      plan.status === 'active' ? 'text-green-600' : 
                      plan.status === 'completed' ? 'text-blue-600' : 'text-gray-600'
                    }`}>
                      {plan.status === 'active' ? 'Activo' : 
                       plan.status === 'completed' ? 'Completado' : 'Inactivo'}
                    </span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button className="btn btn-primary flex-1 flex items-center justify-center space-x-2">
                    <Play className="h-4 w-4" />
                    <span>Iniciar</span>
                  </button>
                  <button className="btn btn-secondary flex items-center justify-center">
                    <Edit className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="glass p-12 rounded-2xl max-w-md mx-auto">
              <Dumbbell className="h-16 w-16 text-white/50 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-white mb-4">
                No tienes planes de entrenamiento
              </h3>
              <p className="text-white/70 mb-6">
                Crea tu primer plan personalizado con IA y comienza tu transformación
              </p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="btn btn-primary flex items-center space-x-2 mx-auto"
              >
                <Plus className="h-5 w-5" />
                <span>Crear mi primer plan</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default WorkoutPlans

