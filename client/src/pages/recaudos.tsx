import { useState } from "react";
import { Plus, Search, TrendingUp, DollarSign, Calendar, Home, Wrench, Receipt } from "lucide-react";
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

export function Recaudos() {
  const [searchTerm, setSearchTerm] = useState("");

  //todo: remove mock functionality
  const recaudos = [
    {
      id: "R-001",
      fecha: "2025-11-01",
      tipo: "cuota_administracion",
      concepto: "Cuota Administración - Unidad 101",
      propietario: "María González",
      unidad: "101",
      valor: 350000,
      estado: "pagado",
      fechaPago: "2025-11-01"
    },
    {
      id: "R-002",
      fecha: "2025-11-01",
      tipo: "reserva_espacio",
      concepto: "Reserva Salón Social - Evento Familiar",
      propietario: "Carlos Rodríguez",
      unidad: "205",
      valor: 150000,
      estado: "pagado",
      fechaPago: "2025-10-30"
    },
    {
      id: "R-003",
      fecha: "2025-10-28",
      tipo: "alquiler_local",
      concepto: "Alquiler Local Comercial - Mes Octubre",
      propietario: "Ana López",
      unidad: "LC-01",
      valor: 800000,
      estado: "pendiente",
      fechaPago: null
    },
    {
      id: "R-004",
      fecha: "2025-10-25",
      tipo: "servicio_extra",
      concepto: "Servicio de Limpieza Especial",
      propietario: "Roberto Sánchez",
      unidad: "302",
      valor: 120000,
      estado: "pagado",
      fechaPago: "2025-10-25"
    },
    {
      id: "R-005",
      fecha: "2025-10-20",
      tipo: "cuota_administracion",
      concepto: "Cuota Administración - Unidad 104",
      propietario: "Patricia Díaz",
      unidad: "104",
      valor: 350000,
      estado: "vencido",
      fechaPago: null
    }
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case "cuota_administracion":
        return <Home className="h-4 w-4 text-blue-600" />;
      case "reserva_espacio":
        return <Calendar className="h-4 w-4 text-green-600" />;
      case "alquiler_local":
        return <DollarSign className="h-4 w-4 text-purple-600" />;
      case "servicio_extra":
        return <Wrench className="h-4 w-4 text-orange-600" />;
      default:
        return <Receipt className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTipoLabel = (tipo: string) => {
    switch (tipo) {
      case "cuota_administracion":
        return "Cuota Administración";
      case "reserva_espacio":
        return "Reserva Espacio";
      case "alquiler_local":
        return "Alquiler Local";
      case "servicio_extra":
        return "Servicio Extra";
      default:
        return tipo;
    }
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "pagado":
        return "bg-green-100 text-green-800";
      case "pendiente":
        return "bg-yellow-100 text-yellow-800";
      case "vencido":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredRecaudos = recaudos.filter((r) =>
    r.concepto.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.propietario.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.unidad.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalRecaudado = recaudos
    .filter(r => r.estado === "pagado")
    .reduce((sum, r) => sum + r.valor, 0);

  const totalPendiente = recaudos
    .filter(r => r.estado === "pendiente" || r.estado === "vencido")
    .reduce((sum, r) => sum + r.valor, 0);

  const recaudosPorTipo = recaudos.reduce((acc, r) => {
    if (r.estado === "pagado") {
      acc[r.tipo] = (acc[r.tipo] || 0) + r.valor;
    }
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Recaudos</h1>
          <p className="text-muted-foreground">
            Gestión del recaudo de cartera e ingresos de la copropiedad
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Receipt className="mr-2 h-4 w-4" />
            Generar Recibo
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Recaudo
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Recaudado</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-green-600">
              {formatCurrency(totalRecaudado)}
            </div>
            <p className="text-xs text-muted-foreground">
              Este mes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendiente por Cobrar</CardTitle>
            <DollarSign className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-yellow-600">
              {formatCurrency(totalPendiente)}
            </div>
            <p className="text-xs text-muted-foreground">
              Requiere atención
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cuotas Administración</CardTitle>
            <Home className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-blue-600">
              {formatCurrency(recaudosPorTipo.cuota_administracion || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Recaudado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Otros Ingresos</CardTitle>
            <Receipt className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-purple-600">
              {formatCurrency(
                (recaudosPorTipo.reserva_espacio || 0) +
                (recaudosPorTipo.alquiler_local || 0) +
                (recaudosPorTipo.servicio_extra || 0)
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Reservas, alquileres, servicios
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar recaudos por concepto, propietario o unidad..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="todos">
            <TabsList>
              <TabsTrigger value="todos">Todos</TabsTrigger>
              <TabsTrigger value="pagados">Pagados</TabsTrigger>
              <TabsTrigger value="pendientes">Pendientes</TabsTrigger>
              <TabsTrigger value="vencidos">Vencidos</TabsTrigger>
            </TabsList>

            <TabsContent value="todos" className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Concepto</TableHead>
                    <TableHead>Unidad</TableHead>
                    <TableHead>Propietario</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecaudos.map((recaudo) => (
                    <TableRow key={recaudo.id}>
                      <TableCell>{recaudo.fecha}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getTipoIcon(recaudo.tipo)}
                          <span className="text-sm">{getTipoLabel(recaudo.tipo)}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{recaudo.concepto}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{recaudo.unidad}</Badge>
                      </TableCell>
                      <TableCell>{recaudo.propietario}</TableCell>
                      <TableCell className="text-right font-mono font-medium">
                        {formatCurrency(recaudo.valor)}
                      </TableCell>
                      <TableCell>
                        <Badge className={getEstadoColor(recaudo.estado)}>
                          {recaudo.estado}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="pagados" className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha Pago</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Concepto</TableHead>
                    <TableHead>Unidad</TableHead>
                    <TableHead>Propietario</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecaudos
                    .filter(r => r.estado === "pagado")
                    .map((recaudo) => (
                      <TableRow key={recaudo.id}>
                        <TableCell>{recaudo.fechaPago}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getTipoIcon(recaudo.tipo)}
                            <span className="text-sm">{getTipoLabel(recaudo.tipo)}</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{recaudo.concepto}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{recaudo.unidad}</Badge>
                        </TableCell>
                        <TableCell>{recaudo.propietario}</TableCell>
                        <TableCell className="text-right font-mono font-medium text-green-600">
                          {formatCurrency(recaudo.valor)}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="pendientes" className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha Vencimiento</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Concepto</TableHead>
                    <TableHead>Unidad</TableHead>
                    <TableHead>Propietario</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecaudos
                    .filter(r => r.estado === "pendiente")
                    .map((recaudo) => (
                      <TableRow key={recaudo.id}>
                        <TableCell>{recaudo.fecha}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getTipoIcon(recaudo.tipo)}
                            <span className="text-sm">{getTipoLabel(recaudo.tipo)}</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{recaudo.concepto}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{recaudo.unidad}</Badge>
                        </TableCell>
                        <TableCell>{recaudo.propietario}</TableCell>
                        <TableCell className="text-right font-mono font-medium text-yellow-600">
                          {formatCurrency(recaudo.valor)}
                        </TableCell>
                        <TableCell>
                          <Button size="sm" variant="outline">
                            Registrar Pago
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="vencidos" className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha Vencimiento</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Concepto</TableHead>
                    <TableHead>Unidad</TableHead>
                    <TableHead>Propietario</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecaudos
                    .filter(r => r.estado === "vencido")
                    .map((recaudo) => (
                      <TableRow key={recaudo.id}>
                        <TableCell className="text-red-600 font-medium">{recaudo.fecha}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getTipoIcon(recaudo.tipo)}
                            <span className="text-sm">{getTipoLabel(recaudo.tipo)}</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{recaudo.concepto}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{recaudo.unidad}</Badge>
                        </TableCell>
                        <TableCell>{recaudo.propietario}</TableCell>
                        <TableCell className="text-right font-mono font-medium text-red-600">
                          {formatCurrency(recaudo.valor)}
                        </TableCell>
                        <TableCell>
                          <Button size="sm" variant="destructive">
                            Enviar Recordatorio
                          </Button>
                        </TableCell>
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