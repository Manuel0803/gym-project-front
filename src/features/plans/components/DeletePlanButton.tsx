'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDeletePlan } from '../hooks/usePlans';
import { DeletePlanButtonProps } from '../interfaces/plan.interface';
import { Modal } from '@/common/components/ui/Modal';
import { Loader2, Trash2, AlertTriangle } from 'lucide-react';

export function DeletePlanButton({
  id,
  planName,
  disabled,
}: DeletePlanButtonProps) {
  const router = useRouter();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { mutate: deletePlan, isPending: isDeleting } = useDeletePlan();

  const confirmDelete = () => {
    deletePlan(id, {
      onSuccess: () => {
        setIsDeleteModalOpen(false);
        router.push('/dashboard/planes');
      },
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsDeleteModalOpen(true)}
        disabled={disabled}
        className="bg-transparent text-danger-main hover:bg-danger-surface text-sm font-medium py-2 px-4 rounded-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-50 cursor-pointer"
      >
        <Trash2 size={16} />
        Eliminar plan
      </button>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Eliminar Plan"
      >
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3 text-danger-main bg-danger-surface p-3 rounded border border-danger-main">
            <AlertTriangle size={24} className="shrink-0" />
            <p className="text-sm">
              Esta acción no se puede deshacer. Los socios que actualmente
              tienen este plan no lo perderán, pero ya no estará disponible para
              nuevas asignaciones.
            </p>
          </div>

          <p className="text-text-main">
            ¿Estás seguro de que deseas eliminar el plan{' '}
            <strong>&quot;{planName}&quot;</strong>?
          </p>

          <div className="flex justify-end gap-3 mt-4">
            <button
              type='button'
              onClick={() => setIsDeleteModalOpen(false)}
              disabled={isDeleting}
              className="px-4 py-2 text-sm font-medium text-text-main border border-border-primary hover:bg-surface-hover transition-colors rounded cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type='button'
              onClick={confirmDelete}
              disabled={isDeleting}
              className="px-4 py-2 text-sm font-medium text-white bg-danger-main hover:bg-danger-hover transition-colors rounded flex items-center gap-2 cursor-pointer"
            >
              {isDeleting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                'Sí, eliminar plan'
              )}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
