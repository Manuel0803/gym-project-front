import { AuthResponse } from './auth.interface';

export interface AuthState {
  token: string | null;
  refreshToken: string | null;
  user: AuthResponse['user'] | null;
  domain: string | null;

  setLogin: (data: AuthResponse, domain: string) => void;
  setTokens: (accessToken: string, refreshToken: string) => void; 
  setLogout: () => void;
}
