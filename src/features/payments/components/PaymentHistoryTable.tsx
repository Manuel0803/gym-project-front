'use client';

import { useState } from 'react';
import { Payment } from '../interfaces/payments.interface';
import { paymentMethods } from '../constants/payment-methods.constant';
import { CreditCard, ChevronLeft, ChevronRight, Edit2, Trash2, AlertTriangle, Loader2 } from 'lucide-react';
import { Modal } from '@/common/components/ui/Modal';
import { EditPaymentForm } from './EditPaymentForm';
import { useDeletePayment, usePayments } from '../hooks/usePayments'; 

interface Props {
  memberUuid: string;
}

export function PaymentHistoryTable({ memberUuid }: Props) {
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState<'VALID' | 'VOIDED'>('VALID');
  const itemsPerPage = 5;

  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [paymentToVoid, setPaymentToVoid] = useState<Payment | null>(null);
  
  const { mutate: deletePayment, isPending: isDeleting } = useDeletePayment();

  const { data: response, isLoading } = usePayments(currentPage, itemsPerPage, memberUuid, filter);
  
  const payments = response?.data || [];
  const totalPages = response?.meta?.lastPage || 1;

  const handleVoidPayment = () => {
    if (!paymentToVoid) return;
    deletePayment(paymentToVoid.uuid, {
      onSuccess: () => {
        setPaymentToVoid(null);
      },
    });
  };

  return (
    <div className="bg-surface border border-border-primary rounded-lg p-6 overflow-hidden flex flex-col transition-colors">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h3 className="text-sm font-bold text-text-main uppercase tracking-wider">
          Historial de Pagos
        </h3>
        
        <div className="flex bg-background border border-border-primary rounded-lg p-1">
          <button
            onClick={() => { setFilter('VALID'); setCurrentPage(1); }}
            className={`px-4 py-1.5 text-[10px] font-bold rounded transition-colors tracking-wider uppercase cursor-pointer ${filter === 'VALID' ? 'bg-brand-main text-white ' : 'text-text-muted hover:text-text-main'}`}
          >
            Válidos
          </button>
          <button
            onClick={() => { setFilter('VOIDED'); setCurrentPage(1); }}
            className={`px-4 py-1.5 text-[10px] font-bold rounded transition-colors tracking-wider uppercase cursor-pointer ${filter === 'VOIDED' ? 'bg-danger-main text-white ' : 'text-text-muted hover:text-text-main'}`}
          >
            Anulados
          </button>
        </div>
      </div>

      <div className="overflow-x-auto relative min-h-50">
        {isLoading && (
           <div className="absolute inset-0 bg-surface/50 backdrop-blur-[1px] flex items-center justify-center z-10">
              <Loader2 className="w-6 h-6 animate-spin text-brand-main" />
           </div>
        )}
        <table className="w-full min-w-150 text-left border-collapse">
          <thead>
            <tr className="border-b border-t border-border-primary">
              <th className="pb-3 pt-3 text-xs font-bold text-text-muted uppercase tracking-wider">Fecha</th>
              <th className="pb-3 pt-3 text-xs font-bold text-text-muted uppercase tracking-wider">Monto</th>
              <th className="pb-3 pt-3 text-xs font-bold text-text-muted uppercase tracking-wider">Método</th>
              <th className="pb-3 pt-3 text-xs font-bold text-text-muted uppercase tracking-wider hidden sm:table-cell">Notas</th>
              <th className="pb-3 pt-3 text-xs font-bold text-text-muted uppercase tracking-wider text-right">Estado / Acciones</th>
            </tr>
          </thead>
          <tbody className="text-sm text-text-main">
            {payments.map((payment) => (
              <tr
                key={payment.uuid}
                className={`border-b border-border-primary transition-colors ${payment.isVoided ? 'bg-danger-main/5 hover:bg-danger-main/10' : 'hover:bg-surface-hover'}`}
              >
                <td className={`py-4 ${payment.isVoided ? 'opacity-60 line-through' : ''}`}>
                  {new Date(payment.date).toLocaleDateString('es-ES', {
                    year: 'numeric', month: 'short', day: 'numeric',
                  })}
                </td>
                <td className={`py-4 font-bold ${payment.isVoided ? 'text-text-muted line-through' : 'text-text-main'}`}>
                  ${Number(payment.amountPaid).toLocaleString('es-AR')}
                </td>
                <td className={`py-4 ${payment.isVoided ? 'opacity-60' : ''}`}>
                  <div className="flex items-center gap-2">
                    <CreditCard size={16} className="text-text-muted" />
                    <span>{paymentMethods[payment.paymentMethod] || payment.paymentMethod}</span>
                  </div>
                </td>
                <td className="py-4 max-w-40 truncate hidden sm:table-cell" title={payment.notes || ''}>
                  {payment.notes ? (
                    <span className={`text-sm ${payment.isVoided ? 'text-danger-main/80 font-medium' : 'text-text-muted'}`}>{payment.notes}</span>
                  ) : (
                    <span className="text-text-muted opacity-50">-</span>
                  )}
                </td>
                <td className="py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {payment.isVoided ? (
                      <span className="px-2.5 py-1 mr-2 rounded-md border border-danger-main/30 bg-danger-surface text-danger-main text-[10px] font-bold tracking-widest uppercase hidden md:inline-block">
                        Anulado
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 mr-2 rounded-md border border-success-main/30 bg-success-surface text-success-main text-[10px] font-bold tracking-widest uppercase hidden md:inline-block">
                        Pagado
                      </span>
                    )}
                    
                    {!payment.isVoided && (
                      <>
                        <button
                          onClick={() => setSelectedPayment(payment)}
                          className="p-1.5 rounded-md text-text-muted hover:text-brand-main hover:bg-brand-main/10 transition-colors cursor-pointer"
                          title="Editar pago"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => setPaymentToVoid(payment)}
                          className="p-1.5 rounded-md text-text-muted hover:text-danger-main hover:bg-danger-main/10 transition-colors cursor-pointer"
                          title="Anular pago"
                        >
                          <Trash2 size={16} />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {!isLoading && payments.length === 0 && (
              <tr>
                <td colSpan={5} className="py-10 text-center text-text-muted text-sm">
                  {filter === 'VOIDED' ? 'No hay pagos anulados en el historial.' : 'No hay pagos registrados para este miembro.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={!!selectedPayment} onClose={() => setSelectedPayment(null)} title="Editar Pago">
        {selectedPayment && (
          <EditPaymentForm
            payment={selectedPayment}
            onSuccess={() => setSelectedPayment(null)}
            onCancel={() => setSelectedPayment(null)}
          />
        )}
      </Modal>

      <Modal isOpen={!!paymentToVoid} onClose={() => !isDeleting && setPaymentToVoid(null)} title="Anular Pago">
        <div className="flex flex-col gap-4 mt-2">
          <p className="text-sm text-text-main">
            Estás a punto de anular un pago de <strong className="text-brand-main">${paymentToVoid ? Number(paymentToVoid.amountPaid).toLocaleString('es-AR') : 0}</strong>.
          </p>

          <div className="p-4 border border-warning-main/30 bg-warning-surface rounded-lg flex flex-col gap-2">
            <div className="flex items-center gap-2 text-warning-main font-bold">
              <AlertTriangle size={18} />
              <h3>Atención</h3>
            </div>
            <p className="text-xs text-text-main">
              El pago no se borrará de la base de datos por motivos de auditoría, pero será marcado como <strong>ANULADO</strong> y dejará de sumar en la caja diaria. Esta acción no se puede deshacer.
            </p>
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <button
              onClick={() => setPaymentToVoid(null)}
              disabled={isDeleting}
              className="px-4 py-2 text-sm font-medium text-text-main border border-border-primary hover:bg-surface-hover transition-colors rounded cursor-pointer disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleVoidPayment}
              disabled={isDeleting}
              className="py-2 px-6 text-sm font-medium text-white bg-danger-main hover:bg-opacity-90 transition-colors rounded flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDeleting ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Procesando...</>
              ) : (
                'Anular Pago'
              )}
            </button>
          </div>
        </div>
      </Modal>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6 px-2 border-t border-border-primary pt-4">
          <span className="text-xs text-text-muted font-medium">
            Página {currentPage} de {totalPages}
          </span>
          <div className="flex gap-2">
            <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1 || isLoading} className="p-1.5 rounded-md border border-border-primary text-text-main hover:bg-surface-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"><ChevronLeft size={16} /></button>
            <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages || isLoading} className="p-1.5 rounded-md border border-border-primary text-text-main hover:bg-surface-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"><ChevronRight size={16} /></button>
          </div>
        </div>
      )}
    </div>
  );
}
