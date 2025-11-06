import { Building2, Users, Wallet, TrendingUp } from "lucide-react";
import { StatCard } from "@/components/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import buildingImage from "@assets/generated_images/Modern_condominium_building_exterior_f0fe84cd.png";

export default function Dashboard() {
  //todo: remove mock functionality
  const stats = [
    {
      title: "Total Unidades",
      value: "125",
      icon: Building2,
      trend: { value: "+5 este mes", isPositive: true },
      testId: "stat-unidades",
    },
    {
      title: "Propietarios",
      value: "98",
      icon: Users,
      trend: { value: "+2 este mes", isPositive: true },
      testId: "stat-propietarios",
    },
    {
      title: "Saldo Tesorería",
      value: "$45,230,500",
      icon: Wallet,
      testId: "stat-tesoreria",
    },
    {
      title: "Cartera Vencida",
      value: "$8,120,000",
      icon: TrendingUp,
      trend: { value: "-5% vs mes anterior", isPositive: true },
      testId: "stat-cartera",
    },
  ];

  const recentActivity = [
    { id: 1, tipo: "Factura", numero: "FC-2024-001", fecha: "2024-11-06", monto: "$1,250,000", estado: "Pagada" },
    { id: 2, tipo: "Comprobante", numero: "CE-2024-123", fecha: "2024-11-05", monto: "$850,000", estado: "Aprobado" },
    { id: 3, tipo: "Factura", numero: "FC-2024-002", fecha: "2024-11-04", monto: "$2,100,000", estado: "Pendiente" },
    { id: 4, tipo: "Recibo", numero: "RC-2024-045", fecha: "2024-11-03", monto: "$3,450,000", estado: "Procesado" },
  ];

  return (
    <div className="space-y-6">
      <div className="relative h-48 rounded-lg overflow-hidden">
        <img
          src={buildingImage}
          alt="Edificio"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30 flex items-center">
          <div className="px-8">
            <h1 className="text-3xl font-bold text-white mb-2">Bienvenido a Gravi</h1>
            <p className="text-white/90">Sistema de Gestión Integral para Copropiedades</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.testId} {...stat} />
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Actividad Reciente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between gap-4 pb-4 border-b last:border-0 last:pb-0"
                data-testid={`activity-${activity.id}`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">{activity.tipo}</span>
                    <span className="text-xs text-muted-foreground font-mono">{activity.numero}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{activity.fecha}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono font-semibold text-sm">{activity.monto}</span>
                  <Badge variant={activity.estado === "Pagada" || activity.estado === "Aprobado" ? "default" : "secondary"}>
                    {activity.estado}
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