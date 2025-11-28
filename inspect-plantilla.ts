import { getDatabase } from './server/database';
import { planCuentas } from './shared/schema';
import { eq } from 'drizzle-orm';

async function inspectPlantilla() {
  const db = await getDatabase();

  console.log('🔍 Inspeccionando plantilla original...');

  // Obtener algunas cuentas de plantilla con diferentes niveles
  const plantillas = await db
    .select({
      id: planCuentas.id,
      codigo: planCuentas.codigo,
      nombre: planCuentas.nombre,
      nivel: planCuentas.nivel,
      padreId: planCuentas.padreId
    })
    .from(planCuentas)
    .where(eq(planCuentas.esPlantilla, true))
    .orderBy(planCuentas.nivel, planCuentas.codigo)
    .limit(30);

  console.log('\n📊 Inspección de plantillas:');
  plantillas.forEach((plantilla, i) => {
    console.log(`${i + 1}. ${plantilla.codigo} - Nivel: ${plantilla.nivel}`);
    console.log(`   Nombre: ${plantilla.nombre}`);
    console.log(`   padreId: ${plantilla.padreId} (tipo: ${typeof plantilla.padreId})`);
    if (plantilla.padreId) {
      console.log(`   padreId length: ${plantilla.padreId.length}`);
      console.log(`   padreId as string: ${plantilla.padreId.toString('utf8')}`);
    }
    console.log('');
  });

  // Verificar si hay cuentas con padreId no null
  const cuentasConPadre = await db
    .select()
    .from(planCuentas)
    .where(eq(planCuentas.esPlantilla, true));

  let conPadreCount = 0;
  let sinPadreCount = 0;

  // Función helper para verificar si padreId es null
  const isPadreIdNull = (padreId: Buffer | null): boolean => {
    return !padreId || padreId.length === 0;
  };

  cuentasConPadre.forEach(cuenta => {
    if (isPadreIdNull(cuenta.padreId)) {
      sinPadreCount++;
    } else {
      conPadreCount++;
    }
  });

  console.log(`\n📈 Estadísticas de plantilla:`);
  console.log(`Total plantillas: ${cuentasConPadre.length}`);
  console.log(`Cuentas sin padre: ${sinPadreCount}`);
  console.log(`Cuentas con padre: ${conPadreCount}`);
}

inspectPlantilla().catch(console.error);