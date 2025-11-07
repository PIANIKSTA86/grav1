import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function Reservas() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reservas</h1>
        <p className="text-muted-foreground">
          Gestiona las reservas de espacios comunes y amenidades de la comunidad
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Salón Social</CardTitle>
            <CardDescription>Espacio para eventos comunitarios</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Próxima reserva: Mañana 2:00 PM - 6:00 PM
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Piscina</CardTitle>
            <CardDescription>Área de natación comunitaria</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Disponible para reservas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Gimnasio</CardTitle>
            <CardDescription>Equipamiento deportivo</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Próxima reserva: Hoy 7:00 PM - 9:00 PM
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Reservas Activas</CardTitle>
          <CardDescription>
            Lista de todas las reservas actuales y próximas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">Salón Social - Evento Familiar</h4>
                <p className="text-sm text-muted-foreground">Mañana 2:00 PM - 6:00 PM</p>
              </div>
              <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                Confirmada
              </span>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">Gimnasio - Entrenamiento</h4>
                <p className="text-sm text-muted-foreground">Hoy 7:00 PM - 9:00 PM</p>
              </div>
              <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                Pendiente
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}