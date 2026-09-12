import Link from 'next/link';
import { RenewalItemProps } from '../interfaces/metrics.interface';

export function RenewalItem({
  id,
  initials,
  name,
  plan,
  daysText,
  isUrgent = false,
  hasBorder = true,
}: RenewalItemProps & { id: string }) {
  const borderClass = hasBorder ? 'border-b border-border-primary' : '';
  const daysColorClass = isUrgent ? 'text-danger-main' : 'text-text-muted';

  return (
    <Link
      href={`/dashboard/miembros/${id}`}
      className={`flex items-center justify-between px-5 py-4 hover:bg-surface-hover transition-colors cursor-pointer w-full ${borderClass}`}
    >
      <div className="flex items-center gap-3">
        <div className="w-7 h-7 rounded-full bg-background border border-border-primary flex items-center justify-center text-xs font-medium text-text-muted transition-colors">
          {initials}
        </div>
        <span className="text-sm text-text-main transition-colors">{name}</span>
      </div>
      <div className="flex gap-2 text-sm">
        <span className="text-text-muted transition-colors">{plan}</span>
        <span className={`${daysColorClass} font-medium transition-colors`}>
          {daysText}
        </span>
      </div>
    </Link>
  );
}
