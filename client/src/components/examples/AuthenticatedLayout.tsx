import { AuthenticatedLayout } from '../authenticated-layout';

export default function AuthenticatedLayoutExample() {
  return (
    <AuthenticatedLayout>
      <div className="space-y-4">
        <h1 className="text-3xl font-semibold">Contenido de Ejemplo</h1>
        <p className="text-muted-foreground">
          Este es el layout autenticado con sidebar y header.
        </p>
      </div>
    </AuthenticatedLayout>
  );
}