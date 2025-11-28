// Script para limpiar la tabla plan_cuentas
import { getDatabase } from "../server/database";

async function limpiarPlanCuentas() {
  try {
    const db = await getDatabase();

    console.log("🧹 Iniciando limpieza de plan_cuentas...");

    // Contar registros antes de limpiar
    const totalAntesResult = await db.execute('SELECT COUNT(*) as count FROM plan_cuentas');
    const totalAntes = (totalAntesResult[0] as any[])[0].count;
    console.log(`📊 Total de registros antes: ${totalAntes}`);

    // Eliminar TODOS los registros asignados a suscriptores (no plantillas)
    const asignadosResult = await db.execute("SELECT COUNT(*) as count FROM plan_cuentas WHERE suscriptor_id IS NOT NULL");
    const asignados = (asignadosResult[0] as any[])[0].count;
    console.log(`🔍 Registros asignados a suscriptores: ${asignados}`);

    // Eliminar registros asignados a suscriptores
    await db.execute("DELETE FROM plan_cuentas WHERE suscriptor_id IS NOT NULL");
    console.log(`✅ Eliminados ${asignados} registros asignados a suscriptores`);

    // Contar registros después de limpiar
    const totalDespuesResult = await db.execute('SELECT COUNT(*) as count FROM plan_cuentas');
    const totalDespues = (totalDespuesResult[0] as any[])[0].count;
    console.log(`📊 Total de registros después: ${totalDespues}`);

    // Verificar cuentas de plantilla (suscriptor_id IS NULL)
    const plantillaResult = await db.execute('SELECT COUNT(*) as count FROM plan_cuentas WHERE suscriptor_id IS NULL');
    const plantilla = (plantillaResult[0] as any[])[0].count;
    console.log(`🌱 Cuentas de plantilla restantes: ${plantilla}`);

    console.log("🎉 Limpieza completada exitosamente!");

  } catch (error) {
    console.error("❌ Error en la limpieza:", error);
  }
}

limpiarPlanCuentas();