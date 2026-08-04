'use client';

import Link from 'next/link';
import { ArrowLeft, ArrowRightLeft, Award, Loader2, RefreshCw } from 'lucide-react';
import { useMember } from '@/features/members/hooks/useMembers';
import { PaymentHistoryTable } from '@/features/payments/components/PaymentHistoryTable';
import { MemberProfileCard } from '@/features/members/components/MemberProfileCard';
import { use, useState } from 'react';
import toast from 'react-hot-toast';
import { Modal } from '@/common/components/ui/Modal';
import { MembersService } from '@/features/members/services/members.service';
import { useQueryClient } from '@tanstack/react-query';
import { usePlans } from '@/features/plans/hooks/usePlans';

export default function MemberDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: member, isLoading, isError } = useMember(id);
  const { data: plans } = usePlans();

  const [isRenewModalOpen, setIsRenewModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string>('CASH');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isChangePlanModalOpen, setIsChangePlanModalOpen] = useState(false);
  const [selectedNewPlanUuid, setSelectedNewPlanUuid] = useState<string>('');
  const [activationType, setActivationType] = useState<'IMMEDIATE' | 'SCHEDULED'>('SCHEDULED');
  const [changePlanPaymentMethod, setChangePlanPaymentMethod] = useState<string>('CASH');

  const queryClient = useQueryClient();

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

  const activeSubscription =
    member.subscriptions?.find(
      (sub) => sub.status === 'ACTIVE' && new Date(sub.startDate) <= now
    ) ||
    member.subscriptions?.find((sub) => sub.status === 'ACTIVE');

  const futureSubscriptions =
    member.subscriptions
      ?.filter((sub) => sub.status === 'ACTIVE' && new Date(sub.startDate) > now)
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()) || [];

  const planName = activeSubscription?.plan?.name || 'Sin plan asignado';

  let daysRemaining = 0;
  let progressPercentage = 0;
  let nextDueDate = '-';

  if (activeSubscription) {
    const end = new Date(activeSubscription.endDate);
    const start = new Date(activeSubscription.startDate);

    const totalDuration = end.getTime() - start.getTime();
    const elapsed = now.getTime() - start.getTime();

    daysRemaining = Math.max(0, Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
    progressPercentage = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
    nextDueDate = end.toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  const paymentHistory = member.payments || [];

  const statusTranslations: Record<string, string> = { ACTIVE: 'ACTIVO', INACTIVE: 'INACTIVO', SUSPENDED: 'SUSPENDIDO' };
  const statusStyles: Record<string, string> = {
    ACTIVE: 'border-success-main/30 bg-success-surface text-success-main',
    INACTIVE: 'border-border-primary bg-surface-hover text-text-muted',
    SUSPENDED: 'border-warning-main/30 bg-warning-surface text-warning-main',
  };

  const memberState = member.state || 'INACTIVE';
  const displayStatus = statusTranslations[memberState] || memberState;
  const safeStatusStyles = statusStyles[memberState] || statusStyles['INACTIVE'];
  const defaultAmount = activeSubscription?.plan?.price ? Number(activeSubscription.plan.price) : 0;
  const planDuration = activeSubscription?.plan?.durationDays || 30;

  const handleRenewPlan = async () => {
    if (!activeSubscription?.planUuid) return;

    setIsSubmitting(true);
    try {
      await MembersService.renewPlan(member.uuid, {
        planUuid: activeSubscription.planUuid,
        paymentMethod: paymentMethod,
      });

      setIsRenewModalOpen(false);
      toast.success('¡Plan renovado y pago registrado con éxito!');
      queryClient.invalidateQueries({ queryKey: ['member', member.uuid] });

    } catch (error: any) {
      console.error(error);
      const errorMessage = error.response?.data?.message || 'Hubo un error al renovar el plan';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChangePlan = async () => {
    if (!selectedNewPlanUuid) {
      toast.error('Por favor, selecciona un nuevo plan.');
      return;
    }

    setIsSubmitting(true);
    try {
      await MembersService.changePlan(member.uuid, {
        newPlanUuid: selectedNewPlanUuid,
        paymentMethod: changePlanPaymentMethod,
        activationType: activationType,
      });

      setIsChangePlanModalOpen(false);
      toast.success('¡Plan modificado y pago registrado con éxito!');
      queryClient.invalidateQueries({ queryKey: ['member', member.uuid] });

    } catch (error: any) {
      console.error(error);
      const errorMessage = error.response?.data?.message || 'Hubo un error al cambiar el plan';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

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
        <MemberProfileCard member={member} displayStatus={displayStatus} safeStatusStyles={safeStatusStyles} defaultAmount={defaultAmount} />

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
                onClick={() => {
                  setActivationType(activeSubscription ? 'SCHEDULED' : 'IMMEDIATE');
                  setIsChangePlanModalOpen(true);
                }}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-md font-bold text-sm bg-surface-hover border border-border-primary text-text-main hover:bg-surface transition-all active:scale-95 shadow-sm cursor-pointer"
                title="Cambiar a un plan diferente"
              >
                <ArrowRightLeft size={16} />
                Cambiar Plan
              </button>

              {activeSubscription && (
                <button
                  onClick={() => setIsRenewModalOpen(true)}
                  disabled={futureSubscriptions.length >= 2}
                  className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-md font-bold text-sm transition-all hover:bg-brand-hover cursor-pointer ${
                    futureSubscriptions.length >= 2
                      ? 'bg-surface-hover text-text-muted cursor-not-allowed border border-border-primary'
                      : 'bg-brand-main text-white hover:bg-opacity-90 shadow-sm active:scale-95'
                  }`}
                  title={futureSubscriptions.length >= 2 ? 'Límite máximo de planes' : 'Renovar y apilar mes'}
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

      <Modal isOpen={isRenewModalOpen} onClose={() => !isSubmitting && setIsRenewModalOpen(false)} title="Renovar Plan">
        <div className="flex flex-col gap-4">
          <p className="text-sm text-text-muted">
            Estás por registrar un pago para renovar el plan actual. Se sumarán <strong>{planDuration} días</strong> adicionales a la suscripción de <strong>{member.name}</strong>.
          </p>

          <div className="bg-surface-hover border border-border-primary rounded-lg p-4 flex justify-between items-center">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-text-muted uppercase">Plan a renovar</span>
              <span className="font-bold text-text-main">{planName}</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-xs font-bold text-text-muted uppercase">A cobrar</span>
              <span className="text-xl font-bold text-brand-main">${defaultAmount.toLocaleString('es-AR')}</span>
            </div>
          </div>

          <div className="flex flex-col gap-2 mt-2">
            <label className="text-sm font-bold text-text-main">Método de Pago</label>
            <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} disabled={isSubmitting} className="w-full bg-background border border-border-primary text-text-main text-sm rounded-md focus:ring-brand-main focus:border-brand-main block p-2.5 outline-none transition-colors disabled:opacity-50">
              <option value="CASH">Efectivo</option>
              <option value="DEBIT_CARD">Tarjeta de Débito</option>
              <option value="CREDIT_CARD">Tarjeta de Crédito</option>
              <option value="BANK_TRANSFER">Transferencia Bancaria</option>
              <option value="MERCADO_PAGO">Mercado Pago</option>
              <option value="OTHER">Otro</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button onClick={() => setIsRenewModalOpen(false)} disabled={isSubmitting} className="px-4 py-2 text-sm font-bold text-text-muted hover:text-text-main transition-colors disabled:opacity-50 cursor-pointer">Cancelar</button>
            <button onClick={handleRenewPlan} disabled={isSubmitting} className="flex items-center justify-center gap-2 px-6 py-2 bg-brand-main text-white text-sm font-bold rounded-md hover:bg-opacity-90 transition-all disabled:opacity-70 disabled:cursor-not-allowed w-full sm:w-auto cursor-pointer hover:bg-brand-hover">
              {isSubmitting ? <><Loader2 size={16} className="animate-spin" /> Procesando...</> : 'Confirmar Pago'}
            </button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={isChangePlanModalOpen} onClose={() => !isSubmitting && setIsChangePlanModalOpen(false)} title="Cambiar Plan de Membresía">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-text-main">Seleccionar Nuevo Plan</label>
            <select value={selectedNewPlanUuid} onChange={(e) => setSelectedNewPlanUuid(e.target.value)} disabled={isSubmitting} className="w-full bg-background border border-border-primary text-text-main text-sm rounded-md focus:ring-brand-main focus:border-brand-main block p-3 outline-none transition-colors">
              <option value="" disabled>-- Elige un plan --</option>
              {plans?.data?.map((plan) => (
                <option key={plan.uuid} value={plan.uuid}>
                  {plan.name} - ${Number(plan.price).toLocaleString('es-AR')} ({plan.durationDays} días)
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-3">
            <label className="text-sm font-bold text-text-main">¿Cuándo comienza este nuevo plan?</label>
            <div className="flex flex-col gap-2">
              
              {activeSubscription && (
                <label className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-all ${activationType === 'SCHEDULED' ? 'border-brand-main bg-brand-main/5' : 'border-border-primary bg-background hover:bg-surface-hover'}`}>
                  <input type="radio" name="activationType" value="SCHEDULED" checked={activationType === 'SCHEDULED'} onChange={() => setActivationType('SCHEDULED')} className="mt-1 accent-brand-main" />
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-text-main">Al terminar el plan actual (Recomendado)</span>
                    <span className="text-xs text-text-muted">Se programará para iniciar el {nextDueDate}. No pierde los días que ya pagó.</span>
                  </div>
                </label>
              )}

              <label className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-all ${activationType === 'IMMEDIATE' ? 'border-warning-main bg-warning-surface' : 'border-border-primary bg-background hover:bg-surface-hover'}`}>
                <input type="radio" name="activationType" value="IMMEDIATE" checked={activationType === 'IMMEDIATE'} onChange={() => setActivationType('IMMEDIATE')} className="mt-1 accent-warning-main" />
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-text-main">Empezar Hoy Mismo</span>
                  <span className="text-xs text-warning-main">Cancela el plan actual inmediatamente. Los días restantes se perderán.</span>
                </div>
              </label>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-text-main">Método de Pago</label>
            <select value={changePlanPaymentMethod} onChange={(e) => setChangePlanPaymentMethod(e.target.value)} disabled={isSubmitting} className="w-full bg-background border border-border-primary text-text-main text-sm rounded-md focus:ring-brand-main focus:border-brand-main block p-2.5 outline-none transition-colors">
              <option value="CASH">Efectivo</option>
              <option value="DEBIT_CARD">Tarjeta de Débito</option>
              <option value="CREDIT_CARD">Tarjeta de Crédito</option>
              <option value="BANK_TRANSFER">Transferencia Bancaria</option>
              <option value="MERCADO_PAGO">Mercado Pago</option>
              <option value="OTHER">Otro</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-border-primary">
            <button onClick={() => setIsChangePlanModalOpen(false)} disabled={isSubmitting} className="px-4 py-2 text-sm font-bold text-text-muted hover:text-text-main transition-colors disabled:opacity-50 cursor-pointer">Cancelar</button>
            <button onClick={handleChangePlan} disabled={isSubmitting || !selectedNewPlanUuid} className="flex items-center justify-center gap-2 px-6 py-2 bg-brand-main text-white text-sm font-bold rounded-md hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
              {isSubmitting ? <><Loader2 size={16} className="animate-spin" /> Procesando...</> : 'Cobrar y Cambiar Plan'}
            </button>
          </div>
        </div>
      </Modal>
    </section>
  );
}
