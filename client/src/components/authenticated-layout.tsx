import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserMenu } from "@/components/user-menu";
import { useAuth } from "@/contexts/auth-context";
import { SidebarProvider, useSidebar } from "@/contexts/sidebar-context";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
}

function AuthenticatedLayoutContent({ children }: AuthenticatedLayoutProps) {
  const { user, suscriptor } = useAuth();
  const { isExpanded, toggleSidebar } = useSidebar();

  // TODO: Obtener información del suscriptor desde el contexto o API
  // Por ahora usamos datos mock hasta implementar la lógica completa
  const suscriptorActual = suscriptor || {
    nombre: "Edificio Torres del Parque",
    nit: "900123456-7",
  };

  if (!user) {
    return null; // O redirigir a login
  }

  return (
    <div className="flex h-screen w-full bg-gray-50 dark:bg-gray-900">
      <AppSidebar />
      <div
        className={`flex flex-col flex-1 overflow-hidden transition-all duration-300 ${
          isExpanded ? 'ml-64' : 'ml-0'
        }`}
      >
        <header className="flex items-center justify-between gap-4 p-4 border-b bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSidebar}
              className="h-10 w-10 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-900 dark:text-white">{suscriptorActual.nombre}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                NIT: {suscriptorActual.nit}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <UserMenu />
          </div>
        </header>
        <main className="flex-1 overflow-auto p-6 bg-gray-50 dark:bg-gray-900">{children}</main>
      </div>
    </div>
  );
}

export function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
  return (
    <SidebarProvider>
      <AuthenticatedLayoutContent>{children}</AuthenticatedLayoutContent>
    </SidebarProvider>
  );
}