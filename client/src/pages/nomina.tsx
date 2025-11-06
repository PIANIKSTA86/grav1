import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/empty-state";
import { UserCog } from "lucide-react";

export default function Nomina() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Nómina</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gestión de nómina de empleados y liquidaciones
          </p>
        </div>
        <Button data-testid="button-nueva-nomina">
          <Plus className="mr-2 h-4 w-4" />
          Nueva Nómina
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <EmptyState
            icon={UserCog}
            title="Módulo de Nómina"
            description="Configure los empleados y períodos de nómina para comenzar a procesar pagos y liquidaciones."
            actionLabel="Configurar Empleados"
            onAction={() => console.log("Configurar empleados")}
            testId="empty-nomina"
          />
        </CardContent>
      </Card>
    </div>
  );
}