'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLogin } from '../hooks/useAuth';
import { LoginFormValues, loginSchema } from '../schemas/login.schema';
import { InputField } from '@/common/components/ui/InputField';
import { getSubdomain } from '@/common/utils/extract-subdomain';
import { Mail, Lock, EyeOff, Eye, Loader2 } from 'lucide-react';

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const { mutate, isPending } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    const domain = getSubdomain();

    mutate({
      email: data.email,
      password: data.password,
      domain: domain,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <InputField
        label="DIRECCIÓN EMAIL"
        type="email"
        placeholder="admin@chacugym.com"
        disabled={isPending}
        registration={register('email')}
        error={errors.email?.message}
        icon={<Mail className="text-text-muted transition-colors" size={16} />}
        className="gap-2! [&_label]:text-[10px] [&_label]:font-bold [&_label]:tracking-wider [&_label]:uppercase [&_input]:bg-sidebar"
      />

      <InputField
        label="CONTRASEÑA"
        type={showPassword ? 'text' : 'password'}
        placeholder="••••••••"
        disabled={isPending}
        registration={register('password')}
        error={errors.password?.message}
        icon={<Lock className="text-text-muted transition-colors" size={16} />}
        labelRightElement={
          <Link
            href="/recuperar-contrasenia"
            className="text-[12px] font-bold text-text-muted hover:text-text-main transition-colors"
          >
            ¿Has olvidado la contraseña?
          </Link>
        }
        rightElement={
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            disabled={isPending}
            className="text-text-muted hover:text-text-main transition-colors focus:outline-none"
          >
            {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
          </button>
        }
        className="gap-2! [&_label]:text-[10px] [&_label]:font-bold [&_label]:tracking-wider [&_label]:uppercase [&_input]:bg-sidebar"
      />

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-brand-main hover:bg-brand-hover disabled:bg-brand-main/50 text-white font-medium text-sm py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 mt-2 shadow-md  cursor-pointer"
      >
        {isPending ? (
          <>
            <Loader2 className="animate-spin" size={16} />
            Iniciando...
          </>
        ) : (
          <>
            Iniciar Sesión <span className="text-lg leading-none">→</span>
          </>
        )}
      </button>
    </form>
  );
}
