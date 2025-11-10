import { useState } from "react";
import { Download, FileText, CheckCircle, ArrowLeft, Banknote, Upload, AlertTriangle } from "lucide-react";
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
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";

interface TransferenciaBancaria {
  id: string;
  empleadoId: string;
  nombre: string;
  apellido: string;
  numeroCuenta: string;
  banco: string;
  tipoCuenta: 'ahorros' | 'corriente';
  netoPagar: number;
  estado: 'pendiente' | 'procesado' | 'error';
  referencia: string;
}

export default function NominaComprobantes() {
  const { toast } = useToast();
  const [archivoGenerado, setArchivoGenerado] = useState(false);
  const [bancoSeleccionado, setBancoSeleccionado] = useState<string>('');

  // Datos de ejemplo - transferencias bancarias
  const [transferencias] = useState<TransferenciaBancaria[]>([
    {
      id: 'TRANS-001',
      empleadoId: 'EMP-001',
      nombre: 'María',
      apellido: 'González',
      numeroCuenta: '123-456789-0',
      banco: 'Bancolombia',
      tipoCuenta: 'ahorros',
      netoPagar: 2442992,
      estado: 'pendiente',
      referencia: 'NOM-2024-11-001'
    },
    {
      id: 'TRANS-002',
      empleadoId: 'EMP-002',
      nombre: 'Carlos',
      apellido: 'Rodríguez',
      numeroCuenta: '987-654321-0',
      banco: 'Davivienda',
      tipoCuenta: 'corriente',
      netoPagar: 1501761,
      estado: 'pendiente',
      referencia: 'NOM-2024-11-002'
    },
    {
      id: 'TRANS-003',
      empleadoId: 'EMP-003',
      nombre: 'Ana',
      apellido: 'López',
      numeroCuenta: '456-789123-0',
      banco: 'BBVA',
      tipoCuenta: 'ahorros',
      netoPagar: 1319815,
      estado: 'pendiente',
      referencia: 'NOM-2024-11-003'
    }
  ]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'pendiente':
        return <Badge variant="outline">Pendiente</Badge>;
      case 'procesado':
        return <Badge className="bg-green-100 text-green-800">Procesado</Badge>;
      case 'error':
        return <Badge className="bg-red-100 text-red-800">Error</Badge>;
      default:
        return <Badge variant="secondary">{estado}</Badge>;
    }
  };

  const getTipoCuentaBadge = (tipo: string) => {
    switch (tipo) {
      case 'ahorros':
        return <Badge variant="default">Ahorros</Badge>;
      case 'corriente':
        return <Badge variant="secondary">Corriente</Badge>;
      default:
        return <Badge variant="secondary">{tipo}</Badge>;
    }
  };

  const handleGenerarArchivoBancario = () => {
    if (!bancoSeleccionado) {
      toast({
        title: "Banco requerido",
        description: "Por favor seleccione el banco para generar el archivo.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Generando archivo bancario",
      description: `Generando archivo para ${bancoSeleccionado}...`,
    });

    // Simular generación del archivo
    setTimeout(() => {
      setArchivoGenerado(true);
      toast({
        title: "Archivo generado",
        description: `El archivo bancario para ${bancoSeleccionado} ha sido generado exitosamente.`,
      });
    }, 3000);
  };

  const handleDescargarArchivo = () => {
    toast({
      title: "Descargando archivo",
      description: "El archivo bancario se está descargando...",
    });

    // Simular descarga
    setTimeout(() => {
      toast({
        title: "Descarga completada",
        description: "El archivo bancario ha sido descargado.",
      });
    }, 1500);
  };

  const totalTransferencias = transferencias.length;
  const totalValor = transferencias.reduce((sum, trans) => sum + trans.netoPagar, 0);
  const transferenciasPendientes = transferencias.filter(t => t.estado === 'pendiente').length;

  const bancosDisponibles = [
    'Bancolombia',
    'Davivienda',
    'BBVA',
    'Banco de Bogotá',
    'Banco Popular',
    'Banco de Occidente'
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Procesamiento Bancario</h1>
          <p className="text-muted-foreground">
            Genere archivos para transferencias bancarias automáticas
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/nomina/aprobacion">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver
            </Button>
          </Link>
        </div>
      </div>

      {/* Estado de generación */}
      {archivoGenerado && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <h3 className="font-medium text-green-800">Archivo Bancario Generado</h3>
                <p className="text-sm text-green-700">
                  El archivo para transferencias bancarias ha sido generado exitosamente.
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
            <CardTitle className="text-sm font-medium">Transferencias</CardTitle>
            <Banknote className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-blue-600">{totalTransferencias}</div>
            <p className="text-xs text-muted-foreground">
              programadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
            <span className="text-green-600 font-bold">$</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-green-600">
              {formatCurrency(totalValor)}
            </div>
            <p className="text-xs text-muted-foreground">
              a transferir
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-yellow-600">{transferenciasPendientes}</div>
            <p className="text-xs text-muted-foreground">
              por procesar
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Generación de archivo */}
      {!archivoGenerado && (
        <Card>
          <CardHeader>
            <CardTitle>Generar Archivo Bancario</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="banco">Seleccionar Banco</Label>
              <Select value={bancoSeleccionado} onValueChange={setBancoSeleccionado}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione el banco..." />
                </SelectTrigger>
                <SelectContent>
                  {bancosDisponibles.map((banco) => (
                    <SelectItem key={banco} value={banco}>
                      {banco}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-4 p-4 border rounded-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium">Generar Archivo de Transferencias</h3>
                <p className="text-sm text-muted-foreground">
                  Crear archivo compatible con el sistema bancario seleccionado para procesar todas las transferencias de nómina.
                </p>
              </div>
              <Button onClick={handleGenerarArchivoBancario} disabled={!bancoSeleccionado}>
                <FileText className="mr-2 h-4 w-4" />
                Generar Archivo
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Archivo generado */}
      {archivoGenerado && (
        <Card>
          <CardHeader>
            <CardTitle>Archivo Generado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 p-4 border rounded-lg bg-green-50">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Download className="h-6 w-6 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium">Archivo de Transferencias - {bancoSeleccionado}</h3>
                <p className="text-sm text-muted-foreground">
                  Archivo generado: NOMINA_2024_11_{bancoSeleccionado.toUpperCase()}.txt
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {totalTransferencias} transferencias • {formatCurrency(totalValor)} total
                </p>
              </div>
              <Button onClick={handleDescargarArchivo}>
                <Download className="mr-2 h-4 w-4" />
                Descargar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lista de transferencias */}
      <Card>
        <CardHeader>
          <CardTitle>Detalle de Transferencias</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Empleado</TableHead>
                <TableHead>Banco</TableHead>
                <TableHead>N° Cuenta</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Referencia</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transferencias.map((transferencia) => (
                <TableRow key={transferencia.id}>
                  <TableCell className="font-medium">
                    {transferencia.nombre} {transferencia.apellido}
                  </TableCell>
                  <TableCell>{transferencia.banco}</TableCell>
                  <TableCell className="font-mono">{transferencia.numeroCuenta}</TableCell>
                  <TableCell>{getTipoCuentaBadge(transferencia.tipoCuenta)}</TableCell>
                  <TableCell className="font-mono font-semibold text-green-600">
                    {formatCurrency(transferencia.netoPagar)}
                  </TableCell>
                  <TableCell className="font-mono text-sm">{transferencia.referencia}</TableCell>
                  <TableCell>{getEstadoBadge(transferencia.estado)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Información del archivo bancario */}
      <Card>
        <CardHeader>
          <CardTitle>Información del Archivo Bancario</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Formato:</span>
                <span className="ml-2 font-medium">TXT delimitado por comas</span>
              </div>
              <div>
                <span className="text-muted-foreground">Codificación:</span>
                <span className="ml-2 font-medium">UTF-8</span>
              </div>
              <div>
                <span className="text-muted-foreground">Fecha de Procesamiento:</span>
                <span className="ml-2 font-medium">30 de noviembre de 2024</span>
              </div>
              <div>
                <span className="text-muted-foreground">Cuenta Origen:</span>
                <span className="ml-2 font-medium">123-456789-0 (Grav Administración)</span>
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-medium mb-2">Campos del Archivo:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Referencia de pago</li>
                <li>• Número de cuenta destino</li>
                <li>• Valor a transferir</li>
                <li>• Nombre del beneficiario</li>
                <li>• Tipo de cuenta</li>
                <li>• Descripción del pago</li>
              </ul>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-medium mb-2 text-yellow-700">Instrucciones de Uso:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Subir el archivo al portal bancario antes de las 3:00 PM</li>
                <li>• Verificar que todas las cuentas destino sean correctas</li>
                <li>• Confirmar el procesamiento el día siguiente al pago</li>
                <li>• Guardar el comprobante de procesamiento bancario</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Finalización del proceso */}
      {archivoGenerado && (
        <Card className="border-purple-200 bg-purple-50">
          <CardHeader>
            <CardTitle className="text-purple-800">Proceso de Nómina Completado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-purple-600" />
                <div>
                  <h3 className="font-medium text-purple-800">¡Nómina procesada exitosamente!</h3>
                  <p className="text-sm text-purple-700">
                    El proceso completo de nómina ha finalizado. Los comprobantes han sido generados y el archivo bancario está listo para procesamiento.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between">
                  <span>Empleados procesados:</span>
                  <span className="font-medium">{totalTransferencias}</span>
                </div>
                <div className="flex justify-between">
                  <span>Valor total pagado:</span>
                  <span className="font-medium font-mono">{formatCurrency(totalValor)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Comprobantes generados:</span>
                  <span className="font-medium">{totalTransferencias}</span>
                </div>
                <div className="flex justify-between">
                  <span>Archivo bancario:</span>
                  <span className="font-medium">Listo para descarga</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}