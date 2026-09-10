import { useState } from 'react';
import { Modal } from '@/common/components/ui/Modal';
import { Loader2, Calendar } from 'lucide-react';
import { useRenewPlan } from '../hooks/useMembers';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  member: any;
  planName: string;
  planDuration: number;
  planUuid: string;
  defaultAmount: number;
}

export function RenewPlanModal({ isOpen, onClose, member, planName, planDuration, planUuid, defaultAmount }: Props) {
  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const [isRetroactive, setIsRetroactive] = useState(false);
  const [customStartDate, setCustomStartDate] = useState('');
  
  const { mutate: renewPlan, isPending } = useRenewPlan();

  const handleClose = () => {
    if (isPending) return;
    setIsRetroactive(false);
    setCustomStartDate('');
    setPaymentMethod('CASH');
    onClose();
  };

  const handleRenew = () => {
    const payload: any = { 
      planUuid, 
      paymentMethod 
    };

    if (isRetroactive && customStartDate) {
      const dateObj = new Date(customStartDate + 'T12:00:00');
      payload.customStartDate = dateObj.toISOString();
    }

    renewPlan(
      { id: member.uuid, payload },
      { onSuccess: handleClose }
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Renovar Plan">
      <div className="flex flex-col gap-5">
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
              <span className="text-xs text-brand-main">El vencimiento se calculará {planDuration} días a partir de la fecha seleccionada.</span>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2 mt-1">
          <label className="text-sm font-bold text-text-main">Método de Pago</label>
          <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} disabled={isPending} className="w-full bg-background border border-border-primary text-text-main text-sm rounded-md focus:ring-brand-main focus:border-brand-main block p-2.5 outline-none transition-colors disabled:opacity-50">
            <option value="CASH">Efectivo</option>
            <option value="DEBIT_CARD">Tarjeta de Débito</option>
            <option value="CREDIT_CARD">Tarjeta de Crédito</option>
            <option value="BANK_TRANSFER">Transferencia Bancaria</option>
            <option value="MERCADO_PAGO">Mercado Pago</option>
            <option value="OTHER">Otro</option>
          </select>
        </div>

        <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-border-primary">
          <button onClick={handleClose} disabled={isPending} className="px-4 py-2 text-sm font-bold text-text-muted hover:text-text-main transition-colors disabled:opacity-50 cursor-pointer">Cancelar</button>
          <button onClick={handleRenew} disabled={isPending || (isRetroactive && !customStartDate)} className="flex items-center justify-center gap-2 px-6 py-2 bg-brand-main text-white text-sm font-bold rounded-md hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto cursor-pointer">
            {isPending ? <><Loader2 size={16} className="animate-spin" /> Procesando...</> : 'Confirmar'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
