'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { MemberListProps } from '../interfaces/members.interface';
import {
  statusStyles,
  dotStyles,
  statusTranslations,
} from '../constants/member-styles-ui.constants';
import { DeleteMemberButton } from './DeleteMemberButton';
import { MoreHorizontal, Edit, Eye } from 'lucide-react';
import { useRole } from '@/features/auth/hooks/useRole';

export function MemberList({
  name,
  memberID,
  uuid,
  status,
  phoneNumber,
  observations,
  planName,
  profileImageUrl,
}: MemberListProps & { profileImageUrl?: string }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});
  const { isAdmin } = useRole();
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const safeStatusStyles = statusStyles[status] || statusStyles['INACTIVE'];
  const safeDotStyles = dotStyles[status] || dotStyles['INACTIVE'];
  const displayStatus = statusTranslations[status] || status;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }
    
    function handleScroll() {
      if (showDropdown) {
        setShowDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleScroll, true);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [showDropdown]);

  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!showDropdown && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const dropdownHeight = isAdmin ? 110 : 70; 
      const spaceBelow = window.innerHeight - rect.bottom;
      
      let top = rect.bottom + 4;
      if (spaceBelow < dropdownHeight && rect.top > dropdownHeight) {
        top = rect.top - dropdownHeight - 4; 
      }

      setDropdownStyle({
        position: 'fixed',
        top: `${top}px`,
        right: `${window.innerWidth - rect.right}px`,
        width: '160px',
        zIndex: 9999,
      });
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  };

  const handleRowClick = () => {
    router.push(`/dashboard/miembros/${uuid}`);
  };

  const handleMouseEnter = () => {
    router.prefetch(`/dashboard/miembros/${uuid}`);
  };

  const initials =
    name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase() || 'NA';

  return (
    <div 
      onClick={handleRowClick}
      onMouseEnter={handleMouseEnter}
      className="grid grid-cols-[2fr_1fr_1.5fr_2fr_1fr_50px] gap-4 items-center px-5 py-4 border-b border-border-primary hover:bg-surface-hover transition-colors min-w-225 cursor-pointer"
    >
      <div className="min-w-0"> 
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 shrink-0 rounded-full bg-background border border-border-primary flex items-center justify-center text-xs font-bold text-text-muted relative overflow-hidden">
            {profileImageUrl ? (
              <Image 
                src={profileImageUrl} 
                alt={name} 
                fill 
                sizes="40px"
                className="object-cover" 
              />
            ) : (
              initials
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-text-main truncate">{name}</p>
            <p className="text-xs text-text-muted mt-0.5 truncate">{memberID}</p>
          </div>
        </div>
      </div>

      <div className="min-w-0">
        <span
          className={`inline-flex items-center gap-1.5 px-2 py-1 text-[10px] font-bold border rounded-full uppercase transition-colors whitespace-nowrap ${safeStatusStyles}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${safeDotStyles}`}></span>
          {displayStatus}
        </span>
      </div>

      <div className="min-w-0">
        <p className="text-sm font-medium text-text-main truncate">
          {phoneNumber || '-'}
        </p>
      </div>

      <div className="min-w-0">
        <p className="text-sm font-medium text-text-main truncate">
          {planName || 'Sin plan'}
        </p>
      </div>

      <div className="min-w-0">
        <p className="text-sm text-text-muted truncate">
          {observations || '-'}
        </p>
      </div>

      <div className="relative flex justify-end" onClick={(e) => e.stopPropagation()}>
        <button
          ref={buttonRef}
          onClick={toggleDropdown}
          className="p-1.5 rounded hover:bg-surface-hover transition-colors cursor-pointer"
        >
          <MoreHorizontal className="text-text-muted hover:text-text-main transition-colors" size={20} />
        </button>

        {showDropdown && (
          <div 
            ref={dropdownRef}
            style={dropdownStyle}
            className="bg-surface border border-border-primary rounded-md shadow-xl py-1 overflow-hidden"
          >
            <Link
              href={`/dashboard/miembros/${uuid}`}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-text-main hover:bg-surface-hover transition-colors"
            >
              <Eye size={14} className="text-brand-main" /> Ver Detalles
            </Link>
            <Link
              href={`/dashboard/miembros/${uuid}/editar`}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-text-main hover:bg-surface-hover transition-colors"
            >
              <Edit size={14} className="text-warning-main" /> Editar
            </Link>

            {isAdmin && (
              <div className="border-t border-border-primary mt-1 pt-1">
                <DeleteMemberButton
                  uuid={uuid}
                  name={name}
                  onDeleted={() => setShowDropdown(false)}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
