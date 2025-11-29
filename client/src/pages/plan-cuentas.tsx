import { useState } from "react";
import { Plus, Search, ChevronRight, ChevronDown, Edit, Trash2, Loader2, AlertCircle, Info, Expand, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { usePlanCuentas, type Cuenta } from "@/hooks/use-plan-cuentas";

interface CuentaNodeProps {
  cuenta: Cuenta;
  depth: number;
  expandedItems: Set<string>;
  onToggle: (id: string) => void;
  onCreate: (parent: Cuenta | null) => void;
  onEdit: (cuenta: Cuenta) => void;
  onDelete: (cuenta: Cuenta) => void;
}

function CuentaNode({ cuenta, depth, expandedItems, onToggle, onCreate, onEdit, onDelete }: CuentaNodeProps) {
  const hasChildren = cuenta.hijos && cuenta.hijos.length > 0;
  const isExpanded = expandedItems.has(cuenta.id);
  const paddingLeft = depth * 20;

  // Iconos por categoría de nivel
  const getIcon = (categoria: string | null) => {
    switch (categoria) {
      case 'clase': return '📘';
      case 'grupo': return '🗂️';
      case 'cuenta': return '💼';
      case 'subcuenta': return '📄';
      case 'auxiliar': return '🔹';
      default: return '📄';
    }
  };

  const getCategoriaColor = (categoria: string | null) => {
    switch (categoria) {
      case 'clase': return 'text-blue-600 font-bold';
      case 'grupo': return 'text-green-600';
      case 'cuenta': return 'text-orange-600';
      case 'subcuenta': return 'text-purple-600';
      case 'auxiliar': return 'text-gray-600';
      default: return 'text-foreground';
    }
  };

  return (
    <div className="relative">
      <div
        className={`flex items-center gap-3 py-2 px-3 hover:bg-accent/50 rounded-md cursor-pointer transition-colors group ${
          depth === 0 ? "bg-muted/20 font-medium" : ""
        }`}
        style={{ paddingLeft: `${paddingLeft + 16}px` }}
        onClick={() => hasChildren && onToggle(cuenta.id)}
      >
        {/* Expand/Collapse */}
        {hasChildren ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggle(cuenta.id);
            }}
            className="flex-shrink-0"
          >
            {isExpanded ? (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            )}
          </button>
        ) : (
          <div className="w-4" />
        )}

        {/* Icono */}
        <span className="text-lg flex-shrink-0">{getIcon(cuenta.categoriaNivel)}</span>

        {/* Código y nombre */}
        <span className="font-mono text-sm text-primary font-medium min-w-[80px]">{cuenta.codigo}</span>
        <span className={`flex-1 ${getCategoriaColor(cuenta.categoriaNivel)}`}>{cuenta.nombre}</span>

        {/* Información adicional */}
        <div className="flex gap-1 flex-wrap">
          <Badge variant="outline" className="text-xs">
            {cuenta.tipo}
          </Badge>
          {cuenta.naturaleza && (
            <Badge variant={cuenta.naturaleza === 'D' ? 'default' : 'secondary'} className="text-xs">
              {cuenta.naturaleza === 'D' ? 'D' : 'C'}
            </Badge>
          )}
          {cuenta.registraTercero && (
            <Badge variant="outline" className="text-xs">
              Tercero
            </Badge>
          )}
        </div>

        {/* Acciones CRUD */}
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 hover:bg-accent"
                onClick={(e) => {
                  e.stopPropagation();
                  onCreate(cuenta);
                }}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Crear subcuenta</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 hover:bg-accent"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(cuenta);
                }}
              >
                <Edit className="h-3 w-3" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Editar cuenta</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-destructive hover:bg-destructive/10"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(cuenta);
                }}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Eliminar cuenta</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* Hijos */}
      {hasChildren && isExpanded && (
        <div className="ml-4 border-l border-border/50 pl-2">
          {cuenta.hijos!.map(child => (
            <CuentaNode
              key={child.id}
              cuenta={child}
              depth={depth + 1}
              expandedItems={expandedItems}
              onToggle={onToggle}
              onCreate={onCreate}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

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

  const expandAll = () => {
    const allIds = new Set<string>();
    const collectIds = (cuentas: Cuenta[]) => {
      cuentas.forEach(cuenta => {
        if (cuenta.hijos && cuenta.hijos.length > 0) {
          allIds.add(cuenta.id);
          collectIds(cuenta.hijos);
        }
      });
    };
    collectIds(displayCuentas);
    setExpandedItems(allIds);
  };

  const collapseAll = () => {
    setExpandedItems(new Set());
  };

  const handleCreate = (parent: Cuenta | null) => {
    console.log("Crear subcuenta para:", parent ? parent.codigo : "raíz");
    // TODO: Implementar modal o navegación para crear cuenta
  };

  const handleEdit = (cuenta: Cuenta) => {
    console.log("Editar cuenta:", cuenta.codigo);
    // TODO: Implementar modal o navegación para editar cuenta
  };

  const handleDelete = (cuenta: Cuenta) => {
    if (confirm(`¿Eliminar la cuenta ${cuenta.codigo} - ${cuenta.nombre}?`)) {
      console.log("Eliminar cuenta:", cuenta.codigo);
      // TODO: Implementar eliminación
    }
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
          <Button onClick={() => handleCreate(null)}>
            <Plus className="mr-2 h-4 w-4" />
            Nueva Cuenta
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por código o nombre..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm" onClick={expandAll}>
                      <Expand className="h-4 w-4 mr-1" />
                      Expandir todo
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Expandir todos los nodos</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm" onClick={collapseAll}>
                      <ChevronUp className="h-4 w-4 mr-1" />
                      Colapsar todo
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Colapsar todos los nodos</p>
                  </TooltipContent>
                </Tooltip>
              </div>
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
                {displayCuentas.map((cuenta) => (
                  <CuentaNode
                    key={cuenta.id}
                    cuenta={cuenta}
                    depth={0}
                    expandedItems={expandedItems}
                    onToggle={toggleExpanded}
                    onCreate={handleCreate}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
}