// Script para verificar plan de cuentas de un suscriptor
import { getDatabase } from "../server/database";
import { planCuentas } from "../shared/schema";
import { eq } from "drizzle-orm";

async function checkPlanCuentas() {
  try {
    const db = await getDatabase();
    const suscriptorId = '3d38ab84-bca9-46'; // ID del suscriptor Empresa Test S.A.S.

    const result = await db
      .select()
      .from(planCuentas)
      .where(eq(planCuentas.suscriptorId, suscriptorId))
      .limit(5);

    console.log('Plan de cuentas para Empresa Test S.A.S.:');
    console.log('Número de cuentas encontradas:', result.length);

    if (result.length > 0) {
      result.forEach(c => {
        console.log(`- ${c.codigo} - ${c.nombre} (Nivel ${c.nivel})`);
      });
    } else {
      console.log('No tiene plan de cuentas asignado');
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkPlanCuentas();