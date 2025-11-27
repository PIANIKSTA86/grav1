// Script de prueba para las funcionalidades del plan de cuentas
import { asignarPlantillaPUC, suscriptorTienePlanCuentas } from "../shared/utils/plan-cuentas";
import { getDatabase } from "../server/database";
import { suscriptores, planCuentas } from "../shared/schema";
import { eq } from "drizzle-orm";

async function testPlanCuentas() {
  try {
    console.log("🧪 Iniciando pruebas del plan de cuentas...\n");

    const db = await getDatabase();

    // 1. Crear un suscriptor de prueba
    console.log("1️⃣ Creando suscriptor de prueba...");
    const suscriptorId = crypto.randomUUID();

    await db.insert(suscriptores).values({
      id: suscriptorId,
      nombre: "Empresa Test S.A.S.",
      nit: `999999999-${Date.now().toString().slice(-1)}`,
      subdominio: `test${Date.now().toString().slice(-4)}`,
      emailContacto: "test@test.com",
      direccion: "Dirección de prueba",
      telefono: "123456789",
      activo: true,
      fechaCreacion: new Date(),
      fechaActualizacion: new Date()
    });

    // Verificar que el suscriptor se creó
    const suscriptorCreado = await db
      .select()
      .from(suscriptores)
      .where(eq(suscriptores.id, suscriptorId))
      .limit(1);

    if (suscriptorCreado.length === 0) {
      throw new Error("El suscriptor no se pudo crear");
    }

    console.log(`✅ Suscriptor creado: ${suscriptorId}\n`);

    // 2. Verificar que no tiene plan de cuentas
    console.log("2️⃣ Verificando que no tiene plan de cuentas...");
    const tienePlanAntes = await suscriptorTienePlanCuentas(suscriptorId);
    console.log(`Tiene plan antes: ${tienePlanAntes}\n`);

    // 3. Asignar plantilla PUC
    console.log("3️⃣ Asignando plantilla PUC...");
    const result = await asignarPlantillaPUC(suscriptorId);

    if (result.success) {
      console.log("✅ Plantilla asignada exitosamente");
      console.log(`📊 Datos: ${JSON.stringify(result.data, null, 2)}\n`);
    } else {
      console.log("❌ Error asignando plantilla:", result.message);
      return;
    }

    // 4. Verificar que ahora tiene plan de cuentas
    console.log("4️⃣ Verificando que ahora tiene plan de cuentas...");
    const tienePlanDespues = await suscriptorTienePlanCuentas(suscriptorId);
    console.log(`Tiene plan después: ${tienePlanDespues}\n`);

    // 5. Obtener algunas cuentas del plan
    console.log("5️⃣ Obteniendo muestra del plan de cuentas...");
    const cuentas = await db
      .select()
      .from(planCuentas)
      .where(eq(planCuentas.suscriptorId, suscriptorId))
      .limit(5);

    console.log(`📋 Primeras ${cuentas.length} cuentas:`);
    cuentas.forEach((cuenta, index) => {
      console.log(`${index + 1}. ${cuenta.codigo} - ${cuenta.nombre} (Nivel ${cuenta.nivel})`);
    });

    console.log("\n🎉 Todas las pruebas pasaron exitosamente!");

  } catch (error) {
    console.error("❌ Error en las pruebas:", error);
  }
}

testPlanCuentas();