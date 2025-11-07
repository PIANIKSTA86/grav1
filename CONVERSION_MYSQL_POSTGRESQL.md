# 🔄 CONVERSIÓN: Schema MySQL → PostgreSQL + Drizzle

**Fecha:** 6 Noviembre 2025  
**Proyecto:** Gravi SaaS  
**Propósito:** Convertir el schema SQL de MySQL a PostgreSQL con Drizzle ORM

---

## 📋 CONTEXTO

El proyecto incluye un archivo `attached_assets/Desarrollo Full-Stack del SaaS Grav_1762464619975.txt` con un **script SQL completo para MySQL**, pero el stack actual usa **PostgreSQL + Drizzle ORM**.

Este documento explica cómo convertir ese schema MySQL a PostgreSQL con Drizzle.

---

## 🔄 DIFERENCIAS CLAVE: MySQL vs PostgreSQL

| Aspecto | MySQL | PostgreSQL |
|---|---|---|
| **UUID** | `BINARY(16)` | `UUID` |
| **Boolean** | `TINYINT(1)` | `BOOLEAN` |
| **Auto-increment** | `AUTO_INCREMENT` | `SERIAL` o `DEFAULT gen_random_uuid()` |
| **Engine** | `ENGINE=InnoDB` | No aplica |
| **Comentarios** | `COMMENT='...'` | No aplica |
| **Timestamps** | `TIMESTAMP` | `TIMESTAMPTZ` |
| **Text** | `VARCHAR(n)` | `TEXT` o `VARCHAR(n)` |
| **Indices** | `INDEX idx_name (col)` | `CREATE INDEX idx_name ON table(col)` |

---

## 📝 EJEMPLOS DE CONVERSIÓN

### 1. Tabla de Suscriptores

**MySQL Original:**
```sql
CREATE TABLE `suscriptores` (
    `id` BINARY(16) PRIMARY KEY,
    `nombre` VARCHAR(100) NOT NULL,
    `nit` VARCHAR(20) NOT NULL UNIQUE,
    `subdominio` VARCHAR(50) NULL UNIQUE,
    `email_contacto` VARCHAR(255) NULL,
    `direccion` VARCHAR(255) NULL,
    `telefono` VARCHAR(50) NULL,
    `activo` TINYINT(1) NOT NULL DEFAULT 1,
    `fecha_creacion` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `fecha_actualizacion` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_suscriptores_nit` (`nit`),
    INDEX `idx_suscriptores_subdominio` (`subdominio`)
) ENGINE=InnoDB COMMENT='Tabla principal de clientes (copropiedades) del SaaS';
```

**PostgreSQL + Drizzle:**
```typescript
export const suscriptores = pgTable("suscriptores", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  nombre: text("nombre").notNull(),
  nit: text("nit").notNull().unique(),
  subdominio: text("subdominio").unique(),
  emailContacto: text("email_contacto"),
  direccion: text("direccion"),
  telefono: text("telefono"),
  activo: boolean("activo").notNull().default(true),
  fechaCreacion: timestamp("fecha_creacion", { withTimezone: true })
    .notNull()
    .defaultNow(),
  fechaActualizacion: timestamp("fecha_actualizacion", { withTimezone: true })
    .notNull()
    .defaultNow(),
}, (table) => ({
  idxSuscriptoresNit: index("idx_suscriptores_nit").on(table.nit),
  idxSuscriptoresSubdominio: index("idx_suscriptores_subdominio").on(table.subdominio),
}));
```

### 2. Tabla de Usuarios

**MySQL Original:**
```sql
CREATE TABLE `usuarios` (
    `id` BINARY(16) PRIMARY KEY,
    `nombre` VARCHAR(100) NOT NULL,
    `apellido` VARCHAR(100) NULL,
    `email` VARCHAR(255) NOT NULL UNIQUE,
    `password` VARCHAR(255) NOT NULL,
    `telefono` VARCHAR(50) NULL,
    `rol_id` BINARY(16) NULL,
    `suscriptor_id` BINARY(16) NULL,
    `activo` TINYINT(1) NOT NULL DEFAULT 1,
    `ultimo_login` TIMESTAMP NULL,
    `fecha_creacion` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `fecha_actualizacion` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`rol_id`) REFERENCES `roles`(`id`) ON DELETE SET NULL,
    FOREIGN KEY (`suscriptor_id`) REFERENCES `suscriptores`(`id`) ON DELETE CASCADE,
    INDEX `idx_usuarios_email` (`email`),
    INDEX `idx_usuarios_suscriptor` (`suscriptor_id`)
) ENGINE=InnoDB COMMENT='Usuarios del sistema y de los suscriptores';
```

**PostgreSQL + Drizzle:**
```typescript
export const usuarios = pgTable("usuarios", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  nombre: text("nombre").notNull(),
  apellido: text("apellido"),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  telefono: text("telefono"),
  rolId: uuid("rol_id").references(() => roles.id, { onDelete: "set null" }),
  suscriptorId: uuid("suscriptor_id").references(() => suscriptores.id, { onDelete: "cascade" }),
  activo: boolean("activo").notNull().default(true),
  ultimoLogin: timestamp("ultimo_login", { withTimezone: true }),
  fechaCreacion: timestamp("fecha_creacion", { withTimezone: true })
    .notNull()
    .defaultNow(),
  fechaActualizacion: timestamp("fecha_actualizacion", { withTimezone: true })
    .notNull()
    .defaultNow(),
}, (table) => ({
  idxUsuariosEmail: index("idx_usuarios_email").on(table.email),
  idxUsuariosSuscriptor: index("idx_usuarios_suscriptor").on(table.suscriptorId),
}));
```

---

## 🛠️ HERRAMIENTAS PARA CONVERSIÓN

### 1. Script Automático (Recomendado)

Crea un archivo `scripts/convert-mysql-to-drizzle.js`:

```javascript
// scripts/convert-mysql-to-drizzle.js
const fs = require('fs');
const path = require('path');

