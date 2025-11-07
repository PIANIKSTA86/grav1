# GUÍA DE INICIO RÁPIDO - PROYECTO GRAVI

## 🚀 5 PASOS PARA QUE FUNCIONE EN DESARROLLO

### PASO 1: Configurar Variables de Entorno (5 minutos)

#### Opción A: Usando Base de Datos Local (MySQL)

1. Asegúrate de tener MySQL 8.0+ instalado
2. Crea la base de datos:
```bash
createdb gravi
```

3. En la raíz del proyecto, crea `.env.local`:
```env
# Base de Datos
DATABASE_URL=mysql://root:password@localhost:3306/gravi

# Servidor
PORT=5000
NODE_ENV=development

# Seguridad
SESSION_SECRET=your-super-secret-key-minimum-32-characters-long-please

# URLs
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:5000
```

**⚠️ Reemplaza:**
- `password` con tu contraseña de PostgreSQL
- `SESSION_SECRET` con algo más fuerte

---

#### Opción B: Usando PlanetScale (MySQL Serverless) - RECOMENDADO

1. Ve a https://console.neon.tech
2. Crea un nuevo proyecto
3. Copia el connection string
4. En `.env.local`:
```env
DATABASE_URL=postgresql://user:password@ep-xyz.neon.tech/gravi?sslmode=require
PORT=5000
NODE_ENV=development
SESSION_SECRET=your-super-secret-key-minimum-32-characters-long
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:5000
```

---

#### Opción C: Crear `.env.example` para referencia

Si quieres un template sin valores reales:

```env
# .env.example - Copiar y renombrar a .env.local

# ===== DATABASE =====
# PostgreSQL local: postgresql://postgres:password@localhost:5432/gravi
# Neon serverless: postgresql://user:pass@ep-xyz.neon.tech/gravi?sslmode=require
DATABASE_URL=postgresql://user:password@host:5432/gravi

# ===== SERVER =====
PORT=5000
NODE_ENV=development

# ===== SECURITY =====
SESSION_SECRET=min-32-chars-secure-random-string-here

# ===== URLS =====
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:5000
```

---

### PASO 2: Instalar Dependencias (5 minutos)

```bash
# En la raíz del proyecto
npm install

# O si usas yarn
yarn install
```

**⏳ Esto puede tomar 2-3 minutos.**

---

### PASO 3: Verificar TypeScript (2 minutos)

```bash
npm run check
```

Si hay errores, significa que hay problemas de tipos. Deberían ser pocos.

---

### PASO 4: Ejecutar Migraciones de BD (3 minutos)

```bash
npm run db:push
```

**¿Qué hace?**
- Crea las tablas en la BD basadas en `shared/schema.ts`
- Genera las migraciones necesarias

**⚠️ Si falla:**
```
Error: DATABASE_URL not found
→ Verifica que `.env.local` existe y está en la raíz
```

```
Error: Cannot connect to database
→ Verifica que DATABASE_URL es correcto
→ Para PostgreSQL local: asegúrate que el server está corriendo
```

---

### PASO 5: Iniciar Desarrollo (1 minuto)

```bash
npm run dev
```

**¿Qué debería pasar?**

Terminal mostrará:
```
> tsx server/index.ts

[tiempo] serving on port 5000
```

Y en otra terminal (automáticamente):
```
  VITE v... ready in 123 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

**Abre en navegador:** http://localhost:5173/

Si ves la página de Gravi → ✅ ¡FUNCIONA!

---

## ✅ VALIDACIÓN

Después de estos 5 pasos, verifica:

```bash
# 1. ¿Database conectada?
npm run db:push  # No debe fallar

# 2. ¿Types correctos?
npm run check   # No debe haber errores

# 3. ¿Frontend levantado?
# Abre http://localhost:5173 en navegador
# Deberías ver: Landing o Dashboard

# 4. ¿Backend corriendo?
# Abre http://localhost:5000 en navegador
# Deberías ver: Cannot GET /
# (Lo cual es normal, no hay rutas de API aún)
```

---

## 🛠️ TROUBLESHOOTING

### Error: "DATABASE_URL, ensure the database is provisioned"

**Solución:**
1. Verifica que `.env.local` existe
2. Verifica que `DATABASE_URL` está definida
3. Reinicia la terminal
4. Intenta de nuevo: `npm run db:push`

---

### Error: "Cannot connect to database"

**Solución:**
1. Para PostgreSQL local:
```bash
# Verifica que el server está corriendo
sudo service postgresql status    # Linux
brew services list               # Mac
services.msc                     # Windows
```

2. Para Neon:
   - Verifica el URL en https://console.neon.tech
   - Asegúrate de que el proyecto está activo (no en pause)

---

### Error: "EADDRINUSE: address already in use :::5000"

**Significado:** Puerto 5000 está ocupado

**Solución:**
```bash
# Opción 1: Usar otro puerto
PORT=5001 npm run dev

