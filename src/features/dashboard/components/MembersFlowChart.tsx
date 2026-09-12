'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import ReactECharts from 'echarts-for-react';
import { MembersFlowChartProps } from '../interfaces/members-chart.interface';
import { buildMembersChartOptions } from '../utils/members-chart-options';
import { MembersFlowHeader } from './MembersFlowHeader';
import { MembersStatusFooter } from './MembersStatusFooter';

let hasAnimated = false;

export function MembersFlowChart({
  data = [],
  statusDistribution,
  periodLabel = '12 meses',
}: MembersFlowChartProps) {
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

  const isDark = theme === 'dark';
  const totalNew = data.reduce((acc, curr) => acc + (curr.newMembers || 0), 0);
  const totalChurn = data.reduce(
    (acc, curr) => acc + (curr.churnedMembers || 0),
    0
  );
  const netGrowth = totalNew - totalChurn;

  const option = buildMembersChartOptions({
    data,
    isDark,
    shouldAnimate,
  });

  const handleLegendSelectChanged = (
    params: { name: string; selected: Record<string, boolean> },
    instance?: {
      dispatchAction: (action: { type: string; name: string }) => void;
    }
  ) => {
    const isAllUnselected =
      !params.selected['Nuevas Altas'] && !params.selected['Bajas'];

    if (isAllUnselected && instance) {
      instance.dispatchAction({
        type: 'legendSelect',
        name: params.name,
      });
    }
  };

  return (
    <div className="bg-surface border border-border-primary rounded-xl p-6 h-full flex flex-col transition-colors">
      <MembersFlowHeader
        totalNew={totalNew}
        totalChurn={totalChurn}
        netGrowth={netGrowth}
        periodLabel={periodLabel}
      />

      <div className="h-75 w-full mt-2">
        <ReactECharts
          option={option}
          style={{ height: '300px', width: '100%' }}
          notMerge={true}
          lazyUpdate={true}
          onEvents={{
            legendselectchanged: handleLegendSelectChanged,
          }}
        />
      </div>

      {statusDistribution && (
        <MembersStatusFooter distribution={statusDistribution} />
      )}
    </div>
  );
}

