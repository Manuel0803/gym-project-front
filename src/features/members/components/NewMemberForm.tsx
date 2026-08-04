'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateMember } from '@/features/members/hooks/useMembers';
import {
  createMemberSchema,
  MemberFormValues,
} from '@/features/members/schemas/createMember.schema';
import { InputField } from '@/common/components/ui/InputField';
import { TextareaField } from '@/common/components/ui/TextareaField';
import { Phone, IdCard, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';

export function NewMemberForm() {
  const router = useRouter();
  const createMemberMutation = useCreateMember();

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
    },
  });

  const onSubmit = (data: MemberFormValues) => {
    const payload = {
      dni: data.dni,
      name: data.name,
      surname: data.surname,
      birthDate: data.birthDate,
      phoneNumber: data.phoneNumber || undefined,
      observations: data.observations || undefined,
    };

    createMemberMutation.mutate(payload as any, {
      onSuccess: (response: any) => {
        const memberUuid = response?.uuid || response?.data?.uuid;
        
        toast.success('Miembro registrado. Por favor, asígnale un plan para activarlo.', { id: 'create-member' });
        
        if (memberUuid) {
          router.push(`/dashboard/miembros/${memberUuid}`);
        } else {
          router.push('/dashboard/miembros');
        }
      },
    });
  };

  const isSubmitting = createMemberMutation.isPending;

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <div className="border border-border-primary rounded-lg bg-surface flex flex-col p-6 gap-8">
          
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2">
              <UserPlus className="text-brand-main" size={20} />
              <h2 className="text-[15px] font-bold text-text-main">
                Ficha del Nuevo Miembro
              </h2>
            </div>

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
                label="Nombre/s"
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
              Información Médica / Adicional
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
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center justify-center gap-2 px-6 py-2.5 bg-brand-main hover:bg-brand-hover text-white rounded-sm text-sm font-medium transition-colors disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? 'Creando Ficha...' : 'Crear Socio'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
