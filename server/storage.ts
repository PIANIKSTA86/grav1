import { type User, type InsertUser, usuarios, suscriptores, type InsertSuscriptor, type Suscriptor } from "@shared/schema";
import { eq, and } from "drizzle-orm";
import { getDatabase } from "./database";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByNitAndCopropiedad(nitUsuario: string, nitCopropiedad: string): Promise<User | undefined>;
  getUserWithSuscriptor(id: string): Promise<any>;
  createUser(user: InsertUser): Promise<User>;
  getSuscriptor(id: string): Promise<Suscriptor | undefined>;
  getSuscriptorByNit(nit: string): Promise<Suscriptor | undefined>;
  createSuscriptor(suscriptor: InsertSuscriptor): Promise<Suscriptor>;
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

  async getUserWithSuscriptor(id: string): Promise<any> {
    const db = await getDatabase();
    
    // First get the user
    const userResult = await db.select().from(usuarios).where(eq(usuarios.id, id)).limit(1);
    if (userResult.length === 0) return undefined;
    
    const user = userResult[0];
    
    // Check if user has a suscriptorId
    if (!user.suscriptorId) return { user, suscriptor: null };
    
    // Then get the suscriptor
    const suscriptorResult = await db.select().from(suscriptores).where(eq(suscriptores.id, user.suscriptorId)).limit(1);
    if (suscriptorResult.length === 0) return { user, suscriptor: null };
    
    const suscriptor = suscriptorResult[0];
    
    return {
      user,
      suscriptor
    };
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const db = await getDatabase();
    await db.insert(usuarios).values(insertUser);
    const user = await db.select().from(usuarios).where(eq(usuarios.email, insertUser.email));
    return user[0];
  }

  async getSuscriptor(id: string): Promise<Suscriptor | undefined> {
    const db = await getDatabase();
    const result = await db.select().from(suscriptores).where(eq(suscriptores.id, id)).limit(1);
    return result[0];
  }

  async getSuscriptorByNit(nit: string): Promise<Suscriptor | undefined> {
    const db = await getDatabase();
    const result = await db.select().from(suscriptores).where(eq(suscriptores.nit, nit)).limit(1);
    return result[0];
  }

  async createSuscriptor(insertSuscriptor: InsertSuscriptor): Promise<Suscriptor> {
    const db = await getDatabase();
    await db.insert(suscriptores).values(insertSuscriptor);
    const suscriptor = await db.select().from(suscriptores).where(eq(suscriptores.nit, insertSuscriptor.nit));
    return suscriptor[0];
  }
}

export const storage = new DatabaseStorage();
