import { useState } from "react";
import { Plus, Search, Edit, Trash2, Eye, Upload, Download, Filter, Package, Calendar, DollarSign, Building, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

interface ActivoFijo {
  id: string;
  codigo: string;
  nombre: string;
  descripcion: string;
  categoria: string;
  ubicacion: string;
  fechaAdquisicion: string;
  valorAdquisicion: number;
  valorActual: number;
  depreciacionAcumulada: number;
  vidaUtil: number;
  vidaUtilRestante: number;
  estado: 'activo' | 'inactivo' | 'dado_de_baja';
  responsable: string;
  fechaUltimoMtto: string;
  adjuntos: Adjunto[];
}

interface Adjunto {
  id: string;
  nombre: string;
  tipo: 'compra' | 'venta' | 'mantenimiento' | 'otro';
  fecha: string;
  url: string;
}

export default function ActivosFijosCatalogo() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoriaFilter, setCategoriaFilter] = useState<string>("todas");
  const [estadoFilter, setEstadoFilter] = useState<string>("todos");
  const [selectedActivo, setSelectedActivo] = useState<ActivoFijo | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

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

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'activo':
        return <Badge className="bg-green-100 text-green-800">Activo</Badge>;
      case 'inactivo':
        return <Badge className="bg-yellow-100 text-yellow-800">Inactivo</Badge>;
      case 'dado_de_baja':
        return <Badge className="bg-red-100 text-red-800">Dado de Baja</Badge>;
      default:
        return <Badge variant="secondary">{estado}</Badge>;
    }
  };

  const getCategoriaBadge = (categoria: string) => {
    const colors = {
      'edificios': 'bg-blue-100 text-blue-800',
      'vehiculos': 'bg-green-100 text-green-800',
      'equipos': 'bg-purple-100 text-purple-800',
      'mobiliario': 'bg-orange-100 text-orange-800',
      'computadores': 'bg-cyan-100 text-cyan-800',
      'otros': 'bg-gray-100 text-gray-800'
    };
    return <Badge className={colors[categoria as keyof typeof colors] || colors.otros}>{categoria}</Badge>;
  };

  // Datos de ejemplo
  const activosFijos: ActivoFijo[] = [
    {
      id: 'AF-001',
      codigo: 'ED-001',
      nombre: 'Edificio Principal',
      descripcion: 'Edificio principal de apartamentos',
      categoria: 'edificios',
      ubicacion: 'Carrera 15 #45-67',
      fechaAdquisicion: '2020-01-15',
      valorAdquisicion: 500000000,
      valorActual: 450000000,
      depreciacionAcumulada: 50000000,
      vidaUtil: 20,
      vidaUtilRestante: 15,
      estado: 'activo',
      responsable: 'Administrador',
      fechaUltimoMtto: '2024-10-15',
      adjuntos: [
        { id: 'ADJ-001', nombre: 'Factura_Compra.pdf', tipo: 'compra', fecha: '2020-01-15', url: '#' },
        { id: 'ADJ-002', nombre: 'Certificado_Valor.pdf', tipo: 'otro', fecha: '2020-01-15', url: '#' }
      ]
    },
    {
      id: 'AF-002',
      codigo: 'VH-001',
      nombre: 'Vehículo Toyota Hilux',
      descripcion: 'Camioneta para mantenimiento',
      categoria: 'vehiculos',
      ubicacion: 'Garaje Principal',
      fechaAdquisicion: '2023-06-10',
      valorAdquisicion: 120000000,
      valorActual: 96000000,
      depreciacionAcumulada: 24000000,
      vidaUtil: 5,
      vidaUtilRestante: 3,
      estado: 'activo',
      responsable: 'Jefe de Mantenimiento',
      fechaUltimoMtto: '2024-11-01',
      adjuntos: [
        { id: 'ADJ-003', nombre: 'Factura_Vehiculo.pdf', tipo: 'compra', fecha: '2023-06-10', url: '#' }
      ]
    },
    {
      id: 'AF-003',
      codigo: 'EQ-001',
      nombre: 'Ascensor Principal',
      descripcion: 'Ascensor marca Otis modelo 2019',
      categoria: 'equipos',
      ubicacion: 'Torre A',
      fechaAdquisicion: '2019-03-20',
      valorAdquisicion: 80000000,
      valorActual: 40000000,
      depreciacionAcumulada: 40000000,
      vidaUtil: 15,
      vidaUtilRestante: 10,
      estado: 'activo',
      responsable: 'Conserje',
      fechaUltimoMtto: '2024-09-15',
      adjuntos: [
        { id: 'ADJ-004', nombre: 'Contrato_Mantenimiento.pdf', tipo: 'mantenimiento', fecha: '2024-09-15', url: '#' }
      ]
    }
  ];

  const filteredActivos = activosFijos.filter(activo => {
    const matchesSearch = activo.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activo.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activo.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategoria = categoriaFilter === "todas" || activo.categoria === categoriaFilter;
    const matchesEstado = estadoFilter === "todos" || activo.estado === estadoFilter;
    return matchesSearch && matchesCategoria && matchesEstado;
  });

  const handleNuevoActivo = () => {
    setSelectedActivo(null);
    setIsEditMode(false);
    setIsDialogOpen(true);
  };

  const handleEditarActivo = (activo: ActivoFijo) => {
    setSelectedActivo(activo);
    setIsEditMode(true);
    setIsDialogOpen(true);
  };

  const handleVerDetalle = (activo: ActivoFijo) => {
    setSelectedActivo(activo);
    setIsEditMode(false);
    setIsDialogOpen(true);
  };

  const handleEliminarActivo = (id: string) => {
    toast({
      title: "Activo eliminado",
      description: `El activo ${id} ha sido eliminado exitosamente.`,
    });
  };

  const handleGuardarActivo = () => {
    toast({
      title: isEditMode ? "Activo actualizado" : "Activo creado",
      description: `El activo ha sido ${isEditMode ? 'actualizado' : 'creado'} exitosamente.`,
    });
    setIsDialogOpen(false);
  };

  const handleAdjuntarDocumento = (activoId: string) => {
    toast({
      title: "Adjuntar documento",
      description: "Funcionalidad de adjuntar documentos próximamente disponible.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Catálogo de Activos Fijos</h1>
          <p className="text-muted-foreground">
            Gestión completa del inventario de activos fijos
          </p>
        </div>
        <div className="flex gap-2">
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
          <Button onClick={handleNuevoActivo}>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Activo
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por código, nombre o descripción..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={categoriaFilter} onValueChange={setCategoriaFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas las categorías</SelectItem>
                <SelectItem value="edificios">Edificios</SelectItem>
                <SelectItem value="vehiculos">Vehículos</SelectItem>
                <SelectItem value="equipos">Equipos</SelectItem>
                <SelectItem value="mobiliario">Mobiliario</SelectItem>
                <SelectItem value="computadores">Computadores</SelectItem>
                <SelectItem value="otros">Otros</SelectItem>
              </SelectContent>
            </Select>
            <Select value={estadoFilter} onValueChange={setEstadoFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los estados</SelectItem>
                <SelectItem value="activo">Activo</SelectItem>
                <SelectItem value="inactivo">Inactivo</SelectItem>
                <SelectItem value="dado_de_baja">Dado de Baja</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de activos */}
      <Card>
        <CardHeader>
          <CardTitle>Activos Fijos ({filteredActivos.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Ubicación</TableHead>
                <TableHead>Valor Actual</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredActivos.map((activo) => (
                <TableRow key={activo.id}>
                  <TableCell className="font-medium font-mono">{activo.codigo}</TableCell>
                  <TableCell>{activo.nombre}</TableCell>
                  <TableCell>{getCategoriaBadge(activo.categoria)}</TableCell>
                  <TableCell className="max-w-32 truncate">{activo.ubicacion}</TableCell>
                  <TableCell className="font-mono font-semibold">{formatCurrency(activo.valorActual)}</TableCell>
                  <TableCell>{getEstadoBadge(activo.estado)}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleVerDetalle(activo)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditarActivo(activo)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleAdjuntarDocumento(activo.id)}
                      >
                        <Upload className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEliminarActivo(activo.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Diálogo de detalle/edición */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isEditMode ? 'Editar Activo' : selectedActivo ? 'Detalle del Activo' : 'Nuevo Activo'}
            </DialogTitle>
          </DialogHeader>

          {selectedActivo && !isEditMode ? (
            // Vista de detalle
            <Tabs defaultValue="general" className="space-y-4">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="depreciacion">Depreciación</TabsTrigger>
                <TabsTrigger value="mantenimiento">Mantenimiento</TabsTrigger>
                <TabsTrigger value="adjuntos">Adjuntos</TabsTrigger>
              </TabsList>

              <TabsContent value="general" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Código</Label>
                    <p className="font-mono font-semibold">{selectedActivo.codigo}</p>
                  </div>
                  <div>
                    <Label>Estado</Label>
                    <div className="mt-1">{getEstadoBadge(selectedActivo.estado)}</div>
                  </div>
                  <div>
                    <Label>Nombre</Label>
                    <p>{selectedActivo.nombre}</p>
                  </div>
                  <div>
                    <Label>Categoría</Label>
                    <div className="mt-1">{getCategoriaBadge(selectedActivo.categoria)}</div>
                  </div>
                  <div className="col-span-2">
                    <Label>Descripción</Label>
                    <p>{selectedActivo.descripcion}</p>
                  </div>
                  <div>
                    <Label>Ubicación</Label>
                    <p>{selectedActivo.ubicacion}</p>
                  </div>
                  <div>
                    <Label>Responsable</Label>
                    <p>{selectedActivo.responsable}</p>
                  </div>
                  <div>
                    <Label>Fecha de Adquisición</Label>
                    <p>{formatDate(selectedActivo.fechaAdquisicion)}</p>
                  </div>
                  <div>
                    <Label>Último Mantenimiento</Label>
                    <p>{formatDate(selectedActivo.fechaUltimoMtto)}</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="depreciacion" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Valor de Adquisición</Label>
                    <p className="font-mono font-semibold text-lg">{formatCurrency(selectedActivo.valorAdquisicion)}</p>
                  </div>
                  <div>
                    <Label>Valor Actual</Label>
                    <p className="font-mono font-semibold text-lg">{formatCurrency(selectedActivo.valorActual)}</p>
                  </div>
                  <div>
                    <Label>Depreciación Acumulada</Label>
                    <p className="font-mono">{formatCurrency(selectedActivo.depreciacionAcumulada)}</p>
                  </div>
                  <div>
                    <Label>Vida Útil Total</Label>
                    <p>{selectedActivo.vidaUtil} años</p>
                  </div>
                  <div>
                    <Label>Vida Útil Restante</Label>
                    <p>{selectedActivo.vidaUtilRestante} años</p>
                  </div>
                  <div>
                    <Label>Porcentaje Depreciado</Label>
                    <p>{((selectedActivo.depreciacionAcumulada / selectedActivo.valorAdquisicion) * 100).toFixed(1)}%</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="mantenimiento" className="space-y-4">
                <div className="text-center py-8">
                  <Package className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-2 text-sm font-semibold">Historial de Mantenimiento</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Ver el historial completo en la sección de Mantenimiento
                  </p>
                  <Link href="/activos-fijos/mtto">
                    <Button className="mt-4">
                      Ir a Mantenimiento
                    </Button>
                  </Link>
                </div>
              </TabsContent>

              <TabsContent value="adjuntos" className="space-y-4">
                <div className="space-y-2">
                  {selectedActivo.adjuntos.map((adjunto) => (
                    <div key={adjunto.id} className="flex items-center justify-between p-3 border rounded">
                      <div className="flex items-center gap-3">
                        <Download className="h-4 w-4" />
                        <div>
                          <p className="font-medium">{adjunto.nombre}</p>
                          <p className="text-sm text-muted-foreground">
                            {adjunto.tipo} • {formatDate(adjunto.fecha)}
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <Button variant="outline" onClick={() => handleAdjuntarDocumento(selectedActivo.id)}>
                  <Upload className="mr-2 h-4 w-4" />
                  Adjuntar Documento
                </Button>
              </TabsContent>
            </Tabs>
          ) : (
            // Formulario de edición/creación
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="codigo">Código *</Label>
                  <Input id="codigo" placeholder="AF-001" defaultValue={selectedActivo?.codigo} />
                </div>
                <div>
                  <Label htmlFor="categoria">Categoría *</Label>
                  <Select defaultValue={selectedActivo?.categoria}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="edificios">Edificios</SelectItem>
                      <SelectItem value="vehiculos">Vehículos</SelectItem>
                      <SelectItem value="equipos">Equipos</SelectItem>
                      <SelectItem value="mobiliario">Mobiliario</SelectItem>
                      <SelectItem value="computadores">Computadores</SelectItem>
                      <SelectItem value="otros">Otros</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2">
                  <Label htmlFor="nombre">Nombre *</Label>
                  <Input id="nombre" placeholder="Nombre del activo" defaultValue={selectedActivo?.nombre} />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="descripcion">Descripción</Label>
                  <Textarea id="descripcion" placeholder="Descripción detallada" defaultValue={selectedActivo?.descripcion} />
                </div>
                <div>
                  <Label htmlFor="ubicacion">Ubicación</Label>
                  <Input id="ubicacion" placeholder="Ubicación física" defaultValue={selectedActivo?.ubicacion} />
                </div>
                <div>
                  <Label htmlFor="responsable">Responsable</Label>
                  <Input id="responsable" placeholder="Persona responsable" defaultValue={selectedActivo?.responsable} />
                </div>
                <div>
                  <Label htmlFor="fechaAdquisicion">Fecha de Adquisición *</Label>
                  <Input id="fechaAdquisicion" type="date" defaultValue={selectedActivo?.fechaAdquisicion} />
                </div>
                <div>
                  <Label htmlFor="valorAdquisicion">Valor de Adquisición *</Label>
                  <Input id="valorAdquisicion" type="number" placeholder="0" defaultValue={selectedActivo?.valorAdquisicion} />
                </div>
                <div>
                  <Label htmlFor="vidaUtil">Vida Útil (años) *</Label>
                  <Input id="vidaUtil" type="number" placeholder="5" defaultValue={selectedActivo?.vidaUtil} />
                </div>
                <div>
                  <Label htmlFor="estado">Estado</Label>
                  <Select defaultValue={selectedActivo?.estado || 'activo'}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="activo">Activo</SelectItem>
                      <SelectItem value="inactivo">Inactivo</SelectItem>
                      <SelectItem value="dado_de_baja">Dado de Baja</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleGuardarActivo}>
                  {isEditMode ? 'Actualizar' : 'Crear'} Activo
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}