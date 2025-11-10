import { useState } from "react";
import { Settings, Save, Plus, Trash2, Edit, CheckCircle, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

interface CategoriaActivo {
  id: string;
  nombre: string;
  descripcion: string;
  vidaUtilPredeterminada: number;
  cuentaActivo: string;
  cuentaDepreciacion: string;
  cuentaGasto: string;
  activa: boolean;
}

interface ConfiguracionDepreciacion {
  metodo: 'linea_recta' | 'unidades_producidas' | 'horas_trabajadas';
  periodoCalculo: 'mensual' | 'anual';
  fechaCorte: string;
  generarAsientosAutomaticamente: boolean;
  aprobarAsientosAutomaticamente: boolean;
}

interface ConfiguracionMantenimiento {
  alertasAutomaticas: boolean;
  diasAnticipacionAlerta: number;
  notificacionesEmail: boolean;
  responsablesPorDefecto: string[];
  tiposMantenimiento: TipoMantenimiento[];
}

interface TipoMantenimiento {
  id: string;
  nombre: string;
  descripcion: string;
  frecuenciaDias: number;
  costoEstimado: number;
  requiereProveedorExterno: boolean;
}

interface ConfiguracionBajas {
  requiereAprobacion: boolean;
  aprobadores: string[];
  generarAsientosAutomaticos: boolean;
  tiposBaja: TipoBaja[];
}

interface TipoBaja {
  id: string;
  nombre: string;
  descripcion: string;
  requiereJustificacion: boolean;
  generaPerdida: boolean;
}

export default function ActivosFijosConfig() {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategoria, setEditingCategoria] = useState<CategoriaActivo | null>(null);

  // Configuraciones
  const [configDepreciacion, setConfigDepreciacion] = useState<ConfiguracionDepreciacion>({
    metodo: 'linea_recta',
    periodoCalculo: 'mensual',
    fechaCorte: '2024-12-31',
    generarAsientosAutomaticamente: true,
    aprobarAsientosAutomaticamente: false
  });

  const [configMantenimiento, setConfigMantenimiento] = useState<ConfiguracionMantenimiento>({
    alertasAutomaticas: true,
    diasAnticipacionAlerta: 30,
    notificacionesEmail: true,
    responsablesPorDefecto: ['Jefe de Mantenimiento', 'Coordinador Administrativo'],
    tiposMantenimiento: [
      {
        id: 'TMP-001',
        nombre: 'Preventivo Básico',
        descripcion: 'Mantenimiento preventivo estándar',
        frecuenciaDias: 90,
        costoEstimado: 500000,
        requiereProveedorExterno: false
      },
      {
        id: 'TMP-002',
        nombre: 'Correctivo',
        descripcion: 'Reparación por falla',
        frecuenciaDias: 0,
        costoEstimado: 0,
        requiereProveedorExterno: true
      }
    ]
  });

  const [configBajas, setConfigBajas] = useState<ConfiguracionBajas>({
    requiereAprobacion: true,
    aprobadores: ['Gerente Administrativo', 'Contador General'],
    generarAsientosAutomaticos: true,
    tiposBaja: [
      {
        id: 'TB-001',
        nombre: 'Venta',
        descripcion: 'Baja por venta del activo',
        requiereJustificacion: true,
        generaPerdida: false
      },
      {
        id: 'TB-002',
        nombre: 'Deterioro',
        descripcion: 'Baja por deterioro irreparable',
        requiereJustificacion: true,
        generaPerdida: true
      }
    ]
  });

  const [categoriasActivos, setCategoriasActivos] = useState<CategoriaActivo[]>([
    {
      id: 'CAT-001',
      nombre: 'Edificios',
      descripcion: 'Edificios y construcciones',
      vidaUtilPredeterminada: 20,
      cuentaActivo: '150101 - Edificios',
      cuentaDepreciacion: '240801 - Depreciación Edificios',
      cuentaGasto: '510501 - Gasto Depreciación',
      activa: true
    },
    {
      id: 'CAT-002',
      nombre: 'Vehículos',
      descripcion: 'Vehículos automotores',
      vidaUtilPredeterminada: 5,
      cuentaActivo: '150201 - Vehículos',
      cuentaDepreciacion: '240802 - Depreciación Vehículos',
      cuentaGasto: '510501 - Gasto Depreciación',
      activa: true
    },
    {
      id: 'CAT-003',
      nombre: 'Equipos',
      descripcion: 'Equipos y maquinaria',
      vidaUtilPredeterminada: 10,
      cuentaActivo: '150301 - Equos',
      cuentaDepreciacion: '240803 - Depreciación Equipos',
      cuentaGasto: '510501 - Gasto Depreciación',
      activa: true
    }
  ]);

  const handleGuardarConfiguracion = (seccion: string) => {
    toast({
      title: "Configuración guardada",
      description: `La configuración de ${seccion} ha sido guardada exitosamente.`,
    });
  };

  const handleNuevaCategoria = () => {
    setEditingCategoria(null);
    setIsDialogOpen(true);
  };

  const handleEditarCategoria = (categoria: CategoriaActivo) => {
    setEditingCategoria(categoria);
    setIsDialogOpen(true);
  };

  const handleGuardarCategoria = () => {
    toast({
      title: editingCategoria ? "Categoría actualizada" : "Categoría creada",
      description: `La categoría ha sido ${editingCategoria ? 'actualizada' : 'creada'} exitosamente.`,
    });
    setIsDialogOpen(false);
  };

  const handleEliminarCategoria = (id: string) => {
    toast({
      title: "Categoría eliminada",
      description: "La categoría ha sido eliminada exitosamente.",
    });
  };

  const handleToggleCategoria = (id: string, activa: boolean) => {
    setCategoriasActivos(prev =>
      prev.map(cat =>
        cat.id === id ? { ...cat, activa } : cat
      )
    );
    toast({
      title: activa ? "Categoría activada" : "Categoría desactivada",
      description: `La categoría ha sido ${activa ? 'activada' : 'desactivada'} exitosamente.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Configuración de Activos Fijos</h1>
          <p className="text-muted-foreground">
            Configuración general del módulo de activos fijos
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
        </div>
      </div>

      <Tabs defaultValue="categorias" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="categorias">Categorías</TabsTrigger>
          <TabsTrigger value="depreciacion">Depreciación</TabsTrigger>
          <TabsTrigger value="mantenimiento">Mantenimiento</TabsTrigger>
          <TabsTrigger value="bajas">Bajas</TabsTrigger>
        </TabsList>

        <TabsContent value="categorias" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Categorías de Activos</CardTitle>
                <Button onClick={handleNuevaCategoria}>
                  <Plus className="mr-2 h-4 w-4" />
                  Nueva Categoría
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead>Vida Útil</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categoriasActivos.map((categoria) => (
                    <TableRow key={categoria.id}>
                      <TableCell className="font-medium">{categoria.nombre}</TableCell>
                      <TableCell className="max-w-60 truncate">{categoria.descripcion}</TableCell>
                      <TableCell>{categoria.vidaUtilPredeterminada} años</TableCell>
                      <TableCell>
                        <Badge variant={categoria.activa ? "default" : "secondary"}>
                          {categoria.activa ? "Activa" : "Inactiva"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditarCategoria(categoria)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleCategoria(categoria.id, !categoria.activa)}
                          >
                            {categoria.activa ? <AlertTriangle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEliminarCategoria(categoria.id)}
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
        </TabsContent>

        <TabsContent value="depreciacion" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configuración de Depreciación</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="metodo">Método de Depreciación</Label>
                  <Select
                    value={configDepreciacion.metodo}
                    onValueChange={(value) => setConfigDepreciacion(prev => ({ ...prev, metodo: value as any }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="linea_recta">Línea Recta</SelectItem>
                      <SelectItem value="unidades_producidas">Unidades Producidas</SelectItem>
                      <SelectItem value="horas_trabajadas">Horas Trabajadas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="periodo">Período de Cálculo</Label>
                  <Select
                    value={configDepreciacion.periodoCalculo}
                    onValueChange={(value) => setConfigDepreciacion(prev => ({ ...prev, periodoCalculo: value as any }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mensual">Mensual</SelectItem>
                      <SelectItem value="anual">Anual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="fechaCorte">Fecha de Corte</Label>
                  <Input
                    id="fechaCorte"
                    type="date"
                    value={configDepreciacion.fechaCorte}
                    onChange={(e) => setConfigDepreciacion(prev => ({ ...prev, fechaCorte: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="generarAsientos"
                    checked={configDepreciacion.generarAsientosAutomaticamente}
                    onCheckedChange={(checked) => setConfigDepreciacion(prev => ({ ...prev, generarAsientosAutomaticamente: checked }))}
                  />
                  <Label htmlFor="generarAsientos">Generar asientos contables automáticamente</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="aprobarAsientos"
                    checked={configDepreciacion.aprobarAsientosAutomaticamente}
                    onCheckedChange={(checked) => setConfigDepreciacion(prev => ({ ...prev, aprobarAsientosAutomaticamente: checked }))}
                  />
                  <Label htmlFor="aprobarAsientos">Aprobar asientos automáticamente</Label>
                </div>
              </div>

              <Button onClick={() => handleGuardarConfiguracion('depreciación')}>
                <Save className="mr-2 h-4 w-4" />
                Guardar Configuración
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mantenimiento" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configuración de Mantenimiento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="diasAnticipacion">Días de Anticipación para Alertas</Label>
                  <Input
                    id="diasAnticipacion"
                    type="number"
                    value={configMantenimiento.diasAnticipacionAlerta}
                    onChange={(e) => setConfigMantenimiento(prev => ({ ...prev, diasAnticipacionAlerta: parseInt(e.target.value) }))}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="alertasAuto"
                    checked={configMantenimiento.alertasAutomaticas}
                    onCheckedChange={(checked) => setConfigMantenimiento(prev => ({ ...prev, alertasAutomaticas: checked }))}
                  />
                  <Label htmlFor="alertasAuto">Generar alertas automáticamente</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="notificacionesEmail"
                    checked={configMantenimiento.notificacionesEmail}
                    onCheckedChange={(checked) => setConfigMantenimiento(prev => ({ ...prev, notificacionesEmail: checked }))}
                  />
                  <Label htmlFor="notificacionesEmail">Enviar notificaciones por email</Label>
                </div>
              </div>

              <div>
                <Label>Responsables por Defecto</Label>
                <div className="mt-2 space-y-2">
                  {configMantenimiento.responsablesPorDefecto.map((responsable, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input value={responsable} readOnly />
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Agregar Responsable
                  </Button>
                </div>
              </div>

              <Button onClick={() => handleGuardarConfiguracion('mantenimiento')}>
                <Save className="mr-2 h-4 w-4" />
                Guardar Configuración
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bajas" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configuración de Bajas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="requiereAprobacion"
                  checked={configBajas.requiereAprobacion}
                  onCheckedChange={(checked) => setConfigBajas(prev => ({ ...prev, requiereAprobacion: checked }))}
                />
                <Label htmlFor="requiereAprobacion">Las bajas requieren aprobación</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="generarAsientosBajas"
                  checked={configBajas.generarAsientosAutomaticos}
                  onCheckedChange={(checked) => setConfigBajas(prev => ({ ...prev, generarAsientosAutomaticos: checked }))}
                />
                <Label htmlFor="generarAsientosBajas">Generar asientos contables automáticamente</Label>
              </div>

              <div>
                <Label>Aprobadores</Label>
                <div className="mt-2 space-y-2">
                  {configBajas.aprobadores.map((aprobador, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input value={aprobador} readOnly />
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Agregar Aprobador
                  </Button>
                </div>
              </div>

              <Button onClick={() => handleGuardarConfiguracion('bajas')}>
                <Save className="mr-2 h-4 w-4" />
                Guardar Configuración
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Diálogo de categoría */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingCategoria ? 'Editar Categoría' : 'Nueva Categoría'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nombreCat">Nombre *</Label>
                <Input id="nombreCat" placeholder="Nombre de la categoría" defaultValue={editingCategoria?.nombre} />
              </div>
              <div>
                <Label htmlFor="vidaUtil">Vida Útil Predeterminada (años) *</Label>
                <Input id="vidaUtil" type="number" placeholder="5" defaultValue={editingCategoria?.vidaUtilPredeterminada} />
              </div>
            </div>

            <div>
              <Label htmlFor="descripcionCat">Descripción</Label>
              <Textarea id="descripcionCat" placeholder="Descripción de la categoría" defaultValue={editingCategoria?.descripcion} />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="cuentaActivo">Cuenta Activo</Label>
                <Input id="cuentaActivo" placeholder="150101 - Edificios" defaultValue={editingCategoria?.cuentaActivo} />
              </div>
              <div>
                <Label htmlFor="cuentaDepreciacion">Cuenta Depreciación</Label>
                <Input id="cuentaDepreciacion" placeholder="240801 - Dep. Edificios" defaultValue={editingCategoria?.cuentaDepreciacion} />
              </div>
              <div>
                <Label htmlFor="cuentaGasto">Cuenta Gasto</Label>
                <Input id="cuentaGasto" placeholder="510501 - Gasto Dep." defaultValue={editingCategoria?.cuentaGasto} />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleGuardarCategoria}>
                {editingCategoria ? 'Actualizar' : 'Crear'} Categoría
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}