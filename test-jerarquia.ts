import { getDatabase } from './server/database';
import { planCuentas, suscriptores } from './shared/schema';
import { eq } from 'drizzle-orm';

async function testJerarquia() {
  const db = await getDatabase();

  // Obtener un suscriptor de ejemplo
  const suscriptor = await db.select().from(suscriptores).limit(1);
  if (suscriptor.length === 0) return;

  console.log(`🔍 Probando jerarquía para suscriptor: ${suscriptor[0].nombre}`);

  const cuentas = await db
    .select()
    .from(planCuentas)
    .where(eq(planCuentas.suscriptorId, suscriptor[0].id));

  console.log(`📊 Total de cuentas: ${cuentas.length}`);

  // Construir jerarquía
  const cuentaMap = new Map();
  const raices: any[] = [];

  // Indexar todas las cuentas
  cuentas.forEach(cuenta => {
    cuentaMap.set(cuenta.id, { ...cuenta, hijos: [] });
  });

  // Construir jerarquía
  cuentas.forEach(cuenta => {
    const cuentaNode = cuentaMap.get(cuenta.id);

    if (cuenta.padreId) {
      const padre = cuentaMap.get(cuenta.padreId);
      if (padre) {
        padre.hijos.push(cuentaNode);
      }
    } else {
      raices.push(cuentaNode);
    }
  });

  console.log(`🌳 Cuentas raíz: ${raices.length}`);
  console.log(`📋 Primera cuenta raíz: ${raices[0]?.codigo} - ${raices[0]?.nombre}`);
  console.log(`👶 Hijos de la primera raíz: ${raices[0]?.hijos?.length || 0}`);
}

testJerarquia().catch(console.error);