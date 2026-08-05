'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { useChangePassword } from '@/features/administrators/hooks/useUsers';
import {
  configSecuritySchema,
  SecurityFormValues,
} from '@/features/configuration/schemas/config.schema';
import { InputField } from '@/common/components/ui/InputField';
import { Save, Eye, EyeOff, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

export function SecurityTab() {
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const userId = useAuthStore((state) => state.user?.uuid);

  const { mutate: changePassword, isPending } = useChangePassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SecurityFormValues>({
    resolver: zodResolver(configSecuritySchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
  });

  const onSubmit = (data: SecurityFormValues) => {
    if (!userId) return;

    const payload = {
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    };

    changePassword(
      { id: userId, payload },
      {
        onSuccess: () => {
          toast.success('Contraseña actualizada con éxito');
          reset();
        },
        onError: (error: any) => {
          const errorMessage =
            error.response?.data?.message ||
            'Ocurrió un error al actualizar la contraseña';
          toast.error(errorMessage);
        },
      }
    );
  };

  return (
    <div className="p-6 md:p-8 flex flex-col gap-8 animate-in fade-in duration-300">
      <form onSubmit={handleSubmit(onSubmit)}>
        <h2 className="text-lg font-bold text-text-main mb-1">
          Seguridad de la Cuenta
        </h2>
        <p className="text-sm text-text-muted mb-6">
          Gestiona tus credenciales y métodos de Autenticación.
        </p>

        <div className="max-w-md flex flex-col gap-5">
          <InputField
            label="Contraseña Actual"
            type={showCurrentPass ? 'text' : 'password'}
            placeholder="••••••••"
            disabled={isPending}
            registration={register('currentPassword')}
            error={errors.currentPassword?.message}
            rightElement={
              <button
                type="button"
                disabled={isPending}
                onClick={() => setShowCurrentPass(!showCurrentPass)}
                className="text-text-muted hover:text-text-main disabled:opacity-50"
              >
                {showCurrentPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            }
          />

          <InputField
            label="Nueva Contraseña"
            type={showNewPass ? 'text' : 'password'}
            placeholder="••••••••"
            disabled={isPending}
            registration={register('newPassword')}
            error={errors.newPassword?.message}
            rightElement={
              <button
                type="button"
                disabled={isPending}
                onClick={() => setShowNewPass(!showNewPass)}
                className="text-text-muted hover:text-text-main disabled:opacity-50"
              >
                {showNewPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            }
          />

          <InputField
            label="Confirmar Nueva Contraseña"
            type={showConfirmPass ? 'text' : 'password'}
            placeholder="••••••••"
            disabled={isPending}
            registration={register('confirmNewPassword')}
            error={errors.confirmNewPassword?.message}
            rightElement={
              <button
                type="button"
                disabled={isPending}
                onClick={() => setShowConfirmPass(!showConfirmPass)}
                className="text-text-muted hover:text-text-main disabled:opacity-50"
              >
                {showConfirmPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            }
          />

          <button
            type="submit"
            disabled={isPending}
            className="w-fit flex items-center justify-center gap-2 px-6 py-2.5 mt-2 bg-brand-main hover:bg-brand-hover text-white rounded-sm font-medium text-sm transition-colors  disabled:opacity-50 cursor-pointer"
          >
            {isPending ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Save size={16} />
            )}
            <span>
              {isPending ? 'Actualizando...' : 'Actualizar Contraseña'}
            </span>
          </button>
        </div>
      </form>

      <hr className="border-border-primary" />

      <div>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-text-main">
              Autenticación de Dos Factores (2FA)
            </h3>
            <p className="text-xs text-text-muted mt-1">
              Añade una capa extra de seguridad a tu cuenta.
            </p>
          </div>
          <button className="px-6 py-2.5 bg-brand-main/10 text-brand-main hover:bg-brand-main/20 rounded-sm text-sm font-medium transition-colors ">
            Próximamente
          </button>
        </div>
      </div>
    </div>
  );
}
