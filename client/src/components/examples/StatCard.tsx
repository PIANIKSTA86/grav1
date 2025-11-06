import { StatCard } from '../stat-card';
import { Building2 } from 'lucide-react';

export default function StatCardExample() {
  return (
    <div className="p-4 max-w-xs">
      <StatCard
        title="Total Unidades"
        value="125"
        icon={Building2}
        trend={{ value: "+5 este mes", isPositive: true }}
        testId="stat-unidades"
      />
    </div>
  );
}