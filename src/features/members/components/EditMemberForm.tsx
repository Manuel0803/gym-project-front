'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { usePlans } from '@/features/plans/hooks/usePlans';
import {
  useUpdateMember,
  useMember,
} from '@/features/members/hooks/useMembers';
import {
  EditMemberFormValues,
  editMemberSchema,
} from '@/features/members/schemas/editMember.schema';
import { InputField } from '@/common/components/ui/InputField';
import { SelectField } from '@/common/components/ui/SelectField';
import { TextareaField } from '@/common/components/ui/TextareaField';
import { Phone, IdCard, Loader2 } from 'lucide-react';
import { useRole } from '@/features/auth/hooks/useRole';

export function EditMemberForm({ id }: { id: string }) {
  const router = useRouter();
  const { data: member, isLoading } = useMember(id);
  const { isAdmin } = useRole();
  const { data: plansData, isLoading: isLoadingPlans } = usePlans(1, 100);
  const plans = plansData?.data || [];
  const updateMemberMutation = useUpdateMember();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<EditMemberFormValues>({
    resolver: zodResolver(editMemberSchema),
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

  useEffect(() => {
    if (member) {
      reset({
        dni: member.dni,
        name: member.name,
        surname: member.surname,
        phoneNumber: member.phoneNumber || '',
        birthDate: member.birthDate
          ? new Date(member.birthDate).toISOString().split('T')[0]
          : '',
        observations: member.observations || '',
        planUuid:
          member.subscriptions?.find((sub) => sub.status === 'ACTIVE')
            ?.planUuid || '',
      });
    }
  }, [member, reset]);

  const activeSubsCount =
    member?.subscriptions?.filter((sub) => sub.status === 'ACTIVE').length || 0;
  const canStackMore = activeSubsCount < 3;

  const watchPlanUuid = watch('planUuid');
  const currentActiveSub = member?.subscriptions?.find(
    (sub) => sub.status === 'ACTIVE'
  );
  const originalPlanUuid = currentActiveSub?.planUuid;
  const currentEndDate = currentActiveSub?.endDate;

  const onSubmit = (data: EditMemberFormValues) => {
    const payload = {
      ...data,
      phoneNumber: data.phoneNumber,
      observations: data.observations,
    };

    if (!payload.planUuid || payload.planUuid === originalPlanUuid) {
      delete (payload as any).planUuid;
    }

    updateMemberMutation.mutate(
      { id, payload: payload as any },
      {
        onSuccess: () => {
          router.refresh();
          router.push(`/dashboard/miembros/${id}`);
        },
      }
    );
  };

  const isSubmitting = updateMemberMutation.isPending;

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-64">
        <Loader2 className="w-8 h-8 text-brand-main animate-spin mb-3" />
        <span className="text-text-muted text-sm">
          Cargando datos del socio...
        </span>
      </div>
    );
  }

  return (
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
                registration={register('dni')}
                error={errors.dni?.message}
                disabled={isSubmitting}
                icon={<IdCard size={14} className="text-text-muted" />}
                className="md:col-span-2"
              />

              <InputField
                label="Primer Nombre"
                type="text"
                registration={register('name')}
                error={errors.name?.message}
                disabled={isSubmitting}
              />

              <InputField
                label="Apellido"
                type="text"
                registration={register('surname')}
                error={errors.surname?.message}
                disabled={isSubmitting}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
              <InputField
                label="Fecha de Nacimiento"
                type="date"
                registration={register('birthDate')}
                error={errors.birthDate?.message}
                disabled={isSubmitting}
              />

              <InputField
                label="Teléfono (Opcional)"
                type="tel"
                placeholder="+5491123456789"
                registration={register('phoneNumber')}
                error={errors.phoneNumber?.message}
                disabled={isSubmitting}
                icon={<Phone size={14} className="text-text-muted" />}
              />
            </div>
          </div>

          <hr className="border-border-primary" />
          <div className="flex flex-col gap-6">
            {isAdmin && (
              <>
                <h2 className="text-[15px] font-bold text-text-main">
                  Membresía
                </h2>
                <div className="flex flex-col gap-1.5">
                  <SelectField
                    label="Plan asignado"
                    registration={register('planUuid')}
                    error={errors.planUuid?.message}
                    disabled={isSubmitting || isLoadingPlans || !canStackMore}
                  >
                    <option value="">Seleccione un plan</option>
                    {plans.map((plan) => (
                      <option key={plan.uuid} value={plan.uuid}>
                        {plan.name} (${plan.price})
                      </option>
                    ))}
                  </SelectField>
                  {!canStackMore && (
                    <p className="text-[11px] text-danger-main mt-0.5 font-medium">
                      Límite máximo alcanzado (3 planes programados).
                    </p>
                  )}
                  {canStackMore &&
                    watchPlanUuid &&
                    originalPlanUuid &&
                    watchPlanUuid !== originalPlanUuid &&
                    currentEndDate &&
                    new Date(currentEndDate) > new Date() && (
                      <p className="text-[11px] text-orange-400 mt-0.5">
                        El nuevo plan entrará en vigencia al finalizar el actual (
                        {new Date(currentEndDate).toLocaleDateString('es-AR')}).
                      </p>
                    )}
                </div>
              </>
            )}

            <TextareaField
              label="Observaciones / Notas"
              placeholder="Excepciones físicas, condición. Datos relevantes"
              registration={register('observations')}
              error={errors.observations?.message}
              disabled={isSubmitting}
              rows={4}
            />
          </div>
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border-primary">
            <Link
              href={`/dashboard/miembros/${id}`}
              className="px-6 py-2.5 border border-border-primary bg-transparent text-text-muted hover:text-text-main hover:bg-surface-hover rounded-sm text-sm font-medium transition-colors"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center justify-center gap-2 px-6 py-2.5 bg-brand-main hover:bg-brand-hover text-white rounded-sm text-sm font-medium transition-colors  disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
