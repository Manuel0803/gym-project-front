'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import ReactECharts from 'echarts-for-react';
import { RevenueChartProps } from '../interfaces/revenue-chart.interface';
import { buildRevenueChartOptions } from '../utils/revenue-chart-options';

let hasAnimated = false;

export function RevenueChart({
  data,
  periodLabel = '12 meses',
}: RevenueChartProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [shouldAnimate] = useState(!hasAnimated);

  useEffect(() => {
    hasAnimated = true;
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) return null;

  const option = buildRevenueChartOptions({
    data,
    isDark: theme === 'dark',
    shouldAnimate,
  });

  return (
    <div className="bg-surface border border-border-primary rounded-xl p-6 h-full flex flex-col">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-text-main">
          Trayectoria de Ingresos
        </h3>
        <p className="text-sm text-text-muted">
          Evolución de recaudación ({periodLabel})
        </p>
      </div>
      <div className="h-75 w-full mt-4">
        <ReactECharts
          option={option}
          style={{ height: '300px', width: '100%' }}
          notMerge={true}
          lazyUpdate={true}
        />
      </div>
    </div>
  );
}

