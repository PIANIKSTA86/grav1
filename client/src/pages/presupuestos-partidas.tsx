import { useState } from "react";
import { Plus, Edit, Trash2, Save, FileText, Calendar, DollarSign, CheckCircle, XCircle, Clock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

interface PartidaPresupuesto {
  id: string;
  periodoId: string;
  periodoNombre: string;
  cuentaContable: string;
  centroCosto: string;
  descripcion: string;
  valorAprobado: number;
  valorEjecutado: number;
  saldoDisponible: number;
  version: number;
  comentarioVersion: string;
  estadoAprobacion: 'borrador' | 'en_revision' | 'aprobado' | 'rechazado';
  fechaCreacion: string;
  fechaAprobacion?: string;
  aprobadoPor?: string;
  tipo: 'operacional' | 'personal' | 'inversion';
}

interface PeriodoPresupuesto {
  id: string;
  nombre: string;
  fechaInicio: string;
  fechaFin: string;
  estado: 'activo' | 'cerrado' | 'proximo';
}

interface CuentaContable {
  id: string;
  codigo: string;
  nombre: string;
  tipo: 'ingreso' | 'gasto' | 'activo' | 'pasivo' | 'patrimonio';
}

interface CentroCosto {
  id: string;
  codigo: string;
  nombre: string;
  descripcion: string;
}

export default function PresupuestosPartidas() {
  const { toast } = useToast();
  const [partidaEditando, setPartidaEditando] = useState<PartidaPresupuesto | null>(null);
  const [dialogoAbierto, setDialogoAbierto] = useState(false);
  const [esNuevaPartida, setEsNuevaPartida] = useState(false);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'borrador':
        return <Badge variant="outline">Borrador</Badge>;
      case 'en_revision':
        return <Badge className="bg-yellow-100 text-yellow-800">En Revisión</Badge>;
      case 'aprobado':
        return <Badge className="bg-green-100 text-green-800">Aprobado</Badge>;
      case 'rechazado':
        return <Badge className="bg-red-100 text-red-800">Rechazado</Badge>;
      default:
        return <Badge variant="secondary">{estado}</Badge>;
    }
  };

  const getTipoBadge = (tipo: string) => {
    switch (tipo) {
      case 'operacional':
        return <Badge variant="default">Operacional</Badge>;
      case 'personal':
        return <Badge variant="secondary">Personal</Badge>;
      case 'inversion':
        return <Badge className="bg-purple-100 text-purple-800">Inversión</Badge>;
      default:
        return <Badge variant="secondary">{tipo}</Badge>;
    }
  };

  // Datos de ejemplo
  const periodosDisponibles: PeriodoPresupuesto[] = [
    { id: '2024', nombre: '2024', fechaInicio: '2024-01-01', fechaFin: '2024-12-31', estado: 'cerrado' },
    { id: '2025', nombre: '2025', fechaInicio: '2025-01-01', fechaFin: '2025-12-31', estado: 'activo' },
    { id: '2026', nombre: '2026', fechaInicio: '2026-01-01', fechaFin: '2026-12-31', estado: 'proximo' }
  ];

  const cuentasContables: CuentaContable[] = [
    { id: 'CTA-001', codigo: '5101', nombre: 'Servicios Públicos', tipo: 'gasto' },
    { id: 'CTA-002', codigo: '5102', nombre: 'Mantenimiento General', tipo: 'gasto' },
    { id: 'CTA-003', codigo: '5201', nombre: 'Sueldos y Salarios', tipo: 'gasto' },
    { id: 'CTA-004', codigo: '5202', nombre: 'Prestaciones Sociales', tipo: 'gasto' },
    { id: 'CTA-005', codigo: '5301', nombre: 'Vigilancia y Seguridad', tipo: 'gasto' },
    { id: 'CTA-006', codigo: '6101', nombre: 'Fondo de Reserva', tipo: 'activo' },
    { id: 'CTA-007', codigo: '6102', nombre: 'Reparaciones Mayores', tipo: 'gasto' }
  ];

  const centrosCosto: CentroCosto[] = [
    { id: 'CC-001', codigo: 'ADM', nombre: 'Administración', descripcion: 'Gastos administrativos generales' },
    { id: 'CC-002', codigo: 'SEG', nombre: 'Seguridad', descripcion: 'Vigilancia y seguridad del conjunto' },
    { id: 'CC-003', codigo: 'ASEO', nombre: 'Aseo', descripcion: 'Servicios de aseo y jardinería' },
    { id: 'CC-004', codigo: 'MANT', nombre: 'Mantenimiento', descripcion: 'Reparaciones y mantenimiento' },
    { id: 'CC-005', codigo: 'COM', nombre: 'Áreas Comunes', descripcion: 'Mantenimiento de zonas comunes' }
  ];

  const [partidasPresupuesto, setPartidasPresupuesto] = useState<PartidaPresupuesto[]>([
    {
      id: 'PART-001',
      periodoId: '2025',
      periodoNombre: '2025',
      cuentaContable: '5101 - Servicios Públicos',
      centroCosto: 'ADM - Administración',
      descripcion: 'Presupuesto para servicios públicos del conjunto residencial',
      valorAprobado: 12000000,
      valorEjecutado: 7800000,
      saldoDisponible: 4200000,
      version: 1,
      comentarioVersion: 'Versión inicial del presupuesto 2025',
      estadoAprobacion: 'aprobado',
      fechaCreacion: '2025-01-15',
      fechaAprobacion: '2025-01-20',
      aprobadoPor: 'Consejo de Administración',
      tipo: 'operacional'
    },
    {
      id: 'PART-002',
      periodoId: '2025',
      periodoNombre: '2025',
      cuentaContable: '5201 - Sueldos y Salarios',
      centroCosto: 'ADM - Administración',
      descripcion: 'Nómina administrativa y prestaciones sociales',
      valorAprobado: 35000000,
      valorEjecutado: 28000000,
      saldoDisponible: 7000000,
      version: 2,
      comentarioVersion: 'Actualización por ajuste salarial',
      estadoAprobacion: 'aprobado',
      fechaCreacion: '2025-01-15',
      fechaAprobacion: '2025-02-01',
      aprobadoPor: 'Consejo de Administración',
      tipo: 'personal'
    },
    {
      id: 'PART-003',
      periodoId: '2025',
      periodoNombre: '2025',
      cuentaContable: '5301 - Vigilancia y Seguridad',
      centroCosto: 'SEG - Seguridad',
      descripcion: 'Servicio de vigilancia 24/7 del conjunto',
      valorAprobado: 28000000,
      valorEjecutado: 21000000,
      saldoDisponible: 7000000,
      version: 1,
      comentarioVersion: 'Presupuesto inicial para seguridad',
      estadoAprobacion: 'en_revision',
      fechaCreacion: '2025-01-15',
      tipo: 'personal'
    },
    {
      id: 'PART-004',
      periodoId: '2025',
      periodoNombre: '2025',
      cuentaContable: '6102 - Reparaciones Mayores',
      centroCosto: 'MANT - Mantenimiento',
      descripcion: 'Fondo para reparaciones mayores del edificio',
      valorAprobado: 25000000,
      valorEjecutado: 27500000,
      saldoDisponible: -2500000,
      version: 1,
      comentarioVersion: 'Fondo de reserva para emergencias',
      estadoAprobacion: 'borrador',
      fechaCreacion: '2025-03-01',
      tipo: 'inversion'
    }
  ]);

  const handleNuevaPartida = () => {
    const nuevaPartida: PartidaPresupuesto = {
      id: `PART-${String(partidasPresupuesto.length + 1).padStart(3, '0')}`,
      periodoId: '2025',
      periodoNombre: '2025',
      cuentaContable: '',
      centroCosto: '',
      descripcion: '',
      valorAprobado: 0,
      valorEjecutado: 0,
      saldoDisponible: 0,
      version: 1,
      comentarioVersion: '',
      estadoAprobacion: 'borrador',
      fechaCreacion: new Date().toISOString().split('T')[0],
      tipo: 'operacional'
    };
    setPartidaEditando(nuevaPartida);
    setEsNuevaPartida(true);
    setDialogoAbierto(true);
  };

  const handleEditarPartida = (partida: PartidaPresupuesto) => {
    setPartidaEditando({ ...partida });
    setEsNuevaPartida(false);
    setDialogoAbierto(true);
  };

  const handleEliminarPartida = (id: string) => {
    setPartidasPresupuesto(prev => prev.filter(partida => partida.id !== id));
    toast({
      title: "Partida eliminada",
      description: "La partida presupuestal ha sido eliminada exitosamente.",
    });
  };

  const handleCambiarEstado = (id: string, nuevoEstado: PartidaPresupuesto['estadoAprobacion']) => {
    setPartidasPresupuesto(prev => prev.map(partida => {
      if (partida.id === id) {
        const actualizada = { ...partida, estadoAprobacion: nuevoEstado };
        if (nuevoEstado === 'aprobado') {
          actualizada.fechaAprobacion = new Date().toISOString().split('T')[0];
          actualizada.aprobadoPor = 'Consejo de Administración';
        }
        return actualizada;
      }
      return partida;
    }));

    const mensajes = {
      en_revision: "Partida enviada a revisión.",
      aprobado: "Partida aprobada exitosamente.",
      rechazado: "Partida rechazada.",
      borrador: "Partida movida a borrador."
    };

    toast({
      title: "Estado actualizado",
      description: mensajes[nuevoEstado] || "Estado actualizado.",
    });
  };

  const handleGuardarPartida = () => {
    if (!partidaEditando) return;

    // Validaciones básicas
    if (!partidaEditando.periodoId || !partidaEditando.cuentaContable ||
        !partidaEditando.centroCosto || !partidaEditando.descripcion ||
        partidaEditando.valorAprobado <= 0) {
      toast({
        title: "Datos incompletos",
        description: "Por favor complete todos los campos requeridos.",
        variant: "destructive",
      });
      return;
    }

    // Calcular saldo disponible
    partidaEditando.saldoDisponible = partidaEditando.valorAprobado - partidaEditando.valorEjecutado;

    // Obtener nombre del período
    const periodo = periodosDisponibles.find(p => p.id === partidaEditando.periodoId);
    if (periodo) {
      partidaEditando.periodoNombre = periodo.nombre;
    }

    if (esNuevaPartida) {
      setPartidasPresupuesto(prev => [...prev, partidaEditando]);
      toast({
        title: "Partida creada",
        description: "La partida presupuestal ha sido creada exitosamente.",
      });
    } else {
      setPartidasPresupuesto(prev => prev.map(partida =>
        partida.id === partidaEditando.id ? partidaEditando : partida
      ));
      toast({
        title: "Partida actualizada",
        description: "La partida presupuestal ha sido actualizada exitosamente.",
      });
    }

    setDialogoAbierto(false);
    setPartidaEditando(null);
  };

  const totalPartidas = partidasPresupuesto.length;
  const partidasAprobadas = partidasPresupuesto.filter(p => p.estadoAprobacion === 'aprobado').length;
  const totalAprobado = partidasPresupuesto
    .filter(p => p.estadoAprobacion === 'aprobado')
    .reduce((sum, p) => sum + p.valorAprobado, 0);
  const totalEjecutado = partidasPresupuesto.reduce((sum, p) => sum + p.valorEjecutado, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Partidas Presupuestales</h1>
          <p className="text-muted-foreground">
            Gestión completa del CRUD de presupuestos por período y centro de costo
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/presupuestos/ejecucion">
            <Button variant="outline">
              Ver Ejecución
            </Button>
          </Link>
          <Link href="/presupuestos/reportes">
            <Button variant="outline">
              Ver Reportes
            </Button>
          </Link>
          <Button onClick={handleNuevaPartida}>
            <Plus className="mr-2 h-4 w-4" />
            Nueva Partida
          </Button>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Partidas</CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-blue-600">{totalPartidas}</div>
            <p className="text-xs text-muted-foreground">
              registradas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Partidas Aprobadas</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-green-600">{partidasAprobadas}</div>
            <p className="text-xs text-muted-foreground">
              de {totalPartidas} totales
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Total Aprobado</CardTitle>
            <DollarSign className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-purple-600">
              {formatCurrency(totalAprobado)}
            </div>
            <p className="text-xs text-muted-foreground">
              presupuestado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Ejecutado</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-orange-600">
              {formatCurrency(totalEjecutado)}
            </div>
            <p className="text-xs text-muted-foreground">
              gastado hasta ahora
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabla de partidas presupuestales */}
      <Card>
        <CardHeader>
          <CardTitle>Gestión de Partidas Presupuestales</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Período</TableHead>
                <TableHead>Cuenta Contable</TableHead>
                <TableHead>Centro de Costo</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Valor Aprobado</TableHead>
                <TableHead>Ejecutado</TableHead>
                <TableHead>Saldo</TableHead>
                <TableHead>Versión</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {partidasPresupuesto.map((partida) => (
                <TableRow key={partida.id}>
                  <TableCell>
                    <div className="font-medium">{partida.periodoNombre}</div>
                    <div className="text-sm text-muted-foreground">{partida.fechaCreacion}</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{partida.cuentaContable}</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{partida.centroCosto}</div>
                  </TableCell>
                  <TableCell>{getTipoBadge(partida.tipo)}</TableCell>
                  <TableCell className="font-mono font-semibold text-green-600">
                    {formatCurrency(partida.valorAprobado)}
                  </TableCell>
                  <TableCell className="font-mono font-semibold text-blue-600">
                    {formatCurrency(partida.valorEjecutado)}
                  </TableCell>
                  <TableCell className={`font-mono font-semibold ${
                    partida.saldoDisponible < 0 ? 'text-red-600' : 'text-purple-600'
                  }`}>
                    {formatCurrency(partida.saldoDisponible)}
                  </TableCell>
                  <TableCell>
                    <div className="text-center">
                      <Badge variant="outline">v{partida.version}</Badge>
                    </div>
                  </TableCell>
                  <TableCell>{getEstadoBadge(partida.estadoAprobacion)}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditarPartida(partida)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      {partida.estadoAprobacion === 'borrador' && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCambiarEstado(partida.id, 'en_revision')}
                            className="text-blue-600"
                          >
                            <Clock className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCambiarEstado(partida.id, 'aprobado')}
                            className="text-green-600"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      {partida.estadoAprobacion === 'en_revision' && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCambiarEstado(partida.id, 'aprobado')}
                            className="text-green-600"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCambiarEstado(partida.id, 'rechazado')}
                            className="text-red-600"
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEliminarPartida(partida.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Diálogo de edición/creación */}
      <Dialog open={dialogoAbierto} onOpenChange={setDialogoAbierto}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {esNuevaPartida ? "Nueva Partida Presupuestal" : "Editar Partida Presupuestal"}
            </DialogTitle>
            <DialogDescription>
              Configure la partida presupuestal con período, cuenta contable, centro de costo y valores.
            </DialogDescription>
          </DialogHeader>

          {partidaEditando && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="periodo">Período Presupuestal</Label>
                  <Select
                    value={partidaEditando.periodoId}
                    onValueChange={(value) => {
                      const periodo = periodosDisponibles.find(p => p.id === value);
                      setPartidaEditando({
                        ...partidaEditando,
                        periodoId: value,
                        periodoNombre: periodo?.nombre || ''
                      });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione período..." />
                    </SelectTrigger>
                    <SelectContent>
                      {periodosDisponibles.map((periodo) => (
                        <SelectItem key={periodo.id} value={periodo.id}>
                          {periodo.nombre} ({periodo.fechaInicio} - {periodo.fechaFin})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tipo">Tipo de Partida</Label>
                  <Select
                    value={partidaEditando.tipo}
                    onValueChange={(value: PartidaPresupuesto['tipo']) =>
                      setPartidaEditando({...partidaEditando, tipo: value})
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="operacional">Operacional</SelectItem>
                      <SelectItem value="personal">Personal</SelectItem>
                      <SelectItem value="inversion">Inversión</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cuenta">Cuenta Contable</Label>
                  <Select
                    value={partidaEditando.cuentaContable}
                    onValueChange={(value) => {
                      const cuenta = cuentasContables.find(c => `${c.codigo} - ${c.nombre}` === value);
                      setPartidaEditando({...partidaEditando, cuentaContable: value});
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione cuenta..." />
                    </SelectTrigger>
                    <SelectContent>
                      {cuentasContables.map((cuenta) => (
                        <SelectItem key={cuenta.id} value={`${cuenta.codigo} - ${cuenta.nombre}`}>
                          {cuenta.codigo} - {cuenta.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="centroCosto">Centro de Costo</Label>
                  <Select
                    value={partidaEditando.centroCosto}
                    onValueChange={(value) => {
                      const centro = centrosCosto.find(c => `${c.codigo} - ${c.nombre}` === value);
                      setPartidaEditando({...partidaEditando, centroCosto: value});
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione centro..." />
                    </SelectTrigger>
                    <SelectContent>
                      {centrosCosto.map((centro) => (
                        <SelectItem key={centro.id} value={`${centro.codigo} - ${centro.nombre}`}>
                          {centro.codigo} - {centro.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="descripcion">Descripción</Label>
                <Textarea
                  id="descripcion"
                  value={partidaEditando.descripcion}
                  onChange={(e) => setPartidaEditando({...partidaEditando, descripcion: e.target.value})}
                  placeholder="Describa detalladamente el propósito de esta partida presupuestal"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="valorAprobado">Valor Aprobado</Label>
                  <Input
                    id="valorAprobado"
                    type="number"
                    value={partidaEditando.valorAprobado}
                    onChange={(e) => setPartidaEditando({...partidaEditando, valorAprobado: parseInt(e.target.value) || 0})}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="valorEjecutado">Valor Ejecutado</Label>
                  <Input
                    id="valorEjecutado"
                    type="number"
                    value={partidaEditando.valorEjecutado}
                    onChange={(e) => setPartidaEditando({...partidaEditando, valorEjecutado: parseInt(e.target.value) || 0})}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="version">Versión</Label>
                  <Input
                    id="version"
                    type="number"
                    value={partidaEditando.version}
                    onChange={(e) => setPartidaEditando({...partidaEditando, version: parseInt(e.target.value) || 1})}
                    min="1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="comentarioVersion">Comentario de Versión</Label>
                <Textarea
                  id="comentarioVersion"
                  value={partidaEditando.comentarioVersion}
                  onChange={(e) => setPartidaEditando({...partidaEditando, comentarioVersion: e.target.value})}
                  placeholder="Explique los cambios realizados en esta versión del presupuesto"
                  rows={2}
                />
              </div>

              {/* Resumen calculado */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">Resumen de la Partida</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex justify-between">
                    <span>Valor Aprobado:</span>
                    <span className="font-mono font-semibold text-green-600">
                      {formatCurrency(partidaEditando.valorAprobado)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Valor Ejecutado:</span>
                    <span className="font-mono font-semibold text-blue-600">
                      {formatCurrency(partidaEditando.valorEjecutado)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saldo Disponible:</span>
                    <span className={`font-mono font-semibold ${
                      partidaEditando.valorAprobado - partidaEditando.valorEjecutado < 0
                        ? 'text-red-600' : 'text-purple-600'
                    }`}>
                      {formatCurrency(partidaEditando.valorAprobado - partidaEditando.valorEjecutado)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estado Actual:</span>
                    <span>{getEstadoBadge(partidaEditando.estadoAprobacion)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogoAbierto(false)}>
              Cancelar
            </Button>
            <Button onClick={handleGuardarPartida}>
              <Save className="mr-2 h-4 w-4" />
              {esNuevaPartida ? "Crear Partida" : "Guardar Cambios"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}