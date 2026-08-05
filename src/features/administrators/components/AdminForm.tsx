'use client';

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserFormValues, userSchema } from '@/features/administrators/schemas/user.schema';
import { InputField } from '@/common/components/ui/InputField';
import { Loader2, CreditCard, Mail } from 'lucide-react';

interface AdminFormProps {
  defaultValues?: Partial<UserFormValues>;
  onSubmit: (data: UserFormValues) => void;
  isPending: boolean;
  submitLabel: string;
  isEditMode?: boolean;
}

export function AdminForm({ defaultValues, onSubmit, isPending, submitLabel, isEditMode }: AdminFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      dni: defaultValues?.dni || '',
      name: defaultValues?.name || '',
      surname: defaultValues?.surname || '',
      email: defaultValues?.email || '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <div className="border border-border-primary rounded-lg bg-surface flex flex-col p-6 gap-8 relative">
        <div className="flex flex-col gap-6">
          <h2 className="text-[15px] font-bold text-text-main">
            {isEditMode ? 'Identidad y Contacto' : 'Datos del nuevo administrador'}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Nombre"
              type="text"
              disabled={isPending}
              registration={register('name')}
              error={errors.name?.message}
            />
            <InputField
              label="Apellido"
              type="text"
              disabled={isPending}
              registration={register('surname')}
              error={errors.surname?.message}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="DNI / Documento"
              type="text"
              placeholder="12345678"
              disabled={isPending || isEditMode}
              registration={register('dni')}
              error={errors.dni?.message}
              icon={<CreditCard size={14} className="text-text-muted" />}
            />
            <InputField
              label="Correo electrónico"
              type="email"
              disabled={isPending}
              registration={register('email')}
              error={errors.email?.message}
              icon={<Mail size={14} className="text-text-muted" />}
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-border-primary">
          <Link
            href="/dashboard/administradores"
            className="px-6 py-2.5 border border-border-primary bg-transparent text-text-muted hover:text-text-main hover:bg-surface-hover rounded-sm text-sm font-medium transition-colors cursor-pointer"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={isPending}
            className="px-6 py-2.5 flex items-center justify-center gap-2 bg-brand-main hover:bg-brand-hover text-white rounded-sm text-sm font-medium transition-colors disabled:opacity-50 cursor-pointer"
          >
            {isPending ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> {isEditMode ? 'Guardando...' : 'Creando...'}</>
            ) : (
              submitLabel
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
