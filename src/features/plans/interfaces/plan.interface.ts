export interface Plan {
  uuid: string;
  name: string;
  price: number;
  durationDays: number;
  description?: string;
  isActive?: boolean;
}

export interface CreatePlanPayload {
  name: string;
  price: number;
  durationDays: number;
  description?: string;
}

export interface DeletePlanButtonProps {
  id: string;
  planName: string;
  disabled?: boolean;
}

export type UpdatePlanPayload = Partial<CreatePlanPayload> & { isActive?: boolean };
