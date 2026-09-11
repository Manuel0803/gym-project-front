import { useState, useEffect } from 'react';
import { Modal } from '@/common/components/ui/Modal';
import { Loader2, Calendar, CreditCard } from 'lucide-react';
import toast from 'react-hot-toast';
import { useChangePlan } from '../hooks/useMembers';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  memberUuid: string;
  hasActiveSubscription: boolean;
  nextDueDate: string;
  plans: any[];
}

export function ChangePlanModal({ isOpen, onClose, memberUuid, hasActiveSubscription, nextDueDate, plans }: Props) {
  const { mutate: changePlan, isPending } = useChangePlan();

  const [selectedNewPlanUuid, setSelectedNewPlanUuid] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<string>('CASH');
  const [activationType, setActivationType] = useState<'IMMEDIATE' | 'SCHEDULED'>('IMMEDIATE');
  const [isRetroactive, setIsRetroactive] = useState(false);
  const [customStartDate, setCustomStartDate] = useState('');
  const [registerPayment, setRegisterPayment] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setActivationType(hasActiveSubscription ? 'SCHEDULED' : 'IMMEDIATE');
      setSelectedNewPlanUuid('');
      setPaymentMethod('CASH');
      setIsRetroactive(false);
      setCustomStartDate('');
      setRegisterPayment(false);
    }
  }, [isOpen, hasActiveSubscription]);

  const handleClose = () => {
    if (!isPending) onClose();
  };

  const handleChangePlan = () => {
    if (!selectedNewPlanUuid) {
      toast.error('Por favor, selecciona un nuevo plan.');
      return;
    }

    const payload: any = {
      newPlanUuid: selectedNewPlanUuid,
      paymentMethod,
      activationType,
      registerPayment
    };

    if (isRetroactive && customStartDate) {
      const dateObj = new Date(customStartDate + 'T12:00:00');
      payload.customStartDate = dateObj.toISOString();
    }

    changePlan(
      { id: memberUuid, payload },
      { onSuccess: handleClose }
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Cambiar Plan de Membresía">
      <div className="flex flex-col gap-5">

        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-text-main">Seleccionar Nuevo Plan</label>
          <select value={selectedNewPlanUuid} onChange={(e) => setSelectedNewPlanUuid(e.target.value)} disabled={isPending} className="w-full bg-background border border-border-primary text-text-main text-sm rounded-md focus:ring-brand-main focus:border-brand-main block p-3 outline-none transition-colors">
            <option value="" disabled>-- Elige un plan --</option>
            {plans?.map((plan) => (
              <option key={plan.uuid} value={plan.uuid}>
                {plan.name} - ${Number(plan.price).toLocaleString('es-AR')} ({plan.durationDays} días)
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-4 border border-border-primary rounded-lg p-4 bg-background">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isRetroactive}
              onChange={(e) => setIsRetroactive(e.target.checked)}
              disabled={isPending}
              className="accent-brand-main w-4 h-4"
            />
            <span className="text-sm font-bold text-text-main flex items-center gap-2">
              <Calendar size={16} className="text-text-muted" />
              Carga retroactiva (Fecha manual)
            </span>
          </label>

          {isRetroactive && (
            <div className="flex flex-col gap-2 pt-2 border-t border-border-primary animate-in fade-in zoom-in-95 duration-200">
              <label className="text-xs font-bold text-text-muted uppercase">¿Qué día inició realmente?</label>
              <input
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                disabled={isPending}
                className="w-full bg-surface border border-border-primary text-text-main text-sm rounded-md focus:ring-brand-main focus:border-brand-main block p-2.5 outline-none transition-colors"
              />
              <span className="text-xs text-brand-main">
                Esta acción cancelará cualquier plan activo actual y comenzará a contar los días desde la fecha que elijas.
              </span>
            </div>
          )}
        </div>

        {!isRetroactive && (
          <div className="flex flex-col gap-3 animate-in fade-in duration-300">
            <label className="text-sm font-bold text-text-main">¿Cuándo comienza este nuevo plan?</label>
            <div className="flex flex-col gap-2">
              {hasActiveSubscription && (
                <label className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-all ${activationType === 'SCHEDULED' ? 'border-brand-main bg-brand-main/5' : 'border-border-primary bg-background hover:bg-surface-hover'}`}>
                  <input type="radio" name="activationType" value="SCHEDULED" checked={activationType === 'SCHEDULED'} onChange={() => setActivationType('SCHEDULED')} className="mt-1 accent-brand-main" />
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-text-main">Al terminar el plan actual (Recomendado)</span>
                    <span className="text-xs text-text-muted">Se programará para iniciar el {nextDueDate}.</span>
                  </div>
                </label>
              )}
              <label className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-all ${activationType === 'IMMEDIATE' ? 'border-warning-main bg-warning-surface' : 'border-border-primary bg-background hover:bg-surface-hover'}`}>
                <input type="radio" name="activationType" value="IMMEDIATE" checked={activationType === 'IMMEDIATE'} onChange={() => setActivationType('IMMEDIATE')} className="mt-1 accent-warning-main" />
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-text-main">Empezar Hoy Mismo</span>
                  <span className="text-xs text-warning-main">Cancela el plan actual inmediatamente.</span>
                </div>
              </label>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-4 border border-border-primary rounded-lg p-4 bg-background">
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="checkbox" 
              checked={registerPayment}
              onChange={(e) => setRegisterPayment(e.target.checked)}
              disabled={isPending}
              className="accent-brand-main w-4 h-4"
            />
            <span className="text-sm font-bold text-text-main flex items-center gap-2">
              <CreditCard size={16} className="text-text-muted" />
              Registrar pago automáticamente
            </span>
          </label>

          {registerPayment && (
            <div className="flex flex-col gap-2 pt-2 border-t border-border-primary animate-in fade-in zoom-in-95 duration-200">
              <label className="text-sm font-bold text-text-main">Método de Pago</label>
              <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} disabled={isPending} className="w-full bg-surface border border-border-primary text-text-main text-sm rounded-md focus:ring-brand-main focus:border-brand-main block p-2.5 outline-none transition-colors">
                <option value="CASH">Efectivo</option>
                <option value="DEBIT_CARD">Tarjeta de Débito</option>
                <option value="CREDIT_CARD">Tarjeta de Crédito</option>
                <option value="BANK_TRANSFER">Transferencia Bancaria</option>
                <option value="MERCADO_PAGO">Mercado Pago</option>
                <option value="OTHER">Otro</option>
              </select>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-border-primary">
          <button onClick={handleClose} disabled={isPending} className="px-4 py-2 text-sm font-bold text-text-muted hover:text-text-main transition-colors disabled:opacity-50 cursor-pointer">Cancelar</button>
          <button onClick={handleChangePlan} disabled={isPending || !selectedNewPlanUuid || (isRetroactive && !customStartDate)} className="flex items-center justify-center gap-2 px-6 py-2 bg-brand-main text-white text-sm font-bold rounded-md hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
            {isPending ? <><Loader2 size={16} className="animate-spin" /> Procesando...</> : 'Confirmar y Cambiar Plan'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
