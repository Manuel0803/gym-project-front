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

export function EditPaymentForm({
  payment,
  onSuccess,
  onCancel,
}: EditPaymentFormProps) {
  const { mutate: updatePayment, isPending } = useUpdatePayment();

  const getLocalDateString = (dateString?: string) => {
    const d = dateString ? new Date(dateString) : new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const getIsoWithLocalMidday = (dateString: string) => {
    const [year, month, day] = dateString.split('-');
    const d = new Date(Number(year), Number(month) - 1, Number(day), 12, 0, 0);
    return d.toISOString();
  };

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
          amountPaid: data.amount,
          notes: data.notes || undefined,
          date: data.date ? getIsoWithLocalMidday(data.date) : undefined,
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
      className="flex flex-col gap-5 mt-2"
    >
      <p className="text-sm text-text-muted -mt-4 mb-2">
        Modifique los datos del pago
      </p>

      <div className="grid grid-cols-2 gap-4">
        <InputField
          label="Monto"
          type="text"
          placeholder="0.00"
          registration={register('amount', {
            onChange: (e) => {
              const rawValue = e.target.value.replace(/\D/g, '');
              e.target.value = rawValue
                ? new Intl.NumberFormat('es-AR').format(Number(rawValue))
                : '';
            },
          })}
          error={errors.amount?.message}
          icon={<span className="text-text-muted">$</span>}
        />

        <SelectField
          label="Método de pago"
          registration={register('method')}
          error={errors.method?.message}
        >
          <option value="CASH">Efectivo</option>
          <option value="BANK_TRANSFER">Transferencia bancaria</option>
          <option value="MERCADO_PAGO">Mercado Pago</option>
          <option value="DEBIT_CARD">Tarjeta de débito </option>
          <option value="CREDIT_CARD">Tarjeta de crédito</option>
          <option value="OTHER">Otro</option>
        </SelectField>
      </div>

      <InputField
        label="Fecha del pago"
        type="date"
        registration={register('date')}
        error={errors.date?.message}
      />

      <TextareaField
        label="Notas / Observaciones"
        placeholder="Detalles adicionales del pago..."
        registration={register('notes')}
        error={errors.notes?.message}
        rows={3}
      />

      <div className="flex justify-end gap-3 mt-2">
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
