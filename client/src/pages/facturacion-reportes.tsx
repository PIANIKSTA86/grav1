import { useState } from "react";
import { FileText, Download, Filter, Calendar, Building2, Users, DollarSign, TrendingUp, BarChart3, PieChart, Search, Eye, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
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
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { Separator } from "@/components/ui/separator";

interface FiltroReportes {
  fechaDesde: string;
  fechaHasta: string;
  unidades: string[];
  propietarios: string[];
  conceptos: string[];
  estados: string[];
  periodos: string[];
}

interface ReporteFacturacion {
  id: string;
  titulo: string;
  descripcion: string;
  tipo: 'facturacion' | 'unidades' | 'propietarios' | 'financiero';
  icono: React.ComponentType<{ className?: string }>;
  filtrosDisponibles: string[];
}

interface DatosReporte {
  id: string;
  periodo: string;
  unidad: string;
  propietario: string;
  concepto: string;
  valor: number;
  estado: 'pagado' | 'pendiente' | 'vencido';
  fechaEmision: string;
  fechaVencimiento: string;
  fechaPago?: string;
}

export function FacturacionReportes() {
  const [filtros, setFiltros] = useState<FiltroReportes>({
    fechaDesde: '',
    fechaHasta: '',
    unidades: [],
    propietarios: [],
    conceptos: [],
    estados: [],
    periodos: []
  });

  const [reporteSeleccionado, setReporteSeleccionado] = useState<string>('');
  const [vistaPreviaAbierta, setVistaPreviaAbierta] = useState(false);
  const [datosVistaPrevia, setDatosVistaPrevia] = useState<DatosReporte[]>([]);

  const reportesDisponibles: ReporteFacturacion[] = [
    {
      id: 'facturacion-general',
      titulo: 'Facturación General',
      descripcion: 'Resumen completo de facturación por períodos',
      tipo: 'facturacion',
      icono: FileText,
      filtrosDisponibles: ['fecha', 'periodo', 'estado']
    },
    {
      id: 'facturacion-por-unidad',
      titulo: 'Facturación por Unidad',
      descripcion: 'Detalle de facturación agrupado por unidad',
      tipo: 'facturacion',
      icono: Building2,
      filtrosDisponibles: ['fecha', 'unidad', 'estado']
    },
    {
      id: 'facturacion-por-propietario',
      titulo: 'Facturación por Propietario',
      descripcion: 'Facturación detallada por propietario',
      tipo: 'propietarios',
      icono: Users,
      filtrosDisponibles: ['fecha', 'propietario', 'estado']
    },
    {
      id: 'estado-cuenta-propietarios',
      titulo: 'Estado de Cuenta de Propietarios',
      descripcion: 'Estado actual de cuentas de todos los propietarios',
      tipo: 'propietarios',
      icono: DollarSign,
      filtrosDisponibles: ['fecha', 'propietario', 'estado']
    },
    {
      id: 'unidades-ocupadas',
      titulo: 'Unidades Ocupadas',
      descripcion: 'Listado de unidades con propietarios activos',
      tipo: 'unidades',
      icono: Building2,
      filtrosDisponibles: ['unidad', 'propietario']
    },
    {
      id: 'ingresos-por-concepto',
      titulo: 'Ingresos por Concepto',
      descripcion: 'Análisis de ingresos por tipo de concepto',
      tipo: 'financiero',
      icono: TrendingUp,
      filtrosDisponibles: ['fecha', 'periodo', 'concepto']
    },
    {
      id: 'mora-y-vencimientos',
      titulo: 'Mora y Vencimientos',
      descripcion: 'Facturas vencidas y en mora',
      tipo: 'financiero',
      icono: BarChart3,
      filtrosDisponibles: ['fecha', 'estado', 'dias_vencimiento']
    },
    {
      id: 'comparativo-periodos',
      titulo: 'Comparativo por Períodos',
      descripcion: 'Comparación de facturación entre períodos',
      tipo: 'financiero',
      icono: PieChart,
      filtrosDisponibles: ['fecha', 'periodo']
    }
  ];

  // Datos de ejemplo
  const datosEjemplo: DatosReporte[] = [
    {
      id: 'F-001',
      periodo: '2024-11',
      unidad: 'A-101',
      propietario: 'Juan Pérez',
      concepto: 'Cuota Administración',
      valor: 850000,
      estado: 'pagado',
      fechaEmision: '2024-11-01',
      fechaVencimiento: '2024-11-15',
      fechaPago: '2024-11-10'
    },
    {
      id: 'F-002',
      periodo: '2024-11',
      unidad: 'A-102',
      propietario: 'María González',
      concepto: 'Cuota Administración',
      valor: 850000,
      estado: 'pendiente',
      fechaEmision: '2024-11-01',
      fechaVencimiento: '2024-11-15'
    },
    {
      id: 'F-003',
      periodo: '2024-11',
      unidad: 'B-201',
      propietario: 'Carlos Rodríguez',
      concepto: 'Cuota Administración',
      valor: 750000,
      estado: 'vencido',
      fechaEmision: '2024-11-01',
      fechaVencimiento: '2024-11-15'
    },
    {
      id: 'F-004',
      periodo: '2024-10',
      unidad: 'A-101',
      propietario: 'Juan Pérez',
      concepto: 'Cuota Administración',
      valor: 850000,
      estado: 'pagado',
      fechaEmision: '2024-10-01',
      fechaVencimiento: '2024-10-15',
      fechaPago: '2024-10-12'
    }
  ];

  const unidadesDisponibles = ['A-101', 'A-102', 'B-201', 'B-202', 'C-301'];
  const propietariosDisponibles = ['Juan Pérez', 'María González', 'Carlos Rodríguez', 'Ana López'];
  const conceptosDisponibles = ['Cuota Administración', 'Fondo Reserva', 'Intereses Mora', 'Cuota Extra'];
  const periodosDisponibles = ['2024-11', '2024-10', '2024-09', '2024-08'];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'pagado':
        return <Badge className="bg-green-100 text-green-800">Pagado</Badge>;
      case 'pendiente':
        return <Badge className="bg-yellow-100 text-yellow-800">Pendiente</Badge>;
      case 'vencido':
        return <Badge className="bg-red-100 text-red-800">Vencido</Badge>;
      default:
        return <Badge variant="secondary">{estado}</Badge>;
    }
  };

  const handleGenerarReporte = (reporteId: string) => {
    // Filtrar datos según los criterios seleccionados
    let datosFiltrados = [...datosEjemplo];

    if (filtros.fechaDesde) {
      datosFiltrados = datosFiltrados.filter(d =>
        new Date(d.fechaEmision) >= new Date(filtros.fechaDesde)
      );
    }

    if (filtros.fechaHasta) {
      datosFiltrados = datosFiltrados.filter(d =>
        new Date(d.fechaEmision) <= new Date(filtros.fechaHasta)
      );
    }

    if (filtros.unidades.length > 0) {
      datosFiltrados = datosFiltrados.filter(d =>
        filtros.unidades.includes(d.unidad)
      );
    }

    if (filtros.propietarios.length > 0) {
      datosFiltrados = datosFiltrados.filter(d =>
        filtros.propietarios.includes(d.propietario)
      );
    }

    if (filtros.conceptos.length > 0) {
      datosFiltrados = datosFiltrados.filter(d =>
        filtros.conceptos.includes(d.concepto)
      );
    }

    if (filtros.estados.length > 0) {
      datosFiltrados = datosFiltrados.filter(d =>
        filtros.estados.includes(d.estado)
      );
    }

    if (filtros.periodos.length > 0) {
      datosFiltrados = datosFiltrados.filter(d =>
        filtros.periodos.includes(d.periodo)
      );
    }

    setDatosVistaPrevia(datosFiltrados);
    setReporteSeleccionado(reporteId);
    setVistaPreviaAbierta(true);
  };

  const handleExportar = (formato: 'pdf' | 'excel' | 'csv') => {
    // Simular exportación
    console.log(`Exportando reporte ${reporteSeleccionado} en formato ${formato}`);
    alert(`Reporte exportado exitosamente en formato ${formato.toUpperCase()}`);
  };

  const handleImprimir = () => {
    window.print();
  };

  const FiltrosPanel = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filtros de Reporte
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="fecha-desde">Fecha Desde</Label>
            <Input
              id="fecha-desde"
              type="date"
              value={filtros.fechaDesde}
              onChange={(e) => setFiltros(prev => ({ ...prev, fechaDesde: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fecha-hasta">Fecha Hasta</Label>
            <Input
              id="fecha-hasta"
              type="date"
              value={filtros.fechaHasta}
              onChange={(e) => setFiltros(prev => ({ ...prev, fechaHasta: e.target.value }))}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Unidades</Label>
            <div className="max-h-32 overflow-y-auto space-y-2">
              {unidadesDisponibles.map((unidad) => (
                <div key={unidad} className="flex items-center space-x-2">
                  <Checkbox
                    id={`unidad-${unidad}`}
                    checked={filtros.unidades.includes(unidad)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setFiltros(prev => ({ ...prev, unidades: [...prev.unidades, unidad] }));
                      } else {
                        setFiltros(prev => ({ ...prev, unidades: prev.unidades.filter(u => u !== unidad) }));
                      }
                    }}
                  />
                  <Label htmlFor={`unidad-${unidad}`} className="text-sm">{unidad}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Propietarios</Label>
            <div className="max-h-32 overflow-y-auto space-y-2">
              {propietariosDisponibles.map((propietario) => (
                <div key={propietario} className="flex items-center space-x-2">
                  <Checkbox
                    id={`propietario-${propietario}`}
                    checked={filtros.propietarios.includes(propietario)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setFiltros(prev => ({ ...prev, propietarios: [...prev.propietarios, propietario] }));
                      } else {
                        setFiltros(prev => ({ ...prev, propietarios: prev.propietarios.filter(p => p !== propietario) }));
                      }
                    }}
                  />
                  <Label htmlFor={`propietario-${propietario}`} className="text-sm">{propietario}</Label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Conceptos</Label>
            <div className="max-h-24 overflow-y-auto space-y-2">
              {conceptosDisponibles.map((concepto) => (
                <div key={concepto} className="flex items-center space-x-2">
                  <Checkbox
                    id={`concepto-${concepto}`}
                    checked={filtros.conceptos.includes(concepto)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setFiltros(prev => ({ ...prev, conceptos: [...prev.conceptos, concepto] }));
                      } else {
                        setFiltros(prev => ({ ...prev, conceptos: prev.conceptos.filter(c => c !== concepto) }));
                      }
                    }}
                  />
                  <Label htmlFor={`concepto-${concepto}`} className="text-sm">{concepto}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Estados</Label>
            <div className="space-y-2">
              {['pagado', 'pendiente', 'vencido'].map((estado) => (
                <div key={estado} className="flex items-center space-x-2">
                  <Checkbox
                    id={`estado-${estado}`}
                    checked={filtros.estados.includes(estado)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setFiltros(prev => ({ ...prev, estados: [...prev.estados, estado] }));
                      } else {
                        setFiltros(prev => ({ ...prev, estados: prev.estados.filter(e => e !== estado) }));
                      }
                    }}
                  />
                  <Label htmlFor={`estado-${estado}`} className="text-sm capitalize">{estado}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Períodos</Label>
            <div className="max-h-24 overflow-y-auto space-y-2">
              {periodosDisponibles.map((periodo) => (
                <div key={periodo} className="flex items-center space-x-2">
                  <Checkbox
                    id={`periodo-${periodo}`}
                    checked={filtros.periodos.includes(periodo)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setFiltros(prev => ({ ...prev, periodos: [...prev.periodos, periodo] }));
                      } else {
                        setFiltros(prev => ({ ...prev, periodos: prev.periodos.filter(p => p !== periodo) }));
                      }
                    }}
                  />
                  <Label htmlFor={`periodo-${periodo}`} className="text-sm">{periodo}</Label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setFiltros({
              fechaDesde: '',
              fechaHasta: '',
              unidades: [],
              propietarios: [],
              conceptos: [],
              estados: [],
              periodos: []
            })}
          >
            Limpiar Filtros
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const ReportesGrid = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {reportesDisponibles.map((reporte) => {
        const IconComponent = reporte.icono;
        return (
          <Card key={reporte.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <IconComponent className="h-8 w-8 text-blue-600" />
                <Badge variant="outline" className="capitalize">
                  {reporte.tipo}
                </Badge>
              </div>
              <CardTitle className="text-lg">{reporte.titulo}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">{reporte.descripcion}</p>
              <div className="flex flex-wrap gap-1 mb-4">
                {reporte.filtrosDisponibles.map((filtro) => (
                  <Badge key={filtro} variant="secondary" className="text-xs">
                    {filtro.replace('_', ' ')}
                  </Badge>
                ))}
              </div>
              <Button
                onClick={() => handleGenerarReporte(reporte.id)}
                className="w-full"
              >
                <Eye className="mr-2 h-4 w-4" />
                Generar Reporte
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );

  const VistaPreviaDialog = () => (
    <Dialog open={vistaPreviaAbierta} onOpenChange={setVistaPreviaAbierta}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Vista Previa del Reporte
          </DialogTitle>
          <DialogDescription>
            {reportesDisponibles.find(r => r.id === reporteSeleccionado)?.titulo}
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-2 mb-4">
          <Button onClick={() => handleExportar('pdf')} variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exportar PDF
          </Button>
          <Button onClick={() => handleExportar('excel')} variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exportar Excel
          </Button>
          <Button onClick={() => handleExportar('csv')} variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exportar CSV
          </Button>
          <Button onClick={handleImprimir} variant="outline">
            <Printer className="mr-2 h-4 w-4" />
            Imprimir
          </Button>
        </div>

        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Período</TableHead>
                <TableHead>Unidad</TableHead>
                <TableHead>Propietario</TableHead>
                <TableHead>Concepto</TableHead>
                <TableHead className="text-right">Valor</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Fecha Emisión</TableHead>
                <TableHead>Fecha Vencimiento</TableHead>
                <TableHead>Fecha Pago</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {datosVistaPrevia.map((dato) => (
                <TableRow key={dato.id}>
                  <TableCell className="font-mono text-sm">{dato.id}</TableCell>
                  <TableCell>{dato.periodo}</TableCell>
                  <TableCell>{dato.unidad}</TableCell>
                  <TableCell>{dato.propietario}</TableCell>
                  <TableCell>{dato.concepto}</TableCell>
                  <TableCell className="text-right font-mono">{formatCurrency(dato.valor)}</TableCell>
                  <TableCell>{getEstadoBadge(dato.estado)}</TableCell>
                  <TableCell>{new Date(dato.fechaEmision).toLocaleDateString('es-CO')}</TableCell>
                  <TableCell>{new Date(dato.fechaVencimiento).toLocaleDateString('es-CO')}</TableCell>
                  <TableCell>
                    {dato.fechaPago ? new Date(dato.fechaPago).toLocaleDateString('es-CO') : '-'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex justify-between items-center mt-4 pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            Total de registros: {datosVistaPrevia.length}
          </div>
          <div className="text-sm text-muted-foreground">
            Valor total: {formatCurrency(datosVistaPrevia.reduce((sum, dato) => sum + dato.valor, 0))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reportes de Facturación</h1>
          <p className="text-muted-foreground">
            Genera informes detallados sobre facturación, unidades y propietarios
          </p>
        </div>
      </div>

      <Tabs defaultValue="reportes" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="reportes">Reportes Disponibles</TabsTrigger>
          <TabsTrigger value="filtros">Configurar Filtros</TabsTrigger>
        </TabsList>

        <TabsContent value="reportes" className="space-y-4">
          <ReportesGrid />
        </TabsContent>

        <TabsContent value="filtros" className="space-y-4">
          <FiltrosPanel />
        </TabsContent>
      </Tabs>

      <VistaPreviaDialog />

      {/* Estadísticas rápidas */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Facturado</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-green-600">
              {formatCurrency(datosEjemplo.reduce((sum, dato) => sum + dato.valor, 0))}
            </div>
            <p className="text-xs text-muted-foreground">
              período actual
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Facturas Pagadas</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-blue-600">
              {datosEjemplo.filter(d => d.estado === 'pagado').length}
            </div>
            <p className="text-xs text-muted-foreground">
              de {datosEjemplo.length} totales
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Facturas Pendientes</CardTitle>
            <BarChart3 className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-yellow-600">
              {datosEjemplo.filter(d => d.estado === 'pendiente').length}
            </div>
            <p className="text-xs text-muted-foreground">
              requieren atención
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Facturas Vencidas</CardTitle>
            <PieChart className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-red-600">
              {datosEjemplo.filter(d => d.estado === 'vencido').length}
            </div>
            <p className="text-xs text-muted-foreground">
              requieren gestión
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}