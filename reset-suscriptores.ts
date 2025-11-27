import { getDatabase } from './server/database';
import { planCuentas } from './shared/schema';
import { eq } from 'drizzle-orm';

async function reset() {
  const db = await getDatabase();

  console.log('🗑️ Borrando todas las cuentas de suscriptores...');

  const result = await db.delete(planCuentas).where(eq(planCuentas.esPlantilla, false));

  console.log(`✅ Borradas ${result.rowsAffected} cuentas de suscriptores`);

  // Verificar que solo queden las plantillas
  const remaining = await db.select().from(planCuentas);
  console.log(`📊 Cuentas restantes en BD: ${remaining.length}`);
  console.log(`🌱 De las cuales plantillas: ${remaining.filter(c => c.esPlantilla).length}`);
}

reset().catch(console.error);