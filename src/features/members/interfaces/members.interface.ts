import { Payment } from '@/features/payments/interfaces/payments.interface';
import { Plan } from '../../plans/interfaces/plan.interface';

export interface Subscription {
  uuid: string;
  planUuid: string;
  startDate: string;
  endDate: string;
  status: 'ACTIVE' | 'EXPIRED' | 'CANCELLED';
  plan?: Plan;
}

export interface Member {
  uuid: string;
  dni: string;
  name: string;
  surname: string;
  birthDate: string;
  phoneNumber?: string;
  state: string;
  observations?: string;
  subscriptions?: Subscription[];
  payments?: Payment[];
}

export interface CreateMemberPayload {
  dni: string;
  name: string;
  surname: string;
  birthDate: string;
  phoneNumber?: string;
  state?: string;
  observations?: string;
}

export interface MemberListProps {
  name: string;
  memberID: string;
  uuid: string;
  status: 'Activo' | 'Vencido' | 'Inactivo' | string;
  phoneNumber: string;
  observations: string;
  planName: string;
  birthdate?: string;
}

export interface MemberProfileCardProps {
  member: {
    uuid: string;
    name: string;
    surname: string;
    birthDate: string;
    phoneNumber?: string;
    observations?: string;
    state?: string;
  };
  displayStatus: string;
  safeStatusStyles: string;
  defaultAmount: number;
}

export type UpdateMemberPayload = Partial<CreateMemberPayload>;
