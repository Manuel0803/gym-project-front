'use client';

import { useRouter } from 'next/navigation';
import { useUser, useUpdateUser } from '../hooks/useUsers';
import { AdminForm } from './AdminForm';
import { FormSkeleton } from '@/common/components/ui/skeletons/FormSkeleton';

export function EditAdminForm({ id }: { id: string }) {
  const router = useRouter();
  const { data: currentUser, isLoading } = useUser(id);
  const { mutate: updateUser, isPending } = useUpdateUser();

  if (isLoading) return <FormSkeleton />;
  if (!currentUser) return <div className="text-danger-main">No se pudo cargar el administrador.</div>;

  const handleSubmit = (data: any) => {
    updateUser(
      { id, payload: data },
      { onSuccess: () => router.push('/dashboard/administradores') }
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <AdminForm 
        defaultValues={currentUser}
        onSubmit={handleSubmit} 
        isPending={isPending} 
        submitLabel="Guardar Cambios" 
        isEditMode={true}
      />
    </div>
  );
}
