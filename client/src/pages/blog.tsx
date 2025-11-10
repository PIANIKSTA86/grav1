import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  User,
  ArrowRight,
  Search,
  Tag,
  ChevronLeft,
  ChevronRight,
  X,
  Mail,
  Bell
} from "lucide-react";
import { useLocation } from "wouter";

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  tags: string[];
  image: string;
}

const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: "Guía completa de la Resolución 000015 de 2024 - DIAN",
    excerpt: "Análisis detallado de la nueva resolución que modifica el régimen de propiedad horizontal. Impactos en la contabilidad de copropiedades y obligaciones de los administradores.",
    content: "La Resolución 000015 de 2024 introduce cambios significativos...",
    author: "Dra. María González",
    date: "2024-01-15",
    readTime: "8 min",
    category: "Normativa",
    tags: ["DIAN", "Propiedad Horizontal", "Resolución 000015", "Administradores"],
    image: "/api/placeholder/600/400"
  },
  {
    id: 2,
    title: "IVA en zonas comunes: ¿Deben facturarse los servicios públicos?",
    excerpt: "Análisis jurídico y contable sobre la aplicación del IVA en servicios públicos de zonas comunes. Casos prácticos y recomendaciones para copropiedades.",
    content: "Uno de los temas más controvertidos en la gestión de copropiedades...",
    author: "Carlos Rodríguez, CPA",
    date: "2024-01-10",
    readTime: "6 min",
    category: "Impuestos",
    tags: ["IVA", "Servicios Públicos", "Zonas Comunes", "Facturación"],
    image: "/api/placeholder/600/400"
  },
  {
    id: 3,
    title: "Checklist completo para asambleas de copropiedad 2024",
    excerpt: "Guía práctica con todos los aspectos legales, contables y administrativos que debe considerar antes, durante y después de una asamblea de copropiedad.",
    content: "La asamblea de copropiedad es el máximo órgano de decisión...",
    author: "Ana Martínez, Abogada",
    date: "2024-01-05",
    readTime: "10 min",
    category: "Contabilidad",
    tags: ["Asamblea", "Copropiedad", "Legal", "Administración"],
    image: "/api/placeholder/600/400"
  },
  {
    id: 4,
    title: "Ciberseguridad en copropiedades: Protección de datos personales",
    excerpt: "Guías prácticas para implementar medidas de seguridad digital en la gestión de copropiedades. Cumplimiento con la Ley 1581 de 2012 y estándares internacionales.",
    content: "Con el aumento de la digitalización en la gestión de copropiedades...",
    author: "Luis Sánchez, CISO",
    date: "2023-12-28",
    readTime: "7 min",
    category: "Seguridad",
    tags: ["Ciberseguridad", "Protección Datos", "Ley 1581", "Digitalización"],
    image: "/api/placeholder/600/400"
  },
  {
    id: 5,
    title: "Estadísticas del sector inmobiliario colombiano 2024",
    excerpt: "Análisis de datos del mercado de propiedad horizontal en Colombia. Tendencias, precios promedio, distribución regional y proyecciones para el próximo año.",
    content: "El sector de propiedad horizontal en Colombia muestra signos...",
    author: "Diego Torres, Economista",
    date: "2023-12-20",
    readTime: "5 min",
    category: "Datos",
    tags: ["Estadísticas", "Mercado", "Precios", "Tendencias"],
    image: "/api/placeholder/600/400"
  },
  {
    id: 6,
    title: "Curiosidades históricas de la propiedad horizontal en Colombia",
    excerpt: "Descubre hechos fascinantes sobre la evolución de las copropiedades en Colombia, desde las primeras normas hasta las tendencias modernas de convivencia.",
    content: "La propiedad horizontal en Colombia tiene una historia rica...",
    author: "Sofia López, Historiadora",
    date: "2023-12-15",
    readTime: "4 min",
    category: "Curiosidades",
    tags: ["Historia", "Colombia", "Propiedad Horizontal", "Evolución"],
    image: "/api/placeholder/600/400"
  },
  {
    id: 7,
    title: "Reforma tributaria 2024: Impactos en copropiedades",
    excerpt: "Análisis completo de cómo la nueva reforma tributaria afecta a las copropiedades. Cambios en impuesto de renta, IVA y otras obligaciones fiscales.",
    content: "La reforma tributaria aprobada recientemente introduce...",
    author: "Dra. María González",
    date: "2023-12-10",
    readTime: "9 min",
    category: "Normativa",
    tags: ["Reforma Tributaria", "Impuestos", "Copropiedades", "2024"],
    image: "/api/placeholder/600/400"
  },
  {
    id: 8,
    title: "Contabilidad digital: Transformación en la gestión de condominios",
    excerpt: "Cómo la tecnología está revolucionando la contabilidad de copropiedades. Beneficios de la digitalización y mejores prácticas para administradores.",
    content: "La transformación digital ha llegado al sector de propiedad horizontal...",
    author: "Carlos Rodríguez, CPA",
    date: "2023-12-05",
    readTime: "6 min",
    category: "Contabilidad",
    tags: ["Digitalización", "Contabilidad", "Tecnología", "Administración"],
    image: "/api/placeholder/600/400"
  },
  {
    id: 9,
    title: "Régimen de propiedad horizontal: Guía actualizada 2024",
    excerpt: "Todo lo que necesitas saber sobre el régimen de propiedad horizontal en Colombia. Normativa, derechos, deberes y mejores prácticas de gestión.",
    content: "El régimen de propiedad horizontal regula la convivencia...",
    author: "Ana Martínez, Abogada",
    date: "2023-12-01",
    readTime: "12 min",
    category: "Legal",
    tags: ["Propiedad Horizontal", "Normativa", "Derechos", "Deberes"],
    image: "/api/placeholder/600/400"
  }
];

