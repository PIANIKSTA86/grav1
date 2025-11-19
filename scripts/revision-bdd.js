import { getDatabase } from "../server/database.js";
import { sql } from "drizzle-orm";
import * as schema from "../shared/schema.js";

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

    for (const tableName of tables) {
      try {
        const result = await db.execute(sql`SHOW TABLES LIKE ${tableName}`);
        const exists = result.length > 0;
        console.log(`  ${exists ? '✅' : '❌'} ${tableName}`);
      } catch (error) {
        console.log(`  ❌ ${tableName} - Error al verificar`);
      }
    }
    console.log("");

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
          console.log(`    - ${s.nombre} (${s.nit})`);
        });
      }

      const usuarios = await db.select().from(schema.usuarios);
      console.log(`  👥 Usuarios de prueba: ${usuarios.length}`);
      if (usuarios.length > 0) {
        usuarios.forEach(u => {
          console.log(`    - ${u.nombre} ${u.apellido} (${u.email})`);
        });
      }
    } catch (error) {
      console.log("  ❌ Error al verificar datos de prueba");
    }
    console.log("");

    // 4. Verificar estructura de tablas críticas
    console.log("🏗️ ESTRUCTURA DE TABLAS CRÍTICAS:");
    const criticalTables = ['suscriptores', 'usuarios', 'comprobantes'];

    for (const tableName of criticalTables) {
      try {
        const result = await db.execute(sql`DESCRIBE ${sql.identifier(tableName)}`);
        console.log(`  📋 ${tableName}: ${result.length} columnas`);
      } catch (error) {
        console.log(`  ❌ ${tableName}: Error al describir tabla`);
      }
    }
    console.log("");

    // 5. Verificar índices
    console.log("🔍 ÍNDICES Y CONSTRAINTS:");
    try {
      const indexes = await db.execute(sql`
        SELECT TABLE_NAME, INDEX_NAME, COLUMN_NAME, NON_UNIQUE
        FROM INFORMATION_SCHEMA.STATISTICS
        WHERE TABLE_SCHEMA = 'gravi'
        ORDER BY TABLE_NAME, SEQ_IN_INDEX
      `);
      console.log(`  📊 Total de índices encontrados: ${indexes.length}`);
    } catch (error) {
      console.log("  ❌ Error al verificar índices");
    }
    console.log("");

    // 6. Verificar foreign keys
    console.log("🔗 RELACIONES (FOREIGN KEYS):");
    try {
      const fks = await db.execute(sql`
        SELECT
          TABLE_NAME,
          COLUMN_NAME,
          CONSTRAINT_NAME,
          REFERENCED_TABLE_NAME,
          REFERENCED_COLUMN_NAME
        FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
        WHERE REFERENCED_TABLE_SCHEMA = 'gravi'
        AND REFERENCED_TABLE_NAME IS NOT NULL
        ORDER BY TABLE_NAME
      `);
      console.log(`  🔗 Total de foreign keys: ${fks.length}`);
    } catch (error) {
      console.log("  ❌ Error al verificar foreign keys");
    }
    console.log("");

    console.log("✅ REVISIÓN COMPLETADA");
    console.log("======================");

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