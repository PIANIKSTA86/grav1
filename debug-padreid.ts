import { getDatabase } from './server/database.js';
import { planCuentas } from './shared/schema.js';
import { eq, isNotNull, isNull } from 'drizzle-orm';

async function debugPadreId() {
  const db = await getDatabase();
  // Obtener una cuenta con padreId no null de la plantilla
  const cuentaConPadre = await db
    .select()
    .from(planCuentas)
    .where(eq(planCuentas.esPlantilla, true))
    .where(isNotNull(planCuentas.padreId))
    .limit(1);

  if (cuentaConPadre.length > 0) {
    const cuenta = cuentaConPadre[0];
    console.log('Cuenta con padreId:');
    console.log('numero:', cuenta.numero);
    console.log('id:', cuenta.id, 'tipo:', typeof cuenta.id);
    console.log('padreId:', cuenta.padreId, 'tipo:', typeof cuenta.padreId);
    if (cuenta.padreId) {
      console.log('padreId como Buffer:', Buffer.isBuffer(cuenta.padreId));
      console.log('padreId toString hex:', cuenta.padreId.toString('hex'));
      console.log('padreId toString utf8:', cuenta.padreId.toString('utf8'));
    }
  } else {
    console.log('No se encontró cuenta con padreId');
  }

  // Obtener una cuenta raíz
  const cuentaRaiz = await db
    .select()
    .from(planCuentas)
    .where(eq(planCuentas.esPlantilla, true))
    .where(isNull(planCuentas.padreId))
    .limit(1);

  if (cuentaRaiz.length > 0) {
    const cuenta = cuentaRaiz[0];
    console.log('Cuenta raíz:');
    console.log('numero:', cuenta.numero);
    console.log('id:', cuenta.id, 'tipo:', typeof cuenta.id);
    console.log('padreId:', cuenta.padreId, 'tipo:', typeof cuenta.padreId);
  }
}

debugPadreId().catch(console.error);