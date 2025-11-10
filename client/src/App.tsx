import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthenticatedLayout } from "@/components/authenticated-layout";
import { useAuth, AuthProvider } from "@/contexts/auth-context";
import Landing from "@/pages/landing";
import Blog from "@/pages/blog";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Suscriptores from "@/pages/suscriptores";
import Unidades from "@/pages/unidades";
import Terceros from "@/pages/terceros";
import PlanCuentas from "@/pages/plan-cuentas";
import Comprobantes from "@/pages/comprobantes";
import Periodos from "@/pages/periodos";
import Facturacion from "@/pages/facturacion-lotes";
import { FacturacionConceptos } from "@/pages/facturacion-conceptos";
import { FacturacionConfig } from "@/pages/facturacion-config";
import { FacturacionReportes } from "@/pages/facturacion-reportes";
import { Recaudos } from "@/pages/recaudos";
import Nomina from "@/pages/nomina";
import NominaConfiguracion from "@/pages/nomina-configuracion";
import NominaEmpleados from "@/pages/nomina-empleados";
import NominaParametros from "@/pages/nomina-parametros";
import NominaHoras from "@/pages/nomina-horas";
import NominaNovedades from "@/pages/nomina-novedades";
import NominaCalculo from "@/pages/nomina-calculo";
import NominaRevision from "@/pages/nomina-revision";
import NominaAprobacion from "@/pages/nomina-aprobacion";
import NominaComprobantes from "@/pages/nomina-comprobantes";
import Presupuestos from "@/pages/presupuestos";
import PresupuestosEjecucion from "@/pages/presupuestos-ejecucion";
import PresupuestosPartidas from "@/pages/presupuestos-partidas";
import PresupuestosReportes from "@/pages/presupuestos-reportes";
import ActivosFijos from "@/pages/activos-fijos";
import ActivosFijosCatalogo from "@/pages/activos-fijos-catalogo";
import ActivosFijosDepreciacion from "@/pages/activos-fijos-depreciacion";
import ActivosFijosMtto from "@/pages/activos-fijos-mtto";
import ActivosFijosBajas from "@/pages/activos-fijos-bajas";
import ActivosFijosReportes from "@/pages/activos-fijos-reportes";
import ActivosFijosConfig from "@/pages/activos-fijos-config";
import ExogenaHistorial from "@/pages/exogena-historial";
import ExogenaFormatos from "@/pages/exogena-formatos";
import ExogenaGeneracion from "@/pages/exogena-generacion";
import ExogenaAvanzada from "@/pages/exogena-avanzada";
import { Reservas } from "@/pages/reservas";
import ZonasComunes from "@/pages/zonas-comunes";
import { Calendario } from "@/pages/calendario";
import { Pqrs } from "@/pages/pqrs";
import { Documentos } from "@/pages/documentos";
import { Pagos } from "@/pages/pagos";
import { Bancos } from "@/pages/bancos";

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
            <Route path="/blog" component={Blog} />

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
            
            <Route path="/bancos">
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <Bancos />
                </AuthenticatedLayout>
              </ProtectedRoute>
            </Route>
            
            <Route path="/facturacion-lotes">
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <Facturacion />
                </AuthenticatedLayout>
              </ProtectedRoute>
            </Route>
            
            <Route path="/facturacion-conceptos">
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <FacturacionConceptos />
                </AuthenticatedLayout>
              </ProtectedRoute>
            </Route>
            
            <Route path="/facturacion-config">
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <FacturacionConfig />
                </AuthenticatedLayout>
              </ProtectedRoute>
            </Route>
            
            <Route path="/facturacion-reportes">
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <FacturacionReportes />
                </AuthenticatedLayout>
              </ProtectedRoute>
            </Route>
            
            <Route path="/recaudos">
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <Recaudos />
                </AuthenticatedLayout>
              </ProtectedRoute>
            </Route>
            
            <Route path="/pagos">
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <Pagos />
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

            <Route path="/nomina/configuracion">
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <NominaConfiguracion />
                </AuthenticatedLayout>
              </ProtectedRoute>
            </Route>

            <Route path="/nomina/empleados">
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <NominaEmpleados />
                </AuthenticatedLayout>
              </ProtectedRoute>
            </Route>

            <Route path="/nomina/parametros">
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <NominaParametros />
                </AuthenticatedLayout>
              </ProtectedRoute>
            </Route>

            <Route path="/nomina/horas">
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <NominaHoras />
                </AuthenticatedLayout>
              </ProtectedRoute>
            </Route>

            <Route path="/nomina/novedades">
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <NominaNovedades />
                </AuthenticatedLayout>
              </ProtectedRoute>
            </Route>

            <Route path="/nomina/calculo">
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <NominaCalculo />
                </AuthenticatedLayout>
              </ProtectedRoute>
            </Route>

            <Route path="/nomina/revision">
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <NominaRevision />
                </AuthenticatedLayout>
              </ProtectedRoute>
            </Route>

            <Route path="/nomina/aprobacion">
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <NominaAprobacion />
                </AuthenticatedLayout>
              </ProtectedRoute>
            </Route>

            <Route path="/nomina/comprobantes">
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <NominaComprobantes />
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

            <Route path="/presupuestos/ejecucion">
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <PresupuestosEjecucion />
                </AuthenticatedLayout>
              </ProtectedRoute>
            </Route>

            <Route path="/presupuestos/partidas">
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <PresupuestosPartidas />
                </AuthenticatedLayout>
              </ProtectedRoute>
            </Route>

            <Route path="/presupuestos/reportes">
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <PresupuestosReportes />
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

            <Route path="/activos-fijos/catalogo">
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <ActivosFijosCatalogo />
                </AuthenticatedLayout>
              </ProtectedRoute>
            </Route>

            <Route path="/activos-fijos/depreciacion">
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <ActivosFijosDepreciacion />
                </AuthenticatedLayout>
              </ProtectedRoute>
            </Route>

            <Route path="/activos-fijos/mtto">
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <ActivosFijosMtto />
                </AuthenticatedLayout>
              </ProtectedRoute>
            </Route>

            <Route path="/activos-fijos/bajas">
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <ActivosFijosBajas />
                </AuthenticatedLayout>
              </ProtectedRoute>
            </Route>

            <Route path="/activos-fijos/reportes">
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <ActivosFijosReportes />
                </AuthenticatedLayout>
              </ProtectedRoute>
            </Route>

            <Route path="/activos-fijos/config">
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <ActivosFijosConfig />
                </AuthenticatedLayout>
              </ProtectedRoute>
            </Route>

            <Route path="/exogena/historial">
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <ExogenaHistorial />
                </AuthenticatedLayout>
              </ProtectedRoute>
            </Route>

            <Route path="/exogena/formatos">
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <ExogenaFormatos />
                </AuthenticatedLayout>
              </ProtectedRoute>
            </Route>

            <Route path="/exogena/generacion">
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <ExogenaGeneracion />
                </AuthenticatedLayout>
              </ProtectedRoute>
            </Route>

            <Route path="/exogena/avanzada">
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <ExogenaAvanzada />
                </AuthenticatedLayout>
              </ProtectedRoute>
            </Route>

            <Route path="/reservas">
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <Reservas />
                </AuthenticatedLayout>
              </ProtectedRoute>
            </Route>

            <Route path="/zonas-comunes">
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <ZonasComunes />
                </AuthenticatedLayout>
              </ProtectedRoute>
            </Route>

            <Route path="/calendario">
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <Calendario />
                </AuthenticatedLayout>
              </ProtectedRoute>
            </Route>

            <Route path="/pqrs">
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <Pqrs />
                </AuthenticatedLayout>
              </ProtectedRoute>
            </Route>

            <Route path="/documentos">
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <Documentos />
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