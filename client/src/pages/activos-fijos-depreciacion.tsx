import { useState } from "react";
import { Calculator, FileText, Calendar, TrendingDown, CheckCircle, AlertTriangle, Download, Play, RotateCcw } from "lucide-react";
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
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

interface CalculoDepreciacion {
  id: string;
  periodo: string;
  fechaCalculo: string;
  estado: 'pendiente' | 'procesando' | 'completado' | 'error';
  totalActivos: number;
  totalDepreciacion: number;
  asientosGenerados: number;
  errores: string[];
}

interface DetalleDepreciacion {
  activoId: string;
  activoNombre: string;
  valorActual: number;
  depreciacionMensual: number;
  depreciacionAcumulada: number;
  vidaUtilRestante: number;
  cuentaDepreciacion: string;
  cuentaGasto: string;
}

export default function ActivosFijosDepreciacion() {
  const { toast } = useToast();
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState<string>('2024-11');
  const [isProcessing, setIsProcessing] = useState(false);

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
      case 'pendiente':
        return <Badge className="bg-gray-100 text-gray-800">Pendiente</Badge>;
      case 'procesando':
        return <Badge className="bg-blue-100 text-blue-800">Procesando</Badge>;
      case 'completado':
        return <Badge className="bg-green-100 text-green-800">Completado</Badge>;
      case 'error':
        return <Badge className="bg-red-100 text-red-800">Error</Badge>;
      default:
        return <Badge variant="secondary">{estado}</Badge>;
    }
  };

  // Datos de ejemplo
  const historialCalculos: CalculoDepreciacion[] = [
    {
      id: 'DEP-2024-11',
      periodo: '2024-11',
      fechaCalculo: '2024-11-01',
      estado: 'completado',
      totalActivos: 15,
      totalDepreciacion: 2500000,
      asientosGenerados: 1,
      errores: []
    },
    {
      id: 'DEP-2024-10',
      periodo: '2024-10',
      fechaCalculo: '2024-10-01',
      estado: 'completado',
      totalActivos: 15,
      totalDepreciacion: 2500000,
      asientosGenerados: 1,
      errores: []
    },
    {
      id: 'DEP-2024-09',
      periodo: '2024-09',
      fechaCalculo: '2024-09-01',
      estado: 'completado',
      totalActivos: 14,
      totalDepreciacion: 2400000,
      asientosGenerados: 1,
      errores: []
    },
    {
      id: 'DEP-2024-08',
      periodo: '2024-08',
      fechaCalculo: '2024-08-01',
      estado: 'error',
      totalActivos: 14,
      totalDepreciacion: 0,
      asientosGenerados: 0,
      errores: ['Error de conexión con base de datos']
    }
  ];

  const detalleDepreciacion: DetalleDepreciacion[] = [
    {
      activoId: 'AF-001',
      activoNombre: 'Edificio Principal',
      valorActual: 450000000,
      depreciacionMensual: 2083333,
      depreciacionAcumulada: 50000000,
      vidaUtilRestante: 180,
      cuentaDepreciacion: '240801 - Depreciación Edificios',
      cuentaGasto: '510501 - Gasto Depreciación'
    },
    {
      activoId: 'AF-002',
      activoNombre: 'Vehículo Toyota Hilux',
      valorActual: 96000000,
      depreciacionMensual: 2000000,
      depreciacionAcumulada: 24000000,
      vidaUtilRestante: 36,
      cuentaDepreciacion: '240802 - Depreciación Vehículos',
      cuentaGasto: '510501 - Gasto Depreciación'
    },
    {
      activoId: 'AF-003',
      activoNombre: 'Ascensor Principal',
      valorActual: 40000000,
      depreciacionMensual: 444444,
      depreciacionAcumulada: 40000000,
      vidaUtilRestante: 120,
      cuentaDepreciacion: '240803 - Depreciación Equipos',
      cuentaGasto: '510501 - Gasto Depreciación'
    }
  ];

  const handleCalcularDepreciacion = async () => {
    setIsProcessing(true);

    // Simular procesamiento
    toast({
      title: "Calculando depreciación",
      description: `Iniciando cálculo de depreciación para el período ${periodoSeleccionado}...`,
    });

    setTimeout(() => {
      setIsProcessing(false);
      toast({
        title: "Depreciación calculada",
        description: "La depreciación mensual ha sido calculada y los asientos contables generados exitosamente.",
      });
    }, 3000);
  };

  const handleRevertirCalculo = (id: string) => {
    toast({
      title: "Revertir cálculo",
      description: `El cálculo ${id} ha sido revertido exitosamente.`,
    });
  };

  const handleGenerarAsiento = (id: string) => {
    toast({
      title: "Asiento generado",
      description: `El asiento contable para ${id} ha sido generado exitosamente.`,
    });
  };

  const handleExportarDetalle = () => {
    toast({
      title: "Exportando detalle",
      description: "El detalle de depreciación está siendo exportado...",
    });
  };

  const calculoActual = historialCalculos.find(c => c.periodo === periodoSeleccionado);
  const totalDepreciacionMes = detalleDepreciacion.reduce((sum, item) => sum + item.depreciacionMensual, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Depreciación de Activos Fijos</h1>
          <p className="text-muted-foreground">
            Cálculo mensual de depreciación y generación de asientos contables
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/activos-fijos/catalogo">
            <Button variant="outline">
              Catálogo
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
        </div>
      </div>

      {/* Selector de período y acciones */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="space-y-2">
                <Label htmlFor="periodo">Período de Depreciación</Label>
                <Select value={periodoSeleccionado} onValueChange={setPeriodoSeleccionado}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2024-11">Noviembre 2024</SelectItem>
                    <SelectItem value="2024-12">Diciembre 2024</SelectItem>
                    <SelectItem value="2025-01">Enero 2025</SelectItem>
                    <SelectItem value="2025-02">Febrero 2025</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {calculoActual && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Estado:</span>
                  {getEstadoBadge(calculoActual.estado)}
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleExportarDetalle}>
                <Download className="mr-2 h-4 w-4" />
                Exportar Detalle
              </Button>
              <Button
                onClick={handleCalcularDepreciacion}
                disabled={isProcessing || (calculoActual?.estado === 'completado')}
              >
                {isProcessing ? (
                  <RotateCcw className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Play className="mr-2 h-4 w-4" />
                )}
                {isProcessing ? 'Procesando...' : 'Calcular Depreciación'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resumen del período */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Activos</CardTitle>
            <Calculator className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{detalleDepreciacion.length}</div>
            <p className="text-xs text-muted-foreground">
              activos depreciables
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Depreciación Mensual</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">{formatCurrency(totalDepreciacionMes)}</div>
            <p className="text-xs text-muted-foreground">
              valor del mes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Asientos Generados</CardTitle>
            <FileText className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {calculoActual?.asientosGenerados || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              asientos contables
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progreso</CardTitle>
            <CheckCircle className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {calculoActual?.estado === 'completado' ? '100%' : '0%'}
            </div>
            <Progress
              value={calculoActual?.estado === 'completado' ? 100 : 0}
              className="mt-2"
            />
          </CardContent>
        </Card>
      </div>

      {/* Detalle de depreciación */}
      <Card>
        <CardHeader>
          <CardTitle>Detalle de Depreciación - {periodoSeleccionado}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Activo</TableHead>
                <TableHead>Valor Actual</TableHead>
                <TableHead>Depreciación Mensual</TableHead>
                <TableHead>Depreciación Acumulada</TableHead>
                <TableHead>Vida Restante</TableHead>
                <TableHead>Cuenta Depreciación</TableHead>
                <TableHead>Cuenta Gasto</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {detalleDepreciacion.map((item) => (
                <TableRow key={item.activoId}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{item.activoNombre}</p>
                      <p className="text-sm text-muted-foreground font-mono">{item.activoId}</p>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono font-semibold">{formatCurrency(item.valorActual)}</TableCell>
                  <TableCell className="font-mono text-red-600">{formatCurrency(item.depreciacionMensual)}</TableCell>
                  <TableCell className="font-mono">{formatCurrency(item.depreciacionAcumulada)}</TableCell>
                  <TableCell>{item.vidaUtilRestante} meses</TableCell>
                  <TableCell className="max-w-40 truncate text-sm">{item.cuentaDepreciacion}</TableCell>
                  <TableCell className="max-w-40 truncate text-sm">{item.cuentaGasto}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Historial de cálculos */}
      <Card>
        <CardHeader>
          <CardTitle>Historial de Cálculos</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Período</TableHead>
                <TableHead>Fecha Cálculo</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Activos</TableHead>
                <TableHead>Total Depreciación</TableHead>
                <TableHead>Asientos</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {historialCalculos.map((calculo) => (
                <TableRow key={calculo.id}>
                  <TableCell className="font-medium">{calculo.periodo}</TableCell>
                  <TableCell>{formatDate(calculo.fechaCalculo)}</TableCell>
                  <TableCell>{getEstadoBadge(calculo.estado)}</TableCell>
                  <TableCell>{calculo.totalActivos}</TableCell>
                  <TableCell className="font-mono">{formatCurrency(calculo.totalDepreciacion)}</TableCell>
                  <TableCell>{calculo.asientosGenerados}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {calculo.estado === 'completado' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleGenerarAsiento(calculo.id)}
                        >
                          <FileText className="h-4 w-4" />
                        </Button>
                      )}
                      {calculo.estado === 'error' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRevertirCalculo(calculo.id)}
                        >
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                      )}
                      {calculo.errores.length > 0 && (
                        <Button variant="ghost" size="sm">
                          <AlertTriangle className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}