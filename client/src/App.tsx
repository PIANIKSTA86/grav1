import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthenticatedLayout } from "@/components/authenticated-layout";
import { useAuth, AuthProvider } from "@/contexts/auth-context";
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

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  // If still loading after a reasonable time, show landing
  if (isLoading) {
    return <Landing />;
  }

  if (!isAuthenticated) {
    return <Landing />;
  }

  return <>{children}</>;
}

function AppContent() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Switch>
            {/* Landing page pública */}
            <Route path="/landing" component={Landing} />

            {/* Rutas autenticadas */}
            <Route path="/">
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <Dashboard />
                </AuthenticatedLayout>
              </ProtectedRoute>
            </Route>

            <Route path="/suscriptores">
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <Suscriptores />
                </AuthenticatedLayout>
              </ProtectedRoute>
            </Route>

            <Route path="/unidades">
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <Unidades />
                </AuthenticatedLayout>
              </ProtectedRoute>
            </Route>

            <Route path="/terceros">
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <Terceros />
                </AuthenticatedLayout>
              </ProtectedRoute>
            </Route>

            <Route path="/plan-cuentas">
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <PlanCuentas />
                </AuthenticatedLayout>
              </ProtectedRoute>
            </Route>
            
            <Route path="/comprobantes">
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <Comprobantes />
                </AuthenticatedLayout>
              </ProtectedRoute>
            </Route>
            
            <Route path="/periodos">
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <Periodos />
                </AuthenticatedLayout>
              </ProtectedRoute>
            </Route>
            
            <Route path="/facturacion">
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <Facturacion />
                </AuthenticatedLayout>
              </ProtectedRoute>
            </Route>
            
            <Route path="/tesoreria">
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <Tesoreria />
                </AuthenticatedLayout>
              </ProtectedRoute>
            </Route>
            
            <Route path="/nomina">
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <Nomina />
                </AuthenticatedLayout>
              </ProtectedRoute>
            </Route>
            
            <Route path="/presupuestos">
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <Presupuestos />
                </AuthenticatedLayout>
              </ProtectedRoute>
            </Route>
            
            <Route path="/activos-fijos">
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <ActivosFijos />
                </AuthenticatedLayout>
              </ProtectedRoute>
            </Route>
            
            <Route path="/exogena">
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <Exogena />
                </AuthenticatedLayout>
              </ProtectedRoute>
            </Route>
            
            <Route component={NotFound} />
          </Switch>
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;