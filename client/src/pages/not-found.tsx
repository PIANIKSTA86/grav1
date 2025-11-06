import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="text-center space-y-6 p-8">
        <div className="flex justify-center">
          <div className="rounded-full bg-muted p-6">
            <AlertCircle className="h-12 w-12 text-muted-foreground" />
          </div>
        </div>
        <div>
          <h1 className="text-4xl font-bold mb-2">404</h1>
          <h2 className="text-2xl font-semibold mb-2">Página no encontrada</h2>
          <p className="text-muted-foreground max-w-md">
            Lo sentimos, la página que estás buscando no existe o ha sido movida.
          </p>
        </div>
        <Link href="/">
          <Button data-testid="button-volver-inicio">Volver al Inicio</Button>
        </Link>
      </div>
    </div>
  );
}
