import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Building2,
  FileText,
  Users,
  Wallet,
  TrendingUp,
  Shield,
  CheckCircle,
  Star,
  ArrowRight,
  Play,
  Zap,
  BarChart3,
  Clock,
  DollarSign,
  Calendar,
  Settings,
  Smartphone,
  Globe,
  Award,
  ChevronDown,
  Menu,
  X
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/auth-context";
import { useLocation } from "wouter";
import buildingImage from "@assets/generated_images/Modern_condominium_building_exterior_f0fe84cd.png";

export default function Landing() {
  const { login, isAuthenticated, user, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [formData, setFormData] = useState({
    nitCopropiedad: "",
    nitUsuario: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated && user) {
      setLocation("/");
    }
  }, [isAuthenticated, user, setLocation]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await login(formData.nitCopropiedad, formData.nitUsuario, formData.password);
      setShowLoginModal(false);
      setLocation("/");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Error al iniciar sesión");
    } finally {
      setIsLoading(false);
    }
  };

  const stats = [
    { number: "+500", label: "Copropiedades activas", icon: Building2 },
    { number: "99.9%", label: "Tiempo de actividad", icon: Shield },
    { number: "24/7", label: "Soporte técnico", icon: Users },
    { number: "50%", label: "Ahorro en tiempo administrativo", icon: Clock }
  ];

  const features = [
    {
      icon: FileText,
      title: "Contabilidad Automatizada",
      description: "Genera informes contables precisos y cumple con la normativa DIAN automáticamente",
      benefits: ["Plan de cuentas personalizado", "Comprobantes electrónicos", "Reportes fiscales automáticos"]
    },
    {
      icon: Wallet,
      title: "Tesorería Inteligente",
      description: "Controla ingresos, gastos y flujo de caja con análisis predictivo avanzado",
      benefits: ["Presupuestos dinámicos", "Alertas de tesorería", "Pronósticos financieros"]
    },
    {
      icon: Users,
      title: "Gestión de Unidades",
      description: "Administra propietarios, inquilinos y unidades con comunicación integrada",
      benefits: ["Base de datos centralizada", "Comunicación masiva", "Historial completo"]
    },
    {
      icon: TrendingUp,
      title: "Reportes y Analytics",
      description: "Toma decisiones informadas con dashboards interactivos y KPIs en tiempo real",
      benefits: ["Dashboards personalizados", "Análisis de tendencias", "Exportación automática"]
    },
    {
      icon: Shield,
      title: "Seguridad Empresarial",
      description: "Protección de datos con encriptación de nivel bancario y respaldo automático",
      benefits: ["Encriptación AES-256", "Backups automáticos", "Control de acceso granular"]
    },
    {
      icon: Smartphone,
      title: "Acceso Móvil",
      description: "Gestiona tu copropiedad desde cualquier lugar con nuestra app móvil nativa",
      benefits: ["App iOS y Android", "Notificaciones push", "Acceso offline limitado"]
    }
  ];

  const testimonials = [
    {
      name: "María González",
      role: "Administradora",
      company: "Conjunto Torres del Parque",
      content: "GRAVY revolucionó nuestra gestión administrativa. Redujimos el tiempo de cierre contable de 2 semanas a 2 días.",
      rating: 5,
      avatar: "MG"
    },
    {
      name: "Carlos Rodríguez",
      role: "Contador",
      company: "Edificio Centro Empresarial",
      content: "La precisión en los reportes fiscales es impresionante. Nunca habíamos cumplido tan fácilmente con la DIAN.",
      rating: 5,
      avatar: "CR"
    },
    {
      name: "Ana López",
      role: "Presidenta de Copropiedad",
      company: "Condominio Los Álamos",
      content: "La transparencia que brinda GRAVY a los copropietarios es invaluable. Todos pueden ver el estado real de las finanzas.",
      rating: 5,
      avatar: "AL"
    }
  ];

  const faqs = [
    {
      question: "¿Cómo funciona GRAVY?",
      answer: "GRAVY es una plataforma SaaS que se instala en tu copropiedad. Cada conjunto tiene su propio espacio seguro con datos completamente aislados."
    },
    {
      question: "¿Es seguro almacenar datos financieros?",
      answer: "Utilizamos encriptación de nivel bancario (AES-256), servidores en la nube certificados y backups automáticos. Cumplimos con todas las normativas de protección de datos."
    },
    {
      question: "¿Cuánto tiempo toma implementar GRAVY?",
      answer: "La implementación típica toma entre 1-2 semanas, incluyendo migración de datos históricos, configuración de cuentas y capacitación del equipo administrativo."
    },
    {
      question: "¿Qué soporte ofrecen?",
      answer: "Ofrecemos soporte 24/7 por chat, email y teléfono. Incluye capacitación inicial, soporte técnico continuo y actualizaciones automáticas del sistema."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 text-white font-bold text-xl">
                G
              </div>
              <span className="text-2xl font-bold text-gray-900">GRAVY</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Características</a>
              <a href="#testimonials" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Testimonios</a>
              <a href="#pricing" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Precios</a>
              <a href="#faq" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">FAQ</a>
            </nav>

            {/* CTA Buttons */}
            <div className="hidden lg:flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => setShowLoginModal(true)}
                className="text-gray-600 hover:text-blue-600 font-medium"
              >
                Iniciar Sesión
              </Button>
              <Button
                onClick={() => console.log("Solicitar demo")}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium px-6 py-2 h-auto"
              >
                Solicitar Demo
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              {showMobileMenu ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {showMobileMenu && (
            <div className="lg:hidden py-4 border-t border-gray-200">
              <nav className="flex flex-col gap-4">
                <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Características</a>
                <a href="#testimonials" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Testimonios</a>
                <a href="#pricing" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Precios</a>
                <a href="#faq" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">FAQ</a>
                <div className="flex flex-col gap-2 pt-4">
                  <Button
                    variant="ghost"
                    onClick={() => setShowLoginModal(true)}
                    className="justify-start text-gray-600 hover:text-blue-600 font-medium"
                  >
                    Iniciar Sesión
                  </Button>
                  <Button
                    onClick={() => console.log("Solicitar demo")}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium"
                  >
                    Solicitar Demo
                  </Button>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-16 min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent"></div>
        <div className="absolute top-20 right-10 w-72 h-72 bg-blue-100/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
                  <Zap className="h-4 w-4" />
                  Tecnología de vanguardia para copropiedades
                </div>
                <h1 className="text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
                  Gestiona tu
                  <span className="bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent block">
                    copropiedad
                  </span>
                  como nunca antes
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                  Automatiza la contabilidad, optimiza la tesorería y mejora la comunicación
                  con propietarios. Todo en una plataforma integrada y fácil de usar.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  onClick={() => console.log("Solicitar demo")}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-lg px-8 py-4 h-auto font-medium"
                >
                  Comenzar Ahora
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => setShowLoginModal(true)}
                  className="border-2 border-gray-300 text-gray-700 hover:border-blue-600 hover:text-blue-600 text-lg px-8 py-4 h-auto font-medium"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Ver Demo
                </Button>
              </div>

              {/* Social Proof */}
              <div className="flex items-center gap-6 pt-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-white flex items-center justify-center text-white text-sm font-medium">
                      {String.fromCharCode(65 + i)}
                    </div>
                  ))}
                </div>
                <div className="text-sm text-gray-600">
                  <div className="font-semibold text-gray-900">+500 copropiedades</div>
                  confían en GRAVY
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative">
              <div className="relative z-10 bg-white rounded-2xl shadow-2xl p-8 transform hover:scale-105 transition-transform duration-500">
                <img
                  src={buildingImage}
                  alt="Dashboard GRAVY"
                  className="w-full h-96 object-cover rounded-xl"
                />
                <div className="absolute -top-4 -right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                  <CheckCircle className="h-4 w-4" />
                  Sistema Activo
                </div>
              </div>

              {/* Floating Cards */}
              <div className="absolute -bottom-8 -left-8 bg-white rounded-xl shadow-lg p-4 transform hover:scale-105 transition-transform duration-300 border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">+35% eficiencia</div>
                    <div className="text-sm text-gray-600">en procesos administrativos</div>
                  </div>
                </div>
              </div>

              <div className="absolute -top-8 -right-8 bg-white rounded-xl shadow-lg p-4 transform hover:scale-105 transition-transform duration-300 border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Shield className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">99.9% uptime</div>
                    <div className="text-sm text-gray-600">disponibilidad garantizada</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Section - Integrated into Hero */}
          <div className="mt-20 pt-16 border-t border-gray-200">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Únete a la plataforma más avanzada de gestión de copropiedades
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Miles de copropiedades ya confían en GRAVY para optimizar su gestión administrativa
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center group">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                    <stat.icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-4xl font-bold text-gray-900 mb-2">{stat.number}</div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Lo hacemos por ti
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Una plataforma integrada con inteligencia artificial para la gestión integral de copropiedades
            </p>
          </div>

          <div className="space-y-24">
            {features.map((feature, index) => (
              <div key={index} className={`grid lg:grid-cols-2 gap-16 items-center ${index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''}`}>
                <div className={`space-y-8 ${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                  <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
                      <feature.icon className="h-4 w-4" />
                      Característica destacada
                    </div>
                    <h3 className="text-4xl font-bold text-gray-900">{feature.title}</h3>
                    <p className="text-xl text-gray-600 leading-relaxed">{feature.description}</p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-900">Beneficios principales:</h4>
                    <ul className="space-y-3">
                      {feature.benefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-center gap-3 text-gray-700">
                          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className={`relative ${index % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''}`}>
                  <div className="bg-white rounded-2xl shadow-2xl p-8 transform hover:scale-105 transition-transform duration-500">
                    <div className="w-full h-80 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl flex items-center justify-center">
                      <feature.icon className="h-24 w-24 text-blue-600" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Los clientes satisfechos siempre vuelven
            </h2>
            <p className="text-xl text-gray-600">
              Historias reales de copropiedades que transformaron su gestión con GRAVY
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl p-8 border border-gray-100 hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center gap-1 mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-8 leading-relaxed italic text-lg">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 text-lg">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                    <div className="text-sm text-gray-500">{testimonial.company}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Trust Indicators */}
          <div className="text-center">
            <div className="inline-flex items-center gap-4 bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <div className="text-left">
                <div className="font-semibold text-gray-900">4.9/5 estrellas</div>
                <div className="text-sm text-gray-600">Basado en +200 reseñas</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 to-blue-700 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-700/50 to-blue-600/50"></div>
        <div className="absolute top-10 right-20 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-20 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-5xl font-bold text-white mb-6">
              ¿Tienes dudas? ¡Te las aclaramos!
            </h2>
            <p className="text-xl text-blue-100 mb-12 max-w-3xl mx-auto">
              Crea tu cuenta gratis y únete a la plataforma más avanzada de gestión de copropiedades en Colombia
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
              <Button
                size="lg"
                onClick={() => console.log("Solicitar demo")}
                className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-4 h-auto font-medium"
              >
                Comenzar Ahora
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => setShowLoginModal(true)}
                className="border-2 border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-4 h-auto font-medium"
              >
                <Play className="mr-2 h-5 w-5" />
                Ver Demo
              </Button>
            </div>

            {/* FAQ Preview */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {faqs.slice(0, 4).map((faq, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-colors duration-300">
                  <h3 className="text-lg font-semibold text-white mb-3">{faq.question}</h3>
                  <p className="text-blue-100 leading-relaxed text-sm">{faq.answer.substring(0, 100)}...</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              ¿Tienes dudas? ¡Te las aclaramos!
            </h2>
            <p className="text-xl text-gray-600">
              Resolvemos todas tus preguntas sobre GRAVY
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {faqs.map((faq, index) => (
              <div key={index} className="mb-6">
                <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">{faq.question}</h3>
                      <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Additional CTA */}
          <div className="text-center mt-16">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                ¿Todavía tienes preguntas?
              </h3>
              <p className="text-gray-600 mb-6">
                Nuestro equipo de soporte está listo para ayudarte
              </p>
              <Button
                onClick={() => console.log("Contactar soporte")}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium"
              >
                Contactar Soporte
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl font-bold text-white mb-6">
              Haz crecer tu copropiedad con el ecosistema que lo tiene todo
            </h2>
            <p className="text-xl text-blue-100 mb-12">
              Únete hoy y transforma la gestión de tu copropiedad con GRAVY
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button
                size="lg"
                onClick={() => console.log("Empezar ahora")}
                className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-4 h-auto font-medium"
              >
                Empezar Ahora
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => setShowLoginModal(true)}
                className="border-2 border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-4 h-auto font-medium"
              >
                <Play className="mr-2 h-5 w-5" />
                Ver Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-20">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 text-white font-bold text-2xl">
                  G
                </div>
                <span className="text-3xl font-bold">GRAVY</span>
              </div>
              <p className="text-gray-400 mb-6 text-lg leading-relaxed max-w-md">
                La plataforma más avanzada para gestión integral de copropiedades en Colombia.
                Tecnología de vanguardia para una administración eficiente.
              </p>
              <div className="flex gap-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg">
                  <Globe className="h-6 w-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg">
                  <Award className="h-6 w-6" />
                </a>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-6 text-lg">Producto</h3>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#features" className="hover:text-white transition-colors">Características</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Precios</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integraciones</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-6 text-lg">Soporte</h3>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Centro de Ayuda</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentación</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contacto</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-6 text-lg">Empresa</h3>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Sobre nosotros</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Carreras</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Prensa</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
              <div className="flex flex-wrap gap-6 text-sm text-gray-400">
                <span>© 2024 GRAVY. Todos los derechos reservados.</span>
                <span>Hecho con ❤️ en Colombia</span>
              </div>
              <div className="flex gap-6">
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Privacidad
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Términos
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Cookies
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Login Modal */}
      <Dialog open={showLoginModal} onOpenChange={setShowLoginModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold">Bienvenido a GRAVY</DialogTitle>
            <DialogDescription className="text-center">
              Ingresa tus credenciales para acceder a tu copropiedad
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nitCopropiedad" className="text-sm font-medium">NIT Copropiedad</Label>
              <Input
                id="nitCopropiedad"
                type="text"
                placeholder="123456789"
                value={formData.nitCopropiedad}
                onChange={(e) =>
                  setFormData({ ...formData, nitCopropiedad: e.target.value })
                }
                required
                className="h-12"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nitUsuario" className="text-sm font-medium">NIT Usuario</Label>
              <Input
                id="nitUsuario"
                type="text"
                placeholder="987654321"
                value={formData.nitUsuario}
                onChange={(e) =>
                  setFormData({ ...formData, nitUsuario: e.target.value })
                }
                required
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
                className="h-12"
              />
            </div>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-3 pt-4">
              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium"
                disabled={isLoading}
              >
                {isLoading ? "Iniciando sesión..." : "Ingresar a mi Copropiedad"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => console.log("Recuperar contraseña")}
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              >
                Olvido su contraseña?
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}