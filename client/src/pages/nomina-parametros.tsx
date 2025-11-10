import { useState } from "react";
import { Calculator, Save, ArrowRight, ArrowLeft, Edit3, DollarSign, Percent, Clock } from "lucide-react";
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

interface EmpleadoParametros {
  id: string;
  nombre: string;
  apellido: string;
  cargo: string;
  salarioBase: number;
  parametros: {
    salarioBase: number;
    auxilioTransporte: number;
    auxilioAlimentacion: number;
    horasExtrasDiurnas: number;
    horasExtrasNocturnas: number;
    horasExtrasFestivas: number;
    diasIncapacidad: number;
    diasLicencia: number;
    bonificaciones: number;
    deducciones: number;
    porcentajeSalud: number;
    porcentajePension: number;
    porcentajeARL: number;
  };
}

export default function NominaParametros() {
  const { toast } = useToast();
  const [parametrosEditando, setParametrosEditando] = useState<EmpleadoParametros | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Datos de ejemplo - empleados seleccionados con parámetros por defecto
  const [empleadosParametros, setEmpleadosParametros] = useState<EmpleadoParametros[]>([
    {
      id: 'EMP-001',
      nombre: 'María',
      apellido: 'González',
      cargo: 'Administradora',
      salarioBase: 2500000,
      parametros: {
        salarioBase: 2500000,
        auxilioTransporte: 140606,
        auxilioAlimentacion: 0,
        horasExtrasDiurnas: 0,
        horasExtrasNocturnas: 0,
        horasExtrasFestivas: 0,
        diasIncapacidad: 0,
        diasLicencia: 0,
        bonificaciones: 0,
        deducciones: 0,
        porcentajeSalud: 4,
        porcentajePension: 4,
        porcentajeARL: 0.522
      }
    },
    {
      id: 'EMP-002',
      nombre: 'Carlos',
      apellido: 'Rodríguez',
      cargo: 'Conserje',
      salarioBase: 1500000,
      parametros: {
        salarioBase: 1500000,
        auxilioTransporte: 140606,
        auxilioAlimentacion: 0,
        horasExtrasDiurnas: 0,
        horasExtrasNocturnas: 0,
        horasExtrasFestivas: 0,
        diasIncapacidad: 0,
        diasLicencia: 0,
        bonificaciones: 0,
        deducciones: 0,
        porcentajeSalud: 4,
        porcentajePension: 4,
        porcentajeARL: 0.522
      }
    },
    {
      id: 'EMP-003',
      nombre: 'Ana',
      apellido: 'López',
      cargo: 'Auxiliar de Limpieza',
      salarioBase: 1300000,
      parametros: {
        salarioBase: 1300000,
        auxilioTransporte: 140606,
        auxilioAlimentacion: 0,
        horasExtrasDiurnas: 0,
        horasExtrasNocturnas: 0,
        horasExtrasFestivas: 0,
        diasIncapacidad: 0,
        diasLicencia: 0,
        bonificaciones: 0,
        deducciones: 0,
        porcentajeSalud: 4,
        porcentajePension: 4,
        porcentajeARL: 0.522
      }
    }
  ]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatPercent = (value: number) => {
    return `${value}%`;
  };

  const calcularTotalDevengado = (parametros: EmpleadoParametros['parametros']) => {
    return parametros.salarioBase +
           parametros.auxilioTransporte +
           parametros.auxilioAlimentacion +
           parametros.bonificaciones;
  };

  const calcularTotalDeducido = (parametros: EmpleadoParametros['parametros']) => {
    const baseSeguridadSocial = parametros.salarioBase + parametros.auxilioTransporte;
    return (baseSeguridadSocial * parametros.porcentajeSalud / 100) +
           (baseSeguridadSocial * parametros.porcentajePension / 100) +
           (baseSeguridadSocial * parametros.porcentajeARL / 100) +
           parametros.deducciones;
  };

  const calcularNetoPagar = (parametros: EmpleadoParametros['parametros']) => {
    return calcularTotalDevengado(parametros) - calcularTotalDeducido(parametros);
  };

  const handleEditarParametros = (empleado: EmpleadoParametros) => {
    setParametrosEditando({ ...empleado });
    setDialogOpen(true);
  };

  const handleGuardarParametros = () => {
    if (!parametrosEditando) return;

    setEmpleadosParametros(prev =>
      prev.map(emp =>
        emp.id === parametrosEditando.id ? parametrosEditando : emp
      )
    );

    toast({
      title: "Parámetros actualizados",
      description: `Los parámetros de ${parametrosEditando.nombre} ${parametrosEditando.apellido} han sido guardados.`,
    });

    setDialogOpen(false);
    setParametrosEditando(null);
  };

  const handleActualizarParametro = (campo: keyof EmpleadoParametros['parametros'], valor: number) => {
    if (!parametrosEditando) return;

    setParametrosEditando(prev => ({
      ...prev!,
      parametros: {
        ...prev!.parametros,
        [campo]: valor
      }
    }));
  };

  const handleAplicarATodos = (campo: keyof EmpleadoParametros['parametros'], valor: number) => {
    setEmpleadosParametros(prev =>
      prev.map(emp => ({
        ...emp,
        parametros: {
          ...emp.parametros,
          [campo]: valor
        }
      }))
    );

    toast({
      title: "Parámetro aplicado",
      description: `El campo ${campo} ha sido aplicado a todos los empleados.`,
    });
  };

  const totalNomina = empleadosParametros.reduce((sum, emp) =>
    sum + calcularNetoPagar(emp.parametros), 0
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Parámetros por Empleado</h1>
          <p className="text-muted-foreground">
            Ajuste los parámetros específicos para cada empleado seleccionado
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/nomina/empleados">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver
            </Button>
          </Link>
          <Link href="/nomina/horas">
            <Button>
              Continuar
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Resumen general */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Empleados</CardTitle>
            <Calculator className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-blue-600">{empleadosParametros.length}</div>
            <p className="text-xs text-muted-foreground">
              con parámetros configurados
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
              {formatCurrency(empleadosParametros.reduce((sum, emp) => sum + calcularTotalDevengado(emp.parametros), 0))}
            </div>
            <p className="text-xs text-muted-foreground">
              suma de devengados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Deducido</CardTitle>
            <Percent className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-red-600">
              {formatCurrency(empleadosParametros.reduce((sum, emp) => sum + calcularTotalDeducido(emp.parametros), 0))}
            </div>
            <p className="text-xs text-muted-foreground">
              suma de deducciones
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

      {/* Tabla de empleados con parámetros */}
      <Card>
        <CardHeader>
          <CardTitle>Parámetros por Empleado</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Empleado</TableHead>
                <TableHead>Cargo</TableHead>
                <TableHead>Salario Base</TableHead>
                <TableHead>Aux. Transporte</TableHead>
                <TableHead>Bonificaciones</TableHead>
                <TableHead>Deducciones</TableHead>
                <TableHead>Neto a Pagar</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {empleadosParametros.map((empleado) => (
                <TableRow key={empleado.id}>
                  <TableCell className="font-medium">
                    {empleado.nombre} {empleado.apellido}
                  </TableCell>
                  <TableCell>{empleado.cargo}</TableCell>
                  <TableCell className="font-mono">{formatCurrency(empleado.parametros.salarioBase)}</TableCell>
                  <TableCell className="font-mono">{formatCurrency(empleado.parametros.auxilioTransporte)}</TableCell>
                  <TableCell className="font-mono">{formatCurrency(empleado.parametros.bonificaciones)}</TableCell>
                  <TableCell className="font-mono">{formatCurrency(empleado.parametros.deducciones)}</TableCell>
                  <TableCell className="font-mono font-semibold">
                    {formatCurrency(calcularNetoPagar(empleado.parametros))}
                  </TableCell>
                  <TableCell>
                    <Dialog open={dialogOpen && parametrosEditando?.id === empleado.id} onOpenChange={setDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" onClick={() => handleEditarParametros(empleado)}>
                          <Edit3 className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>
                            Editar Parámetros - {empleado.nombre} {empleado.apellido}
                          </DialogTitle>
                        </DialogHeader>

                        {parametrosEditando && (
                          <div className="space-y-6">
                            {/* Salarios y auxilios */}
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="salarioBase">Salario Base</Label>
                                <Input
                                  id="salarioBase"
                                  type="number"
                                  value={parametrosEditando.parametros.salarioBase}
                                  onChange={(e) => handleActualizarParametro('salarioBase', Number(e.target.value))}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="auxilioTransporte">Auxilio Transporte</Label>
                                <Input
                                  id="auxilioTransporte"
                                  type="number"
                                  value={parametrosEditando.parametros.auxilioTransporte}
                                  onChange={(e) => handleActualizarParametro('auxilioTransporte', Number(e.target.value))}
                                />
                              </div>
                            </div>

                            {/* Horas extras */}
                            <div className="space-y-4">
                              <h4 className="font-medium flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                Horas Extras
                              </h4>
                              <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                  <Label>Horas Extras Diurnas</Label>
                                  <Input
                                    type="number"
                                    value={parametrosEditando.parametros.horasExtrasDiurnas}
                                    onChange={(e) => handleActualizarParametro('horasExtrasDiurnas', Number(e.target.value))}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>Horas Extras Nocturnas</Label>
                                  <Input
                                    type="number"
                                    value={parametrosEditando.parametros.horasExtrasNocturnas}
                                    onChange={(e) => handleActualizarParametro('horasExtrasNocturnas', Number(e.target.value))}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>Horas Extras Festivas</Label>
                                  <Input
                                    type="number"
                                    value={parametrosEditando.parametros.horasExtrasFestivas}
                                    onChange={(e) => handleActualizarParametro('horasExtrasFestivas', Number(e.target.value))}
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Novedades */}
                            <div className="space-y-4">
                              <h4 className="font-medium">Novedades</h4>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label>Días Incapacidad</Label>
                                  <Input
                                    type="number"
                                    value={parametrosEditando.parametros.diasIncapacidad}
                                    onChange={(e) => handleActualizarParametro('diasIncapacidad', Number(e.target.value))}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>Días Licencia</Label>
                                  <Input
                                    type="number"
                                    value={parametrosEditando.parametros.diasLicencia}
                                    onChange={(e) => handleActualizarParametro('diasLicencia', Number(e.target.value))}
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Bonificaciones y deducciones */}
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="bonificaciones">Bonificaciones</Label>
                                <Input
                                  id="bonificaciones"
                                  type="number"
                                  value={parametrosEditando.parametros.bonificaciones}
                                  onChange={(e) => handleActualizarParametro('bonificaciones', Number(e.target.value))}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="deducciones">Deducciones</Label>
                                <Input
                                  id="deducciones"
                                  type="number"
                                  value={parametrosEditando.parametros.deducciones}
                                  onChange={(e) => handleActualizarParametro('deducciones', Number(e.target.value))}
                                />
                              </div>
                            </div>

                            {/* Porcentajes de seguridad social */}
                            <div className="space-y-4">
                              <h4 className="font-medium">Porcentajes de Seguridad Social</h4>
                              <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                  <Label>Salud (%)</Label>
                                  <Input
                                    type="number"
                                    step="0.01"
                                    value={parametrosEditando.parametros.porcentajeSalud}
                                    onChange={(e) => handleActualizarParametro('porcentajeSalud', Number(e.target.value))}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>Pensión (%)</Label>
                                  <Input
                                    type="number"
                                    step="0.01"
                                    value={parametrosEditando.parametros.porcentajePension}
                                    onChange={(e) => handleActualizarParametro('porcentajePension', Number(e.target.value))}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>ARL (%)</Label>
                                  <Input
                                    type="number"
                                    step="0.01"
                                    value={parametrosEditando.parametros.porcentajeARL}
                                    onChange={(e) => handleActualizarParametro('porcentajeARL', Number(e.target.value))}
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Resumen */}
                            <div className="border-t pt-4">
                              <div className="grid grid-cols-3 gap-4 text-sm">
                                <div>
                                  <span className="text-muted-foreground">Total Devengado:</span>
                                  <div className="font-mono font-semibold text-green-600">
                                    {formatCurrency(calcularTotalDevengado(parametrosEditando.parametros))}
                                  </div>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Total Deducido:</span>
                                  <div className="font-mono font-semibold text-red-600">
                                    {formatCurrency(calcularTotalDeducido(parametrosEditando.parametros))}
                                  </div>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Neto a Pagar:</span>
                                  <div className="font-mono font-semibold text-purple-600">
                                    {formatCurrency(calcularNetoPagar(parametrosEditando.parametros))}
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="flex justify-end gap-2">
                              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                                Cancelar
                              </Button>
                              <Button onClick={handleGuardarParametros}>
                                <Save className="mr-2 h-4 w-4" />
                                Guardar Parámetros
                              </Button>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Navegación */}
      <div className="flex justify-between">
        <Link href="/nomina/empleados">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a Empleados
          </Button>
        </Link>

        <Link href="/nomina/horas">
          <Button>
            Continuar con Horas
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}