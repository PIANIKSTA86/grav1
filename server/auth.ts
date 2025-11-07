import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";
import { storage } from "./storage";

// Configure Passport Local Strategy
passport.use(
  new LocalStrategy(
    {
      usernameField: "nitUsuario",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, nitUsuario, password, done) => {
      try {
        // Get nitCopropiedad from request body
        const nitCopropiedad = req.body?.nitCopropiedad;

        if (!nitCopropiedad) {
          return done(null, false, { message: "NIT de copropiedad requerido" });
        }

        const user = await storage.getUserByNitAndCopropiedad(nitUsuario, nitCopropiedad);

        if (!user) {
          return done(null, false, { message: "Usuario no encontrado" });
        }

        if (!user.activo) {
          return done(null, false, { message: "Usuario inactivo" });
        }

        // For now, we'll do plain text comparison
        // TODO: Implement proper password hashing with bcrypt
        const isValidPassword = password === user.password;

        if (!isValidPassword) {
          return done(null, false, { message: "Contraseña incorrecta" });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

// Serialize user for session
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await storage.getUser(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

export default passport;