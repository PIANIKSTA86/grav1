import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthenticatedLayout } from "@/components/authenticated-layout";
import Landing from "@/pages/landing";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Suscriptores from "@/pages/suscriptores";
import Unidades from "@/pages/unidades";
import Terceros from "@/pages/terceros";
import PlanCuentas from "@/pages/plan-cuentas";

function App() {
  //todo: remove mock functionality
  // En producción, verificar si el usuario está autenticado
  const isAuthenticated = false; // Cambiar a true para ver el dashboard

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Switch>
            {/* Landing page pública */}
            <Route path="/landing" component={Landing} />
            
            {/* Rutas autenticadas */}
            <Route path="/">
              {isAuthenticated ? (
                <AuthenticatedLayout>
                  <Dashboard />
                </AuthenticatedLayout>
              ) : (
                <Landing />
              )}
            </Route>
            
            <Route path="/suscriptores">
              <AuthenticatedLayout>
                <Suscriptores />
              </AuthenticatedLayout>
            </Route>
            
            <Route path="/unidades">
              <AuthenticatedLayout>
                <Unidades />
              </AuthenticatedLayout>
            </Route>
            
            <Route path="/terceros">
              <AuthenticatedLayout>
                <Terceros />
              </AuthenticatedLayout>
            </Route>
            
            <Route path="/plan-cuentas">
              <AuthenticatedLayout>
                <PlanCuentas />
              </AuthenticatedLayout>
            </Route>
            
            <Route component={NotFound} />
          </Switch>
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;