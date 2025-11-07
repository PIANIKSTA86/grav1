import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquare, AlertCircle, CheckCircle, Clock } from "lucide-react";

export function Pqrs() {
  const pqrsData = [
    {
      id: "PQRS-001",
      tipo: "Queja",
      titulo: "Ruido excesivo en apartamento 5B",
      descripcion: "Los vecinos del apartamento 5B generan ruido excesivo después de las 10 PM",
      estado: "En proceso",
      fecha: "2025-11-01",
      prioridad: "Alta",
      solicitante: "Ana María López"
    },
    {
      id: "PQRS-002",
      tipo: "Petición",
      titulo: "Instalación de cámaras de seguridad",
      descripcion: "Solicitud para instalar cámaras de seguridad en las zonas comunes",
      estado: "Pendiente",
      fecha: "2025-10-28",
      prioridad: "Media",
      solicitante: "Carlos Rodríguez"
    },
    {
      id: "PQRS-003",
      tipo: "Reclamo",
      titulo: "Mantenimiento ascensor",
      descripcion: "El ascensor del edificio A presenta fallos frecuentes",
      estado: "Resuelto",
      fecha: "2025-10-25",
      prioridad: "Alta",
      solicitante: "María González"
    },
    {
      id: "PQRS-004",
      tipo: "Sugerencia",
      titulo: "Área de juegos infantiles",
      descripcion: "Propuesta para mejorar el área de juegos infantiles con equipo nuevo",
      estado: "En revisión",
      fecha: "2025-10-30",
      prioridad: "Baja",
      solicitante: "Pedro Sánchez"
    }
  ];

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case "Resuelto":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "En proceso":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case "Pendiente":
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <MessageSquare className="h-4 w-4 text-blue-600" />;
    }
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "Resuelto":
        return "bg-green-100 text-green-800";
      case "En proceso":
        return "bg-yellow-100 text-yellow-800";
      case "Pendiente":
        return "bg-red-100 text-red-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  const getPrioridadColor = (prioridad: string) => {
    switch (prioridad) {
      case "Alta":
        return "bg-red-100 text-red-800";
      case "Media":
        return "bg-yellow-100 text-yellow-800";
      case "Baja":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestión PQRS</h1>
          <p className="text-muted-foreground">
            Administra las Peticiones, Quejas, Reclamos y Sugerencias de la comunidad
          </p>
        </div>
        <Button>
          <MessageSquare className="h-4 w-4 mr-2" />
          Nueva PQRS
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total PQRS</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pqrsData.length}</div>
            <p className="text-xs text-muted-foreground">
              +2 desde el mes pasado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {pqrsData.filter(p => p.estado === "Pendiente").length}
            </div>
            <p className="text-xs text-muted-foreground">
              Requieren atención inmediata
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Proceso</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {pqrsData.filter(p => p.estado === "En proceso").length}
            </div>
            <p className="text-xs text-muted-foreground">
              Siendo atendidas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resueltas</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {pqrsData.filter(p => p.estado === "Resuelto").length}
            </div>
            <p className="text-xs text-muted-foreground">
              Este mes
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de PQRS</CardTitle>
          <CardDescription>
            Todas las peticiones, quejas, reclamos y sugerencias registradas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pqrsData.map((pqrs) => (
              <div key={pqrs.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-start space-x-4">
                  {getEstadoIcon(pqrs.estado)}
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium">{pqrs.titulo}</h4>
                      <Badge variant="outline" className="text-xs">
                        {pqrs.tipo}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{pqrs.descripcion}</p>
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <span>ID: {pqrs.id}</span>
                      <span>{pqrs.fecha}</span>
                      <span>Solicitante: {pqrs.solicitante}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getPrioridadColor(pqrs.prioridad)}>
                    {pqrs.prioridad}
                  </Badge>
                  <Badge className={getEstadoColor(pqrs.estado)}>
                    {pqrs.estado}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}