'use client';

import { useRouter } from 'next/navigation';
import { useCreateUser } from '../hooks/useUsers';
import { AdminForm } from './AdminForm';

export function NewAdminForm() {
  const router = useRouter();
  const { mutate, isPending } = useCreateUser();

  const handleSubmit = (data: any) => {
    mutate(data, {
      onSuccess: () => router.push('/dashboard/administradores'),
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <AdminForm 
        onSubmit={handleSubmit} 
        isPending={isPending} 
        submitLabel="Crear Administrador" 
      />
    </div>
  );
}
