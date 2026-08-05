import { useState } from 'react';
import { Modal } from '@/common/components/ui/Modal';
import { Loader2 } from 'lucide-react';
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
  const { mutate: renewPlan, isPending } = useRenewPlan();

  const handleRenew = () => {
    renewPlan(
      { id: member.uuid, payload: { planUuid, paymentMethod } },
      { onSuccess: () => onClose() }
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={() => !isPending && onClose()} title="Renovar Plan">
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
          <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} disabled={isPending} className="w-full bg-background border border-border-primary text-text-main text-sm rounded-md focus:ring-brand-main focus:border-brand-main block p-2.5 outline-none transition-colors disabled:opacity-50">
            <option value="CASH">Efectivo</option>
            <option value="DEBIT_CARD">Tarjeta de Débito</option>
            <option value="CREDIT_CARD">Tarjeta de Crédito</option>
            <option value="BANK_TRANSFER">Transferencia Bancaria</option>
            <option value="MERCADO_PAGO">Mercado Pago</option>
            <option value="OTHER">Otro</option>
          </select>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} disabled={isPending} className="px-4 py-2 text-sm font-bold text-text-muted hover:text-text-main transition-colors disabled:opacity-50 cursor-pointer">Cancelar</button>
          <button onClick={handleRenew} disabled={isPending} className="flex items-center justify-center gap-2 px-6 py-2 bg-brand-main text-white text-sm font-bold rounded-md hover:bg-opacity-90 transition-all disabled:opacity-70 disabled:cursor-not-allowed w-full sm:w-auto cursor-pointer hover:bg-brand-hover">
            {isPending ? <><Loader2 size={16} className="animate-spin" /> Procesando...</> : 'Confirmar'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
