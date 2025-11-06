import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/empty-state";
import { Package2 } from "lucide-react";

export default function ActivosFijos() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Activos Fijos</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Registro y control de activos fijos y depreciación
          </p>
        </div>
        <Button data-testid="button-nuevo-activo">
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Activo
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <EmptyState
            icon={Package2}
            title="Módulo de Activos Fijos"
            description="Registre los activos fijos de la copropiedad para llevar control de depreciación y mantenimiento."
            actionLabel="Registrar Activo"
            onAction={() => console.log("Registrar activo")}
            testId="empty-activos"
          />
        </CardContent>
      </Card>
    </div>
  );
}