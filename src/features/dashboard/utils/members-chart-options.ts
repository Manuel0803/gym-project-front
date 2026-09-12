import { MemberTrajectoryItem } from '../interfaces/metrics.interface';

interface BuildMembersChartOptionsParams {
  data: MemberTrajectoryItem[];
  isDark: boolean;
  shouldAnimate: boolean;
}

interface TooltipParamItem {
  name: string;
  seriesName: string;
  value: number;
}

const createSeries = (
  name: string,
  color: string,
  rgb: string,
  values: number[]
) => ({
  name,
  type: 'line' as const,
  smooth: true,
  showSymbol: false,
  data: values,
  lineStyle: { color, width: 3 },
  areaStyle: {
    color: {
      type: 'linear' as const,
      x: 0,
      y: 0,
      x2: 0,
      y2: 1,
      colorStops: [
        { offset: 0, color: `rgba(${rgb}, 0.35)` },
        { offset: 1, color: `rgba(${rgb}, 0)` },
      ],
    },
  },
});

export function buildMembersChartOptions({
  data,
  isDark,
  shouldAnimate,
}: BuildMembersChartOptionsParams) {
  const textColor = isDark ? '#9ca3af' : '#6b7280';
  const splitLineColor = isDark ? '#374151' : '#e5e7eb';

  return {
    animation: shouldAnimate,
    grid: { top: 35, right: 20, bottom: 25, left: 45, containLabel: false },
    legend: {
      show: true,
      top: 0,
      right: 10,
      textStyle: { color: textColor, fontSize: 12 },
      itemWidth: 12,
      itemHeight: 12,
      data: ['Nuevas Altas', 'Bajas'],
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: isDark ? '#1f2937' : '#ffffff',
      borderColor: isDark ? '#374151' : '#e5e7eb',
      textStyle: { color: isDark ? '#f3f4f6' : '#111827' },
      axisPointer: {
        type: 'line',
        lineStyle: { color: isDark ? '#4b5563' : '#d1d5db', type: 'dashed' },
      },
      formatter: (params: TooltipParamItem[] | TooltipParamItem) => {
        const items = Array.isArray(params) ? params : [params];
        const monthName = items[0]?.name || '';
        let newCount = 0;
        let churnCount = 0;

        for (const item of items) {
          if (item.seriesName === 'Nuevas Altas') newCount = item.value || 0;
          if (item.seriesName === 'Bajas') churnCount = item.value || 0;
        }

        const net = newCount - churnCount;
        const netSign = net > 0 ? `+${net}` : `${net}`;
        const netColor =
          net > 0
            ? 'text-success-main'
            : net < 0
              ? 'text-danger-main'
              : 'text-text-muted';

        return `
          <div class="font-bold mb-2 pb-1 border-b border-border-primary">${monthName}</div>
          <div class="flex items-center justify-between gap-4 mb-1">
            <div class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-success-main"></span><span class="text-xs">Altas:</span></div>
            <span class="font-bold text-xs text-success-main">+${newCount}</span>
          </div>
          <div class="flex items-center justify-between gap-4 mb-2">
            <div class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-danger-main"></span><span class="text-xs">Bajas:</span></div>
            <span class="font-bold text-xs text-danger-main">-${churnCount}</span>
          </div>
          <div class="flex items-center justify-between gap-4 pt-1.5 border-t border-border-primary text-xs">
            <span class="font-medium text-text-muted">Balance neto:</span>
            <span class="font-bold ${netColor}">${netSign}</span>
          </div>
        `;
      },
    },
    xAxis: {
      type: 'category',
      data: data.map((d) => d.month),
      boundaryGap: false,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        color: textColor,
        margin: 16,
        fontSize: 12,
        fontWeight: 500,
      },
    },
    yAxis: {
      type: 'value',
      minInterval: 1,
      splitLine: { lineStyle: { color: splitLineColor, type: 'dashed' } },
      axisLabel: { color: textColor, fontSize: 11 },
    },
    series: [
      createSeries(
        'Nuevas Altas',
        '#10b981',
        '16, 185, 129',
        data.map((d) => d.newMembers)
      ),
      createSeries(
        'Bajas',
        '#ef4444',
        '239, 68, 68',
        data.map((d) => d.churnedMembers)
      ),
    ],
  };
}

