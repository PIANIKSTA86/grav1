import { useState } from "react";
import { BarChart3, TrendingUp, TrendingDown, AlertTriangle, Lightbulb, FileText, Download, Calendar, DollarSign, Target, PieChart } from "lucide-react";
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
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

interface AnalisisPresupuesto {
  periodo: string;
  totalAprobado: number;
  totalEjecutado: number;
  porcentajeEjecucion: number;
  varianzaAbsoluta: number;
  varianzaPorcentual: number;
  partidasSobreEjecutadas: number;
  partidasBajoEjecutadas: number;
  eficienciaGeneral: 'excelente' | 'buena' | 'regular' | 'deficiente';
}

interface TendenciaMensual {
  mes: string;
  ejecutado: number;
  proyectado: number;
  varianza: number;
}

interface SugerenciaOptimizacion {
  id: string;
  tipo: 'ahorro' | 'reubicacion' | 'incremento' | 'alerta';
  prioridad: 'alta' | 'media' | 'baja';
  partida: string;
  descripcion: string;
  impactoEconomico: number;
  recomendacion: string;
  plazoImplementacion: string;
}

interface ComparativoPeriodos {
  periodoActual: string;
  periodoAnterior: string;
  crecimientoEjecucion: number;
  crecimientoPresupuesto: number;
  eficienciaRelativa: number;
}

