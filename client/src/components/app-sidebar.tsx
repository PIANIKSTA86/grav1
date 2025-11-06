import { Home, Building2, Users, FileText, Receipt, Wallet, ClipboardList, DollarSign, Package, FileSpreadsheet, Settings } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "wouter";

const menuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  {
    title: "Suscriptores",
    url: "/suscriptores",
    icon: Building2,
  },
  {
    title: "Unidades",
    url: "/unidades",
    icon: Package,
  },
  {
    title: "Terceros",
    url: "/terceros",
    icon: Users,
  },
];

const contabilidadItems = [
  {
    title: "Plan de Cuentas",
    url: "/plan-cuentas",
    icon: FileSpreadsheet,
  },
  {
    title: "Comprobantes",
    url: "/comprobantes",
    icon: FileText,
  },
  {
    title: "Períodos",
    url: "/periodos",
    icon: ClipboardList,
  },
];

const otrosItems = [
  {
    title: "Facturación",
    url: "/facturacion",
    icon: Receipt,
  },
  {
    title: "Tesorería",
    url: "/tesoreria",
    icon: Wallet,
  },
  {
    title: "Presupuestos",
    url: "/presupuestos",
    icon: DollarSign,
  },
  {
    title: "Configuración",
    url: "/configuracion",
    icon: Settings,
  },
];

export function AppSidebar() {
  const [location] = useLocation();

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-md bg-primary text-primary-foreground font-semibold">
            G
          </div>
          <span className="text-lg font-semibold">Gravi</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location === item.url} data-testid={`link-${item.title.toLowerCase()}`}>
                    <Link href={item.url}>
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Contabilidad</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {contabilidadItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location === item.url} data-testid={`link-${item.title.toLowerCase()}`}>
                    <Link href={item.url}>
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Otros Módulos</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {otrosItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location === item.url} data-testid={`link-${item.title.toLowerCase()}`}>
                    <Link href={item.url}>
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}