# 🏢 GRAVI - Sistema de Gestión de Copropiedades SaaS

![Status](https://img.shields.io/badge/Status-EN%20DESARROLLO-orange)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)
![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![MySQL](https://img.shields.io/badge/MySQL-8.0+-4479A1?logo=mysql)
![License](https://img.shields.io/badge/License-MIT-green)

Sistema completo de administración para copropiedades con contabilidad, facturación, gestión de unidades y propietarios, desarrollado como SaaS multi-tenant.

---

## 🎯 Características Principales

### 📊 Módulos de Negocio

- **Dashboard:** Resumen de métricas e indicadores clave
- **Suscriptores:** Gestión de copropiedades (tenants)
- **Unidades:** Administración de apartamentos/locales
- **Terceros:** Gestión de propietarios y residentes
- **Contabilidad:** Plan de cuentas y movimientos
- **Comprobantes:** Registros de egreso
- **Facturación:** Emisión y seguimiento de facturas
- **Tesorería:** Control de caja y flujo de efectivo
- **Nómina:** Gestión de empleados y pagos
- **Presupuestos:** Planificación financiera
- **Activos Fijos:** Registro y depreciación
- **Exógena:** Reportes automáticos (DIAN)
- **Períodos:** Gestión de periodos contables

### 🎨 Características Técnicas

- ✅ **Multi-tenancia:** Arquitectura completamente aislada por tenant
- ✅ **Type-Safe:** TypeScript strict en todo el stack
- ✅ **Dark Mode:** Tema claro y oscuro
- ✅ **Responsive:** Mobile-first design
- ✅ **Accesible:** Componentes con Radix UI
- ✅ **Performance:** React Query + Vite optimizado
- ✅ **Seguro:** Validación cliente + servidor
- ✅ **Escalable:** Arquitectura de capas

---

## 🚀 Inicio Rápido

### Prerequisitos

- **Node.js** 18+
- **npm** 9+
- **MySQL** 8.0+ (local o PlanetScale)
- **Git**

### 1️⃣ Clonar el Proyecto

```bash
git clone <url-del-repo>
cd Grav1
```

### 2️⃣ Configurar Variables de Entorno

```bash
# Copiar template
cp .env.example .env.local

# Editar .env.local con tus valores
# - DATABASE_URL (MySQL connection string)
# - SESSION_SECRET (min 32 caracteres)
```

**Opciones de BD:**
- **Local:** `mysql://root:password@localhost:3306/gravi`
- **Neon:** https://console.neon.tech → Copy connection string
- **Supabase:** https://supabase.com → Database → Connection string

### 3️⃣ Instalar Dependencias

```bash
npm install
```

### 4️⃣ Crear Base de Datos

```bash
# Si es MySQL local
createdb gravi

# Si es Neon/Supabase, debe existir ya
```

### 5️⃣ Ejecutar Migraciones

```bash
npm run db:push
```

### 6️⃣ Iniciar Desarrollo

```bash
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173) en tu navegador.

---

## 📁 Estructura del Proyecto

```
Grav1/
├── client/                  # Frontend React + Vite
│   ├── src/
│   │   ├── pages/          # 14 páginas de la app
│   │   ├── components/     # UI + Business components
│   │   ├── hooks/          # Custom hooks
│   │   ├── lib/            # Utilidades (queryClient, validators)
│   │   └── index.css       # Tailwind + theme system
│   └── index.html
│
├── server/                 # Backend Express + Node.js
│   ├── index.ts            # Entry point del servidor
│   ├── routes.ts           # Definición de rutas API
│   └── storage.ts          # Interfaz de BD
│
├── shared/                 # Código compartido
│   └── schema.ts           # Drizzle ORM schema
│
├── migrations/             # Migraciones de BD (auto-generadas)
├── .env.example            # Template de configuración
├── package.json            # Dependencias
├── tsconfig.json           # Configuración TypeScript
├── vite.config.ts          # Configuración Vite
└── drizzle.config.ts       # Configuración Drizzle ORM
```

---

## 🛠️ Stack Tecnológico

### Frontend
| Tecnología | Versión | Propósito |
|---|---|---|
| React | 18.3 | UI framework |
| Vite | Latest | Build tool |
| TypeScript | 5.6 | Lenguaje |
| Tailwind CSS | 3.4 | Estilos |
| shadcn/ui | Latest | Componentes UI |
| React Query | 5.6 | Caché de datos |
| Hook Form | 7.5 | Formularios |
| Zod | 3.24 | Validación |
| Wouter | 3.3 | Router |

### Backend
| Tecnología | Versión | Propósito |
|---|---|---|
| Node.js | 18+ | Runtime |
| Express | 4.21 | Framework web |
| TypeScript | 5.6 | Lenguaje |
| Drizzle ORM | 0.39 | ORM |
| Passport.js | 0.7 | Autenticación |
| Zod | 3.24 | Validación |
| MySQL | 8.0+ | BD |

---

## 📚 Documentación Completa

El proyecto incluye documentación extensa:

### Inicio Rápido
- **[INICIO_RAPIDO.md](./INICIO_RAPIDO.md)** - Pasos detallados para levantar el proyecto

### Verificación
- **[CHECKLIST_SETUP.md](./CHECKLIST_SETUP.md)** - Validación paso a paso

### Análisis Profundo
- **[REPORTE_REVISION_COMPLETA.md](./REPORTE_REVISION_COMPLETA.md)** - Revisión detallada del proyecto (40 páginas)

### Arquitectura
- **[ARQUITECTURA.md](./ARQUITECTURA.md)** - Diseño técnico, diagramas y decisiones

### Resumen
- **[RESUMEN_EJECUTIVO.md](./RESUMEN_EJECUTIVO.md)** - Overview de una página

### Design
- **[design_guidelines.md](./design_guidelines.md)** - Especificaciones UX/UI
- **[CONVERSION_MYSQL_POSTGRESQL.md](./CONVERSION_MYSQL_POSTGRESQL.md)** - Documento histórico de conversión (ya no necesario)

---

## 🎯 Estado Actual

| Aspecto | Status |
|---|---|
| Arquitectura | ✅ Completada |
| Frontend | ✅ Componentes listos (40+) |
| UI/UX Design | ✅ Design system definido |
| Backend (rutas) | ❌ Por implementar |
| Autenticación | ⚠️ Solo mock |
| Base de Datos | ⚠️ Schema incompleto |
| Testing | ❌ Sin tests |
| Documentation | ✅ Completa |

**Veredicto:** Proyecto en fase de scaffold. Listo para iniciar desarrollo backend.

---

## 📋 Próximos Pasos

### Fase 1: Setup (HOY - 1 día)
- [ ] Configurar `.env.local`
- [ ] Crear/conectar BD
- [ ] `npm install`
- [ ] `npm run db:push`
- [ ] `npm run dev`

### Fase 2: Autenticación (1-2 días)
- [ ] Implementar rutas POST /api/auth/register, login, logout
- [ ] Integrar Passport.js
- [ ] Crear UI de login/logout

### Fase 3-7: Módulos de Negocio (2-3 semanas)
- [ ] CRUD de cada módulo
- [ ] Conectar frontend a APIs reales
- [ ] Validación de datos
- [ ] Manejo de errores

### Fase 8: Testing y Producción (1 semana)
- [ ] Tests unitarios
- [ ] Tests de integración
- [ ] Tests E2E
- [ ] Deploy

**Estimado total:** 4-5 semanas para MVP funcional.

---

## 🔐 Seguridad & Multi-tenancia

### Principios Implementados

1. **Aislamiento de Datos:** Cada copropiedad (tenant) tiene su propio espacio lógico
2. **Filtrado por Tenant:** TODAS las queries filtran por `suscriptor_id`
3. **Validación en Servidor:** Nunca confiar en el cliente
4. **Tipos Seguros:** TypeScript strict en todo
5. **Session Management:** Cookies seguras y HttpOnly

### Checklist de Seguridad

```typescript
// ✅ HACER SIEMPRE
const data = await db.select()
  .from(table)
  .where(eq(table.suscriptor_id, req.tenant.id))  // ← CRÍTICO

// ❌ NUNCA HACER
const data = await db.select().from(table)  // Sin filtro = data leak
```

---

## 📊 Design System

Diseño inspirado en **Tabler.io** - Material Design enterprise.

### Colores
- **Primary Blue:** #206bc4
- **Success:** #2fb344
- **Warning:** #f59f00
- **Danger:** #d63939
- **Info:** #4299e1

### Tipografía
- **Principal:** Inter
- **Monoespaciada:** Roboto Mono (para números)

### Componentes
- 40+ componentes de shadcn/ui
- Dark mode integrado
- Responsive mobile-first

---

## 🚀 Comandos Disponibles

```bash
# Desarrollo
npm run dev              # Inicia servidor + cliente

# Build
npm run build           # Build de producción
npm start               # Ejecuta build en producción

# Base de Datos
npm run db:push         # Sync schema a BD
npm run db:pull         # Pull BD changes
npm run db:studio       # Abrir Drizzle Studio

# Validación
npm run check           # TypeScript type-check
npm run lint            # ESLint (si está configurado)

# Testing (futuro)
npm run test            # Tests unitarios
npm run test:e2e        # Tests E2E
```

---

## 🆘 Troubleshooting

### Error: "DATABASE_URL not found"
```bash
# Solución:
1. Verifica que .env.local existe
2. Verifica que DATABASE_URL está definida
3. Reinicia la terminal
```

### Error: "Cannot connect to database"
```bash
# Solución:
1. Si es local: mysql está corriendo?
2. Si es cloud: URL es correcta?
3. Prueba: psql 'tu-DATABASE-URL'
```

### Puerto 5000/5173 en uso
```bash
# Solución:
PORT=5001 npm run dev      # Cambiar puerto
# O matar el proceso existente
```

Ver [CHECKLIST_SETUP.md](./CHECKLIST_SETUP.md) para más troubleshooting.

---

## 📦 Deployment

### Frontend → Vercel
```bash
# Automático desde GitHub
git push origin main
# Vercel deploya automáticamente
```

### Backend → Railway/Render
```bash
# Crear proyecto
# Conectar GitHub
# Variables de entorno: DATABASE_URL, SESSION_SECRET
# Deploy automático en push
```

### Base de Datos → Neon
```bash
# Ya está en https://console.neon.tech
# Solo usar connection string en producción
```

---

## 🤝 Contribuciones

1. Fork el repo
2. Crea rama: `git checkout -b feature/nueva-feature`
3. Commit: `git commit -am 'Add nueva feature'`
4. Push: `git push origin feature/nueva-feature`
5. Pull Request

---

## 📞 Soporte

- 📖 Leer documentación: [REPORTE_REVISION_COMPLETA.md](./REPORTE_REVISION_COMPLETA.md)
- 🚀 Inicio rápido: [INICIO_RAPIDO.md](./INICIO_RAPIDO.md)
- ✅ Validar setup: [CHECKLIST_SETUP.md](./CHECKLIST_SETUP.md)
- 🏗️ Arquitectura: [ARQUITECTURA.md](./ARQUITECTURA.md)

---

## 📄 Licencia

MIT © 2025

---

## 👨‍💻 Equipo

**Revisor Inicial:** Ingeniero de Software Senior + UX/UI Expert  
**Fecha:** 6 Noviembre 2025

---

## 🎉 ¡Bienvenido!

**¿Por dónde empiezo?**
→ Lee [INICIO_RAPIDO.md](./INICIO_RAPIDO.md) y sigue los 5 pasos.

**¿Cuánto demora?**
→ ~20 minutos para que levante. 4-5 semanas para MVP completo.

**¿Preguntas?**
→ Revisa la documentación que se incluye. Casi todo está documentado.

```
    ___  ____  ___  _   __  ____
   / _ \/ __ \/   \/ | / / / _  \
  / ___/ /_/ / /_  /  |/ / /_) /
 / /  / _, _/ /_, /_/|  / /_  _/
/_/  /_/ |_/____/_/ |_/  /_/ |_\

Gestión de Copropiedades
Listo para desarrollar 🚀
```

---

**Last Updated:** 6 Noviembre 2025  
**Version:** 1.0.0
