# 🏗️ GUÍA DE ARQUITECTURA - PROYECTO GRAVI

## Arquitectura General del Sistema

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CLIENTE WEB (React)                          │
│                      http://localhost:5173                           │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │                    React Application                         │   │
│  │  ┌───────────────┐  ┌───────────────┐  ┌──────────────────┐ │   │
│  │  │     Pages     │  │   Components  │  │   Hooks/Utils    │ │   │
│  │  │               │  │               │  │                  │ │   │
│  │  │ - Dashboard   │  │ - UI Widgets  │  │ - useQuery       │ │   │
│  │  │ - Suscriptores│  │ - Forms       │  │ - Custom Hooks   │ │   │
│  │  │ - Comprobantes│  │ - Tables      │  │ - API Client     │ │   │
│  │  └───────────────┘  └───────────────┘  └──────────────────┘ │   │
│  │                                                                │   │
│  │  React Query (Caché de datos)                                │   │
│  │  Tailwind CSS + shadcn/ui (Estilos)                         │   │
│  │  Wouter (Routing)                                            │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                 ↓                                    │
│                    HTTP/JSON API Calls                              │
│                      /api/...                                       │
└─────────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│                     SERVIDOR BACKEND (Node.js)                      │
│                       http://localhost:5000                         │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │                    Express Server                            │   │
│  │                                                              │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌────────────────────┐ │   │
│  │  │   Routes     │  │  Middleware  │  │    Controllers     │ │   │
│  │  │              │  │              │  │                    │ │   │
│  │  │ /api/auth    │  │ - Auth       │  │ - Handle requests  │ │   │
│  │  │ /api/...     │  │ - Validation │  │ - Parse data       │ │   │
│  │  │              │  │ - Errors     │  │ - Call services    │ │   │
│  │  └──────────────┘  └──────────────┘  └────────────────────┘ │   │
│  │         ↓                  ↓                  ↓              │   │
│  │  ┌──────────────────────────────────────────────────────┐   │   │
│  │  │          Services (Lógica de Negocio)               │   │   │
│  │  │                                                      │   │   │
│  │  │  - UserService         (Gestión de usuarios)        │   │   │
│  │  │  - SuscriptorService   (Gestión de copropiedades)  │   │   │
│  │  │  - ComprobanteService  (Gestión de comprobantes)   │   │   │
│  │  │  - FacturaService      (Gestión de facturas)       │   │   │
│  │  │  - [otros servicios]                                │   │   │
│  │  └──────────────────────────────────────────────────────┘   │   │
│  │         ↓                                                    │   │
│  │  ┌──────────────────────────────────────────────────────┐   │   │
│  │  │     Repositories (Acceso a Datos)                    │   │   │
│  │  │                                                      │   │   │
│  │  │  - UserRepository                                    │   │   │
│  │  │  - SuscriptorRepository                             │   │   │
│  │  │  - ComprobanteRepository                            │   │   │
│  │  │  - [otros repositorios]                            │   │   │
│  │  └──────────────────────────────────────────────────────┘   │   │
│  │         ↓ (Drizzle ORM)                                     │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                              ↓                                       │
│                    Database Queries                                  │
└─────────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│               BASE DE DATOS (MySQL)                            │
│               Local / PlanetScale / AWS RDS                      │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │                   Tablas (Schema)                            │   │
│  │                                                              │   │
│  │  usuarios          → Datos de usuarios del sistema          │   │
│  │  suscriptores      → Copropiedades (tenants)               │   │
│  │  unidades          → Apartamentos/Locales                  │   │
│  │  terceros          → Propietarios/Residentes              │   │
│  │  comprobantes      → Registros contables                  │   │
│  │  facturas          → Documentos de facturación            │   │
│  │  periodos          → Periodos contables                   │   │
│  │  [más tablas...]   → Otras entidades de negocio          │   │
│  │                                                              │   │
│  │  Cada tabla tiene: suscriptor_id (para multi-tenancia)    │   │
│  └──────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 📁 Estructura de Carpetas Detallada

