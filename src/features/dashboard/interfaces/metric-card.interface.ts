export interface MetricCardProps {
  title: string;
  value: string | number | React.ReactNode;
  icon: React.ReactNode;
  trendText: string;
  trendIcon: React.ReactNode;
  trendColor?: string;
  action?: React.ReactNode;
  badge?: React.ReactNode;
}