// Leer el archivo MySQL
const mysqlScript = fs.readFileSync('attached_assets/Desarrollo Full-Stack del SaaS Grav_1762464619975.txt', 'utf8');

// Función para convertir CREATE TABLE a Drizzle
function convertToDrizzle(mysqlSQL) {
  // Lógica de conversión...
  // BINARY(16) → uuid
  // TINYINT(1) → boolean
  // etc.
}

const drizzleSchema = convertToDrizzle(mysqlScript);
fs.writeFileSync('shared/schema.ts', drizzleSchema);
```

### 2. Conversión Manual

Para cada tabla MySQL:

1. **Cambiar tipos:**
   - `BINARY(16)` → `uuid("campo")`
   - `TINYINT(1)` → `boolean("campo")`
   - `VARCHAR(n)` → `text("campo")` o `varchar("campo", { length: n })`
   - `TIMESTAMP` → `timestamp("campo", { withTimezone: true })`

2. **Cambiar constraints:**
   - `PRIMARY KEY` → `.primaryKey()`
   - `NOT NULL` → `.notNull()`
   - `UNIQUE` → `.unique()`
   - `DEFAULT value` → `.default(value)`

3. **Cambiar foreign keys:**
   - `FOREIGN KEY (col) REFERENCES table(id)` → `.references(() => table.id, { onDelete: "cascade" })`

4. **Cambiar índices:**
   - `INDEX idx_name (col)` → `index("idx_name").on(table.col)`

---

## 📋 TABLAS A CONVERTIR (Del Script MySQL)

Del archivo `Desarrollo Full-Stack del SaaS Grav_1762464619975.txt`, necesitas convertir estas tablas:

### Gestión de Suscriptores
- ✅ `suscriptores` - Copropiedades
- ✅ `roles` - Roles de usuario
- ✅ `usuarios` - Usuarios del sistema

### Contabilidad
- ⏳ `periodos` - Periodos contables
- ⏳ `cuentas` - Plan de cuentas
- ⏳ `comprobantes` - Comprobantes de egreso
- ⏳ `movimientos` - Movimientos contables

### Gestión de Propiedad
- ⏳ `unidades` - Apartamentos/locales
- ⏳ `terceros` - Propietarios/residentes

### Facturación
- ⏳ `facturas` - Documentos de facturación
- ⏳ `detalles_factura` - Líneas de factura

### Otros Módulos
- ⏳ `nominas` - Gestión de nómina
- ⏳ `presupuestos` - Planificación financiera
- ⏳ `activos_fijos` - Registro de activos
- ⏳ `informes_exogena` - Reportes DIAN

**Total:** ~15-20 tablas principales

---

## 🚀 IMPLEMENTACIÓN RECOMENDADA

### Fase 1: Schema Básico (Esta semana)

Crea `shared/schema.ts` con las tablas críticas:

```typescript
// shared/schema.ts
import { pgTable, uuid, text, boolean, timestamp, index } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

