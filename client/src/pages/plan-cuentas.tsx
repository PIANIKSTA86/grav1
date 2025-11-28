import { useState } from "react";
import { Plus, Search, ChevronRight, ChevronDown, Edit, Trash2, Loader2, AlertCircle, Info, Folder, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { usePlanCuentas, type Cuenta } from "@/hooks/use-plan-cuentas";

export default function PlanCuentas() {
  const { cuentas, loading, error, refetch } = usePlanCuentas();
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const getCategoriaStyles = (categoria: string | null) => {
    switch (categoria) {
      case 'clase':
        return 'font-bold text-blue-600';
      case 'grupo':
        return 'text-green-600';
      case 'cuenta':
        return 'text-orange-600';
      case 'subcuenta':
        return 'text-purple-600';
      case 'auxiliar':
        return 'text-gray-600';
      default:
        return 'text-foreground';
    }
  };

  const getIconColor = (categoria: string | null) => {
    switch (categoria) {
      case 'clase': return 'text-blue-500';
      case 'grupo': return 'text-green-500';
      case 'cuenta': return 'text-orange-500';
      case 'subcuenta': return 'text-purple-500';
      case 'auxiliar': return 'text-gray-500';
      default: return 'text-muted-foreground';
    }
  };

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

  const renderCuenta = (cuenta: Cuenta, depth: number = 0, isLast: boolean = false, parentExpanded: boolean = true) => {
    const hasChildren = cuenta.hijos && cuenta.hijos.length > 0;
    const isExpanded = expandedItems.has(cuenta.id);
    const paddingLeft = depth * 24;

    return (
      <div key={cuenta.id} className="relative group" data-testid={`cuenta-${cuenta.id}`}>
        {/* Líneas de conexión jerárquica */}
        {depth > 0 && (
          <>
            {/* Línea vertical desde el padre */}
            <div
              className="absolute left-0 top-0 w-px bg-border"
              style={{
                left: `${paddingLeft - 12}px`,
                height: '50%',
                top: '0'
              }}
            />
            {/* Línea horizontal al elemento */}
            <div
              className="absolute top-1/2 w-4 h-px bg-border"
              style={{
                left: `${paddingLeft - 12}px`,
                transform: 'translateY(-50%)'
              }}
            />
          </>
        )}

        <div
          className={`flex items-center gap-2 py-3 px-4 hover:bg-accent/50 active:bg-accent rounded-md cursor-pointer transition-colors ${
            depth === 0 ? "font-semibold bg-muted/30" : ""
          }`}
          style={{ paddingLeft: `${paddingLeft + 16}px` }}
          onClick={() => hasChildren && toggleExpanded(cuenta.id)}
        >
          {hasChildren ? (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 p-0 hover:bg-accent"
              onClick={(e) => {
                e.stopPropagation();
                toggleExpanded(cuenta.id);
              }}
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              )}
            </Button>
          ) : (
            <div className="w-6" />
          )}
          {hasChildren ? (
            <Folder className={`h-4 w-4 ${getIconColor(cuenta.categoriaNivel)} shrink-0`} />
          ) : (
            <FileText className={`h-4 w-4 ${getIconColor(cuenta.categoriaNivel)} shrink-0`} />
          )}
          <div className="flex items-center gap-1">
            {Array.from({ length: depth }, (_, i) => (
              <div key={i} className="w-1 h-1 bg-muted-foreground rounded-full" />
            ))}
          </div>
          <span className="font-mono text-sm min-w-[80px] text-primary font-medium">{cuenta.codigo}</span>
          <span className={`flex-1 ${getCategoriaStyles(cuenta.categoriaNivel)}`}>{cuenta.nombre}</span>
          <div className="flex gap-2 flex-wrap">
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant="outline" className="text-xs cursor-help">
                  {cuenta.tipo}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>Tipo de cuenta: {cuenta.tipo}</p>
              </TooltipContent>
            </Tooltip>
            {cuenta.naturaleza && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge variant={cuenta.naturaleza === 'D' ? 'default' : 'secondary'} className="text-xs cursor-help">
                    {cuenta.naturaleza === 'D' ? 'Débito' : 'Crédito'}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Naturaleza: {cuenta.naturaleza === 'D' ? 'Débito' : 'Crédito'}</p>
                </TooltipContent>
              </Tooltip>
            )}
            {cuenta.registraTercero && (
              <Tooltip>
                <TooltipTrigger asChild>
                <Badge variant="outline" className="text-xs cursor-help">
                  Tercero
                </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Registra movimientos con terceros</p>
                </TooltipContent>
              </Tooltip>
            )}
            {cuenta.categoriaNivel && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge variant="outline" className="text-xs cursor-help">
                    {cuenta.categoriaNivel}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Categoría de nivel: {cuenta.categoriaNivel}</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
          {depth > 0 && (
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 hover:bg-accent"
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
                className="h-7 w-7 text-destructive hover:bg-destructive/10"
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
          <div className="relative">
            {/* Línea vertical continua para hijos */}
            <div
              className="absolute left-0 top-0 w-px bg-border"
              style={{
                left: `${paddingLeft + 12}px`,
                height: '100%'
              }}
            />
            {cuenta.hijos!.map((hijo, index) =>
              renderCuenta(hijo, depth + 1, index === cuenta.hijos!.length - 1, isExpanded)
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <TooltipProvider>
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
    </TooltipProvider>
  );
}