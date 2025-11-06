import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { HorizontalHeader } from "@/components/horizontal-header";
import Landing from "@/pages/landing";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Suscriptores from "@/pages/suscriptores";
import Unidades from "@/pages/unidades";
import Terceros from "@/pages/terceros";
import PlanCuentas from "@/pages/plan-cuentas";
import Comprobantes from "@/pages/comprobantes";
import Periodos from "@/pages/periodos";
import Facturacion from "@/pages/facturacion";
import Tesoreria from "@/pages/tesoreria";
import Nomina from "@/pages/nomina";
import Presupuestos from "@/pages/presupuestos";
import ActivosFijos from "@/pages/activos-fijos";
import Exogena from "@/pages/exogena";

function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <HorizontalHeader />
      <main className="container mx-auto px-4 py-6">{children}</main>
    </div>
  );
}

function App() {
  //todo: remove mock functionality
  // En producción, verificar si el usuario está autenticado
  const isAuthenticated = true; // Cambiar a true para ver el dashboard

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
            
            <Route path="/comprobantes">
              <AuthenticatedLayout>
                <Comprobantes />
              </AuthenticatedLayout>
            </Route>
            
            <Route path="/periodos">
              <AuthenticatedLayout>
                <Periodos />
              </AuthenticatedLayout>
            </Route>
            
            <Route path="/facturacion">
              <AuthenticatedLayout>
                <Facturacion />
              </AuthenticatedLayout>
            </Route>
            
            <Route path="/tesoreria">
              <AuthenticatedLayout>
                <Tesoreria />
              </AuthenticatedLayout>
            </Route>
            
            <Route path="/nomina">
              <AuthenticatedLayout>
                <Nomina />
              </AuthenticatedLayout>
            </Route>
            
            <Route path="/presupuestos">
              <AuthenticatedLayout>
                <Presupuestos />
              </AuthenticatedLayout>
            </Route>
            
            <Route path="/activos-fijos">
              <AuthenticatedLayout>
                <ActivosFijos />
              </AuthenticatedLayout>
            </Route>
            
            <Route path="/exogena">
              <AuthenticatedLayout>
                <Exogena />
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