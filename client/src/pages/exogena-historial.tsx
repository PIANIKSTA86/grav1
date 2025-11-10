import { useState } from "react";
import { Search, Download, Eye, FileText, Calendar, User, Database, Filter, Clock, CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

interface FormatoExogena {
  id: string;
  periodoFiscal: string;
  tipoFormato: string;
  fechaGeneracion: string;
  usuarioGenerador: string;
  cantidadRegistros: number;
  estado: 'generado' | 'validado' | 'enviado' | 'rechazado' | 'corregido';
  version: number;
  archivoNombre: string;
  tamanoArchivo: string;
  hashArchivo: string;
  observaciones?: string;
  errores?: string[];
}

interface VersionFormato {
  version: number;
  fechaCreacion: string;
  usuario: string;
  cambios: string;
  estado: string;
}

export default function ExogenaHistorial() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [periodoFilter, setPeriodoFilter] = useState<string>("todos");
  const [tipoFilter, setTipoFilter] = useState<string>("todos");
  const [estadoFilter, setEstadoFilter] = useState<string>("todos");
  const [selectedFormato, setSelectedFormato] = useState<FormatoExogena | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-CO", {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatFileSize = (bytes: string) => {
    const size = parseInt(bytes);
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getEstadoBadge = (estado: string) => {
    const colors = {
      'generado': 'bg-blue-100 text-blue-800',
      'validado': 'bg-green-100 text-green-800',
      'enviado': 'bg-purple-100 text-purple-800',
      'rechazado': 'bg-red-100 text-red-800',
      'corregido': 'bg-yellow-100 text-yellow-800'
    };
    const labels = {
      'generado': 'Generado',
      'validado': 'Validado',
      'enviado': 'Enviado',
      'rechazado': 'Rechazado',
      'corregido': 'Corregido'
    };
    return <Badge className={colors[estado as keyof typeof colors] || colors.generado}>
      {labels[estado as keyof typeof labels] || estado}
    </Badge>;
  };

  const getTipoFormatoBadge = (tipo: string) => {
    const tipos = {
      '1001': 'Formulario 1001 - Ingresos',
      '1002': 'Formulario 1002 - Retenciones',
      '1003': 'Formulario 1003 - IVA',
      '1004': 'Formulario 1004 - ICA',
      '1005': 'Formulario 1005 - Patrimonio',
      '2276': 'Formulario 2276 - Gastos',
      '2280': 'Formulario 2280 - Honorarios'
    };
    return <Badge variant="outline">{tipos[tipo as keyof typeof tipos] || tipo}</Badge>;
  };

  // Datos de ejemplo
  const formatosExogena: FormatoExogena[] = [
    {
      id: 'EXO-2024-1001-001',
      periodoFiscal: '2024',
      tipoFormato: '1001',
      fechaGeneracion: '2024-11-01T10:30:00',
      usuarioGenerador: 'María González',
      cantidadRegistros: 2450,
      estado: 'validado',
      version: 2,
      archivoNombre: 'Formulario_1001_2024_v2.xlsx',
      tamanoArchivo: '2456800',
      hashArchivo: 'a1b2c3d4e5f67890...',
      observaciones: 'Versión corregida con ajustes en retenciones'
    },
    {
      id: 'EXO-2024-1002-001',
      periodoFiscal: '2024',
      tipoFormato: '1002',
      fechaGeneracion: '2024-10-28T14:15:00',
      usuarioGenerador: 'Carlos Rodríguez',
      cantidadRegistros: 1890,
      estado: 'enviado',
      version: 1,
      archivoNombre: 'Formulario_1002_2024.xlsx',
      tamanoArchivo: '1894500',
      hashArchivo: 'f9e8d7c6b5a43210...',
      observaciones: 'Enviado a DIAN exitosamente'
    },
    {
      id: 'EXO-2024-1003-001',
      periodoFiscal: '2024',
      tipoFormato: '1003',
      fechaGeneracion: '2024-10-25T09:45:00',
      usuarioGenerador: 'Ana López',
      cantidadRegistros: 3200,
      estado: 'rechazado',
      version: 1,
      archivoNombre: 'Formulario_1003_2024.xlsx',
      tamanoArchivo: '3200000',
      hashArchivo: '1234567890abcdef...',
      errores: ['Registro duplicado en línea 150', 'Valor IVA negativo en línea 234'],
      observaciones: 'Rechazado por errores de validación'
    },
    {
      id: 'EXO-2023-1001-002',
      periodoFiscal: '2023',
      tipoFormato: '1001',
      fechaGeneracion: '2024-03-15T16:20:00',
      usuarioGenerador: 'María González',
      cantidadRegistros: 2100,
      estado: 'corregido',
      version: 3,
      archivoNombre: 'Formulario_1001_2023_v3.xlsx',
      tamanoArchivo: '2105000',
      hashArchivo: 'fedcba0987654321...',
      observaciones: 'Versión final corregida y enviada'
    },
    {
      id: 'EXO-2024-2276-001',
      periodoFiscal: '2024',
      tipoFormato: '2276',
      fechaGeneracion: '2024-11-05T11:00:00',
      usuarioGenerador: 'Pedro Martínez',
      cantidadRegistros: 980,
      estado: 'generado',
      version: 1,
      archivoNombre: 'Formulario_2276_2024.xlsx',
      tamanoArchivo: '980000',
      hashArchivo: 'abcdef1234567890...',
      observaciones: 'Pendiente de validación'
    }
  ];

  const versionesEjemplo: VersionFormato[] = [
    { version: 1, fechaCreacion: '2024-10-25T09:45:00', usuario: 'Ana López', cambios: 'Generación inicial', estado: 'Generado' },
    { version: 2, fechaCreacion: '2024-10-26T14:30:00', usuario: 'Ana López', cambios: 'Corrección de errores de validación', estado: 'Corregido' },
    { version: 3, fechaCreacion: '2024-10-27T10:15:00', usuario: 'Ana López', cambios: 'Ajustes finales', estado: 'Validado' }
  ];

  const filteredFormatos = formatosExogena.filter(formato => {
    const matchesSearch = formato.archivoNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         formato.usuarioGenerador.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         formato.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPeriodo = periodoFilter === "todos" || formato.periodoFiscal === periodoFilter;
    const matchesTipo = tipoFilter === "todos" || formato.tipoFormato === tipoFilter;
    const matchesEstado = estadoFilter === "todos" || formato.estado === estadoFilter;
    return matchesSearch && matchesPeriodo && matchesTipo && matchesEstado;
  });

  const handleVerDetalle = (formato: FormatoExogena) => {
    setSelectedFormato(formato);
    setIsDialogOpen(true);
  };

  const handleDescargarFormato = (formato: FormatoExogena) => {
    toast({
      title: "Descargando archivo",
      description: `Descargando ${formato.archivoNombre}...`,
    });

    // Simular descarga
    setTimeout(() => {
      toast({
        title: "Archivo descargado",
        description: `${formato.archivoNombre} se ha descargado exitosamente.`,
      });
    }, 2000);
  };

  const handleReenviarFormato = (id: string) => {
    toast({
      title: "Reenviando formato",
      description: `El formato ${id} está siendo reenviado a la DIAN.`,
    });
  };

  const totalFormatos = formatosExogena.length;
  const formatosEsteAno = formatosExogena.filter(f => f.periodoFiscal === '2024').length;
  const formatosEnviados = formatosExogena.filter(f => f.estado === 'enviado').length;
  const formatosConErrores = formatosExogena.filter(f => f.estado === 'rechazado').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Historial de Información Exógena</h1>
          <p className="text-muted-foreground">
            Control de versiones y seguimiento de formatos generados
          </p>
        </div>
        <div className="flex gap-2">
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
          <Link href="/exogena/avanzada">
            <Button variant="outline">
              Herramientas Avanzadas
            </Button>
          </Link>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Formatos</CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalFormatos}</div>
            <p className="text-xs text-muted-foreground">
              {formatosEsteAno} en {new Date().getFullYear()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Formatos Enviados</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatosEnviados}</div>
            <p className="text-xs text-muted-foreground">
              {((formatosEnviados / totalFormatos) * 100).toFixed(0)}% del total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Con Errores</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{formatosConErrores}</div>
            <p className="text-xs text-muted-foreground">
              requieren corrección
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Registros Totales</CardTitle>
            <Database className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatosExogena.reduce((sum, f) => sum + f.cantidadRegistros, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              en todos los formatos
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por archivo, usuario o ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={periodoFilter} onValueChange={setPeriodoFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
                <SelectItem value="2022">2022</SelectItem>
              </SelectContent>
            </Select>
            <Select value={tipoFilter} onValueChange={setTipoFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Tipo Formato" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="1001">1001 - Ingresos</SelectItem>
                <SelectItem value="1002">1002 - Retenciones</SelectItem>
                <SelectItem value="1003">1003 - IVA</SelectItem>
                <SelectItem value="1004">1004 - ICA</SelectItem>
                <SelectItem value="2276">2276 - Gastos</SelectItem>
                <SelectItem value="2280">2280 - Honorarios</SelectItem>
              </SelectContent>
            </Select>
            <Select value={estadoFilter} onValueChange={setEstadoFilter}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="generado">Generado</SelectItem>
                <SelectItem value="validado">Validado</SelectItem>
                <SelectItem value="enviado">Enviado</SelectItem>
                <SelectItem value="rechazado">Rechazado</SelectItem>
                <SelectItem value="corregido">Corregido</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de formatos */}
      <Card>
        <CardHeader>
          <CardTitle>Formatos Generados ({filteredFormatos.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Período</TableHead>
                <TableHead>Formato</TableHead>
                <TableHead>Fecha Generación</TableHead>
                <TableHead>Usuario</TableHead>
                <TableHead>Registros</TableHead>
                <TableHead>Versión</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFormatos.map((formato) => (
                <TableRow key={formato.id}>
                  <TableCell className="font-mono font-medium text-sm">{formato.id}</TableCell>
                  <TableCell className="font-medium">{formato.periodoFiscal}</TableCell>
                  <TableCell>{getTipoFormatoBadge(formato.tipoFormato)}</TableCell>
                  <TableCell className="text-sm">{formatDate(formato.fechaGeneracion)}</TableCell>
                  <TableCell className="max-w-32 truncate">{formato.usuarioGenerador}</TableCell>
                  <TableCell className="font-mono">{formato.cantidadRegistros.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant="outline">v{formato.version}</Badge>
                  </TableCell>
                  <TableCell>{getEstadoBadge(formato.estado)}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleVerDetalle(formato)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDescargarFormato(formato)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      {formato.estado === 'rechazado' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleReenviarFormato(formato.id)}
                        >
                          <Clock className="h-4 w-4" />
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

      {/* Diálogo de detalle */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalle del Formato - {selectedFormato?.id}</DialogTitle>
          </DialogHeader>

          {selectedFormato && (
            <Tabs defaultValue="general" className="space-y-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="general">Información General</TabsTrigger>
                <TabsTrigger value="versiones">Control de Versiones</TabsTrigger>
                <TabsTrigger value="errores">Errores y Validaciones</TabsTrigger>
              </TabsList>

              <TabsContent value="general" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>ID del Formato</Label>
                    <p className="font-mono font-semibold">{selectedFormato.id}</p>
                  </div>
                  <div>
                    <Label>Estado</Label>
                    <div className="mt-1">{getEstadoBadge(selectedFormato.estado)}</div>
                  </div>
                  <div>
                    <Label>Período Fiscal</Label>
                    <p>{selectedFormato.periodoFiscal}</p>
                  </div>
                  <div>
                    <Label>Tipo de Formato</Label>
                    <div className="mt-1">{getTipoFormatoBadge(selectedFormato.tipoFormato)}</div>
                  </div>
                  <div>
                    <Label>Fecha de Generación</Label>
                    <p>{formatDate(selectedFormato.fechaGeneracion)}</p>
                  </div>
                  <div>
                    <Label>Usuario Generador</Label>
                    <p>{selectedFormato.usuarioGenerador}</p>
                  </div>
                  <div>
                    <Label>Cantidad de Registros</Label>
                    <p className="font-mono font-semibold">{selectedFormato.cantidadRegistros.toLocaleString()}</p>
                  </div>
                  <div>
                    <Label>Versión</Label>
                    <p>v{selectedFormato.version}</p>
                  </div>
                  <div>
                    <Label>Nombre del Archivo</Label>
                    <p className="font-mono text-sm">{selectedFormato.archivoNombre}</p>
                  </div>
                  <div>
                    <Label>Tamaño del Archivo</Label>
                    <p>{formatFileSize(selectedFormato.tamanoArchivo)}</p>
                  </div>
                  <div className="col-span-2">
                    <Label>Hash del Archivo</Label>
                    <p className="font-mono text-xs bg-gray-100 p-2 rounded">{selectedFormato.hashArchivo}</p>
                  </div>
                  {selectedFormato.observaciones && (
                    <div className="col-span-2">
                      <Label>Observaciones</Label>
                      <p className="text-sm">{selectedFormato.observaciones}</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="versiones" className="space-y-4">
                <div className="space-y-3">
                  {versionesEjemplo.map((version, index) => (
                    <div key={version.version} className="flex items-start gap-4 p-3 border rounded">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-600">{version.version}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium">{version.usuario}</span>
                          <span className="text-sm text-muted-foreground">{formatDate(version.fechaCreacion)}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">{version.cambios}</p>
                        <Badge variant="outline" className="text-xs">{version.estado}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="errores" className="space-y-4">
                {selectedFormato.errores && selectedFormato.errores.length > 0 ? (
                  <div className="space-y-2">
                    {selectedFormato.errores.map((error, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded">
                        <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-red-800">Error de Validación</p>
                          <p className="text-sm text-red-700">{error}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <CheckCircle className="mx-auto h-12 w-12 text-green-600" />
                    <h3 className="mt-2 text-sm font-semibold text-green-800">Sin Errores</h3>
                    <p className="mt-1 text-sm text-green-600">
                      Este formato no presenta errores de validación.
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}