// Script para corregir y cargar el PUC.csv a la base de datos
import mysql from "mysql2/promise";
import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";

async function fixAndLoadPUC() {
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

    // Deshabilitar foreign key checks temporalmente
    console.log("🔧 Deshabilitando restricciones de foreign key...");
    await connection.execute(`SET FOREIGN_KEY_CHECKS = 0`);
    console.log("✅ Restricciones FK deshabilitadas");

    // Leer el archivo PUC.csv
    const csvPath = path.join(process.cwd(), 'PUC.csv');
    const csvContent = fs.readFileSync(csvPath, 'utf8');

    // Corregir el header
    let fixedContent = csvContent.replace(
      'ruta,ruta\n_codigo,padre_id',
      'ruta,ruta_codigo,padre_id'
    );

    // Parsear el CSV corregido
    let records = parse(fixedContent, {
      skip_empty_lines: true,
      from_line: 2 // Saltar el header
    });

    // Ordenar por nivel para insertar padres antes que hijos
    records.sort((a, b) => {
      const nivelA = parseInt(a[7]) || 0;
      const nivelB = parseInt(b[7]) || 0;
      return nivelA - nivelB;
    });

    console.log(`📄 Procesando ${records.length} registros del PUC (ordenados por nivel)`);

    // Preparar la consulta de inserción
    const insertQuery = `
      INSERT INTO plan_cuentas (
        id, suscriptor_id, es_plantilla, codigo, nombre, tipo, naturaleza, nivel,
        categoria_nivel, ruta, ruta_codigo, padre_id, registra_tercero,
        requiere_centro_costo, requiere_presupuesto, niif_categoria_id,
        puc_categoria_id, activo, fecha_creacion, fecha_actualizacion
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
      ON DUPLICATE KEY UPDATE
        nombre = VALUES(nombre),
        tipo = VALUES(tipo),
        naturaleza = VALUES(naturaleza),
        nivel = VALUES(nivel),
        categoria_nivel = VALUES(categoria_nivel),
        ruta = VALUES(ruta),
        ruta_codigo = VALUES(ruta_codigo),
        padre_id = VALUES(padre_id),
        registra_tercero = VALUES(registra_tercero),
        requiere_centro_costo = VALUES(requiere_centro_costo),
        requiere_presupuesto = VALUES(requiere_presupuesto),
        niif_categoria_id = VALUES(niif_categoria_id),
        puc_categoria_id = VALUES(puc_categoria_id),
        activo = VALUES(activo),
        fecha_actualizacion = NOW()
    `;

    let successCount = 0;
    let errorCount = 0;

    // Procesar cada registro
    for (let i = 0; i < records.length; i++) {
      const record = records[i];

      try {
        // Generar UUID para el id
        const uuid = crypto.randomUUID();

        // Preparar los valores
        const values = [
          uuid, // id
          null, // suscriptor_id (null para plantilla)
          record[2] || 1, // es_plantilla
          record[3], // codigo
          record[4], // nombre
          record[5], // tipo
          record[6], // naturaleza
          parseInt(record[7]) || 1, // nivel
          record[8], // categoria_nivel
          record[9] || null, // ruta
          record[10] || null, // ruta_codigo
          record[11] || null, // padre_id (temporalmente null, se actualizará después)
          record[12] === '1' ? 1 : 0, // registra_tercero
          record[13] === '1' ? 1 : 0, // requiere_centro_costo
          record[14] === '1' ? 1 : 0, // requiere_presupuesto
          record[15] || null, // niif_categoria_id
          record[16] || null, // puc_categoria_id
          record[17] === '1' ? 1 : 0 // activo
        ];

        await connection.execute(insertQuery, values);
        successCount++;

        if (successCount % 100 === 0) {
          console.log(`✅ Procesados ${successCount} registros...`);
        }

      } catch (error) {
        console.error(`❌ Error en registro ${i + 1}:`, error.message);
        console.error('Datos:', record);
        errorCount++;
      }
    }

    console.log(`\n✅ Primera fase completada: ${successCount} registros insertados`);

    // Segunda fase: actualizar padre_id basándose en códigos
    console.log("🔄 Actualizando relaciones padre-hijo...");
    let updateCount = 0;
    
    for (const record of records) {
      const codigoHijo = record[3];
      const codigoPadre = record[11];
      
      if (codigoPadre && codigoPadre.trim()) {
        try {
          // Buscar el ID del padre por código
          const [padreResult] = await connection.execute(
            'SELECT id FROM plan_cuentas WHERE es_plantilla = 1 AND codigo = ?',
            [codigoPadre]
          );
          
          if (padreResult.length > 0) {
            const padreId = padreResult[0].id;
            
            // Actualizar el registro hijo con el padre_id correcto
            await connection.execute(
              'UPDATE plan_cuentas SET padre_id = ? WHERE es_plantilla = 1 AND codigo = ?',
              [padreId, codigoHijo]
            );
            updateCount++;
          }
        } catch (error) {
          console.error(`❌ Error actualizando padre para ${codigoHijo}:`, error.message);
        }
      }
    }

    console.log(`✅ Actualizados ${updateCount} registros con padre_id`);

    // Verificar que se cargaron los datos
    const [countResult] = await connection.execute(
      "SELECT COUNT(*) as total FROM plan_cuentas WHERE es_plantilla = 1"
    );
    console.log(`   - Total en BD: ${countResult[0].total} registros de plantilla`);

  } catch (error) {
    console.error("❌ Error general:", error);
  } finally {
    if (connection) {
      // Volver a habilitar foreign key checks
      console.log("🔧 Habilitando restricciones de foreign key...");
      await connection.execute(`SET FOREIGN_KEY_CHECKS = 1`);
      console.log("✅ Restricciones FK habilitadas");

      await connection.end();
      console.log("🔌 Conexión cerrada");
    }
  }
}

fixAndLoadPUC();