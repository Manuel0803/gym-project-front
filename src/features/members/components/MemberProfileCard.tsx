import Link from 'next/link';
import Image from 'next/image';
import { MemberProfileCardProps } from '../interfaces/members.interface';
import RegisterPaymentButton from '@/features/payments/components/RegisterPaymentButton';
import { Pencil, User, HeartPulse } from 'lucide-react';

export function MemberProfileCard({
  member,
  displayStatus,
  safeStatusStyles,
  defaultAmount,
}: MemberProfileCardProps) {
  return (
    <div className="lg:col-span-1 bg-surface border border-border-primary rounded-lg p-6 flex flex-col transition-colors">
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm font-bold text-text-main">
          Perfil del Miembro
        </span>
        <span
          className={`px-2.5 py-1 rounded-md border text-[10px] font-bold tracking-widest uppercase ${safeStatusStyles}`}
        >
          {displayStatus}
        </span>
      </div>

      <div className="flex flex-col items-center mb-8 pt-4 border-t border-border-primary">
        <div className="w-24 h-24 bg-background border border-border-primary rounded-full flex items-center justify-center mb-4 shadow-inner relative overflow-hidden">
          {member.profileImageUrl ? (
            <Image
              src={member.profileImageUrl}
              alt={`Foto de ${member.name}`}
              fill
              sizes="96px"
              className="object-cover"
            />
          ) : (
            <User size={40} className="text-text-muted" />
          )}
        </div>
        <h2 className="text-xl font-bold text-text-main text-center">
          {member.name} {member.surname}
        </h2>
      </div>

      <div className="flex flex-col gap-6 border-t border-border-primary pt-6">
        <div className="flex flex-col gap-1">
          <span className="text-xs text-text-muted font-bold uppercase tracking-wider">
            Teléfono
          </span>
          <span className="text-sm text-text-main">
            {member.phoneNumber || '-'}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs text-text-muted font-bold uppercase tracking-wider">
            Fecha de nacimiento
          </span>
          <span className="text-sm text-text-main">
            {new Date(member.birthDate).toLocaleDateString('es-ES')}
          </span>
        </div>

        {member.emergencyContact && (
          <div className="flex flex-col gap-3 mt-2 p-3 bg-danger-main/5 border border-danger-main/20 rounded-md">
            <div className="flex items-center gap-2">
              <HeartPulse size={16} className="text-danger-main" />
              <span className="text-xs font-bold text-danger-main uppercase tracking-wider">
                Contacto de Emergencia
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-sm font-bold text-text-main">
                {member.emergencyContact.name} ({member.emergencyContact.relationship})
              </span>
              <span className="text-sm text-text-main">
                {member.emergencyContact.phoneNumber}
              </span>
            </div>
          </div>
        )}

        {member.observations && (
          <div className="flex flex-col gap-1">
            <span className="text-xs text-text-muted font-bold uppercase tracking-wider">
              Observaciones
            </span>
            <span className="text-sm text-text-main">
              {member.observations}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3 mt-8 pt-6 border-t border-border-primary">
        <RegisterPaymentButton
          memberName={member.name}
          memberSurname={member.surname}
          uuid={member.uuid}
          defaultAmount={defaultAmount}
        />
        <Link
          href={`/dashboard/miembros/${member.uuid}/editar`}
          className="w-full py-2.5 bg-transparent border border-border-primary hover:bg-surface-hover text-text-main font-medium text-sm transition-colors rounded-sm flex items-center justify-center gap-2"
        >
          <Pencil size={16} /> Editar datos
        </Link>
      </div>
    </div>
  );
}
