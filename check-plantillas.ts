import { getDatabase } from './server/database';
import { planCuentas } from './shared/schema';
import { eq, count } from 'drizzle-orm';

async function check() {
  const db = await getDatabase();
  const plantillas = await db.select({ count: count() }).from(planCuentas).where(eq(planCuentas.esPlantilla, true));
  const totalCuentas = await db.select({ count: count() }).from(planCuentas);

  console.log(`📊 Total de cuentas en BD: ${totalCuentas[0].count}`);
  console.log(`🌱 Cuentas plantilla (esPlantilla=true): ${plantillas[0].count}`);
}

check().catch(console.error);