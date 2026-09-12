import { httpClient } from '@/core/api/axios.adapter';
import { DashboardMetrics } from '../interfaces/metrics.interface';

export class DashboardService {
  private static readonly ENDPOINT = '/metrics';

  static async getMetrics(year?: string): Promise<DashboardMetrics> {
    const params = year && year !== 'rolling' ? { year } : undefined;
    return await httpClient.get<DashboardMetrics>(this.ENDPOINT, { params });
  }
}

