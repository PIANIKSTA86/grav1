// Script para verificar suscriptores existentes
import { getDatabase } from "../server/database";
import { suscriptores } from "../shared/schema";

async function checkSuscriptores() {
  try {
    const db = await getDatabase();
    const result = await db.select().from(suscriptores);
    console.log('Suscriptores existentes:');
    result.forEach(s => {
      console.log(`- ${s.nombre} (${s.nit}) - ID: ${s.id}`);
    });
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkSuscriptores();