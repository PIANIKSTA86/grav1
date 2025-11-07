import { Router } from "express";
import passport from "../auth";
import { storage } from "../storage";
import { insertUserSchema } from "@shared/schema";

const authRouter = Router();

// Middleware to check if user is authenticated
export const requireAuth = (req: any, res: any, next: any) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "No autorizado" });
};

// Register route
authRouter.post("/register", async (req, res) => {
  try {
    const { nombre, apellido, email, nit, password, suscriptorId } = req.body;

    // Validate input
    const validation = insertUserSchema.safeParse({ nombre, apellido, email, nit, password, suscriptorId });
    if (!validation.success) {
      return res.status(400).json({
        message: "Datos inválidos",
        errors: validation.error.issues
      });
    }

    // Check if user already exists
    const existingUser = await storage.getUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: "El email ya está registrado" });
    }

    // Create user
    const newUser = await storage.createUser({
      nombre,
      apellido,
      email,
      nit,
      password,
      suscriptorId, // TODO: Hash password before storing
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = newUser;

    res.status(201).json({
      message: "Usuario registrado exitosamente",
      user: userWithoutPassword
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

// Login route
authRouter.post("/login", (req, res, next) => {
  passport.authenticate("local", (err: any, user: any, info: any) => {
    if (err) {
      return res.status(500).json({ message: "Error interno del servidor" });
    }

    if (!user) {
      return res.status(401).json({ message: info.message || "Credenciales inválidas" });
    }

    req.logIn(user, (err) => {
      if (err) {
        return res.status(500).json({ message: "Error al iniciar sesión" });
      }

      // Remove password from response
      const { password, ...userWithoutPassword } = user;

      res.json({
        message: "Inicio de sesión exitoso",
        user: userWithoutPassword
      });
    });
  })(req, res, next);
});

// Logout route
authRouter.post("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: "Error al cerrar sesión" });
    }
    res.json({ message: "Sesión cerrada exitosamente" });
  });
});

// Get current user
authRouter.get("/me", requireAuth, async (req, res) => {
  try {
    const userWithSuscriptor = await storage.getUserWithSuscriptor((req.user as any).id);
    
    if (!userWithSuscriptor) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Remove password from response
    const { password, ...userWithoutPassword } = userWithSuscriptor.user;

    res.json({ 
      user: userWithoutPassword,
      suscriptor: userWithSuscriptor.suscriptor
    });
  } catch (error) {
    console.error("Error getting current user:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

export default authRouter;