import { useState } from "react";
import { Plus, Search, ChevronRight, ChevronDown, Edit, Trash2, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { usePlanCuentas, type Cuenta } from "@/hooks/use-plan-cuentas";

export default function PlanCuentas() {
  const { cuentas, loading, error, refetch } = usePlanCuentas();
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  // Filtrar cuentas basado en el término de búsqueda
  const filteredCuentas = cuentas.filter(cuenta =>
    cuenta.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cuenta.codigo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Función recursiva para filtrar cuentas incluyendo padres si los hijos coinciden
  const filterCuentasWithParents = (cuentas: Cuenta[], searchTerm: string): Cuenta[] => {
    return cuentas
      .map(cuenta => {
        const matchesSearch = cuenta.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            cuenta.codigo.toLowerCase().includes(searchTerm.toLowerCase());

        const filteredHijos = cuenta.hijos ? filterCuentasWithParents(cuenta.hijos, searchTerm) : [];

        if (matchesSearch || filteredHijos.length > 0) {
          return { ...cuenta, hijos: filteredHijos };
        }

        return null;
      })
      .filter((cuenta): cuenta is Cuenta => cuenta !== null);
  };

  const displayCuentas = searchTerm ? filterCuentasWithParents(cuentas, searchTerm) : cuentas;

  const toggleExpanded = (id: string) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const renderCuenta = (cuenta: Cuenta, depth: number = 0) => {
    const hasChildren = cuenta.hijos && cuenta.hijos.length > 0;
    const isExpanded = expandedItems.has(cuenta.id);
    const paddingLeft = depth * 24;

    return (
      <div key={cuenta.id} data-testid={`cuenta-${cuenta.id}`}>
        <div
          className={`flex items-center gap-2 py-3 px-4 hover-elevate active-elevate-2 rounded-md cursor-pointer ${
            depth === 0 ? "font-semibold" : ""
          }`}
          style={{ paddingLeft: `${paddingLeft + 16}px` }}
          onClick={() => hasChildren && toggleExpanded(cuenta.id)}
        >
          {hasChildren ? (
            isExpanded ? (
              <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
            ) : (
              <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
            )
          ) : (
            <div className="w-4" />
          )}
          <span className="font-mono text-sm min-w-[80px]">{cuenta.codigo}</span>
          <span className="flex-1">{cuenta.nombre}</span>
          <div className="flex gap-2">
            <Badge variant="outline" className="text-xs">
              {cuenta.tipo}
            </Badge>
            {cuenta.naturaleza && (
              <Badge variant={cuenta.naturaleza === 'D' ? 'default' : 'secondary'} className="text-xs">
                {cuenta.naturaleza === 'D' ? 'Débito' : 'Crédito'}
              </Badge>
            )}
            {cuenta.registraTercero && (
              <Badge variant="outline" className="text-xs">
                Tercero
              </Badge>
            )}
          </div>
          {depth > 0 && (
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={(e) => {
                  e.stopPropagation();
                  console.log("Editar cuenta", cuenta.codigo);
                }}
                data-testid={`button-edit-${cuenta.id}`}
              >
                <Edit className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  console.log("Eliminar cuenta", cuenta.codigo);
                }}
                data-testid={`button-delete-${cuenta.id}`}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
        {hasChildren && isExpanded && (
          <div>
            {cuenta.hijos!.map((hijo) => renderCuenta(hijo, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Plan de Cuentas</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Estructura contable jerárquica de la copropiedad
          </p>
        </div>
        <Button data-testid="button-nueva-cuenta" onClick={() => console.log("Nueva cuenta")}>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Cuenta
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por código o nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              data-testid="input-search-cuentas"
            />
          </div>
        </CardHeader>
        <CardContent>
          {loading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              <span>Cargando plan de cuentas...</span>
            </div>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {error}
                <Button
                  variant="outline"
                  size="sm"
                  className="ml-2"
                  onClick={refetch}
                >
                  Reintentar
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {!loading && !error && displayCuentas.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              {searchTerm ? "No se encontraron cuentas que coincidan con la búsqueda." : "No hay cuentas en el plan contable."}
            </div>
          )}

          {!loading && !error && displayCuentas.length > 0 && (
            <div className="space-y-1">
              {displayCuentas.map((cuenta) => renderCuenta(cuenta))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}