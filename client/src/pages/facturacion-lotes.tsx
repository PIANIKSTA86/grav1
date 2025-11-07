import { useState } from "react";
import { Plus, Search, Calendar, Building2, FileText, Settings, CheckCircle, ArrowRight, ArrowLeft, Users, DollarSign, Bell, Calculator } from "lucide-react";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";

type FacturacionStep = 1 | 2 | 3 | 4 | 5;

interface ConceptoGlobal {
  id: string;
  nombre: string;
  descripcion: string;
  valorBase: number;
  tipo: 'fijo' | 'porcentaje' | 'variable';
  obligatorio: boolean;
}

interface UnidadSeleccionada {
  id: string;
  nombre: string;
  propietario: string;
  coeficiente: number;
  selected: boolean;
}

// Mock data - Definidos fuera del componente para evitar errores de inicialización
const periodosDisponibles = [
  { id: "2024-11", nombre: "Noviembre 2024", estado: "abierto" },
  { id: "2024-10", nombre: "Octubre 2024", estado: "cerrado" },
  { id: "2024-09", nombre: "Septiembre 2024", estado: "cerrado" },
];

const unidadesMock: UnidadSeleccionada[] = [
  { id: "U-001", nombre: "APT-101", propietario: "María González", coeficiente: 1.25, selected: false },
  { id: "U-002", nombre: "APT-102", propietario: "Carlos Rodríguez", coeficiente: 1.00, selected: false },
  { id: "U-003", nombre: "APT-201", propietario: "Ana López", coeficiente: 0.85, selected: false },
  { id: "U-004", nombre: "APT-202", propietario: "Pedro Martínez", coeficiente: 1.15, selected: false },
  { id: "U-005", nombre: "APT-301", propietario: "Laura Sánchez", coeficiente: 1.30, selected: false },
  { id: "U-006", nombre: "APT-302", propietario: "Diego Torres", coeficiente: 0.90, selected: false },
];

const conceptosGlobales: ConceptoGlobal[] = [
  {
    id: "CG-001",
    nombre: "Cuota de Administración",
    descripcion: "Cuota mensual de administración del conjunto",
    valorBase: 850000,
    tipo: "fijo",
    obligatorio: true
  },
  {
    id: "CG-002",
    nombre: "Fondo de Reserva",
    descripcion: "Aporte mensual al fondo de reserva",
    valorBase: 150000,
    tipo: "fijo",
    obligatorio: false
  },
  {
    id: "CG-003",
    nombre: "Intereses de Mora",
    descripcion: "Intereses por pagos atrasados (2% mensual)",
    valorBase: 2,
    tipo: "porcentaje",
    obligatorio: false
  },
  {
    id: "CG-004",
    nombre: "Cuota Extraordinaria",
    descripcion: "Cuota para mantenimiento especial",
    valorBase: 200000,
    tipo: "fijo",
    obligatorio: false
  },
  {
    id: "CG-005",
    nombre: "Seguros",
    descripcion: "Prima mensual de seguros del conjunto",
    valorBase: 75000,
    tipo: "fijo",
    obligatorio: false
  }
];

const steps = [
  { number: 1, title: "Período", description: "Seleccionar período", icon: Calendar },
  { number: 2, title: "Unidades", description: "Seleccionar unidades", icon: Building2 },
  { number: 3, title: "Conceptos", description: "Conceptos globales", icon: FileText },
  { number: 4, title: "Condiciones", description: "Configurar condiciones", icon: Settings },
  { number: 5, title: "Generar", description: "Generar liquidación", icon: CheckCircle },
];

