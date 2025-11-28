// Script para reparar UUIDs truncados en la base de datos
import { getDatabase } from "../server/database";
import { suscriptores } from "../shared/schema";
import { eq, sql } from "drizzle-orm";
import { randomUUID } from "crypto";

async function repairUUIDs() {
  try {
    const db = await getDatabase();

    // Obtener suscriptores con IDs truncados (longitud < 36)
    const allSuscriptores = await db.select().from(suscriptores);

    console.log(`🔍 Encontrados ${allSuscriptores.length} suscriptores`);

    const suscriptoresToUpdate = allSuscriptores.filter((s: any) => s.id.length < 36);

    console.log(`📋 Suscriptores con IDs truncados: ${suscriptoresToUpdate.length}`);

    for (const suscriptor of suscriptoresToUpdate) {
      console.log(`\n🔧 Reparando suscriptor: ${suscriptor.nombre} (${suscriptor.nit})`);
      console.log(`   ID actual: ${suscriptor.id} (longitud: ${suscriptor.id.length})`);

      const newId = randomUUID();
      console.log(`   Nuevo ID: ${newId}`);

      // Actualizar el suscriptor
      await db.update(suscriptores)
        .set({ id: newId })
        .where(eq(suscriptores.id, suscriptor.id));

      // Actualizar todas las referencias usando raw SQL
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
      ];

      for (const tableName of tablesToUpdate) {
        await db.execute(sql`UPDATE ${sql.identifier(tableName)} SET suscriptor_id = ${newId} WHERE suscriptor_id = ${suscriptor.id}`);
        console.log(`   ✅ Actualizada tabla ${tableName}`);
      }

      console.log(`✅ Suscriptor reparado: ${newId}`);
    }

    console.log(`\n🎉 Reparación completada!`);

  } catch (error) {
    console.error('❌ Error reparando UUIDs:', error);
  }
}

// Ejecutar el script
repairUUIDs();