import { MemberTrajectoryItem, StatusDistribution } from './metrics.interface';

export interface MembersFlowChartProps {
  data: MemberTrajectoryItem[];
  statusDistribution?: StatusDistribution;
  periodLabel?: string;
}

