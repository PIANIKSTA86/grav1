import { getDatabase } from './server/database';
import { planCuentas, suscriptores } from './shared/schema';
import { eq } from 'drizzle-orm';

async function inspect() {
  const db = await getDatabase();

  // Obtener un suscriptor de ejemplo
  const suscriptor = await db.select().from(suscriptores).limit(1);
  if (suscriptor.length === 0) return;

  console.log(`🔍 Inspeccionando cuentas del suscriptor: ${suscriptor[0].nombre}`);

  const cuentas = await db.select().from(planCuentas).where(eq(planCuentas.suscriptorId, suscriptor[0].id)).limit(10);

  cuentas.forEach((cuenta, i) => {
    console.log(`${i + 1}. ${cuenta.codigo} - padreId: ${cuenta.padreId} (type: ${typeof cuenta.padreId})`);
    if (cuenta.padreId) {
      console.log(`   Buffer length: ${cuenta.padreId.length}, isBuffer: ${Buffer.isBuffer(cuenta.padreId)}`);
    }
  });
}

inspect().catch(console.error);