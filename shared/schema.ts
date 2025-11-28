import { sql } from "drizzle-orm";
import {
  mysqlTable,
  text,
  varchar,
  char,
  boolean,
  decimal,
  int,
  date,
  datetime,
  json,
  mysqlEnum,
  index,
  uniqueIndex,
  customType
} from "drizzle-orm/mysql-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

const uuidBinary = customType<{ data: string; driverData: Buffer }>({
  dataType(config) {
    return 'binary(16)';
  },
  toDriver(value: string): Buffer {
    return Buffer.from(value.replace(/-/g, ''), 'hex');
  },
  fromDriver(value: Buffer): string {
    const hex = value.toString('hex');
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`;
  },
});

// =====================================================================
// TABLAS PRINCIPALES Y DE GESTIÓN DE SUSCRIPTORES
// =====================================================================

export const suscriptores = mysqlTable("suscriptores", {
  id: char("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  nombre: varchar("nombre", { length: 100 }).notNull(),
  nit: varchar("nit", { length: 20 }).notNull().unique(),
  subdominio: varchar("subdominio", { length: 50 }),
  emailContacto: varchar("email_contacto", { length: 255 }),
  direccion: varchar("direccion", { length: 255 }),
  telefono: varchar("telefono", { length: 50 }),
  activo: boolean("activo").notNull().default(true),
  fechaCreacion: datetime("fecha_creacion").notNull().default(sql`NOW()`),
  fechaActualizacion: datetime("fecha_actualizacion").notNull().default(sql`NOW()`),
}, (table) => ({
  nitIdx: index("idx_suscriptores_nit").on(table.nit),
  subdominioIdx: index("idx_suscriptores_subdominio").on(table.subdominio),
}));

export const roles = mysqlTable("roles", {
  id: char("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  suscriptorId: char("suscriptor_id", { length: 36 }).notNull().references(() => suscriptores.id, { onDelete: "cascade" }),
  nombre: varchar("nombre", { length: 50 }).notNull(),
  descripcion: text("descripcion"),
  fechaCreacion: datetime("fecha_creacion").notNull().default(sql`NOW()`),
}, (table) => ({
  suscriptorIdx: index("idx_roles_suscriptor").on(table.suscriptorId),
}));

export const usuarios = mysqlTable("usuarios", {
  id: char("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  nombre: varchar("nombre", { length: 100 }).notNull(),
  apellido: varchar("apellido", { length: 100 }),
  email: varchar("email", { length: 255 }).notNull().unique(),
  nit: varchar("nit", { length: 20 }).notNull(),
  password: varchar("password", { length: 255 }).notNull(),
  telefono: varchar("telefono", { length: 50 }),
  rolId: char("rol_id", { length: 36 }).references(() => roles.id, { onDelete: "set null" }),
  suscriptorId: char("suscriptor_id", { length: 36 }).references(() => suscriptores.id, { onDelete: "cascade" }),
  activo: boolean("activo").notNull().default(true),
  ultimoLogin: datetime("ultimo_login"),
  fechaCreacion: datetime("fecha_creacion").notNull().default(sql`NOW()`),
  fechaActualizacion: datetime("fecha_actualizacion").notNull().default(sql`NOW()`),
}, (table) => ({
  emailIdx: index("idx_usuarios_email").on(table.email),
  nitIdx: index("idx_usuarios_nit").on(table.nit),
  suscriptorIdx: index("idx_usuarios_suscriptor").on(table.suscriptorId),
}));

// =====================================================================
// TABLAS DE CONFIGURACIÓN Y ESTRUCTURA DEL SUSCRIPTOR
// =====================================================================

export const terceros = mysqlTable("terceros", {
  id: char("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  suscriptorId: char("suscriptor_id", { length: 36 }).notNull().references(() => suscriptores.id, { onDelete: "cascade" }),
  tipoPersona: varchar("tipo_persona", { length: 10 }).notNull(),
  tipoIdentificacion: varchar("tipo_identificacion", { length: 50 }).notNull(),
  numeroIdentificacion: varchar("numero_identificacion", { length: 50 }).notNull(),
  nombreCompleto: varchar("nombre_completo", { length: 255 }),
  razonSocial: varchar("razon_social", { length: 255 }),
  direccion: varchar("direccion", { length: 255 }),
  email: varchar("email", { length: 255 }),
  telefono: varchar("telefono", { length: 50 }),
  activo: boolean("activo").notNull().default(true),
  fechaCreacion: datetime("fecha_creacion").notNull().default(sql`NOW()`),
  fechaActualizacion: datetime("fecha_actualizacion").notNull().default(sql`NOW()`),
}, (table) => ({
  suscriptorIdx: index("idx_terceros_suscriptor").on(table.suscriptorId),
  identificacionUnique: uniqueIndex("uk_terceros_identificacion").on(table.suscriptorId, table.numeroIdentificacion),
}));

export const unidades = mysqlTable("unidades", {
  id: char("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  suscriptorId: char("suscriptor_id", { length: 36 }).notNull().references(() => suscriptores.id, { onDelete: "cascade" }),
  codigoUnidad: varchar("codigo_unidad", { length: 30 }).notNull(),
  tipoUnidad: varchar("tipo_unidad", { length: 50 }),
  propietarioId: char("propietario_id", { length: 36 }).references(() => terceros.id, { onDelete: "set null" }),
  inquilinoId: char("inquilino_id", { length: 36 }).references(() => terceros.id, { onDelete: "set null" }),
  area: decimal("area", { precision: 10, scale: 2 }),
  coeficiente: decimal("coeficiente", { precision: 5, scale: 4 }),
  activo: boolean("activo").notNull().default(true),
  fechaCreacion: datetime("fecha_creacion").notNull().default(sql`NOW()`),
  fechaActualizacion: datetime("fecha_actualizacion").notNull().default(sql`NOW()`),
}, (table) => ({
  suscriptorIdx: index("idx_unidades_suscriptor").on(table.suscriptorId),
  codigoUnique: uniqueIndex("uk_unidades_codigo").on(table.suscriptorId, table.codigoUnidad),
}));

export const planCuentas = mysqlTable("plan_cuentas", {
  id: uuidBinary("id").primaryKey().default(sql`UNHEX(REPLACE(UUID(), '-', ''))`),
  suscriptorId: char("suscriptor_id", { length: 36 }).notNull().references(() => suscriptores.id, { onDelete: "cascade" }),
  esPlantilla: boolean("es_plantilla").notNull().default(false),
  codigo: varchar("codigo", { length: 20 }).notNull(),
  nombre: varchar("nombre", { length: 255 }).notNull(),
  tipo: varchar("tipo", { length: 20 }).notNull(),
  naturaleza: varchar("naturaleza", { length: 1 }),
  nivel: int("nivel").notNull().default(1),
  categoriaNivel: varchar("categoria_nivel", { length: 20 }),
  ruta: varchar("ruta", { length: 500 }),
  rutaCodigo: varchar("ruta_codigo", { length: 500 }),
  padreId: char("padre_id", { length: 36 }).references((): any => planCuentas.id, { onDelete: "set null" }),
  registraTercero: boolean("registra_tercero").notNull().default(false),
  requiereCentroCosto: boolean("requiere_centro_costo").notNull().default(false),
  requierePresupuesto: boolean("requiere_presupuesto").notNull().default(false),
  niifCategoriaId: char("niif_categoria_id", { length: 36 }),
  pucCategoriaId: char("puc_categoria_id", { length: 36 }),
  activo: boolean("activo").notNull().default(true),
  fechaCreacion: datetime("fecha_creacion").notNull().default(sql`NOW()`),
  fechaActualizacion: datetime("fecha_actualizacion").notNull().default(sql`NOW()`),
}, (table) => ({
  suscriptorIdx: index("idx_plan_cuentas_suscriptor").on(table.suscriptorId),
  codigoUnique: uniqueIndex("uk_plan_cuentas_codigo").on(table.suscriptorId, table.codigo),
}));

export const conceptosExogena = mysqlTable("conceptos_exogena", {
  id: char("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  suscriptorId: char("suscriptor_id", { length: 36 }).notNull().references(() => suscriptores.id, { onDelete: "cascade" }),
  codigo: varchar("codigo", { length: 20 }).notNull(),
  descripcion: varchar("descripcion", { length: 255 }).notNull(),
  formato: varchar("formato", { length: 50 }),
  tipo: varchar("tipo", { length: 50 }),
  estado: boolean("estado").notNull().default(true),
  fechaCreacion: datetime("fecha_creacion").notNull().default(sql`NOW()`),
  fechaActualizacion: datetime("fecha_actualizacion").notNull().default(sql`NOW()`),
}, (table) => ({
  suscriptorIdx: index("idx_conceptos_exogena_suscriptor").on(table.suscriptorId),
}));

export const planCuentasExogena = mysqlTable("plan_cuentas_exogena", {
  id: char("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  suscriptorId: char("suscriptor_id", { length: 36 }).notNull().references(() => suscriptores.id, { onDelete: "cascade" }),
  cuentaId: char("cuenta_id", { length: 36 }).notNull().references(() => planCuentas.id, { onDelete: "cascade" }),
  exogenaId: char("exogena_id", { length: 36 }).notNull().references(() => conceptosExogena.id, { onDelete: "cascade" }),
  formato: varchar("formato", { length: 50 }),
  observaciones: text("observaciones"),
  fechaCreacion: datetime("fecha_creacion").notNull().default(sql`NOW()`),
}, (table) => ({
  uniqueRelation: uniqueIndex("uk_plan_cuentas_exogena").on(table.suscriptorId, table.cuentaId, table.exogenaId),
}));

export const centrosCosto = mysqlTable("centros_costo", {
  id: char("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  suscriptorId: char("suscriptor_id", { length: 36 }).notNull().references(() => suscriptores.id, { onDelete: "cascade" }),
  nombre: varchar("nombre", { length: 100 }).notNull(),
  descripcion: text("descripcion"),
  activo: boolean("activo").notNull().default(true),
  fechaCreacion: datetime("fecha_creacion").notNull().default(sql`NOW()`),
  fechaActualizacion: datetime("fecha_actualizacion").notNull().default(sql`NOW()`),
}, (table) => ({
  suscriptorIdx: index("idx_centros_costo_suscriptor").on(table.suscriptorId),
  nombreUnique: uniqueIndex("uk_centros_costo_nombre").on(table.suscriptorId, table.nombre),
}));

export const partidasPresupuestales = mysqlTable("partidas_presupuestales", {
  id: char("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  suscriptorId: char("suscriptor_id", { length: 36 }).notNull().references(() => suscriptores.id, { onDelete: "cascade" }),
  nombre: varchar("nombre", { length: 100 }).notNull(),
  tipo: varchar("tipo", { length: 50 }),
  montoAprobado: decimal("monto_aprobado", { precision: 18, scale: 2 }).notNull().default("0.00"),
  saldo: decimal("saldo", { precision: 18, scale: 2 }).notNull().default("0.00"),
  estado: boolean("estado").notNull().default(true),
  fechaCreacion: datetime("fecha_creacion").notNull().default(sql`NOW()`),
  fechaActualizacion: datetime("fecha_actualizacion").notNull().default(sql`NOW()`),
}, (table) => ({
  suscriptorIdx: index("idx_partidas_presupuestales_suscriptor").on(table.suscriptorId),
}));

export const periodosContables = mysqlTable("periodos_contables", {
  id: char("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  suscriptorId: char("suscriptor_id", { length: 36 }).notNull().references(() => suscriptores.id, { onDelete: "cascade" }),
  nombre: varchar("nombre", { length: 100 }).notNull(),
  ano: int("ano").notNull(),
  mes: int("mes").notNull(),
  fechaInicio: date("fecha_inicio").notNull(),
  fechaFin: date("fecha_fin").notNull(),
  estado: varchar("estado", { length: 20 }).notNull().default("abierto"),
  fechaCierre: datetime("fecha_cierre"),
  usuarioCierreId: char("usuario_cierre_id", { length: 36 }).references(() => usuarios.id, { onDelete: "set null" }),
  fechaCreacion: datetime("fecha_creacion").notNull().default(sql`NOW()`),
  fechaActualizacion: datetime("fecha_actualizacion").notNull().default(sql`NOW()`),
}, (table) => ({
  suscriptorIdx: index("idx_periodos_suscriptor").on(table.suscriptorId),
  anoMesUnique: uniqueIndex("uk_periodos_ano_mes").on(table.suscriptorId, table.ano, table.mes),
}));

// =====================================================================
// TABLAS DE CONFIGURACIÓN DE TRANSACCIONES Y PLANTILLAS
// =====================================================================

export const tiposComprobantes = mysqlTable("tipos_comprobantes", {
  id: char("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  suscriptorId: char("suscriptor_id", { length: 36 }).notNull().references(() => suscriptores.id, { onDelete: "cascade" }),
  nombre: varchar("nombre", { length: 100 }).notNull(),
  descripcion: varchar("descripcion", { length: 255 }),
  fechaCreacion: datetime("fecha_creacion").notNull().default(sql`NOW()`),
}, (table) => ({
  suscriptorIdx: index("idx_tipos_comprobantes_suscriptor").on(table.suscriptorId),
}));

export const tiposTransaccion = mysqlTable("tipos_transaccion", {
  id: char("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  suscriptorId: char("suscriptor_id", { length: 36 }).notNull().references(() => suscriptores.id, { onDelete: "cascade" }),
  nombre: varchar("nombre", { length: 100 }).notNull(),
  descripcion: varchar("descripcion", { length: 255 }),
  fechaCreacion: datetime("fecha_creacion").notNull().default(sql`NOW()`),
  fechaActualizacion: datetime("fecha_actualizacion").notNull().default(sql`NOW()`),
}, (table) => ({
  suscriptorIdx: index("idx_tipos_transaccion_suscriptor").on(table.suscriptorId),
}));

export const prefijos = mysqlTable("prefijos", {
  id: char("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  suscriptorId: char("suscriptor_id", { length: 36 }).notNull().references(() => suscriptores.id, { onDelete: "cascade" }),
  tipoTransaccionId: char("tipo_transaccion_id", { length: 36 }).notNull().references(() => tiposTransaccion.id, { onDelete: "cascade" }),
  prefijo: varchar("prefijo", { length: 20 }).notNull(),
  numeracionActual: int("numeracion_actual").notNull().default(1),
  descripcion: varchar("descripcion", { length: 255 }),
  fechaCreacion: datetime("fecha_creacion").notNull().default(sql`NOW()`),
  fechaActualizacion: datetime("fecha_actualizacion").notNull().default(sql`NOW()`),
}, (table) => ({
  tipoUnique: uniqueIndex("uk_prefijos_tipo").on(table.suscriptorId, table.tipoTransaccionId),
}));

export const conceptosPh = mysqlTable("conceptos_ph", {
  id: char("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  suscriptorId: char("suscriptor_id", { length: 36 }).notNull().references(() => suscriptores.id, { onDelete: "cascade" }),
  nombre: varchar("nombre", { length: 255 }).notNull(),
  descripcion: text("descripcion"),
  tipoConcepto: varchar("tipo_concepto", { length: 100 }).notNull(),
  valorBase: decimal("valor_base", { precision: 15, scale: 2 }).notNull(),
  aplicaPorCoeficiente: boolean("aplica_por_coeficiente").notNull().default(true),
  aplicaPorArea: boolean("aplica_por_area").notNull().default(false),
  cuentaId: char("cuenta_id", { length: 36 }).references(() => planCuentas.id, { onDelete: "set null" }),
  centroCostoId: char("centro_costo_id", { length: 36 }).references(() => centrosCosto.id, { onDelete: "set null" }),
  aplicaIva: boolean("aplica_iva").notNull().default(false),
  aplicaIntereses: boolean("aplica_intereses").notNull().default(false),
  porcentajeIva: decimal("porcentaje_iva", { precision: 5, scale: 2 }).notNull().default("0.00"),
  periodoDesde: date("periodo_desde"),
  periodoHasta: date("periodo_hasta"),
  esConstante: boolean("es_constante").notNull().default(true),
  activo: boolean("activo").notNull().default(true),
  fechaCreacion: datetime("fecha_creacion").notNull().default(sql`NOW()`),
  fechaActualizacion: datetime("fecha_actualizacion").notNull().default(sql`NOW()`),
}, (table) => ({
  suscriptorIdx: index("idx_conceptos_ph_suscriptor").on(table.suscriptorId),
}));

// =====================================================================
// TABLAS DEL NÚCLEO CONTABLE
// =====================================================================

export const movimientosContables = mysqlTable("movimientos_contables", {
  id: char("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  suscriptorId: char("suscriptor_id", { length: 36 }).notNull().references(() => suscriptores.id, { onDelete: "cascade" }),
  numero: varchar("numero", { length: 50 }).notNull(),
  tipo: varchar("tipo", { length: 20 }).notNull(),
  fecha: date("fecha").notNull(),
  periodoId: char("periodo_id", { length: 36 }).notNull().references(() => periodosContables.id, { onDelete: "restrict" }),
  descripcion: text("descripcion"),
  estado: varchar("estado", { length: 20 }).notNull().default("borrador"),
  usuarioCreacionId: char("usuario_creacion_id", { length: 36 }).notNull().references(() => usuarios.id, { onDelete: "restrict" }),
  centroCostoId: char("centro_costo_id", { length: 36 }).references(() => centrosCosto.id, { onDelete: "set null" }),
  partidaPresupuestalId: char("partida_presupuestal_id", { length: 36 }).references(() => partidasPresupuestales.id, { onDelete: "set null" }),
  conciliado: boolean("conciliado").notNull().default(false),
  fechaConciliacion: datetime("fecha_conciliacion"),
  fechaCreacion: datetime("fecha_creacion").notNull().default(sql`NOW()`),
  fechaActualizacion: datetime("fecha_actualizacion").notNull().default(sql`NOW()`),
}, (table) => ({
  suscriptorIdx: index("idx_movimientos_suscriptor").on(table.suscriptorId),
  numeroUnique: uniqueIndex("uk_movimientos_numero").on(table.suscriptorId, table.numero),
}));

export const movimientoDetalle = mysqlTable("movimiento_detalle", {
  id: char("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  movimientoId: char("movimiento_id", { length: 36 }).notNull().references(() => movimientosContables.id, { onDelete: "cascade" }),
  cuentaId: char("cuenta_id", { length: 36 }).notNull().references(() => planCuentas.id, { onDelete: "restrict" }),
  terceroId: char("tercero_id", { length: 36 }).references(() => terceros.id, { onDelete: "set null" }),
  centroCostoId: char("centro_costo_id", { length: 36 }).references(() => centrosCosto.id, { onDelete: "set null" }),
  descripcion: text("descripcion"),
  debito: decimal("debito", { precision: 18, scale: 2 }).notNull().default("0.00"),
  credito: decimal("credito", { precision: 18, scale: 2 }).notNull().default("0.00"),
  baseGravable: decimal("base_gravable", { precision: 18, scale: 2 }),
  fechaCreacion: datetime("fecha_creacion").notNull().default(sql`NOW()`),
}, (table) => ({
  movimientoIdx: index("idx_detalle_movimiento").on(table.movimientoId),
}));

// =====================================================================
// TABLAS DE FACTURACIÓN Y CUOTAS
// =====================================================================

export const facturas = mysqlTable("facturas", {
  id: char("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  suscriptorId: char("suscriptor_id", { length: 36 }).notNull().references(() => suscriptores.id, { onDelete: "cascade" }),
  numeroFactura: varchar("numero_factura", { length: 50 }).notNull(),
  terceroId: char("tercero_id", { length: 36 }).notNull().references(() => terceros.id, { onDelete: "restrict" }),
  unidadId: char("unidad_id", { length: 36 }).references(() => unidades.id, { onDelete: "set null" }),
  periodoId: char("periodo_id", { length: 36 }).notNull().references(() => periodosContables.id, { onDelete: "restrict" }),
  fechaFactura: date("fecha_factura").notNull(),
  fechaVencimiento: date("fecha_vencimiento").notNull(),
  subtotal: decimal("subtotal", { precision: 15, scale: 2 }).notNull(),
  descuentos: decimal("descuentos", { precision: 15, scale: 2 }).notNull().default("0.00"),
  iva: decimal("iva", { precision: 15, scale: 2 }).notNull().default("0.00"),
  total: decimal("total", { precision: 15, scale: 2 }).notNull(),
  saldoPendiente: decimal("saldo_pendiente", { precision: 15, scale: 2 }).notNull(),
  estado: varchar("estado", { length: 20 }).notNull().default("pendiente"),
  observaciones: text("observaciones"),
  fechaCreacion: datetime("fecha_creacion").notNull().default(sql`NOW()`),
  fechaActualizacion: datetime("fecha_actualizacion").notNull().default(sql`NOW()`),
}, (table) => ({
  suscriptorIdx: index("idx_facturas_suscriptor").on(table.suscriptorId),
  numeroUnique: uniqueIndex("uk_facturas_numero").on(table.suscriptorId, table.numeroFactura),
}));

export const conceptosFactura = mysqlTable("conceptos_factura", {
  id: char("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  facturaId: char("factura_id", { length: 36 }).notNull().references(() => facturas.id, { onDelete: "cascade" }),
  concepto: varchar("concepto", { length: 255 }).notNull(),
  cantidad: decimal("cantidad", { precision: 10, scale: 3 }).notNull().default("1.000"),
  valorUnitario: decimal("valor_unitario", { precision: 15, scale: 2 }).notNull(),
  valorTotal: decimal("valor_total", { precision: 15, scale: 2 }).notNull(),
  cuentaId: char("cuenta_id", { length: 36 }).notNull().references(() => planCuentas.id, { onDelete: "restrict" }),
  centroCostoId: char("centro_costo_id", { length: 36 }).references(() => centrosCosto.id, { onDelete: "set null" }),
}, (table) => ({
  facturaIdx: index("idx_conceptos_factura").on(table.facturaId),
}));

export const pagos = mysqlTable("pagos", {
  id: char("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  suscriptorId: char("suscriptor_id", { length: 36 }).notNull().references(() => suscriptores.id, { onDelete: "cascade" }),
  facturaId: char("factura_id", { length: 36 }).notNull().references(() => facturas.id, { onDelete: "cascade" }),
  fechaPago: date("fecha_pago").notNull(),
  valorPagado: decimal("valor_pagado", { precision: 15, scale: 2 }).notNull(),
  metodoPago: varchar("metodo_pago", { length: 50 }),
  referenciaPago: varchar("referencia_pago", { length: 100 }),
  observaciones: text("observaciones"),
  usuarioRegistroId: char("usuario_registro_id", { length: 36 }).notNull().references(() => usuarios.id, { onDelete: "restrict" }),
  fechaCreacion: datetime("fecha_creacion").notNull().default(sql`NOW()`),
}, (table) => ({
  facturaIdx: index("idx_pagos_factura").on(table.facturaId),
}));

// =====================================================================
// TABLAS ADICIONALES (ZONAS COMUNES, CONFIGURACIÓN, ETC.)
// =====================================================================

export const zonasComunes = mysqlTable("zonas_comunes", {
  id: char("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  suscriptorId: char("suscriptor_id", { length: 36 }).notNull().references(() => suscriptores.id, { onDelete: "cascade" }),
  nombre: varchar("nombre", { length: 100 }).notNull(),
  descripcion: varchar("descripcion", { length: 255 }),
  capacidadMaxima: int("capacidad_maxima"),
  estado: varchar("estado", { length: 20 }).notNull().default("disponible"),
  fechaCreacion: datetime("fecha_creacion").notNull().default(sql`NOW()`),
  fechaActualizacion: datetime("fecha_actualizacion").notNull().default(sql`NOW()`),
}, (table) => ({
  suscriptorIdx: index("idx_zonas_comunes_suscriptor").on(table.suscriptorId),
}));

export const reservas = mysqlTable("reservas", {
  id: char("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  suscriptorId: char("suscriptor_id", { length: 36 }).notNull().references(() => suscriptores.id, { onDelete: "cascade" }),
  zonaComunId: char("zona_comun_id", { length: 36 }).notNull().references(() => zonasComunes.id, { onDelete: "cascade" }),
  unidadId: char("unidad_id", { length: 36 }).notNull().references(() => unidades.id, { onDelete: "cascade" }),
  usuarioSolicitaId: char("usuario_solicita_id", { length: 36 }).notNull().references(() => usuarios.id, { onDelete: "restrict" }),
  fechaReserva: date("fecha_reserva").notNull(),
  horaInicio: varchar("hora_inicio", { length: 8 }).notNull(),
  horaFin: varchar("hora_fin", { length: 8 }).notNull(),
  estado: varchar("estado", { length: 20 }).notNull().default("pendiente"),
  observaciones: text("observaciones"),
  fechaCreacion: datetime("fecha_creacion").notNull().default(sql`NOW()`),
  fechaActualizacion: datetime("fecha_actualizacion").notNull().default(sql`NOW()`),
}, (table) => ({
  zonaFechaIdx: index("idx_reservas_zona_fecha").on(table.zonaComunId, table.fechaReserva),
}));

export const configuracionSuscriptor = mysqlTable("configuracion_suscriptor", {
  id: char("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  suscriptorId: char("suscriptor_id", { length: 36 }).notNull().references(() => suscriptores.id, { onDelete: "cascade" }),
  categoria: varchar("categoria", { length: 50 }).notNull(),
  clave: varchar("clave", { length: 100 }).notNull(),
  valor: text("valor"),
  descripcion: text("descripcion"),
  tipo: varchar("tipo", { length: 30 }).notNull().default("texto"),
  fechaCreacion: datetime("fecha_creacion").notNull().default(sql`NOW()`),
  fechaActualizacion: datetime("fecha_actualizacion").notNull().default(sql`NOW()`),
}, (table) => ({
  suscriptorIdx: index("idx_configuracion_suscriptor").on(table.suscriptorId),
  claveUnique: uniqueIndex("uk_configuracion_clave").on(table.suscriptorId, table.categoria, table.clave),
}));

export const auditoria = mysqlTable("auditoria", {
  id: char("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  suscriptorId: char("suscriptor_id", { length: 36 }).references(() => suscriptores.id, { onDelete: "set null" }),
  usuarioId: char("usuario_id", { length: 36 }).references(() => usuarios.id, { onDelete: "set null" }),
  accion: varchar("accion", { length: 100 }).notNull(),
  tablaAfectada: varchar("tabla_afectada", { length: 100 }),
  registroId: char("registro_id", { length: 36 }),
  descripcion: varchar("descripcion", { length: 255 }),
  datosAntiguos: json("datos_antiguos"),
  datosNuevos: json("datos_nuevos"),
  ipAddress: varchar("ip_address", { length: 45 }),
  fecha: datetime("fecha").notNull().default(sql`NOW()`),
}, (table) => ({
  suscriptorIdx: index("idx_auditoria_suscriptor").on(table.suscriptorId),
  fechaIdx: index("idx_auditoria_fecha").on(table.fecha),
}));

export const bancos = mysqlTable("bancos", {
  id: char("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  suscriptorId: char("suscriptor_id", { length: 36 }).notNull().references(() => suscriptores.id, { onDelete: "cascade" }),
  nombre: varchar("nombre", { length: 150 }).notNull(),
  codigo: varchar("codigo", { length: 50 }),
  activo: boolean("activo").notNull().default(true),
  fechaCreacion: datetime("fecha_creacion").notNull().default(sql`NOW()`),
}, (table) => ({
  suscriptorIdx: index("idx_bancos_suscriptor").on(table.suscriptorId),
}));

export const catalogoNiif = mysqlTable("catalogo_niif", {
  id: char("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  codigo: varchar("codigo", { length: 20 }).notNull(),
  nombre: varchar("nombre", { length: 255 }).notNull(),
  nivel: int("nivel").notNull(),
  fechaCreacion: datetime("fecha_creacion").notNull().default(sql`NOW()`),
}, (table) => ({
  codigoIdx: index("idx_catalogo_niif_codigo").on(table.codigo),
}));

export const catalogoPuc = mysqlTable("catalogo_puc", {
  id: char("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  codigo: varchar("codigo", { length: 20 }).notNull(),
  nombre: varchar("nombre", { length: 255 }).notNull(),
  nivel: int("nivel").notNull(),
  fechaCreacion: datetime("fecha_creacion").notNull().default(sql`NOW()`),
}, (table) => ({
  codigoIdx: index("idx_catalogo_puc_codigo").on(table.codigo),
}));

export const catalogEstado = mysqlTable("catalog_estado", {
  id: char("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  codigo: varchar("codigo", { length: 60 }).notNull(),
  nombre: varchar("nombre", { length: 100 }).notNull(),
  descripcion: text("descripcion"),
  fechaCreacion: datetime("fecha_creacion").notNull().default(sql`NOW()`),
  fechaActualizacion: datetime("fecha_actualizacion").notNull().default(sql`NOW()`),
}, (table) => ({
  codigoIdx: index("idx_catalog_estado_codigo").on(table.codigo),
}));

export const cuentasBancarias = mysqlTable("cuentas_bancarias", {
  id: char("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  suscriptorId: char("suscriptor_id", { length: 36 }).notNull().references(() => suscriptores.id, { onDelete: "cascade" }),
  bancoId: char("banco_id", { length: 36 }).references(() => bancos.id, { onDelete: "set null" }),
  numeroCuenta: varchar("numero_cuenta", { length: 100 }).notNull(),
  tipoCuenta: varchar("tipo_cuenta", { length: 50 }),
  titular: varchar("titular", { length: 255 }),
  activo: boolean("activo").notNull().default(true),
  fechaCreacion: datetime("fecha_creacion").notNull().default(sql`NOW()`),
}, (table) => ({
  suscriptorIdx: index("idx_cuentas_bancarias_suscriptor").on(table.suscriptorId),
  bancoIdx: index("idx_cuentas_bancarias_banco").on(table.bancoId),
}));

export const documentosElectronicos = mysqlTable("documentos_electronicos", {
  id: char("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  suscriptorId: char("suscriptor_id", { length: 36 }).notNull().references(() => suscriptores.id, { onDelete: "cascade" }),
  tipoDocumento: varchar("tipo_documento", { length: 50 }).notNull(),
  referenciaExterna: varchar("referencia_externa", { length: 255 }),
  payload: json("payload"),
  estadoEnvio: varchar("estado_envio", { length: 20 }).notNull().default("pendiente"),
  respuesta: json("respuesta"),
  fechaEnvio: datetime("fecha_envio"),
  fechaCreacion: datetime("fecha_creacion").notNull().default(sql`NOW()`),
  fechaActualizacion: datetime("fecha_actualizacion").notNull().default(sql`NOW()`),
}, (table) => ({
  suscriptorIdx: index("idx_documentos_electronicos_suscriptor").on(table.suscriptorId),
  estadoIdx: index("idx_documentos_electronicos_estado").on(table.estadoEnvio),
}));

export const parametrosContables = mysqlTable("parametros_contables", {
  id: char("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  suscriptorId: char("suscriptor_id", { length: 36 }).notNull().references(() => suscriptores.id, { onDelete: "cascade" }),
  tipoParametro: varchar("tipo_parametro", { length: 100 }).notNull(),
  cuentaId: char("cuenta_id", { length: 36 }).notNull().references(() => planCuentas.id, { onDelete: "cascade" }),
  centroCostoId: char("centro_costo_id", { length: 36 }).references(() => centrosCosto.id, { onDelete: "set null" }),
  activo: boolean("activo").notNull().default(true),
  fechaCreacion: datetime("fecha_creacion").notNull().default(sql`NOW()`),
}, (table) => ({
  suscriptorIdx: index("idx_parametros_contables_suscriptor").on(table.suscriptorId),
  tipoIdx: index("idx_parametros_contables_tipo").on(table.tipoParametro),
}));

export const saldosCuentas = mysqlTable("saldos_cuentas", {
  id: char("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  suscriptorId: char("suscriptor_id", { length: 36 }).notNull().references(() => suscriptores.id, { onDelete: "cascade" }),
  cuentaId: char("cuenta_id", { length: 36 }).notNull().references(() => planCuentas.id, { onDelete: "cascade" }),
  periodoId: char("periodo_id", { length: 36 }).notNull().references(() => periodosContables.id, { onDelete: "cascade" }),
  saldoDebito: decimal("saldo_debito", { precision: 18, scale: 2 }).notNull().default("0.00"),
  saldoCredito: decimal("saldo_credito", { precision: 18, scale: 2 }).notNull().default("0.00"),
  fechaActualizacion: datetime("fecha_actualizacion").notNull().default(sql`NOW()`),
}, (table) => ({
  suscriptorIdx: index("idx_saldos_cuentas_suscriptor").on(table.suscriptorId),
  cuentaIdx: index("idx_saldos_cuentas_cuenta").on(table.cuentaId),
  periodoIdx: index("idx_saldos_cuentas_periodo").on(table.periodoId),
  uniqueSaldo: uniqueIndex("uk_saldos_cuentas").on(table.suscriptorId, table.cuentaId, table.periodoId),
}));

// =====================================================================
// SCHEMAS DE VALIDACIÓN CON ZOD
// =====================================================================

export const insertUserSchema = createInsertSchema(usuarios).pick({
  nombre: true,
  apellido: true,
  email: true,
  nit: true,
  password: true,
  suscriptorId: true,
}).partial({
  apellido: true,
  suscriptorId: true,
});

export const insertSuscriptorSchema = createInsertSchema(suscriptores).omit({
  id: true,
  fechaCreacion: true,
  fechaActualizacion: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof usuarios.$inferSelect;
export type InsertSuscriptor = z.infer<typeof insertSuscriptorSchema>;
export type Suscriptor = typeof suscriptores.$inferSelect;