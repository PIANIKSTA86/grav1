import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";

export function Calendario() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Calendario Comunitario</h1>
        <p className="text-muted-foreground">
          Visualiza eventos, reuniones y actividades programadas en la comunidad
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Calendario</CardTitle>
            <CardDescription>
              Selecciona una fecha para ver los eventos programados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Eventos del Día</CardTitle>
            <CardDescription>
              {date?.toLocaleDateString('es-ES', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 border rounded-lg">
                <h4 className="font-medium">Reunión de Copropietarios</h4>
                <p className="text-sm text-muted-foreground">2:00 PM - 4:00 PM</p>
                <p className="text-sm">Salón Social - Agenda mensual</p>
              </div>

              <div className="p-3 border rounded-lg">
                <h4 className="font-medium">Mantenimiento Piscina</h4>
                <p className="text-sm text-muted-foreground">9:00 AM - 12:00 PM</p>
                <p className="text-sm">Limpieza y mantenimiento programado</p>
              </div>

              <div className="p-3 border rounded-lg">
                <h4 className="font-medium">Clase de Yoga</h4>
                <p className="text-sm text-muted-foreground">6:00 PM - 7:00 PM</p>
                <p className="text-sm">Gimnasio - Todos los niveles</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Próximos Eventos</CardTitle>
          <CardDescription>
            Eventos programados en los próximos días
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">Día del Niño</h4>
                <p className="text-sm text-muted-foreground">31 de octubre - Todo el día</p>
                <p className="text-sm">Actividades recreativas para niños</p>
              </div>
              <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">
                Comunitario
              </span>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">Halloween</h4>
                <p className="text-sm text-muted-foreground">31 de octubre - 8:00 PM</p>
                <p className="text-sm">Fiesta de disfraces en el salón social</p>
              </div>
              <span className="px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded-full">
                Festivo
              </span>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">Reunión Junta Directiva</h4>
                <p className="text-sm text-muted-foreground">5 de noviembre - 7:00 PM</p>
                <p className="text-sm">Revisión de presupuestos mensuales</p>
              </div>
              <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                Administrativo
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}