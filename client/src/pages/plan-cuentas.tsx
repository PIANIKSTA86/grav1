import { useState } from "react";
import { Plus, Search, ChevronRight, ChevronDown, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Cuenta {
  id: string;
  codigo: string;
  nombre: string;
  tipo: string;
  nivel: number;
  hijos?: Cuenta[];
  expanded?: boolean;
}

export default function PlanCuentas() {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set(["1", "2"]));

  //todo: remove mock functionality
  const cuentas: Cuenta[] = [
    {
      id: "1",
      codigo: "1",
      nombre: "ACTIVO",
      tipo: "activo",
      nivel: 1,
      hijos: [
        {
          id: "1.1",
          codigo: "11",
          nombre: "Disponible",
          tipo: "activo",
          nivel: 2,
          hijos: [
            { id: "1.1.1", codigo: "1105", nombre: "Caja", tipo: "activo", nivel: 3 },
            { id: "1.1.2", codigo: "1110", nombre: "Bancos", tipo: "activo", nivel: 3 },
          ],
        },
        {
          id: "1.2",
          codigo: "13",
          nombre: "Deudores",
          tipo: "activo",
          nivel: 2,
          hijos: [
            { id: "1.2.1", codigo: "1305", nombre: "Clientes", tipo: "activo", nivel: 3 },
            { id: "1.2.2", codigo: "1330", nombre: "Anticipos y Avances", tipo: "activo", nivel: 3 },
          ],
        },
      ],
    },
    {
      id: "2",
      codigo: "2",
      nombre: "PASIVO",
      tipo: "pasivo",
      nivel: 1,
      hijos: [
        {
          id: "2.1",
          codigo: "23",
          nombre: "Cuentas por Pagar",
          tipo: "pasivo",
          nivel: 2,
          hijos: [
            { id: "2.1.1", codigo: "2335", nombre: "Costos y Gastos por Pagar", tipo: "pasivo", nivel: 3 },
            { id: "2.1.2", codigo: "2365", nombre: "Retención en la Fuente", tipo: "pasivo", nivel: 3 },
          ],
        },
      ],
    },
    {
      id: "3",
      codigo: "4",
      nombre: "INGRESOS",
      tipo: "ingreso",
      nivel: 1,
      hijos: [
        {
          id: "3.1",
          codigo: "41",
          nombre: "Ingresos Operacionales",
          tipo: "ingreso",
          nivel: 2,
          hijos: [
            { id: "3.1.1", codigo: "4135", nombre: "Cuotas de Administración", tipo: "ingreso", nivel: 3 },
            { id: "3.1.2", codigo: "4155", nombre: "Intereses de Mora", tipo: "ingreso", nivel: 3 },
          ],
        },
      ],
    },
  ];

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
          <Badge variant="outline" className="text-xs">
            {cuenta.tipo}
          </Badge>
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
          <div className="space-y-1">
            {cuentas.map((cuenta) => renderCuenta(cuenta))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}