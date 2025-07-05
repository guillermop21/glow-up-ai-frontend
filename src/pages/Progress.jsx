import React, { useState, useEffect } from 'react'
import { progressService } from '../services/api'
import { TrendingUp, Plus, Calendar, Weight, Ruler } from 'lucide-react'

const Progress = () => {
  const [entries, setEntries] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    weight: '',
    body_fat: '',
    muscle_mass: '',
    chest: '',
    waist: '',
    hips: '',
    arms: '',
    thighs: '',
    notes: ''
  })

  useEffect(() => {
    loadProgressData()
  }, [])

  const loadProgressData = async () => {
    try {
      const [entriesRes, statsRes] = await Promise.all([
        progressService.getEntries(),
        progressService.getStats()
      ])
      setEntries(entriesRes.data.entries)
      setStats(statsRes.data.stats)
    } catch (error) {
      console.error('Error loading progress data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await progressService.createEntry(formData)
      setEntries([response.data.entry, ...entries])
      setShowAddForm(false)
      setFormData({
        date: new Date().toISOString().split('T')[0],
        weight: '',
        body_fat: '',
        muscle_mass: '',
        chest: '',
        waist: '',
        hips: '',
        arms: '',
        thighs: '',
        notes: ''
      })
      // Recargar estadísticas
      const statsRes = await progressService.getStats()
      setStats(statsRes.data.stats)
    } catch (error) {
      console.error('Error creating entry:', error)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
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
              Seguimiento de Progreso
            </h1>
            <p className="text-white/70">
              Monitorea tu transformación con métricas detalladas
            </p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="btn btn-primary flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Nuevo Registro</span>
          </button>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="card text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Weight className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-1">
                {stats.latest_weight ? `${stats.latest_weight} kg` : 'N/A'}
              </h3>
              <p className="text-gray-600">Peso Actual</p>
              {stats.weight_change && (
                <p className={`text-sm mt-1 ${stats.weight_change > 0 ? 'text-red-500' : 'text-green-500'}`}>
                  {stats.weight_change > 0 ? '+' : ''}{stats.weight_change} kg
                </p>
              )}
            </div>

            <div className="card text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-green-100 rounded-full">
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-1">
                {stats.latest_body_fat ? `${stats.latest_body_fat}%` : 'N/A'}
              </h3>
              <p className="text-gray-600">Grasa Corporal</p>
            </div>

            <div className="card text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-purple-100 rounded-full">
                  <Ruler className="h-8 w-8 text-purple-600" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-1">
                {stats.latest_muscle_mass ? `${stats.latest_muscle_mass} kg` : 'N/A'}
              </h3>
              <p className="text-gray-600">Masa Muscular</p>
            </div>

            <div className="card text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-orange-100 rounded-full">
                  <Calendar className="h-8 w-8 text-orange-600" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-1">
                {stats.total_entries || 0}
              </h3>
              <p className="text-gray-600">Registros Totales</p>
            </div>
          </div>
        )}

        {/* Add Entry Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="card max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Nuevo Registro de Progreso
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="form-group">
                  <label className="form-label">Fecha</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="form-group">
                    <label className="form-label">Peso (kg)</label>
                    <input
                      type="number"
                      step="0.1"
                      name="weight"
                      value={formData.weight}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="70.5"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Grasa Corporal (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      name="body_fat"
                      value={formData.body_fat}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="15.5"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Masa Muscular (kg)</label>
                    <input
                      type="number"
                      step="0.1"
                      name="muscle_mass"
                      value={formData.muscle_mass}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="45.2"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="form-group">
                    <label className="form-label">Pecho (cm)</label>
                    <input
                      type="number"
                      step="0.1"
                      name="chest"
                      value={formData.chest}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="95"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Cintura (cm)</label>
                    <input
                      type="number"
                      step="0.1"
                      name="waist"
                      value={formData.waist}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="80"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Caderas (cm)</label>
                    <input
                      type="number"
                      step="0.1"
                      name="hips"
                      value={formData.hips}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="90"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Brazos (cm)</label>
                    <input
                      type="number"
                      step="0.1"
                      name="arms"
                      value={formData.arms}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="35"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Muslos (cm)</label>
                    <input
                      type="number"
                      step="0.1"
                      name="thighs"
                      value={formData.thighs}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="55"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Notas</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    className="form-input"
                    rows="3"
                    placeholder="Cómo te sientes, observaciones, etc."
                  />
                </div>

                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="btn btn-secondary flex-1"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary flex-1"
                  >
                    Guardar Registro
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Progress Entries */}
        {entries.length > 0 ? (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-4">Historial de Registros</h2>
            <div className="grid gap-6">
              {entries.map((entry) => (
                <div key={entry.id} className="card">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">
                        {new Date(entry.date).toLocaleDateString('es-ES', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </h3>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(entry.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    {entry.weight && (
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-600">{entry.weight} kg</p>
                        <p className="text-sm text-gray-600">Peso</p>
                      </div>
                    )}
                    {entry.body_fat && (
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">{entry.body_fat}%</p>
                        <p className="text-sm text-gray-600">Grasa Corporal</p>
                      </div>
                    )}
                    {entry.muscle_mass && (
                      <div className="text-center">
                        <p className="text-2xl font-bold text-purple-600">{entry.muscle_mass} kg</p>
                        <p className="text-sm text-gray-600">Masa Muscular</p>
                      </div>
                    )}
                  </div>

                  {(entry.measurements.chest || entry.measurements.waist || entry.measurements.hips || 
                    entry.measurements.arms || entry.measurements.thighs) && (
                    <div className="border-t pt-4">
                      <h4 className="font-semibold text-gray-800 mb-2">Medidas Corporales</h4>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-sm">
                        {entry.measurements.chest && (
                          <div>
                            <span className="text-gray-600">Pecho:</span>
                            <span className="font-semibold ml-1">{entry.measurements.chest} cm</span>
                          </div>
                        )}
                        {entry.measurements.waist && (
                          <div>
                            <span className="text-gray-600">Cintura:</span>
                            <span className="font-semibold ml-1">{entry.measurements.waist} cm</span>
                          </div>
                        )}
                        {entry.measurements.hips && (
                          <div>
                            <span className="text-gray-600">Caderas:</span>
                            <span className="font-semibold ml-1">{entry.measurements.hips} cm</span>
                          </div>
                        )}
                        {entry.measurements.arms && (
                          <div>
                            <span className="text-gray-600">Brazos:</span>
                            <span className="font-semibold ml-1">{entry.measurements.arms} cm</span>
                          </div>
                        )}
                        {entry.measurements.thighs && (
                          <div>
                            <span className="text-gray-600">Muslos:</span>
                            <span className="font-semibold ml-1">{entry.measurements.thighs} cm</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {entry.notes && (
                    <div className="border-t pt-4 mt-4">
                      <h4 className="font-semibold text-gray-800 mb-2">Notas</h4>
                      <p className="text-gray-600">{entry.notes}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="glass p-12 rounded-2xl max-w-md mx-auto">
              <TrendingUp className="h-16 w-16 text-white/50 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-white mb-4">
                No tienes registros de progreso
              </h3>
              <p className="text-white/70 mb-6">
                Comienza a registrar tu progreso para ver tu transformación
              </p>
              <button
                onClick={() => setShowAddForm(true)}
                className="btn btn-primary flex items-center space-x-2 mx-auto"
              >
                <Plus className="h-5 w-5" />
                <span>Crear mi primer registro</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Progress

