'use client';

import { useForm } from 'react-hook-form';
import { useSearchParams, useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useResetPassword } from '../hooks/useAuth';
import { InputField } from '@/common/components/ui/InputField';
import { toast } from 'react-hot-toast';
import { Lock, Save, Loader2 } from 'lucide-react';
import {
  resetPasswordSchema,
  ResetPasswordValues,
} from '../schemas/reset-password.schema';

export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const { mutate: resetPassword, isPending } = useResetPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit = (data: ResetPasswordValues) => {
    if (!token) {
      toast.error('Token no válido');
      return;
    }

    resetPassword(
      { token, newPassword: data.newPassword },
      {
        onSuccess: (response) => {
          toast.success(response.message);
          router.push('/login');
        },
        onError: (error: any) => {
          toast.error(
            error.response?.data?.message ||
              'El enlace es inválido o ha expirado'
          );
        },
      }
    );
  };

  if (!token) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-lg text-center text-sm">
        Enlace inválido o expirado. Por favor, solicita uno nuevo desde la
        pantalla de inicio de sesión.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <InputField
        label="NUEVA CONTRASEÑA"
        type="password"
        placeholder="••••••••"
        registration={register('newPassword')}
        error={errors.newPassword?.message}
        icon={<Lock className="text-text-muted transition-colors" size={16} />}
        className="gap-2! [&_label]:text-[10px] [&_label]:font-bold [&_label]:tracking-wider [&_label]:uppercase [&_input]:bg-sidebar"
      />

      <InputField
        label="CONFIRMAR CONTRASEÑA"
        type="password"
        placeholder="••••••••"
        registration={register('confirmPassword')}
        error={errors.confirmPassword?.message}
        icon={<Lock className="text-text-muted transition-colors" size={16} />}
        className="gap-2! [&_label]:text-[10px] [&_label]:font-bold [&_label]:tracking-wider [&_label]:uppercase [&_input]:bg-sidebar"
      />

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-brand-main hover:bg-brand-hover text-white font-medium text-sm py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 mt-4 shadow-md disabled:opacity-50 cursor-pointer"
      >
        {isPending ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <>
            <Save size={16} /> Guardar e iniciar sesión
          </>
        )}
      </button>
    </form>
  );
}
