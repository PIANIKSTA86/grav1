import { useState } from "react";
import { TrendingUp, TrendingDown, DollarSign, Calendar, Target, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Link } from "wouter";

interface PresupuestoEjecutado {
  id: string;
  partida: string;
  tipo: 'operacional' | 'personal' | 'inversion';
  aprobado: number;
  ejecutado: number;
  saldo: number;
  porcentajeEjecucion: number;
  periodoActual: string;
  estado: 'en_ejecucion' | 'completado' | 'sobrepasado' | 'bajo_ejecucion';
}

interface PeriodoPresupuesto {
  id: string;
  nombre: string;
  fechaInicio: string;
  fechaFin: string;
  estado: 'activo' | 'cerrado' | 'proximo';
}

export default function PresupuestosEjecucion() {
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState<string>('2025');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'en_ejecucion':
        return <Badge className="bg-blue-100 text-blue-800">En Ejecución</Badge>;
      case 'completado':
        return <Badge className="bg-green-100 text-green-800">Completado</Badge>;
      case 'sobrepasado':
        return <Badge className="bg-red-100 text-red-800">Sobrepasado</Badge>;
      case 'bajo_ejecucion':
        return <Badge className="bg-yellow-100 text-yellow-800">Bajo Ejecución</Badge>;
      default:
        return <Badge variant="secondary">{estado}</Badge>;
    }
  };

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case 'en_ejecucion':
        return <Clock className="h-4 w-4 text-blue-600" />;
      case 'completado':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'sobrepasado':
        return <TrendingUp className="h-4 w-4 text-red-600" />;
      case 'bajo_ejecucion':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      default:
        return <Target className="h-4 w-4 text-gray-600" />;
    }
  };

  // Datos de ejemplo - presupuestos en ejecución
  const presupuestosEjecutados: PresupuestoEjecutado[] = [
    {
      id: 'PRES-001',
      partida: 'Servicios Públicos',
      tipo: 'operacional',
      aprobado: 12000000,
      ejecutado: 7800000,
      saldo: 4200000,
      porcentajeEjecucion: 65.0,
      periodoActual: '2025',
      estado: 'en_ejecucion'
    },
    {
      id: 'PRES-002',
      partida: 'Mantenimiento General',
      tipo: 'operacional',
      aprobado: 18000000,
      ejecutado: 14400000,
      saldo: 3600000,
      porcentajeEjecucion: 80.0,
      periodoActual: '2025',
      estado: 'en_ejecucion'
    },
    {
      id: 'PRES-003',
      partida: 'Personal Administrativo',
      tipo: 'personal',
      aprobado: 35000000,
      ejecutado: 28000000,
      saldo: 7000000,
      porcentajeEjecucion: 80.0,
      periodoActual: '2025',
      estado: 'en_ejecucion'
    },
    {
      id: 'PRES-004',
      partida: 'Vigilancia y Seguridad',
      tipo: 'personal',
      aprobado: 28000000,
      ejecutado: 21000000,
      saldo: 7000000,
      porcentajeEjecucion: 75.0,
      periodoActual: '2025',
      estado: 'en_ejecucion'
    },
    {
      id: 'PRES-005',
      partida: 'Aseo y Jardinería',
      tipo: 'personal',
      aprobado: 12000000,
      ejecutado: 9600000,
      saldo: 2400000,
      porcentajeEjecucion: 80.0,
      periodoActual: '2025',
      estado: 'en_ejecucion'
    },
    {
      id: 'PRES-006',
      partida: 'Fondo de Reserva',
      tipo: 'inversion',
      aprobado: 50000000,
      ejecutado: 15000000,
      saldo: 35000000,
      porcentajeEjecucion: 30.0,
      periodoActual: '2025',
      estado: 'bajo_ejecucion'
    },
    {
      id: 'PRES-007',
      partida: 'Reparaciones Mayores',
      tipo: 'inversion',
      aprobado: 25000000,
      ejecutado: 27500000,
      saldo: -2500000,
      porcentajeEjecucion: 110.0,
      periodoActual: '2025',
      estado: 'sobrepasado'
    }
  ];

  const periodosDisponibles: PeriodoPresupuesto[] = [
    { id: '2024', nombre: '2024', fechaInicio: '2024-01-01', fechaFin: '2024-12-31', estado: 'cerrado' },
    { id: '2025', nombre: '2025', fechaInicio: '2025-01-01', fechaFin: '2025-12-31', estado: 'activo' },
    { id: '2026', nombre: '2026', fechaInicio: '2026-01-01', fechaFin: '2026-12-31', estado: 'proximo' }
  ];

  const presupuestosFiltrados = presupuestosEjecutados.filter(p => p.periodoActual === periodoSeleccionado);

  // Cálculos generales
  const totalAprobado = presupuestosFiltrados.reduce((sum, p) => sum + p.aprobado, 0);
  const totalEjecutado = presupuestosFiltrados.reduce((sum, p) => sum + p.ejecutado, 0);
  const totalSaldo = presupuestosFiltrados.reduce((sum, p) => sum + p.saldo, 0);
  const porcentajeGeneral = totalAprobado > 0 ? (totalEjecutado / totalAprobado) * 100 : 0;

  const presupuestosCompletados = presupuestosFiltrados.filter(p => p.estado === 'completado').length;
  const presupuestosSobreEjecutados = presupuestosFiltrados.filter(p => p.estado === 'sobrepasado').length;
  const presupuestosBajoEjecucion = presupuestosFiltrados.filter(p => p.estado === 'bajo_ejecucion').length;

  const periodoActual = periodosDisponibles.find(p => p.id === periodoSeleccionado);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ejecución de Presupuestos</h1>
          <p className="text-muted-foreground">
            Dashboard de progreso y ejecución de presupuestos aprobados
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/presupuestos/partidas">
            <Button variant="outline">
              Gestionar Partidas
            </Button>
          </Link>
          <Link href="/presupuestos/reportes">
            <Button variant="outline">
              Ver Reportes
            </Button>
          </Link>
        </div>
      </div>

      {/* Selector de período */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="space-y-2">
              <Label htmlFor="periodo">Período de Presupuesto</Label>
              <Select value={periodoSeleccionado} onValueChange={setPeriodoSeleccionado}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {periodosDisponibles.map((periodo) => (
                    <SelectItem key={periodo.id} value={periodo.id}>
                      {periodo.nombre} {periodo.estado === 'activo' && '(Actual)'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {periodoActual && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{periodoActual.fechaInicio} - {periodoActual.fechaFin}</span>
                <Badge variant={periodoActual.estado === 'activo' ? 'default' : 'secondary'}>
                  {periodoActual.estado === 'activo' ? 'Período Actual' :
                   periodoActual.estado === 'cerrado' ? 'Período Cerrado' : 'Próximo Período'}
                </Badge>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas generales */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Aprobado</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-blue-600">
              {formatCurrency(totalAprobado)}
            </div>
            <p className="text-xs text-muted-foreground">
              presupuesto total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Ejecutado</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-green-600">
              {formatCurrency(totalEjecutado)}
            </div>
            <p className="text-xs text-muted-foreground">
              {formatPercentage(porcentajeGeneral)} del total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo Disponible</CardTitle>
            <Target className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-purple-600">
              {formatCurrency(totalSaldo)}
            </div>
            <p className="text-xs text-muted-foreground">
              restante por ejecutar
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progreso General</CardTitle>
            <CheckCircle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-orange-600">
              {formatPercentage(porcentajeGeneral)}
            </div>
            <Progress value={porcentajeGeneral} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Alertas y estadísticas adicionales */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              Partidas en Ejecución
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {presupuestosFiltrados.filter(p => p.estado === 'en_ejecucion').length}
            </div>
            <p className="text-xs text-muted-foreground">
              de {presupuestosFiltrados.length} totales
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              Bajo Ejecución
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {presupuestosBajoEjecucion}
            </div>
            <p className="text-xs text-muted-foreground">
              requieren atención
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-red-600" />
              Sobrepasados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {presupuestosSobreEjecutados}
            </div>
            <p className="text-xs text-muted-foreground">
              exceden presupuesto
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabla de ejecución de presupuestos */}
      <Card>
        <CardHeader>
          <CardTitle>Detalle de Ejecución por Partida</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Partida Presupuestal</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Valor Aprobado</TableHead>
                <TableHead>Valor Ejecutado</TableHead>
                <TableHead>Saldo</TableHead>
                <TableHead>% Ejecución</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Progreso</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {presupuestosFiltrados.map((presupuesto) => (
                <TableRow key={presupuesto.id}>
                  <TableCell>
                    <div className="font-medium">{presupuesto.partida}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {presupuesto.tipo}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono font-semibold">
                    {formatCurrency(presupuesto.aprobado)}
                  </TableCell>
                  <TableCell className="font-mono font-semibold text-green-600">
                    {formatCurrency(presupuesto.ejecutado)}
                  </TableCell>
                  <TableCell className={`font-mono font-semibold ${
                    presupuesto.saldo < 0 ? 'text-red-600' : 'text-blue-600'
                  }`}>
                    {formatCurrency(presupuesto.saldo)}
                  </TableCell>
                  <TableCell>
                    <span className={`font-mono font-semibold ${
                      presupuesto.porcentajeEjecucion > 100 ? 'text-red-600' :
                      presupuesto.porcentajeEjecucion < 50 ? 'text-yellow-600' :
                      'text-green-600'
                    }`}>
                      {formatPercentage(presupuesto.porcentajeEjecucion)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getEstadoIcon(presupuesto.estado)}
                      {getEstadoBadge(presupuesto.estado)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="w-full max-w-xs">
                      <Progress
                        value={Math.min(presupuesto.porcentajeEjecucion, 100)}
                        className="h-2"
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Alertas y recomendaciones */}
      {(presupuestosBajoEjecucion > 0 || presupuestosSobreEjecutados > 0) && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="text-yellow-800 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Alertas de Ejecución
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {presupuestosBajoEjecucion > 0 && (
                <p className="text-sm text-yellow-700">
                  ⚠️ {presupuestosBajoEjecucion} partida(s) con ejecución por debajo del 50%.
                  Considere revisar la planificación o redistribuir recursos.
                </p>
              )}
              {presupuestosSobreEjecutados > 0 && (
                <p className="text-sm text-yellow-700">
                  🚨 {presupuestosSobreEjecutados} partida(s) han sobrepasado el presupuesto aprobado.
                  Se requiere aprobación adicional o reasignación de fondos.
                </p>
              )}
              <div className="pt-2">
                <Link href="/presupuestos/reportes">
                  <Button variant="outline" size="sm" className="text-yellow-700 border-yellow-300">
                    Ver Análisis Detallado
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}