```
Grav1/
│
├── 📄 package.json                 ← Dependencias del proyecto
├── 📄 tsconfig.json                ← Configuración TypeScript
├── 📄 vite.config.ts               ← Configuración Vite (build)
├── 📄 tailwind.config.ts           ← Configuración Tailwind CSS
├── 📄 drizzle.config.ts            ← Configuración Drizzle ORM
├── 📄 .env.example                 ← Template de variables de entorno
├── 📄 .env.local                   ← Variables locales (no commitar)
├── 📄 components.json              ← Configuración de shadcn/ui
│
├── 📁 client/                      ← FRONTEND (React + Vite)
│   ├── 📄 index.html               ← HTML principal
│   ├── 📄 public/                  ← Assets estáticos (favicon, etc)
│   │
│   └── 📁 src/
│       ├── 📄 main.tsx             ← Punto de entrada React
│       ├── 📄 App.tsx              ← Componente raíz
│       ├── 📄 index.css            ← Estilos globales + Tailwind
│       │
│       ├── 📁 pages/               ← Páginas de la aplicación
│       │   ├── dashboard.tsx       ← Dashboard principal
│       │   ├── suscriptores.tsx    ← Gestión de copropiedades
│       │   ├── unidades.tsx        ← Gestión de unidades
│       │   ├── terceros.tsx        ← Gestión de propietarios
│       │   ├── plan-cuentas.tsx    ← Catálogo de cuentas contables
│       │   ├── comprobantes.tsx    ← Comprobantes de egreso
│       │   ├── facturacion.tsx     ← Facturación
│       │   ├── tesoreria.tsx       ← Tesorería
│       │   ├── nomina.tsx          ← Nómina
│       │   ├── presupuestos.tsx    ← Presupuestos
│       │   ├── activos-fijos.tsx   ← Activos fijos
│       │   ├── exogena.tsx         ← Información exógena
│       │   ├── periodos.tsx        ← Gestión de periodos
│       │   ├── landing.tsx         ← Página de inicio
│       │   └── not-found.tsx       ← Página 404
│       │
│       ├── 📁 components/          ← Componentes React
│       │   ├── 📁 ui/              ← Componentes de UI (shadcn)
│       │   │   ├── button.tsx      ← Botón reutilizable
│       │   │   ├── card.tsx        ← Tarjeta contenedor
│       │   │   ├── input.tsx       ← Input de texto
│       │   │   ├── form.tsx        ← Componente Form
│       │   │   ├── table.tsx       ← Tabla de datos
│       │   │   ├── dialog.tsx      ← Modal
│       │   │   ├── select.tsx      ← Selector
│       │   │   ├── [+35 componentes más]
│       │   │
│       │   ├── 📁 forms/           ← Formularios de negocio (crear cuando sea necesario)
│       │   │   ├── SuscriptorForm.tsx
│       │   │   ├── UnidadForm.tsx
│       │   │   └── [otros formularios]
│       │   │
│       │   ├── 📁 tables/          ← Tablas de negocio (crear cuando sea necesario)
│       │   │   ├── ComprobantesTable.tsx
│       │   │   ├── UnidadesTable.tsx
│       │   │   └── [otras tablas]
│       │   │
│       │   ├── horizontal-header.tsx      ← Header navigation
│       │   ├── authenticated-layout.tsx   ← Layout para rutas protegidas
│       │   ├── theme-provider.tsx        ← Provider de tema (light/dark)
│       │   ├── theme-toggle.tsx          ← Toggle de tema
│       │   ├── user-menu.tsx             ← Menú de usuario
│       │   ├── suscriptor-selector.tsx   ← Selector de copropiedad
│       │   ├── empty-state.tsx           ← Estado vacío
│       │   └── stat-card.tsx             ← Tarjeta de métrica
│       │
│       ├── 📁 hooks/               ← Custom Hooks
│       │   ├── use-mobile.tsx      ← Hook para detectar mobile
│       │   └── use-toast.ts        ← Hook para notificaciones
│       │
│       ├── 📁 lib/                 ← Utilidades y librerías
│       │   ├── queryClient.ts      ← Configuración de React Query
│       │   ├── utils.ts            ← Funciones útiles (cn, etc)
│       │   ├── api.ts              ← Cliente HTTP (crear si es necesario)
│       │   └── validators.ts       ← Esquemas Zod (crear cuando sea necesario)
│       │
│       └── 📁 examples/            ← Componentes de ejemplo (opcional)
│           └── [componentes de referencia]
│
├── 📁 server/                      ← BACKEND (Express + Node.js)
│   ├── 📄 index.ts                 ← Punto de entrada del servidor
│   ├── 📄 routes.ts                ← Definición de rutas API
│   ├── 📄 storage.ts               ← Interfaz de almacenamiento
│   ├── 📄 vite.ts                  ← Integración con Vite (dev)
│   │
│   ├── 📁 db/                      ← Base de datos (crear)
│   │   └── 📄 index.ts             ← Conexión a Drizzle
│   │
│   ├── 📁 middleware/              ← Middlewares Express (crear)
│   │   ├── auth.ts                 ← Autenticación
│   │   ├── validation.ts           ← Validación de datos
│   │   ├── error-handler.ts        ← Manejo de errores
│   │   └── tenant.ts               ← Filtrado por tenant (multi-tenancia)
│   │
│   ├── 📁 routes/                  ← Rutas organizadas (crear)
│   │   ├── auth.ts                 ← Rutas de autenticación
│   │   ├── suscriptores.ts         ← Rutas de suscriptores
│   │   ├── unidades.ts             ← Rutas de unidades
│   │   ├── comprobantes.ts         ← Rutas de comprobantes
│   │   └── [más rutas...]
│   │
│   ├── 📁 controllers/             ← Controladores (crear)
│   │   ├── auth.controller.ts      ← Lógica de autenticación
│   │   ├── suscriptor.controller.ts
│   │   └── [otros controladores]
│   │
│   ├── 📁 services/                ← Servicios de negocio (crear)
│   │   ├── auth.service.ts         ← Lógica de negocio de auth
│   │   ├── suscriptor.service.ts   ← Lógica de suscriptores
│   │   ├── user.service.ts         ← Lógica de usuarios
│   │   └── [otros servicios]
│   │
│   ├── 📁 repositories/            ← Acceso a datos (crear)
│   │   ├── user.repository.ts      ← Query a usuarios
│   │   ├── suscriptor.repository.ts ← Query a suscriptores
│   │   └── [otros repositorios]
│   │
│   ├── 📁 utils/                   ← Utilidades (crear)
│   │   ├── errors.ts               ← Clases de error
│   │   ├── validators.ts           ← Esquemas Zod
│   │   ├── formatters.ts           ← Formateadores de datos
│   │   └── logger.ts               ← Sistema de logging
│   │
│   └── 📁 types/                   ← Tipos TypeScript (crear)
│       └── index.ts                ← Tipos globales del backend
│
├── 📁 shared/                      ← CÓDIGO COMPARTIDO (Client + Server)
│   ├── 📄 schema.ts                ← Schema de Drizzle (BD)
│   ├── 📁 types/                   ← Tipos compartidos (crear)
│   │   └── index.ts                ← Interfaces compartidas
│   ├── 📁 enums/                   ← Enumeraciones (crear)
│   │   └── index.ts                ← Estados, tipos, etc
│   └── 📁 validators/              ← Esquemas Zod (crear)
│       └── index.ts                ← Schemas de validación
│
├── 📁 migrations/                  ← Migraciones de BD (generadas por Drizzle)
│   └── [archivos .sql generados]
│
├── 📁 attached_assets/             ← Assets (archivos adjuntos)
│   ├── Desarrollo Full-Stack del SaaS Grav_1762464619975.txt
│   └── generated_images/
│
├── 📁 .git/                        ← Control de versiones
├── 📄 .gitignore                   ← Archivos a ignorar
├── 📄 .replit                      ← Config de Replit (si aplica)
│
├── 📄 README.md                    ← Documentación principal (crear)
├── 📄 REPORTE_REVISION_COMPLETA.md ← Análisis detallado del proyecto
├── 📄 INICIO_RAPIDO.md             ← Guía de inicio rápido
├── 📄 CHECKLIST_SETUP.md           ← Checklist de verificación
├── 📄 design_guidelines.md         ← Especificación de diseño
└── 📄 ARQUITECTURA.md              ← Este archivo
```

