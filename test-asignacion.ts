import { getDatabase } from './server/database';
import { planCuentas, suscriptores } from './shared/schema';
import { asignarPlantillaPUC } from './shared/utils/plan-cuentas';
import { eq } from 'drizzle-orm';

async function testAsignacion() {
  const db = await getDatabase();

  // Obtener solo el primer suscriptor para testing
  const suscriptor = await db.select().from(suscriptores).limit(1);
  if (suscriptor.length === 0) return;

  console.log(`🎯 Probando asignación para: ${suscriptor[0].nombre} (${suscriptor[0].id})`);

  const result = await asignarPlantillaPUC(suscriptor[0].id);

  if (result.success) {
    console.log('✅ Asignación exitosa');
  } else {
    console.log('❌ Error en asignación:', result.error);
  }
}

testAsignacion().catch(console.error);