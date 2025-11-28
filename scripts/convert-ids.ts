// Script para convertir IDs de binary a char(36)
import { getDatabase } from "../server/database";

async function convertIds() {
  try {
    const db = await getDatabase();

    // Deshabilitar foreign keys
    await db.execute('SET FOREIGN_KEY_CHECKS = 0');

    // Dropear todas las foreign keys que referencian suscriptores.id
    const getFkQuery = `
      SELECT TABLE_NAME, CONSTRAINT_NAME
      FROM information_schema.KEY_COLUMN_USAGE
      WHERE REFERENCED_TABLE_NAME = 'suscriptores' AND REFERENCED_COLUMN_NAME = 'id'
      AND TABLE_SCHEMA = DATABASE()
    `;
    const fkResult = await db.execute(getFkQuery);
    const fks = fkResult[0] as any[];

    for (const fk of fks) {
      const dropQuery = `ALTER TABLE \`${fk.TABLE_NAME}\` DROP FOREIGN KEY \`${fk.CONSTRAINT_NAME}\``;
      await db.execute(dropQuery);
      console.log(`Dropped FK: ${dropQuery}`);
    }

    // Convertir id en suscriptores de binary a string UUID (solo si no ya convertido)
    await db.execute(`
      UPDATE suscriptores
      SET id = LOWER(CONCAT(
        LEFT(HEX(id), 8), '-',
        MID(HEX(id), 9, 4), '-',
        MID(HEX(id), 13, 4), '-',
        MID(HEX(id), 17, 4), '-',
        RIGHT(HEX(id), 12)
      ))
      WHERE id NOT LIKE '%-%'
    `);
    console.log('Converted suscriptores.id from binary to UUID string');

    // Dropear índices no PRIMARY en suscriptores para recrearlos
    const indexQuery = `
      SELECT INDEX_NAME
      FROM information_schema.STATISTICS
      WHERE TABLE_NAME = 'suscriptores' AND TABLE_SCHEMA = DATABASE() AND INDEX_NAME != 'PRIMARY'
    `;
    const indexResult = await db.execute(indexQuery);
    const indices = indexResult[0] as any[];

    for (const idx of indices) {
      const dropIndexQuery = `ALTER TABLE suscriptores DROP INDEX \`${idx.INDEX_NAME}\``;
      await db.execute(dropIndexQuery);
      console.log(`Dropped index: ${dropIndexQuery}`);
    }

    // Dropear primary key
    await db.execute('ALTER TABLE suscriptores DROP PRIMARY KEY');

    // Cambiar el tipo de columna
    await db.execute('ALTER TABLE suscriptores MODIFY COLUMN id CHAR(36) NOT NULL');

    // Recrear el primary key
    await db.execute('ALTER TABLE suscriptores ADD PRIMARY KEY (id)');
    console.log('Recreated primary key on suscriptores.id');

    // Obtener todas las tablas con columna suscriptor_id
    const tablesQuery = `
      SELECT TABLE_NAME
      FROM information_schema.COLUMNS
      WHERE COLUMN_NAME = 'suscriptor_id' AND TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME != 'suscriptores'
    `;
    const tablesResult = await db.execute(tablesQuery);
    const tables = tablesResult[0] as any[];

    // Convertir suscriptor_id en cada tabla
    for (const table of tables) {
      const updateQuery = `
        UPDATE \`${table.TABLE_NAME}\`
        SET suscriptor_id = LOWER(CONCAT(
          LEFT(HEX(suscriptor_id), 8), '-',
          MID(HEX(suscriptor_id), 9, 4), '-',
          MID(HEX(suscriptor_id), 13, 4), '-',
          MID(HEX(suscriptor_id), 17, 4), '-',
          RIGHT(HEX(suscriptor_id), 12)
        ))
        WHERE suscriptor_id IS NOT NULL AND suscriptor_id NOT LIKE '%-%'
      `;
      await db.execute(updateQuery);
      console.log(`Converted suscriptor_id in ${table.TABLE_NAME}`);
    }

    // Habilitar foreign keys
    await db.execute('SET FOREIGN_KEY_CHECKS = 1');

    console.log('Conversión completada. Ahora ejecuta npx drizzle-kit push para recrear las FKs.');

  } catch (error) {
    console.error('Error:', error);
    // Rehabilitar foreign keys en caso de error
    try {
      const db = await getDatabase();
      await db.execute('SET FOREIGN_KEY_CHECKS = 1');
    } catch (e) {
      console.error('Error rehabilitando FKs:', e);
    }
  }
}

convertIds();