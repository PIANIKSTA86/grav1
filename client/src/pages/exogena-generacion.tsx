import { useState } from "react";
import { Play, CheckCircle, AlertTriangle, Download, FileText, Settings, Calendar, Users, Database, ArrowRight, ArrowLeft, RefreshCw, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

interface PasoWorkflow {
  id: number;
  titulo: string;
  descripcion: string;
  completado: boolean;
  enProgreso: boolean;
  icono: React.ReactNode;
}

interface FormatoSeleccionado {
  id: string;
  codigo: string;
  nombre: string;
  descripcion: string;
  seleccionado: boolean;
  registrosEstimados: number;
}

interface ParametroGeneracion {
  id: string;
  nombre: string;
  tipo: 'fecha' | 'periodo' | 'numero' | 'texto' | 'booleano';
  valor: any;
  obligatorio: boolean;
  descripcion: string;
}

interface ResultadoValidacion {
  tipo: 'error' | 'advertencia' | 'info';
  mensaje: string;
  campo?: string;
  formato?: string;
}

export default function ExogenaGeneracion() {
  const { toast } = useToast();
  const [pasoActual, setPasoActual] = useState(1);
  const [formatosSeleccionados, setFormatosSeleccionados] = useState<FormatoSeleccionado[]>([]);
  const [parametros, setParametros] = useState<ParametroGeneracion[]>([]);
  const [resultadosValidacion, setResultadosValidacion] = useState<ResultadoValidacion[]>([]);
  const [progresoGeneracion, setProgresoGeneracion] = useState(0);
  const [generacionCompletada, setGeneracionCompletada] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedResultado, setSelectedResultado] = useState<ResultadoValidacion | null>(null);

  const pasosWorkflow: PasoWorkflow[] = [
    {
      id: 1,
      titulo: "Selección de Formatos",
      descripcion: "Selecciona los formatos DIAN que deseas generar",
      completado: pasoActual > 1,
      enProgreso: pasoActual === 1,
      icono: <FileText className="h-5 w-5" />
    },
    {
      id: 2,
      titulo: "Configuración de Parámetros",
      descripcion: "Define los parámetros de generación",
      completado: pasoActual > 2,
      enProgreso: pasoActual === 2,
      icono: <Settings className="h-5 w-5" />
    },
    {
      id: 3,
      titulo: "Validación de Datos",
      descripcion: "Ejecuta validaciones previas a la generación",
      completado: pasoActual > 3,
      enProgreso: pasoActual === 3,
      icono: <CheckCircle className="h-5 w-5" />
    },
    {
      id: 4,
      titulo: "Generación y Exportación",
      descripcion: "Genera los archivos y expórtalos",
      completado: pasoActual > 4,
      enProgreso: pasoActual === 4,
      icono: <Download className="h-5 w-5" />
    }
  ];

  // Datos de ejemplo de formatos disponibles
  const formatosDisponibles: FormatoSeleccionado[] = [
    {
      id: 'FMT-1001',
      codigo: '1001',
      nombre: 'Formulario 1001 - Ingresos',
      descripcion: 'Declaración de ingresos y retenciones en la fuente',
      seleccionado: false,
      registrosEstimados: 2450
    },
    {
      id: 'FMT-1002',
      codigo: '1002',
      nombre: 'Formulario 1002 - Retenciones',
      descripcion: 'Certificado de retenciones y autorretenciones',
      seleccionado: false,
      registrosEstimados: 1890
    },
    {
      id: 'FMT-1003',
      codigo: '1003',
      nombre: 'Formulario 1003 - IVA',
      descripcion: 'Declaración mensual del IVA',
      seleccionado: false,
      registrosEstimados: 3200
    },
    {
      id: 'FMT-2276',
      codigo: '2276',
      nombre: 'Formulario 2276 - Gastos',
      descripcion: 'Declaración de gastos deducibles',
      seleccionado: false,
      registrosEstimados: 980
    },
    {
      id: 'FMT-2280',
      codigo: '2280',
      nombre: 'Formulario 2280 - Honorarios',
      descripcion: 'Certificado de ingresos por honorarios',
      seleccionado: false,
      registrosEstimados: 567
    }
  ];

  // Parámetros de generación
  const parametrosGeneracion: ParametroGeneracion[] = [
    {
      id: 'periodo',
      nombre: 'Período Fiscal',
      tipo: 'periodo',
      valor: '2024',
      obligatorio: true,
      descripcion: 'Año para el cual se genera la información exógena'
    },
    {
      id: 'fecha_corte',
      nombre: 'Fecha de Corte',
      tipo: 'fecha',
      valor: '2024-12-31',
      obligatorio: true,
      descripcion: 'Fecha hasta la cual se incluyen los movimientos'
    },
    {
      id: 'incluir_ajustes',
      nombre: 'Incluir Ajustes Manuales',
      tipo: 'booleano',
      valor: true,
      obligatorio: false,
      descripcion: 'Incluir ajustes y correcciones manuales en los formatos'
    },
    {
      id: 'umbral_minimo',
      nombre: 'Umbral Mínimo (COP)',
      tipo: 'numero',
      valor: 1000000,
      obligatorio: false,
      descripcion: 'Valor mínimo para incluir en los reportes (opcional)'
    }
  ];

  const handleSeleccionarFormato = (id: string, seleccionado: boolean) => {
    setFormatosSeleccionados(prev =>
      prev.map(formato =>
        formato.id === id ? { ...formato, seleccionado } : formato
      )
    );
  };

  const handleSiguientePaso = () => {
    if (pasoActual < pasosWorkflow.length) {
      setPasoActual(pasoActual + 1);
    }
  };

  const handlePasoAnterior = () => {
    if (pasoActual > 1) {
      setPasoActual(pasoActual - 1);
    }
  };

  const handleIniciarSeleccion = () => {
    setFormatosSeleccionados(formatosDisponibles);
    handleSiguientePaso();
  };

  const handleConfigurarParametros = () => {
    setParametros(parametrosGeneracion);
    handleSiguientePaso();
  };

  const handleEjecutarValidacion = () => {
    // Simular validación
    setResultadosValidacion([
      {
        tipo: 'advertencia',
        mensaje: 'Se encontraron 15 registros con valores de IVA negativos en el Formulario 1003',
        formato: '1003'
      },
      {
        tipo: 'error',
        mensaje: '3 registros en Formulario 1001 tienen números de documento inválidos',
        formato: '1001',
        campo: 'Número Documento'
      },
      {
        tipo: 'info',
        mensaje: 'Validación completada. Se encontraron 8,420 registros válidos para exportar'
      }
    ]);

    setTimeout(() => {
      handleSiguientePaso();
    }, 2000);
  };

  const handleIniciarGeneracion = () => {
    setProgresoGeneracion(0);
    const interval = setInterval(() => {
      setProgresoGeneracion(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setGeneracionCompletada(true);
          toast({
            title: "Generación completada",
            description: "Los archivos de información exógena han sido generados exitosamente.",
          });
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  const handleDescargarArchivo = (formato: string) => {
    toast({
      title: "Descargando archivo",
      description: `Descargando Formulario ${formato}...`,
    });
  };

  const handleDescargarTodos = () => {
    toast({
      title: "Descargando paquete completo",
      description: "Descargando todos los formatos generados...",
    });
  };

  const getBadgeTipoValidacion = (tipo: string) => {
    const colors = {
      'error': 'bg-red-100 text-red-800',
      'advertencia': 'bg-yellow-100 text-yellow-800',
      'info': 'bg-blue-100 text-blue-800'
    };
    const labels = {
      'error': 'Error',
      'advertencia': 'Advertencia',
      'info': 'Información'
    };
    return <Badge className={colors[tipo as keyof typeof colors] || colors.info}>
      {labels[tipo as keyof typeof labels] || tipo}
    </Badge>;
  };

  const renderPasoActual = () => {
    switch (pasoActual) {
      case 1:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Paso 1: Selección de Formatos
              </CardTitle>
              <p className="text-muted-foreground">
                Selecciona los formatos DIAN que deseas generar para este período
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12"></TableHead>
                    <TableHead>Código</TableHead>
                    <TableHead>Nombre del Formato</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead>Registros Estimados</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {formatosDisponibles.map((formato) => (
                    <TableRow key={formato.id}>
                      <TableCell>
                        <Checkbox
                          checked={formato.seleccionado}
                          onCheckedChange={(checked) =>
                            handleSeleccionarFormato(formato.id, checked as boolean)
                          }
                        />
                      </TableCell>
                      <TableCell className="font-mono font-medium">{formato.codigo}</TableCell>
                      <TableCell className="font-medium">{formato.nombre}</TableCell>
                      <TableCell className="max-w-xs">{formato.descripcion}</TableCell>
                      <TableCell className="font-mono">{formato.registrosEstimados.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="flex justify-between items-center pt-4">
                <div className="text-sm text-muted-foreground">
                  {formatosSeleccionados.filter(f => f.seleccionado).length} formatos seleccionados
                </div>
                <Button onClick={handleIniciarSeleccion} disabled={formatosSeleccionados.filter(f => f.seleccionado).length === 0}>
                  Continuar
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      case 2:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Paso 2: Configuración de Parámetros
              </CardTitle>
              <p className="text-muted-foreground">
                Define los parámetros para la generación de la información exógena
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                {parametros.map((param) => (
                  <div key={param.id} className="space-y-2">
                    <Label className="flex items-center gap-2">
                      {param.nombre}
                      {param.obligatorio && <span className="text-red-500">*</span>}
                    </Label>
                    {param.tipo === 'periodo' && (
                      <Select value={param.valor} onValueChange={(value) => {
                        setParametros(prev => prev.map(p =>
                          p.id === param.id ? { ...p, valor: value } : p
                        ));
                      }}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="2024">2024</SelectItem>
                          <SelectItem value="2023">2023</SelectItem>
                          <SelectItem value="2022">2022</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                    {param.tipo === 'fecha' && (
                      <Input
                        type="date"
                        value={param.valor}
                        onChange={(e) => {
                          setParametros(prev => prev.map(p =>
                            p.id === param.id ? { ...p, valor: e.target.value } : p
                          ));
                        }}
                      />
                    )}
                    {param.tipo === 'numero' && (
                      <Input
                        type="number"
                        value={param.valor}
                        onChange={(e) => {
                          setParametros(prev => prev.map(p =>
                            p.id === param.id ? { ...p, valor: parseInt(e.target.value) } : p
                          ));
                        }}
                      />
                    )}
                    {param.tipo === 'booleano' && (
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          checked={param.valor}
                          onCheckedChange={(checked) => {
                            setParametros(prev => prev.map(p =>
                              p.id === param.id ? { ...p, valor: checked } : p
                            ));
                          }}
                        />
                        <Label>Sí</Label>
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground">{param.descripcion}</p>
                  </div>
                ))}
              </div>
              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={handlePasoAnterior}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Anterior
                </Button>
                <Button onClick={handleConfigurarParametros}>
                  Continuar
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      case 3:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Paso 3: Validación de Datos
              </CardTitle>
              <p className="text-muted-foreground">
                Ejecuta las validaciones previas para asegurar la calidad de los datos
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Validaciones a Ejecutar:</h3>
                  <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                    <li>• Validación de formatos de documento</li>
                    <li>• Verificación de consistencia de montos</li>
                    <li>• Validación de fechas y períodos</li>
                    <li>• Verificación de mapeo de cuentas</li>
                  </ul>
                </div>
                <Button onClick={handleEjecutarValidacion}>
                  <Play className="h-4 w-4 mr-2" />
                  Ejecutar Validación
                </Button>
              </div>

              {resultadosValidacion.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-medium">Resultados de Validación:</h3>
                  {resultadosValidacion.map((resultado, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 border rounded">
                      {resultado.tipo === 'error' && <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />}
                      {resultado.tipo === 'advertencia' && <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />}
                      {resultado.tipo === 'info' && <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {getBadgeTipoValidacion(resultado.tipo)}
                          {resultado.formato && (
                            <Badge variant="outline">Formato {resultado.formato}</Badge>
                          )}
                        </div>
                        <p className="text-sm">{resultado.mensaje}</p>
                        {resultado.campo && (
                          <p className="text-xs text-muted-foreground">Campo: {resultado.campo}</p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedResultado(resultado);
                          setIsDialogOpen(true);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={handlePasoAnterior}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Anterior
                </Button>
                <Button onClick={handleSiguientePaso} disabled={resultadosValidacion.some(r => r.tipo === 'error')}>
                  Continuar
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      case 4:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                Paso 4: Generación y Exportación
              </CardTitle>
              <p className="text-muted-foreground">
                Genera los archivos finales y expórtalos para envío a la DIAN
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {!generacionCompletada ? (
                <div className="space-y-4">
                  <div className="text-center">
                    <h3 className="font-medium mb-2">Generando archivos...</h3>
                    <Progress value={progresoGeneracion} className="w-full" />
                    <p className="text-sm text-muted-foreground mt-2">{progresoGeneracion}% completado</p>
                  </div>
                  <Button onClick={handleIniciarGeneracion} className="w-full">
                    <Play className="h-4 w-4 mr-2" />
                    Iniciar Generación
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-center">
                    <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                    <h3 className="font-medium text-green-800">¡Generación Completada!</h3>
                    <p className="text-sm text-muted-foreground">
                      Los archivos han sido generados exitosamente y están listos para descarga
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium">Archivos Generados:</h4>
                    {formatosSeleccionados.filter(f => f.seleccionado).map((formato) => (
                      <div key={formato.id} className="flex items-center justify-between p-3 border rounded">
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-blue-600" />
                          <div>
                            <p className="font-medium">{formato.nombre}</p>
                            <p className="text-sm text-muted-foreground">
                              {formato.registrosEstimados.toLocaleString()} registros • Generado: {new Date().toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <Button size="sm" onClick={() => handleDescargarArchivo(formato.codigo)}>
                          <Download className="h-4 w-4 mr-2" />
                          Descargar
                        </Button>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button onClick={handleDescargarTodos} className="flex-1">
                      <Download className="h-4 w-4 mr-2" />
                      Descargar Todos
                    </Button>
                    <Button variant="outline" onClick={() => window.location.reload()}>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Nueva Generación
                    </Button>
                  </div>
                </div>
              )}

              <div className="flex justify-start pt-4">
                <Button variant="outline" onClick={handlePasoAnterior}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Anterior
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Generación de Información Exógena</h1>
          <p className="text-muted-foreground">
            Workflow paso a paso para generar y exportar formatos DIAN
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/exogena/historial">
            <Button variant="outline">
              Ver Historial
            </Button>
          </Link>
          <Link href="/exogena/formatos">
            <Button variant="outline">
              Configurar Formatos
            </Button>
          </Link>
          <Link href="/exogena/avanzada">
            <Button variant="outline">
              Herramientas Avanzadas
            </Button>
          </Link>
        </div>
      </div>

      {/* Indicador de progreso del workflow */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            {pasosWorkflow.map((paso, index) => (
              <div key={paso.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  paso.completado
                    ? 'bg-green-100 border-green-500 text-green-600'
                    : paso.enProgreso
                    ? 'bg-blue-100 border-blue-500 text-blue-600'
                    : 'bg-gray-100 border-gray-300 text-gray-400'
                }`}>
                  {paso.completado ? <CheckCircle className="h-5 w-5" /> : paso.icono}
                </div>
                <div className="ml-3">
                  <p className={`text-sm font-medium ${
                    paso.completado || paso.enProgreso ? 'text-foreground' : 'text-muted-foreground'
                  }`}>
                    {paso.titulo}
                  </p>
                  <p className="text-xs text-muted-foreground">{paso.descripcion}</p>
                </div>
                {index < pasosWorkflow.length - 1 && (
                  <ArrowRight className="h-4 w-4 text-muted-foreground mx-4" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Contenido del paso actual */}
      {renderPasoActual()}

      {/* Diálogo de detalle de validación */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalle de Validación</DialogTitle>
          </DialogHeader>
          {selectedResultado && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                {getBadgeTipoValidacion(selectedResultado.tipo)}
                {selectedResultado.formato && (
                  <Badge variant="outline">Formato {selectedResultado.formato}</Badge>
                )}
              </div>
              <div>
                <Label>Mensaje</Label>
                <p className="text-sm mt-1">{selectedResultado.mensaje}</p>
              </div>
              {selectedResultado.campo && (
                <div>
                  <Label>Campo Afectado</Label>
                  <p className="text-sm mt-1">{selectedResultado.campo}</p>
                </div>
              )}
              <div>
                <Label>Recomendación</Label>
                <Textarea
                  placeholder="Describe cómo resolver este problema..."
                  className="mt-1"
                />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}