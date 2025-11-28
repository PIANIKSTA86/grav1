// hooks/use-plan-cuentas.ts
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';

export interface Cuenta {
  id: string;
  suscriptorId: string;
  esPlantilla: boolean;
  codigo: string;
  nombre: string;
  tipo: string;
  naturaleza: string | null;
  nivel: number;
  categoriaNivel: string | null;
  ruta: string | null;
  rutaCodigo: string | null;
  padreId: string | null;
  registraTercero: boolean;
  requiereCentroCosto: boolean;
  requierePresupuesto: boolean;
  niifCategoriaId: string | null;
  pucCategoriaId: string | null;
  activo: boolean;
  fechaCreacion: string;
  fechaActualizacion: string;
  hijos?: Cuenta[];
}

interface UsePlanCuentasReturn {
  cuentas: Cuenta[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function usePlanCuentas(): UsePlanCuentasReturn {
  const { suscriptor } = useAuth();
  const [cuentas, setCuentas] = useState<Cuenta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlanCuentas = async () => {
    if (!suscriptor?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/plan-cuentas/${suscriptor.id}/jerarquia?t=${Date.now()}`);

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.success) {
        setCuentas(data.data || []);
      } else {
        throw new Error(data.message || 'Error al obtener el plan de cuentas');
      }
    } catch (err) {
      console.error('Error fetching plan de cuentas:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
      setCuentas([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlanCuentas();
  }, [suscriptor?.id]);

  return {
    cuentas,
    loading,
    error,
    refetch: fetchPlanCuentas
  };
}