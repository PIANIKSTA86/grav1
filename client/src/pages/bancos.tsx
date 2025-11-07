import { useState } from "react";
import { Plus, Search, Banknote, TrendingUp, PiggyBank, FileText, Calculator, CheckCircle, AlertCircle, Eye, Edit, Trash2 } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function Bancos() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTab, setSelectedTab] = useState("cuentas");
  const [isNewAccountDialogOpen, setIsNewAccountDialogOpen] = useState(false);
  const [isConciliationDialogOpen, setIsConciliationDialogOpen] = useState(false);

  // Mock data for bank accounts
  const cuentasBancarias = [
    {
      id: "CB-001",
      nombre: "Cuenta Corriente Principal",
      banco: "Banco de Bogotá",
      numero: "123-456789-0",
      tipo: "corriente",
      saldo: 125000000,
      disponible: 120000000,
      estado: "activa",
      fechaApertura: "2023-01-15",
      titular: "Conjunto Residencial Grav1"
    },
    {
      id: "CB-002",
      nombre: "Cuenta de Ahorros",
      banco: "Bancolombia",
      numero: "987-654321-9",
      tipo: "ahorros",
      saldo: 75000000,
      disponible: 75000000,
      estado: "activa",
      fechaApertura: "2023-02-20",
      titular: "Conjunto Residencial Grav1"
    },
    {
      id: "CB-003",
      nombre: "Cuenta Nómina",
      banco: "Davivienda",
      numero: "555-123456-7",
      tipo: "corriente",
      saldo: 25000000,
      disponible: 24000000,
      estado: "activa",
      fechaApertura: "2023-03-10",
      titular: "Conjunto Residencial Grav1"
    }
  ];

  // Mock data for CDT's
  const cdts = [
    {
      id: "CDT-001",
      numero: "CDT-2024-001",
      banco: "Banco de Bogotá",
      monto: 50000000,
      tasaInteres: 12.5,
      plazoDias: 365,
      fechaApertura: "2024-01-15",
      fechaVencimiento: "2025-01-15",
      interesesAcumulados: 6250000,
      estado: "activo"
    },
    {
      id: "CDT-002",
      numero: "CDT-2024-002",
      banco: "Bancolombia",
      monto: 30000000,
      tasaInteres: 11.8,
      plazoDias: 180,
      fechaApertura: "2024-06-01",
      fechaVencimiento: "2024-12-01",
      interesesAcumulados: 1770000,
      estado: "activo"
    },
    {
      id: "CDT-003",
      numero: "CDT-2023-001",
      banco: "Davivienda",
      monto: 40000000,
      tasaInteres: 13.2,
      plazoDias: 365,
      fechaApertura: "2023-11-01",
      fechaVencimiento: "2024-11-01",
      interesesAcumulados: 5280000,
      estado: "vencido"
    }
  ];

  // Mock data for funds
  const fondos = [
    {
      id: "FON-001",
      nombre: "Fondo de Reserva",
      tipo: "reserva",
      saldo: 150000000,
      objetivo: 200000000,
      rendimientoAnual: 8.5,
      fechaCreacion: "2023-01-01",
      descripcion: "Fondo para emergencias y mantenimientos mayores"
    },
    {
      id: "FON-002",
      nombre: "Fondo de Contingencia",
      tipo: "contingencia",
      saldo: 50000000,
      objetivo: 100000000,
      rendimientoAnual: 7.2,
      fechaCreacion: "2023-06-01",
      descripcion: "Fondo para imprevistos y situaciones de emergencia"
    },
    {
      id: "FON-003",
      nombre: "Fondo de Mejoramiento",
      tipo: "mejoramiento",
      saldo: 80000000,
      objetivo: 150000000,
      rendimientoAnual: 9.1,
      fechaCreacion: "2024-01-01",
      descripcion: "Fondo para mejoras y ampliaciones del conjunto"
    }
  ];

  // Mock data for bank reconciliation
  const conciliaciones = [
    {
      id: "CONC-001",
      cuentaId: "CB-001",
      cuentaNombre: "Cuenta Corriente Principal",
      fecha: "2024-11-01",
      saldoLibros: 125000000,
      saldoBanco: 124500000,
      diferencia: 500000,
      estado: "pendiente",
      movimientos: [
        { fecha: "2024-10-28", descripcion: "Pago servicios públicos", debito: 850000, credito: 0 },
        { fecha: "2024-10-30", descripcion: "Recaudo cuota ordinaria", debito: 0, credito: 2500000 },
        { fecha: "2024-10-31", descripcion: "Transferencia interna", debito: 500000, credito: 0 }
      ]
    },
    {
      id: "CONC-002",
      cuentaId: "CB-002",
      cuentaNombre: "Cuenta de Ahorros",
      fecha: "2024-10-31",
      saldoLibros: 75000000,
      saldoBanco: 75000000,
      diferencia: 0,
      estado: "conciliado",
      movimientos: []
    }
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const getTipoCuentaColor = (tipo: string) => {
    switch (tipo) {
      case "corriente":
        return "bg-blue-100 text-blue-800";
      case "ahorros":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "activa":
      case "activo":
        return "bg-green-100 text-green-800";
      case "inactiva":
      case "inactivo":
        return "bg-gray-100 text-gray-800";
      case "vencido":
        return "bg-red-100 text-red-800";
      case "conciliado":
        return "bg-green-100 text-green-800";
      case "pendiente":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTipoFondoColor = (tipo: string) => {
    switch (tipo) {
      case "reserva":
        return "bg-purple-100 text-purple-800";
      case "contingencia":
        return "bg-orange-100 text-orange-800";
      case "mejoramiento":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const totalSaldoCuentas = cuentasBancarias
    .filter(c => c.estado === "activa")
    .reduce((sum, c) => sum + c.saldo, 0);

  const totalSaldoCDTs = cdts
    .filter(c => c.estado === "activo")
    .reduce((sum, c) => sum + c.monto + c.interesesAcumulados, 0);

  const totalSaldoFondos = fondos.reduce((sum, f) => sum + f.saldo, 0);

  const conciliacionesPendientes = conciliaciones.filter(c => c.estado === "pendiente").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bancos</h1>
          <p className="text-muted-foreground">
            Gestión de cuentas bancarias, CDT's, fondos y conciliación bancaria
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <FileText className="mr-2 h-4 w-4" />
            Reportes
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nueva Cuenta
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo Total Cuentas</CardTitle>
            <Banknote className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-blue-600">
              {formatCurrency(totalSaldoCuentas)}
            </div>
            <p className="text-xs text-muted-foreground">
              {cuentasBancarias.filter(c => c.estado === "activa").length} cuentas activas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total CDT's</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-green-600">
              {formatCurrency(totalSaldoCDTs)}
            </div>
            <p className="text-xs text-muted-foreground">
              {cdts.filter(c => c.estado === "activo").length} CDT's activos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo Fondos</CardTitle>
            <PiggyBank className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-purple-600">
              {formatCurrency(totalSaldoFondos)}
            </div>
            <p className="text-xs text-muted-foreground">
              {fondos.length} fondos activos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conciliaciones</CardTitle>
            <Calculator className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-orange-600">
              {conciliacionesPendientes}
            </div>
            <p className="text-xs text-muted-foreground">
              pendientes de revisar
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
                placeholder="Buscar cuentas, CDT's o fondos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="cuentas">Cuentas Bancarias</TabsTrigger>
              <TabsTrigger value="cdts">CDT's</TabsTrigger>
              <TabsTrigger value="fondos">Fondos</TabsTrigger>
              <TabsTrigger value="conciliacion">Conciliación</TabsTrigger>
            </TabsList>

            <TabsContent value="cuentas" className="mt-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Cuentas Bancarias</h3>
                <Dialog open={isNewAccountDialogOpen} onOpenChange={setIsNewAccountDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="mr-2 h-4 w-4" />
                      Nueva Cuenta
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Nueva Cuenta Bancaria</DialogTitle>
                      <DialogDescription>
                        Agregue una nueva cuenta bancaria al sistema.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="nombre" className="text-right">
                          Nombre
                        </Label>
                        <Input id="nombre" className="col-span-3" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="banco" className="text-right">
                          Banco
                        </Label>
                        <Select>
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Seleccionar banco" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="bogota">Banco de Bogotá</SelectItem>
                            <SelectItem value="bancolombia">Bancolombia</SelectItem>
                            <SelectItem value="davivienda">Davivienda</SelectItem>
                            <SelectItem value="bbva">BBVA</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="tipo" className="text-right">
                          Tipo
                        </Label>
                        <Select>
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Tipo de cuenta" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="corriente">Corriente</SelectItem>
                            <SelectItem value="ahorros">Ahorros</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="numero" className="text-right">
                          Número
                        </Label>
                        <Input id="numero" className="col-span-3" />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setIsNewAccountDialogOpen(false)}>
                        Cancelar
                      </Button>
                      <Button onClick={() => setIsNewAccountDialogOpen(false)}>
                        Crear Cuenta
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cuenta</TableHead>
                    <TableHead>Banco</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead className="text-right">Saldo</TableHead>
                    <TableHead className="text-right">Disponible</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cuentasBancarias.map((cuenta) => (
                    <TableRow key={cuenta.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{cuenta.nombre}</div>
                          <div className="text-sm text-muted-foreground">{cuenta.numero}</div>
                        </div>
                      </TableCell>
                      <TableCell>{cuenta.banco}</TableCell>
                      <TableCell>
                        <Badge className={getTipoCuentaColor(cuenta.tipo)}>
                          {cuenta.tipo}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-mono font-medium">
                        {formatCurrency(cuenta.saldo)}
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {formatCurrency(cuenta.disponible)}
                      </TableCell>
                      <TableCell>
                        <Badge className={getEstadoColor(cuenta.estado)}>
                          {cuenta.estado}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button size="sm" variant="ghost">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="cdts" className="mt-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Certificados de Depósito a Término</h3>
                <Button size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Nuevo CDT
                </Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Número</TableHead>
                    <TableHead>Banco</TableHead>
                    <TableHead className="text-right">Monto</TableHead>
                    <TableHead className="text-right">Tasa</TableHead>
                    <TableHead>Vencimiento</TableHead>
                    <TableHead className="text-right">Intereses</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cdts.map((cdt) => (
                    <TableRow key={cdt.id}>
                      <TableCell className="font-medium">{cdt.numero}</TableCell>
                      <TableCell>{cdt.banco}</TableCell>
                      <TableCell className="text-right font-mono">
                        {formatCurrency(cdt.monto)}
                      </TableCell>
                      <TableCell className="text-right">{cdt.tasaInteres}%</TableCell>
                      <TableCell>{cdt.fechaVencimiento}</TableCell>
                      <TableCell className="text-right font-mono text-green-600">
                        {formatCurrency(cdt.interesesAcumulados)}
                      </TableCell>
                      <TableCell>
                        <Badge className={getEstadoColor(cdt.estado)}>
                          {cdt.estado}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button size="sm" variant="ghost">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <TrendingUp className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="fondos" className="mt-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Fondos de Inversión</h3>
                <Button size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Nuevo Fondo
                </Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fondo</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead className="text-right">Saldo Actual</TableHead>
                    <TableHead className="text-right">Objetivo</TableHead>
                    <TableHead className="text-right">Rendimiento</TableHead>
                    <TableHead>Progreso</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fondos.map((fondo) => {
                    const progreso = (fondo.saldo / fondo.objetivo) * 100;
                    return (
                      <TableRow key={fondo.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{fondo.nombre}</div>
                            <div className="text-sm text-muted-foreground">{fondo.descripcion}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getTipoFondoColor(fondo.tipo)}>
                            {fondo.tipo}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-mono font-medium">
                          {formatCurrency(fondo.saldo)}
                        </TableCell>
                        <TableCell className="text-right font-mono">
                          {formatCurrency(fondo.objetivo)}
                        </TableCell>
                        <TableCell className="text-right text-green-600">
                          {fondo.rendimientoAnual}%
                        </TableCell>
                        <TableCell>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${Math.min(progreso, 100)}%` }}
                            ></div>
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {progreso.toFixed(1)}%
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button size="sm" variant="ghost">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost">
                              <TrendingUp className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="conciliacion" className="mt-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Conciliación Bancaria</h3>
                <Dialog open={isConciliationDialogOpen} onOpenChange={setIsConciliationDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Calculator className="mr-2 h-4 w-4" />
                      Nueva Conciliación
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                      <DialogTitle>Nueva Conciliación Bancaria</DialogTitle>
                      <DialogDescription>
                        Compare los saldos entre libros y banco para conciliar cuentas.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="cuenta" className="text-right">
                          Cuenta
                        </Label>
                        <Select>
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Seleccionar cuenta" />
                          </SelectTrigger>
                          <SelectContent>
                            {cuentasBancarias.map((cuenta) => (
                              <SelectItem key={cuenta.id} value={cuenta.id}>
                                {cuenta.nombre} - {cuenta.banco}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="fecha" className="text-right">
                          Fecha
                        </Label>
                        <Input id="fecha" type="date" className="col-span-3" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="saldo-libros">Saldo en Libros</Label>
                          <Input id="saldo-libros" type="number" placeholder="0" />
                        </div>
                        <div>
                          <Label htmlFor="saldo-banco">Saldo en Banco</Label>
                          <Input id="saldo-banco" type="number" placeholder="0" />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="observaciones">Observaciones</Label>
                        <Textarea id="observaciones" placeholder="Notas sobre la conciliación..." />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setIsConciliationDialogOpen(false)}>
                        Cancelar
                      </Button>
                      <Button onClick={() => setIsConciliationDialogOpen(false)}>
                        Iniciar Conciliación
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cuenta</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead className="text-right">Saldo Libros</TableHead>
                    <TableHead className="text-right">Saldo Banco</TableHead>
                    <TableHead className="text-right">Diferencia</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {conciliaciones.map((conc) => (
                    <TableRow key={conc.id}>
                      <TableCell className="font-medium">{conc.cuentaNombre}</TableCell>
                      <TableCell>{conc.fecha}</TableCell>
                      <TableCell className="text-right font-mono">
                        {formatCurrency(conc.saldoLibros)}
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {formatCurrency(conc.saldoBanco)}
                      </TableCell>
                      <TableCell className={`text-right font-mono font-medium ${
                        conc.diferencia === 0 ? 'text-green-600' :
                        conc.diferencia > 0 ? 'text-blue-600' : 'text-red-600'
                      }`}>
                        {conc.diferencia === 0 ? '✓' : formatCurrency(Math.abs(conc.diferencia))}
                      </TableCell>
                      <TableCell>
                        <Badge className={getEstadoColor(conc.estado)}>
                          {conc.estado}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button size="sm" variant="ghost">
                            <Eye className="h-4 w-4" />
                          </Button>
                          {conc.estado === "pendiente" && (
                            <Button size="sm" variant="ghost">
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
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