# ✅ CHECKLIST DE SETUP Y VERIFICACIÓN - PROYECTO GRAVI

## 📋 PRE-REQUISITOS

- [ ] Node.js 18+ instalado (`node --version`)
- [ ] npm 9+ o yarn (`npm --version`)
- [ ] MySQL 8.0+ instalado (local) O cuenta en PlanetScale (cloud)
- [ ] Git configurado (`git config --list`)
- [ ] Editor de código (VS Code, WebStorm, etc)

---

## 🚀 FASE 1: CONFIGURACIÓN INICIAL (5 minutos)

- [ ] **1.1** Clonar/descargar el proyecto Gravi
- [ ] **1.2** Abrir terminal en la raíz del proyecto
- [ ] **1.3** Verificar archivos principales existen:
  ```
  ✅ package.json
  ✅ tsconfig.json
  ✅ vite.config.ts
  ✅ drizzle.config.ts
  ```

---

## 🗄️  FASE 2: CONFIGURAR BASE DE DATOS (10 minutos)

### Opción A: MySQL Local

- [ ] **2.1A** MySQL está corriendo
  ```bash
  # Windows - Services app o MySQL Workbench
  # Verificar que MySQL 8.0+ está instalado
  ```

- [ ] **2.2A** Base de datos `gravi` creada
  ```bash
  mysql -u root -p -e "CREATE DATABASE gravi;"
  ```

- [ ] **2.3A** Conexión probada
  ```bash
  mysql -u root -p gravi
  # Si entra: \q para salir
  ```

### Opción B: PlanetScale (Recomendado)

- [ ] **2.1B** Cuenta creada en https://planetscale.com
- [ ] **2.2B** Base de datos creada en PlanetScale
- [ ] **2.3B** Connection string obtenida
  - Usuario, Password, Host, Puerto

### Opción C: Supabase

- [ ] **2.1C** Cuenta creada en https://supabase.com
- [ ] **2.2C** Proyecto creado
- [ ] **2.3C** Connection string obtener de Settings → Database

---

## 🔧 FASE 3: VARIABLES DE ENTORNO (5 minutos)

- [ ] **3.1** Copiar `.env.example` → `.env.local`
  ```bash
  cp .env.example .env.local
  ```

- [ ] **3.2** Editar `.env.local` con tus valores:
  ```env
  DATABASE_URL=tu-connection-string-aqui
  PORT=5000
  NODE_ENV=development
  SESSION_SECRET=genera-con-: openssl rand -base64 32
  FRONTEND_URL=http://localhost:5173
  ```

- [ ] **3.3** Verificar que `.env.local` está en `.gitignore`
  ```bash
  cat .gitignore | grep ".env"
  # Debe mostrar: .env.local
  ```

- [ ] **3.4** Validar la configuración
  ```bash
  # Verificar que la variable se lee:
  echo $DATABASE_URL  # Debe mostrar la URL
  ```

---

## 📦 FASE 4: INSTALAR DEPENDENCIAS (5 minutos)

- [ ] **4.1** Ejecutar npm install
  ```bash
  npm install
  # Espera a que termine (2-3 minutos)
  ```

- [ ] **4.2** Verificar que node_modules/ fue creado
  ```bash
  ls node_modules | head -20  # Debe haber muchas carpetas
  ```

- [ ] **4.3** Verificar package-lock.json
  ```bash
  ls -la package-lock.json  # Debe existir
  ```

---

## 🔍 FASE 5: VERIFICAR TYPES Y CONFIG (2 minutos)

- [ ] **5.1** Verificar TypeScript
  ```bash
  npm run check
  # Debe decir: "No errors" al final
  ```

- [ ] **5.2** Si hay errores, notar cuáles son:
  ```
  ❌ Errores de tipo
  → Revisar archivos indicados
  → Puede que falten types @types/*
  ```

