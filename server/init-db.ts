import { getDatabase } from "./database";
import { usuarios } from "@shared/schema";
import { eq } from "drizzle-orm";

export async function initializeDatabase() {
  try {
    console.log("🔄 Verificando conexión a base de datos...");

    const db = await getDatabase();

    // Verificar si hay usuarios en la base de datos
    const existingUsers = await db.select().from(usuarios).limit(1);

    if (existingUsers.length > 0) {
      console.log("✅ Base de datos conectada y contiene datos");
      console.log("📧 Usuario administrador disponible");
      return;
    }

    console.log("⚠️ Base de datos conectada pero sin datos de usuarios");
    console.log("💡 Use el script init-database.sql para poblar la base de datos");

  } catch (error) {
    console.log("⚠️ Base de datos no disponible, funcionando en modo mock");
    console.log("📧 Usuario de prueba disponible: admin@gravi.com / admin123");
    // No lanzamos error para no detener el servidor
  }
}