'use client';

import { useState } from 'react';
import { useDashboardMetrics } from '@/features/dashboard/hooks/useDashboard';
import { useRole } from '@/features/auth/hooks/useRole';
import { DashboardSkeleton } from '@/common/components/ui/skeletons/DashboardSkeleton';
import { DashboardHeader } from '@/features/dashboard/components/DashboardHeader';
import { DashboardKpiGrid } from '@/features/dashboard/components/DashboardKpiGrid';
import { RevenueChart } from '@/features/dashboard/components/RevenueChart';
import { MembersFlowChart } from '@/features/dashboard/components/MembersFlowChart';
import { UpcomingRenewalsCard } from '@/features/dashboard/components/UpcomingRenewalsCard';
import { EyeOff, Lock } from 'lucide-react';

export default function DashboardPage() {
  const { isUser } = useRole();
  const canViewRevenue = !isUser;
  const [selectedPeriod, setSelectedPeriod] = useState('rolling');
  const { data: metrics, isLoading, isError } =
    useDashboardMetrics(selectedPeriod);
  const [isRevenueVisible, setIsRevenueVisible] = useState(true);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (isError || !metrics) {
    return (
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl font-bold text-text-main">Vista General</h1>
        <p className="text-sm text-danger-main">
          Error al cargar las métricas. Intente nuevamente.
        </p>
      </div>
    );
  }

  const periodLabel =
    selectedPeriod === 'rolling' ? '12 meses' : `Año ${selectedPeriod}`;
  const effectiveRevenueVisible = canViewRevenue && isRevenueVisible;

  return (
    <div className="flex flex-col gap-6">
      <DashboardHeader
        selectedPeriod={selectedPeriod}
        onPeriodChange={setSelectedPeriod}
      />

      <DashboardKpiGrid
        metrics={metrics}
        isRevenueVisible={effectiveRevenueVisible}
        onToggleRevenueVisible={() => {
          if (canViewRevenue) {
            setIsRevenueVisible(!isRevenueVisible);
          }
        }}
        canViewRevenue={canViewRevenue}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="relative flex flex-col">
            <div
              className={`${!effectiveRevenueVisible ? 'filter blur-md select-none transition-all duration-300 opacity-50 pointer-events-none' : 'transition-all duration-300'}`}
            >
              <RevenueChart
                data={metrics.revenueTrajectory || []}
                periodLabel={periodLabel}
              />
            </div>
            {!effectiveRevenueVisible && (
              <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                <span className="bg-background/80 border border-border-primary px-4 py-2 rounded-full text-sm font-bold text-text-main flex items-center gap-2 backdrop-blur-md shadow-lg">
                  {!canViewRevenue ? (
                    <>
                      <Lock size={16} /> Acceso Restringido
                    </>
                  ) : (
                    <>
                      <EyeOff size={16} /> Gráfico Oculto
                    </>
                  )}
                </span>
              </div>
            )}
          </div>

          <div className="transition-all duration-300">
            <MembersFlowChart
              data={metrics.membersTrajectory || []}
              statusDistribution={metrics.statusDistribution}
              periodLabel={periodLabel}
            />
          </div>
        </div>

        <UpcomingRenewalsCard renewals={metrics.upcomingRenewals} />
      </div>
    </div>
  );
}


