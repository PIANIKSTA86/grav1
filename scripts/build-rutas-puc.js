// Script para construir las rutas jerárquicas en plan_cuentas
import mysql from "mysql2/promise";

async function buildRutasPUC() {
  let connection;

  try {
    // Conectar a la base de datos
    connection = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: '',
      database: 'gravi'
    });

    console.log("✅ Conectado a la base de datos");

    async function buildRuta(cuentaId) {
      const ruta = [];
      const rutaCodigos = [];
      let currentId = cuentaId;

      while (currentId) {
        const [rows] = await connection.execute(
          'SELECT nombre, codigo, padre_id FROM plan_cuentas WHERE id = ? AND es_plantilla = 1',
          [currentId]
        );

        if (rows.length === 0) break;

        ruta.unshift(rows[0].nombre);
        rutaCodigos.unshift(rows[0].codigo);
        currentId = rows[0].padre_id;
      }

      return {
        ruta: ruta.join(' > '),
        rutaCodigo: rutaCodigos.join(' > ')
      };
    }

    // Obtener todas las cuentas de plantilla ordenadas por nivel
    const [cuentas] = await connection.execute(
      'SELECT id, codigo, nombre FROM plan_cuentas WHERE es_plantilla = 1 ORDER BY nivel'
    );

    console.log(`📄 Actualizando rutas para ${cuentas.length} cuentas...`);

    let updated = 0;
    for (const cuenta of cuentas) {
      const { ruta, rutaCodigo } = await buildRuta(cuenta.id);

      await connection.execute(
        'UPDATE plan_cuentas SET ruta = ?, ruta_codigo = ? WHERE id = ?',
        [ruta, rutaCodigo, cuenta.id]
      );

      updated++;
      if (updated % 500 === 0) {
        console.log(`✅ Actualizadas ${updated} cuentas...`);
      }
    }

    console.log(`✅ Completado: ${updated} rutas actualizadas`);

    // Verificar algunas rutas construidas
    const [samples] = await connection.execute(
      'SELECT codigo, nombre, ruta, ruta_codigo FROM plan_cuentas WHERE es_plantilla = 1 AND nivel >= 3 LIMIT 5'
    );

    console.log('\n📋 Ejemplos de rutas construidas:');
    samples.forEach(sample => {
      console.log(`${sample.codigo} - ${sample.nombre}`);
      console.log(`  Ruta: ${sample.ruta}`);
      console.log(`  Código: ${sample.ruta_codigo}\n`);
    });

  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    if (connection) {
      await connection.end();
      console.log("🔌 Conexión cerrada");
    }
  }
}

buildRutasPUC();