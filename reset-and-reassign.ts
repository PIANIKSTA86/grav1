import { getDatabase } from './server/database';
import { planCuentas, suscriptores } from './shared/schema';
import { eq } from 'drizzle-orm';

async function resetAndReassign() {
  const db = await getDatabase();

  const suscriptoresList = await db.select().from(suscriptores);

  for (const suscriptor of suscriptoresList) {
    console.log(`🔄 Reseteando plan de cuentas para: ${suscriptor.nombre} (${suscriptor.nit})`);

    // Eliminar cuentas existentes
    await db.delete(planCuentas).where(eq(planCuentas.suscriptorId, suscriptor.id));

    // Reasignar plantilla
    const { asignarPlantillaPUC } = await import('./shared/utils/plan-cuentas');
    const result = await asignarPlantillaPUC(suscriptor.id);

    if (result.success) {
      console.log(`✅ Éxito: ${result.data?.cuentasCopiadas} cuentas asignadas`);
    } else {
      console.error(`❌ Error: ${result.message}`);
    }
  }

  console.log('🎉 Proceso completado');
}

resetAndReassign().catch(console.error);