// Script to convert binary UUIDs to string UUIDs
import { getDatabase } from "../server/database";
import { sql } from "drizzle-orm";

async function convertUUIDs() {
  const db = await getDatabase();

  // Convert suscriptores
  await db.execute(sql`
    UPDATE suscriptores
    SET id = LOWER(CONCAT(
      SUBSTRING(HEX(id), 1, 8), '-',
      SUBSTRING(HEX(id), 9, 4), '-',
      SUBSTRING(HEX(id), 13, 4), '-',
      SUBSTRING(HEX(id), 17, 4), '-',
      SUBSTRING(HEX(id), 21, 12)
    ))
  `);

  // Convert plan_cuentas
  await db.execute(sql`
    UPDATE plan_cuentas
    SET id = LOWER(CONCAT(
      SUBSTRING(HEX(id), 1, 8), '-',
      SUBSTRING(HEX(id), 9, 4), '-',
      SUBSTRING(HEX(id), 13, 4), '-',
      SUBSTRING(HEX(id), 17, 4), '-',
      SUBSTRING(HEX(id), 21, 12)
    )),
    suscriptor_id = LOWER(CONCAT(
      SUBSTRING(HEX(suscriptor_id), 1, 8), '-',
      SUBSTRING(HEX(suscriptor_id), 9, 4), '-',
      SUBSTRING(HEX(suscriptor_id), 13, 4), '-',
      SUBSTRING(HEX(suscriptor_id), 17, 4), '-',
      SUBSTRING(HEX(suscriptor_id), 21, 12)
    )),
    padre_id = CASE
      WHEN padre_id IS NOT NULL THEN LOWER(CONCAT(
        SUBSTRING(HEX(padre_id), 1, 8), '-',
        SUBSTRING(HEX(padre_id), 9, 4), '-',
        SUBSTRING(HEX(padre_id), 13, 4), '-',
        SUBSTRING(HEX(padre_id), 17, 4), '-',
        SUBSTRING(HEX(padre_id), 21, 12)
      ))
      ELSE NULL
    END,
    niif_categoria_id = CASE
      WHEN niif_categoria_id IS NOT NULL THEN LOWER(CONCAT(
        SUBSTRING(HEX(niif_categoria_id), 1, 8), '-',
        SUBSTRING(HEX(niif_categoria_id), 9, 4), '-',
        SUBSTRING(HEX(niif_categoria_id), 13, 4), '-',
        SUBSTRING(HEX(niif_categoria_id), 17, 4), '-',
        SUBSTRING(HEX(niif_categoria_id), 21, 12)
      ))
      ELSE NULL
    END,
    puc_categoria_id = CASE
      WHEN puc_categoria_id IS NOT NULL THEN LOWER(CONCAT(
        SUBSTRING(HEX(puc_categoria_id), 1, 8), '-',
        SUBSTRING(HEX(puc_categoria_id), 9, 4), '-',
        SUBSTRING(HEX(puc_categoria_id), 13, 4), '-',
        SUBSTRING(HEX(puc_categoria_id), 17, 4), '-',
        SUBSTRING(HEX(puc_categoria_id), 21, 12)
      ))
      ELSE NULL
    END
  `);

  console.log('UUIDs converted to strings');
}

convertUUIDs().catch(console.error);