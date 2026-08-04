import { httpClient } from '@/core/api/axios.adapter';
import {
  CreatePaymentPayload,
  Payment,
  UpdatePaymentPayload,
} from '../interfaces/payments.interface';
import { PaginatedResult } from '@/common/interfaces/pagination.interface';

export class PaymentsService {
  private static readonly ENDPOINT = '/payments';

  static async getAll(
    page: number = 1,
    limit: number = 10,
    memberUuid?: string,
    status?: string
  ): Promise<PaginatedResult<Payment>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    
    if (memberUuid) params.append('memberUuid', memberUuid);
    if (status) params.append('status', status);

    return await httpClient.get<PaginatedResult<Payment>>(
      `${this.ENDPOINT}?${params.toString()}`
    );
  }

  static async getById(id: string): Promise<Payment> {
    return await httpClient.get<Payment>(`${this.ENDPOINT}/${id}`);
  }

  static async create(payload: CreatePaymentPayload): Promise<Payment> {
    return await httpClient.post(this.ENDPOINT, payload);
  }

  static async update(
    id: string,
    payload: UpdatePaymentPayload
  ): Promise<Payment> {
    return await httpClient.patch(`${this.ENDPOINT}/${id}`, payload);
  }

  static async remove(id: string): Promise<Payment> {
    return await httpClient.delete(`${this.ENDPOINT}/${id}`);
  }
}
