import mysql from "mysql2/promise";
import fs from "fs";
import path from "path";

async function runMigrations() {
  let connection;

  try {
    // Conectar a la base de datos
    connection = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: '',
      database: 'gravi'
    });

    console.log("✅ Conectado a la base de datos");

    // Leer el archivo de migración
    const migrationPath = path.join(process.cwd(), 'migrations', '0000_striped_corsair_clean.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

    // Dividir el SQL en statements individuales
    const statements = migrationSQL.split(';').filter(stmt => stmt.trim().length > 0);

    console.log(`📄 Ejecutando ${statements.length} statements SQL...`);

    // Ejecutar cada statement por separado
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i].trim();
      if (statement) {
        try {
          await connection.execute(statement + ';');
          console.log(`✅ Statement ${i + 1}/${statements.length} ejecutado`);
        } catch (error) {
          console.error(`❌ Error en statement ${i + 1}:`, error.message);
          console.error('Statement:', statement.substring(0, 100) + '...');
          // Continuar con el siguiente statement
        }
      }
    }

    console.log("✅ Migraciones ejecutadas");

    // Verificar que las tablas se crearon
    const [tables] = await connection.execute("SHOW TABLES LIKE 'bancos'");
    if (tables.length > 0) {
      console.log("✅ Tabla 'bancos' creada exitosamente");
    }

  } catch (error) {
    console.error("❌ Error ejecutando migraciones:", error);
  } finally {
    if (connection) {
      await connection.end();
      console.log("🔌 Conexión cerrada");
    }
  }
}

runMigrations();