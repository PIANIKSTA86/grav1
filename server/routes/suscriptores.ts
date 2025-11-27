// routes/suscriptores.ts
import { Router } from "express";
import { storage } from "../storage";
import { insertSuscriptorSchema } from "@shared/schema";
import { asignarPlantillaPUC } from "@shared/utils/plan-cuentas";

const suscriptoresRouter = Router();

// POST /api/suscriptores
// Crea un nuevo suscriptor y asigna la plantilla del PUC
suscriptoresRouter.post("/", async (req, res) => {
  try {
    const validation = insertSuscriptorSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        message: "Datos inválidos",
        errors: validation.error.issues
      });
    }

    // Verificar si el suscriptor ya existe por NIT
    const existingSuscriptor = await storage.getSuscriptorByNit(validation.data.nit);
    if (existingSuscriptor) {
      return res.status(409).json({ message: "Ya existe un suscriptor con este NIT" });
    }

    // Crear el suscriptor
    const newSuscriptor = await storage.createSuscriptor(validation.data);

    console.log(`✅ Suscriptor creado: ${newSuscriptor.nombre} (${newSuscriptor.id})`);

    // Asignar la plantilla del PUC al nuevo suscriptor
    const result = await asignarPlantillaPUC(newSuscriptor.id);

    if (!result.success) {
      console.error("❌ Error asignando plantilla PUC:", result.message);
      // No fallamos la creación del suscriptor, pero logueamos el error
    } else {
      console.log(`✅ Plantilla PUC asignada: ${result.data?.cuentasCopiadas} cuentas`);
    }

    res.status(201).json({
      message: "Suscriptor creado exitosamente",
      suscriptor: newSuscriptor,
      plantillaAsignada: result.success,
      cuentasCopiadas: result.data?.cuentasCopiadas || 0
    });

  } catch (error) {
    console.error("❌ Error creando suscriptor:", error);
    res.status(500).json({
      message: "Error interno del servidor"
    });
  }
});

export default suscriptoresRouter;