import React, { useState, useEffect, useRef } from "react";
import { motion, useAnimation, useInView, AnimatePresence } from "framer-motion";
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
  X,
  MapPin,
  MessageSquare,
  Mail,
  Phone
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
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // Smooth scroll function
  const scrollToPricing = () => {
    const pricingSection = document.getElementById('pricing');
    if (pricingSection) {
      pricingSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  // Animation refs
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const testimonialsRef = useRef(null);
  const ctaRef = useRef(null);
  const faqRef = useRef(null);

  // Animation controls
  const heroInView = useInView(heroRef, { once: true, margin: "-100px" });
  const featuresInView = useInView(featuresRef, { once: true, margin: "-100px" });
  const testimonialsInView = useInView(testimonialsRef, { once: true, margin: "-100px" });
  const ctaInView = useInView(ctaRef, { once: true, margin: "-100px" });
  const faqInView = useInView(faqRef, { once: true, margin: "-100px" });

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.6, -0.05, 0.01, 0.99]
      }
    }
  };

  const slideInLeft = {
    hidden: { opacity: 0, x: -100 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: [0.6, -0.05, 0.01, 0.99]
      }
    }
  };

  const slideInRight = {
    hidden: { opacity: 0, x: 100 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: [0.6, -0.05, 0.01, 0.99]
      }
    }
  };

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.6, -0.05, 0.01, 0.99]
      }
    }
  };

  const floatingAnimation = {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  const pulseAnimation = {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated && user) {
      setLocation("/");
    }
  }, [isAuthenticated, user, setLocation]);

  // Ensure mobile menu button is visible immediately on mobile devices
  React.useEffect(() => {
    const updateMobileMenuVisibility = () => {
      const mobileButton = document.querySelector('.mobile-menu-button') as HTMLButtonElement;
      if (mobileButton) {
        const isDesktop = window.innerWidth >= 1024;
        if (isDesktop) {
          mobileButton.style.display = 'none';
          mobileButton.style.visibility = 'hidden';
        } else {
          mobileButton.style.display = 'block';
          mobileButton.style.visibility = 'visible';
          mobileButton.style.opacity = '1';
          // Force visibility with !important-like behavior
          mobileButton.setAttribute('style',
            'display: block !important; visibility: visible !important; opacity: 1 !important;'
          );
        }
      }
    };

    // Run multiple times to ensure it works
    updateMobileMenuVisibility();
    setTimeout(updateMobileMenuVisibility, 0);
    setTimeout(updateMobileMenuVisibility, 50);
    setTimeout(updateMobileMenuVisibility, 100);
    setTimeout(updateMobileMenuVisibility, 200);

    window.addEventListener('resize', updateMobileMenuVisibility);

    return () => {
      window.removeEventListener('resize', updateMobileMenuVisibility);
    };
  }, []);

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
    { number: "+35%", label: "Mejoras en procesos vs otros sistemas", icon: Building2 },
    { number: "99.8%", label: "Tiempo de actividad", icon: Shield },
    { number: "24/7", label: "Soporte técnico", icon: Users },
    { number: "50%", label: "Ahorro en tiempo administrativo", icon: Clock }
  ];

  const pricingPlans = [
    {
      name: "Básico",
      price: "$49.900",
      period: "/mes",
      description: "Perfecto para copropiedades pequeñas",
      features: [
        "Hasta 50 unidades",
        "Contabilidad básica",
        "Gestión de pagos",
        "Reportes mensuales",
        "Soporte por email"
      ],
      buttonText: "Comenzar Gratis",
      popular: false,
      color: "blue"
    },
    {
      name: "Profesional",
      price: "$99.900",
      period: "/mes",
      description: "Ideal para copropiedades en crecimiento",
      features: [
        "Hasta 200 unidades",
        "Contabilidad completa",
        "Tesorería avanzada",
        "Módulo de nómina",
        "Reportes avanzados",
        "Soporte prioritario",
        "API integrada"
      ],
      buttonText: "Comenzar Ahora",
      popular: true,
      color: "orange"
    },
    {
      name: "Empresarial",
      price: "$199.900",
      period: "/mes",
      description: "Para grandes complejos residenciales",
      features: [
        "Unidades ilimitadas",
        "Todas las funcionalidades",
        "Módulos premium",
        "Consultoría personalizada",
        "Soporte 24/7",
        "Implementación dedicada",
        "Capacitación del equipo"
      ],
      buttonText: "Contactar Ventas",
      popular: false,
      color: "green"
    }
  ];

  const features = [
    {
      icon: FileText,
      title: "Contabilidad Automatizada",
      description: "Genera informes contables precisos y cumpliendo con la normativa DIAN automáticamente",
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
      description: "Gestiona de copropietarios desde cualquier lugar con nuestra app móvil nativa",
      benefits: ["App iOS y Android", "Notificaciones push", "Acceso offline limitado"]
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
              <img src="/icono.png" alt="GRAVY Logo" className="w-10 h-10 rounded-lg" />
              <span className="text-2xl font-bold text-gray-900">GRAVY</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              <a href="#features" className="relative text-gray-600 hover:text-blue-600 font-medium transition-all duration-300 group">
                Características
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 group-hover:w-full transition-all duration-300"></span>
              </a>
              <a href="#pricing" className="relative text-gray-600 hover:text-blue-600 font-medium transition-all duration-300 group">
                Precios
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 group-hover:w-full transition-all duration-300"></span>
              </a>
              <a href="/blog" className="relative text-gray-600 hover:text-blue-600 font-medium transition-all duration-300 group">
                Blog
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 group-hover:w-full transition-all duration-300"></span>
              </a>
              <a href="#faq" className="relative text-gray-600 hover:text-blue-600 font-medium transition-all duration-300 group">
                FAQ
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 group-hover:w-full transition-all duration-300"></span>
              </a>
              <a href="#support" className="relative text-gray-600 hover:text-blue-600 font-medium transition-all duration-300 group">
                Soporte
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 group-hover:w-full transition-all duration-300"></span>
              </a>
            </nav>

            {/* CTA Buttons */}
            <div className="hidden lg:flex items-center gap-4">
              <Button
                onClick={() => setShowLoginModal(true)}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium px-6 py-2 h-auto"
              >
                Iniciar Sesión
              </Button>
              <Button
                onClick={scrollToPricing}
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium px-6 py-2 h-auto"
              >
                Ver Planes
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="mobile-menu-button p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              style={{
                display: 'block',
                visibility: 'visible',
                opacity: 1
              }}
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              aria-label="Toggle mobile menu"
            >
              {showMobileMenu ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          <div className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            showMobileMenu ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}>
            <div className="py-4 border-t border-gray-200">
              <nav className="flex flex-col gap-4">
                <a
                  href="#features"
                  className="relative text-gray-600 hover:text-orange-600 font-medium transition-all duration-300 group py-2"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Características
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-500 to-orange-600 group-hover:w-full transition-all duration-300"></span>
                </a>
                <a
                  href="/blog"
                  className="relative text-gray-600 hover:text-orange-600 font-medium transition-all duration-300 group py-2"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Blog
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-500 to-orange-600 group-hover:w-full transition-all duration-300"></span>
                </a>
                <a
                  href="#pricing"
                  className="relative text-gray-600 hover:text-orange-600 font-medium transition-all duration-300 group py-2"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Precios
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-500 to-orange-600 group-hover:w-full transition-all duration-300"></span>
                </a>
                <a
                  href="#faq"
                  className="relative text-gray-600 hover:text-orange-600 font-medium transition-all duration-300 group py-2"
                  onClick={() => setShowMobileMenu(false)}
                >
                  FAQ
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-500 to-orange-600 group-hover:w-full transition-all duration-300"></span>
                </a>
                <a
                  href="#support"
                  className="relative text-gray-600 hover:text-orange-600 font-medium transition-all duration-300 group py-2"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Soporte
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-500 to-orange-600 group-hover:w-full transition-all duration-300"></span>
                </a>
                <div className="flex flex-col gap-2 pt-4">
                  <Button
                    onClick={() => {
                      scrollToPricing();
                      setShowMobileMenu(false);
                    }}
                    className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium"
                  >
                    Ver Planes
                  </Button>
                  <Button
                    onClick={() => {
                      setShowLoginModal(true);
                      setShowMobileMenu(false);
                    }}
                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium px-6 py-2 h-auto"
                  >
                    Iniciar Sesión
                  </Button>
                </div>
              </nav>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section ref={heroRef} className="pt-16 min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center relative overflow-hidden">
        {/* Background Pattern */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent"
          animate={{
            background: [
              "linear-gradient(to bottom right, rgba(248, 250, 252, 0.5), transparent)",
              "linear-gradient(to bottom right, rgba(239, 246, 255, 0.7), transparent)",
              "linear-gradient(to bottom right, rgba(248, 250, 252, 0.5), transparent)"
            ]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-20 right-10 w-72 h-72 bg-blue-100/30 rounded-full blur-3xl"
          animate={floatingAnimation}
        />
        <motion.div
          className="absolute bottom-20 left-10 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl"
          animate={{
            ...floatingAnimation,
            transition: { ...floatingAnimation.transition, delay: 1 }
          }}
        />

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            className="grid lg:grid-cols-2 gap-16 items-center"
            variants={containerVariants}
            initial="hidden"
            animate={heroInView ? "visible" : "hidden"}
          >
            {/* Content */}
            <motion.div className="space-y-8" variants={itemVariants}>
              <div className="space-y-6">
                <motion.div
                  className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium"
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 2 }}
                  >
                    <Zap className="h-4 w-4" />
                  </motion.div>
                  Tecnología de vanguardia para copropiedades
                </motion.div>
                <motion.h1
                  className="text-6xl lg:text-7xl font-bold text-gray-900 leading-tight"
                  variants={itemVariants}
                >
                  Gestiona tu
                  <motion.span
                    className="bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent block"
                    animate={{
                      backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                    }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  >
                    copropiedad
                  </motion.span>
                  como nunca antes
                </motion.h1>
                <motion.p
                  className="text-xl text-gray-600 leading-relaxed max-w-lg"
                  variants={itemVariants}
                >
                  Automatiza la contabilidad, optimiza la tesorería y mejora la comunicación
                  con propietarios. Todo en una plataforma integrada y fácil de usar.
                </motion.p>
              </div>

              {/* CTA Buttons */}
              <motion.div
                className="flex flex-col sm:flex-row gap-4"
                variants={itemVariants}
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    size="lg"
                    onClick={scrollToPricing}
                    className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-lg px-8 py-4 h-auto font-medium shadow-lg hover:shadow-xl transition-shadow duration-300"
                  >
                    Ver Planes
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </motion.div>
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    size="lg"
                    onClick={() => setShowLoginModal(true)}
                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white text-lg px-8 py-4 h-auto font-medium shadow-lg hover:shadow-xl transition-shadow duration-300"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Play className="mr-2 h-5 w-5" />
                    </motion.div>
                    Iniciar Sesión
                  </Button>
                </motion.div>
              </motion.div>

              {/* Social Proof */}
              <motion.div
                className="flex items-center gap-6 pt-4"
                variants={itemVariants}
              >
                <motion.div
                  className="flex -space-x-2"
                  whileHover={{ scale: 1.05 }}
                >
                  {[1, 2, 3, 4].map((i) => (
                    <motion.div
                      key={i}
                      className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-white flex items-center justify-center text-white text-sm font-medium"
                      whileHover={{
                        scale: 1.2,
                        rotate: [0, -10, 10, 0],
                        transition: { duration: 0.3 }
                      }}
                      animate={{
                        y: [0, -5, 0],
                        transition: { duration: 2, repeat: Infinity, delay: i * 0.2 }
                      }}
                    >
                      {String.fromCharCode(65 + i)}
                    </motion.div>
                  ))}
                </motion.div>
                <motion.div
                  className="text-sm text-gray-600"
                  animate={pulseAnimation}
                >
                  <div className="font-semibold text-gray-900">+500 copropiedades</div>
                  confían en GRAVY
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Hero Image */}
            <motion.div
              className="relative"
              variants={slideInRight}
            >
              <motion.div
                className="relative z-10 bg-white rounded-2xl shadow-2xl p-8"
                whileHover={{
                  scale: 1.05,
                  rotateY: 5,
                  transition: { duration: 0.3 }
                }}
                animate={floatingAnimation}
              >
                <motion.img
                  src={buildingImage}
                  alt="Dashboard GRAVY"
                  className="w-full h-96 object-cover rounded-xl"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                />
                <motion.div
                  className="absolute -top-4 -right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1"
                  animate={{
                    scale: [1, 1.1, 1],
                    transition: { duration: 2, repeat: Infinity }
                  }}
                >
                  <CheckCircle className="h-4 w-4" />
                  Sistema Activo
                </motion.div>
              </motion.div>

              {/* Floating Cards */}
              <motion.div
                className="absolute -bottom-8 -left-8 bg-white rounded-xl shadow-lg p-4 border border-gray-100 z-20"
                animate={floatingAnimation}
                whileHover={{
                  scale: 1.1,
                  rotate: [0, -5, 5, 0],
                  transition: { duration: 0.3 }
                }}
              >
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  >
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  </motion.div>
                  <div>
                    <div className="font-semibold text-gray-900">+35% eficiencia</div>
                    <div className="text-sm text-gray-600">en procesos administrativos</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="absolute -top-8 -right-8 bg-white rounded-xl shadow-lg p-4 border border-gray-100 z-20"
                animate={{
                  ...floatingAnimation,
                  transition: { ...floatingAnimation.transition, delay: 1.5 }
                }}
                whileHover={{
                  scale: 1.1,
                  rotate: [0, 5, -5, 0],
                  transition: { duration: 0.3 }
                }}
              >
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <Shield className="h-5 w-5 text-blue-600" />
                  </motion.div>
                  <div>
                    <div className="font-semibold text-gray-900">99.9% uptime</div>
                    <div className="text-sm text-gray-600">disponibilidad garantizada</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>

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
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.h2
              className="text-5xl font-bold text-gray-900 mb-6"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              style={{
                background: "linear-gradient(45deg, #1f2937, #3b82f6, #1f2937)",
                backgroundSize: "200% 200%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text"
              }}
            >
              Lo hacemos por ti
            </motion.h2>
            <motion.p
              className="text-xl text-gray-600 max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Una plataforma integrada con inteligencia artificial para la gestión integral de copropiedades
            </motion.p>
          </motion.div>

          <div className="space-y-24">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className={`grid lg:grid-cols-2 gap-16 items-center ${index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''}`}
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <motion.div
                  className={`space-y-8 ${index % 2 === 1 ? 'lg:col-start-2' : ''}`}
                  variants={index % 2 === 0 ? slideInLeft : slideInRight}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  <div className="space-y-4">
                    <motion.div
                      className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium"
                      whileHover={{
                        scale: 1.05,
                        backgroundColor: "#dbeafe"
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
                      >
                        <feature.icon className="h-4 w-4" />
                      </motion.div>
                      Característica destacada
                    </motion.div>
                    <motion.h3
                      className="text-4xl font-bold text-gray-900"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                    >
                      {feature.title}
                    </motion.h3>
                    <motion.p
                      className="text-xl text-gray-600 leading-relaxed"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ duration: 0.6, delay: 0.3 }}
                      viewport={{ once: true }}
                    >
                      {feature.description}
                    </motion.p>
                  </div>

                  <div className="space-y-4">
                    <motion.h4
                      className="text-lg font-semibold text-gray-900"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                      viewport={{ once: true }}
                    >
                      Beneficios principales:
                    </motion.h4>
                    <motion.ul
                      className="space-y-3"
                      variants={containerVariants}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                    >
                      {feature.benefits.map((benefit, idx) => (
                        <motion.li
                          key={idx}
                          className="flex items-center gap-3 text-gray-700"
                          variants={itemVariants}
                          whileHover={{
                            x: 10,
                            transition: { duration: 0.2 }
                          }}
                        >
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity, delay: idx * 0.3 }}
                          >
                            <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                          </motion.div>
                          {benefit}
                        </motion.li>
                      ))}
                    </motion.ul>
                  </div>
                </motion.div>

                <motion.div
                  className={`relative ${index % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''}`}
                  variants={index % 2 === 0 ? slideInRight : slideInLeft}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  <motion.div
                    className="bg-white rounded-2xl shadow-2xl p-8"
                    whileHover={{
                      scale: 1.05,
                      rotateY: index % 2 === 0 ? 5 : -5,
                      transition: { duration: 0.3 }
                    }}
                    animate={floatingAnimation}
                  >
                    <motion.div
                      className="w-full h-80 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl flex items-center justify-center"
                      whileHover={{
                        background: "linear-gradient(to bottom right, #dbeafe, #bfdbfe)",
                        transition: { duration: 0.3 }
                      }}
                    >
                      <motion.div
                        animate={{
                          scale: [1, 1.1, 1],
                          rotate: [0, 5, -5, 0]
                        }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: index * 0.5
                        }}
                      >
                        <feature.icon className="h-24 w-24 text-blue-600" />
                      </motion.div>
                    </motion.div>
                  </motion.div>

                  {/* Floating accent elements */}
                  <motion.div
                    className="absolute -top-4 -right-4 w-8 h-8 bg-blue-500 rounded-full"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.7, 1, 0.7]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: index * 0.3
                    }}
                  />
                  <motion.div
                    className="absolute -bottom-4 -left-4 w-6 h-6 bg-green-500 rounded-full"
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [0.5, 1, 0.5]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: index * 0.7
                    }}
                  />
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="faq" className="py-24 bg-gradient-to-r from-blue-600 to-blue-700 relative overflow-hidden">
        {/* Background Pattern */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-blue-700/50 to-blue-600/50"
          animate={{
            background: [
              "linear-gradient(to bottom right, rgba(29, 78, 216, 0.5), rgba(37, 99, 235, 0.5))",
              "linear-gradient(to bottom right, rgba(37, 99, 235, 0.7), rgba(29, 78, 216, 0.3))",
              "linear-gradient(to bottom right, rgba(29, 78, 216, 0.5), rgba(37, 99, 235, 0.5))"
            ]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-10 right-20 w-64 h-64 bg-white/5 rounded-full blur-3xl"
          animate={floatingAnimation}
        />
        <motion.div
          className="absolute bottom-10 left-20 w-80 h-80 bg-white/5 rounded-full blur-3xl"
          animate={{
            ...floatingAnimation,
            transition: { ...floatingAnimation.transition, delay: 2 }
          }}
        />

        <div className="container mx-auto px-6 text-center relative z-10">
          <motion.div
            className="max-w-5xl mx-auto"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.h2
              className="text-5xl font-bold text-white mb-6"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              animate={{
                textShadow: [
                  "0 0 20px rgba(255,255,255,0.3)",
                  "0 0 30px rgba(255,255,255,0.5)",
                  "0 0 20px rgba(255,255,255,0.3)"
                ]
              }}
            >
              ¿Tienes dudas? ¡Te las aclaramos!
            </motion.h2>
            <motion.p
              className="text-xl text-blue-100 mb-12 max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              Crea tu cuenta gratis y únete a la plataforma más avanzada de gestión de copropiedades en Colombia
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-6 justify-center mb-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  onClick={scrollToPricing}
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-lg px-8 py-4 h-auto font-medium shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  Ver Planes
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </motion.div>
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  onClick={() => setShowLoginModal(true)}
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white text-lg px-8 py-4 h-auto font-medium shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Play className="mr-2 h-5 w-5" />
                  </motion.div>
                  Iniciar Sesión
                </Button>
              </motion.div>
            </motion.div>

            {/* FAQ Preview */}
            <motion.div
              className="max-w-4xl mx-auto"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {faqs.slice(0, 4).map((faq, index) => (
                <motion.div
                  key={index}
                  className="mb-4"
                  variants={itemVariants}
                  animate={floatingAnimation}
                >
                  <motion.div
                    className={`bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 cursor-pointer transition-all duration-300 ${
                      expandedFaq === index
                        ? 'md:col-span-full bg-white/20'
                        : 'hover:bg-white/15'
                    }`}
                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <motion.div
                      className="p-6"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      viewport={{ once: true }}
                    >
                      <div className="flex items-center justify-between">
                        <motion.h3
                          className="text-lg font-semibold text-white pr-4"
                          layout
                        >
                          {faq.question}
                        </motion.h3>
                        <motion.div
                          animate={{ rotate: expandedFaq === index ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                          className="flex-shrink-0"
                        >
                          <ChevronDown className="w-5 h-5 text-white" />
                        </motion.div>
                      </div>

                      <AnimatePresence>
                        {expandedFaq === index && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <motion.p
                              className="text-blue-100 leading-relaxed text-sm mt-4 pt-4 border-t border-white/20"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.3, delay: 0.1 }}
                            >
                              {faq.answer}
                            </motion.p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.h2
              className="text-5xl font-bold text-gray-900 mb-6"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              style={{
                background: "linear-gradient(45deg, #1f2937, #3b82f6, #1f2937)",
                backgroundSize: "200% 200%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text"
              }}
            >
              Planes y Precios
            </motion.h2>
            <motion.p
              className="text-xl text-gray-600"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Elige el plan perfecto para tu copropiedad
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={index}
                className={`relative bg-white rounded-2xl shadow-lg border-2 ${
                  plan.popular ? 'border-orange-500 scale-105' : 'border-gray-200'
                } p-8 transition-all duration-300 hover:shadow-2xl`}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
              >
                {plan.popular && (
                  <motion.div
                    className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-full text-sm font-medium"
                    animate={{
                      scale: [1, 1.05, 1],
                      transition: { duration: 2, repeat: Infinity }
                    }}
                  >
                    Más Popular
                  </motion.div>
                )}

                <div className="text-center mb-8">
                  <motion.h3
                    className="text-2xl font-bold text-gray-900 mb-4"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  >
                    {plan.name}
                  </motion.h3>
                  <div className="flex items-baseline justify-center mb-2">
                    <motion.span
                      className="text-5xl font-bold text-gray-900"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                    >
                      {plan.price}
                    </motion.span>
                    <span className="text-gray-600 ml-2">{plan.period}</span>
                  </div>
                  <p className="text-gray-600">{plan.description}</p>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <motion.li
                      key={featureIndex}
                      className="flex items-center gap-3"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: featureIndex * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity, delay: featureIndex * 0.3 }}
                      >
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                      </motion.div>
                      <span className="text-gray-700">{feature}</span>
                    </motion.li>
                  ))}
                </ul>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={() => plan.name === "Empresarial" ? console.log("Contactar ventas") : setShowLoginModal(true)}
                    className={`w-full ${
                      plan.color === 'orange'
                        ? 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700'
                        : plan.color === 'green'
                        ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
                        : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
                    } text-white font-medium py-3 px-6 h-auto transition-all duration-300 shadow-lg hover:shadow-xl`}
                  >
                    {plan.buttonText}
                  </Button>
                </motion.div>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="text-center mt-16"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <motion.div
              className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 max-w-2xl mx-auto"
              whileHover={{
                scale: 1.05,
                boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                transition: { duration: 0.3 }
              }}
              animate={pulseAnimation}
            >
              <motion.h3
                className="text-2xl font-bold text-gray-900 mb-4"
                animate={{
                  color: ["#1f2937", "#3b82f6", "#1f2937"]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                ¿Necesitas un plan personalizado?
              </motion.h3>
              <motion.p
                className="text-gray-600 mb-6"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                viewport={{ once: true }}
              >
                Contáctanos para crear una solución a medida para tu copropiedad
              </motion.p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={() => console.log("Contactar ventas personalizado")}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium px-6 py-3 h-auto"
                >
                  <motion.span
                    animate={{ opacity: [1, 0.7, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    Contactar Ventas
                  </motion.span>
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 relative overflow-hidden">
        {/* Background Pattern */}
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              "linear-gradient(to bottom right, #2563eb, #1d4ed8, #1e40af)",
              "linear-gradient(to bottom right, #1d4ed8, #1e40af, #2563eb)",
              "linear-gradient(to bottom right, #2563eb, #1d4ed8, #1e40af)"
            ]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        >
          <motion.div
            className="absolute top-0 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl"
            animate={floatingAnimation}
          />
          <motion.div
            className="absolute bottom-0 right-1/4 w-80 h-80 bg-white/5 rounded-full blur-3xl"
            animate={{
              ...floatingAnimation,
              transition: { ...floatingAnimation.transition, delay: 1 }
            }}
          />
        </motion.div>

        <div className="container mx-auto px-6 text-center relative z-10">
          <motion.div
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.h2
              className="text-5xl font-bold text-white mb-6"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              animate={{
                textShadow: [
                  "0 0 20px rgba(255,255,255,0.3)",
                  "0 0 30px rgba(255,255,255,0.5)",
                  "0 0 20px rgba(255,255,255,0.3)"
                ]
              }}
            >
              Haz crecer tu copropiedad con el ecosistema que lo tiene todo
            </motion.h2>
            <motion.p
              className="text-xl text-blue-100 mb-12"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              Únete hoy y transforma la gestión de tu copropiedad con GRAVY
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-6 justify-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  onClick={scrollToPricing}
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-lg px-8 py-4 h-auto font-medium shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  Ver Planes
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </motion.div>
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  onClick={() => setShowLoginModal(true)}
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white text-lg px-8 py-4 h-auto font-medium shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Play className="mr-2 h-5 w-5" />
                  </motion.div>
                  Iniciar Sesión
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Support Section */}
      <section id="support" className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.h2
              className="text-5xl font-bold text-gray-900 mb-6"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              style={{
                background: "linear-gradient(45deg, #1f2937, #3b82f6, #1f2937)",
                backgroundSize: "200% 200%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text"
              }}
            >
              Soporte Técnico
            </motion.h2>
            <motion.p
              className="text-xl text-gray-600 max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Nuestro equipo de expertos está aquí para ayudarte. Contáctanos y resolveremos tus dudas de manera rápida y eficiente.
            </motion.p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-16 max-w-7xl mx-auto">
            {/* Contact Form */}
            <motion.div
              className="bg-gray-50 rounded-2xl p-8 shadow-lg"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <motion.h3
                className="text-2xl font-bold text-gray-900 mb-6"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                Envíanos un mensaje
              </motion.h3>

              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    viewport={{ once: true }}
                  >
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre completo
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      placeholder="Tu nombre"
                      required
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    viewport={{ once: true }}
                  >
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Correo electrónico
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      placeholder="tu@email.com"
                      required
                    />
                  </motion.div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  viewport={{ once: true }}
                >
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Asunto
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    required
                  >
                    <option value="">Selecciona un tema</option>
                    <option value="technical">Problema técnico</option>
                    <option value="billing">Facturación y pagos</option>
                    <option value="account">Cuenta y acceso</option>
                    <option value="features">Funcionalidades</option>
                    <option value="other">Otro</option>
                  </select>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  viewport={{ once: true }}
                >
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Mensaje
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none"
                    placeholder="Describe tu consulta o problema..."
                    required
                  ></textarea>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  viewport={{ once: true }}
                >
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-3 px-6 h-auto transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      <motion.span
                        animate={{ opacity: [1, 0.7, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        Enviar mensaje
                      </motion.span>
                    </Button>
                  </motion.div>
                </motion.div>
              </form>
            </motion.div>

            {/* Company Info */}
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <motion.div
                className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8"
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                  transition: { duration: 0.3 }
                }}
              >
                <motion.h3
                  className="text-2xl font-bold text-gray-900 mb-6"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  Información de la empresa
                </motion.h3>

                <div className="space-y-4">
                  <motion.div
                    className="flex items-start gap-4"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    viewport={{ once: true }}
                  >
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                    >
                      <Building2 className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
                    </motion.div>
                    <div>
                      <h4 className="font-semibold text-gray-900">GRAVY SAS</h4>
                      <p className="text-gray-600">NIT: 901.234.567-8</p>
                    </div>
                  </motion.div>

                  <motion.div
                    className="flex items-start gap-4"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    viewport={{ once: true }}
                  >
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                    >
                      <MapPin className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
                    </motion.div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Dirección</h4>
                      <p className="text-gray-600">Carrera 7 # 45-23, Oficina 1201<br />Bogotá, Colombia</p>
                    </div>
                  </motion.div>

                  <motion.div
                    className="flex items-start gap-4"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    viewport={{ once: true }}
                  >
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    >
                      <Clock className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
                    </motion.div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Horario de atención</h4>
                      <p className="text-gray-600">Lunes a Viernes: 8:00 AM - 6:00 PM<br />Sábados: 9:00 AM - 1:00 PM</p>
                    </div>
                  </motion.div>
                </div>
              </motion.div>

              <motion.div
                className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8"
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                  transition: { duration: 0.3 }
                }}
              >
                <motion.h4
                  className="text-xl font-bold text-gray-900 mb-4"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  Canales de soporte
                </motion.h4>

                <div className="space-y-3">
                  <motion.div
                    className="flex items-center gap-3"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    viewport={{ once: true }}
                  >
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <MessageSquare className="h-5 w-5 text-green-600" />
                    </motion.div>
                    <span className="text-gray-700">Chat en vivo (24/7)</span>
                  </motion.div>

                  <motion.div
                    className="flex items-center gap-3"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    viewport={{ once: true }}
                  >
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                    >
                      <Mail className="h-5 w-5 text-green-600" />
                    </motion.div>
                    <span className="text-gray-700">soporte@gravy.com.co</span>
                  </motion.div>

                  <motion.div
                    className="flex items-center gap-3"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    viewport={{ once: true }}
                  >
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                    >
                      <Phone className="h-5 w-5 text-green-600" />
                    </motion.div>
                    <span className="text-gray-700">+57 (1) 234-5678</span>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-20">
        <div className="container mx-auto px-6">
          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div
              className="lg:col-span-2"
              variants={itemVariants}
            >
              <motion.div
                className="flex items-center gap-3 mb-6"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <motion.img
                  src="/icono.png"
                  alt="GRAVY Logo"
                  className="w-12 h-12 rounded-lg"
                  animate={{
                    rotate: [0, 5, -5, 0],
                    transition: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                  }}
                />
                <motion.span
                  className="text-3xl font-bold"
                  animate={{
                    color: ["#ffffff", "#3b82f6", "#ffffff"]
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  GRAVY
                </motion.span>
              </motion.div>
              <motion.p
                className="text-gray-400 mb-6 text-lg leading-relaxed max-w-md"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                La plataforma más avanzada para gestión integral de copropiedades en Colombia.
                Tecnología de vanguardia para una administración eficiente.
              </motion.p>
              <motion.div
                className="flex gap-4"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <motion.a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
                  variants={itemVariants}
                  whileHover={{
                    scale: 1.1,
                    backgroundColor: "rgba(255,255,255,0.1)",
                    transition: { duration: 0.2 }
                  }}
                >
                  <Globe className="h-6 w-6" />
                </motion.a>
                <motion.a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
                  variants={itemVariants}
                  whileHover={{
                    scale: 1.1,
                    backgroundColor: "rgba(255,255,255,0.1)",
                    transition: { duration: 0.2 }
                  }}
                >
                  <Award className="h-6 w-6" />
                </motion.a>
              </motion.div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <motion.h3
                className="font-semibold mb-6 text-lg"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
              >
                Producto
              </motion.h3>
              <motion.ul
                className="space-y-3 text-gray-400"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {[
                  { href: "#features", text: "Características" },
                  { href: "#pricing", text: "Precios" },
                  { href: "#", text: "Integraciones" },
                  { href: "#", text: "API" }
                ].map((item, index) => (
                  <motion.li
                    key={index}
                    variants={itemVariants}
                    whileHover={{ x: 5, transition: { duration: 0.2 } }}
                  >
                    <a href={item.href} className="hover:text-white transition-colors">
                      {item.text}
                    </a>
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>

            <motion.div variants={itemVariants}>
              <motion.h3
                className="font-semibold mb-6 text-lg"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
              >
                Soporte
              </motion.h3>
              <motion.ul
                className="space-y-3 text-gray-400"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {[
                  { href: "#", text: "Centro de Ayuda" },
                  { href: "#", text: "Documentación" },
                  { href: "#", text: "Contacto" },
                  { href: "#", text: "Status" }
                ].map((item, index) => (
                  <motion.li
                    key={index}
                    variants={itemVariants}
                    whileHover={{ x: 5, transition: { duration: 0.2 } }}
                  >
                    <a href={item.href} className="hover:text-white transition-colors">
                      {item.text}
                    </a>
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>

            <motion.div variants={itemVariants}>
              <motion.h3
                className="font-semibold mb-6 text-lg"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
              >
                Empresa
              </motion.h3>
              <motion.ul
                className="space-y-3 text-gray-400"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {[
                  { href: "#", text: "Sobre nosotros" },
                  { href: "/blog", text: "Blog" },
                  { href: "#", text: "Carreras" },
                  { href: "#", text: "Prensa" }
                ].map((item, index) => (
                  <motion.li
                    key={index}
                    variants={itemVariants}
                    whileHover={{ x: 5, transition: { duration: 0.2 } }}
                  >
                    <a href={item.href} className="hover:text-white transition-colors">
                      {item.text}
                    </a>
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>
          </motion.div>

          <motion.div
            className="border-t border-gray-800 pt-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
              <motion.div
                className="flex flex-wrap gap-6 text-sm text-gray-400"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <motion.span variants={itemVariants}>
                  © 2024 GRAVY. Todos los derechos reservados.
                </motion.span>
                <motion.span
                  variants={itemVariants}
                  animate={{
                    color: ["#9ca3af", "#f87171", "#9ca3af"]
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  Hecho con ❤️ en Colombia
                </motion.span>
              </motion.div>
              <motion.div
                className="flex gap-6"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {[
                  { href: "#", text: "Privacidad" },
                  { href: "#", text: "Términos" },
                  { href: "#", text: "Cookies" }
                ].map((item, index) => (
                  <motion.a
                    key={index}
                    href={item.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                    variants={itemVariants}
                    whileHover={{
                      scale: 1.05,
                      color: "#ffffff",
                      transition: { duration: 0.2 }
                    }}
                  >
                    {item.text}
                  </motion.a>
                ))}
              </motion.div>
            </div>
          </motion.div>
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