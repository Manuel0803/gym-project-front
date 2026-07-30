'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreatePlan, useUpdatePlan } from '@/features/plans/hooks/usePlans';
import {
  PlanFormValues,
  planSchema,
} from '@/features/plans/schemas/plan.schema';
import { InputField } from '@/common/components/ui/InputField';
import { TextareaField } from '@/common/components/ui/TextareaField';
import { Loader2, AlertCircle } from 'lucide-react';
import { Modal } from '@/common/components/ui/Modal';

export function NewPlanForm() {
  const router = useRouter();
  const [inactivePlan, setInactivePlan] = useState<{ id: string; data: PlanFormValues } | null>(null);

  const { mutate: createPlan, isPending: isCreating } = useCreatePlan();
  const { mutate: updatePlan, isPending: isUpdating } = useUpdatePlan();

  const isPending = isCreating || isUpdating;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PlanFormValues>({
    resolver: zodResolver(planSchema),
    defaultValues: {
      durationDays: 30,
    },
  });

  const onSubmit = (data: PlanFormValues) => {
    createPlan(data, {
      onSuccess: () => {
        router.push('/dashboard/planes');
      },
      onError: (error: any) => {
        if (error.response?.data?.isInactive) {
          setInactivePlan({ id: error.response.data.planId, data });
        }
      },
    });
  };

  const handleReactivate = (useNewData: boolean) => {
    if (!inactivePlan) return;

    const payload = useNewData
      ? { ...inactivePlan.data, isActive: true }
      : { isActive: true };

    updatePlan(
      { id: inactivePlan.id, payload },
      {
        onSuccess: () => {
          setInactivePlan(null);
          router.push('/dashboard/planes');
        },
      }
    );
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="border border-border-primary rounded-lg bg-surface flex flex-col p-6 gap-8 "
      >
        <div className="flex flex-col gap-6">
          <h2 className="text-[15px] font-bold text-text-main">
            Información general
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Nombre del Plan"
              type="text"
              placeholder="Ej: Pase Libre Mensual"
              disabled={isPending}
              registration={register('name')}
              error={errors.name?.message}
            />

            <InputField
              label="Precio"
              type="text"
              placeholder="0.00"
              disabled={isPending}
              registration={register('price', {
                onChange: (e) => {
                  const rawValue = e.target.value.replace(/\D/g, '');
                  e.target.value = rawValue
                    ? new Intl.NumberFormat('es-AR').format(Number(rawValue))
                    : '';
                },
              })}
              error={errors.price?.message}
              icon={<span className="text-text-muted">$</span>}
            />
          </div>
        </div>

        <hr className="border-border-primary" />

        <div className="flex flex-col gap-6">
          <h2 className="text-[15px] font-bold text-text-main">
            Especificaciones del plan
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Duración (Días)"
              type="number"
              placeholder="Ej: 30"
              disabled={isPending}
              registration={register('durationDays')}
              error={errors.durationDays?.message}
            />
          </div>

          <div className="flex flex-col gap-2">
            <TextareaField
              label="Beneficios del plan (Opcional)"
              placeholder="Acceso a sala de musculación&#10;Clases grupales incluidas&#10;Duchas y vestuarios"
              disabled={isPending}
              registration={register('description')}
              error={errors.description?.message}
              rows={4}
            />
            <p className="text-xs text-text-muted mt-1">
              Escribe un beneficio por línea para mostrarlos en la lista.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-border-primary">
          <Link
            href="/dashboard/planes"
            className="px-4 py-2 border border-border-primary bg-transparent text-text-muted hover:text-text-main hover:bg-surface-hover rounded text-xs font-bold transition-colors"
          >
            Descartar
          </Link>
          <button
            type="submit"
            disabled={isPending}
            className="bg-brand-main hover:bg-brand-hover text-white flex items-center justify-center gap-2 px-6 py-2.5 rounded-sm font-medium text-sm transition-colors  disabled:opacity-50 cursor-pointer"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Guardando...
              </>
            ) : (
              'Crear plan'
            )}
          </button>
        </div>
      </form>

      <Modal
        isOpen={!!inactivePlan}
        onClose={() => setInactivePlan(null)}
        title="Plan Inactivo Detectado"
      >
        <div className="flex flex-col gap-4">
          <div className="flex items-start gap-3 text-warning-main bg-warning-surface p-4 rounded border border-warning-main/50">
            <AlertCircle size={20} className="shrink-0 mt-0.5" />
            <p className="text-sm leading-relaxed">
              Ya existe un plan con este nombre pero fue eliminado anteriormente. Puedes reactivarlo para volver a usarlo. ¿Qué deseas hacer con la información?
            </p>
          </div>

          <div className="flex flex-col gap-3 mt-4">
            <button
              onClick={() => handleReactivate(false)}
              disabled={isPending}
              className="px-4 py-3 text-sm font-medium text-text-main border border-border-primary hover:bg-surface-hover transition-colors rounded text-left flex justify-between items-center cursor-pointer"
            >
              <span>Reactivar con los datos originales</span>
            </button>

            <button
              onClick={() => handleReactivate(true)}
              disabled={isPending}
              className="px-4 py-3 text-sm font-medium text-brand-main border border-brand-main hover:bg-brand-main/10 transition-colors rounded text-left flex justify-between items-center cursor-pointer"
            >
              <span>Reactivar y actualizar con estos nuevos datos</span>
            </button>

            <button
              onClick={() => setInactivePlan(null)}
              disabled={isPending}
              className="px-4 py-2 text-sm text-text-muted hover:text-text-main transition-colors text-center mt-2 cursor-pointer"
            >
              Cancelar
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
