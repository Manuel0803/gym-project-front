'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowLeft, ArrowRightLeft, Award, Loader2, RefreshCw } from 'lucide-react';
import { useMember } from '@/features/members/hooks/useMembers';
import { usePlans } from '@/features/plans/hooks/usePlans';
import { PaymentHistoryTable } from '@/features/payments/components/PaymentHistoryTable';
import { MemberProfileCard } from '@/features/members/components/MemberProfileCard';
import { ChangePlanModal } from '@/features/members/components/ChangePlanModal';
import { RenewPlanModal } from '@/features/members/components/RenewPlanModal';
import { STATUS_TRANSLATIONS, STATUS_STYLES } from '@/features/members/constants/member-styles-ui.constants';
import { MemberDetailClientProps } from '../interfaces/members.interface';

export function MemberDetailClient({ id }: MemberDetailClientProps) {
  const { data: member, isLoading, isError } = useMember(id);
  const { data: plans } = usePlans();

  const [isRenewModalOpen, setIsRenewModalOpen] = useState(false);
  const [isChangePlanModalOpen, setIsChangePlanModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 w-full bg-surface border border-border-primary rounded-lg">
        <Loader2 className="w-8 h-8 text-brand-main animate-spin mb-4" />
        <p className="text-text-muted text-sm">Cargando perfil del miembro...</p>
      </div>
    );
  }

  if (isError || !member) {
    return (
      <div className="flex flex-col items-center justify-center h-64 w-full bg-surface border border-danger-main/20 rounded-lg">
        <p className="text-text-main text-sm">Error al cargar el perfil o el miembro no existe.</p>
        <Link href="/dashboard/miembros" className="mt-4 text-brand-main hover:underline text-sm">
          Volver a la lista
        </Link>
      </div>
    );
  }

  const now = new Date();
  const nowMs = now.getTime();
  
  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);

  const endOfToday = new Date(now);
  endOfToday.setHours(23, 59, 59, 999);

  const activeSubscription =
    member.subscriptions?.find(
      (sub) => sub.status === 'ACTIVE' && new Date(sub.startDate) <= endOfToday && new Date(sub.endDate) > startOfToday
    ) ||
    member.subscriptions?.find(
      (sub) => sub.status === 'ACTIVE' && new Date(sub.endDate) > startOfToday
    );

  const futureSubscriptions =
    member.subscriptions
      ?.filter((sub) => sub.status === 'ACTIVE' && new Date(sub.startDate) > endOfToday)
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()) || [];

  const planName = activeSubscription?.plan?.name || 'Sin plan asignado';
  const isCurrentPlanActive = activeSubscription?.plan?.isActive !== false;
  
  let dynamicState = member.state || 'INACTIVE';
  if (dynamicState === 'ACTIVE' && !activeSubscription) {
    dynamicState = 'SUSPENDED';
  }

  let daysRemaining = 0;
  let progressPercentage = 0;
  let nextDueDate = '-';

  if (activeSubscription) {
    const end = new Date(activeSubscription.endDate);
    const start = new Date(activeSubscription.startDate);
    const totalDuration = end.getTime() - start.getTime();
    const elapsed = nowMs - start.getTime();

    daysRemaining = Math.max(0, Math.ceil((end.getTime() - nowMs) / (1000 * 60 * 60 * 24)));
    progressPercentage = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
    nextDueDate = end.toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  return (
    <section>
      <Link href="/dashboard/miembros" className="flex text-text-muted uppercase text-xs font-bold items-center gap-1 mb-4 hover:text-text-main transition-colors">
        <ArrowLeft size={16} />
        <span>Volver a la lista de miembros</span>
      </Link>

      <div className="flex justify-between items-center border-b-2 border-border-primary pb-4 mb-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl text-text-main font-bold">
            {member.name} {member.surname}
          </h1>
          <p className="text-sm text-text-muted">DNI: {member.dni}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start max-w-7xl mx-auto p-4">
        <MemberProfileCard 
          member={member} 
          displayStatus={STATUS_TRANSLATIONS[dynamicState] || dynamicState} 
          safeStatusStyles={STATUS_STYLES[dynamicState] || STATUS_STYLES['INACTIVE']} 
          defaultAmount={activeSubscription?.plan?.price ? Number(activeSubscription.plan.price) : 0} 
        />

        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-surface border border-border-primary rounded-lg p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors">
            <div className="flex flex-col gap-1">
              <span className="text-xs text-text-muted font-bold uppercase tracking-wider">Plan Actual</span>
              <div className="flex items-center gap-2 mt-1">
                <h3 className="text-2xl font-bold text-text-main">{planName}</h3>
                <Award size={20} className="text-brand-main" />
              </div>
            </div>

            <div className="flex items-center gap-2 mt-4 sm:mt-0">
              <button
                onClick={() => setIsChangePlanModalOpen(true)}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-md font-bold text-sm bg-surface-hover border border-border-primary text-text-main hover:bg-surface transition-all active:scale-95 shadow-sm cursor-pointer"
                title="Cambiar a un plan diferente"
              >
                <ArrowRightLeft size={16} />
                Cambiar Plan
              </button>

              {activeSubscription && (
                <button
                  onClick={() => setIsRenewModalOpen(true)}
                  disabled={futureSubscriptions.length >= 2 || !isCurrentPlanActive}
                  className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-md font-bold text-sm transition-all ${
                    !isCurrentPlanActive || futureSubscriptions.length >= 2
                      ? 'bg-surface-hover text-text-muted cursor-not-allowed border border-border-primary'
                      : 'bg-brand-main text-white hover:bg-opacity-90 shadow-sm active:scale-95 cursor-pointer'
                  }`}
                  title={
                    !isCurrentPlanActive
                      ? 'Este plan ya no se comercializa. Usa "Cambiar Plan".'
                      : futureSubscriptions.length >= 2
                      ? 'Límite máximo de planes programados'
                      : 'Renovar y apilar mes'
                  }
                >
                  <RefreshCw size={16} />
                  Renovar
                </button>
              )}
            </div>
          </div>

          {futureSubscriptions.length > 0 && (
            <div className="bg-surface border border-border-primary rounded-lg p-6 flex flex-col gap-4 transition-colors">
              <span className="text-xs text-text-muted font-bold uppercase tracking-wider">Planes Programados ({futureSubscriptions.length})</span>
              <div className="flex flex-col gap-3 mt-1">
                {futureSubscriptions.map((sub) => (
                  <div key={sub.uuid} className="flex justify-between items-center p-3 bg-background border border-border-primary rounded-md">
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-bold text-text-main">{sub.plan?.name || 'Plan desconocido'}</span>
                      <span className="text-xs text-text-muted">Inicia: {new Date(sub.startDate).toLocaleDateString('es-ES')}</span>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-brand-main/10 text-brand-main rounded-sm">EN ESPERA</span>
                      <span className="text-xs text-text-muted">Vence: {new Date(sub.endDate).toLocaleDateString('es-ES')}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-surface border border-border-primary rounded-lg p-6 flex flex-col justify-center gap-4 transition-colors">
              <div className="flex justify-between items-end">
                <span className="text-xs text-text-muted font-bold uppercase tracking-wider">Tiempo Restante</span>
                <span className="text-sm text-text-main font-bold">{daysRemaining > 0 ? `${daysRemaining} días` : '-'}</span>
              </div>
              <div className="w-full bg-border-primary h-2 rounded-full overflow-hidden">
                <div className="bg-brand-main h-full rounded-full transition-all duration-500" style={{ width: `${progressPercentage}%` }}></div>
              </div>
            </div>

            <div className="bg-surface border border-border-primary rounded-lg p-6 flex flex-col justify-center gap-2 transition-colors">
              <span className="text-xs text-text-muted font-bold uppercase tracking-wider">Próximo Vencimiento</span>
              <span className="text-xl font-bold text-text-main">{nextDueDate}</span>
            </div>
          </div>

          <PaymentHistoryTable memberUuid={member.uuid} />
        </div>
      </div>

      {activeSubscription && (
        <RenewPlanModal 
          isOpen={isRenewModalOpen} 
          onClose={() => setIsRenewModalOpen(false)} 
          member={member} 
          planName={planName} 
          planDuration={activeSubscription.plan?.durationDays || 30} 
          planUuid={activeSubscription.planUuid} 
          defaultAmount={Number(activeSubscription.plan?.price || 0)} 
        />
      )}

      <ChangePlanModal 
        isOpen={isChangePlanModalOpen}
        onClose={() => setIsChangePlanModalOpen(false)}
        memberUuid={member.uuid}
        hasActiveSubscription={!!activeSubscription}
        nextDueDate={nextDueDate}
        plans={plans?.data || []} 
      />
    </section>
  );
}
