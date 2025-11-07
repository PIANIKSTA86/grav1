import { useState } from "react";
import { Plus, Search, TrendingDown, CreditCard, Wrench, Users, FileText, Building, Zap } from "lucide-react";
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

export function Pagos() {
  const [searchTerm, setSearchTerm] = useState("");

  //todo: remove mock functionality
  const pagos = [
    {
      id: "P-001",
      fecha: "2025-11-01",
      tipo: "servicios_publicos",
      concepto: "Pago Servicios Públicos - Energía",
      beneficiario: "EPM S.A.",
      categoria: "Servicios Públicos",
      valor: 850000,
      estado: "pagado",
      fechaPago: "2025-11-01",
      metodoPago: "transferencia"
    },
    {
      id: "P-002",
      fecha: "2025-10-30",
      tipo: "mantenimiento",
      concepto: "Mantenimiento Ascensor - Servicio Correctivo",
      beneficiario: "Ascensores XYZ Ltda.",
      categoria: "Mantenimiento",
      valor: 1200000,
      estado: "pagado",
      fechaPago: "2025-10-30",
      metodoPago: "cheque"
    },
    {
      id: "P-003",
      fecha: "2025-10-28",
      tipo: "nomina",
      concepto: "Pago Nómina Administradora - Octubre 2025",
      beneficiario: "María González",
      categoria: "Nómina",
      valor: 2500000,
      estado: "programado",
      fechaPago: "2025-11-05",
      metodoPago: "transferencia"
    },
    {
      id: "P-004",
      fecha: "2025-10-25",
      tipo: "aseo",
      concepto: "Servicio de Aseo y Limpieza - Octubre 2025",
      beneficiario: "Limpieza Total S.A.S.",
      categoria: "Aseo",
      valor: 450000,
      estado: "pagado",
      fechaPago: "2025-10-25",
      metodoPago: "efectivo"
    },
    {
      id: "P-005",
      fecha: "2025-10-20",
      tipo: "administrativos",
      concepto: "Materiales de Oficina y Suministros",
      beneficiario: "Papelería Central",
      categoria: "Administrativos",
      valor: 180000,
      estado: "pagado",
      fechaPago: "2025-10-20",
      metodoPago: "tarjeta"
    },
    {
      id: "P-006",
      fecha: "2025-10-15",
      tipo: "seguridad",
      concepto: "Servicio de Vigilancia - Octubre 2025",
      beneficiario: "Seguridad 24/7 Ltda.",
      categoria: "Seguridad",
      valor: 800000,
      estado: "pendiente",
      fechaPago: null,
      metodoPago: "transferencia"
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
      case "servicios_publicos":
        return <Zap className="h-4 w-4 text-blue-600" />;
      case "mantenimiento":
        return <Wrench className="h-4 w-4 text-orange-600" />;
      case "nomina":
        return <Users className="h-4 w-4 text-green-600" />;
      case "aseo":
        return <Building className="h-4 w-4 text-purple-600" />;
      case "administrativos":
        return <FileText className="h-4 w-4 text-gray-600" />;
      case "seguridad":
        return <Building className="h-4 w-4 text-red-600" />;
      default:
        return <CreditCard className="h-4 w-4 text-gray-600" />;
    }
  };

  const getCategoriaColor = (categoria: string) => {
    switch (categoria) {
      case "Servicios Públicos":
        return "bg-blue-100 text-blue-800";
      case "Mantenimiento":
        return "bg-orange-100 text-orange-800";
      case "Nómina":
        return "bg-green-100 text-green-800";
      case "Aseo":
        return "bg-purple-100 text-purple-800";
      case "Administrativos":
        return "bg-gray-100 text-gray-800";
      case "Seguridad":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "pagado":
        return "bg-green-100 text-green-800";
      case "programado":
        return "bg-blue-100 text-blue-800";
      case "pendiente":
        return "bg-yellow-100 text-yellow-800";
      case "vencido":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getMetodoPagoIcon = (metodo: string) => {
    switch (metodo) {
      case "transferencia":
        return "🏦";
      case "cheque":
        return "📋";
      case "efectivo":
        return "💵";
      case "tarjeta":
        return "💳";
      default:
        return "💰";
    }
  };

  const filteredPagos = pagos.filter((p) =>
    p.concepto.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.beneficiario.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.categoria.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPagado = pagos
    .filter(p => p.estado === "pagado")
    .reduce((sum, p) => sum + p.valor, 0);

  const totalProgramado = pagos
    .filter(p => p.estado === "programado")
    .reduce((sum, p) => sum + p.valor, 0);

  const totalPendiente = pagos
    .filter(p => p.estado === "pendiente" || p.estado === "vencido")
    .reduce((sum, p) => sum + p.valor, 0);

  const pagosPorCategoria = pagos.reduce((acc, p) => {
    if (p.estado === "pagado") {
      acc[p.categoria] = (acc[p.categoria] || 0) + p.valor;
    }
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pagos</h1>
          <p className="text-muted-foreground">
            Gestión de todos los pagos, egresos y salidas de dinero de la copropiedad
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <FileText className="mr-2 h-4 w-4" />
            Generar Comprobante
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Pago
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pagado</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-red-600">
              {formatCurrency(totalPagado)}
            </div>
            <p className="text-xs text-muted-foreground">
              Este mes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pagos Programados</CardTitle>
            <CreditCard className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-blue-600">
              {formatCurrency(totalProgramado)}
            </div>
            <p className="text-xs text-muted-foreground">
              Próximos pagos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pagos Pendientes</CardTitle>
            <TrendingDown className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-yellow-600">
              {formatCurrency(totalPendiente)}
            </div>
            <p className="text-xs text-muted-foreground">
              Requieren atención
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Servicios Públicos</CardTitle>
            <Zap className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-blue-600">
              {formatCurrency(pagosPorCategoria["Servicios Públicos"] || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Energía, agua, gas
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
                placeholder="Buscar pagos por concepto, beneficiario o categoría..."
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
              <TabsTrigger value="programados">Programados</TabsTrigger>
              <TabsTrigger value="pendientes">Pendientes</TabsTrigger>
            </TabsList>

            <TabsContent value="todos" className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Categoría</TableHead>
                    <TableHead>Concepto</TableHead>
                    <TableHead>Beneficiario</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Método</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPagos.map((pago) => (
                    <TableRow key={pago.id}>
                      <TableCell>{pago.fecha}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getTipoIcon(pago.tipo)}
                          <Badge className={getCategoriaColor(pago.categoria)}>
                            {pago.categoria}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{pago.concepto}</TableCell>
                      <TableCell>{pago.beneficiario}</TableCell>
                      <TableCell className="text-right font-mono font-medium text-red-600">
                        {formatCurrency(pago.valor)}
                      </TableCell>
                      <TableCell>
                        <Badge className={getEstadoColor(pago.estado)}>
                          {pago.estado}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="text-lg" title={pago.metodoPago}>
                          {getMetodoPagoIcon(pago.metodoPago)}
                        </span>
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
                    <TableHead>Categoría</TableHead>
                    <TableHead>Concepto</TableHead>
                    <TableHead>Beneficiario</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                    <TableHead>Método</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPagos
                    .filter(p => p.estado === "pagado")
                    .map((pago) => (
                      <TableRow key={pago.id}>
                        <TableCell>{pago.fechaPago}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getTipoIcon(pago.tipo)}
                            <Badge className={getCategoriaColor(pago.categoria)}>
                              {pago.categoria}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{pago.concepto}</TableCell>
                        <TableCell>{pago.beneficiario}</TableCell>
                        <TableCell className="text-right font-mono font-medium text-red-600">
                          {formatCurrency(pago.valor)}
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="text-lg" title={pago.metodoPago}>
                            {getMetodoPagoIcon(pago.metodoPago)}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="programados" className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha Programada</TableHead>
                    <TableHead>Categoría</TableHead>
                    <TableHead>Concepto</TableHead>
                    <TableHead>Beneficiario</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                    <TableHead>Método</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPagos
                    .filter(p => p.estado === "programado")
                    .map((pago) => (
                      <TableRow key={pago.id}>
                        <TableCell className="font-medium text-blue-600">{pago.fechaPago}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getTipoIcon(pago.tipo)}
                            <Badge className={getCategoriaColor(pago.categoria)}>
                              {pago.categoria}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{pago.concepto}</TableCell>
                        <TableCell>{pago.beneficiario}</TableCell>
                        <TableCell className="text-right font-mono font-medium text-red-600">
                          {formatCurrency(pago.valor)}
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="text-lg" title={pago.metodoPago}>
                            {getMetodoPagoIcon(pago.metodoPago)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button size="sm" variant="outline">
                            Ejecutar Pago
                          </Button>
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
                    <TableHead>Categoría</TableHead>
                    <TableHead>Concepto</TableHead>
                    <TableHead>Beneficiario</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                    <TableHead>Método</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPagos
                    .filter(p => p.estado === "pendiente" || p.estado === "vencido")
                    .map((pago) => (
                      <TableRow key={pago.id}>
                        <TableCell className={pago.estado === "vencido" ? "text-red-600 font-medium" : ""}>
                          {pago.fecha}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getTipoIcon(pago.tipo)}
                            <Badge className={getCategoriaColor(pago.categoria)}>
                              {pago.categoria}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{pago.concepto}</TableCell>
                        <TableCell>{pago.beneficiario}</TableCell>
                        <TableCell className="text-right font-mono font-medium text-red-600">
                          {formatCurrency(pago.valor)}
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="text-lg" title={pago.metodoPago}>
                            {getMetodoPagoIcon(pago.metodoPago)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button size="sm" variant={pago.estado === "vencido" ? "destructive" : "outline"}>
                            {pago.estado === "vencido" ? "Pago Urgente" : "Programar Pago"}
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