- [ ] **5.3** Validar estructura de carpetas
  ```bash
  ls client/src        # Debe tener: components, pages, hooks, lib
  ls server            # Debe tener: index.ts, routes.ts, storage.ts
  ls shared            # Debe tener: schema.ts
  ```

---

## 💾 FASE 6: EJECUTAR MIGRACIONES (3 minutos)

- [ ] **6.1** Generar migraciones
  ```bash
  npm run db:push
  ```

- [ ] **6.2** Verificar que NO hay errores
  - ✅ `✔ 5 new migrations were created`
  - ❌ `Error: DATABASE_URL not found` → Revisar .env.local
  - ❌ `Cannot connect to database` → BD no está corriendo

- [ ] **6.3** Verificar tablas en BD
  ```bash
  # PostgreSQL local:
  psql -d gravi -c "\dt"
  
  # Debe mostrar:
  # public | users | table | postgres
  ```

- [ ] **6.4** Carpeta `migrations/` fue creada
  ```bash
  ls migrations/
  # Debe tener archivos .sql
  ```

---

## 🚀 FASE 7: INICIAR SERVIDOR DE DESARROLLO (2 minutos)

- [ ] **7.1** Verificar que puertos están libres:
  ```bash
  # Puerto 5000 (backend)
  lsof -i :5000  # No debe mostrar nada
  
  # Puerto 5173 (frontend vite)
  lsof -i :5173  # No debe mostrar nada
  ```

- [ ] **7.2** Iniciar desarrollo
  ```bash
  npm run dev
  ```

- [ ] **7.3** Verificar salida esperada:
  ```
  [17:30:45] serving on port 5000
  
  VITE v4.4.9 ready in 120 ms
  
  ➜ Local:   http://localhost:5173/
  ```

- [ ] **7.4** Ver ambos procesos corriendo en la terminal
  - Backend: "serving on port 5000"
  - Frontend: Vite mostrando local URL

---

## 🌐 FASE 8: PROBAR EN NAVEGADOR (2 minutos)

- [ ] **8.1** Abrir navegador en http://localhost:5173
  - [ ] Página carga sin errores
  - [ ] Ves el Logo "G" de Gravi
  - [ ] Navegación superior funciona

- [ ] **8.2** Abrir Developer Tools (F12)
  - [ ] Verificar Console - NO debe haber errores rojos
  - [ ] Ir a Network - las requests deben ser 200 OK

- [ ] **8.3** Probar API Backend
  ```
  http://localhost:5000/api/health
  → Debe retornar: Cannot GET /api/health (esto es normal)
  Significa que el servidor está corriendo
  ```

- [ ] **8.4** Revisar que Theme funciona
  - [ ] Click en toggle de tema (arriba derecha)
  - [ ] Color debe cambiar (light/dark mode)

---

## 🎯 FASE 9: VERIFICACIÓN FINAL (2 minutos)

- [ ] **9.1** Backend está levantado
  ```bash
  # En otra terminal:
  curl http://localhost:5000/
  # Debe mostrar algo (página o error)
  ```

- [ ] **9.2** Frontend está levantado
  ```bash
  # En otra terminal:
  curl http://localhost:5173/
  # Debe mostrar HTML de la app
  ```

- [ ] **9.3** Base de datos está conectada
  ```bash
  npm run db:push
  # No debe dar error (debería decir "Already up to date")
  ```

- [ ] **9.4** TypeScript compila sin errores
  ```bash
  npm run check
  # Debe decir "No errors"
  ```

- [ ] **9.6** Documentación está completa y corregida
  ```bash
  # Verificar archivos de documentación existen:
  ls *.md | grep -E "(README|ARQUITECTURA|REPORTE|INICIO|CHECKLIST|CONVERSION)"
  # Debe mostrar 7+ archivos .md
  
  # Verificar que BD es PostgreSQL (no MySQL):
  grep -r "PostgreSQL" ARQUITECTURA.md
  # Debe encontrar referencias a PostgreSQL
  ```

