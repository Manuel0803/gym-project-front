'use client';

import { useState, useEffect } from 'react';
import {
  Users,
  Wallet,
  AlertTriangle,
  TrendingUp,
  Clock,
  Calendar,
  Eye,
  EyeOff,
  Lock,
} from 'lucide-react';
import { MetricCard } from './MetricCard';
import { MetricCardProps } from '../interfaces/metric-card.interface';
import { DashboardMetrics } from '../interfaces/metrics.interface';
import { getTrendColor, getTrendText } from '../utils/trends-styles';

interface DashboardKpiGridProps {
  metrics: DashboardMetrics;
  isRevenueVisible: boolean;
  onToggleRevenueVisible: () => void;
  canViewRevenue?: boolean;
}

const renderTrendIcon = (trend?: number) => (
  <TrendingUp
    size={12}
    className={trend && trend < 0 ? 'rotate-180 transform' : ''}
  />
);

export function DashboardKpiGrid({
  metrics,
  isRevenueVisible,
  onToggleRevenueVisible,
  canViewRevenue = true,
}: DashboardKpiGridProps) {
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(
        new Date().toLocaleTimeString('es-ES', {
          hour: '2-digit',
          minute: '2-digit',
        })
      );
    };
    const timer = setTimeout(updateTime, 0);
    const interval = setInterval(updateTime, 60000);
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  const todayStr = new Date().toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  const newToday = metrics.activeMembers.newToday ?? 0;
  const memberTrend = metrics.activeMembers.trend || 0;
  const revenueTrend = metrics.monthlyRevenue.trend || 0;

  const cards: MetricCardProps[] = [
    {
      title: 'Miembros Activos',
      value: metrics.activeMembers.total.toLocaleString('es-AR'),
      icon: <Users size={16} className="text-text-muted" />,
      badge:
        newToday > 0 ? (
          <span
            className="text-xs font-semibold text-success-main tracking-tight"
            title="Miembros registrados hoy"
          >
            +{newToday} hoy
          </span>
        ) : null,
      trendText: getTrendText(memberTrend, 'este mes'),
      trendIcon: renderTrendIcon(memberTrend),
      trendColor: getTrendColor(memberTrend),
    },
    {
      title: 'Ingresos Mensuales',
      value: isRevenueVisible
        ? `$${metrics.monthlyRevenue.total.toLocaleString('es-AR')}`
        : '****',
      icon: <Wallet size={16} className="text-brand-main transition-colors" />,
      trendText: canViewRevenue
        ? getTrendText(revenueTrend, 'vs último mes')
        : 'Restringido',
      trendIcon: canViewRevenue ? renderTrendIcon(revenueTrend) : undefined,
      trendColor: canViewRevenue
        ? getTrendColor(revenueTrend)
        : 'text-text-muted',
      action: canViewRevenue ? (
        <button
          onClick={onToggleRevenueVisible}
          className="text-text-muted hover:text-text-main transition-colors ml-2 cursor-pointer"
          title={isRevenueVisible ? 'Ocultar ingresos' : 'Mostrar ingresos'}
        >
          {isRevenueVisible ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>
      ) : (
        <span
          className="text-text-muted ml-2 cursor-not-allowed"
          title="Visualización bloqueada para tu rol"
        >
          <Lock size={14} />
        </span>
      ),
    },
    {
      title: 'Cuentas Vencidas',
      value: metrics.overdueAccounts.total.toLocaleString('es-AR'),
      icon: (
        <AlertTriangle
          size={16}
          className="text-danger-main transition-colors"
        />
      ),
      trendText: 'Requieren atención',
      trendIcon: <AlertTriangle size={12} />,
      trendColor: 'text-danger-main',
    },
    {
      title: 'Fecha de Hoy',
      value: todayStr,
      icon: (
        <Calendar size={16} className="text-brand-main transition-colors" />
      ),
      trendText: currentTime || 'Calculando...',
      trendIcon: <Clock size={12} />,
      trendColor: 'text-text-muted',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <MetricCard key={card.title} {...card} />
      ))}
    </div>
  );
}