export default function PresupuestosReportes() {
  const { toast } = useToast();
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState<string>('2025');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatPercentage = (value: number, decimals: number = 1) => {
    return `${value.toFixed(decimals)}%`;
  };

  const getEficienciaBadge = (eficiencia: string) => {
    switch (eficiencia) {
      case 'excelente':
        return <Badge className="bg-green-100 text-green-800">Excelente</Badge>;
      case 'buena':
        return <Badge className="bg-blue-100 text-blue-800">Buena</Badge>;
      case 'regular':
        return <Badge className="bg-yellow-100 text-yellow-800">Regular</Badge>;
      case 'deficiente':
        return <Badge className="bg-red-100 text-red-800">Deficiente</Badge>;
      default:
        return <Badge variant="secondary">{eficiencia}</Badge>;
    }
  };

  const getPrioridadBadge = (prioridad: string) => {
    switch (prioridad) {
      case 'alta':
        return <Badge className="bg-red-100 text-red-800">Alta</Badge>;
      case 'media':
        return <Badge className="bg-yellow-100 text-yellow-800">Media</Badge>;
      case 'baja':
        return <Badge className="bg-blue-100 text-blue-800">Baja</Badge>;
      default:
        return <Badge variant="secondary">{prioridad}</Badge>;
    }
  };

  const getTipoSugerenciaIcon = (tipo: string) => {
    switch (tipo) {
      case 'ahorro':
        return <TrendingDown className="h-4 w-4 text-green-600" />;
      case 'reubicacion':
        return <BarChart3 className="h-4 w-4 text-blue-600" />;
      case 'incremento':
        return <TrendingUp className="h-4 w-4 text-orange-600" />;
      case 'alerta':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <Lightbulb className="h-4 w-4 text-gray-600" />;
    }
  };

  // Datos de análisis
  const analisisPresupuesto: AnalisisPresupuesto = {
    periodo: '2025',
    totalAprobado: 100000000,
    totalEjecutado: 65000000,
    porcentajeEjecucion: 65.0,
    varianzaAbsoluta: -35000000,
    varianzaPorcentual: -35.0,
    partidasSobreEjecutadas: 2,
    partidasBajoEjecutadas: 1,
    eficienciaGeneral: 'regular'
  };

  const tendenciasMensuales: TendenciaMensual[] = [
    { mes: 'Enero', ejecutado: 4500000, proyectado: 8333333, varianza: -3833333 },
    { mes: 'Febrero', ejecutado: 5200000, proyectado: 8333333, varianza: -3133333 },
    { mes: 'Marzo', ejecutado: 6800000, proyectado: 8333333, varianza: -1533333 },
    { mes: 'Abril', ejecutado: 7200000, proyectado: 8333333, varianza: -1133333 },
    { mes: 'Mayo', ejecutado: 8100000, proyectado: 8333333, varianza: -233333 },
    { mes: 'Junio', ejecutado: 8900000, proyectado: 8333333, varianza: 566667 },
    { mes: 'Julio', ejecutado: 9500000, proyectado: 8333333, varianza: 1166667 },
    { mes: 'Agosto', ejecutado: 10200000, proyectado: 8333333, varianza: 1866667 },
    { mes: 'Septiembre', ejecutado: 9800000, proyectado: 8333333, varianza: 1466667 },
    { mes: 'Octubre', ejecutado: 10500000, proyectado: 8333333, varianza: 2166667 },
    { mes: 'Noviembre', ejecutado: 10800000, proyectado: 8333333, varianza: 2466667 }
  ];

  const sugerenciasOptimizacion: SugerenciaOptimizacion[] = [
    {
      id: 'SUG-001',
      tipo: 'ahorro',
      prioridad: 'alta',
      partida: 'Servicios Públicos',
      descripcion: 'El consumo de energía eléctrica ha aumentado un 15% respecto al año anterior',
      impactoEconomico: 2400000,
      recomendacion: 'Implementar programa de eficiencia energética y concientización a residentes',
      plazoImplementacion: '3 meses'
    },
    {
      id: 'SUG-002',
      tipo: 'reubicacion',
      prioridad: 'media',
      partida: 'Mantenimiento General',
      descripcion: 'Fondos subutilizados en mantenimiento podrían reubicarse a reparaciones urgentes',
      impactoEconomico: 3000000,
      recomendacion: 'Reasignar $3M a reparaciones de ascensores y techos',
      plazoImplementacion: '1 mes'
    },
    {
      id: 'SUG-003',
      tipo: 'incremento',
      prioridad: 'alta',
      partida: 'Fondo de Reserva',
      descripcion: 'La reserva actual es insuficiente para emergencias mayores',
      impactoEconomico: 10000000,
      recomendacion: 'Incrementar aportes mensuales a la reserva en un 20%',
      plazoImplementacion: 'Inmediato'
    },
    {
      id: 'SUG-004',
      tipo: 'alerta',
      prioridad: 'alta',
      partida: 'Reparaciones Mayores',
      descripcion: 'Sobrepaso del 10% en reparaciones de ascensores',
      impactoEconomico: -2500000,
      recomendacion: 'Revisar contratos de mantenimiento y buscar proveedores alternativos',
      plazoImplementacion: '2 semanas'
    },
    {
      id: 'SUG-005',
      tipo: 'ahorro',
      prioridad: 'media',
      partida: 'Vigilancia y Seguridad',
      descripcion: 'Posibilidad de optimizar turnos de vigilancia nocturna',
      impactoEconomico: 1800000,
      recomendacion: 'Implementar sistema de rondas automatizadas y reducir personal nocturno',
      plazoImplementacion: '2 meses'
    }
  ];

  const comparativoPeriodos: ComparativoPeriodos = {
    periodoActual: '2025',
    periodoAnterior: '2024',
    crecimientoEjecucion: 12.5,
    crecimientoPresupuesto: 8.3,
    eficienciaRelativa: 4.2
  };

  const handleExportarReporte = (tipo: string) => {
    toast({
      title: "Exportando reporte",
      description: `Generando reporte ${tipo} para el período ${periodoSeleccionado}...`,
    });

    // Simular exportación
    setTimeout(() => {
      toast({
        title: "Reporte exportado",
        description: `El reporte ${tipo} ha sido generado y descargado exitosamente.`,
      });
    }, 2000);
  };

  const totalSugerencias = sugerenciasOptimizacion.length;
  const sugerenciasAltaPrioridad = sugerenciasOptimizacion.filter(s => s.prioridad === 'alta').length;
  const impactoTotalSugerencias = sugerenciasOptimizacion.reduce((sum, s) => sum + Math.abs(s.impactoEconomico), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reportes de Presupuestos</h1>
          <p className="text-muted-foreground">
            Análisis detallado de ejecución presupuestal y sugerencias de optimización
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/presupuestos/ejecucion">
            <Button variant="outline">
              Ver Ejecución
            </Button>
          </Link>
          <Link href="/presupuestos/partidas">
            <Button variant="outline">
              Gestionar Partidas
            </Button>
          </Link>
        </div>
      </div>

      {/* Selector de período y acciones */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="space-y-2">
                <Label htmlFor="periodo">Período de Análisis</Label>
                <Select value={periodoSeleccionado} onValueChange={setPeriodoSeleccionado}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2025">2025</SelectItem>
                    <SelectItem value="2026">2026</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => handleExportarReporte('PDF')}>
                <Download className="mr-2 h-4 w-4" />
                Exportar PDF
              </Button>
              <Button variant="outline" onClick={() => handleExportarReporte('Excel')}>
                <Download className="mr-2 h-4 w-4" />
                Exportar Excel
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resumen Ejecutivo */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Eficiencia General</CardTitle>
            <Target className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {getEficienciaBadge(analisisPresupuesto.eficienciaGeneral)}
            </div>
            <p className="text-xs text-muted-foreground">
              {formatPercentage(analisisPresupuesto.porcentajeEjecucion)} ejecutado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sugerencias Activas</CardTitle>
            <Lightbulb className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-yellow-600">{totalSugerencias}</div>
            <p className="text-xs text-muted-foreground">
              {sugerenciasAltaPrioridad} de alta prioridad
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Impacto Potencial</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-green-600">
              {formatCurrency(impactoTotalSugerencias)}
            </div>
            <p className="text-xs text-muted-foreground">
              en optimizaciones
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Crecimiento vs Año Anterior</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-purple-600">
              {formatPercentage(comparativoPeriodos.crecimientoEjecucion)}
            </div>
            <p className="text-xs text-muted-foreground">
              en ejecución
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs de reportes */}
      <Tabs defaultValue="analisis" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="analisis">Análisis Ejecutivo</TabsTrigger>
          <TabsTrigger value="tendencias">Tendencias</TabsTrigger>
          <TabsTrigger value="sugerencias">Sugerencias</TabsTrigger>
          <TabsTrigger value="comparativo">Comparativo</TabsTrigger>
        </TabsList>

        <TabsContent value="analisis" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Análisis Ejecutivo del Presupuesto {periodoSeleccionado}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold">Ejecución General</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Presupuesto Aprobado:</span>
                      <span className="font-mono font-semibold">{formatCurrency(analisisPresupuesto.totalAprobado)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Valor Ejecutado:</span>
                      <span className="font-mono font-semibold">{formatCurrency(analisisPresupuesto.totalEjecutado)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Varianza:</span>
                      <span className={`font-mono font-semibold ${analisisPresupuesto.varianzaAbsoluta < 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {formatCurrency(analisisPresupuesto.varianzaAbsoluta)}
                      </span>
                    </div>
                    <Progress value={analisisPresupuesto.porcentajeEjecucion} className="mt-2" />
                    <p className="text-xs text-muted-foreground text-center">
                      {formatPercentage(analisisPresupuesto.porcentajeEjecucion)} de ejecución
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold">Alertas y Estado</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 p-2 border rounded">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <span className="text-sm">{analisisPresupuesto.partidasSobreEjecutadas} partidas sobre-ejecutadas</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 border rounded">
                      <TrendingDown className="h-4 w-4 text-yellow-600" />
                      <span className="text-sm">{analisisPresupuesto.partidasBajoEjecutadas} partidas bajo-ejecutadas</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 border rounded">
                      <Target className="h-4 w-4 text-blue-600" />
                      <span className="text-sm">Eficiencia: {analisisPresupuesto.eficienciaGeneral}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tendencias" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tendencias de Ejecución Mensual</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mes</TableHead>
                    <TableHead>Ejecutado</TableHead>
                    <TableHead>Proyectado</TableHead>
                    <TableHead>Varianza</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tendenciasMensuales.map((tendencia, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{tendencia.mes}</TableCell>
                      <TableCell className="font-mono">{formatCurrency(tendencia.ejecutado)}</TableCell>
                      <TableCell className="font-mono text-muted-foreground">{formatCurrency(tendencia.proyectado)}</TableCell>
                      <TableCell className={`font-mono font-semibold ${
                        tendencia.varianza >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {formatCurrency(tendencia.varianza)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={tendencia.varianza >= 0 ? "default" : "destructive"}>
                          {tendencia.varianza >= 0 ? 'Sobre presupuesto' : 'Bajo presupuesto'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sugerencias" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sugerencias de Optimización</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sugerenciasOptimizacion.map((sugerencia) => (
                  <div key={sugerencia.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getTipoSugerenciaIcon(sugerencia.tipo)}
                        <h4 className="font-medium">{sugerencia.partida}</h4>
                      </div>
                      <div className="flex gap-2">
                        {getPrioridadBadge(sugerencia.prioridad)}
                        <Badge variant="outline" className="capitalize">
                          {sugerencia.tipo}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{sugerencia.descripcion}</p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Impacto económico:</span>
                        <span className={`ml-2 font-mono font-semibold ${
                          sugerencia.impactoEconomico > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {formatCurrency(Math.abs(sugerencia.impactoEconomico))}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium">Plazo:</span>
                        <span className="ml-2">{sugerencia.plazoImplementacion}</span>
                      </div>
                    </div>
                    <div className="mt-2 p-2 bg-blue-50 rounded text-sm">
                      <strong>Recomendación:</strong> {sugerencia.recomendacion}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparativo" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Comparativo Interanual</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Crecimiento en Ejecución</h4>
                  <div className="text-2xl font-bold text-green-600">
                    {formatPercentage(comparativoPeriodos.crecimientoEjecucion)}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    vs {comparativoPeriodos.periodoAnterior}
                  </p>
                </div>

                <div className="text-center p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Crecimiento Presupuestario</h4>
                  <div className="text-2xl font-bold text-blue-600">
                    {formatPercentage(comparativoPeriodos.crecimientoPresupuesto)}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    vs {comparativoPeriodos.periodoAnterior}
                  </p>
                </div>

                <div className="text-center p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Eficiencia Relativa</h4>
                  <div className="text-2xl font-bold text-purple-600">
                    {formatPercentage(comparativoPeriodos.eficienciaRelativa)}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    mejora en eficiencia
                  </p>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">Interpretación del Comparativo</h4>
                <p className="text-sm text-muted-foreground">
                  El período {comparativoPeriodos.periodoActual} muestra un crecimiento del{' '}
                  <strong>{formatPercentage(comparativoPeriodos.crecimientoEjecucion)}</strong> en ejecución
                  presupuestal comparado con {comparativoPeriodos.periodoAnterior}, superando el crecimiento
                  presupuestario del <strong>{formatPercentage(comparativoPeriodos.crecimientoPresupuesto)}</strong>.
                  Esto representa una mejora en la eficiencia relativa de{' '}
                  <strong>{formatPercentage(comparativoPeriodos.eficienciaRelativa)}</strong>.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}