---

## 🔄 Flujo de Datos: Ejemplo Real

### Caso: Usuario intenta listar Comprobantes

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. USUARIO HACE CLIC EN "COMPROBANTES"                         │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 2. FRONTEND: Componente Comprobantes                           │
│    - React Query: useQuery("/api/comprobantes")                │
│    - Muestra skeleton/loading                                  │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 3. FRONTEND: HTTP Request                                      │
│    GET /api/comprobantes                                       │
│    Headers: Cookie (session)                                   │
│    Credenciales: include                                       │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 4. BACKEND: Middleware                                         │
│    - auth.middleware: Verificar que usuario está loguado       │
│    - tenant.middleware: Extraer suscriptor_id del usuario      │
│    - logging.middleware: Registrar request                     │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 5. BACKEND: Route Handler                                      │
│    GET /api/comprobantes → comprobanteController.list()        │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 6. BACKEND: Controller                                         │
│    - Validar parámetros (filtros, paginación)                  │
│    - Llamar a service.list()                                   │
│    - Retornar respuesta formateada                             │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 7. BACKEND: Service (Lógica de Negocio)                        │
│    - Llamar a repository.find()                                │
│    - Aplicar reglas de negocio                                 │
│    - Retornar datos formateados                                │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 8. BACKEND: Repository (Acceso a Datos)                        │
│    const comprobantes = await db.select()                      │
│      .from(comprobantes)                                       │
│      .where(eq(comprobantes.suscriptor_id, req.tenant.id))    │
│      .limit(20)                                                │
│      .offset(0);                                               │
│    return comprobantes;                                        │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 9. BASE DE DATOS: Ejecución SQL                                │
│    SELECT * FROM comprobantes                                  │
│    WHERE suscriptor_id = 'abc-123-def'                         │
│    LIMIT 20 OFFSET 0;                                          │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 10. BASE DE DATOS: Retorna Filas                               │
│     [                                                           │
│       { id: 1, numero: "CE-001", monto: 150000, ... },        │
│       { id: 2, numero: "CE-002", monto: 250000, ... },        │
│       ...                                                       │
│     ]                                                           │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 11. BACKEND: Repository Retorna                                │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 12. BACKEND: Service Procesa                                   │
│     - Formatea moneda                                          │
│     - Aplica transformaciones                                  │
│     - Retorna al controller                                    │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 13. BACKEND: Controller Retorna                                │
│     res.json({                                                 │
│       success: true,                                           │
│       data: comprobantes,                                      │
│       total: 150                                               │
│     })                                                         │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 14. FRONTEND: HTTP Response Recibida                           │
│     Status: 200 OK                                             │
│     Body: { success: true, data: [...], total: 150 }          │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 15. FRONTEND: React Query Caché                                │
│     - Almacena respuesta en caché                              │
│     - Sincroniza estado del componente                         │
│     - Re-renderiza con datos reales                            │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 16. USUARIO: Ve Tabla de Comprobantes                          │
│     - Datos cargados                                           │
│     - Loading desaparece                                       │
│     - Tabla mostrada con paginación                            │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔐 Multi-tenancia: Garantizar Seguridad

