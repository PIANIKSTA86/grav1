import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "@shared/schema";

let db: ReturnType<typeof drizzle> | null = null;

export async function getDatabase() {
  if (!db) {
    // Parse DATABASE_URL: mysql://root:@localhost:3306/gravi
    const connection = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: '',
      database: 'gravi'
    });
    db = drizzle(connection, { schema, mode: "default" });
  }
  return db;
}

// Export for convenience
export { db };