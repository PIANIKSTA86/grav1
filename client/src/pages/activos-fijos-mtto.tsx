import { useState } from "react";
import { Plus, Search, Wrench, Calendar, User, DollarSign, FileText, CheckCircle, Clock, AlertTriangle, Filter } from "lucide-react";
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

interface Mantenimiento {
  id: string;
  activoId: string;
  activoNombre: string;
  tipo: 'preventivo' | 'correctivo' | 'predictivo' | 'emergencia';
  prioridad: 'baja' | 'media' | 'alta' | 'critica';
  estado: 'programado' | 'en_progreso' | 'completado' | 'cancelado';
  fechaProgramada: string;
  fechaRealizacion?: string;
  descripcion: string;
  responsable: string;
  costoEstimado: number;
  costoReal?: number;
  proveedor?: string;
  observaciones?: string;
  adjuntos: string[];
}

interface ActivoMtto {
  id: string;
  nombre: string;
  categoria: string;
  ultimoMtto: string;
  proximoMtto: string;
  frecuenciaMtto: string;
  mantenimientosPendientes: number;
}

export default function ActivosFijosMtto() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [tipoFilter, setTipoFilter] = useState<string>("todos");
  const [estadoFilter, setEstadoFilter] = useState<string>("todos");
  const [activoSeleccionado, setActivoSeleccionado] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isNuevoMtto, setIsNuevoMtto] = useState(true);

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

  const getTipoBadge = (tipo: string) => {
    const colors = {
      'preventivo': 'bg-blue-100 text-blue-800',
      'correctivo': 'bg-orange-100 text-orange-800',
      'predictivo': 'bg-purple-100 text-purple-800',
      'emergencia': 'bg-red-100 text-red-800'
    };
    return <Badge className={colors[tipo as keyof typeof colors] || colors.correctivo}>{tipo}</Badge>;
  };

  const getPrioridadBadge = (prioridad: string) => {
    const colors = {
      'baja': 'bg-gray-100 text-gray-800',
      'media': 'bg-yellow-100 text-yellow-800',
      'alta': 'bg-orange-100 text-orange-800',
      'critica': 'bg-red-100 text-red-800'
    };
    return <Badge className={colors[prioridad as keyof typeof colors] || colors.media}>{prioridad}</Badge>;
  };

  const getEstadoBadge = (estado: string) => {
    const colors = {
      'programado': 'bg-blue-100 text-blue-800',
      'en_progreso': 'bg-yellow-100 text-yellow-800',
      'completado': 'bg-green-100 text-green-800',
      'cancelado': 'bg-red-100 text-red-800'
    };
    return <Badge className={colors[estado as keyof typeof colors] || colors.programado}>{estado}</Badge>;
  };

  // Datos de ejemplo
  const mantenimientos: Mantenimiento[] = [
    {
      id: 'MT-001',
      activoId: 'AF-003',
      activoNombre: 'Ascensor Principal',
      tipo: 'preventivo',
      prioridad: 'media',
      estado: 'completado',
      fechaProgramada: '2024-10-15',
      fechaRealizacion: '2024-10-15',
      descripcion: 'Mantenimiento preventivo mensual del ascensor',
      responsable: 'Técnico Elevadores S.A.',
      costoEstimado: 500000,
      costoReal: 480000,
      proveedor: 'Técnico Elevadores S.A.',
      observaciones: 'Mantenimiento realizado según programa. Se cambió aceite y se verificaron cables.',
      adjuntos: ['factura_mtto.pdf', 'reporte_tecnico.pdf']
    },
    {
      id: 'MT-002',
      activoId: 'AF-002',
      activoNombre: 'Vehículo Toyota Hilux',
      tipo: 'correctivo',
      prioridad: 'alta',
      estado: 'en_progreso',
      fechaProgramada: '2024-11-10',
      descripcion: 'Reparación de frenos delanteros',
      responsable: 'Mecánico Autorizado',
      costoEstimado: 800000,
      proveedor: 'Taller Central',
      adjuntos: []
    },
    {
      id: 'MT-003',
      activoId: 'AF-001',
      activoNombre: 'Edificio Principal',
      tipo: 'preventivo',
      prioridad: 'baja',
      estado: 'programado',
      fechaProgramada: '2024-12-01',
      descripcion: 'Inspección anual de estructura',
      responsable: 'Ingeniero Estructural',
      costoEstimado: 2000000,
      proveedor: 'Constructora Asociada',
      adjuntos: []
    },
    {
      id: 'MT-004',
      activoId: 'AF-003',
      activoNombre: 'Ascensor Principal',
      tipo: 'emergencia',
      prioridad: 'critica',
      estado: 'completado',
      fechaProgramada: '2024-09-20',
      fechaRealizacion: '2024-09-20',
      descripcion: 'Reparación de puerta atascada',
      responsable: 'Servicio de Emergencia',
      costoEstimado: 300000,
      costoReal: 350000,
      proveedor: 'Técnico Elevadores S.A.',
      observaciones: 'Reparación de emergencia. Costo adicional por repuestos.',
      adjuntos: ['factura_emergencia.pdf']
    }
  ];

  const activosMtto: ActivoMtto[] = [
    {
      id: 'AF-001',
      nombre: 'Edificio Principal',
      categoria: 'edificios',
      ultimoMtto: '2024-06-15',
      proximoMtto: '2024-12-01',
      frecuenciaMtto: 'Anual',
      mantenimientosPendientes: 1
    },
    {
      id: 'AF-002',
      nombre: 'Vehículo Toyota Hilux',
      categoria: 'vehiculos',
      ultimoMtto: '2024-09-15',
      proximoMtto: '2024-11-10',
      frecuenciaMtto: 'Mensual',
      mantenimientosPendientes: 2
    },
    {
      id: 'AF-003',
      nombre: 'Ascensor Principal',
      categoria: 'equipos',
      ultimoMtto: '2024-10-15',
      proximoMtto: '2024-11-15',
      frecuenciaMtto: 'Mensual',
      mantenimientosPendientes: 1
    }
  ];

  const filteredMantenimientos = mantenimientos.filter(mtto => {
    const matchesSearch = mtto.activoNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mtto.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mtto.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTipo = tipoFilter === "todos" || mtto.tipo === tipoFilter;
    const matchesEstado = estadoFilter === "todos" || mtto.estado === estadoFilter;
    const matchesActivo = !activoSeleccionado || mtto.activoId === activoSeleccionado;
    return matchesSearch && matchesTipo && matchesEstado && matchesActivo;
  });

  const handleNuevoMantenimiento = () => {
    setIsNuevoMtto(true);
    setIsDialogOpen(true);
  };

  const handleVerHistorial = (activoId: string) => {
    setActivoSeleccionado(activoId);
    setIsNuevoMtto(false);
    setIsDialogOpen(true);
  };

  const handleGuardarMantenimiento = () => {
    toast({
      title: isNuevoMtto ? "Mantenimiento creado" : "Mantenimiento actualizado",
      description: `El mantenimiento ha sido ${isNuevoMtto ? 'creado' : 'actualizado'} exitosamente.`,
    });
    setIsDialogOpen(false);
  };

  const handleCompletarMantenimiento = (id: string) => {
    toast({
      title: "Mantenimiento completado",
      description: `El mantenimiento ${id} ha sido marcado como completado.`,
    });
  };

  const totalMantenimientos = mantenimientos.length;
  const mantenimientosCompletados = mantenimientos.filter(m => m.estado === 'completado').length;
  const costoTotalEstimado = mantenimientos.reduce((sum, m) => sum + m.costoEstimado, 0);
  const costoTotalReal = mantenimientos.filter(m => m.costoReal).reduce((sum, m) => sum + m.costoReal!, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mantenimiento de Activos Fijos</h1>
          <p className="text-muted-foreground">
            Programación y seguimiento de mantenimientos preventivos y correctivos
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
          <Link href="/activos-fijos/bajas">
            <Button variant="outline">
              Bajas
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
          <Button onClick={handleNuevoMantenimiento}>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Mantenimiento
          </Button>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Mantenimientos</CardTitle>
            <Wrench className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMantenimientos}</div>
            <p className="text-xs text-muted-foreground">
              registrados este año
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completados</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{mantenimientosCompletados}</div>
            <p className="text-xs text-muted-foreground">
              {((mantenimientosCompletados / totalMantenimientos) * 100).toFixed(0)}% del total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Costo Estimado</CardTitle>
            <DollarSign className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">{formatCurrency(costoTotalEstimado)}</div>
            <p className="text-xs text-muted-foreground">
              presupuesto total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Costo Real</CardTitle>
            <DollarSign className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-red-600">{formatCurrency(costoTotalReal)}</div>
            <p className="text-xs text-muted-foreground">
              ejecutado
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
                  placeholder="Buscar por activo, descripción o ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={tipoFilter} onValueChange={setTipoFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Tipo de mantenimiento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los tipos</SelectItem>
                <SelectItem value="preventivo">Preventivo</SelectItem>
                <SelectItem value="correctivo">Correctivo</SelectItem>
                <SelectItem value="predictivo">Predictivo</SelectItem>
                <SelectItem value="emergencia">Emergencia</SelectItem>
              </SelectContent>
            </Select>
            <Select value={estadoFilter} onValueChange={setEstadoFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los estados</SelectItem>
                <SelectItem value="programado">Programado</SelectItem>
                <SelectItem value="en_progreso">En Progreso</SelectItem>
                <SelectItem value="completado">Completado</SelectItem>
                <SelectItem value="cancelado">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="mantenimientos" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="mantenimientos">Mantenimientos</TabsTrigger>
          <TabsTrigger value="activos">Activos por Mantener</TabsTrigger>
        </TabsList>

        <TabsContent value="mantenimientos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Historial de Mantenimientos ({filteredMantenimientos.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Activo</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Prioridad</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Fecha Programada</TableHead>
                    <TableHead>Costo Estimado</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMantenimientos.map((mtto) => (
                    <TableRow key={mtto.id}>
                      <TableCell className="font-mono font-medium">{mtto.id}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{mtto.activoNombre}</p>
                          <p className="text-sm text-muted-foreground">{mtto.activoId}</p>
                        </div>
                      </TableCell>
                      <TableCell>{getTipoBadge(mtto.tipo)}</TableCell>
                      <TableCell>{getPrioridadBadge(mtto.prioridad)}</TableCell>
                      <TableCell>{getEstadoBadge(mtto.estado)}</TableCell>
                      <TableCell>{formatDate(mtto.fechaProgramada)}</TableCell>
                      <TableCell className="font-mono">{formatCurrency(mtto.costoEstimado)}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm">
                            <FileText className="h-4 w-4" />
                          </Button>
                          {mtto.estado !== 'completado' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCompletarMantenimiento(mtto.id)}
                            >
                              <CheckCircle className="h-4 w-4" />
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

        <TabsContent value="activos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Activos Requeridos de Mantenimiento</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Activo</TableHead>
                    <TableHead>Categoría</TableHead>
                    <TableHead>Último Mantenimiento</TableHead>
                    <TableHead>Próximo Mantenimiento</TableHead>
                    <TableHead>Frecuencia</TableHead>
                    <TableHead>Pendientes</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activosMtto.map((activo) => (
                    <TableRow key={activo.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{activo.nombre}</p>
                          <p className="text-sm text-muted-foreground font-mono">{activo.id}</p>
                        </div>
                      </TableCell>
                      <TableCell className="capitalize">{activo.categoria}</TableCell>
                      <TableCell>{formatDate(activo.ultimoMtto)}</TableCell>
                      <TableCell>{formatDate(activo.proximoMtto)}</TableCell>
                      <TableCell>{activo.frecuenciaMtto}</TableCell>
                      <TableCell>
                        <Badge variant={activo.mantenimientosPendientes > 0 ? "destructive" : "secondary"}>
                          {activo.mantenimientosPendientes}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleVerHistorial(activo.id)}
                        >
                          <Clock className="h-4 w-4 mr-1" />
                          Historial
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Diálogo de mantenimiento */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {isNuevoMtto ? 'Nuevo Mantenimiento' : 'Historial de Mantenimiento'}
            </DialogTitle>
          </DialogHeader>

          {isNuevoMtto ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="activo">Activo *</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar activo" />
                    </SelectTrigger>
                    <SelectContent>
                      {activosMtto.map(activo => (
                        <SelectItem key={activo.id} value={activo.id}>
                          {activo.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="tipo">Tipo de Mantenimiento *</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="preventivo">Preventivo</SelectItem>
                      <SelectItem value="correctivo">Correctivo</SelectItem>
                      <SelectItem value="predictivo">Predictivo</SelectItem>
                      <SelectItem value="emergencia">Emergencia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="prioridad">Prioridad *</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar prioridad" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="baja">Baja</SelectItem>
                      <SelectItem value="media">Media</SelectItem>
                      <SelectItem value="alta">Alta</SelectItem>
                      <SelectItem value="critica">Crítica</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="fechaProgramada">Fecha Programada *</Label>
                  <Input id="fechaProgramada" type="date" />
                </div>
                <div>
                  <Label htmlFor="responsable">Responsable</Label>
                  <Input id="responsable" placeholder="Persona o empresa responsable" />
                </div>
                <div>
                  <Label htmlFor="costoEstimado">Costo Estimado</Label>
                  <Input id="costoEstimado" type="number" placeholder="0" />
                </div>
              </div>
              <div>
                <Label htmlFor="descripcion">Descripción *</Label>
                <Textarea id="descripcion" placeholder="Descripción detallada del mantenimiento" />
              </div>
              <div>
                <Label htmlFor="proveedor">Proveedor</Label>
                <Input id="proveedor" placeholder="Empresa proveedora del servicio" />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleGuardarMantenimiento}>
                  Crear Mantenimiento
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-center py-8">
                <Wrench className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-2 text-sm font-semibold">Historial de Mantenimiento</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Mostrando historial completo del activo seleccionado
                </p>
                <div className="mt-4 space-y-2">
                  {mantenimientos
                    .filter(m => m.activoId === activoSeleccionado)
                    .map(mtto => (
                      <div key={mtto.id} className="p-3 border rounded text-left">
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-medium">{mtto.descripcion}</span>
                          {getEstadoBadge(mtto.estado)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {formatDate(mtto.fechaProgramada)} • {formatCurrency(mtto.costoEstimado)}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}