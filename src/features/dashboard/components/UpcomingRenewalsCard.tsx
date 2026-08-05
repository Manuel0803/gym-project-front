import { RenewalItem } from './RenewalItem';
import { UpcomingRenewal } from '../interfaces/metrics.interface';

interface Props {
  renewals: UpcomingRenewal[];
}

export function UpcomingRenewalsCard({ renewals }: Props) {
  return (
    <div className="bg-surface border border-border-primary rounded-lg flex flex-col transition-colors overflow-hidden h-full">
      <div className="flex items-center justify-between p-5 border-b border-border-primary">
        <h2 className="text-sm font-bold text-text-main transition-colors">
          Próximos Vencimientos (5 días)
        </h2>
        <div className="text-xs font-bold text-brand-main bg-brand-surface px-2 py-0.5 rounded">
          {renewals.length}
        </div>
      </div>

      <div className="flex-1 p-0 overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-3 border-b border-border-primary text-[10px] font-bold text-text-muted tracking-widest uppercase sticky top-0 bg-surface z-10">
          <span>Miembro</span>
          <span>Plan</span>
        </div>

        <div className="flex flex-col">
          {renewals.length === 0 ? (
            <div className="p-6 text-center text-sm text-text-muted">
              No hay vencimientos próximos.
            </div>
          ) : (
            renewals.map((renewal, index) => (
              <RenewalItem
                key={renewal.id}
                initials={renewal.initials}
                name={renewal.name}
                plan={renewal.plan}
                daysText={`${renewal.daysLeft}d`}
                isUrgent={renewal.isUrgent}
                hasBorder={index !== renewals.length - 1}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
