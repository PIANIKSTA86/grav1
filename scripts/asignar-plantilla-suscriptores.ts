// Script para asignar plantilla PUC a suscriptores existentes
import { getDatabase } from "../server/database";
import { suscriptores, planCuentas } from "../shared/schema";
import { asignarPlantillaPUC } from "../shared/utils/plan-cuentas";
import { eq } from "drizzle-orm";

async function asignarPlantillaATodosSuscriptores() {
  try {
    const db = await getDatabase();

    // Obtener todos los suscriptores
    const allSuscriptores = await db.select().from(suscriptores);

    console.log(`🔍 Encontrados ${allSuscriptores.length} suscriptores en total`);

    let asignados = 0;
    let yaTienen = 0;
    let errores = 0;

    for (const suscriptor of allSuscriptores) {
      console.log(`\n📋 Procesando suscriptor: ${suscriptor.nombre} (${suscriptor.nit})`);

      // Verificar si ya tiene plan de cuentas
      const existingPlan = await db
        .select()
        .from(planCuentas)
        .where(eq(planCuentas.suscriptorId, suscriptor.id))
        .limit(1);

      if (existingPlan.length > 0) {
        console.log(`   ✅ Ya tiene plan de cuentas asignado`);
        yaTienen++;
        continue;
      }

      // Asignar plantilla PUC
      console.log(`   🏗️ Asignando plantilla PUC...`);
      const result = await asignarPlantillaPUC(suscriptor.id);

      if (result.success) {
        console.log(`   ✅ Plantilla asignada exitosamente: ${result.data?.cuentasCopiadas} cuentas`);
        asignados++;
      } else {
        console.log(`   ❌ Error asignando plantilla: ${result.message}`);
        if (result.error) {
          console.log(`      Detalle: ${result.error}`);
        }
        errores++;
      }
    }

    console.log(`\n📊 Resumen:`);
    console.log(`   Total suscriptores: ${allSuscriptores.length}`);
    console.log(`   Plantillas asignadas: ${asignados}`);
    console.log(`   Ya tenían plan: ${yaTienen}`);
    console.log(`   Errores: ${errores}`);

    if (errores === 0) {
      console.log(`\n🎉 Proceso completado exitosamente!`);
    } else {
      console.log(`\n⚠️ Proceso completado con ${errores} errores.`);
    }

  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

// Ejecutar el script
asignarPlantillaATodosSuscriptores();