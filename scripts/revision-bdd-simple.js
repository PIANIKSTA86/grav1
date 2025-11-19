import mysql from "mysql2/promise";

async function revisarEstadoBaseDatos() {
  console.log("🔍 REVISIÓN DEL ESTADO DE LA BASE DE DATOS GRAVY");
  console.log("================================================\n");

  let connection;

  try {
    // Conectar directamente a MySQL
    connection = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: '',
      database: 'gravi'
    });

    console.log("✅ Conexión a la base de datos exitosa\n");

    // 1. Verificar tablas existentes
    console.log("📋 TABLAS EXISTENTES:");
    const [tables] = await connection.execute(
      "SHOW TABLES"
    );

    const tableNames = tables.map(row => Object.values(row)[0]);
    console.log(`  📊 Total de tablas encontradas: ${tableNames.length}`);

    const expectedTables = [
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
    expectedTables.forEach(tableName => {
      const exists = tableNames.includes(tableName);
      console.log(`  ${exists ? '✅' : '❌'} ${tableName}`);
      if (exists) tablesExistentes++;
    });

    console.log(`\n📊 Total de tablas esperadas existentes: ${tablesExistentes}/${expectedTables.length}\n`);

    // 2. Contar registros en tablas existentes
    console.log("📊 CONTEO DE REGISTROS:");
    const tablesToCount = ['suscriptores', 'usuarios', 'terceros', 'unidades', 'comprobantes', 'facturas'];

    for (const tableName of tablesToCount) {
      if (tableNames.includes(tableName)) {
        try {
          const [rows] = await connection.execute(`SELECT COUNT(*) as count FROM ${tableName}`);
          const count = rows[0].count;
          console.log(`  📈 ${tableName}: ${count} registros`);
        } catch (error) {
          console.log(`  ❌ ${tableName}: Error al contar registros`);
        }
      } else {
        console.log(`  ❌ ${tableName}: Tabla no existe`);
      }
    }
    console.log("");

    // 3. Verificar datos de prueba
    console.log("🧪 DATOS DE PRUEBA:");
    if (tableNames.includes('suscriptores')) {
      try {
        const [suscriptores] = await connection.execute(
          "SELECT id, nombre, nit, activo FROM suscriptores LIMIT 5"
        );
        console.log(`  📋 Suscriptores encontrados: ${suscriptores.length}`);
        suscriptores.forEach(s => {
          console.log(`    - ${s.nombre} (${s.nit}) - ${s.activo ? 'Activo' : 'Inactivo'}`);
        });
      } catch (error) {
        console.log("  ❌ Error al consultar suscriptores");
      }
    }

    if (tableNames.includes('usuarios')) {
      try {
        const [usuarios] = await connection.execute(
          "SELECT nombre, apellido, email, activo FROM usuarios LIMIT 5"
        );
        console.log(`  👥 Usuarios encontrados: ${usuarios.length}`);
        usuarios.forEach(u => {
          console.log(`    - ${u.nombre} ${u.apellido || ''} (${u.email}) - ${u.activo ? 'Activo' : 'Inactivo'}`);
        });
      } catch (error) {
        console.log("  ❌ Error al consultar usuarios");
      }
    }
    console.log("");

    // 4. Análisis de completitud
    console.log("📈 ANÁLISIS DE COMPLETITUD DEL SISTEMA:");
    const completitud = {
      autenticacion: tableNames.includes('suscriptores') && tableNames.includes('usuarios') && tableNames.includes('roles'),
      contabilidad: tableNames.includes('plan_cuentas') && tableNames.includes('comprobantes'),
      tesoreria: tableNames.includes('bancos') && tableNames.includes('cuentas_bancarias'),
      operaciones: tableNames.includes('facturas') && tableNames.includes('conceptos_facturacion'),
      administracion: tableNames.includes('presupuestos') && tableNames.includes('activos_fijos'),
      comunidad: tableNames.includes('reservas') && tableNames.includes('zonas_comunes')
    };

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

    console.log("\n🚀 PRÓXIMOS PASOS RECOMENDADOS:");
    console.log("  1. Crear todas las tablas faltantes usando Drizzle migrations");
    console.log("  2. Implementar APIs REST para cada módulo");
    console.log("  3. Crear middlewares de autenticación y autorización");
    console.log("  4. Implementar lógica de negocio para cada módulo");
    console.log("  5. Crear tests unitarios e integración");

  } catch (error) {
    console.error("❌ ERROR EN LA REVISIÓN DE LA BASE DE DATOS:");
    console.error(error);
    console.log("\n💡 POSIBLES SOLUCIONES:");
    console.log("  1. Verificar que MySQL esté ejecutándose");
    console.log("  2. Verificar credenciales de conexión (usuario: root, password: vacío)");
    console.log("  3. Verificar que la base de datos 'gravi' exista");
    console.log("  4. Crear la base de datos manualmente si no existe");
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Ejecutar la revisión
revisarEstadoBaseDatos().catch(console.error);