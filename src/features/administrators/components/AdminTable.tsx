'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { useUsers } from '../hooks/useUsers';
import { AdminRow } from './AdminRow';
import { TableSkeleton } from '@/common/components/ui/skeletons/TableSkeleton';
import { ChevronRight, ChevronLeft, Loader2, AlertCircle } from 'lucide-react';

const ITEMS_PER_PAGE = 5;

export function AdminTable() {
  const searchParams = useSearchParams();
  const q = searchParams.get('q') || undefined;
  
  const [currentPage, setCurrentPage] = useState(1);
  const currentUserUuid = useAuthStore((state) => state.user?.uuid);

  useEffect(() => {
    setCurrentPage(1);
  }, [q]);

  const { data, isLoading, isError, isFetching } = useUsers(currentPage, ITEMS_PER_PAGE, q);

  if (isLoading && currentPage === 1) return <TableSkeleton />;

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-64 w-full bg-surface border border-danger-main/20 rounded-lg">
        <AlertCircle className="w-8 h-8 text-danger-main mb-4" />
        <p className="text-text-main text-sm">Error al cargar la lista.</p>
      </div>
    );
  }

  const admins = data?.data || [];
  const meta = data?.meta;
  const totalPages = meta?.lastPage || 1;

  return (
    <div className="bg-surface border border-border-primary rounded-lg flex flex-col overflow-hidden relative">
      
      {isFetching && currentPage > 1 && (
        <div className="absolute inset-0 bg-surface/50 flex flex-col items-center justify-center z-10 backdrop-blur-[1px]">
          <Loader2 className="w-6 h-6 text-brand-main animate-spin" />
        </div>
      )}

      <div className="overflow-x-auto">
        <div className="min-w-150">
          <div className="grid grid-cols-[2fr_1fr_2fr_100px] gap-4 items-center px-5 py-3 border-b border-border-primary bg-background text-[10px] font-bold text-text-muted tracking-widest uppercase">
            <div>Administrador e ID</div>
            <div>Rol</div>
            <div>Email</div>
            <div className="text-center">Acciones</div>
          </div>

          <div className="flex flex-col">
            {admins.length > 0 ? (
              admins.map((admin) => (
                <AdminRow
                  key={admin.uuid}
                  admin={admin}
                  isCurrentUser={admin.uuid === currentUserUuid}
                />
              ))
            ) : (
              <p className="text-center text-text-muted py-8 text-sm">
                No se encontraron administradores.
              </p>
            )}
          </div>
        </div>
      </div>

      {totalPages > 0 && (
        <div className="flex items-center justify-between px-5 py-4 border-t border-border-primary">
          <p className="text-sm text-text-muted">
            Mostrando página {currentPage} de {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1 || isFetching}
              className="p-1 text-text-muted hover:text-text-main disabled:opacity-50 disabled:hover:text-text-muted transition-colors cursor-pointer disabled:cursor-not-allowed"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages || isFetching}
              className="p-1 text-text-muted hover:text-text-main disabled:opacity-50 disabled:hover:text-text-muted transition-colors cursor-pointer disabled:cursor-not-allowed"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
