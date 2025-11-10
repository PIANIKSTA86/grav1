import { useState } from "react";
import { CheckCircle, Save, ArrowRight, ArrowLeft, FileText, Download, AlertTriangle, Calculator, Users, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";

interface RevisionNomina {
  id: string;
  nombre: string;
  apellido: string;
  cargo: string;
  totalDevengado: number;
  totalDeducciones: number;
  netoPagar: number;
  observaciones: string;
  requiereAjuste: boolean;
}

export default function NominaRevision() {
  const { toast } = useToast();
  const [aprobacionDialog, setAprobacionDialog] = useState(false);
  const [comentariosAprobacion, setComentariosAprobacion] = useState('');
  const [nominaAprobada, setNominaAprobada] = useState(false);

  // Datos de ejemplo - revisión final de nómina
  const [revisionNomina] = useState<RevisionNomina[]>([
    {
      id: 'EMP-001',
      nombre: 'María',
      apellido: 'González',
      cargo: 'Administradora',
      totalDevengado: 2670606,
      totalDeducciones: 227614,
      netoPagar: 2442992,
      observaciones: '',
      requiereAjuste: false
    },
    {
      id: 'EMP-002',
      nombre: 'Carlos',
      apellido: 'Rodríguez',
      cargo: 'Conserje',
      totalDevengado: 1640606,
      totalDeducciones: 139845,
      netoPagar: 1501761,
      observaciones: 'Incapacidad médica registrada - revisar días cotizados',
      requiereAjuste: true
    },
    {
      id: 'EMP-003',
      nombre: 'Ana',
      apellido: 'López',
      cargo: 'Auxiliar de Limpieza',
      totalDevengado: 1440606,
      totalDeducciones: 120791,
      netoPagar: 1319815,
      observaciones: '',
      requiereAjuste: false
    }
  ]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const totalEmpleados = revisionNomina.length;
  const empleadosRequierenAjuste = revisionNomina.filter(emp => emp.requiereAjuste).length;
  const totalDevengado = revisionNomina.reduce((sum, emp) => sum + emp.totalDevengado, 0);
  const totalDeducciones = revisionNomina.reduce((sum, emp) => sum + emp.totalDeducciones, 0);
  const totalNomina = revisionNomina.reduce((sum, emp) => sum + emp.netoPagar, 0);

  const handleAprobarNomina = () => {
    if (!comentariosAprobacion.trim()) {
      toast({
        title: "Comentarios requeridos",
        description: "Por favor ingrese comentarios para la aprobación.",
        variant: "destructive",
      });
      return;
    }

    setNominaAprobada(true);
    setAprobacionDialog(false);

    toast({
      title: "Nómina aprobada",
      description: "La nómina ha sido aprobada exitosamente.",
    });
  };

  const handleExportarRevision = () => {
    toast({
      title: "Exportando revisión",
      description: "La revisión de nómina se está exportando...",
    });

    // Simular exportación
    setTimeout(() => {
      toast({
        title: "Exportación completada",
        description: "La revisión ha sido exportada exitosamente.",
      });
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Revisión Final de Nómina</h1>
          <p className="text-muted-foreground">
            Revise el resumen completo antes de aprobar la nómina
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/nomina/calculo">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver
            </Button>
          </Link>
          {!nominaAprobada && (
            <Dialog open={aprobacionDialog} onOpenChange={setAprobacionDialog}>
              <DialogTrigger asChild>
                <Button disabled={empleadosRequierenAjuste > 0}>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Aprobar Nómina
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Aprobar Nómina</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="comentarios">Comentarios de Aprobación</Label>
                    <Textarea
                      id="comentarios"
                      placeholder="Ingrese comentarios sobre la aprobación..."
                      value={comentariosAprobacion}
                      onChange={(e) => setComentariosAprobacion(e.target.value)}
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setAprobacionDialog(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleAprobarNomina}>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Aprobar Nómina
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
          {nominaAprobada && (
            <Link href="/nomina/aprobacion">
              <Button>
                Continuar
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Estado de aprobación */}
      {nominaAprobada && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <h3 className="font-medium text-green-800">Nómina Aprobada</h3>
                <p className="text-sm text-green-700">
                  La nómina ha sido aprobada y está lista para generar comprobantes.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Alertas */}
      {empleadosRequierenAjuste > 0 && !nominaAprobada && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <div>
                <h3 className="font-medium text-yellow-800">Ajustes Pendientes</h3>
                <p className="text-sm text-yellow-700">
                  {empleadosRequierenAjuste} empleado(s) requieren ajustes antes de aprobar la nómina.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Resumen general */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Empleados</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-blue-600">{totalEmpleados}</div>
            <p className="text-xs text-muted-foreground">
              en esta nómina
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Devengado</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-green-600">
              {formatCurrency(totalDevengado)}
            </div>
            <p className="text-xs text-muted-foreground">
              suma total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Deducciones</CardTitle>
            <Calculator className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-red-600">
              {formatCurrency(totalDeducciones)}
            </div>
            <p className="text-xs text-muted-foreground">
              suma total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total a Pagar</CardTitle>
            <DollarSign className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-purple-600">
              {formatCurrency(totalNomina)}
            </div>
            <p className="text-xs text-muted-foreground">
              nómina total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabla de revisión */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Revisión por Empleado</CardTitle>
            <Button variant="outline" onClick={handleExportarRevision}>
              <Download className="mr-2 h-4 w-4" />
              Exportar Revisión
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Empleado</TableHead>
                <TableHead>Cargo</TableHead>
                <TableHead>Total Devengado</TableHead>
                <TableHead>Total Deducciones</TableHead>
                <TableHead>Neto a Pagar</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Observaciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {revisionNomina.map((empleado) => (
                <TableRow key={empleado.id}>
                  <TableCell className="font-medium">
                    {empleado.nombre} {empleado.apellido}
                  </TableCell>
                  <TableCell>{empleado.cargo}</TableCell>
                  <TableCell className="font-mono text-green-600">
                    {formatCurrency(empleado.totalDevengado)}
                  </TableCell>
                  <TableCell className="font-mono text-red-600">
                    {formatCurrency(empleado.totalDeducciones)}
                  </TableCell>
                  <TableCell className="font-mono font-semibold text-purple-600">
                    {formatCurrency(empleado.netoPagar)}
                  </TableCell>
                  <TableCell>
                    {empleado.requiereAjuste ? (
                      <Badge className="bg-yellow-100 text-yellow-800">Requiere Ajuste</Badge>
                    ) : (
                      <Badge className="bg-green-100 text-green-800">Listo</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {empleado.observaciones ? (
                      <div className="max-w-xs truncate text-sm text-muted-foreground">
                        {empleado.observaciones}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Detalles adicionales */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Información del Período</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Período:</span>
              <span className="font-medium">Noviembre 2024</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Fecha de Cálculo:</span>
              <span className="font-medium">{new Date().toLocaleDateString('es-CO')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Fecha de Pago:</span>
              <span className="font-medium">30 de noviembre de 2024</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tipo de Nómina:</span>
              <span className="font-medium">Mensual</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resumen Ejecutivo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Empleados Procesados:</span>
              <span className="font-medium">{totalEmpleados}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Valor Total Nómina:</span>
              <span className="font-medium font-mono">{formatCurrency(totalNomina)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Promedio por Empleado:</span>
              <span className="font-medium font-mono">
                {formatCurrency(Math.round(totalNomina / totalEmpleados))}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Estado:</span>
              <span className="font-medium">
                {nominaAprobada ? 'Aprobada' : empleadosRequierenAjuste > 0 ? 'Pendiente de Ajustes' : 'Lista para Aprobar'}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Próximos pasos */}
      <Card>
        <CardHeader>
          <CardTitle>Próximos Pasos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 border rounded-lg">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium">Generar Comprobantes</h3>
                <p className="text-sm text-muted-foreground">
                  Crear los comprobantes de pago para cada empleado
                </p>
              </div>
              <Badge variant={nominaAprobada ? 'default' : 'secondary'}>
                {nominaAprobada ? 'Disponible' : 'Pendiente'}
              </Badge>
            </div>

            <div className="flex items-center gap-4 p-4 border rounded-lg">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Download className="h-5 w-5 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium">Procesar Archivo Bancario</h3>
                <p className="text-sm text-muted-foreground">
                  Generar archivo para transferencias bancarias
                </p>
              </div>
              <Badge variant="secondary">Pendiente</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navegación */}
      <div className="flex justify-between">
        <Link href="/nomina/calculo">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a Cálculo
          </Button>
        </Link>

        {nominaAprobada && (
          <Link href="/nomina/aprobacion">
            <Button>
              Continuar con Aprobación
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}