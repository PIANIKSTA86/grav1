import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { SuscriptorSelector } from "@/components/suscriptor-selector";
import { UserMenu } from "@/components/user-menu";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Suscriptores from "@/pages/suscriptores";
import Unidades from "@/pages/unidades";
import Terceros from "@/pages/terceros";
import PlanCuentas from "@/pages/plan-cuentas";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/suscriptores" component={Suscriptores} />
      <Route path="/unidades" component={Unidades} />
      <Route path="/terceros" component={Terceros} />
      <Route path="/plan-cuentas" component={PlanCuentas} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <SidebarProvider style={style as React.CSSProperties}>
            <div className="flex h-screen w-full">
              <AppSidebar />
              <div className="flex flex-col flex-1 overflow-hidden">
                <header className="flex items-center justify-between gap-4 p-4 border-b">
                  <div className="flex items-center gap-4">
                    <SidebarTrigger data-testid="button-sidebar-toggle" />
                    <SuscriptorSelector />
                  </div>
                  <div className="flex items-center gap-2">
                    <ThemeToggle />
                    <UserMenu />
                  </div>
                </header>
                <main className="flex-1 overflow-auto p-6">
                  <Router />
                </main>
              </div>
            </div>
          </SidebarProvider>
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;