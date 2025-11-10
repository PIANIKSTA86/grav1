import { useState } from "react";
import { Calendar, ArrowRight, Save, Plus, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";

interface PeriodoNomina {
  id: string;
  nombre: string;
  fechaInicio: string;
  fechaFin: string;
  descripcion: string;
  tipo: 'mensual' | 'quincenal' | 'semanal';
  estado: 'activo' | 'inactivo';
  fechaCreacion: string;
}

export default function NominaConfiguracion() {
  const { toast } = useToast();
  const [modo, setModo] = useState<'seleccionar' | 'crear'>('seleccionar');
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState<string>('');
  const [nuevoPeriodo, setNuevoPeriodo] = useState({
    nombre: '',
    fechaInicio: '',
    fechaFin: '',
    descripcion: '',
    tipo: 'mensual' as 'mensual' | 'quincenal' | 'semanal'
  });

  // Datos de ejemplo
  const periodosDisponibles: PeriodoNomina[] = [
    {
      id: 'PER-2024-12',
      nombre: 'Diciembre 2024',
      fechaInicio: '2024-12-01',
      fechaFin: '2024-12-31',
      descripcion: 'Período de nómina correspondiente a diciembre 2024',
      tipo: 'mensual',
      estado: 'activo',
      fechaCreacion: '2024-11-01'
    },
    {
      id: 'PER-2024-11',
      nombre: 'Noviembre 2024',
      fechaInicio: '2024-11-01',
      fechaFin: '2024-11-30',
      descripcion: 'Período de nómina correspondiente a noviembre 2024',
      tipo: 'mensual',
      estado: 'activo',
      fechaCreacion: '2024-10-01'
    },
    {
      id: 'PER-2024-10',
      nombre: 'Octubre 2024',
      fechaInicio: '2024-10-01',
      fechaFin: '2024-10-31',
      descripcion: 'Período de nómina correspondiente a octubre 2024',
      tipo: 'mensual',
      estado: 'activo',
      fechaCreacion: '2024-09-01'
    }
  ];

  const handleCrearPeriodo = () => {
    if (!nuevoPeriodo.nombre || !nuevoPeriodo.fechaInicio || !nuevoPeriodo.fechaFin) {
      toast({
        title: "Error",
        description: "Por favor complete todos los campos requeridos.",
        variant: "destructive",
      });
      return;
    }

    // Aquí iría la lógica para crear el período
    toast({
      title: "Período creado",
      description: `El período "${nuevoPeriodo.nombre}" ha sido creado exitosamente.`,
    });

    // Resetear formulario
    setNuevoPeriodo({
      nombre: '',
      fechaInicio: '',
      fechaFin: '',
      descripcion: '',
      tipo: 'mensual'
    });
    setModo('seleccionar');
  };

  const handleContinuar = () => {
    if (!periodoSeleccionado) {
      toast({
        title: "Selección requerida",
        description: "Por favor seleccione un período de nómina.",
        variant: "destructive",
      });
      return;
    }

    // Aquí iría la lógica para continuar con el período seleccionado
    toast({
      title: "Período configurado",
      description: "Puede continuar con la selección de empleados.",
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getTipoBadge = (tipo: string) => {
    switch (tipo) {
      case 'mensual':
        return <Badge variant="default">Mensual</Badge>;
      case 'quincenal':
        return <Badge variant="secondary">Quincenal</Badge>;
      case 'semanal':
        return <Badge variant="outline">Semanal</Badge>;
      default:
        return <Badge variant="secondary">{tipo}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Configuración de Nómina</h1>
          <p className="text-muted-foreground">
            Configure o seleccione el período para procesar la nómina
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={modo === 'seleccionar' ? 'default' : 'outline'}
            onClick={() => setModo('seleccionar')}
          >
            <Settings className="mr-2 h-4 w-4" />
            Seleccionar Período
          </Button>
          <Button
            variant={modo === 'crear' ? 'default' : 'outline'}
            onClick={() => setModo('crear')}
          >
            <Plus className="mr-2 h-4 w-4" />
            Crear Nuevo
          </Button>
        </div>
      </div>

      {modo === 'seleccionar' ? (
        <>
          {/* Selección de período existente */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Seleccionar Período de Nómina
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="periodo">Período Disponible</Label>
                <Select value={periodoSeleccionado} onValueChange={setPeriodoSeleccionado}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione un período..." />
                  </SelectTrigger>
                  <SelectContent>
                    {periodosDisponibles.map((periodo) => (
                      <SelectItem key={periodo.id} value={periodo.id}>
                        {periodo.nombre} ({formatDate(periodo.fechaInicio)} - {formatDate(periodo.fechaFin)})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {periodoSeleccionado && (
                <div className="border rounded-lg p-4 bg-muted/50">
                  {(() => {
                    const periodo = periodosDisponibles.find(p => p.id === periodoSeleccionado);
                    if (!periodo) return null;

                    return (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold">{periodo.nombre}</h3>
                          {getTipoBadge(periodo.tipo)}
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Fecha Inicio:</span>
                            <span className="ml-2 font-medium">{formatDate(periodo.fechaInicio)}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Fecha Fin:</span>
                            <span className="ml-2 font-medium">{formatDate(periodo.fechaFin)}</span>
                          </div>
                        </div>
                        <div>
                          <span className="text-muted-foreground text-sm">Descripción:</span>
                          <p className="mt-1 text-sm">{periodo.descripcion}</p>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              <div className="flex justify-end">
                <Link href="/nomina/empleados">
                  <Button onClick={handleContinuar} disabled={!periodoSeleccionado}>
                    Continuar con Selección de Empleados
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Lista de períodos disponibles */}
          <Card>
            <CardHeader>
              <CardTitle>Períodos Disponibles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {periodosDisponibles.map((periodo) => (
                  <div key={periodo.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{periodo.nombre}</h3>
                        {getTipoBadge(periodo.tipo)}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(periodo.fechaInicio)} - {formatDate(periodo.fechaFin)}
                      </p>
                      <p className="text-sm">{periodo.descripcion}</p>
                    </div>
                    <Button
                      variant={periodoSeleccionado === periodo.id ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setPeriodoSeleccionado(periodo.id)}
                    >
                      {periodoSeleccionado === periodo.id ? 'Seleccionado' : 'Seleccionar'}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        /* Creación de nuevo período */
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Crear Nuevo Período de Nómina
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre del Período *</Label>
                <Input
                  id="nombre"
                  placeholder="Ej: Noviembre 2024"
                  value={nuevoPeriodo.nombre}
                  onChange={(e) => setNuevoPeriodo(prev => ({ ...prev, nombre: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tipo">Tipo de Período</Label>
                <Select
                  value={nuevoPeriodo.tipo}
                  onValueChange={(value: 'mensual' | 'quincenal' | 'semanal') =>
                    setNuevoPeriodo(prev => ({ ...prev, tipo: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mensual">Mensual</SelectItem>
                    <SelectItem value="quincenal">Quincenal</SelectItem>
                    <SelectItem value="semanal">Semanal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fechaInicio">Fecha de Inicio *</Label>
                <Input
                  id="fechaInicio"
                  type="date"
                  value={nuevoPeriodo.fechaInicio}
                  onChange={(e) => setNuevoPeriodo(prev => ({ ...prev, fechaInicio: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fechaFin">Fecha de Fin *</Label>
                <Input
                  id="fechaFin"
                  type="date"
                  value={nuevoPeriodo.fechaFin}
                  onChange={(e) => setNuevoPeriodo(prev => ({ ...prev, fechaFin: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="descripcion">Descripción</Label>
              <Textarea
                id="descripcion"
                placeholder="Descripción opcional del período..."
                value={nuevoPeriodo.descripcion}
                onChange={(e) => setNuevoPeriodo(prev => ({ ...prev, descripcion: e.target.value }))}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setModo('seleccionar')}>
                Cancelar
              </Button>
              <Button onClick={handleCrearPeriodo}>
                <Save className="mr-2 h-4 w-4" />
                Crear Período
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Información del flujo */}
      <Card>
        <CardHeader>
          <CardTitle>Siguiente Paso</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Settings className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-blue-900">Configuración Completada</h3>
              <p className="text-sm text-blue-700">
                Una vez configurado el período, continúe con la selección de empleados para este período de nómina.
              </p>
            </div>
            <ArrowRight className="h-5 w-5 text-blue-600" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}