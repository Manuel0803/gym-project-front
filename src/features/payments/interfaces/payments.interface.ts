export type PaymentMethod =
  | 'CASH'
  | 'CREDIT_CARD'
  | 'DEBIT_CARD'
  | 'MERCADO_PAGO'
  | 'BANK_TRANSFER'
  | 'OTHER';

export interface Payment {
  uuid: string;
  date: string;
  paymentMethod: PaymentMethod;
  amountPaid: number;
  notes?: string;
  isVoided: boolean;
  memberUuid: string;
}

export interface CreatePaymentPayload {
  paymentMethod: PaymentMethod;
  amountPaid: number;
  notes?: string;
  memberUuid: string;
}

export interface UpdatePaymentPayload {
  paymentMethod?: PaymentMethod;
  amountPaid?: number;
  notes?: string;
  date?: string;
}

export interface PaymentFormProps {
  memberName: string;
  memberSurname: string;
  uuid: string;
  defaultAmount: number;
  onSuccess: () => void;
  onCancel: () => void;
  isNewMember?: boolean;
}

export interface EditPaymentFormProps {
  payment: Payment;
  onSuccess: () => void;
  onCancel: () => void;
}

export interface PaymentHistoryTableProps {
  payments: Payment[];
}

export interface RegisterPaymentButtonProps {
  memberName: string;
  memberSurname: string;
  uuid: string;
  defaultAmount: number;
}
