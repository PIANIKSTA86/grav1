import { useState } from "react";
import { AlertCircle, Save, ArrowRight, ArrowLeft, Plus, Edit3, Trash2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";

interface Novedad {
  id: string;
  tipo: 'incapacidad' | 'licencia' | 'bonificacion' | 'sancion' | 'permiso' | 'vacaciones';
  fechaInicio: string;
  fechaFin: string;
  dias: number;
  valor: number;
  descripcion: string;
  soporte: string;
  estado: 'activa' | 'finalizada' | 'cancelada';
}

interface EmpleadoNovedades {
  id: string;
  nombre: string;
  apellido: string;
  cargo: string;
  novedades: Novedad[];
  totalDiasIncapacidad: number;
  totalDiasLicencia: number;
  totalBonificaciones: number;
}

export default function NominaNovedades() {
  const { toast } = useToast();
  const [novedadesEditando, setNovedadesEditando] = useState<EmpleadoNovedades | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [nuevaNovedad, setNuevaNovedad] = useState({
    tipo: 'incapacidad' as Novedad['tipo'],
    fechaInicio: '',
    fechaFin: '',
    valor: 0,
    descripcion: '',
    soporte: ''
  });

  // Datos de ejemplo
  const [empleadosNovedades, setEmpleadosNovedades] = useState<EmpleadoNovedades[]>([
    {
      id: 'EMP-001',
      nombre: 'María',
      apellido: 'González',
      cargo: 'Administradora',
      novedades: [
        {
          id: 'NOV-001',
          tipo: 'bonificacion',
          fechaInicio: '2024-11-01',
          fechaFin: '2024-11-01',
          dias: 1,
          valor: 50000,
          descripcion: 'Bonificación por desempeño excepcional',
          soporte: 'bonificacion-nov-2024.pdf',
          estado: 'activa'
        }
      ],
      totalDiasIncapacidad: 0,
      totalDiasLicencia: 0,
      totalBonificaciones: 50000
    },
    {
      id: 'EMP-002',
      nombre: 'Carlos',
      apellido: 'Rodríguez',
      cargo: 'Conserje',
      novedades: [
        {
          id: 'NOV-002',
          tipo: 'incapacidad',
          fechaInicio: '2024-11-05',
          fechaFin: '2024-11-10',
          dias: 6,
          valor: 0,
          descripcion: 'Incapacidad médica por gripe',
          soporte: 'incapacidad-carlos-2024.pdf',
          estado: 'activa'
        }
      ],
      totalDiasIncapacidad: 6,
      totalDiasLicencia: 0,
      totalBonificaciones: 0
    },
    {
      id: 'EMP-003',
      nombre: 'Ana',
      apellido: 'López',
      cargo: 'Auxiliar de Limpieza',
      novedades: [],
      totalDiasIncapacidad: 0,
      totalDiasLicencia: 0,
      totalBonificaciones: 0
    }
  ]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getTipoNovedadBadge = (tipo: string) => {
    switch (tipo) {
      case 'incapacidad':
        return <Badge className="bg-red-100 text-red-800">Incapacidad</Badge>;
      case 'licencia':
        return <Badge className="bg-yellow-100 text-yellow-800">Licencia</Badge>;
      case 'bonificacion':
        return <Badge className="bg-green-100 text-green-800">Bonificación</Badge>;
      case 'sancion':
        return <Badge className="bg-gray-100 text-gray-800">Sanción</Badge>;
      case 'permiso':
        return <Badge className="bg-blue-100 text-blue-800">Permiso</Badge>;
      case 'vacaciones':
        return <Badge className="bg-purple-100 text-purple-800">Vacaciones</Badge>;
      default:
        return <Badge variant="secondary">{tipo}</Badge>;
    }
  };

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'activa':
        return <Badge className="bg-green-100 text-green-800">Activa</Badge>;
      case 'finalizada':
        return <Badge className="bg-blue-100 text-blue-800">Finalizada</Badge>;
      case 'cancelada':
        return <Badge className="bg-red-100 text-red-800">Cancelada</Badge>;
      default:
        return <Badge variant="secondary">{estado}</Badge>;
    }
  };

  const calcularDiasEntreFechas = (fechaInicio: string, fechaFin: string) => {
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    const diffTime = Math.abs(fin.getTime() - inicio.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  const handleEditarNovedades = (empleado: EmpleadoNovedades) => {
    setNovedadesEditando({ ...empleado });
    setDialogOpen(true);
  };

  const handleAgregarNovedad = () => {
    if (!novedadesEditando || !nuevaNovedad.fechaInicio || !nuevaNovedad.fechaFin) {
      toast({
        title: "Error",
        description: "Por favor complete todos los campos requeridos.",
        variant: "destructive",
      });
      return;
    }

    const dias = calcularDiasEntreFechas(nuevaNovedad.fechaInicio, nuevaNovedad.fechaFin);

    const novedad: Novedad = {
      id: `NOV-${Date.now()}`,
      ...nuevaNovedad,
      dias,
      estado: 'activa'
    };

    const empleadoActualizado = {
      ...novedadesEditando,
      novedades: [...novedadesEditando.novedades, novedad]
    };

    // Recalcular totales
    empleadoActualizado.totalDiasIncapacidad = empleadoActualizado.novedades
      .filter(n => n.tipo === 'incapacidad' && n.estado === 'activa')
      .reduce((sum, n) => sum + n.dias, 0);

    empleadoActualizado.totalDiasLicencia = empleadoActualizado.novedades
      .filter(n => n.tipo === 'licencia' && n.estado === 'activa')
      .reduce((sum, n) => sum + n.dias, 0);

    empleadoActualizado.totalBonificaciones = empleadoActualizado.novedades
      .filter(n => n.tipo === 'bonificacion' && n.estado === 'activa')
      .reduce((sum, n) => sum + n.valor, 0);

    setEmpleadosNovedades(prev =>
      prev.map(emp => emp.id === novedadesEditando.id ? empleadoActualizado : emp)
    );

    setNovedadesEditando(empleadoActualizado);

    // Resetear formulario
    setNuevaNovedad({
      tipo: 'incapacidad',
      fechaInicio: '',
      fechaFin: '',
      valor: 0,
      descripcion: '',
      soporte: ''
    });

    toast({
      title: "Novedad agregada",
      description: "La novedad ha sido registrada exitosamente.",
    });
  };

  const handleEliminarNovedad = (novedadId: string) => {
    if (!novedadesEditando) return;

    const empleadoActualizado = {
      ...novedadesEditando,
      novedades: novedadesEditando.novedades.filter(n => n.id !== novedadId)
    };

    // Recalcular totales
    empleadoActualizado.totalDiasIncapacidad = empleadoActualizado.novedades
      .filter(n => n.tipo === 'incapacidad' && n.estado === 'activa')
      .reduce((sum, n) => sum + n.dias, 0);

    empleadoActualizado.totalDiasLicencia = empleadoActualizado.novedades
      .filter(n => n.tipo === 'licencia' && n.estado === 'activa')
      .reduce((sum, n) => sum + n.dias, 0);

    empleadoActualizado.totalBonificaciones = empleadoActualizado.novedades
      .filter(n => n.tipo === 'bonificacion' && n.estado === 'activa')
      .reduce((sum, n) => sum + n.valor, 0);

    setEmpleadosNovedades(prev =>
      prev.map(emp => emp.id === novedadesEditando.id ? empleadoActualizado : emp)
    );

    setNovedadesEditando(empleadoActualizado);
  };

  const handleGuardarCambios = () => {
    if (!novedadesEditando) return;

    setEmpleadosNovedades(prev =>
      prev.map(emp => emp.id === novedadesEditando.id ? novedadesEditando : emp)
    );

    toast({
      title: "Cambios guardados",
      description: `Las novedades de ${novedadesEditando.nombre} ${novedadesEditando.apellido} han sido actualizadas.`,
    });

    setDialogOpen(false);
    setNovedadesEditando(null);
  };

  const totalIncapacidades = empleadosNovedades.reduce((sum, emp) => sum + emp.totalDiasIncapacidad, 0);
  const totalLicencias = empleadosNovedades.reduce((sum, emp) => sum + emp.totalDiasLicencia, 0);
  const totalBonificaciones = empleadosNovedades.reduce((sum, emp) => sum + emp.totalBonificaciones, 0);
  const totalNovedades = empleadosNovedades.reduce((sum, emp) => sum + emp.novedades.length, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Registro de Novedades</h1>
          <p className="text-muted-foreground">
            Registre incapacidades, licencias, bonificaciones y otras novedades
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/nomina/horas">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver
            </Button>
          </Link>
          <Link href="/nomina/calculo">
            <Button>
              Continuar
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Estadísticas de novedades */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Novedades</CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-blue-600">{totalNovedades}</div>
            <p className="text-xs text-muted-foreground">
              registros activos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Días Incapacidad</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-red-600">{totalIncapacidades}</div>
            <p className="text-xs text-muted-foreground">
              días totales
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Días Licencia</CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-yellow-600">{totalLicencias}</div>
            <p className="text-xs text-muted-foreground">
              días totales
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bonificaciones</CardTitle>
            <span className="text-green-600 font-bold">$</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-green-600">
              {formatCurrency(totalBonificaciones)}
            </div>
            <p className="text-xs text-muted-foreground">
              valor total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabla de empleados con novedades */}
      <Card>
        <CardHeader>
          <CardTitle>Novedades por Empleado</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Empleado</TableHead>
                <TableHead>Cargo</TableHead>
                <TableHead>Días Incapacidad</TableHead>
                <TableHead>Días Licencia</TableHead>
                <TableHead>Bonificaciones</TableHead>
                <TableHead>Total Novedades</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {empleadosNovedades.map((empleado) => (
                <TableRow key={empleado.id}>
                  <TableCell className="font-medium">
                    {empleado.nombre} {empleado.apellido}
                  </TableCell>
                  <TableCell>{empleado.cargo}</TableCell>
                  <TableCell className="font-mono">{empleado.totalDiasIncapacidad}</TableCell>
                  <TableCell className="font-mono">{empleado.totalDiasLicencia}</TableCell>
                  <TableCell className="font-mono">{formatCurrency(empleado.totalBonificaciones)}</TableCell>
                  <TableCell>{empleado.novedades.length}</TableCell>
                  <TableCell>
                    <Dialog open={dialogOpen && novedadesEditando?.id === empleado.id} onOpenChange={setDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" onClick={() => handleEditarNovedades(empleado)}>
                          <Edit3 className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>
                            Novedades - {empleado.nombre} {empleado.apellido}
                          </DialogTitle>
                        </DialogHeader>

                        {novedadesEditando && (
                          <div className="space-y-6">
                            {/* Agregar nueva novedad */}
                            <Card>
                              <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                  <Plus className="h-5 w-5" />
                                  Agregar Novedad
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="tipo">Tipo de Novedad</Label>
                                    <Select
                                      value={nuevaNovedad.tipo}
                                      onValueChange={(value: Novedad['tipo']) =>
                                        setNuevaNovedad(prev => ({ ...prev, tipo: value }))
                                      }
                                    >
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="incapacidad">Incapacidad</SelectItem>
                                        <SelectItem value="licencia">Licencia</SelectItem>
                                        <SelectItem value="bonificacion">Bonificación</SelectItem>
                                        <SelectItem value="sancion">Sanción</SelectItem>
                                        <SelectItem value="permiso">Permiso</SelectItem>
                                        <SelectItem value="vacaciones">Vacaciones</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="valor">Valor (si aplica)</Label>
                                    <Input
                                      id="valor"
                                      type="number"
                                      value={nuevaNovedad.valor}
                                      onChange={(e) => setNuevaNovedad(prev => ({
                                        ...prev,
                                        valor: Number(e.target.value)
                                      }))}
                                    />
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="fechaInicio">Fecha Inicio</Label>
                                    <Input
                                      id="fechaInicio"
                                      type="date"
                                      value={nuevaNovedad.fechaInicio}
                                      onChange={(e) => setNuevaNovedad(prev => ({
                                        ...prev,
                                        fechaInicio: e.target.value
                                      }))}
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="fechaFin">Fecha Fin</Label>
                                    <Input
                                      id="fechaFin"
                                      type="date"
                                      value={nuevaNovedad.fechaFin}
                                      onChange={(e) => setNuevaNovedad(prev => ({
                                        ...prev,
                                        fechaFin: e.target.value
                                      }))}
                                    />
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <Label htmlFor="descripcion">Descripción</Label>
                                  <Textarea
                                    id="descripcion"
                                    placeholder="Descripción de la novedad..."
                                    value={nuevaNovedad.descripcion}
                                    onChange={(e) => setNuevaNovedad(prev => ({
                                      ...prev,
                                      descripcion: e.target.value
                                    }))}
                                  />
                                </div>

                                <div className="space-y-2">
                                  <Label htmlFor="soporte">Soporte/Documento</Label>
                                  <Input
                                    id="soporte"
                                    placeholder="Nombre del archivo de soporte..."
                                    value={nuevaNovedad.soporte}
                                    onChange={(e) => setNuevaNovedad(prev => ({
                                      ...prev,
                                      soporte: e.target.value
                                    }))}
                                  />
                                </div>

                                <Button onClick={handleAgregarNovedad}>
                                  <Plus className="mr-2 h-4 w-4" />
                                  Agregar Novedad
                                </Button>
                              </CardContent>
                            </Card>

                            {/* Novedades existentes */}
                            <Card>
                              <CardHeader>
                                <CardTitle className="text-lg">Novedades Registradas</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead>Tipo</TableHead>
                                      <TableHead>Fecha Inicio</TableHead>
                                      <TableHead>Fecha Fin</TableHead>
                                      <TableHead>Días</TableHead>
                                      <TableHead>Valor</TableHead>
                                      <TableHead>Estado</TableHead>
                                      <TableHead>Acciones</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {novedadesEditando.novedades.map((novedad) => (
                                      <TableRow key={novedad.id}>
                                        <TableCell>{getTipoNovedadBadge(novedad.tipo)}</TableCell>
                                        <TableCell>{formatDate(novedad.fechaInicio)}</TableCell>
                                        <TableCell>{formatDate(novedad.fechaFin)}</TableCell>
                                        <TableCell className="font-mono">{novedad.dias}</TableCell>
                                        <TableCell className="font-mono">
                                          {novedad.valor > 0 ? formatCurrency(novedad.valor) : '-'}
                                        </TableCell>
                                        <TableCell>{getEstadoBadge(novedad.estado)}</TableCell>
                                        <TableCell>
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleEliminarNovedad(novedad.id)}
                                          >
                                            <Trash2 className="h-4 w-4" />
                                          </Button>
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>

                                {novedadesEditando.novedades.length === 0 && (
                                  <div className="text-center py-8 text-muted-foreground">
                                    No hay novedades registradas para este empleado.
                                  </div>
                                )}
                              </CardContent>
                            </Card>

                            {/* Resumen */}
                            <Card>
                              <CardHeader>
                                <CardTitle>Resumen de Novedades</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="grid grid-cols-4 gap-4">
                                  <div className="text-center">
                                    <div className="text-2xl font-bold font-mono text-red-600">
                                      {novedadesEditando.totalDiasIncapacidad}
                                    </div>
                                    <div className="text-sm text-muted-foreground">Días Incapacidad</div>
                                  </div>
                                  <div className="text-center">
                                    <div className="text-2xl font-bold font-mono text-yellow-600">
                                      {novedadesEditando.totalDiasLicencia}
                                    </div>
                                    <div className="text-sm text-muted-foreground">Días Licencia</div>
                                  </div>
                                  <div className="text-center">
                                    <div className="text-2xl font-bold font-mono text-green-600">
                                      {formatCurrency(novedadesEditando.totalBonificaciones)}
                                    </div>
                                    <div className="text-sm text-muted-foreground">Bonificaciones</div>
                                  </div>
                                  <div className="text-center">
                                    <div className="text-2xl font-bold font-mono text-blue-600">
                                      {novedadesEditando.novedades.length}
                                    </div>
                                    <div className="text-sm text-muted-foreground">Total Novedades</div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>

                            <div className="flex justify-end gap-2">
                              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                                Cancelar
                              </Button>
                              <Button onClick={handleGuardarCambios}>
                                <Save className="mr-2 h-4 w-4" />
                                Guardar Cambios
                              </Button>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Navegación */}
      <div className="flex justify-between">
        <Link href="/nomina/horas">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a Horas
          </Button>
        </Link>

        <Link href="/nomina/calculo">
          <Button>
            Continuar con Cálculo
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}