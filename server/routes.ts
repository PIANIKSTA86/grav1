import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import passport from "./auth";
import authRouter from "./routes/auth";
import planCuentasRouter from "./routes/plan-cuentas";
import suscriptoresRouter from "./routes/suscriptores";
import session from "express-session";
import MemoryStore from "memorystore";

export async function registerRoutes(app: Express): Promise<Server> {
  // Configure session middleware
  const MemoryStoreSession = MemoryStore(session);
  app.use(
    session({
      store: new MemoryStoreSession({
        checkPeriod: 86400000, // prune expired entries every 24h
      }),
      secret: process.env.SESSION_SECRET || "default-secret-change-in-production",
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: false, // Set to true in production with HTTPS
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      },
    })
  );

  // Initialize Passport
  app.use(passport.initialize());
  app.use(passport.session());

  // API routes
  app.use("/api/auth", authRouter);
  app.use("/api/plan-cuentas", planCuentasRouter);
  app.use("/api/suscriptores", suscriptoresRouter);

  // put application routes here
  // prefix all routes with /api

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  const httpServer = createServer(app);

  return httpServer;
}
