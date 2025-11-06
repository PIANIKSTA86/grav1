import { useState } from "react";
import { Plus, Search, MoreHorizontal, Edit, Trash2, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EmptyState } from "@/components/empty-state";

export default function Unidades() {
  const [searchTerm, setSearchTerm] = useState("");

  //todo: remove mock functionality
  const unidades = [
    {
      id: "1",
      codigo: "APT-101",
      tipo: "Apartamento",
      area: 85.5,
      coeficiente: 0.0089,
      propietario: "María González",
      inquilino: null,
      activo: true,
    },
    {
      id: "2",
      codigo: "APT-102",
      tipo: "Apartamento",
      area: 92.0,
      coeficiente: 0.0095,
      propietario: "Carlos Rodríguez",
      inquilino: "Ana Martínez",
      activo: true,
    },
    {
      id: "3",
      codigo: "APT-201",
      tipo: "Apartamento",
      area: 85.5,
      coeficiente: 0.0089,
      propietario: "Luis Hernández",
      inquilino: null,
      activo: true,
    },
    {
      id: "4",
      codigo: "PH-301",
      tipo: "Penthouse",
      area: 150.0,
      coeficiente: 0.0155,
      propietario: "Patricia Silva",
      inquilino: null,
      activo: true,
    },
    {
      id: "5",
      codigo: "PRKG-B01",
      tipo: "Parqueadero",
      area: 12.5,
      coeficiente: 0.0013,
      propietario: "María González",
      inquilino: null,
      activo: true,
    },
  ];

  const filteredUnidades = unidades.filter((u) =>
    u.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.propietario?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const showEmpty = filteredUnidades.length === 0 && searchTerm === "";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Unidades</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gestión de unidades inmobiliarias de la copropiedad
          </p>
        </div>
        <Button data-testid="button-nueva-unidad" onClick={() => console.log("Nueva unidad")}>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Unidad
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por código o propietario..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                data-testid="input-search-unidades"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {showEmpty ? (
            <EmptyState
              icon={Package}
              title="No hay unidades registradas"
              description="Comience registrando la primera unidad de la copropiedad para gestionar propietarios e inquilinos."
              actionLabel="Registrar Unidad"
              onAction={() => console.log("Registrar unidad")}
              testId="empty-unidades"
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Área (m²)</TableHead>
                  <TableHead>Coeficiente</TableHead>
                  <TableHead>Propietario</TableHead>
                  <TableHead>Inquilino</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUnidades.map((unidad) => (
                  <TableRow key={unidad.id} data-testid={`row-unidad-${unidad.id}`}>
                    <TableCell className="font-mono font-medium">{unidad.codigo}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{unidad.tipo}</Badge>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{unidad.area.toFixed(2)}</TableCell>
                    <TableCell className="font-mono text-sm">{unidad.coeficiente.toFixed(4)}</TableCell>
                    <TableCell>{unidad.propietario}</TableCell>
                    <TableCell>
                      {unidad.inquilino ? (
                        <span>{unidad.inquilino}</span>
                      ) : (
                        <span className="text-muted-foreground text-sm">Sin inquilino</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" data-testid={`button-actions-${unidad.id}`}>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => console.log("Editar", unidad.id)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => console.log("Eliminar", unidad.id)} className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}