# Opción 2: Matar el proceso (Linux/Mac)
lsof -ti:5000 | xargs kill -9

# Opción 3: En Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

---

### Error: TypeScript compilation error

**Solución:**
```bash
# Limpiar caché
rm -rf node_modules/.cache
rm tsconfig.tsbuildinfo

# Reinstalar
npm install

# Verificar
npm run check
```

---

### Vite dev server no inicia

**Solución:**
```bash
# Matar procesos en puerto 5173
# Luego:
npm run dev

# O forzar otro puerto:
VITE_PORT=3000 npm run dev
```

---

## 📁 ESTRUCTURA DESPUÉS DE SETUP

Si todo funciona, verás esto:

```
Grav1/
├── node_modules/              ✅ Dependencias instaladas
├── dist/                       (Se crea al hacer build)
├── migrations/                 ✅ Migraciones generadas (si fue db:push)
├── .env.local                  ✅ Tu archivo de configs
├── client/
│   ├── src/
│   │   ├── App.tsx
│   │   ├── pages/
│   │   └── components/
│   └── index.html
├── server/
│   ├── index.ts                ← Running aquí
│   ├── routes.ts               ← Agregar APIs aquí
│   └── storage.ts
├── shared/
│   └── schema.ts               ← Base de datos schema
├── package.json
├── vite.config.ts
├── tsconfig.json
└── [archivos de config]
```

---

## 🎯 PRÓXIMOS PASOS DESPUÉS DE SETUP

Una vez que `npm run dev` funciona:

### 1. Entender el Flujo

```
Cliente (React)          →    API (Express)      →    Base de Datos
http://localhost:5173    →    http://localhost:5000    PostgreSQL
    ↓                              ↓                         ↓
  /pages                       /routes.ts             /schema.ts
  /components                  /controllers            tables
  /hooks                       /services
  /lib                         /repositories
```

### 2. Implementar Primera API

Abre `server/routes.ts` y agrega:

```typescript
import type { Express } from "express";
import { createServer, type Server } from "http";

export async function registerRoutes(app: Express): Promise<Server> {
  // Ruta de prueba
  app.get("/api/health", (req, res) => {
    res.json({ status: "OK", timestamp: new Date() });
  });

  // Obtener suscriptores del usuario
  app.get("/api/suscriptores", async (req, res) => {
    try {
      // TODO: Implementar después de autenticación
      res.json({ suscriptores: [] });
    } catch (error) {
      res.status(500).json({ error: "Error fetching suscriptores" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
```

Luego prueba en navegador o Postman:
```
GET http://localhost:5000/api/health
```

### 3. Conectar Frontend a API

En `client/src/lib/queryClient.ts` está ya configurado para hacer fetch a `/api/*`

Usar en componentes:
```typescript
import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";

export function Suscriptores() {
  const { data, isLoading } = useQuery({
    queryKey: ["/api/suscriptores"],
    queryFn: getQueryFn({ on401: "throw" })
  });

  if (isLoading) return <div>Cargando...</div>;
  
  return (
    <div>
      {data?.map(s => <div key={s.id}>{s.nombre}</div>)}
    </div>
  );
}
```

### 4. Ver el Reporte Completo

Lee `REPORTE_REVISION_COMPLETA.md` en la raíz del proyecto para:
- Análisis detallado
- Problemas identificados
- Recomendaciones
- Plan de 4 semanas completo

---

## 📱 VERIFICACIÓN FINAL

Ejecuta estos comandos y verifica que todos pasen:

```bash
# 1. Verificar tipos TypeScript
npm run check
# ✅ Debería decir: "No errors"

# 2. Iniciar servidor y cliente
npm run dev
# ✅ Debería ver ambos ports (5000 y 5173)

# 3. Abrir en navegador
# ✅ http://localhost:5173 debe cargar Gravi
# ✅ http://localhost:5000/api/health debe retornar JSON
```

---

## 🎉 ¡LISTO!

Si llegas aquí, el proyecto está levantado en desarrollo.

**Próximo:** Sigue el plan en `REPORTE_REVISION_COMPLETA.md` para implementar las funcionalidades.

**Preguntas:** Ver sección TROUBLESHOOTING arriba.

**Emergencia:** Revisa el archivo `.env.local` - es el culpable en 90% de los problemas.

---

**¡Buena suerte! 🚀**
