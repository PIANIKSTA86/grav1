import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Building2, FileText, Users, Wallet, TrendingUp, Shield } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import buildingImage from "@assets/generated_images/Modern_condominium_building_exterior_f0fe84cd.png";

export default function Landing() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [formData, setFormData] = useState({
    nitCopropiedad: "",
    nitUsuario: "",
    password: "",
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login con:", formData);
    // TODO: Implementar lógica de autenticación
    // Esto establecerá el contexto del suscriptor y usuario
    window.location.href = "/";
  };

  const features = [
    {
      icon: Building2,
      title: "Gestión de Unidades",
      description: "Administre todas las unidades, propietarios e inquilinos de forma eficiente",
    },
    {
      icon: FileText,
      title: "Contabilidad Completa",
      description: "Plan de cuentas, comprobantes y reportes contables según normativa vigente",
    },
    {
      icon: Wallet,
      title: "Control Financiero",
      description: "Tesorería, facturación de cuotas y seguimiento de cartera",
    },
    {
      icon: Users,
      title: "Multi-tenancia",
      description: "Cada copropiedad opera en su propio espacio aislado y seguro",
    },
    {
      icon: TrendingUp,
      title: "Reportes y Análisis",
      description: "Dashboards y reportes personalizados para toma de decisiones",
    },
    {
      icon: Shield,
      title: "Seguridad",
      description: "Autenticación robusta y control de acceso por roles",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-[600px] overflow-hidden">
        <img
          src={buildingImage}
          alt="Edificio moderno"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40 flex items-center">
          <div className="container mx-auto px-6">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center justify-center w-16 h-16 rounded-lg bg-primary text-primary-foreground">
                  <span className="text-3xl font-bold">G</span>
                </div>
                <h1 className="text-5xl font-bold text-white">Gravi</h1>
              </div>
              <p className="text-2xl text-white/90 mb-4 font-light">
                Sistema Integral de Gestión para Copropiedades
              </p>
              <p className="text-lg text-white/80 mb-8">
                Administre su copropiedad de manera profesional con contabilidad, facturación,
                tesorería y gestión de unidades en una sola plataforma.
              </p>
              <div className="flex gap-4">
                <Button
                  size="lg"
                  variant="default"
                  onClick={() => setShowLoginModal(true)}
                  data-testid="button-iniciar-sesion"
                >
                  Iniciar Sesión
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20"
                  onClick={() => console.log("Solicitar demo")}
                  data-testid="button-solicitar-demo"
                >
                  Solicitar Demo
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Todo lo que necesita para administrar su copropiedad
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Una solución completa que integra todos los aspectos administrativos,
              contables y financieros de su conjunto residencial
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-card border border-card-border rounded-lg p-6 hover-elevate"
                data-testid={`feature-${index}`}
              >
                <div className="rounded-lg bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-6 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 Gravi. Todos los derechos reservados.</p>
        </div>
      </footer>

      {/* Login Modal */}
      <Dialog open={showLoginModal} onOpenChange={setShowLoginModal}>
        <DialogContent data-testid="modal-login">
          <DialogHeader>
            <DialogTitle>Iniciar Sesión</DialogTitle>
            <DialogDescription>
              Ingrese sus credenciales y el NIT de la copropiedad para acceder al sistema
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nit-copropiedad">NIT/ID de la Copropiedad</Label>
              <Input
                id="nit-copropiedad"
                placeholder="900123456-7"
                value={formData.nitCopropiedad}
                onChange={(e) =>
                  setFormData({ ...formData, nitCopropiedad: e.target.value })
                }
                required
                data-testid="input-nit-copropiedad"
              />
              <p className="text-xs text-muted-foreground">
                Identificación de la copropiedad a la que desea acceder
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="nit-usuario">NIT/ID Usuario</Label>
              <Input
                id="nit-usuario"
                placeholder="1234567890"
                value={formData.nitUsuario}
                onChange={(e) =>
                  setFormData({ ...formData, nitUsuario: e.target.value })
                }
                required
                data-testid="input-nit-usuario"
              />
              <p className="text-xs text-muted-foreground">
                Su número de identificación personal
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
                data-testid="input-password"
              />
            </div>

            <div className="flex flex-col gap-3 pt-4">
              <Button type="submit" className="w-full" data-testid="button-submit-login">
                Ingresar
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => console.log("Recuperar contraseña")}
                data-testid="button-recuperar-password"
              >
                ¿Olvidó su contraseña?
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}