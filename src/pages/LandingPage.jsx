import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Dumbbell, Brain, Target, TrendingUp, Star, CheckCircle } from 'lucide-react'

const LandingPage = () => {
  const { isAuthenticated } = useAuth()

  const features = [
    {
      icon: <Brain className="h-12 w-12 text-blue-500" />,
      title: "IA Personalizada",
      description: "Planes únicos generados por inteligencia artificial basados en tus objetivos y nivel de fitness."
    },
    {
      icon: <Target className="h-12 w-12 text-green-500" />,
      title: "Objetivos Claros",
      description: "Define tus metas y recibe un plan estructurado para alcanzarlas de manera efectiva."
    },
    {
      icon: <TrendingUp className="h-12 w-12 text-purple-500" />,
      title: "Seguimiento Avanzado",
      description: "Monitorea tu progreso con métricas detalladas y análisis inteligentes."
    }
  ]

  const benefits = [
    "Planes de entrenamiento personalizados",
    "Dietas balanceadas con cálculo de macronutrientes",
    "Seguimiento de progreso en tiempo real",
    "Asistente de IA para consultas",
    "Análisis de tendencias y recomendaciones",
    "Interfaz moderna y fácil de usar"
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 fade-in">
              Transforma tu cuerpo con
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                Inteligencia Artificial
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/80 mb-8 slide-in-left">
              Planes personalizados de entrenamiento y nutrición generados por IA. 
              Tu entrenador personal disponible 24/7.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center slide-in-right">
              {isAuthenticated ? (
                <Link to="/dashboard" className="btn btn-primary text-lg px-8 py-4">
                  Ir al Dashboard
                </Link>
              ) : (
                <>
                  <Link to="/register" className="btn btn-primary text-lg px-8 py-4">
                    Comenzar Gratis
                  </Link>
                  <Link to="/login" className="btn btn-secondary text-lg px-8 py-4">
                    Iniciar Sesión
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              ¿Por qué elegir Glow-Up AI?
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Tecnología de vanguardia al servicio de tu transformación física
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card hover-lift text-center">
                <div className="flex justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-800">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Todo lo que necesitas en una sola plataforma
              </h2>
              <p className="text-xl text-white/70 mb-8">
                Desde la planificación hasta el seguimiento, Glow-Up AI te acompaña 
                en cada paso de tu transformación.
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-6 w-6 text-green-400 flex-shrink-0" />
                    <span className="text-white text-lg">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="glass p-8 rounded-2xl">
              <div className="text-center">
                <Dumbbell className="h-24 w-24 text-white mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-white mb-4">
                  ¿Listo para comenzar?
                </h3>
                <p className="text-white/70 mb-6">
                  Únete a miles de usuarios que ya están transformando sus vidas
                </p>
                {!isAuthenticated && (
                  <Link to="/register" className="btn btn-primary w-full">
                    Crear Cuenta Gratis
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="glass p-12 rounded-2xl max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Tu transformación comienza hoy
            </h2>
            <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto">
              No esperes más. Comienza tu viaje hacia la mejor versión de ti mismo 
              con la ayuda de la inteligencia artificial.
            </p>
            {!isAuthenticated && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/register" className="btn btn-primary text-lg px-8 py-4">
                  Comenzar Ahora
                </Link>
                <Link to="/login" className="btn btn-secondary text-lg px-8 py-4">
                  Ya tengo cuenta
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

export default LandingPage

