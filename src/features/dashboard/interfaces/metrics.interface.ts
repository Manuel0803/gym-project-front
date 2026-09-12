export interface MetricValue {
  total: number;
  trend?: number;
  newToday?: number;
  newThisMonth?: number;
}

export interface MemberTrajectoryItem {
  month: string;
  newMembers: number;
  churnedMembers: number;
}

export interface StatusDistribution {
  active: number;
  suspended: number;
  inactive: number;
}

export interface UpcomingRenewal {
  id: string;
  initials: string;
  name: string;
  plan: string;
  daysLeft: number;
  isUrgent: boolean;
}

export interface RenewalItemProps {
  initials: string;
  name: string;
  plan: string;
  daysText: string;
  isUrgent?: boolean;
  hasBorder?: boolean;
}

export interface DashboardMetrics {
  activeMembers: MetricValue;
  monthlyRevenue: MetricValue;
  overdueAccounts: MetricValue;
  statusDistribution?: StatusDistribution;
  upcomingRenewals: UpcomingRenewal[];
  revenueTrajectory: { month: string; amount: number }[];
  membersTrajectory?: MemberTrajectoryItem[];
}

