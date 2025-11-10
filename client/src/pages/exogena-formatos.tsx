import { useState } from "react";
import { Save, Settings, FileText, Calculator, MapPin, AlertCircle, CheckCircle, Edit, Eye, Plus, Trash2 } from "lucide-react";
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
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

interface ConfiguracionFormato {
  id: string;
  codigoFormato: string;
  nombreFormato: string;
  descripcion: string;
  activo: boolean;
  camposObligatorios: CampoFormato[];
  camposOpcionales: CampoFormato[];
  mapeoCuentas: MapeoCuenta[];
  reglasValidacion: ReglaValidacion[];
  ultimaModificacion: string;
  usuarioModificador: string;
}

interface CampoFormato {
  id: string;
  nombre: string;
  tipo: 'texto' | 'numero' | 'fecha' | 'booleano' | 'moneda';
  obligatorio: boolean;
  descripcion: string;
  validacion?: string;
}

interface MapeoCuenta {
  id: string;
  campoFormato: string;
  cuentaContable: string;
  nombreCuenta: string;
  tipoMovimiento: 'debito' | 'credito' | 'ambos';
  condiciones?: string;
}

interface ReglaValidacion {
  id: string;
  nombre: string;
  descripcion: string;
  tipo: 'requerido' | 'formato' | 'rango' | 'dependencia' | 'personalizada';
  campo: string;
  valor?: string;
  mensajeError: string;
  activo: boolean;
}

