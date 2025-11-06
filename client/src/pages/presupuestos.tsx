import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function Presupuestos() {
  //todo: remove mock functionality
  const partidas = [
    {
      id: "1",
      nombre: "Servicios Públicos",
      tipo: "Operacional",
      aprobado: 10000000,
      ejecutado: 6500000,
      saldo: 3500000,
      porcentaje: 65,
    },
    {
      id: "2",
      nombre: "Mantenimiento General",
      tipo: "Operacional",
      aprobado: 15000000,
      ejecutado: 12000000,
      saldo: 3000000,
      porcentaje: 80,
    },
    {
      id: "3",
      nombre: "Vigilancia y Seguridad",
      tipo: "Personal",
      aprobado: 25000000,
      ejecutado: 18500000,
      saldo: 6500000,
      porcentaje: 74,
    },
    {
      id: "4",
      nombre: "Aseo y Jardinería",
      tipo: "Personal",
      aprobado: 8000000,
      ejecutado: 6200000,
      saldo: 1800000,
      porcentaje: 77.5,
    },
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const totalAprobado = partidas.reduce((sum, p) => sum + p.aprobado, 0);
  const totalEjecutado = partidas.reduce((sum, p) => sum + p.ejecutado, 0);
  const totalSaldo = partidas.reduce((sum, p) => sum + p.saldo, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Presupuestos</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Control presupuestal y partidas de gasto
          </p>
        </div>
        <Button data-testid="button-nueva-partida">
          <Plus className="mr-2 h-4 w-4" />
          Nueva Partida
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Presupuesto Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">{formatCurrency(totalAprobado)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ejecutado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-orange-600">{formatCurrency(totalEjecutado)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {((totalEjecutado / totalAprobado) * 100).toFixed(1)}% del total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo Disponible</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-green-600">{formatCurrency(totalSaldo)}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Partidas Presupuestales</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Partida</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead className="text-right">Aprobado</TableHead>
                <TableHead className="text-right">Ejecutado</TableHead>
                <TableHead className="text-right">Saldo</TableHead>
                <TableHead>Ejecución</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {partidas.map((partida) => (
                <TableRow key={partida.id} data-testid={`row-partida-${partida.id}`}>
                  <TableCell className="font-medium">{partida.nombre}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{partida.tipo}</TableCell>
                  <TableCell className="text-right font-mono">{formatCurrency(partida.aprobado)}</TableCell>
                  <TableCell className="text-right font-mono">{formatCurrency(partida.ejecutado)}</TableCell>
                  <TableCell className="text-right font-mono">{formatCurrency(partida.saldo)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={partida.porcentaje} className="w-20" />
                      <span className="text-sm font-mono">{partida.porcentaje}%</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}