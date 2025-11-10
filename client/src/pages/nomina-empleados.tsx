import { useState } from "react";
import { Users, Search, Filter, CheckSquare, Square, ArrowRight, ArrowLeft, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
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
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";

interface Empleado {
  id: string;
  nombre: string;
  apellido: string;
  documento: string;
  cargo: string;
  departamento: string;
  salarioBase: number;
  tipoContrato: 'indefinido' | 'fijo' | 'temporal';
  estado: 'activo' | 'inactivo';
  fechaIngreso: string;
}

export default function NominaEmpleados() {
  const { toast } = useToast();
  const [empleadosSeleccionados, setEmpleadosSeleccionados] = useState<Set<string>>(new Set());
  const [busqueda, setBusqueda] = useState('');
  const [filtroCargo, setFiltroCargo] = useState<string>('todos');
  const [filtroDepartamento, setFiltroDepartamento] = useState<string>('todos');
  const [filtroTipoContrato, setFiltroTipoContrato] = useState<string>('todos');

  // Datos de ejemplo
  const empleados: Empleado[] = [
    {
      id: 'EMP-001',
      nombre: 'María',
      apellido: 'González',
      documento: '12345678',
      cargo: 'Administradora',
      departamento: 'Administración',
      salarioBase: 2500000,
      tipoContrato: 'indefinido',
      estado: 'activo',
      fechaIngreso: '2023-01-15'
    },
    {
      id: 'EMP-002',
      nombre: 'Carlos',
      apellido: 'Rodríguez',
      documento: '87654321',
      cargo: 'Conserje',
      departamento: 'Mantenimiento',
      salarioBase: 1500000,
      tipoContrato: 'indefinido',
      estado: 'activo',
      fechaIngreso: '2023-03-20'
    },
    {
      id: 'EMP-003',
      nombre: 'Ana',
      apellido: 'López',
      documento: '11223344',
      cargo: 'Auxiliar de Limpieza',
      departamento: 'Servicios',
      salarioBase: 1300000,
      tipoContrato: 'temporal',
      estado: 'activo',
      fechaIngreso: '2024-01-10'
    },
    {
      id: 'EMP-004',
      nombre: 'Juan',
      apellido: 'Pérez',
      documento: '44332211',
      cargo: 'Jardinero',
      departamento: 'Mantenimiento',
      salarioBase: 1400000,
      tipoContrato: 'fijo',
      estado: 'activo',
      fechaIngreso: '2023-06-05'
    },
    {
      id: 'EMP-005',
      nombre: 'Laura',
      apellido: 'Martínez',
      documento: '55667788',
      cargo: 'Recepcionista',
      departamento: 'Administración',
      salarioBase: 1800000,
      tipoContrato: 'indefinido',
      estado: 'activo',
      fechaIngreso: '2023-08-12'
    }
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const getTipoContratoBadge = (tipo: string) => {
    switch (tipo) {
      case 'indefinido':
        return <Badge variant="default">Indefinido</Badge>;
      case 'fijo':
        return <Badge variant="secondary">Término Fijo</Badge>;
      case 'temporal':
        return <Badge variant="outline">Temporal</Badge>;
      default:
        return <Badge variant="secondary">{tipo}</Badge>;
    }
  };

  // Filtrar empleados
  const empleadosFiltrados = empleados.filter(empleado => {
    const coincideBusqueda = empleado.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                           empleado.apellido.toLowerCase().includes(busqueda.toLowerCase()) ||
                           empleado.documento.includes(busqueda) ||
                           empleado.cargo.toLowerCase().includes(busqueda.toLowerCase());

    const coincideCargo = filtroCargo === 'todos' || empleado.cargo === filtroCargo;
    const coincideDepartamento = filtroDepartamento === 'todos' || empleado.departamento === filtroDepartamento;
    const coincideTipoContrato = filtroTipoContrato === 'todos' || empleado.tipoContrato === filtroTipoContrato;

    return coincideBusqueda && coincideCargo && coincideDepartamento && coincideTipoContrato && empleado.estado === 'activo';
  });

  // Obtener opciones únicas para filtros
  const cargosUnicos = Array.from(new Set(empleados.map(e => e.cargo)));
  const departamentosUnicos = Array.from(new Set(empleados.map(e => e.departamento)));
  const tiposContratoUnicos = Array.from(new Set(empleados.map(e => e.tipoContrato)));

  const handleSeleccionarEmpleado = (empleadoId: string) => {
    const nuevosSeleccionados = new Set(empleadosSeleccionados);
    if (nuevosSeleccionados.has(empleadoId)) {
      nuevosSeleccionados.delete(empleadoId);
    } else {
      nuevosSeleccionados.add(empleadoId);
    }
    setEmpleadosSeleccionados(nuevosSeleccionados);
  };

  const handleSeleccionarTodos = () => {
    if (empleadosSeleccionados.size === empleadosFiltrados.length) {
      setEmpleadosSeleccionados(new Set());
    } else {
      setEmpleadosSeleccionados(new Set(empleadosFiltrados.map(e => e.id)));
    }
  };

  const handleContinuar = () => {
    if (empleadosSeleccionados.size === 0) {
      toast({
        title: "Selección requerida",
        description: "Debe seleccionar al menos un empleado para continuar.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Empleados seleccionados",
      description: `${empleadosSeleccionados.size} empleado(s) seleccionado(s) para este período.`,
    });
  };

  const empleadosSeleccionadosData = empleados.filter(e => empleadosSeleccionados.has(e.id));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Selección de Empleados</h1>
          <p className="text-muted-foreground">
            Seleccione los empleados que participarán en este período de nómina
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/nomina/configuracion">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver
            </Button>
          </Link>
          <Link href="/nomina/parametros">
            <Button onClick={handleContinuar} disabled={empleadosSeleccionados.size === 0}>
              Continuar
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Estadísticas de selección */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Empleados Disponibles</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-blue-600">{empleadosFiltrados.length}</div>
            <p className="text-xs text-muted-foreground">
              activos en el sistema
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Empleados Seleccionados</CardTitle>
            <UserCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-green-600">{empleadosSeleccionados.size}</div>
            <p className="text-xs text-muted-foreground">
              para este período
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Total Estimado</CardTitle>
            <span className="text-green-600 font-bold">$</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-green-600">
              {formatCurrency(empleadosSeleccionadosData.reduce((sum, emp) => sum + emp.salarioBase, 0))}
            </div>
            <p className="text-xs text-muted-foreground">
              suma de salarios base
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros de Búsqueda
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="busqueda">Buscar Empleado</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="busqueda"
                  placeholder="Nombre, documento, cargo..."
                  className="pl-8"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Cargo</Label>
              <Select value={filtroCargo} onValueChange={setFiltroCargo}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los cargos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los cargos</SelectItem>
                  {cargosUnicos.map(cargo => (
                    <SelectItem key={cargo} value={cargo}>{cargo}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Departamento</Label>
              <Select value={filtroDepartamento} onValueChange={setFiltroDepartamento}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los departamentos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los departamentos</SelectItem>
                  {departamentosUnicos.map(depto => (
                    <SelectItem key={depto} value={depto}>{depto}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Tipo de Contrato</Label>
              <Select value={filtroTipoContrato} onValueChange={setFiltroTipoContrato}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los tipos</SelectItem>
                  {tiposContratoUnicos.map(tipo => (
                    <SelectItem key={tipo} value={tipo}>
                      {tipo === 'indefinido' ? 'Indefinido' :
                       tipo === 'fijo' ? 'Término Fijo' : 'Temporal'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de empleados */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Lista de Empleados
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSeleccionarTodos}
            >
              {empleadosSeleccionados.size === empleadosFiltrados.length ? (
                <>
                  <Square className="mr-2 h-4 w-4" />
                  Deseleccionar Todos
                </>
              ) : (
                <>
                  <CheckSquare className="mr-2 h-4 w-4" />
                  Seleccionar Todos
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={empleadosSeleccionados.size === empleadosFiltrados.length && empleadosFiltrados.length > 0}
                    onCheckedChange={handleSeleccionarTodos}
                  />
                </TableHead>
                <TableHead>Empleado</TableHead>
                <TableHead>Documento</TableHead>
                <TableHead>Cargo</TableHead>
                <TableHead>Departamento</TableHead>
                <TableHead>Salario Base</TableHead>
                <TableHead>Contrato</TableHead>
                <TableHead>Fecha Ingreso</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {empleadosFiltrados.map((empleado) => (
                <TableRow key={empleado.id}>
                  <TableCell>
                    <Checkbox
                      checked={empleadosSeleccionados.has(empleado.id)}
                      onCheckedChange={() => handleSeleccionarEmpleado(empleado.id)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    {empleado.nombre} {empleado.apellido}
                  </TableCell>
                  <TableCell className="font-mono">{empleado.documento}</TableCell>
                  <TableCell>{empleado.cargo}</TableCell>
                  <TableCell>{empleado.departamento}</TableCell>
                  <TableCell className="font-mono">{formatCurrency(empleado.salarioBase)}</TableCell>
                  <TableCell>{getTipoContratoBadge(empleado.tipoContrato)}</TableCell>
                  <TableCell>{new Date(empleado.fechaIngreso).toLocaleDateString('es-CO')}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {empleadosFiltrados.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No se encontraron empleados que coincidan con los filtros aplicados.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Resumen de selección */}
      {empleadosSeleccionados.size > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Empleados Seleccionados ({empleadosSeleccionados.size})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {empleadosSeleccionadosData.map(empleado => (
                <div key={empleado.id} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                  <div>
                    <span className="font-medium">{empleado.nombre} {empleado.apellido}</span>
                    <span className="text-sm text-muted-foreground ml-2">• {empleado.cargo}</span>
                  </div>
                  <span className="font-mono text-sm">{formatCurrency(empleado.salarioBase)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navegación */}
      <div className="flex justify-between">
        <Link href="/nomina/configuracion">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a Configuración
          </Button>
        </Link>

        <Link href="/nomina/parametros">
          <Button onClick={handleContinuar} disabled={empleadosSeleccionados.size === 0}>
            Continuar con Parámetros
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}