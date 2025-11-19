import { getDatabase } from "./server/database.js";
import { sql } from "drizzle-orm";
import * as schema from "./shared/schema.js";

async function revisarEstadoBaseDatos() {
  console.log("🔍 REVISIÓN DEL ESTADO DE LA BASE DE DATOS GRAVY");
  console.log("================================================\n");

  try {
    const db = await getDatabase();
    console.log("✅ Conexión a la base de datos exitosa\n");

    // 1. Verificar tablas existentes
    console.log("📋 TABLAS EXISTENTES:");
    const tables = [
      'suscriptores', 'roles', 'usuarios', 'terceros', 'unidades',
      'plan_cuentas', 'comprobantes', 'detalle_comprobantes', 'periodos',
      'bancos', 'cuentas_bancarias', 'movimientos_bancarios',
      'facturas', 'detalle_facturas', 'conceptos_facturacion',
      'empleados', 'nominas', 'detalle_nominas', 'parametros_nomina',
      'presupuestos', 'partidas_presupuestarias', 'ejecucion_presupuestaria',
      'activos_fijos', 'depreciacion_activos', 'mantenimiento_activos',
      'reservas', 'zonas_comunes', 'pqrs', 'documentos'
    ];

    let tablesExistentes = 0;
    for (const tableName of tables) {
      try {
        const result = await db.execute(sql`SHOW TABLES LIKE ${tableName}`);
        const exists = result.length > 0;
        if (exists) {
          console.log(`  ✅ ${tableName}`);
          tablesExistentes++;
        } else {
          console.log(`  ❌ ${tableName}`);
        }
      } catch (error) {
        console.log(`  ❌ ${tableName} - Error al verificar`);
      }
    }
    console.log(`\n📊 Total de tablas existentes: ${tablesExistentes}/${tables.length}\n`);

    // 2. Contar registros en tablas principales
    console.log("📊 CONTEO DE REGISTROS:");
    const tableCounts = [
      { name: 'suscriptores', table: schema.suscriptores },
      { name: 'usuarios', table: schema.usuarios },
      { name: 'terceros', table: schema.terceros },
      { name: 'unidades', table: schema.unidades },
      { name: 'comprobantes', table: schema.comprobantes },
      { name: 'facturas', table: schema.facturas }
    ];

    for (const { name, table } of tableCounts) {
      try {
        const result = await db.select({ count: sql<number>`COUNT(*)` }).from(table);
        const count = result[0]?.count || 0;
        console.log(`  📈 ${name}: ${count} registros`);
      } catch (error) {
        console.log(`  ❌ ${name}: Error al contar registros`);
      }
    }
    console.log("");

    // 3. Verificar datos de prueba
    console.log("🧪 DATOS DE PRUEBA:");
    try {
      const suscriptores = await db.select().from(schema.suscriptores);
      console.log(`  📋 Suscriptores de prueba: ${suscriptores.length}`);
      if (suscriptores.length > 0) {
        suscriptores.forEach(s => {
          console.log(`    - ${s.nombre} (${s.nit}) - ${s.activo ? 'Activo' : 'Inactivo'}`);
        });
      }

      const usuarios = await db.select().from(schema.usuarios);
      console.log(`  👥 Usuarios de prueba: ${usuarios.length}`);
      if (usuarios.length > 0) {
        usuarios.forEach(u => {
          console.log(`    - ${u.nombre} ${u.apellido || ''} (${u.email}) - ${u.activo ? 'Activo' : 'Inactivo'}`);
        });
      }
    } catch (error) {
      console.log("  ❌ Error al verificar datos de prueba");
    }
    console.log("");

    // 4. Análisis de completitud
    console.log("📈 ANÁLISIS DE COMPLETITUD DEL SISTEMA:");
    const completitud = {
      autenticacion: tablesExistentes >= 3, // suscriptores, roles, usuarios
      contabilidad: false,
      tesoreria: false,
      operaciones: false,
      administracion: false,
      comunidad: false
    };

    // Verificar módulos específicos
    try {
      await db.execute(sql`SHOW TABLES LIKE 'plan_cuentas'`);
      await db.execute(sql`SHOW TABLES LIKE 'comprobantes'`);
      completitud.contabilidad = true;
    } catch {}

    try {
      await db.execute(sql`SHOW TABLES LIKE 'bancos'`);
      await db.execute(sql`SHOW TABLES LIKE 'cuentas_bancarias'`);
      completitud.tesoreria = true;
    } catch {}

    try {
      await db.execute(sql`SHOW TABLES LIKE 'facturas'`);
      await db.execute(sql`SHOW TABLES LIKE 'conceptos_facturacion'`);
      completitud.operaciones = true;
    } catch {}

    console.log(`  🔐 Autenticación y Usuarios: ${completitud.autenticacion ? '✅ Completo' : '❌ Incompleto'}`);
    console.log(`  💼 Contabilidad: ${completitud.contabilidad ? '✅ Completo' : '❌ Incompleto'}`);
    console.log(`  💰 Tesorería: ${completitud.tesoreria ? '✅ Completo' : '❌ Incompleto'}`);
    console.log(`  ⚙️ Operaciones: ${completitud.operaciones ? '✅ Completo' : '❌ Incompleto'}`);
    console.log(`  🏢 Administración: ${completitud.administracion ? '✅ Completo' : '❌ Incompleto'}`);
    console.log(`  👥 Comunidad: ${completitud.comunidad ? '✅ Completo' : '❌ Incompleto'}`);

    console.log("\n✅ REVISIÓN COMPLETADA");
    console.log("======================");

    // 5. Recomendaciones
    console.log("\n💡 RECOMENDACIONES PARA IMPLEMENTACIÓN:");
    if (!completitud.contabilidad) {
      console.log("  📋 Prioridad 1: Implementar módulo de Contabilidad (Plan de Cuentas, Comprobantes)");
    }
    if (!completitud.tesoreria) {
      console.log("  💰 Prioridad 2: Implementar módulo de Tesorería (Bancos, Movimientos)");
    }
    if (!completitud.operaciones) {
      console.log("  ⚙️ Prioridad 3: Implementar módulo de Operaciones (Facturación, Nómina)");
    }
    if (tablesExistentes < 10) {
      console.log("  🏗️ Ejecutar script init-database.sql completo para crear todas las tablas");
    }

  } catch (error) {
    console.error("❌ ERROR EN LA REVISIÓN DE LA BASE DE DATOS:");
    console.error(error);
    console.log("\n💡 POSIBLES SOLUCIONES:");
    console.log("  1. Verificar que MySQL esté ejecutándose");
    console.log("  2. Verificar credenciales de conexión");
    console.log("  3. Ejecutar el script init-database.sql");
    console.log("  4. Verificar que la base de datos 'gravi' exista");
  }
}

// Ejecutar la revisión
revisarEstadoBaseDatos().catch(console.error);