import { getDatabase } from './server/database';
import { planCuentas, suscriptores } from './shared/schema';
import { eq, count, ne } from 'drizzle-orm';

async function check() {
  const db = await getDatabase();

  const suscriptoresList = await db.select().from(suscriptores);

  for (const suscriptor of suscriptoresList) {
    const cuentas = await db.select({ count: count() }).from(planCuentas).where(eq(planCuentas.suscriptorId, suscriptor.id));
    const cuentasRaiz = await db.select({ count: count() }).from(planCuentas).where(eq(planCuentas.suscriptorId, suscriptor.id)).where(eq(planCuentas.padreId, null));
    const cuentasHijas = await db.select({ count: count() }).from(planCuentas).where(eq(planCuentas.suscriptorId, suscriptor.id)).where(ne(planCuentas.padreId, null));

    console.log(`📊 ${suscriptor.nombre} (${suscriptor.nit}): Total: ${cuentas[0].count}, Raíz: ${cuentasRaiz[0].count}, Hijas: ${cuentasHijas[0].count}`);
  }
}

check().catch(console.error);