import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUpdatePayment } from '../hooks/usePayments';
import {
  PaymentFormValues,
  paymentSchema,
} from '@/features/payments/schemas/payment.schema';
import { EditPaymentFormProps } from '../interfaces/payments.interface';
import { InputField } from '@/common/components/ui/InputField';
import { SelectField } from '@/common/components/ui/SelectField';
import { TextareaField } from '@/common/components/ui/TextareaField';
import { getLocalDateString } from '../utils/dates';
import { Lock, AlertCircle } from 'lucide-react';

export function EditPaymentForm({
  payment,
  onSuccess,
  onCancel,
}: EditPaymentFormProps) {
  const { mutate: updatePayment, isPending } = useUpdatePayment();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      amount: payment.amountPaid,
      method: payment.paymentMethod,
      date: getLocalDateString(payment.date),
      notes: payment.notes || '',
    },
  });

  const onSubmit = (data: PaymentFormValues) => {
    updatePayment(
      {
        id: payment.uuid,
        payload: {
          paymentMethod: data.method,
          notes: data.notes || undefined,
        },
      },
      {
        onSuccess: () => {
          onSuccess();
        },
      }
    );
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 mt-2"
    >
      <div className="bg-warning-main/10 border border-warning-main/20 p-3 rounded-md flex items-start gap-3">
        <AlertCircle size={18} className="text-warning-main shrink-0 mt-0.5" />
        <p className="text-xs text-warning-main font-medium leading-relaxed">
          Por motivos de seguridad y auditoría, <strong>el monto y la fecha</strong> de un pago registrado no pueden modificarse. Si hay un error grave, anule este pago y registre uno nuevo.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="relative">
          <InputField
            label="Monto"
            type="text"
            registration={register('amount')}
            disabled={true}
            className="bg-surface-hover text-text-muted cursor-not-allowed"
            icon={<span className="text-text-muted">$</span>}
          />
          <Lock size={12} className="absolute right-3 top-9 text-text-muted opacity-50" />
        </div>

        <SelectField
          label="Método de pago"
          registration={register('method')}
          error={errors.method?.message}
          disabled={isPending}
        >
          <option value="CASH">Efectivo</option>
          <option value="BANK_TRANSFER">Transferencia bancaria</option>
          <option value="MERCADO_PAGO">Mercado Pago</option>
          <option value="DEBIT_CARD">Tarjeta de débito </option>
          <option value="CREDIT_CARD">Tarjeta de crédito</option>
          <option value="OTHER">Otro</option>
        </SelectField>
      </div>

      <div className="relative">
        <InputField
          label="Fecha del pago"
          type="date"
          registration={register('date')}
          disabled={true}
          className="bg-surface-hover text-text-muted cursor-not-allowed"
        />
        <Lock size={12} className="absolute right-9 top-9 text-text-muted opacity-50" />
      </div>

      <TextareaField
        label="Notas / Observaciones"
        placeholder="Corregir detalles adicionales del pago..."
        registration={register('notes')}
        error={errors.notes?.message}
        rows={3}
        disabled={isPending}
      />

      <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-border-primary">
        <button
          type="button"
          onClick={onCancel}
          className="bg-transparent border border-border-primary text-text-main text-sm font-medium py-2.5 px-6 rounded-sm cursor-pointer hover:bg-surface-hover transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="bg-brand-main text-white text-sm font-medium py-2.5 px-6 rounded-sm cursor-pointer hover:bg-brand-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? 'Guardando...' : 'Guardar Cambios'}
        </button>
      </div>
    </form>
  );
}
