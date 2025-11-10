import { useState } from "react";
import { Upload, Download, Settings, Database, FileText, AlertTriangle, CheckCircle, Clock, Users, Shield, Zap, BarChart3, RefreshCw, Save, Trash2, Eye, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

interface ConfiguracionAvanzada {
  id: string;
  nombre: string;
  descripcion: string;
  categoria: string;
  valor: any;
  tipo: 'booleano' | 'numero' | 'texto' | 'json';
  requiereReinicio: boolean;
}

interface PlantillaConfiguracion {
  id: string;
  nombre: string;
  descripcion: string;
  formatosIncluidos: string[];
  fechaCreacion: string;
  usuarioCreador: string;
  version: string;
}

interface RegistroAuditoria {
  id: string;
  fecha: string;
  usuario: string;
  accion: string;
  entidad: string;
  detalle: string;
  ip: string;
}

interface DiagnosticoSistema {
  componente: string;
  estado: 'ok' | 'advertencia' | 'error';
  mensaje: string;
  ultimaVerificacion: string;
  accionesRecomendadas?: string[];
}

export default function ExogenaAvanzada() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("configuraciones");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedConfig, setSelectedConfig] = useState<ConfiguracionAvanzada | null>(null);
  const [progresoOperacion, setProgresoOperacion] = useState(0);

  // Configuraciones avanzadas
  const configuracionesAvanzadas: ConfiguracionAvanzada[] = [
    {
      id: 'CFG-VALIDATION-STRICT',
      nombre: 'Validación Estricta',
      descripcion: 'Habilita validaciones adicionales que pueden afectar el rendimiento',
      categoria: 'Validación',
      valor: false,
      tipo: 'booleano',
      requiereReinicio: false
    },
    {
      id: 'CFG-BATCH-SIZE',
      nombre: 'Tamaño de Lote',
      descripcion: 'Número máximo de registros a procesar en cada lote',
      categoria: 'Procesamiento',
      valor: 1000,
      tipo: 'numero',
      requiereReinicio: true
    },
    {
      id: 'CFG-TIMEOUT',
      nombre: 'Tiempo de Espera',
      descripcion: 'Tiempo máximo de espera para operaciones en segundos',
      categoria: 'Procesamiento',
      valor: 300,
      tipo: 'numero',
      requiereReinicio: false
    },
    {
      id: 'CFG-LOG-LEVEL',
      nombre: 'Nivel de Log',
      descripcion: 'Nivel de detalle para los registros del sistema',
      categoria: 'Sistema',
      valor: 'INFO',
      tipo: 'texto',
      requiereReinicio: true
    },
    {
      id: 'CFG-CUSTOM-VALIDATIONS',
      nombre: 'Validaciones Personalizadas',
      descripcion: 'Configuración JSON para validaciones personalizadas',
      categoria: 'Validación',
      valor: '{"enabled": true, "rules": []}',
      tipo: 'json',
      requiereReinicio: false
    }
  ];

  // Plantillas de configuración
  const plantillasConfiguracion: PlantillaConfiguracion[] = [
    {
      id: 'PLANTILLA-ESTANDAR',
      nombre: 'Configuración Estándar',
      descripcion: 'Configuración básica recomendada para la mayoría de usuarios',
      formatosIncluidos: ['1001', '1002', '1003'],
      fechaCreacion: '2024-01-15T10:00:00',
      usuarioCreador: 'Sistema',
      version: '1.0.0'
    },
    {
      id: 'PLANTILLA-COMPLETA',
      nombre: 'Configuración Completa',
      descripcion: 'Incluye todos los formatos disponibles con configuraciones avanzadas',
      formatosIncluidos: ['1001', '1002', '1003', '2276', '2280'],
      fechaCreacion: '2024-02-01T14:30:00',
      usuarioCreador: 'María González',
      version: '2.1.0'
    },
    {
      id: 'PLANTILLA-MINIMA',
      nombre: 'Configuración Mínima',
      descripcion: 'Configuración básica con los formatos esenciales',
      formatosIncluidos: ['1001', '1002'],
      fechaCreacion: '2024-03-10T09:15:00',
      usuarioCreador: 'Carlos Rodríguez',
      version: '1.2.0'
    }
  ];

  // Registros de auditoría
  const registrosAuditoria: RegistroAuditoria[] = [
    {
      id: 'AUD-001',
      fecha: '2024-11-01T10:30:00',
      usuario: 'María González',
      accion: 'MODIFICAR_CONFIGURACION',
      entidad: 'Formato 1001',
      detalle: 'Actualizó reglas de validación',
      ip: '192.168.1.100'
    },
    {
      id: 'AUD-002',
      fecha: '2024-11-01T09:45:00',
      usuario: 'Carlos Rodríguez',
      accion: 'GENERAR_FORMATO',
      entidad: 'Formulario 1002',
      detalle: 'Generó formato para período 2024',
      ip: '192.168.1.101'
    },
    {
      id: 'AUD-003',
      fecha: '2024-10-31T16:20:00',
      usuario: 'Ana López',
      accion: 'EXPORTAR_CONFIGURACION',
      entidad: 'Plantilla Completa',
      detalle: 'Exportó configuración para backup',
      ip: '192.168.1.102'
    }
  ];

  // Diagnóstico del sistema
  const diagnosticoSistema: DiagnosticoSistema[] = [
    {
      componente: 'Base de Datos',
      estado: 'ok',
      mensaje: 'Conexión estable y funcionando correctamente',
      ultimaVerificacion: '2024-11-01T08:00:00'
    },
    {
      componente: 'API DIAN',
      estado: 'ok',
      mensaje: 'Servicio de validación responde correctamente',
      ultimaVerificacion: '2024-11-01T08:15:00'
    },
    {
      componente: 'Procesamiento de Archivos',
      estado: 'advertencia',
      mensaje: 'Algunos archivos temporales no se están limpiando automáticamente',
      ultimaVerificacion: '2024-11-01T07:45:00',
      accionesRecomendadas: ['Verificar configuración de limpieza automática', 'Liberar espacio en disco']
    },
    {
      componente: 'Validaciones',
      estado: 'ok',
      mensaje: 'Todas las reglas de validación están activas',
      ultimaVerificacion: '2024-11-01T08:30:00'
    },
    {
      componente: 'Mapeo de Cuentas',
      estado: 'error',
      mensaje: '3 cuentas contables tienen referencias circulares',
      ultimaVerificacion: '2024-11-01T07:30:00',
      accionesRecomendadas: ['Revisar configuración de mapeo', 'Corregir referencias circulares']
    }
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-CO", {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEstadoDiagnostico = (estado: string) => {
    const colors = {
      'ok': 'bg-green-100 text-green-800',
      'advertencia': 'bg-yellow-100 text-yellow-800',
      'error': 'bg-red-100 text-red-800'
    };
    const labels = {
      'ok': 'OK',
      'advertencia': 'Advertencia',
      'error': 'Error'
    };
    const icons = {
      'ok': <CheckCircle className="h-4 w-4" />,
      'advertencia': <AlertTriangle className="h-4 w-4" />,
      'error': <AlertTriangle className="h-4 w-4" />
    };
    return (
      <Badge className={colors[estado as keyof typeof colors] || colors.ok}>
        {icons[estado as keyof typeof icons]} {labels[estado as keyof typeof labels] || estado}
      </Badge>
    );
  };

  const handleGuardarConfiguracion = (config: ConfiguracionAvanzada) => {
    toast({
      title: "Configuración guardada",
      description: `La configuración "${config.nombre}" ha sido actualizada.`,
    });
    if (config.requiereReinicio) {
      toast({
        title: "Reinicio requerido",
        description: "Los cambios requieren reiniciar el sistema para aplicarse.",
        variant: "destructive",
      });
    }
  };

  const handleImportarConfiguracion = () => {
    setProgresoOperacion(0);
    const interval = setInterval(() => {
      setProgresoOperacion(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          toast({
            title: "Importación completada",
            description: "La configuración ha sido importada exitosamente.",
          });
          return 100;
        }
        return prev + 20;
      });
    }, 300);
  };

  const handleExportarConfiguracion = () => {
    toast({
      title: "Exportando configuración",
      description: "La configuración se está exportando...",
    });
    setTimeout(() => {
      toast({
        title: "Exportación completada",
        description: "La configuración ha sido exportada exitosamente.",
      });
    }, 2000);
  };

  const handleEjecutarDiagnostico = () => {
    toast({
      title: "Ejecutando diagnóstico",
      description: "Analizando el estado del sistema...",
    });
    setTimeout(() => {
      toast({
        title: "Diagnóstico completado",
        description: "Se encontraron 2 componentes que requieren atención.",
      });
    }, 3000);
  };

  const handleLimpiarCache = () => {
    toast({
      title: "Limpiando caché",
      description: "Eliminando archivos temporales y caché...",
    });
    setTimeout(() => {
      toast({
        title: "Caché limpiado",
        description: "Se liberaron 245 MB de espacio en disco.",
      });
    }, 1500);
  };

  const handleOptimizarBaseDatos = () => {
    setProgresoOperacion(0);
    const interval = setInterval(() => {
      setProgresoOperacion(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          toast({
            title: "Optimización completada",
            description: "La base de datos ha sido optimizada exitosamente.",
          });
          return 100;
        }
        return prev + 15;
      });
    }, 400);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Herramientas Avanzadas</h1>
          <p className="text-muted-foreground">
            Configuraciones avanzadas, diagnóstico y mantenimiento del sistema
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
          <Link href="/exogena/generacion">
            <Button variant="outline">
              Generar Información
            </Button>
          </Link>
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Configuraciones Activas</CardTitle>
            <Settings className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{configuracionesAvanzadas.length}</div>
            <p className="text-xs text-muted-foreground">
              {configuracionesAvanzadas.filter(c => c.requiereReinicio).length} requieren reinicio
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Plantillas Disponibles</CardTitle>
            <FileText className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{plantillasConfiguracion.length}</div>
            <p className="text-xs text-muted-foreground">
              configuraciones predefinidas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estado del Sistema</CardTitle>
            <Shield className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {diagnosticoSistema.filter(d => d.estado !== 'ok').length}
            </div>
            <p className="text-xs text-muted-foreground">
              componentes requieren atención
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Registros de Auditoría</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{registrosAuditoria.length}</div>
            <p className="text-xs text-muted-foreground">
              últimas 24 horas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Contenido principal con pestañas */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="configuraciones">Configuraciones</TabsTrigger>
          <TabsTrigger value="plantillas">Plantillas</TabsTrigger>
          <TabsTrigger value="diagnostico">Diagnóstico</TabsTrigger>
          <TabsTrigger value="auditoria">Auditoría</TabsTrigger>
          <TabsTrigger value="mantenimiento">Mantenimiento</TabsTrigger>
        </TabsList>

        <TabsContent value="configuraciones" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configuraciones Avanzadas del Sistema</CardTitle>
              <p className="text-muted-foreground">
                Parámetros avanzados que afectan el comportamiento del sistema de información exógena
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {configuracionesAvanzadas.map((config) => (
                  <div key={config.id} className="flex items-center justify-between p-4 border rounded">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium">{config.nombre}</h3>
                        <Badge variant="outline">{config.categoria}</Badge>
                        {config.requiereReinicio && (
                          <Badge variant="destructive">Requiere Reinicio</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{config.descripcion}</p>
                      <div className="flex items-center gap-2">
                        {config.tipo === 'booleano' && (
                          <Switch checked={config.valor} />
                        )}
                        {config.tipo === 'numero' && (
                          <Input
                            type="number"
                            value={config.valor}
                            className="w-32"
                          />
                        )}
                        {config.tipo === 'texto' && (
                          <Select value={config.valor}>
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="DEBUG">DEBUG</SelectItem>
                              <SelectItem value="INFO">INFO</SelectItem>
                              <SelectItem value="WARN">WARN</SelectItem>
                              <SelectItem value="ERROR">ERROR</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                        {config.tipo === 'json' && (
                          <Textarea
                            value={JSON.stringify(JSON.parse(config.valor), null, 2)}
                            className="w-64 h-20 font-mono text-xs"
                          />
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedConfig(config);
                          setIsDialogOpen(true);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleGuardarConfiguracion(config)}
                      >
                        <Save className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="plantillas" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Plantillas de Configuración</CardTitle>
              <p className="text-muted-foreground">
                Plantillas predefinidas para configuraciones comunes
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Button onClick={handleImportarConfiguracion}>
                    <Upload className="h-4 w-4 mr-2" />
                    Importar Configuración
                  </Button>
                  <Button variant="outline" onClick={handleExportarConfiguracion}>
                    <Download className="h-4 w-4 mr-2" />
                    Exportar Configuración
                  </Button>
                </div>

                {progresoOperacion > 0 && progresoOperacion < 100 && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progreso de la operación</span>
                      <span>{progresoOperacion}%</span>
                    </div>
                    <Progress value={progresoOperacion} />
                  </div>
                )}

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Descripción</TableHead>
                      <TableHead>Formatos Incluidos</TableHead>
                      <TableHead>Versión</TableHead>
                      <TableHead>Creador</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {plantillasConfiguracion.map((plantilla) => (
                      <TableRow key={plantilla.id}>
                        <TableCell className="font-medium">{plantilla.nombre}</TableCell>
                        <TableCell className="max-w-xs">{plantilla.descripcion}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {plantilla.formatosIncluidos.map((formato) => (
                              <Badge key={formato} variant="outline">{formato}</Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>{plantilla.version}</TableCell>
                        <TableCell>{plantilla.usuarioCreador}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="diagnostico" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Diagnóstico del Sistema</CardTitle>
              <p className="text-muted-foreground">
                Estado actual de los componentes del sistema
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button onClick={handleEjecutarDiagnostico}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Ejecutar Diagnóstico Completo
                </Button>

                <div className="space-y-3">
                  {diagnosticoSistema.map((diag, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 border rounded">
                      <div className="mt-1">
                        {getEstadoDiagnostico(diag.estado)}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{diag.componente}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{diag.mensaje}</p>
                        <p className="text-xs text-muted-foreground">
                          Última verificación: {formatDate(diag.ultimaVerificacion)}
                        </p>
                        {diag.accionesRecomendadas && (
                          <div className="mt-2">
                            <p className="text-sm font-medium text-orange-800">Acciones recomendadas:</p>
                            <ul className="text-sm text-orange-700 ml-4 mt-1">
                              {diag.accionesRecomendadas.map((accion, idx) => (
                                <li key={idx}>• {accion}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="auditoria" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Registro de Auditoría</CardTitle>
              <p className="text-muted-foreground">
                Historial de cambios y operaciones realizadas en el sistema
              </p>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Usuario</TableHead>
                    <TableHead>Acción</TableHead>
                    <TableHead>Entidad</TableHead>
                    <TableHead>Detalle</TableHead>
                    <TableHead>IP</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {registrosAuditoria.map((registro) => (
                    <TableRow key={registro.id}>
                      <TableCell className="text-sm">{formatDate(registro.fecha)}</TableCell>
                      <TableCell className="font-medium">{registro.usuario}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{registro.accion.replace('_', ' ')}</Badge>
                      </TableCell>
                      <TableCell>{registro.entidad}</TableCell>
                      <TableCell className="max-w-xs truncate">{registro.detalle}</TableCell>
                      <TableCell className="font-mono text-sm">{registro.ip}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mantenimiento" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Limpieza y Optimización</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Limpiar Caché del Sistema</h3>
                      <p className="text-sm text-muted-foreground">
                        Elimina archivos temporales y libera espacio en disco
                      </p>
                    </div>
                    <Button onClick={handleLimpiarCache}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Limpiar
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Optimizar Base de Datos</h3>
                      <p className="text-sm text-muted-foreground">
                        Reorganiza índices y mejora el rendimiento
                      </p>
                    </div>
                    <Button onClick={handleOptimizarBaseDatos}>
                      <Zap className="h-4 w-4 mr-2" />
                      Optimizar
                    </Button>
                  </div>

                  {progresoOperacion > 0 && progresoOperacion < 100 && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Optimización en progreso</span>
                        <span>{progresoOperacion}%</span>
                      </div>
                      <Progress value={progresoOperacion} />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Información del Sistema</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Versión del Sistema:</span>
                    <span className="font-mono text-sm">2.1.0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Base de Datos:</span>
                    <span className="font-mono text-sm">PostgreSQL 15.3</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Última Actualización:</span>
                    <span className="font-mono text-sm">{formatDate('2024-11-01T08:00:00')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Espacio en Disco:</span>
                    <span className="font-mono text-sm">2.4 GB usado / 10 GB total</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Memoria RAM:</span>
                    <span className="font-mono text-sm">4.2 GB usado / 8 GB total</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Diálogo de detalle de configuración */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalle de Configuración</DialogTitle>
          </DialogHeader>
          {selectedConfig && (
            <div className="space-y-4">
              <div>
                <Label>Nombre</Label>
                <p className="font-medium mt-1">{selectedConfig.nombre}</p>
              </div>
              <div>
                <Label>Categoría</Label>
                <Badge variant="outline" className="mt-1">{selectedConfig.categoria}</Badge>
              </div>
              <div>
                <Label>Descripción</Label>
                <p className="text-sm mt-1">{selectedConfig.descripcion}</p>
              </div>
              <div>
                <Label>Tipo</Label>
                <Badge className="mt-1">{selectedConfig.tipo}</Badge>
              </div>
              <div>
                <Label>Requiere Reinicio</Label>
                <div className="mt-1">
                  {selectedConfig.requiereReinicio ? (
                    <Badge variant="destructive">Sí</Badge>
                  ) : (
                    <Badge variant="secondary">No</Badge>
                  )}
                </div>
              </div>
              <div>
                <Label>Valor Actual</Label>
                <div className="mt-1 p-2 bg-gray-100 rounded font-mono text-sm">
                  {typeof selectedConfig.valor === 'object'
                    ? JSON.stringify(selectedConfig.valor, null, 2)
                    : String(selectedConfig.valor)
                  }
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}