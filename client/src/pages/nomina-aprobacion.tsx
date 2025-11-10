import { useState } from "react";
import { CheckCircle, FileText, Download, ArrowRight, ArrowLeft, Calendar, User, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";

interface ComprobanteNomina {
  id: string;
  empleadoId: string;
  nombre: string;
  apellido: string;
  cargo: string;
  netoPagar: number;
  fechaGeneracion: string;
  estado: 'generado' | 'enviado' | 'entregado';
  numeroComprobante: string;
}

export default function NominaAprobacion() {
  const { toast } = useToast();
  const [comprobantesGenerados, setComprobantesGenerados] = useState(false);

  // Datos de ejemplo - comprobantes generados
  const [comprobantes] = useState<ComprobanteNomina[]>([
    {
      id: 'COMP-001',
      empleadoId: 'EMP-001',
      nombre: 'María',
      apellido: 'González',
      cargo: 'Administradora',
      netoPagar: 2442992,
      fechaGeneracion: '2024-11-15',
      estado: 'generado',
      numeroComprobante: 'COMP-2024-11-001'
    },
    {
      id: 'COMP-002',
      empleadoId: 'EMP-002',
      nombre: 'Carlos',
      apellido: 'Rodríguez',
      cargo: 'Conserje',
      netoPagar: 1501761,
      fechaGeneracion: '2024-11-15',
      estado: 'generado',
      numeroComprobante: 'COMP-2024-11-002'
    },
    {
      id: 'COMP-003',
      empleadoId: 'EMP-003',
      nombre: 'Ana',
      apellido: 'López',
      cargo: 'Auxiliar de Limpieza',
      netoPagar: 1319815,
      fechaGeneracion: '2024-11-15',
      estado: 'generado',
      numeroComprobante: 'COMP-2024-11-003'
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

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'generado':
        return <Badge className="bg-blue-100 text-blue-800">Generado</Badge>;
      case 'enviado':
        return <Badge className="bg-yellow-100 text-yellow-800">Enviado</Badge>;
      case 'entregado':
        return <Badge className="bg-green-100 text-green-800">Entregado</Badge>;
      default:
        return <Badge variant="secondary">{estado}</Badge>;
    }
  };

  const handleGenerarComprobantes = () => {
    toast({
      title: "Generando comprobantes",
      description: "Los comprobantes de nómina se están generando...",
    });

    // Simular generación
    setTimeout(() => {
      setComprobantesGenerados(true);
      toast({
        title: "Comprobantes generados",
        description: "Todos los comprobantes han sido generados exitosamente.",
      });
    }, 3000);
  };

  const handleDescargarComprobante = (comprobante: ComprobanteNomina) => {
    toast({
      title: "Descargando comprobante",
      description: `Descargando comprobante de ${comprobante.nombre} ${comprobante.apellido}...`,
    });

    // Simular descarga
    setTimeout(() => {
      toast({
        title: "Descarga completada",
        description: "El comprobante ha sido descargado.",
      });
    }, 1000);
  };

  const handleDescargarTodos = () => {
    toast({
      title: "Descargando todos los comprobantes",
      description: "Generando archivo ZIP con todos los comprobantes...",
    });

    // Simular descarga masiva
    setTimeout(() => {
      toast({
        title: "Descarga completada",
        description: "Todos los comprobantes han sido descargados en un archivo ZIP.",
      });
    }, 2000);
  };

  const totalComprobantes = comprobantes.length;
  const totalValor = comprobantes.reduce((sum, comp) => sum + comp.netoPagar, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Generación de Comprobantes</h1>
          <p className="text-muted-foreground">
            Genere y distribuya los comprobantes de pago a los empleados
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/nomina/revision">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver
            </Button>
          </Link>
          {comprobantesGenerados && (
            <Link href="/nomina/comprobantes">
              <Button>
                Continuar
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Estado de generación */}
      {comprobantesGenerados && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <h3 className="font-medium text-green-800">Comprobantes Generados</h3>
                <p className="text-sm text-green-700">
                  Todos los comprobantes de nómina han sido generados exitosamente.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Resumen */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Comprobantes</CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-blue-600">{totalComprobantes}</div>
            <p className="text-xs text-muted-foreground">
              generados
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
              {formatCurrency(totalValor)}
            </div>
            <p className="text-xs text-muted-foreground">
              suma de pagos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fecha Generación</CardTitle>
            <Calendar className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-purple-600">
              {formatDate(new Date().toISOString().split('T')[0])}
            </div>
            <p className="text-xs text-muted-foreground">
              fecha actual
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Acciones de generación */}
      {!comprobantesGenerados && (
        <Card>
          <CardHeader>
            <CardTitle>Generar Comprobantes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 border rounded-lg">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">Generar Comprobantes de Nómina</h3>
                  <p className="text-sm text-muted-foreground">
                    Crear un comprobante de pago detallado para cada empleado con toda la información de devengados, deducciones y neto a pagar.
                  </p>
                </div>
                <Button onClick={handleGenerarComprobantes}>
                  <FileText className="mr-2 h-4 w-4" />
                  Generar Comprobantes
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lista de comprobantes */}
      {comprobantesGenerados && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Comprobantes Generados</CardTitle>
              <Button onClick={handleDescargarTodos}>
                <Download className="mr-2 h-4 w-4" />
                Descargar Todos
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>N° Comprobante</TableHead>
                  <TableHead>Empleado</TableHead>
                  <TableHead>Cargo</TableHead>
                  <TableHead>Neto a Pagar</TableHead>
                  <TableHead>Fecha Generación</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {comprobantes.map((comprobante) => (
                  <TableRow key={comprobante.id}>
                    <TableCell className="font-mono font-medium">
                      {comprobante.numeroComprobante}
                    </TableCell>
                    <TableCell className="font-medium">
                      {comprobante.nombre} {comprobante.apellido}
                    </TableCell>
                    <TableCell>{comprobante.cargo}</TableCell>
                    <TableCell className="font-mono font-semibold text-green-600">
                      {formatCurrency(comprobante.netoPagar)}
                    </TableCell>
                    <TableCell>{formatDate(comprobante.fechaGeneracion)}</TableCell>
                    <TableCell>{getEstadoBadge(comprobante.estado)}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDescargarComprobante(comprobante)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Información del comprobante */}
      <Card>
        <CardHeader>
          <CardTitle>Información del Comprobante</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Empresa:</span>
                <span className="ml-2 font-medium">Conjunto Residencial Grav</span>
              </div>
              <div>
                <span className="text-muted-foreground">NIT:</span>
                <span className="ml-2 font-medium">901.234.567-8</span>
              </div>
              <div>
                <span className="text-muted-foreground">Período de Pago:</span>
                <span className="ml-2 font-medium">Noviembre 2024</span>
              </div>
              <div>
                <span className="text-muted-foreground">Fecha de Pago:</span>
                <span className="ml-2 font-medium">30 de noviembre de 2024</span>
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-medium mb-2">Contenido del Comprobante:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Información personal del empleado</li>
                <li>• Detalle de devengados (salario, auxilios, horas extras, bonificaciones)</li>
                <li>• Detalle de deducciones (salud, pensión, ARL, otras)</li>
                <li>• Valor neto a pagar</li>
                <li>• Información de contacto y soporte</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Próximos pasos */}
      {comprobantesGenerados && (
        <Card>
          <CardHeader>
            <CardTitle>Próximo Paso</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 p-4 border rounded-lg">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Download className="h-5 w-5 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium">Procesar Archivo Bancario</h3>
                <p className="text-sm text-muted-foreground">
                  Generar archivo para transferencias bancarias automáticas
                </p>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navegación */}
      <div className="flex justify-between">
        <Link href="/nomina/revision">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a Revisión
          </Button>
        </Link>

        {comprobantesGenerados && (
          <Link href="/nomina/comprobantes">
            <Button>
              Continuar con Procesamiento Bancario
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}