export default function ExogenaFormatos() {
  const { toast } = useToast();
  const [selectedFormato, setSelectedFormato] = useState<ConfiguracionFormato | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Datos de ejemplo de configuraciones de formatos
  const configuracionesFormatos: ConfiguracionFormato[] = [
    {
      id: 'CONF-1001',
      codigoFormato: '1001',
      nombreFormato: 'Formulario 1001 - Ingresos',
      descripcion: 'Declaración de ingresos y retenciones en la fuente',
      activo: true,
      camposObligatorios: [
        { id: '1', nombre: 'Tipo Documento', tipo: 'texto', obligatorio: true, descripcion: 'Tipo de documento del declarante' },
        { id: '2', nombre: 'Número Documento', tipo: 'texto', obligatorio: true, descripcion: 'Número de identificación' },
        { id: '3', nombre: 'Primer Apellido', tipo: 'texto', obligatorio: true, descripcion: 'Primer apellido del declarante' },
        { id: '4', nombre: 'Segundo Apellido', tipo: 'texto', obligatorio: false, descripcion: 'Segundo apellido del declarante' },
        { id: '5', nombre: 'Primer Nombre', tipo: 'texto', obligatorio: true, descripcion: 'Primer nombre del declarante' },
        { id: '6', nombre: 'Otros Nombres', tipo: 'texto', obligatorio: false, descripcion: 'Otros nombres del declarante' },
        { id: '7', nombre: 'Razón Social', tipo: 'texto', obligatorio: false, descripcion: 'Razón social para personas jurídicas' },
        { id: '8', nombre: 'Dirección', tipo: 'texto', obligatorio: true, descripcion: 'Dirección del declarante' },
        { id: '9', nombre: 'Código Departamento', tipo: 'texto', obligatorio: true, descripcion: 'Código del departamento' },
        { id: '10', nombre: 'Código Municipio', tipo: 'texto', obligatorio: true, descripcion: 'Código del municipio' },
        { id: '11', nombre: 'Valor Bruto Pagado', tipo: 'moneda', obligatorio: true, descripcion: 'Valor bruto de los pagos realizados' },
        { id: '12', nombre: 'Valor Retenido', tipo: 'moneda', obligatorio: true, descripcion: 'Valor de la retención practicada' }
      ],
      camposOpcionales: [
        { id: '13', nombre: 'Correo Electrónico', tipo: 'texto', obligatorio: false, descripcion: 'Correo electrónico del declarante' },
        { id: '14', nombre: 'Teléfono', tipo: 'texto', obligatorio: false, descripcion: 'Número de teléfono' }
      ],
      mapeoCuentas: [
        {
          id: 'MAP-001',
          campoFormato: 'Valor Bruto Pagado',
          cuentaContable: '413501',
          nombreCuenta: 'Honorarios y Comisiones',
          tipoMovimiento: 'debito',
          condiciones: 'Solo para pagos a personas naturales'
        },
        {
          id: 'MAP-002',
          campoFormato: 'Valor Retenido',
          cuentaContable: '236501',
          nombreCuenta: 'Retención en la Fuente por Honorarios',
          tipoMovimiento: 'credito',
          condiciones: 'Aplica retención del 11%'
        }
      ],
      reglasValidacion: [
        {
          id: 'VAL-001',
          nombre: 'Documento Válido',
          descripcion: 'Validar que el número de documento sea válido',
          tipo: 'formato',
          campo: 'Número Documento',
          mensajeError: 'El número de documento no tiene un formato válido',
          activo: true
        },
        {
          id: 'VAL-002',
          nombre: 'Valor Retenido <= Valor Bruto',
          descripcion: 'El valor retenido no puede ser mayor al valor bruto',
          tipo: 'rango',
          campo: 'Valor Retenido',
          mensajeError: 'El valor retenido no puede superar el valor bruto pagado',
          activo: true
        }
      ],
      ultimaModificacion: '2024-11-01T10:30:00',
      usuarioModificador: 'María González'
    },
    {
      id: 'CONF-1002',
      codigoFormato: '1002',
      nombreFormato: 'Formulario 1002 - Retenciones',
      descripcion: 'Certificado de retenciones y autorretenciones',
      activo: true,
      camposObligatorios: [
        { id: '1', nombre: 'Tipo Documento', tipo: 'texto', obligatorio: true, descripcion: 'Tipo de documento' },
        { id: '2', nombre: 'Número Documento', tipo: 'texto', obligatorio: true, descripcion: 'Número de identificación' },
        { id: '3', nombre: 'DV', tipo: 'texto', obligatorio: false, descripcion: 'Dígito de verificación' },
        { id: '4', nombre: 'Primer Apellido', tipo: 'texto', obligatorio: true, descripcion: 'Primer apellido' },
        { id: '5', nombre: 'Segundo Apellido', tipo: 'texto', obligatorio: false, descripcion: 'Segundo apellido' },
        { id: '6', nombre: 'Primer Nombre', tipo: 'texto', obligatorio: true, descripcion: 'Primer nombre' },
        { id: '7', nombre: 'Otros Nombres', tipo: 'texto', obligatorio: false, descripcion: 'Otros nombres' },
        { id: '8', nombre: 'Razón Social', tipo: 'texto', obligatorio: false, descripcion: 'Razón social' },
        { id: '9', nombre: 'Valor Retenido', tipo: 'moneda', obligatorio: true, descripcion: 'Valor de la retención' },
        { id: '10', nombre: 'Porcentaje Retención', tipo: 'numero', obligatorio: true, descripcion: 'Porcentaje aplicado' }
      ],
      camposOpcionales: [],
      mapeoCuentas: [
        {
          id: 'MAP-003',
          campoFormato: 'Valor Retenido',
          cuentaContable: '236501',
          nombreCuenta: 'Retención en la Fuente',
          tipoMovimiento: 'credito',
          condiciones: 'Todas las retenciones'
        }
      ],
      reglasValidacion: [
        {
          id: 'VAL-003',
          nombre: 'Porcentaje Válido',
          descripcion: 'El porcentaje debe estar entre 0 y 100',
          tipo: 'rango',
          campo: 'Porcentaje Retención',
          valor: '0-100',
          mensajeError: 'El porcentaje de retención debe estar entre 0% y 100%',
          activo: true
        }
      ],
      ultimaModificacion: '2024-10-28T14:15:00',
      usuarioModificador: 'Carlos Rodríguez'
    },
    {
      id: 'CONF-1003',
      codigoFormato: '1003',
      nombreFormato: 'Formulario 1003 - IVA',
      descripcion: 'Declaración mensual del IVA',
      activo: false,
      camposObligatorios: [
        { id: '1', nombre: 'Valor IVA Generado', tipo: 'moneda', obligatorio: true, descripcion: 'IVA generado en ventas' },
        { id: '2', nombre: 'Valor IVA Pagado', tipo: 'moneda', obligatorio: true, descripcion: 'IVA pagado en compras' },
        { id: '3', nombre: 'Saldo a Favor', tipo: 'moneda', obligatorio: false, descripcion: 'Saldo a favor del período' },
        { id: '4', nombre: 'Saldo a Pagar', tipo: 'moneda', obligatorio: false, descripcion: 'Saldo a pagar del período' }
      ],
      camposOpcionales: [],
      mapeoCuentas: [
        {
          id: 'MAP-004',
          campoFormato: 'Valor IVA Generado',
          cuentaContable: '240801',
          nombreCuenta: 'IVA por Pagar',
          tipoMovimiento: 'credito',
          condiciones: 'IVA generado en ventas'
        },
        {
          id: 'MAP-005',
          campoFormato: 'Valor IVA Pagado',
          cuentaContable: '240801',
          nombreCuenta: 'IVA por Pagar',
          tipoMovimiento: 'debito',
          condiciones: 'IVA pagado en compras'
        }
      ],
      reglasValidacion: [],
      ultimaModificacion: '2024-10-25T09:45:00',
      usuarioModificador: 'Ana López'
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

  const getTipoCampoBadge = (tipo: string) => {
    const colors = {
      'texto': 'bg-blue-100 text-blue-800',
      'numero': 'bg-green-100 text-green-800',
      'fecha': 'bg-purple-100 text-purple-800',
      'booleano': 'bg-yellow-100 text-yellow-800',
      'moneda': 'bg-red-100 text-red-800'
    };
    return <Badge className={colors[tipo as keyof typeof colors] || colors.texto}>
      {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
    </Badge>;
  };

  const getTipoMovimientoBadge = (tipo: string) => {
    const colors = {
      'debito': 'bg-blue-100 text-blue-800',
      'credito': 'bg-red-100 text-red-800',
      'ambos': 'bg-purple-100 text-purple-800'
    };
    const labels = {
      'debito': 'Débito',
      'credito': 'Crédito',
      'ambos': 'Ambos'
    };
    return <Badge className={colors[tipo as keyof typeof colors] || colors.debito}>
      {labels[tipo as keyof typeof labels] || tipo}
    </Badge>;
  };

  const filteredFormatos = configuracionesFormatos.filter(formato =>
    formato.nombreFormato.toLowerCase().includes(searchTerm.toLowerCase()) ||
    formato.codigoFormato.includes(searchTerm) ||
    formato.descripcion.toLowerCase().includes(searchTerm)
  );

  const handleVerConfiguracion = (formato: ConfiguracionFormato) => {
    setSelectedFormato(formato);
    setIsEditMode(false);
    setIsDialogOpen(true);
  };

  const handleEditarConfiguracion = (formato: ConfiguracionFormato) => {
    setSelectedFormato(formato);
    setIsEditMode(true);
    setIsDialogOpen(true);
  };

  const handleGuardarConfiguracion = () => {
    toast({
      title: "Configuración guardada",
      description: "Los cambios en la configuración del formato han sido guardados exitosamente.",
    });
    setIsDialogOpen(false);
  };

  const handleToggleActivo = (id: string, activo: boolean) => {
    toast({
      title: activo ? "Formato activado" : "Formato desactivado",
      description: `El formato ${id} ha sido ${activo ? 'activado' : 'desactivado'} exitosamente.`,
    });
  };

  const handleAgregarCampo = (tipo: 'obligatorio' | 'opcional') => {
    // Lógica para agregar campo
    toast({
      title: "Campo agregado",
      description: `Nuevo campo ${tipo} agregado a la configuración.`,
    });
  };

  const handleAgregarMapeo = () => {
    // Lógica para agregar mapeo
    toast({
      title: "Mapeo agregado",
      description: "Nuevo mapeo de cuenta agregado exitosamente.",
    });
  };

  const handleAgregarRegla = () => {
    // Lógica para agregar regla
    toast({
      title: "Regla agregada",
      description: "Nueva regla de validación agregada exitosamente.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Configuración de Formatos</h1>
          <p className="text-muted-foreground">
            Configuración individual de formatos DIAN y mapeo de cuentas contables
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/exogena/historial">
            <Button variant="outline">
              Ver Historial
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
            <CardTitle className="text-sm font-medium">Formatos Configurados</CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{configuracionesFormatos.length}</div>
            <p className="text-xs text-muted-foreground">
              {configuracionesFormatos.filter(f => f.activo).length} activos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Campos Mapeados</CardTitle>
            <MapPin className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {configuracionesFormatos.reduce((sum, f) => sum + f.mapeoCuentas.length, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              mapeos de cuentas totales
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reglas de Validación</CardTitle>
            <CheckCircle className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {configuracionesFormatos.reduce((sum, f) => sum + f.reglasValidacion.length, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              reglas activas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Campos Totales</CardTitle>
            <Calculator className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {configuracionesFormatos.reduce((sum, f) => sum + f.camposObligatorios.length + f.camposOpcionales.length, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              obligatorios y opcionales
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Búsqueda */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Buscar formatos por nombre, código o descripción..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Formato
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de formatos */}
      <Card>
        <CardHeader>
          <CardTitle>Formatos Configurados ({filteredFormatos.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Nombre del Formato</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Campos</TableHead>
                <TableHead>Mapeos</TableHead>
                <TableHead>Última Modificación</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFormatos.map((formato) => (
                <TableRow key={formato.id}>
                  <TableCell className="font-mono font-medium">{formato.codigoFormato}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{formato.nombreFormato}</div>
                      <div className="text-sm text-muted-foreground">{formato.descripcion}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={formato.activo}
                        onCheckedChange={(checked) => handleToggleActivo(formato.id, checked)}
                      />
                      <span className="text-sm">{formato.activo ? 'Activo' : 'Inactivo'}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="font-medium">{formato.camposObligatorios.length} obligatorios</div>
                      <div className="text-muted-foreground">{formato.camposOpcionales.length} opcionales</div>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{formato.mapeoCuentas.length}</TableCell>
                  <TableCell className="text-sm">
                    <div>{formatDate(formato.ultimaModificacion)}</div>
                    <div className="text-muted-foreground">{formato.usuarioModificador}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleVerConfiguracion(formato)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditarConfiguracion(formato)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Diálogo de configuración */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isEditMode ? 'Editar' : 'Ver'} Configuración - {selectedFormato?.codigoFormato} {selectedFormato?.nombreFormato}
            </DialogTitle>
          </DialogHeader>

          {selectedFormato && (
            <Tabs defaultValue="campos" className="space-y-4">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="campos">Campos</TabsTrigger>
                <TabsTrigger value="mapeos">Mapeo de Cuentas</TabsTrigger>
                <TabsTrigger value="validaciones">Validaciones</TabsTrigger>
                <TabsTrigger value="general">Configuración General</TabsTrigger>
              </TabsList>

              <TabsContent value="campos" className="space-y-4">
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">Campos Obligatorios</h3>
                      {isEditMode && (
                        <Button size="sm" onClick={() => handleAgregarCampo('obligatorio')}>
                          <Plus className="h-4 w-4 mr-2" />
                          Agregar Campo
                        </Button>
                      )}
                    </div>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nombre</TableHead>
                          <TableHead>Tipo</TableHead>
                          <TableHead>Descripción</TableHead>
                          {isEditMode && <TableHead>Acciones</TableHead>}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedFormato.camposObligatorios.map((campo) => (
                          <TableRow key={campo.id}>
                            <TableCell className="font-medium">{campo.nombre}</TableCell>
                            <TableCell>{getTipoCampoBadge(campo.tipo)}</TableCell>
                            <TableCell className="max-w-xs truncate">{campo.descripcion}</TableCell>
                            {isEditMode && (
                              <TableCell>
                                <Button variant="ghost" size="sm">
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            )}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">Campos Opcionales</h3>
                      {isEditMode && (
                        <Button size="sm" onClick={() => handleAgregarCampo('opcional')}>
                          <Plus className="h-4 w-4 mr-2" />
                          Agregar Campo
                        </Button>
                      )}
                    </div>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nombre</TableHead>
                          <TableHead>Tipo</TableHead>
                          <TableHead>Descripción</TableHead>
                          {isEditMode && <TableHead>Acciones</TableHead>}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedFormato.camposOpcionales.map((campo) => (
                          <TableRow key={campo.id}>
                            <TableCell className="font-medium">{campo.nombre}</TableCell>
                            <TableCell>{getTipoCampoBadge(campo.tipo)}</TableCell>
                            <TableCell className="max-w-xs truncate">{campo.descripcion}</TableCell>
                            {isEditMode && (
                              <TableCell>
                                <Button variant="ghost" size="sm">
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            )}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="mapeos" className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Mapeo de Cuentas Contables</h3>
                  {isEditMode && (
                    <Button onClick={handleAgregarMapeo}>
                      <Plus className="h-4 w-4 mr-2" />
                      Agregar Mapeo
                    </Button>
                  )}
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Campo del Formato</TableHead>
                      <TableHead>Cuenta Contable</TableHead>
                      <TableHead>Nombre de Cuenta</TableHead>
                      <TableHead>Tipo de Movimiento</TableHead>
                      <TableHead>Condiciones</TableHead>
                      {isEditMode && <TableHead>Acciones</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedFormato.mapeoCuentas.map((mapeo) => (
                      <TableRow key={mapeo.id}>
                        <TableCell className="font-medium">{mapeo.campoFormato}</TableCell>
                        <TableCell className="font-mono">{mapeo.cuentaContable}</TableCell>
                        <TableCell>{mapeo.nombreCuenta}</TableCell>
                        <TableCell>{getTipoMovimientoBadge(mapeo.tipoMovimiento)}</TableCell>
                        <TableCell className="max-w-xs truncate">{mapeo.condiciones || '-'}</TableCell>
                        {isEditMode && (
                          <TableCell>
                            <div className="flex gap-1">
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>

              <TabsContent value="validaciones" className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Reglas de Validación</h3>
                  {isEditMode && (
                    <Button onClick={handleAgregarRegla}>
                      <Plus className="h-4 w-4 mr-2" />
                      Agregar Regla
                    </Button>
                  )}
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Campo</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Mensaje de Error</TableHead>
                      {isEditMode && <TableHead>Acciones</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedFormato.reglasValidacion.map((regla) => (
                      <TableRow key={regla.id}>
                        <TableCell className="font-medium">{regla.nombre}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{regla.tipo}</Badge>
                        </TableCell>
                        <TableCell>{regla.campo}</TableCell>
                        <TableCell>
                          <Badge variant={regla.activo ? "default" : "secondary"}>
                            {regla.activo ? 'Activa' : 'Inactiva'}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-xs truncate">{regla.mensajeError}</TableCell>
                        {isEditMode && (
                          <TableCell>
                            <div className="flex gap-1">
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>

              <TabsContent value="general" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Código del Formato</Label>
                    <Input value={selectedFormato.codigoFormato} disabled={!isEditMode} />
                  </div>
                  <div>
                    <Label>Estado</Label>
                    <div className="flex items-center space-x-2 mt-2">
                      <Switch checked={selectedFormato.activo} disabled={!isEditMode} />
                      <Label>{selectedFormato.activo ? 'Activo' : 'Inactivo'}</Label>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <Label>Nombre del Formato</Label>
                    <Input value={selectedFormato.nombreFormato} disabled={!isEditMode} />
                  </div>
                  <div className="col-span-2">
                    <Label>Descripción</Label>
                    <Textarea value={selectedFormato.descripcion} disabled={!isEditMode} />
                  </div>
                  <div>
                    <Label>Última Modificación</Label>
                    <Input value={formatDate(selectedFormato.ultimaModificacion)} disabled />
                  </div>
                  <div>
                    <Label>Usuario Modificador</Label>
                    <Input value={selectedFormato.usuarioModificador} disabled />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}

          {isEditMode && (
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleGuardarConfiguracion}>
                <Save className="h-4 w-4 mr-2" />
                Guardar Cambios
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}