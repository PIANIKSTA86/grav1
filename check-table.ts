import { getDatabase } from './server/database.js';

async function checkTableStructure() {
  const db = await getDatabase();

  // Verificar qué tipo de datos devuelve una consulta
  const sample = await db.execute('SELECT id, padre_id FROM plan_cuentas WHERE es_plantilla = 1 LIMIT 1');
  console.log('Sample row:');
  console.log(sample[0]);

  if (sample[0]) {
    const row = sample[0] as any;
    console.log('id:', row.id, 'tipo:', typeof row.id);
    console.log('padre_id:', row.padre_id, 'tipo:', typeof row.padre_id);
    if (row.id) {
      console.log('id length:', row.id.length);
      console.log('id toString utf8:', row.id.toString('utf8'));
      console.log('id toString hex:', row.id.toString('hex'));
    }
  }
}

checkTableStructure().catch(console.error);