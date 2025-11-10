import { useState } from "react";
import { BarChart3, TrendingUp, TrendingDown, AlertTriangle, Download, FileText, Calendar, DollarSign, Package, PieChart, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

interface ReporteDepreciacion {
  periodo: string;
  totalActivos: number;
  valorBruto: number;
  depreciacionAcumulada: number;
  valorNeto: number;
  depreciacionMensual: number;
}

interface ActivoPorCategoria {
  categoria: string;
  cantidad: number;
  valorBruto: number;
  valorNeto: number;
  porcentajeTotal: number;
}

interface ActivoCritico {
  id: string;
  nombre: string;
  categoria: string;
  alerta: 'vida_util' | 'mantenimiento' | 'depreciacion';
  descripcion: string;
  prioridad: 'alta' | 'media' | 'baja';
  accionRecomendada: string;
}

interface MovimientoActivo {
  fecha: string;
  tipo: 'alta' | 'baja' | 'revaluacion' | 'mantenimiento';
  activo: string;
  descripcion: string;
  valor: number;
  responsable: string;
}

export default function ActivosFijosReportes() {
  const { toast } = useToast();
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState<string>('2024');

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-CO");
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

  const getAlertaBadge = (alerta: string) => {
    const colors = {
      'vida_util': 'bg-orange-100 text-orange-800',
      'mantenimiento': 'bg-red-100 text-red-800',
      'depreciacion': 'bg-yellow-100 text-yellow-800'
    };
    const labels = {
      'vida_util': 'Vida Útil',
      'mantenimiento': 'Mantenimiento',
      'depreciacion': 'Depreciación'
    };
    return <Badge className={colors[alerta as keyof typeof colors] || colors.depreciacion}>
      {labels[alerta as keyof typeof labels] || alerta}
    </Badge>;
  };

  // Datos de ejemplo
  const reporteDepreciacion: ReporteDepreciacion[] = [
    {
      periodo: '2024-11',
      totalActivos: 15,
      valorBruto: 650000000,
      depreciacionAcumulada: 85000000,
      valorNeto: 565000000,
      depreciacionMensual: 2500000
    },
    {
      periodo: '2024-10',
      totalActivos: 15,
      valorBruto: 650000000,
      depreciacionAcumulada: 82500000,
      valorNeto: 567500000,
      depreciacionMensual: 2500000
    },
    {
      periodo: '2024-09',
      totalActivos: 14,
      valorBruto: 620000000,
      depreciacionAcumulada: 80000000,
      valorNeto: 540000000,
      depreciacionMensual: 2400000
    }
  ];

  const activosPorCategoria: ActivoPorCategoria[] = [
    {
      categoria: 'Edificios',
      cantidad: 1,
      valorBruto: 500000000,
      valorNeto: 450000000,
      porcentajeTotal: 69.2
    },
    {
      categoria: 'Vehículos',
      cantidad: 2,
      valorBruto: 80000000,
      valorNeto: 64000000,
      porcentajeTotal: 9.9
    },
    {
      categoria: 'Equipos',
      cantidad: 5,
      valorBruto: 45000000,
      valorNeto: 22500000,
      porcentajeTotal: 3.5
    },
    {
      categoria: 'Mobiliario',
      cantidad: 4,
      valorBruto: 20000000,
      valorNeto: 16000000,
      porcentajeTotal: 2.5
    },
    {
      categoria: 'Computadores',
      cantidad: 3,
      valorBruto: 5000000,
      valorNeto: 2500000,
      porcentajeTotal: 0.4
    }
  ];

  const activosCriticos: ActivoCritico[] = [
    {
      id: 'AF-003',
      nombre: 'Ascensor Principal',
      categoria: 'equipos',
      alerta: 'mantenimiento',
      descripcion: 'Mantenimiento preventivo vencido hace 15 días',
      prioridad: 'alta',
      accionRecomendada: 'Programar mantenimiento inmediato y verificar estado del equipo'
    },
    {
      id: 'AF-002',
      nombre: 'Vehículo Toyota Hilux',
      categoria: 'vehiculos',
      alerta: 'vida_util',
      descripcion: 'Vida útil restante: 3 años (36 meses)',
      prioridad: 'media',
      accionRecomendada: 'Evaluar renovación o venta del vehículo'
    },
    {
      id: 'AF-008',
      nombre: 'Aire Acondicionado Sala Principal',
      categoria: 'equipos',
      alerta: 'depreciacion',
      descripcion: 'Depreciación del 85% completada',
      prioridad: 'baja',
      accionRecomendada: 'Considerar reemplazo en próximos 6 meses'
    }
  ];

  const movimientosRecientes: MovimientoActivo[] = [
    {
      fecha: '2024-11-15',
      tipo: 'mantenimiento',
      activo: 'Ascensor Principal',
      descripcion: 'Mantenimiento preventivo mensual',
      valor: 500000,
      responsable: 'Técnico Elevadores S.A.'
    },
    {
      fecha: '2024-11-10',
      tipo: 'baja',
      activo: 'Computador Portátil Dell',
      descripcion: 'Baja por deterioro irreparable',
      valor: -2300000,
      responsable: 'Jefe de Sistemas'
    },
    {
      fecha: '2024-11-05',
      tipo: 'alta',
      activo: 'Impresora Multifuncional',
      descripcion: 'Nuevo activo registrado',
      valor: 2500000,
      responsable: 'Coordinador Administrativo'
    },
    {
      fecha: '2024-10-30',
      tipo: 'revaluacion',
      activo: 'Edificio Principal',
      descripcion: 'Revaluación por incremento en valor de mercado',
      valor: 30000000,
      responsable: 'Contador General'
    }
  ];

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

  const totalActivos = activosPorCategoria.reduce((sum, cat) => sum + cat.cantidad, 0);
  const valorTotalBruto = activosPorCategoria.reduce((sum, cat) => sum + cat.valorBruto, 0);
  const valorTotalNeto = activosPorCategoria.reduce((sum, cat) => sum + cat.valorNeto, 0);
  const depreciacionTotal = valorTotalBruto - valorTotalNeto;
  const alertasAltas = activosCriticos.filter(a => a.prioridad === 'alta').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reportes de Activos Fijos</h1>
          <p className="text-muted-foreground">
            Análisis detallado y reportes del parque de activos fijos
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
          <Link href="/activos-fijos/config">
            <Button variant="outline">
              Configuración
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
                    <SelectItem value="2023">2023</SelectItem>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2025">2025</SelectItem>
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
            <CardTitle className="text-sm font-medium">Total Activos</CardTitle>
            <Package className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalActivos}</div>
            <p className="text-xs text-muted-foreground">
              activos registrados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Neto Total</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">{formatCurrency(valorTotalNeto)}</div>
            <p className="text-xs text-muted-foreground">
              valor contable actual
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Depreciación Acumulada</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-red-600">{formatCurrency(depreciacionTotal)}</div>
            <p className="text-xs text-muted-foreground">
              {formatPercentage((depreciacionTotal / valorTotalBruto) * 100)} del valor bruto
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alertas Críticas</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{alertasAltas}</div>
            <p className="text-xs text-muted-foreground">
              requieren atención inmediata
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs de reportes */}
      <Tabs defaultValue="depreciacion" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="depreciacion">Depreciación</TabsTrigger>
          <TabsTrigger value="categorias">Por Categoría</TabsTrigger>
          <TabsTrigger value="alertas">Alertas</TabsTrigger>
          <TabsTrigger value="movimientos">Movimientos</TabsTrigger>
        </TabsList>

        <TabsContent value="depreciacion" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Evolución de la Depreciación - {periodoSeleccionado}</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Período</TableHead>
                    <TableHead>Activos</TableHead>
                    <TableHead>Valor Bruto</TableHead>
                    <TableHead>Depreciación Acumulada</TableHead>
                    <TableHead>Valor Neto</TableHead>
                    <TableHead>Depreciación Mensual</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reporteDepreciacion.map((reporte, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{reporte.periodo}</TableCell>
                      <TableCell>{reporte.totalActivos}</TableCell>
                      <TableCell className="font-mono">{formatCurrency(reporte.valorBruto)}</TableCell>
                      <TableCell className="font-mono text-red-600">{formatCurrency(reporte.depreciacionAcumulada)}</TableCell>
                      <TableCell className="font-mono font-semibold">{formatCurrency(reporte.valorNeto)}</TableCell>
                      <TableCell className="font-mono">{formatCurrency(reporte.depreciacionMensual)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categorias" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Activos por Categoría</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Categoría</TableHead>
                    <TableHead>Cantidad</TableHead>
                    <TableHead>Valor Bruto</TableHead>
                    <TableHead>Valor Neto</TableHead>
                    <TableHead>% del Total</TableHead>
                    <TableHead>Progreso</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activosPorCategoria.map((categoria, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium capitalize">{categoria.categoria}</TableCell>
                      <TableCell>{categoria.cantidad}</TableCell>
                      <TableCell className="font-mono">{formatCurrency(categoria.valorBruto)}</TableCell>
                      <TableCell className="font-mono font-semibold">{formatCurrency(categoria.valorNeto)}</TableCell>
                      <TableCell>{formatPercentage(categoria.porcentajeTotal)}</TableCell>
                      <TableCell>
                        <Progress
                          value={categoria.porcentajeTotal}
                          className="w-20"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alertas" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Alertas y Recomendaciones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activosCriticos.map((alerta) => (
                  <div key={alerta.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                        <div>
                          <h4 className="font-medium">{alerta.nombre}</h4>
                          <p className="text-sm text-muted-foreground">{alerta.id} • {alerta.categoria}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {getAlertaBadge(alerta.alerta)}
                        {getPrioridadBadge(alerta.prioridad)}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{alerta.descripcion}</p>
                    <div className="p-2 bg-blue-50 rounded text-sm">
                      <strong>Recomendación:</strong> {alerta.accionRecomendada}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="movimientos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Movimientos Recientes</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Activo</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Responsable</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {movimientosRecientes.map((movimiento, index) => (
                    <TableRow key={index}>
                      <TableCell>{formatDate(movimiento.fecha)}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {movimiento.tipo}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">{movimiento.activo}</TableCell>
                      <TableCell className="max-w-60 truncate">{movimiento.descripcion}</TableCell>
                      <TableCell className={`font-mono font-semibold ${
                        movimiento.valor >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {formatCurrency(movimiento.valor)}
                      </TableCell>
                      <TableCell className="max-w-40 truncate">{movimiento.responsable}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}