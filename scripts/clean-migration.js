import fs from "fs";
import path from "path";

// Leer el archivo de migración
const migrationPath = path.join(process.cwd(), 'migrations', '0000_striped_corsair.sql');
let migrationSQL = fs.readFileSync(migrationPath, 'utf8');

// Limpiar los comentarios de statement-breakpoint
migrationSQL = migrationSQL.replace(/--> statement-breakpoint\n/g, '');

// Escribir el archivo limpio
const cleanMigrationPath = path.join(process.cwd(), 'migrations', '0000_striped_corsair_clean.sql');
fs.writeFileSync(cleanMigrationPath, migrationSQL);

console.log("✅ Archivo de migración limpiado creado:", cleanMigrationPath);