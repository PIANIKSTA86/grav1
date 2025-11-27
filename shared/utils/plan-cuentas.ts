// utils/plan-cuentas.ts
import { getDatabase } from "../../server/database";
import { planCuentas, suscriptores } from "../schema";
import { eq, count } from "drizzle-orm";
import { randomUUID } from "crypto";

/**
 * Asigna la plantilla del PUC a un suscriptor específico
 * Copia todas las cuentas de plantilla (es_plantilla = true) al suscriptor
 */
export async function asignarPlantillaPUC(suscriptorId: string): Promise<{
  success: boolean;
  message: string;
  data?: {
    suscriptorId: string;
    cuentasCopiadas: number;
    plantillasOriginales: number;
  };
  error?: string;
}> {
  try {
    const db = await getDatabase();
    // Verificar que el suscriptor existe
    const suscriptor = await db
      .select()
      .from(suscriptores)
      .where(eq(suscriptores.id, suscriptorId))
      .limit(1);

    if (suscriptor.length === 0) {
      return {
        success: false,
        message: "Suscriptor no encontrado"
      };
    }

    // Verificar que el suscriptor no tenga ya un plan de cuentas asignado
    const existingPlan = await db
      .select()
      .from(planCuentas)
      .where(eq(planCuentas.suscriptorId, suscriptorId))
      .limit(1);

    if (existingPlan.length > 0) {
      return {
        success: false,
        message: "El suscriptor ya tiene un plan de cuentas asignado"
      };
    }

    console.log(`🏗️ Asignando plantilla PUC al suscriptor ${suscriptorId}...`);

    // Obtener todas las plantillas del PUC ordenadas por nivel
    const plantillas = await db
      .select()
      .from(planCuentas)
      .where(eq(planCuentas.esPlantilla, true))
      .orderBy(planCuentas.nivel);

    if (plantillas.length === 0) {
      return {
        success: false,
        message: "No se encontraron plantillas del PUC. Asegúrese de que las plantillas estén cargadas."
      };
    }

    console.log(`📋 Copiando ${plantillas.length} cuentas de plantilla...`);

    // Función helper para verificar si padreId es null
    const isPadreIdNull = (padreId: Buffer | null): boolean => {
      return !padreId || padreId.length === 0;
    };

    // Debug: verificar estructura de plantillas
    console.log(`🔍 Debug: Primeras 3 plantillas:`);
    plantillas.slice(0, 3).forEach((p, i) => {
      console.log(`  ${i + 1}. ${p.codigo} - padreId: ${p.padreId} (isNull: ${isPadreIdNull(p.padreId)})`);
    });

    // Crear mapa de IDs antiguos a nuevos para mantener referencias padre-hijo
    const idMap = new Map<string, string>();

    // Procesar todas las plantillas en orden jerárquico (ordenadas por nivel)
    for (const plantilla of plantillas) {
      const nuevoId = randomUUID();

      // Determinar el nuevo padreId
      let nuevoPadreId = null;
      if (!isPadreIdNull(plantilla.padreId)) {
        const padreIdString = plantilla.padreId!.toString('utf8');
        nuevoPadreId = idMap.get(padreIdString) || null;
        if (!nuevoPadreId) {
          console.warn(`⚠️ Padre no encontrado para cuenta ${plantilla.codigo} (padreId: ${padreIdString}), asignando null...`);
        }
      }

      await db.insert(planCuentas).values({
        id: nuevoId,
        suscriptorId: suscriptorId,
        esPlantilla: false,
        codigo: plantilla.codigo,
        nombre: plantilla.nombre,
        tipo: plantilla.tipo,
        naturaleza: plantilla.naturaleza,
        nivel: plantilla.nivel,
        categoriaNivel: plantilla.categoriaNivel,
        ruta: plantilla.ruta,
        rutaCodigo: plantilla.rutaCodigo,
        padreId: nuevoPadreId,
        registraTercero: plantilla.registraTercero,
        requiereCentroCosto: plantilla.requiereCentroCosto,
        requierePresupuesto: plantilla.requierePresupuesto,
        niifCategoriaId: plantilla.niifCategoriaId,
        pucCategoriaId: plantilla.pucCategoriaId,
        activo: plantilla.activo,
        fechaCreacion: new Date(),
        fechaActualizacion: new Date()
      });

      idMap.set(plantilla.id, nuevoId);
    }

    // Verificar que se copiaron todas las cuentas
    const totalCopiadas = await db
      .select()
      .from(planCuentas)
      .where(eq(planCuentas.suscriptorId, suscriptorId));

    console.log(`✅ Plantilla PUC asignada exitosamente: ${totalCopiadas.length} cuentas copiadas`);

    return {
      success: true,
      message: `Plantilla PUC asignada exitosamente al suscriptor ${suscriptorId}`,
      data: {
        suscriptorId,
        cuentasCopiadas: totalCopiadas.length,
        plantillasOriginales: plantillas.length
      }
    };

  } catch (error) {
    console.error("❌ Error asignando plantilla PUC:", error);
    return {
      success: false,
      message: "Error interno del servidor al asignar plantilla PUC",
      error: error instanceof Error ? error.message : "Error desconocido"
    };
  }
}

/**
 * Verifica si un suscriptor tiene un plan de cuentas asignado
 */
export async function suscriptorTienePlanCuentas(suscriptorId: string): Promise<boolean> {
  try {
    const db = await getDatabase();
    const result = await db
      .select()
      .from(planCuentas)
      .where(eq(planCuentas.suscriptorId, suscriptorId))
      .limit(1);

    return result.length > 0;
  } catch (error) {
    console.error("Error verificando plan de cuentas:", error);
    return false;
  }
}