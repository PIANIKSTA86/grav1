import { useState } from "react";
import { Calendar, Users, Clock, FileText, Calculator, CheckCircle, Download, Settings, TrendingUp, AlertCircle, PlayCircle, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
import { Link } from "wouter";

interface NominaPeriodo {
  id: string;
  nombre: string;
  fechaInicio: string;
  fechaFin: string;
  estado: 'configuracion' | 'empleados' | 'parametros' | 'horas' | 'novedades' | 'calculo' | 'revision' | 'aprobacion' | 'comprobantes' | 'procesamiento';
  progreso: number;
  empleadosSeleccionados: number;
  totalEmpleados: number;
}

interface EmpleadoNomina {
  id: string;
  nombre: string;
  cargo: string;
  salarioBase: number;
  estadoNomina: 'pendiente' | 'en_proceso' | 'completada' | 'aprobada';
}

export default function Nomina() {
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState<string>('');

  // Datos de ejemplo
  const periodos: NominaPeriodo[] = [
    {
      id: 'NOM-2024-11',
      nombre: 'Nómina Noviembre 2024',
      fechaInicio: '2024-11-01',
      fechaFin: '2024-11-30',
      estado: 'revision',
      progreso: 75,
      empleadosSeleccionados: 12,
      totalEmpleados: 15
    },
    {
      id: 'NOM-2024-10',
      nombre: 'Nómina Octubre 2024',
      fechaInicio: '2024-10-01',
      fechaFin: '2024-10-31',
      estado: 'aprobacion',
      progreso: 90,
      empleadosSeleccionados: 14,
      totalEmpleados: 15
    },
    {
      id: 'NOM-2024-09',
      nombre: 'Nómina Septiembre 2024',
      fechaInicio: '2024-09-01',
      fechaFin: '2024-09-30',
      estado: 'comprobantes',
      progreso: 100,
      empleadosSeleccionados: 15,
      totalEmpleados: 15
    }
  ];

  const empleadosRecientes: EmpleadoNomina[] = [
    { id: 'EMP-001', nombre: 'María González', cargo: 'Administradora', salarioBase: 2500000, estadoNomina: 'en_proceso' },
    { id: 'EMP-002', nombre: 'Carlos Rodríguez', cargo: 'Conserje', salarioBase: 1500000, estadoNomina: 'pendiente' },
    { id: 'EMP-003', nombre: 'Ana López', cargo: 'Auxiliar de Limpieza', salarioBase: 1300000, estadoNomina: 'completada' },
    { id: 'EMP-004', nombre: 'Juan Pérez', cargo: 'Jardinero', salarioBase: 1400000, estadoNomina: 'aprobada' }
  ];

  const pasosFlujo = [
    { id: 'configuracion', nombre: 'Configuración', icono: Settings, descripcion: 'Seleccionar período' },
    { id: 'empleados', nombre: 'Empleados', icono: Users, descripcion: 'Seleccionar empleados' },
    { id: 'parametros', nombre: 'Parámetros', icono: Calculator, descripcion: 'Ajustar parámetros' },
    { id: 'horas', nombre: 'Horas', icono: Clock, descripcion: 'Registrar horas' },
    { id: 'novedades', nombre: 'Novedades', icono: AlertCircle, descripcion: 'Registrar novedades' },
    { id: 'calculo', nombre: 'Cálculo', icono: Calculator, descripcion: 'Calcular nómina' },
    { id: 'revision', nombre: 'Revisión', icono: CheckCircle, descripcion: 'Revisar y ajustar' },
    { id: 'aprobacion', nombre: 'Aprobación', icono: CheckCircle, descripcion: 'Aprobar nómina' },
    { id: 'comprobantes', nombre: 'Comprobantes', icono: FileText, descripcion: 'Generar comprobantes' },
    { id: 'procesamiento', nombre: 'Bancario', icono: Download, descripcion: 'Archivo bancario' }
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'configuracion':
        return <Badge variant="outline">Configuración</Badge>;
      case 'empleados':
        return <Badge variant="outline">Empleados</Badge>;
      case 'parametros':
        return <Badge variant="outline">Parámetros</Badge>;
      case 'horas':
        return <Badge variant="outline">Horas</Badge>;
      case 'novedades':
        return <Badge variant="outline">Novedades</Badge>;
      case 'calculo':
        return <Badge variant="secondary">Cálculo</Badge>;
      case 'revision':
        return <Badge className="bg-blue-100 text-blue-800">Revisión</Badge>;
      case 'aprobacion':
        return <Badge className="bg-yellow-100 text-yellow-800">Aprobación</Badge>;
      case 'comprobantes':
        return <Badge className="bg-green-100 text-green-800">Comprobantes</Badge>;
      case 'procesamiento':
        return <Badge className="bg-purple-100 text-purple-800">Procesamiento</Badge>;
      default:
        return <Badge variant="secondary">{estado}</Badge>;
    }
  };

  const getEstadoEmpleadoBadge = (estado: string) => {
    switch (estado) {
      case 'pendiente':
        return <Badge variant="outline">Pendiente</Badge>;
      case 'en_proceso':
        return <Badge className="bg-blue-100 text-blue-800">En Proceso</Badge>;
      case 'completada':
        return <Badge className="bg-green-100 text-green-800">Completada</Badge>;
      case 'aprobada':
        return <Badge className="bg-purple-100 text-purple-800">Aprobada</Badge>;
      default:
        return <Badge variant="secondary">{estado}</Badge>;
    }
  };

  const periodoActual = periodos.find(p => p.id === periodoSeleccionado) || periodos[0];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Nómina</h1>
          <p className="text-muted-foreground">
            Gestión completa del proceso de nómina por períodos
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/nomina/configuracion">
            <Button>
              <Settings className="mr-2 h-4 w-4" />
              Nueva Nómina
            </Button>
          </Link>
        </div>
      </div>

      {/* Selector de período */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Período de Nómina
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Seleccionar Período</label>
              <Select value={periodoSeleccionado} onValueChange={setPeriodoSeleccionado}>
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="Seleccionar período..." />
                </SelectTrigger>
                <SelectContent>
                  {periodos.map((periodo) => (
                    <SelectItem key={periodo.id} value={periodo.id}>
                      {periodo.nombre} - {getEstadoBadge(periodo.estado)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {periodoActual && (
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Período</p>
                    <p className="font-medium">{periodoActual.nombre}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Empleados</p>
                    <p className="font-medium">{periodoActual.empleadosSeleccionados}/{periodoActual.totalEmpleados}</p>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground mb-1">Progreso</p>
                    <Progress value={periodoActual.progreso} className="w-full" />
                    <p className="text-xs text-muted-foreground mt-1">{periodoActual.progreso}% completado</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Flujo de trabajo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PlayCircle className="h-5 w-5" />
            Flujo de Trabajo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {pasosFlujo.map((paso, index) => {
              const IconComponent = paso.icono;
              const isCompleted = periodoActual && pasosFlujo.findIndex(p => p.id === periodoActual.estado) > index;
              const isCurrent = periodoActual && paso.id === periodoActual.estado;

              return (
                <div key={paso.id} className="text-center">
                  <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                    isCompleted ? 'bg-green-100 text-green-600' :
                    isCurrent ? 'bg-blue-100 text-blue-600' :
                    'bg-gray-100 text-gray-400'
                  }`}>
                    <IconComponent className="h-6 w-6" />
                  </div>
                  <h3 className={`text-sm font-medium ${
                    isCompleted ? 'text-green-600' :
                    isCurrent ? 'text-blue-600' :
                    'text-gray-400'
                  }`}>
                    {paso.nombre}
                  </h3>
                  <p className="text-xs text-muted-foreground">{paso.descripcion}</p>
                </div>
              );
            })}
          </div>

          {periodoActual && (
            <div className="mt-6 flex justify-center">
              <Link href={`/nomina/${periodoActual.estado}`}>
                <Button>
                  Continuar con {pasosFlujo.find(p => p.id === periodoActual.estado)?.nombre}
                  <PlayCircle className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Estadísticas rápidas */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Empleados Activos</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-blue-600">15</div>
            <p className="text-xs text-muted-foreground">
              en nómina actual
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-green-600">
              {formatCurrency(45000000)}
            </div>
            <p className="text-xs text-muted-foreground">
              nómina estimada
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Novedades</CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-yellow-600">3</div>
            <p className="text-xs text-muted-foreground">
              pendientes de registro
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Próximo Vencimiento</CardTitle>
            <Calendar className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-red-600">5</div>
            <p className="text-xs text-muted-foreground">
              días para pago
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Empleados recientes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Empleados en Proceso
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Empleado</TableHead>
                <TableHead>Cargo</TableHead>
                <TableHead>Salario Base</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {empleadosRecientes.map((empleado) => (
                <TableRow key={empleado.id}>
                  <TableCell className="font-medium">{empleado.nombre}</TableCell>
                  <TableCell>{empleado.cargo}</TableCell>
                  <TableCell className="font-mono">{formatCurrency(empleado.salarioBase)}</TableCell>
                  <TableCell>{getEstadoEmpleadoBadge(empleado.estadoNomina)}</TableCell>
                  <TableCell>
                    <Link href={`/nomina/empleados/${empleado.id}`}>
                      <Button variant="ghost" size="sm">
                        Ver Detalles
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Acciones rápidas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Acciones Rápidas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/nomina/configuracion">
              <Button variant="outline" className="w-full h-20 flex-col">
                <Settings className="h-6 w-6 mb-2" />
                Nueva Nómina
              </Button>
            </Link>

            <Link href="/nomina/empleados">
              <Button variant="outline" className="w-full h-20 flex-col">
                <Users className="h-6 w-6 mb-2" />
                Gestionar Empleados
              </Button>
            </Link>

            <Link href="/nomina/horas">
              <Button variant="outline" className="w-full h-20 flex-col">
                <Clock className="h-6 w-6 mb-2" />
                Registrar Horas
              </Button>
            </Link>

            <Link href="/nomina/novedades">
              <Button variant="outline" className="w-full h-20 flex-col">
                <AlertCircle className="h-6 w-6 mb-2" />
                Novedades
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}