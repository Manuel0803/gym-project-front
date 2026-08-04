'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateMember } from '@/features/members/hooks/useMembers';
import { usePlans } from '@/features/plans/hooks/usePlans';
import {
  createMemberSchema,
  MemberFormValues,
} from '@/features/members/schemas/createMember.schema';
import { InputField } from '@/common/components/ui/InputField';
import { TextareaField } from '@/common/components/ui/TextareaField';
import { SelectField } from '@/common/components/ui/SelectField';
import { Modal } from '@/common/components/ui/Modal';
import { PaymentForm } from '@/features/payments/components/PaymentForm';
import { Phone, IdCard } from 'lucide-react';

export function NewMemberForm() {
  const router = useRouter();
  const createMemberMutation = useCreateMember();
  const { data: plansData, isLoading: isLoadingPlans } = usePlans(1, 100);
  const plans = plansData?.data || [];

  const [createdMember, setCreatedMember] = useState<{
    uuid: string;
    name: string;
    surname: string;
    planPrice: number;
  } | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MemberFormValues>({
    resolver: zodResolver(createMemberSchema),
    defaultValues: {
      dni: '',
      name: '',
      surname: '',
      phoneNumber: '',
      birthDate: '',
      observations: '',
      planUuid: '',
    },
  });

  const onSubmit = (data: MemberFormValues) => {
    const payload = {
      ...data,
      phoneNumber: data.phoneNumber || undefined,
      observations: data.observations || undefined,
    };

    createMemberMutation.mutate(payload as any, {
      onSuccess: (response: any) => {
        const member = response.data || response;
        const plan = plans.find((p) => p.uuid === data.planUuid);
        setCreatedMember({
          uuid: member.uuid,
          name: member.name,
          surname: member.surname,
          planPrice: plan ? Number(plan.price) : 0,
        });
        setIsPaymentModalOpen(true);
      },
    });
  };

  const handleFinish = () => {
    setIsPaymentModalOpen(false);
    if (createdMember?.uuid) {
      router.push(`/dashboard/miembros/${createdMember.uuid}`);
    } else {
      router.push('/dashboard/miembros');
    }
  };

  const isSubmitting = createMemberMutation.isPending;

  return (
    <>
      <div className="flex flex-col gap-6">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <div className="border border-border-primary rounded-lg bg-surface flex flex-col p-6 gap-8 ">
            <div className="flex flex-col gap-6">
              <h2 className="text-[15px] font-bold text-text-main">
                Identidad y Contacto
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="DNI"
                  type="text"
                  placeholder="12345678"
                  disabled={isSubmitting}
                  registration={register('dni')}
                  error={errors.dni?.message}
                  icon={<IdCard size={14} className="text-text-muted" />}
                  className="md:col-span-2"
                />

                <InputField
                  label="Primer Nombre"
                  type="text"
                  disabled={isSubmitting}
                  registration={register('name')}
                  error={errors.name?.message}
                />

                <InputField
                  label="Apellido"
                  type="text"
                  disabled={isSubmitting}
                  registration={register('surname')}
                  error={errors.surname?.message}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Fecha de Nacimiento"
                  type="date"
                  disabled={isSubmitting}
                  registration={register('birthDate')}
                  error={errors.birthDate?.message}
                />

                <InputField
                  label="Teléfono (Opcional)"
                  type="tel"
                  placeholder="+5491123456789"
                  disabled={isSubmitting}
                  registration={register('phoneNumber')}
                  error={errors.phoneNumber?.message}
                  icon={<Phone size={14} className="text-text-muted" />}
                />
              </div>
            </div>

            <hr className="border-border-primary" />

            <div className="flex flex-col gap-6">
              <h2 className="text-[15px] font-bold text-text-main">
                Membresía
              </h2>
              <SelectField
                label="Plan a asignar"
                disabled={isSubmitting || isLoadingPlans}
                registration={register('planUuid')}
                error={errors.planUuid?.message}
              >
                <option value="">Seleccione un plan</option>
                {plans.map((plan) => (
                  <option key={plan.uuid} value={plan.uuid}>
                    {plan.name} (${plan.price})
                  </option>
                ))}
              </SelectField>
            </div>

            <hr className="border-border-primary" />

            <div className="flex flex-col gap-6">
              <h2 className="text-[15px] font-bold text-text-main">
                Información Adicional
              </h2>

              <TextareaField
                label="Observaciones / Notas"
                placeholder="Excepciones físicas, condición. Datos relevantes"
                disabled={isSubmitting}
                registration={register('observations')}
                error={errors.observations?.message}
                rows={4}
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border-primary">
              <Link
                href="/dashboard/miembros"
                className="px-6 py-2.5 border border-border-primary bg-transparent text-text-muted hover:text-text-main hover:bg-surface-hover rounded-sm text-sm font-medium transition-colors"
              >
                Descartar
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center justify-center gap-2 px-6 py-2.5 bg-brand-main hover:bg-brand-hover text-white rounded-sm text-sm font-medium transition-colors  disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? 'Guardando...' : 'Guardar Registro'}
              </button>
            </div>
          </div>
        </form>
      </div>

      {createdMember && (
        <Modal
          isOpen={isPaymentModalOpen}
          onClose={handleFinish}
          title="Registrar Pago"
        >
          <PaymentForm
            memberName={createdMember.name}
            memberSurname={createdMember.surname}
            uuid={createdMember.uuid}
            defaultAmount={createdMember.planPrice}
            isNewMember={true}
            onSuccess={handleFinish}
            onCancel={handleFinish}
          />
        </Modal>
      )}
    </>
  );
}
