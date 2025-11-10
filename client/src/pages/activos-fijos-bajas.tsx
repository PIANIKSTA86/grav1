import { useState } from "react";
import { Plus, Search, Trash2, FileText, AlertTriangle, CheckCircle, XCircle, DollarSign, Calendar, TrendingDown, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

interface BajaActivo {
  id: string;
  activoId: string;
  activoNombre: string;
  tipo: 'venta' | 'deterioro' | 'obsolescencia' | 'robo' | 'otros';
  fechaBaja: string;
  valorContable: number;
  valorVenta?: number;
  perdidaGanancia: number;
  motivo: string;
  responsable: string;
  estado: 'pendiente' | 'aprobado' | 'rechazado' | 'procesado';
  asientoContable?: string;
  observaciones?: string;
  adjuntos: string[];
}

interface RevaluacionActivo {
  id: string;
  activoId: string;
  activoNombre: string;
  fechaRevaluacion: string;
  valorAnterior: number;
  valorNuevo: number;
  ajuste: number;
  motivo: string;
  responsable: string;
  estado: 'pendiente' | 'aprobado' | 'rechazado' | 'procesado';
  asientoContable?: string;
  observaciones?: string;
  adjuntos?: string[];
}

export default function ActivosFijosBajas() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [tipoFilter, setTipoFilter] = useState<string>("todos");
  const [estadoFilter, setEstadoFilter] = useState<string>("todos");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [tipoOperacion, setTipoOperacion] = useState<'baja' | 'revaluacion'>('baja');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-CO");
  };

  const getTipoBajaBadge = (tipo: string) => {
    const colors = {
      'venta': 'bg-green-100 text-green-800',
      'deterioro': 'bg-red-100 text-red-800',
      'obsolescencia': 'bg-yellow-100 text-yellow-800',
      'robo': 'bg-purple-100 text-purple-800',
      'otros': 'bg-gray-100 text-gray-800'
    };
    return <Badge className={colors[tipo as keyof typeof colors] || colors.otros}>{tipo}</Badge>;
  };

  const getEstadoBadge = (estado: string) => {
    const colors = {
      'pendiente': 'bg-yellow-100 text-yellow-800',
      'aprobado': 'bg-blue-100 text-blue-800',
      'rechazado': 'bg-red-100 text-red-800',
      'procesado': 'bg-green-100 text-green-800'
    };
    return <Badge className={colors[estado as keyof typeof colors] || colors.pendiente}>{estado}</Badge>;
  };

  // Datos de ejemplo
  const bajasActivos: BajaActivo[] = [
    {
      id: 'BA-001',
      activoId: 'AF-004',
      activoNombre: 'Computador Portátil Dell',
      tipo: 'deterioro',
      fechaBaja: '2024-09-15',
      valorContable: 2500000,
      valorVenta: 200000,
      perdidaGanancia: -2300000,
      motivo: 'Equipo dañado irreparablemente por caída',
      responsable: 'Jefe de Sistemas',
      estado: 'procesado',
      asientoContable: 'AS-2024-0915-001',
      observaciones: 'Baja por deterioro total. Se recuperó valor residual.',
      adjuntos: ['acta_deterioro.pdf', 'foto_danos.jpg']
    },
    {
      id: 'BA-002',
      activoId: 'AF-005',
      activoNombre: 'Vehículo Chevrolet Spark',
      tipo: 'venta',
      fechaBaja: '2024-10-20',
      valorContable: 15000000,
      valorVenta: 12000000,
      perdidaGanancia: -3000000,
      motivo: 'Venta del vehículo por renovación de flota',
      responsable: 'Gerente Administrativo',
      estado: 'aprobado',
      observaciones: 'Pendiente generación de asiento contable',
      adjuntos: ['contrato_venta.pdf', 'factura_venta.pdf']
    },
    {
      id: 'BA-003',
      activoId: 'AF-006',
      activoNombre: 'Mobiliario Oficina 1',
      tipo: 'obsolescencia',
      fechaBaja: '2024-11-01',
      valorContable: 800000,
      perdidaGanancia: -800000,
      motivo: 'Mobiliario obsoleto, se reemplaza por nuevo',
      responsable: 'Coordinador de Mantenimiento',
      estado: 'pendiente',
      observaciones: 'Requiere aprobación del comité de activos',
      adjuntos: []
    }
  ];

  const revaluacionesActivos: RevaluacionActivo[] = [
    {
      id: 'RV-001',
      activoId: 'AF-001',
      activoNombre: 'Edificio Principal',
      fechaRevaluacion: '2024-06-30',
      valorAnterior: 450000000,
      valorNuevo: 480000000,
      ajuste: 30000000,
      motivo: 'Revaluación por incremento en valor de mercado',
      responsable: 'Contador General',
      estado: 'procesado',
      asientoContable: 'AS-2024-0630-002',
      observaciones: 'Revaluación basada en avalúo profesional'
    },
    {
      id: 'RV-002',
      activoId: 'AF-007',
      activoNombre: 'Terreno Norte',
      fechaRevaluacion: '2024-08-15',
      valorAnterior: 200000000,
      valorNuevo: 250000000,
      ajuste: 50000000,
      motivo: 'Incremento significativo en valor del terreno',
      responsable: 'Gerente Financiero',
      estado: 'aprobado',
      observaciones: 'Pendiente contabilización del ajuste',
      adjuntos: ['avaluo_terreno.pdf']
    }
  ];

  const filteredBajas = bajasActivos.filter(baja => {
    const matchesSearch = baja.activoNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         baja.motivo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         baja.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTipo = tipoFilter === "todos" || baja.tipo === tipoFilter;
    const matchesEstado = estadoFilter === "todos" || baja.estado === estadoFilter;
    return matchesSearch && matchesTipo && matchesEstado;
  });

  const filteredRevaluaciones = revaluacionesActivos.filter(rv => {
    const matchesSearch = rv.activoNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         rv.motivo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         rv.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEstado = estadoFilter === "todos" || rv.estado === estadoFilter;
    return matchesSearch && matchesEstado;
  });

  const handleNuevaOperacion = (tipo: 'baja' | 'revaluacion') => {
    setTipoOperacion(tipo);
    setIsDialogOpen(true);
  };

  const handleGuardarOperacion = () => {
    toast({
      title: `${tipoOperacion === 'baja' ? 'Baja' : 'Revaluación'} registrada`,
      description: `La ${tipoOperacion === 'baja' ? 'baja' : 'revaluación'} ha sido registrada exitosamente.`,
    });
    setIsDialogOpen(false);
  };

  const handleAprobarOperacion = (id: string, tipo: 'baja' | 'revaluacion') => {
    toast({
      title: "Operación aprobada",
      description: `La ${tipo === 'baja' ? 'baja' : 'revaluación'} ${id} ha sido aprobada.`,
    });
  };

  const handleRechazarOperacion = (id: string, tipo: 'baja' | 'revaluacion') => {
    toast({
      title: "Operación rechazada",
      description: `La ${tipo === 'baja' ? 'baja' : 'revaluación'} ${id} ha sido rechazada.`,
    });
  };

  const handleGenerarAsiento = (id: string, tipo: 'baja' | 'revaluacion') => {
    toast({
      title: "Asiento generado",
      description: `El asiento contable para ${tipo === 'baja' ? 'la baja' : 'la revaluación'} ${id} ha sido generado.`,
    });
  };

  const totalBajas = bajasActivos.length;
  const bajasProcesadas = bajasActivos.filter(b => b.estado === 'procesado').length;
  const totalPerdidas = bajasActivos.reduce((sum, b) => sum + Math.abs(b.perdidaGanancia), 0);
  const totalRevaluaciones = revaluacionesActivos.reduce((sum, r) => sum + r.ajuste, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bajas y Revaluaciones</h1>
          <p className="text-muted-foreground">
            Gestión de bajas de activos y revaluaciones contables
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/activos-fijos/catalogo">
            <Button variant="outline">
              Catálogo
            </Button>
          </Link>
          <Link href="/activos-fijos/depreciacion">
            <Button variant="outline">
              Depreciación
            </Button>
          </Link>
          <Link href="/activos-fijos/mtto">
            <Button variant="outline">
              Mantenimiento
            </Button>
          </Link>
          <Link href="/activos-fijos/reportes">
            <Button variant="outline">
              Reportes
            </Button>
          </Link>
          <Link href="/activos-fijos/config">
            <Button variant="outline">
              Configuración
            </Button>
          </Link>
          <Button onClick={() => handleNuevaOperacion('baja')}>
            <Trash2 className="mr-2 h-4 w-4" />
            Nueva Baja
          </Button>
          <Button variant="outline" onClick={() => handleNuevaOperacion('revaluacion')}>
            <TrendingDown className="mr-2 h-4 w-4" />
            Nueva Revaluación
          </Button>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bajas</CardTitle>
            <Trash2 className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBajas}</div>
            <p className="text-xs text-muted-foreground">
              {bajasProcesadas} procesadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pérdidas Totales</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-red-600">{formatCurrency(totalPerdidas)}</div>
            <p className="text-xs text-muted-foreground">
              en bajas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revaluaciones</CardTitle>
            <TrendingDown className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{revaluacionesActivos.length}</div>
            <p className="text-xs text-muted-foreground">
              realizadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ajustes Totales</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-green-600">{formatCurrency(totalRevaluaciones)}</div>
            <p className="text-xs text-muted-foreground">
              en revaluaciones
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por activo, motivo o ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={tipoFilter} onValueChange={setTipoFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Tipo de baja" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los tipos</SelectItem>
                <SelectItem value="venta">Venta</SelectItem>
                <SelectItem value="deterioro">Deterioro</SelectItem>
                <SelectItem value="obsolescencia">Obsolescencia</SelectItem>
                <SelectItem value="robo">Robo</SelectItem>
                <SelectItem value="otros">Otros</SelectItem>
              </SelectContent>
            </Select>
            <Select value={estadoFilter} onValueChange={setEstadoFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los estados</SelectItem>
                <SelectItem value="pendiente">Pendiente</SelectItem>
                <SelectItem value="aprobado">Aprobado</SelectItem>
                <SelectItem value="rechazado">Rechazado</SelectItem>
                <SelectItem value="procesado">Procesado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="bajas" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="bajas">Bajas de Activos</TabsTrigger>
          <TabsTrigger value="revaluaciones">Revaluaciones</TabsTrigger>
        </TabsList>

        <TabsContent value="bajas" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Bajas de Activos ({filteredBajas.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Activo</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Fecha Baja</TableHead>
                    <TableHead>Pérdida/Ganancia</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBajas.map((baja) => (
                    <TableRow key={baja.id}>
                      <TableCell className="font-mono font-medium">{baja.id}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{baja.activoNombre}</p>
                          <p className="text-sm text-muted-foreground">{baja.activoId}</p>
                        </div>
                      </TableCell>
                      <TableCell>{getTipoBajaBadge(baja.tipo)}</TableCell>
                      <TableCell>{getEstadoBadge(baja.estado)}</TableCell>
                      <TableCell>{formatDate(baja.fechaBaja)}</TableCell>
                      <TableCell className={`font-mono font-semibold ${
                        baja.perdidaGanancia < 0 ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {formatCurrency(baja.perdidaGanancia)}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm">
                            <FileText className="h-4 w-4" />
                          </Button>
                          {baja.estado === 'pendiente' && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleAprobarOperacion(baja.id, 'baja')}
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRechazarOperacion(baja.id, 'baja')}
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                          {baja.estado === 'aprobado' && !baja.asientoContable && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleGenerarAsiento(baja.id, 'baja')}
                            >
                              <FileText className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revaluaciones" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Revaluaciones de Activos ({filteredRevaluaciones.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Activo</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Fecha Revaluación</TableHead>
                    <TableHead>Valor Anterior</TableHead>
                    <TableHead>Valor Nuevo</TableHead>
                    <TableHead>Ajuste</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRevaluaciones.map((rv) => (
                    <TableRow key={rv.id}>
                      <TableCell className="font-mono font-medium">{rv.id}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{rv.activoNombre}</p>
                          <p className="text-sm text-muted-foreground">{rv.activoId}</p>
                        </div>
                      </TableCell>
                      <TableCell>{getEstadoBadge(rv.estado)}</TableCell>
                      <TableCell>{formatDate(rv.fechaRevaluacion)}</TableCell>
                      <TableCell className="font-mono">{formatCurrency(rv.valorAnterior)}</TableCell>
                      <TableCell className="font-mono">{formatCurrency(rv.valorNuevo)}</TableCell>
                      <TableCell className="font-mono font-semibold text-green-600">
                        {formatCurrency(rv.ajuste)}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm">
                            <FileText className="h-4 w-4" />
                          </Button>
                          {rv.estado === 'pendiente' && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleAprobarOperacion(rv.id, 'revaluacion')}
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRechazarOperacion(rv.id, 'revaluacion')}
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                          {rv.estado === 'aprobado' && !rv.asientoContable && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleGenerarAsiento(rv.id, 'revaluacion')}
                            >
                              <FileText className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Diálogo de nueva operación */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Nueva {tipoOperacion === 'baja' ? 'Baja de Activo' : 'Revaluación'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {tipoOperacion === 'baja' ? (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="activo">Activo *</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar activo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AF-004">Computador Portátil Dell</SelectItem>
                        <SelectItem value="AF-005">Vehículo Chevrolet Spark</SelectItem>
                        <SelectItem value="AF-006">Mobiliario Oficina 1</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="tipoBaja">Tipo de Baja *</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="venta">Venta</SelectItem>
                        <SelectItem value="deterioro">Deterioro</SelectItem>
                        <SelectItem value="obsolescencia">Obsolescencia</SelectItem>
                        <SelectItem value="robo">Robo</SelectItem>
                        <SelectItem value="otros">Otros</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="fechaBaja">Fecha de Baja *</Label>
                    <Input id="fechaBaja" type="date" />
                  </div>
                  <div>
                    <Label htmlFor="valorContable">Valor Contable</Label>
                    <Input id="valorContable" type="number" placeholder="0" />
                  </div>
                  <div>
                    <Label htmlFor="valorVenta">Valor de Venta (opcional)</Label>
                    <Input id="valorVenta" type="number" placeholder="0" />
                  </div>
                  <div>
                    <Label htmlFor="responsable">Responsable</Label>
                    <Input id="responsable" placeholder="Persona responsable" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="motivo">Motivo de la Baja *</Label>
                  <Textarea id="motivo" placeholder="Describa el motivo de la baja" />
                </div>
              </>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="activoRv">Activo *</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar activo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AF-001">Edificio Principal</SelectItem>
                        <SelectItem value="AF-007">Terreno Norte</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="fechaRevaluacion">Fecha de Revaluación *</Label>
                    <Input id="fechaRevaluacion" type="date" />
                  </div>
                  <div>
                    <Label htmlFor="valorAnterior">Valor Anterior</Label>
                    <Input id="valorAnterior" type="number" placeholder="0" />
                  </div>
                  <div>
                    <Label htmlFor="valorNuevo">Valor Nuevo *</Label>
                    <Input id="valorNuevo" type="number" placeholder="0" />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="responsableRv">Responsable</Label>
                    <Input id="responsableRv" placeholder="Persona responsable" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="motivoRv">Motivo de la Revaluación *</Label>
                  <Textarea id="motivoRv" placeholder="Describa el motivo de la revaluación" />
                </div>
              </>
            )}

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleGuardarOperacion}>
                Registrar {tipoOperacion === 'baja' ? 'Baja' : 'Revaluación'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}