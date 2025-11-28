import { Router } from "express";
import { getDatabase } from "../database";
import { planCuentas, suscriptores } from "../../shared/schema";
import { asignarPlantillaPUC, suscriptorTienePlanCuentas } from "../../shared/utils/plan-cuentas";
import { eq, asc } from "drizzle-orm";
import type { Request, Response } from "express";
import { z } from "zod";

const router = Router();

const uuidSchema = z.string().uuid("El ID debe ser un UUID válido de 36 caracteres");

// POST /api/plan-cuentas/asignar-plantilla/:suscriptorId
// Asigna la plantilla del PUC a un suscriptor específico
router.post("/asignar-plantilla/:suscriptorId", async (req: Request, res: Response) => {
  try {
    const db = await getDatabase();
    const { suscriptorId } = req.params;

    // Validar UUID
    const validation = uuidSchema.safeParse(suscriptorId);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: validation.error.errors[0].message
      });
    }

    if (!suscriptorId) {
      return res.status(400).json({
        success: false,
        message: "suscriptorId es requerido"
      });
    }

    // Verificar que el suscriptor existe
    const suscriptor = await db
      .select()
      .from(suscriptores)
      .where(eq(suscriptores.id, suscriptorId))
      .limit(1);

    if (suscriptor.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Suscriptor no encontrado"
      });
    }

    // Usar la función utilitaria para asignar la plantilla
    const result = await asignarPlantillaPUC(suscriptorId);

    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }

  } catch (error) {
    console.error("❌ Error en endpoint asignar-plantilla:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor al asignar plantilla PUC",
      error: error instanceof Error ? error.message : "Error desconocido"
    });
  }
});

// GET /api/plan-cuentas/:suscriptorId
// Obtiene el plan de cuentas de un suscriptor
router.get("/:suscriptorId", async (req: Request, res: Response) => {
  try {
    const db = await getDatabase();
    const { suscriptorId } = req.params;
    const { nivel, tipo, activo = 'true' } = req.query;

    if (!suscriptorId) {
      return res.status(400).json({
        success: false,
        message: "suscriptorId es requerido"
      });
    }

    let query = db
      .select()
      .from(planCuentas)
      .where(eq(planCuentas.suscriptorId, suscriptorId));

    // Filtros opcionales
    if (activo === 'true') {
      // Nota: En Drizzle, necesitaríamos agregar el filtro de activo si es necesario
    }

    if (nivel) {
      // Nota: Filtro por nivel si es necesario
    }

    if (tipo) {
      // Nota: Filtro por tipo si es necesario
    }

    const cuentas = await query;

    res.json({
      success: true,
      data: cuentas,
      total: cuentas.length
    });

  } catch (error) {
    console.error("❌ Error obteniendo plan de cuentas:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error instanceof Error ? error.message : "Error desconocido"
    });
  }
});

// POST /api/plan-cuentas/crear-suscriptor-con-plan
// Crea un nuevo suscriptor y le asigna automáticamente el plan de cuentas
router.post("/crear-suscriptor-con-plan", async (req: Request, res: Response) => {
  try {
    const db = await getDatabase();
    const { nombre, nit, subdominio, emailContacto, direccion, telefono } = req.body;

    if (!nombre || !nit) {
      return res.status(400).json({
        success: false,
        message: "Nombre y NIT son requeridos"
      });
    }

    // Verificar que no exista un suscriptor con el mismo NIT
    const existingSuscriptor = await db
      .select()
      .from(suscriptores)
      .where(eq(suscriptores.nit, nit))
      .limit(1);

    if (existingSuscriptor.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Ya existe un suscriptor con este NIT"
      });
    }

    console.log(`🏗️ Creando suscriptor: ${nombre} (${nit})`);

    // Crear el suscriptor
    const suscriptorId = crypto.randomUUID();

    await db.insert(suscriptores).values({
      id: suscriptorId,
      nombre,
      nit,
      subdominio,
      emailContacto,
      direccion,
      telefono,
      activo: true,
      fechaCreacion: new Date(),
      fechaActualizacion: new Date()
    });

    console.log(`✅ Suscriptor creado con ID: ${suscriptorId}`);

    // Asignar automáticamente el plan de cuentas
    const result = await asignarPlantillaPUC(suscriptorId);

    if (!result.success) {
      // Si falla la asignación del plan, eliminar el suscriptor creado
      await db.delete(suscriptores).where(eq(suscriptores.id, suscriptorId));
      return res.status(500).json({
        success: false,
        message: "Suscriptor creado pero falló la asignación del plan de cuentas",
        error: result.message
      });
    }

    res.status(201).json({
      success: true,
      message: "Suscriptor creado exitosamente con plan de cuentas PUC",
      data: {
        suscriptor: {
          id: suscriptorId,
          nombre,
          nit,
          subdominio,
          emailContacto,
          direccion,
          telefono
        },
        planCuentas: result.data
      }
    });

  } catch (error) {
    console.error("❌ Error creando suscriptor con plan:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error instanceof Error ? error.message : "Error desconocido"
    });
  }
});

// GET /api/plan-cuentas/:suscriptorId/verificar
// Verifica si un suscriptor tiene plan de cuentas asignado
router.get("/:suscriptorId/verificar", async (req: Request, res: Response) => {
  try {
    const { suscriptorId } = req.params;

    if (!suscriptorId) {
      return res.status(400).json({
        success: false,
        message: "suscriptorId es requerido"
      });
    }

    const tienePlan = await suscriptorTienePlanCuentas(suscriptorId);

    res.json({
      success: true,
      data: {
        suscriptorId,
        tienePlanCuentas: tienePlan
      }
    });

  } catch (error) {
    console.error("❌ Error verificando plan de cuentas:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error instanceof Error ? error.message : "Error desconocido"
    });
  }
});
// Obtiene el plan de cuentas en formato jerárquico
router.get("/:suscriptorId/jerarquia", async (req: Request, res: Response) => {
  try {
    const db = await getDatabase();
    const { suscriptorId } = req.params;

    // Validar UUID
    const validation = uuidSchema.safeParse(suscriptorId);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: validation.error.errors[0].message
      });
    }

    if (!suscriptorId) {
      return res.status(400).json({
        success: false,
        message: "suscriptorId es requerido"
      });
    }

    const cuentas = await db
      .select()
      .from(planCuentas)
      .where(eq(planCuentas.suscriptorId, suscriptorId))
      .orderBy(asc(planCuentas.rutaCodigo));

    // Convertir lista plana en árbol
    const map: { [key: string]: any } = {};
    const tree: any[] = [];

    cuentas.forEach((row: any) => {
      row.hijos = [];
      map[row.id] = row;
    });

    cuentas.forEach((row: any) => {
      if (row.padreId && map[row.padreId]) {
        map[row.padreId].hijos.push(row);
      } else {
        tree.push(row);
      }
    });

    res.json({
      success: true,
      data: tree,
      total: cuentas.length
    });

  } catch (error) {
    console.error("❌ Error obteniendo jerarquía:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error instanceof Error ? error.message : "Error desconocido"
    });
  }
});

export default router;