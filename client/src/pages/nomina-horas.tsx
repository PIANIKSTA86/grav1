import { useState } from "react";
import { Clock, Save, ArrowRight, ArrowLeft, Calendar, Plus, Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

interface HorasEmpleado {
  id: string;
  nombre: string;
  apellido: string;
  cargo: string;
  horasRegistradas: {
    fecha: string;
    horasOrdinarias: number;
    horasExtrasDiurnas: number;
    horasExtrasNocturnas: number;
    horasExtrasFestivas: number;
    observaciones: string;
  }[];
  totalHorasOrdinarias: number;
  totalHorasExtras: number;
}

export default function NominaHoras() {
  const { toast } = useToast();
  const [horasEditando, setHorasEditando] = useState<HorasEmpleado | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [nuevaFecha, setNuevaFecha] = useState('');
  const [nuevasHoras, setNuevasHoras] = useState({
    horasOrdinarias: 0,
    horasExtrasDiurnas: 0,
    horasExtrasNocturnas: 0,
    horasExtrasFestivas: 0,
    observaciones: ''
  });

  // Datos de ejemplo
  const [empleadosHoras, setEmpleadosHoras] = useState<HorasEmpleado[]>([
    {
      id: 'EMP-001',
      nombre: 'María',
      apellido: 'González',
      cargo: 'Administradora',
      horasRegistradas: [
        {
          fecha: '2024-11-01',
          horasOrdinarias: 8,
          horasExtrasDiurnas: 2,
          horasExtrasNocturnas: 0,
          horasExtrasFestivas: 0,
          observaciones: 'Trabajo extra en reporte mensual'
        },
        {
          fecha: '2024-11-02',
          horasOrdinarias: 8,
          horasExtrasDiurnas: 0,
          horasExtrasNocturnas: 0,
          horasExtrasFestivas: 0,
          observaciones: ''
        }
      ],
      totalHorasOrdinarias: 16,
      totalHorasExtras: 2
    },
    {
      id: 'EMP-002',
      nombre: 'Carlos',
      apellido: 'Rodríguez',
      cargo: 'Conserje',
      horasRegistradas: [
        {
          fecha: '2024-11-01',
          horasOrdinarias: 8,
          horasExtrasDiurnas: 0,
          horasExtrasNocturnas: 4,
          horasExtrasFestivas: 0,
          observaciones: 'Turno nocturno adicional'
        }
      ],
      totalHorasOrdinarias: 8,
      totalHorasExtras: 4
    },
    {
      id: 'EMP-003',
      nombre: 'Ana',
      apellido: 'López',
      cargo: 'Auxiliar de Limpieza',
      horasRegistradas: [
        {
          fecha: '2024-11-01',
          horasOrdinarias: 8,
          horasExtrasDiurnas: 0,
          horasExtrasNocturnas: 0,
          horasExtrasFestivas: 0,
          observaciones: ''
        }
      ],
      totalHorasOrdinarias: 8,
      totalHorasExtras: 0
    }
  ]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const calcularTotales = (horas: HorasEmpleado['horasRegistradas']) => {
    return horas.reduce((total, registro) => ({
      ordinarias: total.ordinarias + registro.horasOrdinarias,
      extras: total.extras + registro.horasExtrasDiurnas + registro.horasExtrasNocturnas + registro.horasExtrasFestivas
    }), { ordinarias: 0, extras: 0 });
  };

  const handleEditarHoras = (empleado: HorasEmpleado) => {
    setHorasEditando({ ...empleado });
    setDialogOpen(true);
  };

  const handleAgregarRegistro = () => {
    if (!horasEditando || !nuevaFecha) return;

    const nuevoRegistro = {
      fecha: nuevaFecha,
      ...nuevasHoras
    };

    const empleadoActualizado = {
      ...horasEditando,
      horasRegistradas: [...horasEditando.horasRegistradas, nuevoRegistro]
    };

    const totales = calcularTotales(empleadoActualizado.horasRegistradas);
    empleadoActualizado.totalHorasOrdinarias = totales.ordinarias;
    empleadoActualizado.totalHorasExtras = totales.extras;

    setEmpleadosHoras(prev =>
      prev.map(emp => emp.id === horasEditando.id ? empleadoActualizado : emp)
    );

    setHorasEditando(empleadoActualizado);

    // Resetear formulario
    setNuevaFecha('');
    setNuevasHoras({
      horasOrdinarias: 0,
      horasExtrasDiurnas: 0,
      horasExtrasNocturnas: 0,
      horasExtrasFestivas: 0,
      observaciones: ''
    });

    toast({
      title: "Registro agregado",
      description: "Las horas han sido registradas exitosamente.",
    });
  };

  const handleEliminarRegistro = (fecha: string) => {
    if (!horasEditando) return;

    const empleadoActualizado = {
      ...horasEditando,
      horasRegistradas: horasEditando.horasRegistradas.filter(r => r.fecha !== fecha)
    };

    const totales = calcularTotales(empleadoActualizado.horasRegistradas);
    empleadoActualizado.totalHorasOrdinarias = totales.ordinarias;
    empleadoActualizado.totalHorasExtras = totales.extras;

    setEmpleadosHoras(prev =>
      prev.map(emp => emp.id === horasEditando.id ? empleadoActualizado : emp)
    );

    setHorasEditando(empleadoActualizado);
  };

  const handleGuardarCambios = () => {
    if (!horasEditando) return;

    setEmpleadosHoras(prev =>
      prev.map(emp => emp.id === horasEditando.id ? horasEditando : emp)
    );

    toast({
      title: "Cambios guardados",
      description: `Los registros de horas de ${horasEditando.nombre} ${horasEditando.apellido} han sido actualizados.`,
    });

    setDialogOpen(false);
    setHorasEditando(null);
  };

  const totalHorasOrdinarias = empleadosHoras.reduce((sum, emp) => sum + emp.totalHorasOrdinarias, 0);
  const totalHorasExtras = empleadosHoras.reduce((sum, emp) => sum + emp.totalHorasExtras, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Registro de Horas</h1>
          <p className="text-muted-foreground">
            Registre las horas trabajadas por cada empleado en el período
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/nomina/parametros">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver
            </Button>
          </Link>
          <Link href="/nomina/novedades">
            <Button>
              Continuar
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Estadísticas de horas */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Horas Ordinarias</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-blue-600">{totalHorasOrdinarias}</div>
            <p className="text-xs text-muted-foreground">
              horas trabajadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Horas Extras</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-orange-600">{totalHorasExtras}</div>
            <p className="text-xs text-muted-foreground">
              horas extras registradas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Empleados con Registro</CardTitle>
            <Calendar className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-green-600">
              {empleadosHoras.filter(e => e.horasRegistradas.length > 0).length}
            </div>
            <p className="text-xs text-muted-foreground">
              de {empleadosHoras.length} empleados
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabla de empleados con horas */}
      <Card>
        <CardHeader>
          <CardTitle>Registro de Horas por Empleado</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Empleado</TableHead>
                <TableHead>Cargo</TableHead>
                <TableHead>Horas Ordinarias</TableHead>
                <TableHead>Horas Extras</TableHead>
                <TableHead>Días Registrados</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {empleadosHoras.map((empleado) => (
                <TableRow key={empleado.id}>
                  <TableCell className="font-medium">
                    {empleado.nombre} {empleado.apellido}
                  </TableCell>
                  <TableCell>{empleado.cargo}</TableCell>
                  <TableCell className="font-mono">{empleado.totalHorasOrdinarias}</TableCell>
                  <TableCell className="font-mono">{empleado.totalHorasExtras}</TableCell>
                  <TableCell>{empleado.horasRegistradas.length}</TableCell>
                  <TableCell>
                    {empleado.horasRegistradas.length > 0 ? (
                      <Badge className="bg-green-100 text-green-800">Registrado</Badge>
                    ) : (
                      <Badge variant="outline">Pendiente</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Dialog open={dialogOpen && horasEditando?.id === empleado.id} onOpenChange={setDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" onClick={() => handleEditarHoras(empleado)}>
                          <Edit3 className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>
                            Registro de Horas - {empleado.nombre} {empleado.apellido}
                          </DialogTitle>
                        </DialogHeader>

                        {horasEditando && (
                          <div className="space-y-6">
                            {/* Agregar nuevo registro */}
                            <Card>
                              <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                  <Plus className="h-5 w-5" />
                                  Agregar Registro de Horas
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="fecha">Fecha</Label>
                                    <Input
                                      id="fecha"
                                      type="date"
                                      value={nuevaFecha}
                                      onChange={(e) => setNuevaFecha(e.target.value)}
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="horasOrdinarias">Horas Ordinarias</Label>
                                    <Input
                                      id="horasOrdinarias"
                                      type="number"
                                      min="0"
                                      max="24"
                                      value={nuevasHoras.horasOrdinarias}
                                      onChange={(e) => setNuevasHoras(prev => ({
                                        ...prev,
                                        horasOrdinarias: Number(e.target.value)
                                      }))}
                                    />
                                  </div>
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                  <div className="space-y-2">
                                    <Label>Horas Extras Diurnas</Label>
                                    <Input
                                      type="number"
                                      min="0"
                                      value={nuevasHoras.horasExtrasDiurnas}
                                      onChange={(e) => setNuevasHoras(prev => ({
                                        ...prev,
                                        horasExtrasDiurnas: Number(e.target.value)
                                      }))}
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Horas Extras Nocturnas</Label>
                                    <Input
                                      type="number"
                                      min="0"
                                      value={nuevasHoras.horasExtrasNocturnas}
                                      onChange={(e) => setNuevasHoras(prev => ({
                                        ...prev,
                                        horasExtrasNocturnas: Number(e.target.value)
                                      }))}
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Horas Extras Festivas</Label>
                                    <Input
                                      type="number"
                                      min="0"
                                      value={nuevasHoras.horasExtrasFestivas}
                                      onChange={(e) => setNuevasHoras(prev => ({
                                        ...prev,
                                        horasExtrasFestivas: Number(e.target.value)
                                      }))}
                                    />
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <Label htmlFor="observaciones">Observaciones</Label>
                                  <Input
                                    id="observaciones"
                                    placeholder="Observaciones opcionales..."
                                    value={nuevasHoras.observaciones}
                                    onChange={(e) => setNuevasHoras(prev => ({
                                      ...prev,
                                      observaciones: e.target.value
                                    }))}
                                  />
                                </div>

                                <Button onClick={handleAgregarRegistro} disabled={!nuevaFecha}>
                                  <Plus className="mr-2 h-4 w-4" />
                                  Agregar Registro
                                </Button>
                              </CardContent>
                            </Card>

                            {/* Registros existentes */}
                            <Card>
                              <CardHeader>
                                <CardTitle className="text-lg">Registros de Horas</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead>Fecha</TableHead>
                                      <TableHead>Horas Ordinarias</TableHead>
                                      <TableHead>Horas Extras Diurnas</TableHead>
                                      <TableHead>Horas Extras Nocturnas</TableHead>
                                      <TableHead>Horas Extras Festivas</TableHead>
                                      <TableHead>Observaciones</TableHead>
                                      <TableHead>Acciones</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {horasEditando.horasRegistradas.map((registro) => (
                                      <TableRow key={registro.fecha}>
                                        <TableCell className="font-medium">
                                          {formatDate(registro.fecha)}
                                        </TableCell>
                                        <TableCell className="font-mono">{registro.horasOrdinarias}</TableCell>
                                        <TableCell className="font-mono">{registro.horasExtrasDiurnas}</TableCell>
                                        <TableCell className="font-mono">{registro.horasExtrasNocturnas}</TableCell>
                                        <TableCell className="font-mono">{registro.horasExtrasFestivas}</TableCell>
                                        <TableCell className="text-sm">{registro.observaciones}</TableCell>
                                        <TableCell>
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleEliminarRegistro(registro.fecha)}
                                          >
                                            Eliminar
                                          </Button>
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>

                                {horasEditando.horasRegistradas.length === 0 && (
                                  <div className="text-center py-8 text-muted-foreground">
                                    No hay registros de horas para este empleado.
                                  </div>
                                )}
                              </CardContent>
                            </Card>

                            {/* Resumen */}
                            <Card>
                              <CardHeader>
                                <CardTitle>Resumen de Horas</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="grid grid-cols-3 gap-4">
                                  <div className="text-center">
                                    <div className="text-2xl font-bold font-mono text-blue-600">
                                      {horasEditando.totalHorasOrdinarias}
                                    </div>
                                    <div className="text-sm text-muted-foreground">Horas Ordinarias</div>
                                  </div>
                                  <div className="text-center">
                                    <div className="text-2xl font-bold font-mono text-orange-600">
                                      {horasEditando.totalHorasExtras}
                                    </div>
                                    <div className="text-sm text-muted-foreground">Horas Extras</div>
                                  </div>
                                  <div className="text-center">
                                    <div className="text-2xl font-bold font-mono text-green-600">
                                      {horasEditando.horasRegistradas.length}
                                    </div>
                                    <div className="text-sm text-muted-foreground">Días Registrados</div>
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
        <Link href="/nomina/parametros">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a Parámetros
          </Button>
        </Link>

        <Link href="/nomina/novedades">
          <Button>
            Continuar con Novedades
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}