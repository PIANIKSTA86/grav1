import { type User, type InsertUser, usuarios, suscriptores } from "@shared/schema";
import { eq, and } from "drizzle-orm";
import { getDatabase } from "./database";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByNitAndCopropiedad(nitUsuario: string, nitCopropiedad: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const db = await getDatabase();
    const result = await db.select().from(usuarios).where(eq(usuarios.id, id)).limit(1);
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const db = await getDatabase();
    const result = await db.select().from(usuarios).where(eq(usuarios.email, email)).limit(1);
    return result[0];
  }

  async getUserByNitAndCopropiedad(nitUsuario: string, nitCopropiedad: string): Promise<User | undefined> {
    const db = await getDatabase();
    const result = await db
      .select()
      .from(usuarios)
      .innerJoin(suscriptores, eq(usuarios.suscriptorId, suscriptores.id))
      .where(and(
        eq(usuarios.nit, nitUsuario),
        eq(suscriptores.nit, nitCopropiedad)
      ))
      .limit(1);
    
    if (result.length === 0) return undefined;
    return result[0].usuarios;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const db = await getDatabase();
    await db.insert(usuarios).values(insertUser);
    const user = await db.select().from(usuarios).where(eq(usuarios.email, insertUser.email));
    return user[0];
  }
}

export const storage = new DatabaseStorage();
