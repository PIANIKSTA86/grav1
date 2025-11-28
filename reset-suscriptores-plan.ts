import { getDatabase } from './server/database';
import { planCuentas, suscriptores } from './shared/schema';
import { eq } from 'drizzle-orm';

async function resetSuscriptoresPlanCuentas() {
  const db = await getDatabase();

  // Obtener todos los suscriptores
  const suscriptoresList = await db.select().from(suscriptores);

  console.log(`🔄 Reseteando plan de cuentas para ${suscriptoresList.length} suscriptores...`);

  for (const suscriptor of suscriptoresList) {
    // Eliminar todas las cuentas del suscriptor (excepto plantillas)
    const result = await db.delete(planCuentas)
      .where(eq(planCuentas.suscriptorId, suscriptor.id));

    console.log(`✅ Eliminadas ${result.rowsAffected} cuentas del suscriptor: ${suscriptor.nombre}`);
  }

  console.log('🎉 Reset completado exitosamente');
}

resetSuscriptoresPlanCuentas().catch(console.error);