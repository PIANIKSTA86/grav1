import { getDatabase } from './server/database.js';
import { planCuentas } from './shared/schema.js';
import { eq } from 'drizzle-orm';

async function checkCuenta4705() {
  const db = await getDatabase();
  const cuenta = await db
    .select()
    .from(planCuentas)
    .where(eq(planCuentas.esPlantilla, true))
    .where(eq(planCuentas.codigo, '4705'))
    .limit(1);

  if (cuenta.length > 0) {
    console.log('Cuenta 4705:');
    const c = cuenta[0];
    console.log(`codigo: ${c.codigo}`);
    console.log(`nivel: ${c.nivel}`);
    console.log(`padreId: ${c.padreId ? bufferToUuid(c.padreId) : 'null'}`);

    // Verificar si el padre existe
    if (c.padreId) {
      const padre = await db
        .select()
        .from(planCuentas)
        .where(eq(planCuentas.esPlantilla, true))
        .where(eq(planCuentas.id, c.padreId))
        .limit(1);

      console.log(`Padre existe: ${padre.length > 0}`);
      if (padre.length > 0) {
        console.log(`Padre: ${padre[0].codigo} nivel ${padre[0].nivel}`);
      }
    }
  } else {
    console.log('Cuenta 4705 no encontrada');
  }
}

// Función auxiliar
function bufferToUuid(buffer: Buffer): string {
  const hex = buffer.toString('hex');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`;
}

checkCuenta4705().catch(console.error);