### El Problema:
Si no filtras por `suscriptor_id`, un usuario podría ver datos de otros suscriptores.

### La Solución - CRÍTICA:

**1. En Repository Layer:**
```typescript
// ❌ MAL - Sin filtro de tenant
const comprobantes = await db.select()
  .from(comprobantes)
  .limit(20);

// ✅ BIEN - Con filtro de tenant
const comprobantes = await db.select()
  .from(comprobantes)
  .where(eq(comprobantes.suscriptor_id, req.tenant.id))
  .limit(20);
```

**2. En Middleware (Req Object):**
```typescript
// middleware/tenant.ts
export function requireTenant(req, res, next) {
  const userId = req.user.id;
  
  // Obtener el suscriptor_id del usuario
  // (debería venir del token o session)
  req.tenant = {
    id: req.user.suscriptor_id  // ← CRÍTICO
  };
  
  next();
}

app.use(requireTenant);  // Aplicar a todas las rutas
```

**3. Validación Extra (Paranoia es Buena):**
```typescript
// En cada endpoint sensible, validar que el suscriptor_id pertenece al usuario
const suscriptor = await SuscriptorService.getById(id);

if (suscriptor.suscriptor_id !== req.tenant.id) {
  throw new UnauthorizedError("No tienes acceso a este recurso");
}
```