const categories = ["Todos", "Normativa", "Impuestos", "Contabilidad", "Seguridad", "Datos", "Curiosidades", "Legal"];

const alerts = [
  {
    id: 1,
    title: "Nueva resolución DIAN sobre facturación electrónica",
    type: "urgent",
    date: "2024-01-15",
    source: "DIAN"
  },
  {
    id: 2,
    title: "Actualización CTCP sobre estados financieros",
    type: "info",
    date: "2024-01-12",
    source: "CTCP"
  },
  {
    id: 3,
    title: "Plazo para declaración de IVA vence mañana",
    type: "warning",
    date: "2024-01-14",
    source: "DIAN"
  }
];

export default function Blog() {
  const [, setLocation] = useLocation();
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
  const [subscribeEmail, setSubscribeEmail] = useState("");
  const postsPerPage = 6;

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === "Todos" || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const paginatedPosts = filteredPosts.slice(startIndex, startIndex + postsPerPage);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 text-white font-bold text-xl">
                G
              </div>
              <span className="text-2xl font-bold text-gray-900">GRAVY</span>
            </div>
            <Button
              onClick={() => setLocation("/landing")}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
            >
              Volver al Inicio
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-20">
        <div className="container mx-auto px-6 text-center">
          <motion.h1
            className="text-5xl font-bold mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Centro de Conocimiento GRAVY
          </motion.h1>
          <motion.p
            className="text-xl text-blue-100 max-w-3xl mx-auto mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Tu fuente de referencia en contabilidad colombiana, normativa DIAN/CTCP,
            propiedad horizontal y mejores prácticas para administradores de copropiedades.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Button
              onClick={() => setShowSubscribeModal(true)}
              className="bg-white text-blue-600 hover:bg-gray-100 font-medium px-8 py-3"
            >
              🔔 Suscribirme a Alertas Normativas
            </Button>
            <Button
              onClick={() => setLocation("/landing")}
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-600 font-medium px-8 py-3"
            >
              Ver Planes GRAVY
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Featured Articles */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Artículos Destacados
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Los temas más relevantes del momento en contabilidad colombiana y gestión de copropiedades
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {blogPosts.slice(0, 3).map((post, index) => (
              <motion.article
                key={post.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <div className="aspect-video bg-gradient-to-br from-blue-100 to-blue-200 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-blue-700/20" />
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      post.category === 'Normativa' ? 'bg-red-100 text-red-800' :
                      post.category === 'Impuestos' ? 'bg-green-100 text-green-800' :
                      post.category === 'Contabilidad' ? 'bg-blue-100 text-blue-800' :
                      post.category === 'Seguridad' ? 'bg-orange-100 text-orange-800' :
                      post.category === 'Datos' ? 'bg-purple-100 text-purple-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {post.category}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className="bg-white/90 text-gray-900 px-2 py-1 rounded text-xs font-medium">
                      ⭐ Destacado
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(post.date).toLocaleDateString('es-ES')}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {post.readTime}
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                    {post.title}
                  </h3>

                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-500">{post.author}</span>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    >
                      Leer más
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-12 bg-white border-b border-gray-200">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-6 items-start justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Buscar artículos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Categories and Alerts */}
            <div className="flex flex-col sm:flex-row gap-6 w-full lg:w-auto">
              {/* Categories */}
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                      selectedCategory === category
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              {/* Alerts Widget */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 min-w-[300px]">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <h3 className="font-semibold text-red-800 text-sm">Últimas Alertas DIAN/CTCP</h3>
                </div>
                <div className="space-y-2">
                  {alerts.map((alert) => (
                    <div key={alert.id} className="text-xs">
                      <div className={`inline-block px-2 py-1 rounded text-xs font-medium mb-1 ${
                        alert.type === 'urgent' ? 'bg-red-100 text-red-800' :
                        alert.type === 'warning' ? 'bg-orange-100 text-orange-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {alert.source}
                      </div>
                      <p className="text-gray-700 font-medium">{alert.title}</p>
                      <p className="text-gray-500">{new Date(alert.date).toLocaleDateString('es-ES')}</p>
                    </div>
                  ))}
                </div>
                <Button
                  onClick={() => setShowSubscribeModal(true)}
                  size="sm"
                  className="w-full mt-3 bg-red-600 hover:bg-red-700 text-white"
                >
                  Recibir Alertas
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-gradient-to-r from-blue-50 to-green-50">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Estadísticas del Sector
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Datos actualizados sobre el mercado de propiedad horizontal en Colombia
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { label: "Copropiedades en Colombia", value: "45,000+", icon: "🏢", description: "Unidades registradas" },
              { label: "Crecimiento Anual", value: "12%", icon: "📈", description: "Sector inmobiliario" },
              { label: "Administradores Certificados", value: "8,500", icon: "👥", description: "Profesionales activos" },
              { label: "Digitalización", value: "65%", icon: "💻", description: "Copropiedades digitalizadas" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-lg text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className="text-4xl mb-4">{stat.icon}</div>
                <div className="text-3xl font-bold text-blue-600 mb-2">{stat.value}</div>
                <div className="text-lg font-semibold text-gray-900 mb-1">{stat.label}</div>
                <div className="text-sm text-gray-600">{stat.description}</div>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="mt-12 bg-white rounded-2xl p-8 shadow-lg"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
              Distribución Regional de Copropiedades
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { region: "Bogotá", percentage: 35, color: "bg-blue-500" },
                { region: "Medellín", percentage: 18, color: "bg-green-500" },
                { region: "Cali", percentage: 12, color: "bg-orange-500" },
                { region: "Barranquilla", percentage: 8, color: "bg-purple-500" },
                { region: "Cartagena", percentage: 6, color: "bg-red-500" },
                { region: "Otras Ciudades", percentage: 21, color: "bg-gray-500" }
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <div className="w-full bg-gray-200 rounded-full h-3 mr-3">
                      <motion.div
                        className={`h-3 rounded-full ${item.color}`}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${item.percentage}%` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                        viewport={{ once: true }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-700 min-w-[3rem]">
                      {item.percentage}%
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">{item.region}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          {paginatedPosts.length === 0 ? (
            <motion.div
              className="text-center py-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-gray-500 text-lg">No se encontraron artículos que coincidan con tu búsqueda.</p>
            </motion.div>
          ) : (
            <>
              <motion.div
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {paginatedPosts.map((post) => (
                  <motion.article
                    key={post.id}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
                    variants={itemVariants}
                    whileHover={{ y: -5 }}
                  >
                    <div className="aspect-video bg-gradient-to-br from-blue-100 to-blue-200 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-blue-700/20" />
                      <div className="absolute top-4 left-4">
                        <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                          {post.category}
                        </span>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(post.date).toLocaleDateString('es-ES')}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {post.readTime}
                        </div>
                      </div>

                      <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                        {post.title}
                      </h3>

                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-500">{post.author}</span>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                          Leer más
                          <ArrowRight className="h-4 w-4 ml-1" />
                        </Button>
                      </div>

                      <div className="flex flex-wrap gap-2 mt-4">
                        {post.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.article>
                ))}
              </motion.div>

              {/* Pagination */}
              {totalPages > 1 && (
                <motion.div
                  className="flex items-center justify-center gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Anterior
                  </Button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className={currentPage === page ? "bg-blue-600 hover:bg-blue-700" : ""}
                    >
                      {page}
                    </Button>
                  ))}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    Siguiente
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </motion.div>
              )}
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Convierte el Conocimiento en Resultados
            </h2>
            <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
              Únete a más de 8,500 administradores y contadores que confían en GRAVY
              para mantenerse actualizados con la normativa colombiana y optimizar sus copropiedades.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => setShowSubscribeModal(true)}
                className="bg-white text-blue-600 hover:bg-gray-100 font-medium px-8 py-3"
              >
                🔔 Recibir Alertas Gratuitas
              </Button>
              <Button
                onClick={() => setLocation("/landing")}
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-blue-600 font-medium px-8 py-3"
              >
                Conoce GRAVY
              </Button>
            </div>
            <div className="mt-8 flex items-center justify-center gap-6 text-blue-100 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Actualizaciones diarias</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Contenido exclusivo</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Comunidad profesional</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 text-white font-bold text-lg">
                  G
                </div>
                <span className="text-xl font-bold">GRAVY</span>
              </div>
              <p className="text-gray-400 text-sm mb-4">
                Referente en contabilidad colombiana y gestión de copropiedades.
                Tecnología avanzada para profesionales del sector.
              </p>
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-sm">
                  📧
                </div>
                <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center text-sm">
                  🔔
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Contenido</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#normativa" className="hover:text-white transition-colors">Normativa DIAN</a></li>
                <li><a href="#impuestos" className="hover:text-white transition-colors">Impuestos</a></li>
                <li><a href="#contabilidad" className="hover:text-white transition-colors">Contabilidad</a></li>
                <li><a href="#seguridad" className="hover:text-white transition-colors">Seguridad</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Recursos</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#datos" className="hover:text-white transition-colors">Estadísticas</a></li>
                <li><a href="#curiosidades" className="hover:text-white transition-colors">Curiosidades</a></li>
                <li><a href="#alertas" className="hover:text-white transition-colors">Alertas</a></li>
                <li><a href="#newsletter" className="hover:text-white transition-colors">Newsletter</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">GRAVY</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="/landing" className="hover:text-white transition-colors">Plataforma</a></li>
                <li><a href="/landing" className="hover:text-white transition-colors">Precios</a></li>
                <li><a href="/landing" className="hover:text-white transition-colors">Contacto</a></li>
                <li><a href="/blog" className="hover:text-white transition-colors">Blog</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2024 GRAVY. Todos los derechos reservados.
            </div>
            <div className="flex gap-6 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Política de Privacidad</a>
              <a href="#" className="hover:text-white transition-colors">Términos de Servicio</a>
              <a href="#" className="hover:text-white transition-colors">Contacto</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Subscribe Modal */}
      {showSubscribeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            className="bg-white rounded-2xl max-w-md w-full p-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Bell className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  Alertas Normativas
                </h3>
              </div>
              <button
                onClick={() => setShowSubscribeModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-6">
              <p className="text-gray-600 mb-4">
                Recibe actualizaciones sobre normativa DIAN/CTCP, cambios fiscales
                y mejores prácticas para la gestión de copropiedades.
              </p>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Actualizaciones normativas DIAN</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Cambios en propiedad horizontal</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span>Mejores prácticas contables</span>
                </div>
              </div>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              // Aquí iría la lógica para enviar el email a un servicio como Mailchimp
              alert(`¡Gracias! Te has suscrito con: ${subscribeEmail}`);
              setSubscribeEmail("");
              setShowSubscribeModal(false);
            }}>
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Correo electrónico
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="email"
                    id="email"
                    value={subscribeEmail}
                    onChange={(e) => setSubscribeEmail(e.target.value)}
                    placeholder="tu@email.com"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowSubscribeModal(false)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Suscribirme
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}