import { useState } from "react";
import { Save, Upload, Mail, Bell, FileText, Palette, Percent, Settings, Eye, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

interface ConfiguracionFacturacion {
  // Plantillas y formatos
  plantillaFactura: string;
  formatoFactura: 'pdf' | 'html' | 'excel';

  // Logo y branding
  logoFactura: string;
  tituloFactura: string;
  subtituloFactura: string;
  piePaginaFactura: string;

  // Notificaciones
  notificacionesPush: boolean;
  notificacionesEmail: boolean;
  emailRemitente: string;
  nombreRemitente: string;
  asuntoEmail: string;
  plantillaEmail: string;

  // Descuentos
  descuentos: Descuento[];

  // Configuración general
  diasVencimiento: number;
  generarFacturaAutomatica: boolean;
  incluirIVA: boolean;
  incluirICA: boolean;
  incluirFuente: boolean;
  moneda: string;
  zonaHoraria: string;
}

interface Descuento {
  id: string;
  nombre: string;
  descripcion: string;
  tipo: 'porcentaje' | 'fijo';
  valor: number;
  activo: boolean;
  condiciones: string[];
  fechaCreacion: string;
}

export function FacturacionConfig() {
  const [config, setConfig] = useState<ConfiguracionFacturacion>({
    plantillaFactura: "plantilla-estandar",
    formatoFactura: "pdf",
    logoFactura: "",
    tituloFactura: "Factura de Administración",
    subtituloFactura: "Conjunto Residencial Grav",
    piePaginaFactura: "Gracias por su pago oportuno. Este documento es generado automáticamente.",
    notificacionesPush: true,
    notificacionesEmail: true,
    emailRemitente: "facturacion@grav.com",
    nombreRemitente: "Sistema de Facturación Grav",
    asuntoEmail: "Factura de Administración - {mes} {año}",
    plantillaEmail: "Estimado propietario,\n\nAdjunto encontrará la factura correspondiente al período {mes} {año}.\n\nValor a pagar: ${total}\nFecha de vencimiento: {vencimiento}\n\nAtentamente,\nAdministración Grav",
    descuentos: [
      {
        id: "D-001",
        nombre: "Descuento por Pago Oportuno",
        descripcion: "Descuento del 5% por pago antes del vencimiento",
        tipo: "porcentaje",
        valor: 5,
        activo: true,
        condiciones: ["pago_antes_vencimiento"],
        fechaCreacion: "2024-01-15"
      },
      {
        id: "D-002",
        nombre: "Descuento Familiar",
        descripcion: "Descuento fijo de $50.000 para familias numerosas",
        tipo: "fijo",
        valor: 50000,
        activo: true,
        condiciones: ["familia_numerosa"],
        fechaCreacion: "2024-02-01"
      }
    ],
    diasVencimiento: 15,
    generarFacturaAutomatica: true,
    incluirIVA: true,
    incluirICA: false,
    incluirFuente: false,
    moneda: "COP",
    zonaHoraria: "America/Bogota"
  });

  const [previewOpen, setPreviewOpen] = useState(false);
  const [newDescuento, setNewDescuento] = useState<Partial<Descuento>>({
    nombre: "",
    descripcion: "",
    tipo: "porcentaje",
    valor: 0,
    activo: true,
    condiciones: []
  });

  const plantillasDisponibles = [
    { id: "plantilla-estandar", nombre: "Estándar", descripcion: "Plantilla básica con diseño profesional" },
    { id: "plantilla-moderna", nombre: "Moderna", descripcion: "Diseño moderno con elementos visuales" },
    { id: "plantilla-minimalista", nombre: "Minimalista", descripcion: "Diseño limpio y minimalista" },
    { id: "plantilla-personalizada", nombre: "Personalizada", descripcion: "Plantilla completamente personalizable" }
  ];

  const condicionesDescuento = [
    { id: "pago_antes_vencimiento", nombre: "Pago antes del vencimiento" },
    { id: "familia_numerosa", nombre: "Familia numerosa" },
    { id: "persona_mayor", nombre: "Persona mayor de 65 años" },
    { id: "discapacidad", nombre: "Persona con discapacidad" },
    { id: "primer_pago", nombre: "Primer pago del año" },
    { id: "pago_anual", nombre: "Pago anual anticipado" }
  ];

  const handleSaveConfig = () => {
    // Aquí iría la lógica para guardar la configuración
    console.log("Guardando configuración:", config);
    // Simular guardado exitoso
    alert("Configuración guardada exitosamente");
  };

  const handleAddDescuento = () => {
    if (!newDescuento.nombre || !newDescuento.descripcion) return;

    const descuento: Descuento = {
      id: `D-${Date.now()}`,
      nombre: newDescuento.nombre!,
      descripcion: newDescuento.descripcion!,
      tipo: newDescuento.tipo as 'porcentaje' | 'fijo',
      valor: newDescuento.valor || 0,
      activo: newDescuento.activo || true,
      condiciones: newDescuento.condiciones || [],
      fechaCreacion: new Date().toISOString().split('T')[0]
    };

    setConfig(prev => ({
      ...prev,
      descuentos: [...prev.descuentos, descuento]
    }));

    setNewDescuento({
      nombre: "",
      descripcion: "",
      tipo: "porcentaje",
      valor: 0,
      activo: true,
      condiciones: []
    });
  };

  const handleDeleteDescuento = (id: string) => {
    setConfig(prev => ({
      ...prev,
      descuentos: prev.descuentos.filter(d => d.id !== id)
    }));
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Simular subida de archivo
      const reader = new FileReader();
      reader.onload = (e) => {
        setConfig(prev => ({
          ...prev,
          logoFactura: e.target?.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: config.moneda,
      minimumFractionDigits: 0,
    }).format(value);
  };

  const PlantillaPreview = () => {
    const plantillaSeleccionada = plantillasDisponibles.find(p => p.id === config.plantillaFactura);

    switch (config.plantillaFactura) {
      case "plantilla-estandar":
        return (
          <div className="max-w-2xl mx-auto bg-white border-2 border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Plantilla Estándar</h3>
              <p className="text-sm text-gray-600">Diseño profesional y limpio</p>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b">
                <span className="font-medium">Factura #001</span>
                <span className="text-sm text-gray-600">Fecha: {new Date().toLocaleDateString('es-CO')}</span>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><strong>Cliente:</strong> Juan Pérez</div>
                  <div><strong>Unidad:</strong> A-101</div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between py-1">
                  <span>Cuota de Administración</span>
                  <span className="font-mono">{formatCurrency(850000)}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>Fondo de Reserva</span>
                  <span className="font-mono">{formatCurrency(42500)}</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-semibold">
                  <span>Total</span>
                  <span className="font-mono">{formatCurrency(892500)}</span>
                </div>
              </div>
            </div>
          </div>
        );

      case "plantilla-moderna":
        return (
          <div className="max-w-2xl mx-auto bg-gradient-to-br from-blue-50 to-indigo-100 border-2 border-blue-200 rounded-lg p-6 shadow-lg">
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold text-blue-800">Plantilla Moderna</h3>
              <p className="text-sm text-blue-600">Diseño contemporáneo con elementos visuales</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  FACTURA #001
                </div>
                <div className="text-right text-sm text-gray-600">
                  <div>{new Date().toLocaleDateString('es-CO')}</div>
                  <div className="text-blue-600 font-medium">Grav</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="text-xs text-blue-600 font-medium uppercase">Cliente</div>
                  <div className="font-medium">Juan Pérez</div>
                  <div className="text-sm text-gray-600">Unidad A-101</div>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <div className="text-xs text-green-600 font-medium uppercase">Estado</div>
                  <div className="font-medium text-green-600">Pendiente</div>
                  <div className="text-sm text-gray-600">Vence: {new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toLocaleDateString('es-CO')}</div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded">
                  <span>Cuota de Administración</span>
                  <span className="font-mono font-semibold text-blue-600">{formatCurrency(850000)}</span>
                </div>
                <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded">
                  <span>Fondo de Reserva</span>
                  <span className="font-mono font-semibold text-blue-600">{formatCurrency(42500)}</span>
                </div>
                <div className="border-t-2 border-blue-200 pt-2 mt-4">
                  <div className="flex justify-between items-center py-2 px-3 bg-blue-500 text-white rounded font-semibold">
                    <span>TOTAL A PAGAR</span>
                    <span className="font-mono text-lg">{formatCurrency(892500)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "plantilla-minimalista":
        return (
          <div className="max-w-2xl mx-auto bg-white border border-gray-300 rounded-lg p-6">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Plantilla Minimalista</h3>
              <p className="text-sm text-gray-600">Diseño limpio y minimalista</p>
            </div>
            <div className="space-y-4">
              <div className="text-center border-b pb-2">
                <div className="text-2xl font-light text-gray-800">Factura #001</div>
                <div className="text-sm text-gray-500 mt-1">{new Date().toLocaleDateString('es-CO')}</div>
              </div>
              <div className="grid grid-cols-2 gap-8 text-sm">
                <div>
                  <div className="font-medium text-gray-700 mb-1">De:</div>
                  <div className="text-gray-600">Conjunto Residencial Grav</div>
                </div>
                <div>
                  <div className="font-medium text-gray-700 mb-1">Para:</div>
                  <div className="text-gray-600">Juan Pérez - A-101</div>
                </div>
              </div>
              <div className="border-t border-b border-gray-200 py-4">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Cuota de Administración</span>
                    <span className="font-mono">{formatCurrency(850000)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Fondo de Reserva</span>
                    <span className="font-mono">{formatCurrency(42500)}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600 mb-1">Total</div>
                <div className="text-2xl font-light text-gray-800 font-mono">{formatCurrency(892500)}</div>
              </div>
            </div>
          </div>
        );

      case "plantilla-personalizada":
        return (
          <div className="max-w-2xl mx-auto bg-white border-2 border-purple-200 rounded-lg p-6 shadow-md">
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold text-purple-800">Plantilla Personalizada</h3>
              <p className="text-sm text-purple-600">Completamente personalizable</p>
            </div>
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <div className="bg-purple-500 text-white px-4 py-2 rounded-lg font-bold">
                  FACTURA #001
                </div>
                <div className="text-right">
                  <div className="text-purple-600 font-semibold">Grav</div>
                  <div className="text-sm text-gray-600">{new Date().toLocaleDateString('es-CO')}</div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 mb-4 shadow-sm">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-purple-700">Propietario:</span>
                    <div className="text-gray-800">Juan Pérez</div>
                  </div>
                  <div>
                    <span className="font-medium text-purple-700">Unidad:</span>
                    <div className="text-gray-800">A-101</div>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center py-3 px-4 bg-white rounded-lg shadow-sm">
                  <div>
                    <div className="font-medium text-gray-800">Cuota de Administración</div>
                    <div className="text-xs text-gray-500">Servicio mensual</div>
                  </div>
                  <span className="font-mono font-bold text-purple-600 text-lg">{formatCurrency(850000)}</span>
                </div>
                <div className="flex justify-between items-center py-3 px-4 bg-white rounded-lg shadow-sm">
                  <div>
                    <div className="font-medium text-gray-800">Fondo de Reserva</div>
                    <div className="text-xs text-gray-500">Ahorro para emergencias</div>
                  </div>
                  <span className="font-mono font-bold text-purple-600 text-lg">{formatCurrency(42500)}</span>
                </div>
                <div className="mt-4 bg-purple-500 text-white rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-lg">TOTAL</span>
                    <span className="font-mono text-2xl font-bold">{formatCurrency(892500)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="max-w-2xl mx-auto bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600">Selecciona una Plantilla</h3>
            <p className="text-sm text-gray-500 mt-2">Elige una plantilla para ver la previsualización</p>
          </div>
        );
    }
  };

  const FacturaPreview = () => (
    <div className="max-w-2xl mx-auto bg-white border rounded-lg p-8 shadow-lg">
      {/* Header con logo */}
      <div className="flex justify-between items-start mb-8">
        <div>
          {config.logoFactura && (
            <img src={config.logoFactura} alt="Logo" className="h-16 mb-4" />
          )}
          <h1 className="text-2xl font-bold text-gray-900">{config.tituloFactura}</h1>
          <p className="text-gray-600">{config.subtituloFactura}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">Factura #001</p>
          <p className="text-sm text-gray-600">Fecha: {new Date().toLocaleDateString('es-CO')}</p>
          <p className="text-sm text-gray-600">Vencimiento: {new Date(Date.now() + config.diasVencimiento * 24 * 60 * 60 * 1000).toLocaleDateString('es-CO')}</p>
        </div>
      </div>

      {/* Información del propietario */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-2">Información del Propietario</h2>
        <div className="bg-gray-50 p-4 rounded">
          <p><strong>Nombre:</strong> Juan Pérez</p>
          <p><strong>Unidad:</strong> A-101</p>
          <p><strong>Coeficiente:</strong> 1.25%</p>
        </div>
      </div>

      {/* Detalle de conceptos */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-2">Detalle de Facturación</h2>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2 text-left">Concepto</th>
              <th className="border border-gray-300 p-2 text-right">Valor</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 p-2">Cuota de Administración</td>
              <td className="border border-gray-300 p-2 text-right">{formatCurrency(850000)}</td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2">Fondo de Reserva</td>
              <td className="border border-gray-300 p-2 text-right">{formatCurrency(42500)}</td>
            </tr>
            <tr className="bg-gray-50 font-semibold">
              <td className="border border-gray-300 p-2">Subtotal</td>
              <td className="border border-gray-300 p-2 text-right">{formatCurrency(892500)}</td>
            </tr>
            {config.incluirIVA && (
              <tr>
                <td className="border border-gray-300 p-2">IVA (19%)</td>
                <td className="border border-gray-300 p-2 text-right">{formatCurrency(169575)}</td>
              </tr>
            )}
            <tr className="bg-blue-50 font-bold">
              <td className="border border-gray-300 p-2">Total a Pagar</td>
              <td className="border border-gray-300 p-2 text-right">{formatCurrency(config.incluirIVA ? 1062075 : 892500)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Pie de página */}
      <div className="text-center text-sm text-gray-600 border-t pt-4">
        {config.piePaginaFactura}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Configuración de Facturación</h1>
          <p className="text-muted-foreground">
            Configura todos los aspectos del proceso de facturación
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Eye className="mr-2 h-4 w-4" />
                Vista Previa
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Vista Previa de Factura</DialogTitle>
                <DialogDescription>
                  Esta es una vista previa de cómo se verá la factura generada
                </DialogDescription>
              </DialogHeader>
              <FacturaPreview />
            </DialogContent>
          </Dialog>
          <Button onClick={handleSaveConfig}>
            <Save className="mr-2 h-4 w-4" />
            Guardar Configuración
          </Button>
        </div>
      </div>

      <Tabs defaultValue="plantillas" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="plantillas">Plantillas</TabsTrigger>
          <TabsTrigger value="branding">Branding</TabsTrigger>
          <TabsTrigger value="notificaciones">Notificaciones</TabsTrigger>
          <TabsTrigger value="descuentos">Descuentos</TabsTrigger>
          <TabsTrigger value="general">General</TabsTrigger>
        </TabsList>

        <TabsContent value="plantillas" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Plantillas y Formatos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="plantilla">Plantilla de Factura</Label>
                  <Select
                    value={config.plantillaFactura}
                    onValueChange={(value) => setConfig(prev => ({ ...prev, plantillaFactura: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {plantillasDisponibles.map((plantilla) => (
                        <SelectItem key={plantilla.id} value={plantilla.id}>
                          {plantilla.nombre} - {plantilla.descripcion}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="formato">Formato de Exportación</Label>
                  <Select
                    value={config.formatoFactura}
                    onValueChange={(value: 'pdf' | 'html' | 'excel') => setConfig(prev => ({ ...prev, formatoFactura: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="html">HTML</SelectItem>
                      <SelectItem value="excel">Excel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Vista Previa de Plantilla
                </CardTitle>
              </CardHeader>
              <CardContent>
                <PlantillaPreview />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="branding" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Branding y Apariencia
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Logo de la Factura</Label>
                <div className="flex items-center gap-4">
                  {config.logoFactura && (
                    <img src={config.logoFactura} alt="Logo actual" className="h-16 w-16 object-contain border rounded" />
                  )}
                  <div>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                      id="logo-upload"
                    />
                    <Label htmlFor="logo-upload" className="cursor-pointer">
                      <Button variant="outline" asChild>
                        <span>
                          <Upload className="mr-2 h-4 w-4" />
                          {config.logoFactura ? "Cambiar Logo" : "Subir Logo"}
                        </span>
                      </Button>
                    </Label>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="titulo">Título de la Factura</Label>
                  <Input
                    id="titulo"
                    value={config.tituloFactura}
                    onChange={(e) => setConfig(prev => ({ ...prev, tituloFactura: e.target.value }))}
                    placeholder="Ej: Factura de Administración"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subtitulo">Subtítulo</Label>
                  <Input
                    id="subtitulo"
                    value={config.subtituloFactura}
                    onChange={(e) => setConfig(prev => ({ ...prev, subtituloFactura: e.target.value }))}
                    placeholder="Ej: Conjunto Residencial Grav"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pie">Pie de Página</Label>
                <Textarea
                  id="pie"
                  value={config.piePaginaFactura}
                  onChange={(e) => setConfig(prev => ({ ...prev, piePaginaFactura: e.target.value }))}
                  placeholder="Texto que aparecerá al final de la factura"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notificaciones" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notificaciones Push
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Switch
                  id="push-notifications"
                  checked={config.notificacionesPush}
                  onCheckedChange={(checked) => setConfig(prev => ({ ...prev, notificacionesPush: checked }))}
                />
                <Label htmlFor="push-notifications">
                  Habilitar notificaciones push cuando se genere una nueva factura
                </Label>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Notificaciones por Email
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="email-notifications"
                  checked={config.notificacionesEmail}
                  onCheckedChange={(checked) => setConfig(prev => ({ ...prev, notificacionesEmail: checked }))}
                />
                <Label htmlFor="email-notifications">
                  Habilitar envío de facturas por correo electrónico
                </Label>
              </div>

              {config.notificacionesEmail && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email-remitente">Email del Remitente</Label>
                      <Input
                        id="email-remitente"
                        type="email"
                        value={config.emailRemitente}
                        onChange={(e) => setConfig(prev => ({ ...prev, emailRemitente: e.target.value }))}
                        placeholder="facturacion@grav.com"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="nombre-remitente">Nombre del Remitente</Label>
                      <Input
                        id="nombre-remitente"
                        value={config.nombreRemitente}
                        onChange={(e) => setConfig(prev => ({ ...prev, nombreRemitente: e.target.value }))}
                        placeholder="Sistema de Facturación Grav"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="asunto">Asunto del Email</Label>
                    <Input
                      id="asunto"
                      value={config.asuntoEmail}
                      onChange={(e) => setConfig(prev => ({ ...prev, asuntoEmail: e.target.value }))}
                      placeholder="Factura de Administración - {mes} {año}"
                    />
                    <p className="text-sm text-muted-foreground">
                      Puedes usar variables: {"{mes}"}, {"{año}"}, {"{total}"}, {"{vencimiento}"}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="plantilla-email">Plantilla del Email</Label>
                    <Textarea
                      id="plantilla-email"
                      value={config.plantillaEmail}
                      onChange={(e) => setConfig(prev => ({ ...prev, plantillaEmail: e.target.value }))}
                      placeholder="Contenido del email..."
                      rows={6}
                    />
                    <p className="text-sm text-muted-foreground">
                      Variables disponibles: {"{mes}"}, {"{año}"}, {"{total}"}, {"{vencimiento}"}, {"{nombre_propietario}"}
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="descuentos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Percent className="h-5 w-5" />
                Gestión de Descuentos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">
                  Configura descuentos automáticos aplicables a las facturas
                </p>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Settings className="mr-2 h-4 w-4" />
                      Nuevo Descuento
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Crear Nuevo Descuento</DialogTitle>
                      <DialogDescription>
                        Define un nuevo descuento para aplicar automáticamente a las facturas
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="descuento-nombre">Nombre del Descuento</Label>
                        <Input
                          id="descuento-nombre"
                          value={newDescuento.nombre || ""}
                          onChange={(e) => setNewDescuento(prev => ({ ...prev, nombre: e.target.value }))}
                          placeholder="Ej: Descuento por pago oportuno"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="descuento-descripcion">Descripción</Label>
                        <Textarea
                          id="descuento-descripcion"
                          value={newDescuento.descripcion || ""}
                          onChange={(e) => setNewDescuento(prev => ({ ...prev, descripcion: e.target.value }))}
                          placeholder="Descripción detallada del descuento"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="descuento-tipo">Tipo</Label>
                          <Select
                            value={newDescuento.tipo || "porcentaje"}
                            onValueChange={(value: 'porcentaje' | 'fijo') => setNewDescuento(prev => ({ ...prev, tipo: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="porcentaje">Porcentaje</SelectItem>
                              <SelectItem value="fijo">Valor Fijo</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="descuento-valor">Valor</Label>
                          <Input
                            id="descuento-valor"
                            type="number"
                            value={newDescuento.valor || ""}
                            onChange={(e) => setNewDescuento(prev => ({ ...prev, valor: Number(e.target.value) }))}
                            placeholder={newDescuento.tipo === 'porcentaje' ? "5" : "50000"}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Condiciones de Aplicación</Label>
                        <div className="grid grid-cols-2 gap-2">
                          {condicionesDescuento.map((condicion) => (
                            <div key={condicion.id} className="flex items-center space-x-2">
                              <Checkbox
                                id={`condicion-${condicion.id}`}
                                checked={newDescuento.condiciones?.includes(condicion.id) || false}
                                onCheckedChange={(checked) => {
                                  const condiciones = newDescuento.condiciones || [];
                                  const nuevasCondiciones = checked
                                    ? [...condiciones, condicion.id]
                                    : condiciones.filter(c => c !== condicion.id);
                                  setNewDescuento(prev => ({ ...prev, condiciones: nuevasCondiciones }));
                                }}
                              />
                              <Label htmlFor={`condicion-${condicion.id}`} className="text-sm">
                                {condicion.nombre}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setNewDescuento({
                          nombre: "",
                          descripcion: "",
                          tipo: "porcentaje",
                          valor: 0,
                          activo: true,
                          condiciones: []
                        })}>
                          Cancelar
                        </Button>
                        <Button onClick={handleAddDescuento}>
                          Crear Descuento
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="space-y-2">
                {config.descuentos.map((descuento) => (
                  <div key={descuento.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{descuento.nombre}</h4>
                        <Badge variant={descuento.activo ? "default" : "secondary"}>
                          {descuento.activo ? "Activo" : "Inactivo"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{descuento.descripcion}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-sm">
                          Tipo: <Badge variant="outline">{descuento.tipo === 'porcentaje' ? 'Porcentaje' : 'Valor Fijo'}</Badge>
                        </span>
                        <span className="text-sm">
                          Valor: {descuento.tipo === 'porcentaje' ? `${descuento.valor}%` : formatCurrency(descuento.valor)}
                        </span>
                        <span className="text-sm">
                          Condiciones: {descuento.condiciones.length}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteDescuento(descuento.id)}
                    >
                      Eliminar
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Configuración General
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dias-vencimiento">Días para Vencimiento</Label>
                  <Input
                    id="dias-vencimiento"
                    type="number"
                    value={config.diasVencimiento}
                    onChange={(e) => setConfig(prev => ({ ...prev, diasVencimiento: Number(e.target.value) }))}
                    placeholder="15"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="moneda">Moneda</Label>
                  <Select
                    value={config.moneda}
                    onValueChange={(value) => setConfig(prev => ({ ...prev, moneda: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="COP">Peso Colombiano (COP)</SelectItem>
                      <SelectItem value="USD">Dólar Estadounidense (USD)</SelectItem>
                      <SelectItem value="EUR">Euro (EUR)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Impuestos a Incluir</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="iva"
                      checked={config.incluirIVA}
                      onCheckedChange={(checked) => setConfig(prev => ({ ...prev, incluirIVA: checked }))}
                    />
                    <Label htmlFor="iva">IVA (19%)</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="ica"
                      checked={config.incluirICA}
                      onCheckedChange={(checked) => setConfig(prev => ({ ...prev, incluirICA: checked }))}
                    />
                    <Label htmlFor="ica">ICA</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="fuente"
                      checked={config.incluirFuente}
                      onCheckedChange={(checked) => setConfig(prev => ({ ...prev, incluirFuente: checked }))}
                    />
                    <Label htmlFor="fuente">Retención en la Fuente</Label>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="factura-automatica"
                    checked={config.generarFacturaAutomatica}
                    onCheckedChange={(checked) => setConfig(prev => ({ ...prev, generarFacturaAutomatica: checked }))}
                  />
                  <Label htmlFor="factura-automatica">
                    Generar facturas automáticamente al final de cada período
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}