// Suscriptores (tenants)
export const suscriptores = pgTable("suscriptores", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  nombre: text("nombre").notNull(),
  nit: text("nit").notNull().unique(),
  subdominio: text("subdominio").unique(),
  emailContacto: text("email_contacto"),
  direccion: text("direccion"),
  telefono: text("telefono"),
  activo: boolean("activo").notNull().default(true),
  fechaCreacion: timestamp("fecha_creacion", { withTimezone: true })
    .notNull()
    .defaultNow(),
  fechaActualizacion: timestamp("fecha_actualizacion", { withTimezone: true })
    .notNull()
    .defaultNow(),
}, (table) => ({
  idxSuscriptoresNit: index("idx_suscriptores_nit").on(table.nit),
  idxSuscriptoresSubdominio: index("idx_suscriptores_subdominio").on(table.subdominio),
}));

// Usuarios
export const usuarios = pgTable("usuarios", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  nombre: text("nombre").notNull(),
  apellido: text("apellido"),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  telefono: text("telefono"),
  suscriptorId: uuid("suscriptor_id").references(() => suscriptores.id, { onDelete: "cascade" }),
  activo: boolean("activo").notNull().default(true),
  ultimoLogin: timestamp("ultimo_login", { withTimezone: true }),
  fechaCreacion: timestamp("fecha_creacion", { withTimezone: true })
    .notNull()
    .defaultNow(),
  fechaActualizacion: timestamp("fecha_actualizacion", { withTimezone: true })
    .notNull()
    .defaultNow(),
}, (table) => ({
  idxUsuariosEmail: index("idx_usuarios_email").on(table.email),
  idxUsuariosSuscriptor: index("idx_usuarios_suscriptor").on(table.suscriptorId),
}));

// Tipos para TypeScript
export type Suscriptor = typeof suscriptores.$inferSelect;
export type InsertSuscriptor = typeof suscriptores.$inferInsert;
export type Usuario = typeof usuarios.$inferSelect;
export type InsertUsuario = typeof usuarios.$inferInsert;
```

### Fase 2: Ejecutar Migraciones

```bash
npm run db:push
```

### Fase 3: Agregar Más Tablas

Ve agregando tablas gradualmente según las necesites para cada módulo.

---

## 🔍 VALIDACIÓN

Después de crear el schema:

1. **TypeScript compila:**
   ```bash
   npm run check
   ```

2. **Migraciones funcionan:**
   ```bash
   npm run db:push
   ```

3. **Tablas creadas en BD:**
   ```sql
   -- Conectar a PostgreSQL
   \dt  -- Listar tablas
   ```

4. **Drizzle Studio funciona:**
   ```bash
   npm run db:studio
   ```

---

## 📚 REFERENCIAS

- [Drizzle ORM Docs](https://orm.drizzle.team/docs/get-started-postgresql)
- [PostgreSQL Data Types](https://www.postgresql.org/docs/current/datatype.html)
- [Drizzle Schema API](https://orm.drizzle.team/docs/schemas)

---

## ⚠️ NOTAS IMPORTANTES

1. **UUIDs:** PostgreSQL tiene soporte nativo para UUID
2. **Timestamps:** Usa `TIMESTAMPTZ` para timezone awareness
3. **Indices:** Crea índices explícitamente para performance
4. **Constraints:** PostgreSQL es más estricto con constraints
5. **Defaults:** `gen_random_uuid()` es función de PostgreSQL

---

**Conversión completada:** 6 Noviembre 2025  
**Proyecto:** Gravi SaaS  
**Resultado:** Schema PostgreSQL + Drizzle listo para implementar
