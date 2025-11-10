import { useState } from "react";
import { Plus, Calendar, Clock, Users, DollarSign, Edit, Trash2, CheckCircle, XCircle, AlertCircle } from "lucide-react";
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

interface ZonaComun {
  id: string;
  nombre: string;
  capacidad: number;
  precioPorHora: number;
  precioDia: number;
  precioMes: number;
  horarioInicio: string;
  horarioFin: string;
  disponibleReservas: boolean;
  estado: 'activa' | 'inactiva' | 'mantenimiento';
}

interface Reserva {
  id: string;
  zonaComunId: string;
  zonaNombre: string;
  solicitante: string;
  fechaReserva: string;
  horaInicio: string;
  horaFin: string;
  duracionHoras: number;
  numeroPersonas: number;
  motivo: string;
  telefonoContacto: string;
  precioTotal: number;
  estado: 'pendiente' | 'confirmada' | 'cancelada' | 'completada';
  fechaCreacion: string;
  notas?: string;
}

export function Reservas() {
  const { toast } = useToast();

  // Zonas comunes disponibles (simuladas - en producción vendrían de la API)
  const [zonasComunes] = useState<ZonaComun[]>([
    {
      id: 'ZONA-001',
      nombre: 'Salón Social',
      capacidad: 50,
      precioPorHora: 25000,
      precioDia: 150000,
      precioMes: 2000000,
      horarioInicio: '08:00',
      horarioFin: '22:00',
      disponibleReservas: true,
      estado: 'activa'
    },
    {
      id: 'ZONA-002',
      nombre: 'Gimnasio',
      capacidad: 20,
      precioPorHora: 15000,
      precioDia: 80000,
      precioMes: 1200000,
      horarioInicio: '05:00',
      horarioFin: '22:00',
      disponibleReservas: true,
      estado: 'activa'
    },
    {
      id: 'ZONA-003',
      nombre: 'Piscina',
      capacidad: 30,
      precioPorHora: 20000,
      precioDia: 120000,
      precioMes: 1800000,
      horarioInicio: '07:00',
      horarioFin: '20:00',
      disponibleReservas: true,
      estado: 'activa'
    }
  ]);

  // Reservas existentes
  const [reservas, setReservas] = useState<Reserva[]>([
    {
      id: 'RES-001',
      zonaComunId: 'ZONA-001',
      zonaNombre: 'Salón Social',
      solicitante: 'María González',
      fechaReserva: '2025-11-15',
      horaInicio: '14:00',
      horaFin: '18:00',
      duracionHoras: 4,
      numeroPersonas: 25,
      motivo: 'Cumpleaños familiar',
      telefonoContacto: '300-123-4567',
      precioTotal: 100000,
      estado: 'confirmada',
      fechaCreacion: '2025-11-08',
      notas: 'Requiere decoración adicional'
    },
    {
      id: 'RES-002',
      zonaComunId: 'ZONA-002',
      zonaNombre: 'Gimnasio',
      solicitante: 'Carlos Rodríguez',
      fechaReserva: '2025-11-10',
      horaInicio: '19:00',
      horaFin: '21:00',
      duracionHoras: 2,
      numeroPersonas: 8,
      motivo: 'Entrenamiento de fútbol',
      telefonoContacto: '301-987-6543',
      precioTotal: 30000,
      estado: 'pendiente',
      fechaCreacion: '2025-11-07'
    },
    {
      id: 'RES-003',
      zonaComunId: 'ZONA-003',
      zonaNombre: 'Piscina',
      solicitante: 'Ana López',
      fechaReserva: '2025-11-12',
      horaInicio: '10:00',
      horaFin: '12:00',
      duracionHoras: 2,
      numeroPersonas: 15,
      motivo: 'Fiesta infantil',
      telefonoContacto: '302-456-7890',
      precioTotal: 40000,
      estado: 'confirmada',
      fechaCreacion: '2025-11-06'
    }
  ]);

  const [reservaEditando, setReservaEditando] = useState<Reserva | null>(null);
  const [dialogoAbierto, setDialogoAbierto] = useState(false);
  const [esNuevaReserva, setEsNuevaReserva] = useState(false);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'pendiente':
        return <Badge variant="outline" className="text-yellow-700 border-yellow-300">Pendiente</Badge>;
      case 'confirmada':
        return <Badge className="bg-green-100 text-green-800">Confirmada</Badge>;
      case 'cancelada':
        return <Badge variant="destructive">Cancelada</Badge>;
      case 'completada':
        return <Badge className="bg-blue-100 text-blue-800">Completada</Badge>;
      default:
        return <Badge variant="secondary">{estado}</Badge>;
    }
  };

  const calcularPrecioTotal = (zona: ZonaComun, horas: number) => {
    return zona.precioPorHora * horas;
  };

  const handleNuevaReserva = () => {
    const nuevaReserva: Reserva = {
      id: `RES-${String(reservas.length + 1).padStart(3, '0')}`,
      zonaComunId: '',
      zonaNombre: '',
      solicitante: '',
      fechaReserva: '',
      horaInicio: '',
      horaFin: '',
      duracionHoras: 1,
      numeroPersonas: 1,
      motivo: '',
      telefonoContacto: '',
      precioTotal: 0,
      estado: 'pendiente',
      fechaCreacion: new Date().toISOString().split('T')[0]
    };
    setReservaEditando(nuevaReserva);
    setEsNuevaReserva(true);
    setDialogoAbierto(true);
  };

  const handleEditarReserva = (reserva: Reserva) => {
    setReservaEditando({ ...reserva });
    setEsNuevaReserva(false);
    setDialogoAbierto(true);
  };

  const handleEliminarReserva = (id: string) => {
    setReservas(prev => prev.filter(reserva => reserva.id !== id));
    toast({
      title: "Reserva eliminada",
      description: "La reserva ha sido eliminada exitosamente.",
    });
  };

  const handleCambiarEstado = (id: string, nuevoEstado: Reserva['estado']) => {
    setReservas(prev => prev.map(reserva =>
      reserva.id === id ? { ...reserva, estado: nuevoEstado } : reserva
    ));

    const mensajes = {
      confirmada: "Reserva confirmada exitosamente.",
      cancelada: "Reserva cancelada.",
      completada: "Reserva marcada como completada."
    };

    toast({
      title: "Estado actualizado",
      description: mensajes[nuevoEstado] || "Estado actualizado.",
    });
  };

  const handleGuardarReserva = () => {
    if (!reservaEditando) return;

    // Validaciones básicas
    if (!reservaEditando.zonaComunId || !reservaEditando.solicitante ||
        !reservaEditando.fechaReserva || !reservaEditando.horaInicio || !reservaEditando.horaFin) {
      toast({
        title: "Datos incompletos",
        description: "Por favor complete todos los campos requeridos.",
        variant: "destructive",
      });
      return;
    }

    // Calcular duración y precio
    const zonaSeleccionada = zonasComunes.find(z => z.id === reservaEditando.zonaComunId);
    if (zonaSeleccionada) {
      const inicio = new Date(`2000-01-01T${reservaEditando.horaInicio}`);
      const fin = new Date(`2000-01-01T${reservaEditando.horaFin}`);
      const duracionMs = fin.getTime() - inicio.getTime();
      const duracionHoras = duracionMs / (1000 * 60 * 60);

      reservaEditando.duracionHoras = duracionHoras;
      reservaEditando.precioTotal = calcularPrecioTotal(zonaSeleccionada, duracionHoras);
      reservaEditando.zonaNombre = zonaSeleccionada.nombre;
    }

    if (esNuevaReserva) {
      setReservas(prev => [...prev, reservaEditando]);
      toast({
        title: "Reserva creada",
        description: "La reserva ha sido creada exitosamente.",
      });
    } else {
      setReservas(prev => prev.map(reserva =>
        reserva.id === reservaEditando.id ? reservaEditando : reserva
      ));
      toast({
        title: "Reserva actualizada",
        description: "La reserva ha sido actualizada exitosamente.",
      });
    }

    setDialogoAbierto(false);
    setReservaEditando(null);
  };

  const zonasDisponibles = zonasComunes.filter(zona =>
    zona.disponibleReservas && zona.estado === 'activa'
  );

  const reservasActivas = reservas.filter(r => r.estado === 'confirmada' || r.estado === 'pendiente');
  const reservasHoy = reservas.filter(r =>
    r.fechaReserva === new Date().toISOString().split('T')[0] &&
    (r.estado === 'confirmada' || r.estado === 'pendiente')
  );
  const ingresosEstimados = reservas
    .filter(r => r.estado === 'confirmada' || r.estado === 'completada')
    .reduce((sum, r) => sum + r.precioTotal, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reservas</h1>
          <p className="text-muted-foreground">
            Gestiona las reservas de espacios comunes y amenidades de la comunidad
          </p>
        </div>
        <Button onClick={handleNuevaReserva}>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Reserva
        </Button>
      </div>

      {/* Estadísticas */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reservas Activas</CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-blue-600">{reservasActivas.length}</div>
            <p className="text-xs text-muted-foreground">
              confirmadas y pendientes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reservas Hoy</CardTitle>
            <Clock className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-green-600">{reservasHoy.length}</div>
            <p className="text-xs text-muted-foreground">
              programadas para hoy
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Zonas Disponibles</CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-purple-600">{zonasDisponibles.length}</div>
            <p className="text-xs text-muted-foreground">
              para reservar
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos Estimados</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-green-600">
              {formatCurrency(ingresosEstimados)}
            </div>
            <p className="text-xs text-muted-foreground">
              de reservas confirmadas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Zonas comunes disponibles */}
      <Card>
        <CardHeader>
          <CardTitle>Zonas Comunes Disponibles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {zonasDisponibles.map((zona) => (
              <Card key={zona.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{zona.nombre}</CardTitle>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>Hasta {zona.capacidad} personas</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{zona.horarioInicio} - {zona.horarioFin}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span>{formatCurrency(zona.precioPorHora)}/hora</span>
                  </div>
                  <Button
                    className="w-full"
                    onClick={() => {
                      const nuevaReserva: Reserva = {
                        id: `RES-${String(reservas.length + 1).padStart(3, '0')}`,
                        zonaComunId: zona.id,
                        zonaNombre: zona.nombre,
                        solicitante: '',
                        fechaReserva: '',
                        horaInicio: zona.horarioInicio,
                        horaFin: zona.horarioFin,
                        duracionHoras: 1,
                        numeroPersonas: 1,
                        motivo: '',
                        telefonoContacto: '',
                        precioTotal: zona.precioPorHora,
                        estado: 'pendiente',
                        fechaCreacion: new Date().toISOString().split('T')[0]
                      };
                      setReservaEditando(nuevaReserva);
                      setEsNuevaReserva(true);
                      setDialogoAbierto(true);
                    }}
                  >
                    Reservar
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Lista de reservas */}
      <Card>
        <CardHeader>
          <CardTitle>Gestión de Reservas</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Zona</TableHead>
                <TableHead>Solicitante</TableHead>
                <TableHead>Fecha y Hora</TableHead>
                <TableHead>Duración</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reservas.map((reserva) => (
                <TableRow key={reserva.id}>
                  <TableCell>
                    <div className="font-medium">{reserva.zonaNombre}</div>
                    <div className="text-sm text-muted-foreground">{reserva.motivo}</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{reserva.solicitante}</div>
                    <div className="text-sm text-muted-foreground">{reserva.telefonoContacto}</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{formatDate(reserva.fechaReserva)}</div>
                    <div className="text-sm text-muted-foreground">
                      {reserva.horaInicio} - {reserva.horaFin}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{reserva.duracionHoras}h</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {reserva.numeroPersonas} personas
                    </div>
                  </TableCell>
                  <TableCell className="font-mono font-semibold text-green-600">
                    {formatCurrency(reserva.precioTotal)}
                  </TableCell>
                  <TableCell>{getEstadoBadge(reserva.estado)}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditarReserva(reserva)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      {reserva.estado === 'pendiente' && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCambiarEstado(reserva.id, 'confirmada')}
                            className="text-green-600"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCambiarEstado(reserva.id, 'cancelada')}
                            className="text-red-600"
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEliminarReserva(reserva.id)}
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

      {/* Diálogo de reserva */}
      <Dialog open={dialogoAbierto} onOpenChange={setDialogoAbierto}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {esNuevaReserva ? "Nueva Reserva" : "Editar Reserva"}
            </DialogTitle>
            <DialogDescription>
              Complete la información para {esNuevaReserva ? "crear" : "modificar"} la reserva de zona común.
            </DialogDescription>
          </DialogHeader>

          {reservaEditando && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="zona">Zona Común</Label>
                  <Select
                    value={reservaEditando.zonaComunId}
                    onValueChange={(value) => {
                      const zona = zonasComunes.find(z => z.id === value);
                      setReservaEditando({
                        ...reservaEditando,
                        zonaComunId: value,
                        zonaNombre: zona?.nombre || '',
                        precioTotal: zona ? calcularPrecioTotal(zona, reservaEditando.duracionHoras) : 0
                      });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione una zona..." />
                    </SelectTrigger>
                    <SelectContent>
                      {zonasDisponibles.map((zona) => (
                        <SelectItem key={zona.id} value={zona.id}>
                          {zona.nombre} - {formatCurrency(zona.precioPorHora)}/hora
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="solicitante">Nombre del Solicitante</Label>
                  <Input
                    id="solicitante"
                    value={reservaEditando.solicitante}
                    onChange={(e) => setReservaEditando({...reservaEditando, solicitante: e.target.value})}
                    placeholder="Nombre completo"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fecha">Fecha de Reserva</Label>
                  <Input
                    id="fecha"
                    type="date"
                    value={reservaEditando.fechaReserva}
                    onChange={(e) => setReservaEditando({...reservaEditando, fechaReserva: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="horaInicio">Hora Inicio</Label>
                  <Input
                    id="horaInicio"
                    type="time"
                    value={reservaEditando.horaInicio}
                    onChange={(e) => setReservaEditando({...reservaEditando, horaInicio: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="horaFin">Hora Fin</Label>
                  <Input
                    id="horaFin"
                    type="time"
                    value={reservaEditando.horaFin}
                    onChange={(e) => setReservaEditando({...reservaEditando, horaFin: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="personas">Número de Personas</Label>
                  <Input
                    id="personas"
                    type="number"
                    value={reservaEditando.numeroPersonas}
                    onChange={(e) => setReservaEditando({...reservaEditando, numeroPersonas: parseInt(e.target.value) || 1})}
                    min="1"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefono">Teléfono de Contacto</Label>
                  <Input
                    id="telefono"
                    value={reservaEditando.telefonoContacto}
                    onChange={(e) => setReservaEditando({...reservaEditando, telefonoContacto: e.target.value})}
                    placeholder="300-123-4567"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="motivo">Motivo de la Reserva</Label>
                <Textarea
                  id="motivo"
                  value={reservaEditando.motivo}
                  onChange={(e) => setReservaEditando({...reservaEditando, motivo: e.target.value})}
                  placeholder="Describa el propósito de la reserva"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notas">Notas Adicionales (Opcional)</Label>
                <Textarea
                  id="notas"
                  value={reservaEditando.notas || ''}
                  onChange={(e) => setReservaEditando({...reservaEditando, notas: e.target.value})}
                  placeholder="Información adicional relevante"
                  rows={2}
                />
              </div>

              {/* Resumen de precio */}
              {reservaEditando.zonaComunId && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">Resumen de la Reserva</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Duración estimada:</span>
                      <span>{reservaEditando.duracionHoras} horas</span>
                    </div>
                    <div className="flex justify-between font-semibold">
                      <span>Total a pagar:</span>
                      <span className="text-green-600">{formatCurrency(reservaEditando.precioTotal)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogoAbierto(false)}>
              Cancelar
            </Button>
            <Button onClick={handleGuardarReserva}>
              {esNuevaReserva ? "Crear Reserva" : "Guardar Cambios"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}