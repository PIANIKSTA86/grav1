import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function Comprobantes() {
  const [searchTerm, setSearchTerm] = useState("");

  //todo: remove mock functionality
  const comprobantes = [
    {
      id: "1",
      numero: "CE-2024-001",
      fecha: "2024-01-15",
      tipo: "Egreso",
      descripcion: "Pago servicios públicos",
      totalDebito: 850000,
      totalCredito: 850000,
      estado: "contabilizado",
    },
    {
      id: "2",
      numero: "CI-2024-001",
      fecha: "2024-01-15",
      tipo: "Ingreso",
      descripcion: "Recaudo cuotas administración",
      totalDebito: 12500000,
      totalCredito: 12500000,
      estado: "contabilizado",
    },
    {
      id: "3",
      numero: "CE-2024-002",
      fecha: "2024-01-14",
      tipo: "Egreso",
      descripcion: "Mantenimiento general",
      totalDebito: 2100000,
      totalCredito: 2100000,
      estado: "borrador",
    },
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const filteredComprobantes = comprobantes.filter((c) =>
    c.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Comprobantes Contables</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Registro y gestión de comprobantes de contabilidad
          </p>
        </div>
        <Button data-testid="button-nuevo-comprobante">
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Comprobante
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar comprobantes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              data-testid="input-search-comprobantes"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Número</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead className="text-right">Débito</TableHead>
                <TableHead className="text-right">Crédito</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredComprobantes.map((comp) => (
                <TableRow key={comp.id} data-testid={`row-comprobante-${comp.id}`}>
                  <TableCell className="font-mono font-medium">{comp.numero}</TableCell>
                  <TableCell>{comp.fecha}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{comp.tipo}</Badge>
                  </TableCell>
                  <TableCell>{comp.descripcion}</TableCell>
                  <TableCell className="text-right font-mono">{formatCurrency(comp.totalDebito)}</TableCell>
                  <TableCell className="text-right font-mono">{formatCurrency(comp.totalCredito)}</TableCell>
                  <TableCell>
                    <Badge variant={comp.estado === "contabilizado" ? "default" : "secondary"}>
                      {comp.estado}
                    </Badge>
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