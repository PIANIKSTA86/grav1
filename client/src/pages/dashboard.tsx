import { Building2, Users, Wallet, TrendingUp, TrendingDown, DollarSign, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Dashboard() {
  //todo: remove mock functionality
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const recentActivity = [
    { id: 1, tipo: "Factura", numero: "FC-2024-001", fecha: "2024-11-06", monto: 1250000, estado: "Pagada" },
    { id: 2, tipo: "Comprobante", numero: "CE-2024-123", fecha: "2024-11-05", monto: 850000, estado: "Aprobado" },
    { id: 3, tipo: "Factura", numero: "FC-2024-002", fecha: "2024-11-04", monto: 2100000, estado: "Pendiente" },
    { id: 4, tipo: "Recibo", numero: "RC-2024-045", fecha: "2024-11-03", monto: 3450000, estado: "Procesado" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold mb-1">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Resumen general de la copropiedad
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Unidades</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">125</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-green-600">+5</span> este mes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Propietarios</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-green-600">+2</span> este mes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo Tesorería</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">{formatCurrency(45230500)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Disponible en caja
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cartera Vencida</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-red-600">{formatCurrency(8120000)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-green-600">-5%</span> vs mes anterior
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Ingresos y Egresos del Mes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-md bg-green-100 flex items-center justify-center">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Ingresos</p>
                    <p className="text-xs text-muted-foreground">Recaudos del mes</p>
                  </div>
                </div>
                <span className="font-mono font-semibold text-green-600">{formatCurrency(18500000)}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-md bg-red-100 flex items-center justify-center">
                    <TrendingDown className="h-4 w-4 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Egresos</p>
                    <p className="text-xs text-muted-foreground">Gastos del mes</p>
                  </div>
                </div>
                <span className="font-mono font-semibold text-red-600">{formatCurrency(12350000)}</span>
              </div>
              <div className="flex items-center justify-between pt-3 border-t">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-md bg-blue-100 flex items-center justify-center">
                    <DollarSign className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Flujo Neto</p>
                    <p className="text-xs text-muted-foreground">Balance del mes</p>
                  </div>
                </div>
                <span className="font-mono font-semibold text-blue-600">{formatCurrency(6150000)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Actividad Reciente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start justify-between gap-4 pb-3 border-b last:border-0 last:pb-0"
                  data-testid={`activity-${activity.id}`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <FileText className="h-3 w-3 text-muted-foreground" />
                      <span className="font-medium text-sm">{activity.tipo}</span>
                      <span className="text-xs text-muted-foreground font-mono">{activity.numero}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{activity.fecha}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="font-mono font-medium text-sm">{formatCurrency(activity.monto)}</span>
                    <Badge variant={activity.estado === "Pagada" || activity.estado === "Aprobado" ? "default" : "secondary"} className="text-xs">
                      {activity.estado}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}