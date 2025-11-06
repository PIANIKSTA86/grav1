import { useState } from "react";
import { Plus, Search, MoreHorizontal, Edit, Eye, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Facturacion() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  //todo: remove mock functionality
  const facturas = [
    {
      id: "1",
      numero: "FC-2024-001",
      fecha: "2024-01-15",
      unidad: "APT-101",
      tercero: "María González",
      subtotal: 1150000,
      iva: 0,
      total: 1150000,
      saldo: 0,
      estado: "pagada",
    },
    {
      id: "2",
      numero: "FC-2024-002",
      fecha: "2024-01-15",
      unidad: "APT-102",
      tercero: "Carlos Rodríguez",
      subtotal: 1250000,
      iva: 0,
      total: 1250000,
      saldo: 1250000,
      estado: "pendiente",
    },
    {
      id: "3",
      numero: "FC-2024-003",
      fecha: "2024-01-10",
      unidad: "APT-201",
      tercero: "Luis Hernández",
      subtotal: 1150000,
      iva: 0,
      total: 1150000,
      saldo: 1150000,
      estado: "vencida",
    },
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const getStatusBadge = (estado: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      pagada: "default",
      pendiente: "secondary",
      vencida: "destructive",
    };
    return (
      <Badge variant={variants[estado] || "secondary"}>
        {estado.charAt(0).toUpperCase() + estado.slice(1)}
      </Badge>
    );
  };

  const filteredFacturas = facturas.filter((f) => {
    const matchesSearch = f.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.tercero.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || f.estado === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Facturación</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gestión de facturas de cuotas de administración
          </p>
        </div>
        <Button data-testid="button-nueva-factura" onClick={() => console.log("Nueva factura")}>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Factura
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Facturado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">{formatCurrency(3550000)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pagado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-green-600">{formatCurrency(1150000)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendiente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-orange-600">{formatCurrency(1250000)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vencido</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-red-600">{formatCurrency(1150000)}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4 flex-wrap">
            <div className="relative flex-1 min-w-[250px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por número o tercero..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                data-testid="input-search-facturas"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]" data-testid="select-status-filter">
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="pendiente">Pendiente</SelectItem>
                <SelectItem value="pagada">Pagada</SelectItem>
                <SelectItem value="vencida">Vencida</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Número</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Unidad</TableHead>
                <TableHead>Tercero</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-right">Saldo</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFacturas.map((factura) => (
                <TableRow key={factura.id} data-testid={`row-factura-${factura.id}`}>
                  <TableCell className="font-mono font-medium">{factura.numero}</TableCell>
                  <TableCell>{factura.fecha}</TableCell>
                  <TableCell className="font-mono">{factura.unidad}</TableCell>
                  <TableCell>{factura.tercero}</TableCell>
                  <TableCell className="text-right font-mono">{formatCurrency(factura.total)}</TableCell>
                  <TableCell className="text-right font-mono">{formatCurrency(factura.saldo)}</TableCell>
                  <TableCell>{getStatusBadge(factura.estado)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" data-testid={`button-actions-${factura.id}`}>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => console.log("Ver", factura.id)}>
                          <Eye className="mr-2 h-4 w-4" />
                          Ver Detalle
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => console.log("PDF", factura.id)}>
                          <FileText className="mr-2 h-4 w-4" />
                          Descargar PDF
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => console.log("Editar", factura.id)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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