---

## ✅ ESTADO FINAL

Si todos los checkboxes están ✅:

```
✅ Configuración completa
✅ Base de datos creada
✅ Variables de entorno definidas
✅ Dependencias instaladas
✅ TypeScript verifica sin errores
✅ Migraciones ejecutadas
✅ Servidor de desarrollo corriendo
✅ Frontend cargando en navegador
✅ Backend respondiendo
✅ Build de producción funciona
✅ Documentación completa y corregida
```

🎉 **¡PROYECTO LISTO PARA DESARROLLO!**

---

## 🆘 SI ALGO FALLA

### Error: "DATABASE_URL not found"
```bash
# Solución:
1. Verifica que .env.local existe: ls -la .env.local
2. Verifica que tiene DATABASE_URL: cat .env.local | grep DATABASE_URL
3. Reinicia la terminal y vuelve a intentar
```

### Error: "Cannot connect to database"
```bash
# Solución:
1. Si es local: verifica PostgreSQL está corriendo
2. Si es PlanetScale: verifica URL sea correcta
3. Prueba conexión directa:
   psql 'your-DATABASE-URL'  # Debe conectar
```

### Error: "Port 5000 already in use"
```bash
# Solución:
1. Mata el proceso:
   lsof -ti:5000 | xargs kill -9
2. O usa otro puerto:
   PORT=5001 npm run dev
```

### Error: "TypeScript errors"
```bash
# Solución:
1. Limpia caché:
   rm tsconfig.tsbuildinfo
2. Reinstala deps:
   npm install
3. Verifica de nuevo:
   npm run check
```

### Frontend no carga
```bash
# Solución:
1. Abre DevTools (F12)
2. Console - busca errores rojos
3. Network - busca requests fallidas
4. Reinicia: Ctrl+C en terminal, npm run dev de nuevo
```

### Backend no responde
```bash
# Solución:
1. Verifica que terminal muestra "serving on port 5000"
2. Si no, revisa errores en la terminal
3. Si está en puerto otro: cat .env.local | grep PORT
4. Intenta GET http://localhost:5000/
```

---

## 📞 PRÓXIMOS PASOS

Una vez que todo está verde ✅:

1. **Lee los Reportes:**
   - `REPORTE_REVISION_COMPLETA.md` - Análisis profundo
   - `INICIO_RAPIDO.md` - Pasos rápidos

2. **Implementa Primera Feature:**
   - Sigue el Plan de Acción en el reporte
   - Empieza con FASE 1: Setup (ya hecho ✅)
   - Continúa con FASE 2: Autenticación

3. **Estructura Backend:**
   - Implementa rutas en `server/routes.ts`
   - Crear servicios en `server/services/`
   - Usar BD via Drizzle

4. **Conecta Frontend:**
   - Llama APIs desde componentes
   - Usa React Query para caché
   - Maneja errores y loading

---

## 📚 REFERENCIAS

- [Drizzle ORM Docs](https://orm.drizzle.team/)
- [Express.js Guide](https://expressjs.com/)
- [React Query](https://tanstack.com/query/)
- [Tailwind CSS](https://tailwindcss.com/)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)

---

## 🎉 ¡BUENA SUERTE!

**Generado:** 6 Noviembre 2025
**Proyecto:** Gravi SaaS
**Status:** ✅ Listo para desarrollo

```
    ___  ____  ___  _   __  ____
   / _ \/ __ \/   \/ | / / / _  \
  / ___/ /_/ / /_  /  |/ / /_) /
 / /  / _, _/ /_, /_/|  / /_  _/
/_/  /_/ |_/____/_/ |_/  /_/ |_\

Sistema de Gestión de Copropiedades
```

Cualquier duda, revisar:
- `.env.example` - Configuración
- `REPORTE_REVISION_COMPLETA.md` - Análisis
- `INICIO_RAPIDO.md` - Guía rápida
