import { Home, Building2, Users, FileText, Receipt, Wallet, ClipboardList, DollarSign, Package, FileSpreadsheet, Settings, ChevronDown, ChevronRight, Briefcase, Calculator, Truck, Calendar, CalendarDays, MessageSquare, FolderOpen, TrendingDown, Banknote, BarChart3 } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useState } from "react";
import { useSidebar } from "@/contexts/sidebar-context";

interface MenuItem {
  name: string;
  path: string;
  icon?: React.ComponentType<{ className?: string }>;
  subItems?: MenuItem[];
}

interface MenuGroup {
  title: string;
  items: MenuItem[];
}

const menuGroups: MenuGroup[] = [
  {
    title: "Principal",
    items: [
      {
        name: "Dashboard",
        path: "/",
        icon: Home,
      },
      {
        name: "Suscriptores",
        path: "/suscriptores",
        icon: Building2,
      },
      {
        name: "Terceros",
        path: "/terceros",
        icon: Users,
      },
    ],
  },
  {
    title: "Contabilidad",
    items: [
      {
        name: "Contabilidad",
        path: "#",
        icon: Calculator,
        subItems: [
          { name: "Plan de Cuentas", path: "/plan-cuentas", icon: FileSpreadsheet },
          { name: "Comprobantes", path: "/comprobantes", icon: FileText },
          { name: "Períodos", path: "/periodos", icon: ClipboardList },
        ],
      },
    ],
  },
  {
    title: "Tesorería",
    items: [
      {
        name: "Tesorería",
        path: "#",
        icon: Wallet,
        subItems: [
          { name: "Bancos", path: "/bancos", icon: Banknote },
          { name: "Recaudos", path: "/recaudos", icon: DollarSign },
          { name: "Pagos", path: "/pagos", icon: TrendingDown },
        ],
      },
    ],
  },
  {
    title: "Operaciones",
    items: [
      {
        name: "Facturación",
        path: "#",
        icon: Receipt,
        subItems: [
          { name: "Unidades", path: "/unidades", icon: Package },
          { name: "Facturación", path: "/facturacion-lotes", icon: Receipt },
          { name: "Conceptos", path: "/facturacion-conceptos", icon: Calculator },
          { name: "Configuración", path: "/facturacion-config", icon: Settings },
          { name: "Reportes", path: "/facturacion-reportes", icon: BarChart3 },
        ],
      },
      {
        name: "Nómina",
        path: "/nomina",
        icon: Briefcase,
      },
    ],
  },
  {
    title: "Administración",
    items: [
      {
        name: "Presupuestos",
        path: "/presupuestos",
        icon: DollarSign,
      },
      {
        name: "Activos Fijos",
        path: "/activos-fijos",
        icon: Truck,
      },
      {
        name: "Exógena",
        path: "/exogena",
        icon: FileText,
      },
    ],
  },
  {
    title: "Mi Comunidad",
    items: [
      {
        name: "Mi Comunidad",
        path: "#",
        icon: Users,
        subItems: [
          { name: "Reservas", path: "/reservas", icon: CalendarDays },
          { name: "Calendario", path: "/calendario", icon: Calendar },
          { name: "Gestión PQRS", path: "/pqrs", icon: MessageSquare },
          { name: "Gestión Documental", path: "/documentos", icon: FolderOpen },
        ],
      },
    ],
  },
];

export function AppSidebar() {
  const [location] = useLocation();
  const { isExpanded } = useSidebar();
  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({
    "Principal-Gestión": true,
    "Contabilidad-Contabilidad": false,
    "Mi Comunidad-Mi Comunidad": false,
  });

  const toggleSubmenu = (groupTitle: string, itemName: string) => {
    const key = `${groupTitle}-${itemName}`;
    setOpenSubmenus(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const isActive = (path: string) => location === path;

  const isSubmenuOpen = (groupTitle: string, itemName: string) => {
    const key = `${groupTitle}-${itemName}`;
    return openSubmenus[key] || false;
  };

  return (
    <div
      className={`fixed top-16 flex h-[calc(100vh-4rem)] flex-col bg-white border-r border-gray-200 dark:bg-gray-900 dark:border-gray-800 transition-all duration-300 w-64 ${
        isExpanded ? 'left-0' : '-left-64'
      }`}
    >
      <div className="flex flex-col overflow-y-auto no-scrollbar">
        <nav className="px-4 py-6">
          {menuGroups.map((group, groupIndex) => (
            <div key={groupIndex} className="mb-2">
              <ul className="space-y-1">
                {group.items.map((item, itemIndex) => (
                  <li key={itemIndex}>
                    {item.subItems ? (
                      <div>
                        <button
                          onClick={() => toggleSubmenu(group.title, item.name)}
                          className={`group flex w-full items-center justify-between rounded-lg px-3 py-1.5 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-white ${
                            isSubmenuOpen(group.title, item.name)
                              ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white"
                              : "text-gray-700 dark:text-gray-300"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            {item.icon && <item.icon className="h-5 w-5" />}
                            <span>{item.name}</span>
                          </div>
                          {isSubmenuOpen(group.title, item.name) ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </button>
                        {isSubmenuOpen(group.title, item.name) && (
                          <ul className="mt-1 space-y-1 pl-8">
                            {item.subItems.map((subItem, subIndex) => (
                              <li key={subIndex}>
                                <Link
                                  href={subItem.path}
                                  className={`flex items-center gap-3 rounded-lg px-3 py-1.5 text-sm transition-colors hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-white ${
                                    isActive(subItem.path)
                                      ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                                      : "text-gray-600 dark:text-gray-400"
                                  }`}
                                >
                                  {subItem.icon && <subItem.icon className="h-4 w-4" />}
                                  <span>{subItem.name}</span>
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ) : (
                      <Link
                        href={item.path}
                        className={`flex items-center gap-3 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-white ${
                          isActive(item.path)
                            ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                            : "text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {item.icon && <item.icon className="h-5 w-5" />}
                        <span>{item.name}</span>
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
}