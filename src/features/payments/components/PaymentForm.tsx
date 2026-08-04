import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreatePayment } from '../hooks/usePayments';
import {
  PaymentFormValues,
  paymentSchema,
} from '@/features/payments/schemas/payment.schema';
import { PaymentFormProps } from '../interfaces/payments.interface';
import { InputField } from '@/common/components/ui/InputField';
import { SelectField } from '@/common/components/ui/SelectField';
import { TextareaField } from '@/common/components/ui/TextareaField';
import { AlertCircle } from 'lucide-react';
import { getIsoWithLocalMidday, getTodayLocalString } from '../utils/dates';

export function PaymentForm({
  memberName,
  memberSurname,
  uuid,
  defaultAmount,
  onSuccess,
  onCancel,
}: PaymentFormProps) {
  const { mutate: createPayment, isPending } = useCreatePayment();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      amount: defaultAmount || 0,
      method: 'CASH',
      date: getTodayLocalString(),
      notes: '',
    },
  });

  const onSubmit = (data: PaymentFormValues) => {
    createPayment(
      {
        memberUuid: uuid,
        paymentMethod: data.method,
        amountPaid: data.amount,
        notes: data.notes || undefined,
        date: data.date ? getIsoWithLocalMidday(data.date) : undefined, 
      },
      {
        onSuccess: () => {
          reset();
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
      <div className="bg-warning-main/10 border border-warning-main/20 p-4 rounded-lg flex flex-col gap-2 mb-2">
        <div className="flex items-center gap-2 text-warning-main font-bold">
          <AlertCircle size={18} />
          <h3>Aviso Importante</h3>
        </div>
        <p className="text-xs text-text-main leading-relaxed">
          Este formulario es <strong>solo para registrar pagos sueltos o adicionales</strong> (ej: bebidas, deudas previas, indumentaria).<br/>
          <span className="text-danger-main font-medium block mt-1">
            Registrar un pago aquí NO renovará el mes ni los días del socio.
          </span>
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <InputField
          label="Socio"
          type="text"
          disabled
          value={`${memberName} ${memberSurname}`}
          className="bg-surface-hover text-text-muted"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <InputField
          label="Monto a cobrar"
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
        label="Concepto / Observaciones"
        placeholder="Ej: Pago por botella de agua..."
        registration={register('notes')}
        error={errors.notes?.message}
        rows={3}
      />

      <div className="flex justify-end gap-3 mt-2">
        <button
          type="button"
          onClick={() => {
            reset();
            onCancel();
          }}
          className="bg-transparent border border-border-primary text-text-main text-sm font-medium py-2.5 px-6 rounded-sm cursor-pointer hover:bg-surface-hover transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="bg-brand-main text-white text-sm font-medium py-2.5 px-6 rounded-sm cursor-pointer hover:bg-brand-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? 'Procesando...' : 'Registrar Pago'}
        </button>
      </div>
    </form>
  );
}
