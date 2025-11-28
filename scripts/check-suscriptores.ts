// Script para verificar suscriptores existentes
import { getDatabase } from "../server/database";
import { suscriptores } from "../shared/schema";

async function checkSuscriptores() {
  try {
    const db = await getDatabase();
    const result = await db.execute('SELECT id, HEX(id) as hex_id FROM suscriptores');
    console.log('Suscriptores existentes:');
    (result[0] as any[]).forEach(s => {
      console.log(`- ID: ${s.id} (length: ${s.id.length}) HEX: ${s.hex_id}`);
    });
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkSuscriptores();