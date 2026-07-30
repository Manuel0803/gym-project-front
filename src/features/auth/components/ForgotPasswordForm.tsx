'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForgotPassword } from '@/features/auth/hooks/useAuth';
import { InputField } from '@/common/components/ui/InputField';
import {
  ForgotPasswordFormValues,
  forgotPasswordSchema,
} from '../schemas/forgot-password.schema';
import { getSubdomain } from '@/common/utils/extract-subdomain';
import { toast } from 'react-hot-toast';
import { Mail, Send, Loader2 } from 'lucide-react';

export function ForgotPasswordForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { mutate: forgotPassword, isPending } = useForgotPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = (data: ForgotPasswordFormValues) => {
    const domain = getSubdomain();

    if (!domain) {
      toast.error('No se pudo determinar el dominio asociado al gimnasio.');
      return;
    }

    forgotPassword(
      { email: data.email, domain },
      {
        onSuccess: () => {
          setIsSubmitted(true);
        },
        onError: (error: any) => {
          toast.error(
            error.response?.data?.message ||
            'Ocurrió un error al intentar enviar el correo.'
          );
        },
      }
    );
  };

  return (
    <>
      {!isSubmitted ? (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <p className="text-sm text-text-main text-center mb-4 transition-colors">
            Ingresa tu dirección de email y te enviaremos un correo electrónico
            para reestablecer la contraseña.
          </p>

          <InputField
            label="DIRECCIÓN EMAIL"
            type="email"
            placeholder="admin@ejemplo.com"
            registration={register('email')}
            error={errors.email?.message}
            icon={
              <Mail className="text-text-muted transition-colors" size={16} />
            }
            className="gap-2! [&_label]:text-[10px] [&_label]:font-bold [&_label]:tracking-wider [&_label]:uppercase [&_input]:bg-sidebar"
          />

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-brand-main hover:bg-brand-hover text-white font-medium text-sm py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 mt-2 shadow-md disabled:opacity-50 cursor-pointer"
          >
            {isPending ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <>
                <Send size={16} /> Enviar correo de recuperación
              </>
            )}
          </button>

          <p className="text-xs text-text-main mb-4 transition-colors">
            Si no recuerdas tu correo electrónico, contacta con un administrador de ChacuGym
          </p>
        </form>
      ) : (
        <div className="flex flex-col items-center justify-center py-4 space-y-4">
          <div className="w-16 h-16 bg-brand-main/10 text-brand-main rounded-full flex items-center justify-center mb-2">
            <Mail size={32} />
          </div>
          <p className="text-sm text-text-main text-center transition-colors">
            Hemos enviado un enlace de recuperación a tu correo electrónico. Por
            favor, revisa tu bandeja de entrada o la carpeta de spam.
          </p>
          <button
            onClick={() => setIsSubmitted(false)}
            className="text-xs font-bold text-text-muted hover:text-text-main transition-colors mt-4 cursor-pointer"
          >
            ¿No recibiste el correo? Intenta de nuevo
          </button>
        </div>
      )}
    </>
  );
}
