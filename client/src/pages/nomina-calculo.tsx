import { useState } from "react";
import { Calculator, Save, ArrowRight, ArrowLeft, Edit3, CheckCircle, AlertTriangle, DollarSign, Percent } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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

interface CalculoNomina {
  id: string;
  nombre: string;
  apellido: string;
  cargo: string;
  // Devengados
  salarioBase: number;
  auxilioTransporte: number;
  auxilioAlimentacion: number;
  horasExtrasDiurnas: number;
  horasExtrasNocturnas: number;
  horasExtrasFestivas: number;
  bonificaciones: number;
  totalDevengado: number;
  // Deducciones
  salud: number;
  pension: number;
  arl: number;
  deducciones: number;
  totalDeducciones: number;
  // Novedades
  diasIncapacidad: number;
  diasLicencia: number;
  // Resultado
  netoPagar: number;
  estado: 'calculada' | 'revisada' | 'aprobada';
  observaciones: string;
}

export default function NominaCalculo() {
  const { toast } = useToast();
  const [calculoEditando, setCalculoEditando] = useState<CalculoNomina | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [ajustes, setAjustes] = useState({
    bonificaciones: 0,
    deducciones: 0,
    observaciones: ''
  });

  // Datos de ejemplo - cálculos de nómina
  const [calculosNomina, setCalculosNomina] = useState<CalculoNomina[]>([
    {
      id: 'EMP-001',
      nombre: 'María',
      apellido: 'González',
      cargo: 'Administradora',
      salarioBase: 2500000,
      auxilioTransporte: 140606,
      auxilioAlimentacion: 0,
      horasExtrasDiurnas: 20000,
      horasExtrasNocturnas: 0,
      horasExtrasFestivas: 0,
      bonificaciones: 50000,
      totalDevengado: 2670606,
      salud: 106824,
      pension: 106824,
      arl: 13966,
      deducciones: 0,
      totalDeducciones: 227614,
      diasIncapacidad: 0,
      diasLicencia: 0,
      netoPagar: 2442992,
      estado: 'calculada',
      observaciones: ''
    },
    {
      id: 'EMP-002',
      nombre: 'Carlos',
      apellido: 'Rodríguez',
      cargo: 'Conserje',
      salarioBase: 1500000,
      auxilioTransporte: 140606,
      auxilioAlimentacion: 0,
      horasExtrasDiurnas: 0,
      horasExtrasNocturnas: 45000,
      horasExtrasFestivas: 0,
      bonificaciones: 0,
      totalDevengado: 1640606,
      salud: 65624,
      pension: 65624,
      arl: 8597,
      deducciones: 0,
      totalDeducciones: 139845,
      diasIncapacidad: 6,
      diasLicencia: 0,
      netoPagar: 1501761,
      estado: 'calculada',
      observaciones: 'Incapacidad médica registrada'
    },
    {
      id: 'EMP-003',
      nombre: 'Ana',
      apellido: 'López',
      cargo: 'Auxiliar de Limpieza',
      salarioBase: 1300000,
      auxilioTransporte: 140606,
      auxilioAlimentacion: 0,
      horasExtrasDiurnas: 0,
      horasExtrasNocturnas: 0,
      horasExtrasFestivas: 0,
      bonificaciones: 0,
      totalDevengado: 1440606,
      salud: 57624,
      pension: 57624,
      arl: 7543,
      deducciones: 0,
      totalDeducciones: 120791,
      diasIncapacidad: 0,
      diasLicencia: 0,
      netoPagar: 1319815,
      estado: 'calculada',
      observaciones: ''
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
      case 'calculada':
        return <Badge className="bg-blue-100 text-blue-800">Calculada</Badge>;
      case 'revisada':
        return <Badge className="bg-yellow-100 text-yellow-800">Revisada</Badge>;
      case 'aprobada':
        return <Badge className="bg-green-100 text-green-800">Aprobada</Badge>;
      default:
        return <Badge variant="secondary">{estado}</Badge>;
    }
  };

  const handleEditarCalculo = (calculo: CalculoNomina) => {
    setCalculoEditando({ ...calculo });
    setAjustes({
      bonificaciones: calculo.bonificaciones,
      deducciones: calculo.deducciones,
      observaciones: calculo.observaciones
    });
    setDialogOpen(true);
  };

  const handleAplicarAjustes = () => {
    if (!calculoEditando) return;

    const calculoActualizado = {
      ...calculoEditando,
      bonificaciones: ajustes.bonificaciones,
      deducciones: ajustes.deducciones,
      totalDevengado: calculoEditando.salarioBase +
                     calculoEditando.auxilioTransporte +
                     calculoEditando.auxilioAlimentacion +
                     calculoEditando.horasExtrasDiurnas +
                     calculoEditando.horasExtrasNocturnas +
                     calculoEditando.horasExtrasFestivas +
                     ajustes.bonificaciones,
      totalDeducciones: calculoEditando.salud +
                       calculoEditando.pension +
                       calculoEditando.arl +
                       ajustes.deducciones,
      netoPagar: 0, // Se recalculará
      observaciones: ajustes.observaciones,
      estado: 'revisada' as const
    };

    // Recalcular neto a pagar
    calculoActualizado.netoPagar = calculoActualizado.totalDevengado - calculoActualizado.totalDeducciones;

    setCalculosNomina(prev =>
      prev.map(calc => calc.id === calculoEditando.id ? calculoActualizado : calc)
    );

    setCalculoEditando(calculoActualizado);

    toast({
      title: "Ajustes aplicados",
      description: `Los ajustes han sido aplicados a ${calculoEditando.nombre} ${calculoEditando.apellido}.`,
    });
  };

  const handleMarcarRevisado = (calculoId: string) => {
    setCalculosNomina(prev =>
      prev.map(calc =>
        calc.id === calculoId
          ? { ...calc, estado: 'revisada' as const }
          : calc
      )
    );

    toast({
      title: "Marcado como revisado",
      description: "El cálculo ha sido marcado como revisado.",
    });
  };

  const handleGuardarCambios = () => {
    if (!calculoEditando) return;

    setCalculosNomina(prev =>
      prev.map(calc => calc.id === calculoEditando.id ? calculoEditando : calc)
    );

    toast({
      title: "Cambios guardados",
      description: `Los cambios en el cálculo de ${calculoEditando.nombre} ${calculoEditando.apellido} han sido guardados.`,
    });

    setDialogOpen(false);
    setCalculoEditando(null);
  };

  const totalDevengado = calculosNomina.reduce((sum, calc) => sum + calc.totalDevengado, 0);
  const totalDeducciones = calculosNomina.reduce((sum, calc) => sum + calc.totalDeducciones, 0);
  const totalNomina = calculosNomina.reduce((sum, calc) => sum + calc.netoPagar, 0);
  const calculosRevisados = calculosNomina.filter(calc => calc.estado === 'revisada').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cálculo de Nómina</h1>
          <p className="text-muted-foreground">
            Revise y ajuste los cálculos de nómina por empleado
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/nomina/novedades">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver
            </Button>
          </Link>
          <Link href="/nomina/revision">
            <Button>
              Continuar
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Estadísticas del cálculo */}
      <div className="grid gap-4 md:grid-cols-4">
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
              suma de devengados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Deducciones</CardTitle>
            <Percent className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-red-600">
              {formatCurrency(totalDeducciones)}
            </div>
            <p className="text-xs text-muted-foreground">
              suma de deducciones
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total a Pagar</CardTitle>
            <Calculator className="h-4 w-4 text-purple-600" />
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

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revisados</CardTitle>
            <CheckCircle className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-blue-600">
              {calculosRevisados}/{calculosNomina.length}
            </div>
            <p className="text-xs text-muted-foreground">
              cálculos revisados
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabla de cálculos de nómina */}
      <Card>
        <CardHeader>
          <CardTitle>Cálculos de Nómina por Empleado</CardTitle>
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
                <TableHead>Novedades</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {calculosNomina.map((calculo) => (
                <TableRow key={calculo.id}>
                  <TableCell className="font-medium">
                    {calculo.nombre} {calculo.apellido}
                  </TableCell>
                  <TableCell>{calculo.cargo}</TableCell>
                  <TableCell className="font-mono text-green-600">
                    {formatCurrency(calculo.totalDevengado)}
                  </TableCell>
                  <TableCell className="font-mono text-red-600">
                    {formatCurrency(calculo.totalDeducciones)}
                  </TableCell>
                  <TableCell className="font-mono font-semibold text-purple-600">
                    {formatCurrency(calculo.netoPagar)}
                  </TableCell>
                  <TableCell>
                    {(calculo.diasIncapacidad > 0 || calculo.diasLicencia > 0) && (
                      <div className="space-y-1">
                        {calculo.diasIncapacidad > 0 && (
                          <Badge variant="outline" className="text-xs">
                            Inc: {calculo.diasIncapacidad}d
                          </Badge>
                        )}
                        {calculo.diasLicencia > 0 && (
                          <Badge variant="outline" className="text-xs">
                            Lic: {calculo.diasLicencia}d
                          </Badge>
                        )}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>{getEstadoBadge(calculo.estado)}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Dialog open={dialogOpen && calculoEditando?.id === calculo.id} onOpenChange={setDialogOpen}>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm" onClick={() => handleEditarCalculo(calculo)}>
                            <Edit3 className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>
                              Revisión de Cálculo - {calculo.nombre} {calculo.apellido}
                            </DialogTitle>
                          </DialogHeader>

                          {calculoEditando && (
                            <div className="space-y-6">
                              {/* Detalle del cálculo */}
                              <div className="grid grid-cols-2 gap-6">
                                {/* Devengados */}
                                <Card>
                                  <CardHeader>
                                    <CardTitle className="text-lg text-green-700">Devengados</CardTitle>
                                  </CardHeader>
                                  <CardContent className="space-y-2">
                                    <div className="flex justify-between">
                                      <span>Salario Base:</span>
                                      <span className="font-mono">{formatCurrency(calculoEditando.salarioBase)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Auxilio Transporte:</span>
                                      <span className="font-mono">{formatCurrency(calculoEditando.auxilioTransporte)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Horas Extras Diurnas:</span>
                                      <span className="font-mono">{formatCurrency(calculoEditando.horasExtrasDiurnas)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Horas Extras Nocturnas:</span>
                                      <span className="font-mono">{formatCurrency(calculoEditando.horasExtrasNocturnas)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Bonificaciones:</span>
                                      <span className="font-mono">{formatCurrency(calculoEditando.bonificaciones)}</span>
                                    </div>
                                    <hr />
                                    <div className="flex justify-between font-semibold">
                                      <span>Total Devengado:</span>
                                      <span className="font-mono text-green-600">{formatCurrency(calculoEditando.totalDevengado)}</span>
                                    </div>
                                  </CardContent>
                                </Card>

                                {/* Deducciones */}
                                <Card>
                                  <CardHeader>
                                    <CardTitle className="text-lg text-red-700">Deducciones</CardTitle>
                                  </CardHeader>
                                  <CardContent className="space-y-2">
                                    <div className="flex justify-between">
                                      <span>Salud (4%):</span>
                                      <span className="font-mono">{formatCurrency(calculoEditando.salud)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Pensión (4%):</span>
                                      <span className="font-mono">{formatCurrency(calculoEditando.pension)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>ARL (0.522%):</span>
                                      <span className="font-mono">{formatCurrency(calculoEditando.arl)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Otras Deducciones:</span>
                                      <span className="font-mono">{formatCurrency(calculoEditando.deducciones)}</span>
                                    </div>
                                    <hr />
                                    <div className="flex justify-between font-semibold">
                                      <span>Total Deducciones:</span>
                                      <span className="font-mono text-red-600">{formatCurrency(calculoEditando.totalDeducciones)}</span>
                                    </div>
                                  </CardContent>
                                </Card>
                              </div>

                              {/* Novedades */}
                              {(calculoEditando.diasIncapacidad > 0 || calculoEditando.diasLicencia > 0) && (
                                <Card>
                                  <CardHeader>
                                    <CardTitle className="text-lg text-yellow-700">Novedades</CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                    <div className="grid grid-cols-2 gap-4">
                                      {calculoEditando.diasIncapacidad > 0 && (
                                        <div className="text-center p-4 bg-red-50 rounded">
                                          <div className="text-2xl font-bold text-red-600">{calculoEditando.diasIncapacidad}</div>
                                          <div className="text-sm text-red-700">Días Incapacidad</div>
                                        </div>
                                      )}
                                      {calculoEditando.diasLicencia > 0 && (
                                        <div className="text-center p-4 bg-yellow-50 rounded">
                                          <div className="text-2xl font-bold text-yellow-600">{calculoEditando.diasLicencia}</div>
                                          <div className="text-sm text-yellow-700">Días Licencia</div>
                                        </div>
                                      )}
                                    </div>
                                  </CardContent>
                                </Card>
                              )}

                              {/* Ajustes */}
                              <Card>
                                <CardHeader>
                                  <CardTitle className="text-lg">Ajustes Manuales</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <Label htmlFor="bonificaciones">Bonificaciones Adicionales</Label>
                                      <Input
                                        id="bonificaciones"
                                        type="number"
                                        value={ajustes.bonificaciones}
                                        onChange={(e) => setAjustes(prev => ({
                                          ...prev,
                                          bonificaciones: Number(e.target.value)
                                        }))}
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor="deducciones">Deducciones Adicionales</Label>
                                      <Input
                                        id="deducciones"
                                        type="number"
                                        value={ajustes.deducciones}
                                        onChange={(e) => setAjustes(prev => ({
                                          ...prev,
                                          deducciones: Number(e.target.value)
                                        }))}
                                      />
                                    </div>
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="observaciones">Observaciones</Label>
                                    <Input
                                      id="observaciones"
                                      placeholder="Observaciones del ajuste..."
                                      value={ajustes.observaciones}
                                      onChange={(e) => setAjustes(prev => ({
                                        ...prev,
                                        observaciones: e.target.value
                                      }))}
                                    />
                                  </div>
                                  <Button onClick={handleAplicarAjustes} className="w-full">
                                    Aplicar Ajustes
                                  </Button>
                                </CardContent>
                              </Card>

                              {/* Resultado final */}
                              <Card>
                                <CardHeader>
                                  <CardTitle className="text-lg text-center">Resultado Final</CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <div className="text-center space-y-2">
                                    <div className="text-4xl font-bold font-mono text-purple-600">
                                      {formatCurrency(calculoEditando.netoPagar)}
                                    </div>
                                    <div className="text-lg text-muted-foreground">Neto a Pagar</div>
                                    {calculoEditando.observaciones && (
                                      <div className="text-sm text-muted-foreground bg-gray-50 p-2 rounded">
                                        {calculoEditando.observaciones}
                                      </div>
                                    )}
                                  </div>
                                </CardContent>
                              </Card>

                              <div className="flex justify-end gap-2">
                                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                                  Cancelar
                                </Button>
                                <Button onClick={handleGuardarCambios}>
                                  <Save className="mr-2 h-4 w-4" />
                                  Guardar Cambios
                                </Button>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>

                      {calculo.estado === 'calculada' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleMarcarRevisado(calculo.id)}
                        >
                          <CheckCircle className="h-4 w-4" />
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

      {/* Alertas */}
      {calculosNomina.some(calc => calc.estado === 'calculada') && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <div>
                <h3 className="font-medium text-yellow-800">Cálculos Pendientes de Revisión</h3>
                <p className="text-sm text-yellow-700">
                  Algunos cálculos aún no han sido revisados. Revise cada empleado antes de continuar.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navegación */}
      <div className="flex justify-between">
        <Link href="/nomina/novedades">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a Novedades
          </Button>
        </Link>

        <Link href="/nomina/revision">
          <Button disabled={calculosNomina.some(calc => calc.estado === 'calculada')}>
            Continuar con Revisión Final
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}