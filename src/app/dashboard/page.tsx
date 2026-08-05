'use client';

import { useState } from 'react';
import { useDashboardMetrics } from '@/features/dashboard/hooks/useDashboard';
import { DashboardSkeleton } from '@/common/components/ui/skeletons/DashboardSkeleton';
import { MetricCard } from '@/features/dashboard/components/MetricCard';
import { RevenueChart } from '@/features/dashboard/components/RevenueChart';
import { CurrentDateCard } from '@/features/dashboard/components/CurrentDateCard';
import { UpcomingRenewalsCard } from '@/features/dashboard/components/UpcomingRenewalsCard';
import { getTrendColor, getTrendText } from '@/features/dashboard/utils/trends-styles';
import { Users, Wallet, AlertTriangle, TrendingUp, Eye, EyeOff } from 'lucide-react';

export default function DashboardPage() {
  const { data: metrics, isLoading, isError } = useDashboardMetrics();
  const [isRevenueVisible, setIsRevenueVisible] = useState(true);

  if (isLoading) return <DashboardSkeleton />;

  if (isError || !metrics) {
    return (
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl font-bold text-text-main">Vista General</h1>
        <p className="text-sm text-danger-main">Error al cargar las métricas. Intente nuevamente.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-main tracking-wide">Vista General</h1>
          <p className="text-sm text-text-muted mt-1">Métricas en tiempo real</p>
        </div>
        <div className="px-3 py-1 bg-brand-surface border border-brand-main/20 rounded text-brand-main text-xs font-bold tracking-widest flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-brand-main animate-pulse"></span>
          DATOS EN VIVO
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Miembros Activos"
          value={metrics.activeMembers.total.toLocaleString('es-AR')}
          icon={<Users size={16} className="text-text-muted" />}
          trendText={getTrendText(metrics.activeMembers.trend || 0, 'en altas vs mes anterior')}
          trendIcon={<TrendingUp size={12} className={metrics.activeMembers.trend && metrics.activeMembers.trend < 0 ? 'rotate-180 transform' : ''} />}
          trendColor={getTrendColor(metrics.activeMembers.trend || 0)}
        />

        <MetricCard
          title="Ingresos Mensuales"
          value={isRevenueVisible ? `$${metrics.monthlyRevenue.total.toLocaleString('es-AR')}` : '****'}
          icon={<Wallet size={16} className="text-brand-main" />}
          trendText={getTrendText(metrics.monthlyRevenue.trend || 0, 'vs último mes')}
          trendIcon={<TrendingUp size={12} className={metrics.monthlyRevenue.trend && metrics.monthlyRevenue.trend < 0 ? 'rotate-180 transform' : ''} />}
          trendColor={getTrendColor(metrics.monthlyRevenue.trend || 0)}
          action={
            <button onClick={() => setIsRevenueVisible(!isRevenueVisible)} className="text-text-muted hover:text-text-main ml-2 cursor-pointer">
              {isRevenueVisible ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          }
        />

        <MetricCard
          title="Cuentas Vencidas"
          value={metrics.overdueAccounts.total.toLocaleString('es-AR')}
          icon={<AlertTriangle size={16} className="text-danger-main" />}
          trendText="Requieren atención"
          trendIcon={<AlertTriangle size={12} />}
          trendColor="text-danger-main"
        />

        <CurrentDateCard />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 relative flex flex-col h-full">
          <div className={`flex-1 h-full transition-all duration-300 ${!isRevenueVisible ? 'filter blur-md select-none opacity-50 pointer-events-none' : ''}`}>
            <RevenueChart data={metrics.revenueTrajectory || []} />
          </div>
          {!isRevenueVisible && (
            <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
              <span className="bg-background/80 border border-border-primary px-4 py-2 rounded-full text-sm font-bold text-text-main flex items-center gap-2 backdrop-blur-md shadow-lg">
                <EyeOff size={16} /> Gráfico Oculto
              </span>
            </div>
          )}
        </div>

        <UpcomingRenewalsCard renewals={metrics.upcomingRenewals} />
      </div>
    </div>
  );
}
