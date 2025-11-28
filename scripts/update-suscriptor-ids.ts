// Script para actualizar IDs de suscriptores a los correctos
import { getDatabase } from "../server/database";
import { suscriptores } from "../shared/schema";
import { eq, sql } from "drizzle-orm";

async function updateSuscriptorIds() {
  try {
    const db = await getDatabase();

    // IDs correctos basados en auth context
    const updates = [
      {
        nit: "900123456",
        newId: "550e8400-e29b-41d4-a716-446655440000",
        oldId: "35353065-3834-3030-2d65-3239622d3431" // el que está en BD
      },
      {
        nit: "900987654",
        newId: "660e8400-e29b-41d4-a716-446655440003",
        oldId: "36363065-3834-3030-2d65-3239622d3431"
      }
    ];

    for (const update of updates) {
      console.log(`🔧 Actualizando suscriptor ${update.nit} de ${update.oldId} a ${update.newId}`);

      // Actualizar referencias primero
      const tablesToUpdate = [
        'plan_cuentas',
        'usuarios',
        'terceros',
        'unidades',
        'centros_costo',
        'conceptos_ph',
        'parametros_contables',
        'saldos_cuentas',
        'periodos_contables',
        'tipos_comprobantes',
        'tipos_transaccion',
        'prefijos',
        'partidas_presupuestales',
        'bancos',
        'cuentas_bancarias',
        'documentos_electronicos',
        'facturas',
        'pagos',
        'zonas_comunes',
        'reservas',
        'configuracion_suscriptor',
        'auditoria',
        'roles', // agregar roles
      ];

      for (const tableName of tablesToUpdate) {
        await db.execute(sql`UPDATE ${sql.identifier(tableName)} SET suscriptor_id = ${update.newId} WHERE suscriptor_id = ${update.oldId}`);
        console.log(`   ✅ Actualizada tabla ${tableName}`);
      }

      // Luego actualizar el suscriptor
      await db.update(suscriptores)
        .set({ id: update.newId })
        .where(eq(suscriptores.nit, update.nit));

      console.log(`✅ Suscriptor ${update.nit} actualizado`);
    }

    console.log(`\n🎉 Actualización completada!`);

  } catch (error) {
    console.error('❌ Error actualizando IDs:', error);
  }
}

// Ejecutar el script
updateSuscriptorIds();