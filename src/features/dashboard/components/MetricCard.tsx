import { MetricCardProps } from '../interfaces/metric-card.interface';

export function MetricCard({
  title,
  value,
  icon,
  trendText,
  trendIcon,
  trendColor = 'text-brand-main',
  action,
  badge,
}: MetricCardProps) {
  return (
    <div className="bg-surface rounded-lg p-5 border border-border-primary transition-colors">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-text-muted tracking-wider uppercase">
            {title}
          </span>
          {action}
        </div>
        {icon}
      </div>
      <div className="text-3xl font-bold text-text-main transition-colors">
        {value}
      </div>
      <div className="flex items-center justify-between mt-2 text-xs transition-colors">
        <div className={`flex items-center gap-1 ${trendColor}`}>
          {trendIcon}
          <span>{trendText}</span>
        </div>
        {badge}
      </div>
    </div>
  );
}
