import { httpClient } from '@/core/api/axios.adapter';
import { AuthResponse, LoginPayload } from '../interfaces/auth.interface';

export class AuthService {
  static async login(payload: LoginPayload): Promise<AuthResponse> {
    return await httpClient.post<AuthResponse>('auth/login', payload);
  }

  static async forgotPassword(payload: {
    email: string;
    domain: string;
  }): Promise<{ message: string }> {
    const data = await httpClient.post<{ message: string }>(
      'auth/forgot-password',
      payload
    );
    return data;
  }

  static async resetPassword(payload: {
    token: string;
    newPassword: string;
  }): Promise<{ message: string }> {
    const data = await httpClient.post<{ message: string }>(
      'auth/reset-password',
      payload
    );
    return data;
  }

  static async logout(): Promise<{ message: string }> {
    return await httpClient.post<{ message: string }>('auth/logout');
  }
}
