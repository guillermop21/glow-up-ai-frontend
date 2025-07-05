import React, { useState, useEffect } from 'react'
import { nutritionService, aiService } from '../services/api'
import { Apple, Plus, Calculator, Trash2, Edit } from 'lucide-react'

const NutritionPlans = () => {
  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showCalorieCalculator, setShowCalorieCalculator] = useState(false)
  const [calorieResult, setCalorieResult] = useState(null)
  const [formData, setFormData] = useState({
    goal: 'weight_loss',
    dietary_restrictions: '',
    daily_calories: 2000
  })
  const [calculatorData, setCalculatorData] = useState({
    age: '',
    gender: 'male',
    height: '',
    weight: '',
    activity_level: 'moderate'
  })

  useEffect(() => {
    loadPlans()
  }, [])

  const loadPlans = async () => {
    try {
      const response = await nutritionService.getPlans()
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
      const response = await aiService.generateNutritionPlan(formData)
      setPlans([response.data.plan, ...plans])
      setShowCreateForm(false)
      setFormData({
        goal: 'weight_loss',
        dietary_restrictions: '',
        daily_calories: 2000
      })
    } catch (error) {
      console.error('Error creating plan:', error)
    } finally {
      setCreating(false)
    }
  }

  const handleCalculateCalories = async (e) => {
    e.preventDefault()
    try {
      const response = await nutritionService.calculateCalories(calculatorData)
      setCalorieResult(response.data)
    } catch (error) {
      console.error('Error calculating calories:', error)
    }
  }

  const handleDeletePlan = async (planId) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este plan?')) return

    try {
      await nutritionService.deletePlan(planId)
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
              Planes Nutricionales
            </h1>
            <p className="text-white/70">
              Dietas personalizadas con cálculo de macronutrientes
            </p>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => setShowCalorieCalculator(true)}
              className="btn btn-secondary flex items-center space-x-2"
            >
              <Calculator className="h-5 w-5" />
              <span>Calcular Calorías</span>
            </button>
            <button
              onClick={() => setShowCreateForm(true)}
              className="btn btn-primary flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Nuevo Plan</span>
            </button>
          </div>
        </div>

        {/* Calorie Calculator Modal */}
        {showCalorieCalculator && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="card max-w-md w-full">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Calculadora de Calorías
              </h2>
              
              <form onSubmit={handleCalculateCalories} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="form-label">Edad</label>
                    <input
                      type="number"
                      value={calculatorData.age}
                      onChange={(e) => setCalculatorData({...calculatorData, age: e.target.value})}
                      className="form-input"
                      placeholder="25"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Género</label>
                    <select
                      value={calculatorData.gender}
                      onChange={(e) => setCalculatorData({...calculatorData, gender: e.target.value})}
                      className="form-input"
                    >
                      <option value="male">Masculino</option>
                      <option value="female">Femenino</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="form-label">Altura (cm)</label>
                    <input
                      type="number"
                      value={calculatorData.height}
                      onChange={(e) => setCalculatorData({...calculatorData, height: e.target.value})}
                      className="form-input"
                      placeholder="170"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Peso (kg)</label>
                    <input
                      type="number"
                      value={calculatorData.weight}
                      onChange={(e) => setCalculatorData({...calculatorData, weight: e.target.value})}
                      className="form-input"
                      placeholder="70"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Nivel de Actividad</label>
                  <select
                    value={calculatorData.activity_level}
                    onChange={(e) => setCalculatorData({...calculatorData, activity_level: e.target.value})}
                    className="form-input"
                  >
                    <option value="sedentary">Sedentario</option>
                    <option value="light">Ligero</option>
                    <option value="moderate">Moderado</option>
                    <option value="active">Activo</option>
                    <option value="very_active">Muy Activo</option>
                  </select>
                </div>

                {calorieResult && (
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="font-bold text-green-800 mb-2">Resultados:</h3>
                    <div className="space-y-1 text-sm">
                      <p><strong>BMR:</strong> {calorieResult.bmr} cal/día</p>
                      <p><strong>Calorías diarias:</strong> {calorieResult.daily_calories} cal/día</p>
                      <p><strong>Proteínas:</strong> {calorieResult.macros.protein}g</p>
                      <p><strong>Carbohidratos:</strong> {calorieResult.macros.carbs}g</p>
                      <p><strong>Grasas:</strong> {calorieResult.macros.fats}g</p>
                    </div>
                  </div>
                )}

                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCalorieCalculator(false)
                      setCalorieResult(null)
                    }}
                    className="btn btn-secondary flex-1"
                  >
                    Cerrar
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary flex-1"
                  >
                    Calcular
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Create Form Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="card max-w-md w-full">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Crear Plan Nutricional
              </h2>
              
              <form onSubmit={handleCreatePlan} className="space-y-4">
                <div className="form-group">
                  <label className="form-label">Objetivo</label>
                  <select
                    value={formData.goal}
                    onChange={(e) => setFormData({...formData, goal: e.target.value})}
                    className="form-input"
                  >
                    <option value="weight_loss">Pérdida de Peso</option>
                    <option value="muscle_gain">Ganancia Muscular</option>
                    <option value="maintenance">Mantenimiento</option>
                    <option value="cutting">Definición</option>
                    <option value="bulking">Volumen</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Calorías Diarias</label>
                  <input
                    type="number"
                    value={formData.daily_calories}
                    onChange={(e) => setFormData({...formData, daily_calories: parseInt(e.target.value)})}
                    className="form-input"
                    placeholder="2000"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Restricciones Dietéticas</label>
                  <input
                    type="text"
                    value={formData.dietary_restrictions}
                    onChange={(e) => setFormData({...formData, dietary_restrictions: e.target.value})}
                    className="form-input"
                    placeholder="Ej: vegetariano, sin gluten, sin lactosa"
                  />
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
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Apple className="h-6 w-6 text-green-600" />
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
                    <span className="text-gray-500">Calorías/día:</span>
                    <span className="font-semibold">{plan.daily_calories}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Proteínas:</span>
                    <span className="font-semibold">{plan.protein_percentage}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Carbohidratos:</span>
                    <span className="font-semibold">{plan.carbs_percentage}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Grasas:</span>
                    <span className="font-semibold">{plan.fats_percentage}%</span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button className="btn btn-primary flex-1">
                    Ver Detalles
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
              <Apple className="h-16 w-16 text-white/50 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-white mb-4">
                No tienes planes nutricionales
              </h3>
              <p className="text-white/70 mb-6">
                Crea tu primer plan nutricional personalizado con IA
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

export default NutritionPlans

