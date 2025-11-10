import { useState } from "react";
import { Plus, Edit, Trash2, Clock, DollarSign, FileText, Users, Calendar, MapPin } from "lucide-react";
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
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

interface ZonaComun {
  id: string;
  nombre: string;
  descripcion: string;
  capacidad: number;
  precioPorHora: number;
  precioDia: number;
  precioMes: number;
  requiereAprobacion: boolean;
  disponibleReservas: boolean;
  horarioInicio: string;
  horarioFin: string;
  diasDisponibles: string[];
  condicionesUso: string;
  imagen?: string;
  estado: 'activa' | 'inactiva' | 'mantenimiento';
}

export default function ZonasComunes() {
  const { toast } = useToast();
  const [zonasComunes, setZonasComunes] = useState<ZonaComun[]>([
    {
      id: 'ZONA-001',
      nombre: 'Salón Social',
      descripcion: 'Espacio amplio para eventos sociales, reuniones y celebraciones',
      capacidad: 50,
      precioPorHora: 25000,
      precioDia: 150000,
      precioMes: 2000000,
      requiereAprobacion: true,
      disponibleReservas: true,
      horarioInicio: '08:00',
      horarioFin: '22:00',
      diasDisponibles: ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'],
      condicionesUso: 'Requiere depósito de $100.000. No se permiten fiestas con más de 30 personas sin autorización previa.',
      estado: 'activa'
    },
    {
      id: 'ZONA-002',
      nombre: 'Gimnasio',
      descripcion: 'Área equipada para actividades físicas y deportivas',
      capacidad: 20,
      precioPorHora: 15000,
      precioDia: 80000,
      precioMes: 1200000,
      requiereAprobacion: false,
      disponibleReservas: true,
      horarioInicio: '05:00',
      horarioFin: '22:00',
      diasDisponibles: ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'],
      condicionesUso: 'Uso exclusivo para residentes. Se requiere identificación. Mantener equipos en buen estado.',
      estado: 'activa'
    },
    {
      id: 'ZONA-003',
      nombre: 'Piscina',
      descripcion: 'Piscina comunitaria con zona de juegos infantiles',
      capacidad: 30,
      precioPorHora: 20000,
      precioDia: 120000,
      precioMes: 1800000,
      requiereAprobacion: false,
      disponibleReservas: true,
      horarioInicio: '07:00',
      horarioFin: '20:00',
      diasDisponibles: ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'],
      condicionesUso: 'Uso supervisado. Niños menores de 12 años deben estar acompañados. No se permiten mascotas.',
      estado: 'activa'
    },
    {
      id: 'ZONA-004',
      nombre: 'Cancha de Squash',
      descripcion: 'Cancha profesional para práctica de squash',
      capacidad: 4,
      precioPorHora: 30000,
      precioDia: 200000,
      precioMes: 3000000,
      requiereAprobacion: false,
      disponibleReservas: true,
      horarioInicio: '06:00',
      horarioFin: '22:00',
      diasDisponibles: ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'],
      condicionesUso: 'Requiere reserva previa. Se recomienda traer equipo personal.',
      estado: 'mantenimiento'
    }
  ]);

  const [zonaEditando, setZonaEditando] = useState<ZonaComun | null>(null);
  const [dialogoAbierto, setDialogoAbierto] = useState(false);
  const [esNuevaZona, setEsNuevaZona] = useState(false);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'activa':
        return <Badge className="bg-green-100 text-green-800">Activa</Badge>;
      case 'inactiva':
        return <Badge variant="secondary">Inactiva</Badge>;
      case 'mantenimiento':
        return <Badge className="bg-yellow-100 text-yellow-800">Mantenimiento</Badge>;
      default:
        return <Badge variant="secondary">{estado}</Badge>;
    }
  };

  const getDiasDisponiblesTexto = (dias: string[]) => {
    const diasMap: { [key: string]: string } = {
      'lunes': 'Lun',
      'martes': 'Mar',
      'miercoles': 'Mié',
      'jueves': 'Jue',
      'viernes': 'Vie',
      'sabado': 'Sáb',
      'domingo': 'Dom'
    };

    if (dias.length === 7) return 'Todos los días';
    if (dias.length === 5 && dias.includes('lunes') && dias.includes('martes') && dias.includes('miercoles') && dias.includes('jueves') && dias.includes('viernes')) {
      return 'Lun - Vie';
    }

    return dias.map(dia => diasMap[dia] || dia).join(', ');
  };

  const handleNuevaZona = () => {
    const nuevaZona: ZonaComun = {
      id: `ZONA-${String(zonasComunes.length + 1).padStart(3, '0')}`,
      nombre: '',
      descripcion: '',
      capacidad: 10,
      precioPorHora: 0,
      precioDia: 0,
      precioMes: 0,
      requiereAprobacion: false,
      disponibleReservas: true,
      horarioInicio: '08:00',
      horarioFin: '18:00',
      diasDisponibles: ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'],
      condicionesUso: '',
      estado: 'activa'
    };
    setZonaEditando(nuevaZona);
    setEsNuevaZona(true);
    setDialogoAbierto(true);
  };

  const handleEditarZona = (zona: ZonaComun) => {
    setZonaEditando({ ...zona });
    setEsNuevaZona(false);
    setDialogoAbierto(true);
  };

  const handleEliminarZona = (id: string) => {
    setZonasComunes(prev => prev.filter(zona => zona.id !== id));
    toast({
      title: "Zona eliminada",
      description: "La zona común ha sido eliminada exitosamente.",
    });
  };

  const handleGuardarZona = () => {
    if (!zonaEditando) return;

    if (!zonaEditando.nombre.trim()) {
      toast({
        title: "Nombre requerido",
        description: "Por favor ingrese un nombre para la zona común.",
        variant: "destructive",
      });
      return;
    }

    if (esNuevaZona) {
      setZonasComunes(prev => [...prev, zonaEditando]);
      toast({
        title: "Zona creada",
        description: "La zona común ha sido creada exitosamente.",
      });
    } else {
      setZonasComunes(prev => prev.map(zona =>
        zona.id === zonaEditando.id ? zonaEditando : zona
      ));
      toast({
        title: "Zona actualizada",
        description: "La zona común ha sido actualizada exitosamente.",
      });
    }

    setDialogoAbierto(false);
    setZonaEditando(null);
  };

  const zonasActivas = zonasComunes.filter(zona => zona.estado === 'activa').length;
  const zonasDisponiblesReservas = zonasComunes.filter(zona => zona.disponibleReservas && zona.estado === 'activa').length;
  const totalCapacidad = zonasComunes.reduce((sum, zona) => sum + zona.capacidad, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Zonas Comunes</h1>
          <p className="text-muted-foreground">
            Gestiona las zonas comunes disponibles para reservas y alquiler
          </p>
        </div>
        <Button onClick={handleNuevaZona}>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Zona
        </Button>
      </div>

      {/* Estadísticas */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Zonas</CardTitle>
            <MapPin className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-blue-600">{zonasComunes.length}</div>
            <p className="text-xs text-muted-foreground">
              zonas registradas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Zonas Activas</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-green-600">{zonasActivas}</div>
            <p className="text-xs text-muted-foreground">
              disponibles para uso
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Disponibles en Reservas</CardTitle>
            <Calendar className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-purple-600">{zonasDisponiblesReservas}</div>
            <p className="text-xs text-muted-foreground">
              para reservar online
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Capacidad Total</CardTitle>
            <Users className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-orange-600">{totalCapacidad}</div>
            <p className="text-xs text-muted-foreground">
              personas máximo
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de zonas comunes */}
      <Card>
        <CardHeader>
          <CardTitle>Gestión de Zonas Comunes</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Zona</TableHead>
                <TableHead>Capacidad</TableHead>
                <TableHead>Horarios</TableHead>
                <TableHead>Precios</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Reservas</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {zonasComunes.map((zona) => (
                <TableRow key={zona.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{zona.nombre}</div>
                      <div className="text-sm text-muted-foreground line-clamp-1">
                        {zona.descripcion}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="font-mono">{zona.capacidad}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        {zona.horarioInicio} - {zona.horarioFin}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {getDiasDisponiblesTexto(zona.diasDisponibles)}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3 text-muted-foreground" />
                        Hora: {formatCurrency(zona.precioPorHora)}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Día: {formatCurrency(zona.precioDia)}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getEstadoBadge(zona.estado)}</TableCell>
                  <TableCell>
                    <Badge variant={zona.disponibleReservas ? "default" : "secondary"}>
                      {zona.disponibleReservas ? "Disponible" : "No disponible"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditarZona(zona)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEliminarZona(zona.id)}
                        className="text-red-600 hover:text-red-700"
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
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {esNuevaZona ? "Nueva Zona Común" : "Editar Zona Común"}
            </DialogTitle>
            <DialogDescription>
              Configure los detalles de la zona común para que esté disponible en el sistema de reservas.
            </DialogDescription>
          </DialogHeader>

          {zonaEditando && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre de la Zona</Label>
                  <Input
                    id="nombre"
                    value={zonaEditando.nombre}
                    onChange={(e) => setZonaEditando({...zonaEditando, nombre: e.target.value})}
                    placeholder="Ej: Salón Social, Gimnasio, Piscina"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="capacidad">Capacidad Máxima</Label>
                  <Input
                    id="capacidad"
                    type="number"
                    value={zonaEditando.capacidad}
                    onChange={(e) => setZonaEditando({...zonaEditando, capacidad: parseInt(e.target.value) || 0})}
                    placeholder="Número de personas"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="descripcion">Descripción</Label>
                <Textarea
                  id="descripcion"
                  value={zonaEditando.descripcion}
                  onChange={(e) => setZonaEditando({...zonaEditando, descripcion: e.target.value})}
                  placeholder="Describe las características y usos de la zona común"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="precioHora">Precio por Hora</Label>
                  <Input
                    id="precioHora"
                    type="number"
                    value={zonaEditando.precioPorHora}
                    onChange={(e) => setZonaEditando({...zonaEditando, precioPorHora: parseInt(e.target.value) || 0})}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="precioDia">Precio por Día</Label>
                  <Input
                    id="precioDia"
                    type="number"
                    value={zonaEditando.precioDia}
                    onChange={(e) => setZonaEditando({...zonaEditando, precioDia: parseInt(e.target.value) || 0})}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="precioMes">Precio Mensual</Label>
                  <Input
                    id="precioMes"
                    type="number"
                    value={zonaEditando.precioMes}
                    onChange={(e) => setZonaEditando({...zonaEditando, precioMes: parseInt(e.target.value) || 0})}
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="horarioInicio">Horario de Inicio</Label>
                  <Input
                    id="horarioInicio"
                    type="time"
                    value={zonaEditando.horarioInicio}
                    onChange={(e) => setZonaEditando({...zonaEditando, horarioInicio: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="horarioFin">Horario de Fin</Label>
                  <Input
                    id="horarioFin"
                    type="time"
                    value={zonaEditando.horarioFin}
                    onChange={(e) => setZonaEditando({...zonaEditando, horarioFin: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="estado">Estado</Label>
                <Select
                  value={zonaEditando.estado}
                  onValueChange={(value: 'activa' | 'inactiva' | 'mantenimiento') =>
                    setZonaEditando({...zonaEditando, estado: value})
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="activa">Activa</SelectItem>
                    <SelectItem value="inactiva">Inactiva</SelectItem>
                    <SelectItem value="mantenimiento">En Mantenimiento</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="condiciones">Condiciones de Uso</Label>
                <Textarea
                  id="condiciones"
                  value={zonaEditando.condicionesUso}
                  onChange={(e) => setZonaEditando({...zonaEditando, condicionesUso: e.target.value})}
                  placeholder="Especifique las reglas y condiciones para el uso de esta zona"
                  rows={3}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="requiereAprobacion"
                  checked={zonaEditando.requiereAprobacion}
                  onCheckedChange={(checked) => setZonaEditando({...zonaEditando, requiereAprobacion: checked})}
                />
                <Label htmlFor="requiereAprobacion">Requiere aprobación previa</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="disponibleReservas"
                  checked={zonaEditando.disponibleReservas}
                  onCheckedChange={(checked) => setZonaEditando({...zonaEditando, disponibleReservas: checked})}
                />
                <Label htmlFor="disponibleReservas">Disponible para reservas online</Label>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogoAbierto(false)}>
              Cancelar
            </Button>
            <Button onClick={handleGuardarZona}>
              {esNuevaZona ? "Crear Zona" : "Guardar Cambios"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}