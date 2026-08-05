'use client';

import Link from 'next/link';
import { AdminRowProps } from '../interfaces/admin-row.interface';
import { DeleteAdminButton } from './DeleteAdminButton';
import { MoreHorizontal, Edit, ShieldAlert } from 'lucide-react';
import { useFloatingDropdown } from '../hooks/useFloatingDropdown';

export function AdminRow({ admin, isCurrentUser }: AdminRowProps) {
  const { isOpen, setIsOpen, toggleDropdown, dropdownStyle, buttonRef, dropdownRef } = useFloatingDropdown(70);

  const fullName = `${admin.name} ${admin.surname}`;
  const initials = admin.name[0] + admin.surname[0];

  return (
    <div className="grid grid-cols-[2fr_1fr_2fr_100px] gap-4 items-center px-5 py-4 border-b border-border-primary hover:bg-surface-hover transition-colors last:border-b-0">
      <div className="min-w-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 shrink-0 rounded-full bg-background border border-border-primary flex items-center justify-center text-xs font-bold text-text-muted uppercase">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-text-main flex items-center gap-2 truncate">
              {fullName}
              {isCurrentUser && (
                <span className="text-[9px] bg-brand-main/10 text-brand-main px-1.5 py-0.5 rounded font-bold uppercase shrink-0">Tú</span>
              )}
            </p>
            <p className="text-xs text-text-muted mt-0.5 truncate">{admin.dni}</p>
          </div>
        </div>
      </div>

      <div className="min-w-0">
        <span className="inline-flex items-center px-2 py-1 text-[10px] font-bold bg-blue-50 text-blue-600 border border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20 rounded-full uppercase">
          {admin.role}
        </span>
      </div>

      <div className="min-w-0">
        <p className="text-sm font-light text-text-main truncate pr-4">{admin.email}</p>
      </div>

      <div className="relative flex justify-center">
        <button
          ref={buttonRef}
          onClick={toggleDropdown}
          className="p-1 rounded hover:bg-surface transition-colors cursor-pointer"
        >
          <MoreHorizontal className="text-text-muted hover:text-text-main" />
        </button>

        {isOpen && (
          <div 
            ref={dropdownRef}
            style={dropdownStyle}
            className="bg-surface border border-border-primary rounded-md shadow-lg py-1 overflow-hidden"
          >
            <Link
              href={`/dashboard/administradores/${admin.uuid}/editar`}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs text-text-main hover:bg-surface-hover transition-colors"
            >
              <Edit size={14} className="text-text-muted" /> Editar
            </Link>

            {isCurrentUser ? (
              <button disabled className="w-full flex items-center gap-2 px-3 py-2 text-xs text-text-muted bg-surface-hover cursor-not-allowed" title="No puedes eliminar tu propia cuenta">
                <ShieldAlert size={14} /> Eliminar
              </button>
            ) : (
              <DeleteAdminButton admin={admin} onDeleted={() => setIsOpen(false)} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
