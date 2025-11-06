import { EmptyState } from '../empty-state';
import { Package } from 'lucide-react';

export default function EmptyStateExample() {
  return (
    <EmptyState
      icon={Package}
      title="No hay unidades registradas"
      description="Comience registrando la primera unidad de la copropiedad para gestionar propietarios e inquilinos."
      actionLabel="Registrar Unidad"
      onAction={() => console.log("Registrar unidad")}
      testId="empty-unidades"
    />
  );
}