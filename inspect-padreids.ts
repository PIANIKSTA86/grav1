import { getDatabase } from './server/database';
import { planCuentas, suscriptores } from './shared/schema';
import { eq } from 'drizzle-orm';

async function inspectPadreIds() {
  const db = await getDatabase();

  // Obtener un suscriptor de ejemplo
  const suscriptor = await db.select().from(suscriptores).limit(1);
  if (suscriptor.length === 0) return;

  console.log(`🔍 Inspeccionando padreId para suscriptor: ${suscriptor[0].nombre}`);

  // Obtener algunas cuentas con diferentes niveles
  const cuentas = await db
    .select({
      id: planCuentas.id,
      codigo: planCuentas.codigo,
      nombre: planCuentas.nombre,
      nivel: planCuentas.nivel,
      padreId: planCuentas.padreId
    })
    .from(planCuentas)
    .where(eq(planCuentas.suscriptorId, suscriptor[0].id))
    .orderBy(planCuentas.nivel, planCuentas.codigo)
    .limit(20);

  console.log('\n📊 Inspección de cuentas:');
  cuentas.forEach((cuenta, i) => {
    console.log(`${i + 1}. ${cuenta.codigo} - Nivel: ${cuenta.nivel}`);
    console.log(`   Nombre: ${cuenta.nombre}`);
    console.log(`   padreId: ${cuenta.padreId} (tipo: ${typeof cuenta.padreId})`);
    if (cuenta.padreId) {
      console.log(`   padreId length: ${cuenta.padreId.length}`);
      console.log(`   padreId as string: ${cuenta.padreId.toString('utf8')}`);
    }
    console.log('');
  });

  // Contar cuentas por nivel
  console.log('\n📈 Distribución por niveles:');
  for (let nivel = 1; nivel <= 8; nivel++) {
    const count = await db
      .select()
      .from(planCuentas)
      .where(eq(planCuentas.suscriptorId, suscriptor[0].id))
      .where(eq(planCuentas.nivel, nivel));

    console.log(`Nivel ${nivel}: ${count.length} cuentas`);
  }
}

inspectPadreIds().catch(console.error);