---

## 🗂️ Decisiones de Arquitectura

### 1. Monorepo vs Múltiples Repositorios
**Elegida:** Monorepo
- ✅ Código compartido más fácil
- ✅ Una sola dependencia tree
- ✅ Deploy atomizado
- ⚠️ Requiere disciplina en estructura

### 2. MVC vs Clean Architecture
**Elegida:** Clean Architecture (Capas)
- Controller → Service → Repository
- ✅ Testeable
- ✅ Escalable
- ✅ Fácil de mantener

### 3. SQL vs NoSQL
**Elegida:** MySQL (SQL)
- ✅ ACID transactions (importante para contabilidad)
- ✅ Queries complejas con JOINs
- ✅ Relaciones claras y constraints
- ✅ Multi-tenancia más fácil con columnas
- ✅ JSON para datos flexibles
- ✅ Muy usado en aplicaciones enterprise
- ✅ Mejor para SaaS con presupuesto limitado

**Alternativa descartada:** PostgreSQL
- ❌ Más complejo de mantener
- ❌ Mayor costo en cloud
- ❌ Overkill para esta aplicación

### 4. ORM vs Query Builder
**Elegida:** Drizzle ORM
- ✅ Type-safe
- ✅ Lightweight
- ✅ Migraciones automáticas
- ✅ Excelente soporte TypeScript

### 5. Autenticación
**Recomendado:** Passport.js Local + Sessions + Cookies
- ✅ Seguro
- ✅ Maduro
- ✅ Bien documentado
- ⚠️ Alternativa: JWT (menos recomendado para SaaS)

### 6. Frontend Framework
**Elegida:** React + Vite + React Router
- ✅ Rápido en desarrollo
- ✅ Recargas en caliente
- ✅ Optimal bundle size
- ✅ Comunidad grande

---

## 📦 Dependencias Clave Explicadas

### Backend
- **express**: Servidor HTTP
- **drizzle-orm**: Acceso a BD tipo-seguro
- **passport**: Autenticación
- **express-session**: Gestión de sesiones
- **zod**: Validación de tipos

