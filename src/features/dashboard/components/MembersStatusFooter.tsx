import { StatusDistribution } from '../interfaces/metrics.interface';

interface MembersStatusFooterProps {
  distribution: StatusDistribution;
}

export function MembersStatusFooter({
  distribution,
}: MembersStatusFooterProps) {
  return (
    <div className="mt-4 pt-3 border-t border-border-primary flex flex-wrap items-center justify-between gap-2 text-xs text-text-muted">
      <div className="flex items-center gap-2">
        <span className="font-semibold text-text-main">
          Estado actual del gimnasio:
        </span>
      </div>
      <div className="flex items-center gap-4">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-success-main"></span>
          <strong className="text-text-main">{distribution.active}</strong>{' '}
          Activos
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-warning-main"></span>
          <strong className="text-text-main">{distribution.suspended}</strong>{' '}
          Vencidos / Suspendidos
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-text-muted"></span>
          <strong className="text-text-main">{distribution.inactive}</strong>{' '}
          Inactivos
        </span>
      </div>
    </div>
  );
}
