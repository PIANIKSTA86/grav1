// Script para verificar plan de cuentas de un suscriptor
import { getDatabase } from "../server/database";
import { planCuentas } from "../shared/schema";
import { eq } from "drizzle-orm";

async function checkPlanCuentas() {
  try {
    const db = await getDatabase();
    const suscriptorId = '550e8400-e29b-41'; // ID del suscriptor actual

    const result = await db
      .select()
      .from(planCuentas)
      .where(eq(planCuentas.suscriptorId, suscriptorId))
      .limit(10);

    console.log('Plan de cuentas para el suscriptor actual:');
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