### Frontend
- **react**: UI components
- **@tanstack/react-query**: Cache de datos HTTP
- **react-hook-form**: Gestión de formularios
- **zod**: Validación clientside
- **tailwindcss**: Estilos CSS
- **@radix-ui/***: Componentes unstyled
- **shadcn/ui**: UI components pre-estilizados
- **wouter**: Router ligero
- **lucide-react**: Iconos

---

## 🧪 Capas de Testing

```
┌─────────────────────────────────────┐
│  E2E Tests (Playwright/Cypress)     │  ← Usuario real usando la app
│  - Flujos completos                 │
│  - Interfaz gráfica                 │
└─────────────────────────────────────┘
            ↓
┌─────────────────────────────────────┐
│  Integration Tests (Jest/Vitest)    │  ← APIs + BD juntas
│  - Endpoints API                    │
│  - Rutas + Controllers              │
│  - Base de datos real               │
└─────────────────────────────────────┘
            ↓
┌─────────────────────────────────────┐
│  Unit Tests (Jest/Vitest)           │  ← Funciones aisladas
│  - Services                         │
│  - Repositories                     │
│  - Componentes React                │
│  - Funciones utilitarias            │
└─────────────────────────────────────┘
```

---

## 🚀 Deployment Architecture

```
┌──────────────┐
│   GitHub     │  ← Push de código
└──────────────┘
       ↓
┌──────────────────────────────────┐
│  GitHub Actions (CI/CD)          │
│  - npm run check                 │
│  - npm run build                 │
│  - npm run test                  │
└──────────────────────────────────┘
       ↓
   ✅ Tests pass
       ↓
┌──────────────────────────────────┐
│  Deploy to Vercel (Frontend)     │  ← React app
│  - Automático desde dist/        │
│  - CDN global                    │
└──────────────────────────────────┘
       ↓
┌──────────────────────────────────┐
│  Deploy to Railway/Render        │  ← Node backend
│  - Docker container              │
│  - BD MySQL conectada       │
│  - Environment variables set     │
└──────────────────────────────────┘
       ↓
┌──────────────────────────────────┐
│  MySQL (PlanetScale/AWS)      │  ← BD en cloud
│  - Backups automáticos           │
│  - Multi-region                  │
└──────────────────────────────────┘
```

---

## 💾 Base de Datos: Relaciones Principales (MySQL)

```
┌──────────────────┐
│   suscriptores   │         ← Tenant (Copropiedad)
├──────────────────┤
│ id (UUID, PK)    │
│ nombre (TEXT)    │
│ nit (TEXT, UNQ)  │
│ subdominio (TEXT)│
│ email_contacto   │
│ direccion        │
│ telefono         │
│ activo (BOOLEAN) │
│ created_at       │
│ updated_at       │
└──────────────────┘
        ↑ 1
        │ M
        ├─────────────────────┐
        │                     │
        ├─────────────────────────────────────┐
        │                                     │
┌───────┴────┐              ┌────────┴────┐  │
│  usuarios  │              │  unidades   │  │
├────────────┤              ├─────────────┤  │
│ id (UUID)  │              │ id (UUID)   │  │
│ nombre     │              │ numero      │  │
│ apellido   │              │ area        │  │
│ email (UNQ)│              │ tipo        │  │
│ password   │              │ propietario │  │
│ telefono   │              │ suscriptor  │  │
│ rol_id (FK)├──→ roles    │ _id (FK)    │  │
│ suscriptor ├──────────────┐             │  │
│ _id (FK)   │              │             │  │
└────────────┘              │             │  │
                            │             │  │
                    ┌───────┴──────┐        │
                    │              │        │
            ┌───────┴────┐  ┌──────┴───┐   │
            │  terceros  │  │comprobantes
            ├────────────┤  ├──────────┐│
            │ id (UUID)  │  │ id (UUID) ││
            │ nombre     │  │ numero    ││
            │ cedula     │  │ fecha     ││
            │ telefono   │  │ tipo      ││
            │ suscriptor │  │ descripcion││
            │ _id (FK)   │  │ monto      ││
            └────────────┘  │ suscriptor ││
                            │ _id (FK)   ││
                            └───────────┘│

Otras tablas principales:
• periodos (periodos contables)
• cuentas (plan de cuentas)
• facturas (documentos de facturación)
• movimientos (movimientos contables)
• activos_fijos (registro de activos)
• nominas (gestión de nómina)
• presupuestos (planificación financiera)

Principio CRÍTICO:
- Toda tabla tiene suscriptor_id (UUID, FK)
- Todas las queries filtran por suscriptor_id
- Garantiza multi-tenancia segura
```

---

## 📝 Notas Finales

1. **Simplicidad Primero:** No sobre-engineerices al inicio
2. **Type Safety:** Usa TypeScript strict en todo
3. **Validación Doble:** Cliente + Servidor
4. **Tests Temprano:** Escribelos mientras desarrollas
5. **Documentación:** Mantén actualizada
6. **Performance:** Indexa bien la BD
7. **Seguridad:** Nunca confíes en el cliente
8. **Multi-tenancia:** Filtro por tenant en CADA query

---

**Documento generado:** 6 Noviembre 2025  
**Proyecto:** Gravi SaaS
**Versión:** 1.0 - Arquitectura Inicial
