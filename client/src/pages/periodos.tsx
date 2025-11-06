import { useState } from "react";
import { Plus, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function Periodos() {
  //todo: remove mock functionality
  const periodos = [
    {
      id: "1",
      nombre: "Enero 2024",
      ano: 2024,
      mes: 1,
      fechaInicio: "2024-01-01",
      fechaFin: "2024-01-31",
      estado: "abierto",
    },
    {
      id: "2",
      nombre: "Diciembre 2023",
      ano: 2023,
      mes: 12,
      fechaInicio: "2023-12-01",
      fechaFin: "2023-12-31",
      estado: "cerrado",
      fechaCierre: "2024-01-05",
    },
    {
      id: "3",
      nombre: "Noviembre 2023",
      ano: 2023,
      mes: 11,
      fechaInicio: "2023-11-01",
      fechaFin: "2023-11-30",
      estado: "bloqueado",
      fechaCierre: "2023-12-05",
    },
  ];

  const getEstadoBadge = (estado: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      abierto: "default",
      cerrado: "secondary",
      bloqueado: "destructive",
    };
    return (
      <Badge variant={variants[estado] || "secondary"}>
        {estado.charAt(0).toUpperCase() + estado.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Períodos Contables</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gestión de períodos fiscales y cierre contable
          </p>
        </div>
        <Button data-testid="button-nuevo-periodo">
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Período
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Períodos Fiscales
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Período</TableHead>
                <TableHead>Año</TableHead>
                <TableHead>Mes</TableHead>
                <TableHead>Fecha Inicio</TableHead>
                <TableHead>Fecha Fin</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Fecha Cierre</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {periodos.map((periodo) => (
                <TableRow key={periodo.id} data-testid={`row-periodo-${periodo.id}`}>
                  <TableCell className="font-medium">{periodo.nombre}</TableCell>
                  <TableCell className="font-mono">{periodo.ano}</TableCell>
                  <TableCell className="font-mono">{periodo.mes}</TableCell>
                  <TableCell>{periodo.fechaInicio}</TableCell>
                  <TableCell>{periodo.fechaFin}</TableCell>
                  <TableCell>{getEstadoBadge(periodo.estado)}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {periodo.fechaCierre || "-"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}