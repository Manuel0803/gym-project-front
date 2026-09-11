'use client';

import { useState, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { useMembers } from '../hooks/useMembers';
import { MemberList } from '@/features/members/components/MemberList';
import { TableSkeleton } from '@/common/components/ui/skeletons/TableSkeleton';
import { ChevronRight, ChevronLeft, Loader2 } from 'lucide-react';

export function MembersDirectory() {
  const [filter, setFilter] = useState<
    'RELEVANT' | 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'
  >('RELEVANT');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const searchParams = useSearchParams();
  const q = searchParams.get('q') || undefined;

  const prevQRef = useRef(q);
  if (prevQRef.current !== q) {
    prevQRef.current = q;
    setCurrentPage(1);
  }

  const stateQuery = filter === 'RELEVANT' ? 'ACTIVE,SUSPENDED' : filter;
  
  const { data: response, isLoading } = useMembers(
    currentPage,
    itemsPerPage,
    q,
    stateQuery
  );

  const members = response?.data || [];
  const meta = response?.meta;
  const totalPages = meta?.lastPage || 1;

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const now = new Date();
  now.setHours(0, 0, 0, 0);

  if (isLoading && members.length === 0) {
    return <TableSkeleton />;
  }

  return (
    <div className="bg-background flex flex-col gap-6">
      <div className="flex justify-end">
        <div className="flex items-center gap-4">
          <div className="flex bg-surface border border-border-primary rounded-lg p-1">
            <button
              onClick={() => {
                setFilter('RELEVANT');
                setCurrentPage(1);
              }}
              className={`px-4 py-1.5 text-[10px] font-bold rounded transition-colors tracking-wider uppercase cursor-pointer ${filter === 'RELEVANT' ? 'bg-brand-main text-white ' : 'text-text-muted hover:text-text-main'}`}
            >
              Frecuentes
            </button>
            <button
              onClick={() => {
                setFilter('ACTIVE');
                setCurrentPage(1);
              }}
              className={`px-4 py-1.5 text-[10px] font-bold rounded transition-colors tracking-wider uppercase cursor-pointer ${filter === 'ACTIVE' ? 'bg-brand-main text-white ' : 'text-text-muted hover:text-text-main'}`}
            >
              Activos
            </button>
            <button
              onClick={() => {
                setFilter('SUSPENDED');
                setCurrentPage(1);
              }}
              className={`px-4 py-1.5 text-[10px] font-bold rounded transition-colors tracking-wider uppercase cursor-pointer ${filter === 'SUSPENDED' ? 'bg-brand-main text-white ' : 'text-text-muted hover:text-text-main'}`}
            >
              Suspendidos
            </button>
            <button
              onClick={() => {
                setFilter('INACTIVE');
                setCurrentPage(1);
              }}
              className={`px-4 py-1.5 text-[10px] font-bold rounded transition-colors tracking-wider uppercase cursor-pointer ${filter === 'INACTIVE' ? 'bg-brand-main text-white ' : 'text-text-muted hover:text-text-main'}`}
            >
              Bajas
            </button>
          </div>
        </div>
      </div>

      <div className="bg-surface border border-border-primary rounded-lg flex flex-col overflow-hidden">
        <div className="overflow-x-auto">
          <div className="min-w-250">
            <div className="grid grid-cols-[2fr_1fr_1.5fr_2fr_1fr_50px] gap-4 items-center px-5 py-3 border-b border-border-primary bg-background min-w-225">
              <h5 className="text-[10px] font-bold text-text-muted tracking-widest uppercase">NOMBRE Y DNI</h5>
              <h5 className="text-[10px] font-bold text-text-muted tracking-widest uppercase">ESTADO</h5>
              <h5 className="text-[10px] font-bold text-text-muted tracking-widest uppercase">TELÉFONO</h5>
              <h5 className="text-[10px] font-bold text-text-muted tracking-widest uppercase">PLAN</h5>
              <h5 className="text-[10px] font-bold text-text-muted tracking-widest uppercase">OBSERVACIONES</h5> 
              <h5 className="text-[10px] font-bold text-text-muted tracking-widest uppercase text-right">ACCIONES</h5>
            </div>

            <div className="flex flex-col relative">
              {isLoading && members.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 z-10">
                  <Loader2 className="w-8 h-8 text-brand-main animate-spin mb-3" />
                  <p className="text-text-muted text-sm">
                    Cargando información de miembros...
                  </p>
                </div>
              )}
              {isLoading && members.length > 0 && (
                <div className="absolute inset-0 bg-surface/80 flex flex-col items-center justify-center z-10 backdrop-blur-[1px]">
                  <Loader2 className="w-8 h-8 text-brand-main animate-spin mb-3" />
                  <p className="text-text-muted text-sm">
                    Cargando información de miembros...
                  </p>
                </div>
              )}
              {members.length > 0
                ? members.map((member) => {
                    const activeSub = 
                      member.subscriptions?.find(
                        (sub) => sub.status === 'ACTIVE' && new Date(sub.startDate) <= now && new Date(sub.endDate) > now
                      ) ||
                      member.subscriptions?.find(
                        (sub) => sub.status === 'ACTIVE' && new Date(sub.endDate) > now
                      );
                      
                    const planName = activeSub?.plan?.name || 'Sin plan';
                    
                    let dynamicState = member.state;
                    if (dynamicState === 'ACTIVE' && !activeSub) {
                      dynamicState = 'SUSPENDED';
                    }

                    return (
                      <MemberList
                        key={member.uuid}
                        name={`${member.name} ${member.surname}`}
                        memberID={member.dni}
                        uuid={member.uuid}
                        status={dynamicState}
                        phoneNumber={member.phoneNumber || ''}
                        observations={member.observations || ''}
                        planName={planName}
                      />
                    );
                  })
                : !isLoading && (
                  <div className="flex-1 flex items-center justify-center py-10 text-sm text-text-muted">
                    No hay miembros que coincidan con los filtros.
                  </div>
                )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between px-5 py-4 border-t border-border-primary">
          <p className="text-sm text-text-muted">
            Mostrando página {currentPage} de {totalPages || 1}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1 || isLoading}
              className="p-1 text-text-muted hover:text-text-main disabled:opacity-50 disabled:hover:text-text-muted transition-colors cursor-pointer disabled:cursor-not-allowed"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={handleNextPage}
              disabled={currentPage >= totalPages || isLoading}
              className="p-1 text-text-muted hover:text-text-main disabled:opacity-50 disabled:hover:text-text-muted transition-colors cursor-pointer disabled:cursor-not-allowed"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
