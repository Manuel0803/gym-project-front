'use client';

import { useState } from 'react';
import { useDeactivateMember } from '@/features/members/hooks/useMembers';
import { Modal } from '@/common/components/ui/Modal';
import { DeleteMemberButtonProps } from '../interfaces/delete-member-button.interface';
import { Loader2, UserMinus, UserX } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

export function DeleteMemberButton({
  uuid,
  name,
  onDeleted,
}: DeleteMemberButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const deactivateMemberMutation = useDeactivateMember();
  const queryClient = useQueryClient();

  const isPending = deactivateMemberMutation.isPending;

  const handleDeactivate = () => {
    deactivateMemberMutation.mutate(uuid, {
      onSuccess: () => {
        setIsModalOpen(false);
        toast.success(`El socio ${name} fue dado de baja.`);
        
        if (onDeleted) onDeleted();
        
        queryClient.invalidateQueries({ queryKey: ['members'] });
        queryClient.invalidateQueries({ queryKey: ['member', uuid] });
      },
      onError: (error: any) => {
        const message = error.response?.data?.message || 'Error al dar de baja al socio';
        toast.error(message);
      }
    });
  };

  return (
    <>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsModalOpen(true);
        }}
        className="w-full flex items-center gap-2 px-3 py-2 text-xs text-danger-main hover:bg-danger-main/10 transition-colors cursor-pointer font-medium"
      >
        <UserX size={14} /> Dar de baja
      </button>

      <Modal
        isOpen={isModalOpen}
        onClose={() => !isPending && setIsModalOpen(false)}
        title="Dar de baja al socio"
      >
        <div className="flex flex-col gap-4">
          <p className="text-sm text-text-main">
            Estás a punto de dar de baja a <strong>{name}</strong>.
          </p>

          <div className="p-4 border border-warning-main/30 bg-warning-surface rounded-lg flex flex-col gap-2">
            <div className="flex items-center gap-2 text-warning-main font-bold">
              <UserMinus size={18} />
              <h3>¿Qué sucederá?</h3>
            </div>
            <ul className="text-xs text-text-main list-disc pl-4 mt-1 space-y-1">
              <li>El socio pasará a estado <span className="font-bold">INACTIVO</span>.</li>
              <li>Su plan actual y los planes programados se <span className="font-bold">cancelarán</span>.</li>
              <li>Mantendrás todo su historial de pagos para los reportes.</li>
            </ul>
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <button
              onClick={() => setIsModalOpen(false)}
              disabled={isPending}
              className="px-4 py-2 text-sm font-medium text-text-main border border-border-primary hover:bg-surface-hover transition-colors rounded cursor-pointer disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleDeactivate}
              disabled={isPending}
              className="py-2 px-6 text-sm font-medium text-white bg-danger-main hover:bg-opacity-90 transition-colors rounded flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Procesando...</>
              ) : (
                'Confirmar Baja'
              )}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