export default function Facturacion() {
  const [currentStep, setCurrentStep] = useState<FacturacionStep>(1);
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState("");
  const [unidadesSeleccionadas, setUnidadesSeleccionadas] = useState<UnidadSeleccionada[]>(unidadesMock);
  const [conceptosSeleccionados, setConceptosSeleccionados] = useState<string[]>(["CG-001"]); // Cuota administración obligatoria
  const [condicionesFacturacion, setCondicionesFacturacion] = useState({
    incluirParametrosIndividuales: false,
    enviarNotificaciones: true,
    contabilizar: true,
    fechaVencimiento: "",
    notas: ""
  });

  const handleUnidadToggle = (unidadId: string) => {
    setUnidadesSeleccionadas(prev =>
      prev.map(unidad =>
        unidad.id === unidadId
          ? { ...unidad, selected: !unidad.selected }
          : unidad
      )
    );
  };

  const handleSelectAllUnidades = () => {
    const allSelected = unidadesSeleccionadas.every(u => u.selected);
    setUnidadesSeleccionadas(prev =>
      prev.map(unidad => ({ ...unidad, selected: !allSelected }))
    );
  };

  const handleConceptoToggle = (conceptoId: string) => {
    setConceptosSeleccionados(prev =>
      prev.includes(conceptoId)
        ? prev.filter(id => id !== conceptoId)
        : [...prev, conceptoId]
    );
  };

  const nextStep = () => {
    if (currentStep < 5) {
      setCurrentStep((currentStep + 1) as FacturacionStep);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as FacturacionStep);
    }
  };

  const canProceedToNext = () => {
    switch (currentStep) {
      case 1:
        return periodoSeleccionado !== "";
      case 2:
        return unidadesSeleccionadas.some(u => u.selected);
      case 3:
        return conceptosSeleccionados.length > 0;
      case 4:
        return condicionesFacturacion.fechaVencimiento !== "";
      case 5:
        return true;
      default:
        return false;
    }
  };

  const getStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Paso 1: Seleccionar Período de Facturación
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="periodo">Período de Facturación</Label>
                  <Select value={periodoSeleccionado} onValueChange={setPeriodoSeleccionado}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar período" />
                    </SelectTrigger>
                    <SelectContent>
                      {periodosDisponibles.map((periodo) => (
                        <SelectItem key={periodo.id} value={periodo.id}>
                          <div className="flex items-center justify-between w-full">
                            <span>{periodo.nombre}</span>
                            <Badge variant={periodo.estado === "abierto" ? "default" : "secondary"}>
                              {periodo.estado}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {periodoSeleccionado && (
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900">Período Seleccionado</h4>
                    <p className="text-blue-700">
                      {periodosDisponibles.find(p => p.id === periodoSeleccionado)?.nombre}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );

      case 2:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Paso 2: Seleccionar Unidades para Facturación
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="select-all"
                      checked={unidadesSeleccionadas.every(u => u.selected)}
                      onCheckedChange={handleSelectAllUnidades}
                    />
                    <Label htmlFor="select-all" className="font-medium">
                      Seleccionar todas las unidades
                    </Label>
                  </div>
                  <Badge variant="outline">
                    {unidadesSeleccionadas.filter(u => u.selected).length} de {unidadesSeleccionadas.length} seleccionadas
                  </Badge>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12"></TableHead>
                      <TableHead>Unidad</TableHead>
                      <TableHead>Propietario</TableHead>
                      <TableHead className="text-right">Coeficiente</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {unidadesSeleccionadas.map((unidad) => (
                      <TableRow key={unidad.id}>
                        <TableCell>
                          <Checkbox
                            checked={unidad.selected}
                            onCheckedChange={() => handleUnidadToggle(unidad.id)}
                          />
                        </TableCell>
                        <TableCell className="font-medium">{unidad.nombre}</TableCell>
                        <TableCell>{unidad.propietario}</TableCell>
                        <TableCell className="text-right">{unidad.coeficiente}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        );

      case 3:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Paso 3: Seleccionar Conceptos Globales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4">
                  {conceptosGlobales.map((concepto) => (
                    <div key={concepto.id} className="flex items-start space-x-3 p-4 border rounded-lg">
                      <Checkbox
                        id={concepto.id}
                        checked={conceptosSeleccionados.includes(concepto.id)}
                        onCheckedChange={() => handleConceptoToggle(concepto.id)}
                        disabled={concepto.obligatorio}
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Label htmlFor={concepto.id} className="font-medium cursor-pointer">
                            {concepto.nombre}
                          </Label>
                          {concepto.obligatorio && (
                            <Badge variant="destructive" className="text-xs">Obligatorio</Badge>
                          )}
                          <Badge variant="outline" className="text-xs">
                            {concepto.tipo === 'fijo' ? 'Valor fijo' :
                             concepto.tipo === 'porcentaje' ? 'Porcentaje' : 'Variable'}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{concepto.descripcion}</p>
                        <div className="mt-2">
                          <span className="text-sm font-medium">
                            Valor base: {concepto.tipo === 'porcentaje'
                              ? `${concepto.valorBase}%`
                              : new Intl.NumberFormat("es-CO", {
                                  style: "currency",
                                  currency: "COP",
                                  minimumFractionDigits: 0,
                                }).format(concepto.valorBase)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium">Resumen de Conceptos Seleccionados</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {conceptosSeleccionados.length} conceptos seleccionados para facturación masiva
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 4:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Paso 4: Configurar Condiciones de Facturación
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="parametros-individuales"
                    checked={condicionesFacturacion.incluirParametrosIndividuales}
                    onCheckedChange={(checked) =>
                      setCondicionesFacturacion(prev => ({
                        ...prev,
                        incluirParametrosIndividuales: checked as boolean
                      }))
                    }
                  />
                  <div>
                    <Label htmlFor="parametros-individuales" className="font-medium cursor-pointer">
                      Incluir parámetros por unidad individual
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Permitir ajustes específicos para cada unidad seleccionada
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="notificaciones"
                    checked={condicionesFacturacion.enviarNotificaciones}
                    onCheckedChange={(checked) =>
                      setCondicionesFacturacion(prev => ({
                        ...prev,
                        enviarNotificaciones: checked as boolean
                      }))
                    }
                  />
                  <div>
                    <Label htmlFor="notificaciones" className="font-medium cursor-pointer flex items-center gap-2">
                      <Bell className="h-4 w-4" />
                      Enviar notificaciones automáticas
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Notificar a propietarios sobre la nueva facturación
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="contabilizar"
                    checked={condicionesFacturacion.contabilizar}
                    onCheckedChange={(checked) =>
                      setCondicionesFacturacion(prev => ({
                        ...prev,
                        contabilizar: checked as boolean
                      }))
                    }
                  />
                  <div>
                    <Label htmlFor="contabilizar" className="font-medium cursor-pointer flex items-center gap-2">
                      <Calculator className="h-4 w-4" />
                      Contabilizar automáticamente
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Registrar los movimientos en el módulo contable
                    </p>
                  </div>
                </div>

                <div>
                  <Label htmlFor="fecha-vencimiento">Fecha de Vencimiento</Label>
                  <Input
                    id="fecha-vencimiento"
                    type="date"
                    value={condicionesFacturacion.fechaVencimiento}
                    onChange={(e) =>
                      setCondicionesFacturacion(prev => ({
                        ...prev,
                        fechaVencimiento: e.target.value
                      }))
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="notas">Notas Adicionales</Label>
                  <Textarea
                    id="notas"
                    placeholder="Observaciones sobre esta facturación..."
                    value={condicionesFacturacion.notas}
                    onChange={(e) =>
                      setCondicionesFacturacion(prev => ({
                        ...prev,
                        notas: e.target.value
                      }))
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 5:
        const unidadesFacturar = unidadesSeleccionadas.filter(u => u.selected);
        const conceptosFacturar = conceptosGlobales.filter(c => conceptosSeleccionados.includes(c.id));

        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Paso 5: Generar Liquidación Masiva
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Resumen de Facturación</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span>Período:</span>
                      <span className="font-medium">
                        {periodosDisponibles.find(p => p.id === periodoSeleccionado)?.nombre}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Unidades a facturar:</span>
                      <span className="font-medium">{unidadesFacturar.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Conceptos incluidos:</span>
                      <span className="font-medium">{conceptosFacturar.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Fecha vencimiento:</span>
                      <span className="font-medium">{condicionesFacturacion.fechaVencimiento}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Configuración</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span className="text-sm">
                        {condicionesFacturacion.incluirParametrosIndividuales ? 'Parámetros individuales' : 'Parámetros globales'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Bell className="h-4 w-4" />
                      <span className="text-sm">
                        {condicionesFacturacion.enviarNotificaciones ? 'Notificaciones activas' : 'Sin notificaciones'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calculator className="h-4 w-4" />
                      <span className="text-sm">
                        {condicionesFacturacion.contabilizar ? 'Contabilización automática' : 'Sin contabilizar'}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  <div>
                    <h4 className="font-medium text-green-900">Listo para generar liquidación</h4>
                    <p className="text-sm text-green-700 mt-1">
                      Se generarán {unidadesFacturar.length} facturas para el período seleccionado.
                      Este proceso no se puede deshacer.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={() => alert('¡Liquidación generada exitosamente!')}
                  className="flex-1"
                  size="lg"
                >
                  <CheckCircle className="mr-2 h-5 w-5" />
                  Generar Liquidación Masiva
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
          <h1 className="text-3xl font-bold tracking-tight">Facturación por Lotes</h1>
          <p className="text-muted-foreground">
            Proceso masivo de facturación para múltiples unidades del conjunto residencial
          </p>
        </div>
      </div>

      {/* Progress Steps */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.number;
              const isCompleted = currentStep > step.number;

              return (
                <div key={step.number} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    isCompleted
                      ? 'bg-green-500 border-green-500 text-white'
                      : isActive
                      ? 'border-blue-500 text-blue-500'
                      : 'border-gray-300 text-gray-400'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <Icon className="h-5 w-5" />
                    )}
                  </div>
                  <div className="ml-3 hidden sm:block">
                    <div className={`text-sm font-medium ${
                      isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      {step.title}
                    </div>
                    <div className="text-xs text-gray-500">{step.description}</div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-12 h-0.5 mx-4 ${
                      isCompleted ? 'bg-green-500' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>

          <Progress value={(currentStep / 5) * 100} className="w-full" />
        </CardContent>
      </Card>

      {/* Step Content */}
      {getStepContent()}

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 1}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Anterior
        </Button>

        <div className="flex gap-2">
          <Button variant="outline">
            Guardar Borrador
          </Button>
          <Button
            onClick={nextStep}
            disabled={!canProceedToNext()}
          >
            {currentStep === 5 ? (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Finalizar
              </>
            ) : (
              <>
                Siguiente
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}