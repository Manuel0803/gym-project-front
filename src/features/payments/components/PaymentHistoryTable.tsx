import { useState } from 'react';
import { PaymentHistoryTableProps, Payment } from '../interfaces/payments.interface';
import { paymentMethods } from '../constants/payment-methods.constant';
import { CreditCard, ChevronLeft, ChevronRight, Edit2 } from 'lucide-react';
import { Modal } from '@/common/components/ui/Modal';
import { EditPaymentForm } from './EditPaymentForm';

export function PaymentHistoryTable({ payments }: PaymentHistoryTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(payments.length / itemsPerPage);
  const paginatedPayments = payments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="bg-surface border border-border-primary rounded-lg p-6 overflow-hidden flex flex-col transition-colors">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-sm font-bold text-text-main uppercase tracking-wider">
          Historial de Pagos
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-150 text-left border-collapse">
          <thead>
            <tr className="border-b border-t border-border-primary">
              <th className="pb-3 pt-3 text-xs font-bold text-text-muted uppercase tracking-wider">
                Fecha
              </th>
              <th className="pb-3 pt-3 text-xs font-bold text-text-muted uppercase tracking-wider">
                Monto
              </th>
              <th className="pb-3 pt-3 text-xs font-bold text-text-muted uppercase tracking-wider">
                Método
              </th>
              <th className="pb-3 pt-3 text-xs font-bold text-text-muted uppercase tracking-wider">
                Notas
              </th>
              <th className="pb-3 pt-3 text-xs font-bold text-text-muted uppercase tracking-wider text-right">
                Estado
              </th>
            </tr>
          </thead>
          <tbody className="text-sm text-text-main">
            {paginatedPayments.map((payment) => (
              <tr
                key={payment.uuid}
                className="border-b border-border-primary hover:bg-surface-hover transition-colors"
              >
                <td className="py-4">
                  {new Date(payment.date).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </td>
                <td className="py-4 font-bold text-text-main">
                  ${Number(payment.amountPaid).toLocaleString('es-AR')}
                </td>
                <td className="py-4">
                  <div className="flex items-center gap-2">
                    <CreditCard size={16} className="text-text-muted" />
                    <span>
                      {paymentMethods[payment.paymentMethod] ||
                        payment.paymentMethod}
                    </span>
                  </div>
                </td>
                <td
                  className="py-4 max-w-50 truncate"
                  title={payment.notes || ''}
                >
                  {payment.notes ? (
                    <span className="text-sm text-text-muted">
                      {payment.notes}
                    </span>
                  ) : (
                    <span className="text-text-muted">-</span>
                  )}
                </td>
                <td className="py-4 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <span className="px-2.5 py-1 rounded-md border border-success-main/30 bg-success-surface text-success-main text-[10px] font-bold tracking-widest uppercase">
                      Pagado
                    </span>
                    <button
                      onClick={() => setSelectedPayment(payment)}
                      className="p-1.5 rounded-md text-text-muted hover:text-brand-main hover:bg-brand-main/10 transition-colors"
                      title="Editar pago"
                    >
                      <Edit2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {payments.length === 0 && (
              <tr>
                <td colSpan={5} className="py-8 text-center text-text-muted">
                  No hay pagos registrados aún.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={!!selectedPayment}
        onClose={() => setSelectedPayment(null)}
        title="Editar Pago"
      >
        {selectedPayment && (
          <EditPaymentForm
            payment={selectedPayment}
            onSuccess={() => setSelectedPayment(null)}
            onCancel={() => setSelectedPayment(null)}
          />
        )}
      </Modal>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6 px-2">
          <span className="text-sm text-text-muted">
            Mostrando {(currentPage - 1) * itemsPerPage + 1} a{' '}
            {Math.min(currentPage * itemsPerPage, payments.length)} de{' '}
            {payments.length} pagos
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-md border border-border-primary text-text-main hover:bg-surface-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-md border border-border-primary text-text-main hover:bg-surface-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
