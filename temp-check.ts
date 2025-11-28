// Script temporal para verificar plantillas
import { getDatabase } from "../server/database";
import { planCuentas } from "../shared/schema";
import { eq } from "drizzle-orm";

async function check() {
  try {
    const db = await getDatabase();
    const plantillas = await db
      .select()
      .from(planCuentas)
      .where(eq(planCuentas.esPlantilla, true));

    console.log('Número de plantillas:', plantillas.length);

    const cuentasSuscriptor = await db
      .select()
      .from(planCuentas)
      .where(eq(planCuentas.suscriptorId, '550e8400-e29b-41'));

    console.log('Número de cuentas del suscriptor:', cuentasSuscriptor.length);
  } catch (error) {
    console.error('Error:', error);
  }
}

check();