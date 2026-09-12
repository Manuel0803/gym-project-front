interface BuildRevenueChartOptionsParams {
  data: { month: string; amount: number }[];
  isDark: boolean;
  shouldAnimate: boolean;
}

export function buildRevenueChartOptions({
  data,
  isDark,
  shouldAnimate,
}: BuildRevenueChartOptionsParams) {
  const textColor = isDark ? '#9ca3af' : '#6b7280';
  const splitLineColor = isDark ? '#374151' : '#e5e7eb';

  return {
    animation: shouldAnimate,
    grid: { top: 20, right: 20, bottom: 20, left: 60, containLabel: false },
    tooltip: {
      trigger: 'axis',
      backgroundColor: isDark ? '#1f2937' : '#ffffff',
      borderColor: isDark ? '#374151' : '#e5e7eb',
      textStyle: { color: isDark ? '#f3f4f6' : '#111827' },
      formatter: (
        params:
          | { name: string; value: number }[]
          | { name: string; value: number }
      ) => {
        const val = Array.isArray(params) ? params[0] : params;
        return `<div class="font-bold mb-1">${val.name}</div>
                <div class="flex items-center gap-2">
                  <span class="w-3 h-3 rounded-full bg-brand-main"></span>
                  <span class="font-medium">$${val.value.toLocaleString('es-AR')}</span>
                </div>`;
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
      splitLine: { lineStyle: { color: splitLineColor, type: 'dashed' } },
      axisLabel: {
        color: textColor,
        formatter: (value: number) => {
          if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
          if (value >= 1000) return `$${(value / 1000).toFixed(0)}k`;
          return `$${value}`;
        },
      },
    },
    series: [
      {
        data: data.map((d) => d.amount),
        type: 'line',
        smooth: true,
        showSymbol: false,
        lineStyle: { color: '#10b981', width: 3 },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(16, 185, 129, 0.4)' },
              { offset: 1, color: 'rgba(16, 185, 129, 0.0)' },
            ],
          },
        },
      },
    ],
  };
}
