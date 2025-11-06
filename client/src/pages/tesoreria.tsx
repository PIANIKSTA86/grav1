import { useState } from "react";
import { Plus, Search, TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

export default function Tesoreria() {
  const [searchTerm, setSearchTerm] = useState("");

  //todo: remove mock functionality
  const movimientos = [
    {
      id: "1",
      fecha: "2024-01-15",
      tipo: "ingreso",
      concepto: "Pago Factura FC-2024-001",
      tercero: "María González",
      valor: 1150000,
      saldo: 45230500,
    },
    {
      id: "2",
      fecha: "2024-01-14",
      tipo: "egreso",
      concepto: "Pago Servicios Públicos",
      tercero: "EPM S.A.",
      valor: -850000,
      saldo: 44080500,
    },
    {
      id: "3",
      fecha: "2024-01-13",
      tipo: "ingreso",
      concepto: "Pago Factura FC-2024-005",
      tercero: "Carlos Rodríguez",
      valor: 1250000,
      saldo: 44930500,
    },
    {
      id: "4",
      fecha: "2024-01-12",
      tipo: "egreso",
      concepto: "Mantenimiento Ascensores",
      tercero: "Ascensores XYZ",
      valor: -2100000,
      saldo: 43680500,
    },
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const filteredMovimientos = movimientos.filter((m) =>
    m.concepto.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.tercero.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Tesorería</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gestión de caja y movimientos bancarios
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => console.log("Nuevo egreso")}>
            <TrendingDown className="mr-2 h-4 w-4" />
            Nuevo Egreso
          </Button>
          <Button data-testid="button-nuevo-ingreso" onClick={() => console.log("Nuevo ingreso")}>
            <TrendingUp className="mr-2 h-4 w-4" />
            Nuevo Ingreso
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo Total</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">{formatCurrency(45230500)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos del Mes</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-green-600">{formatCurrency(18500000)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Egresos del Mes</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-red-600">{formatCurrency(12350000)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Flujo Neto</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-green-600">{formatCurrency(6150000)}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar movimientos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                data-testid="input-search-movimientos"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="todos">
            <TabsList>
              <TabsTrigger value="todos">Todos</TabsTrigger>
              <TabsTrigger value="ingresos">Ingresos</TabsTrigger>
              <TabsTrigger value="egresos">Egresos</TabsTrigger>
            </TabsList>
            <TabsContent value="todos" className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Concepto</TableHead>
                    <TableHead>Tercero</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                    <TableHead className="text-right">Saldo</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMovimientos.map((mov) => (
                    <TableRow key={mov.id} data-testid={`row-movimiento-${mov.id}`}>
                      <TableCell>{mov.fecha}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {mov.tipo === "ingreso" ? (
                            <TrendingUp className="h-4 w-4 text-green-600" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-red-600" />
                          )}
                          {mov.concepto}
                        </div>
                      </TableCell>
                      <TableCell>{mov.tercero}</TableCell>
                      <TableCell className={`text-right font-mono font-medium ${mov.tipo === "ingreso" ? "text-green-600" : "text-red-600"}`}>
                        {formatCurrency(Math.abs(mov.valor))}
                      </TableCell>
                      <TableCell className="text-right font-mono">{formatCurrency(mov.saldo)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}