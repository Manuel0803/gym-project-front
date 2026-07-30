import { Roles } from './roles.interface';

export interface LoginPayload {
  email: string;
  password: string;
  domain: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: {
    uuid: string;
    name: string;
    email: string;
    role: Roles;
    gymUuid: string;
  };
}

export interface RefreshResponse {
  access_token: string;
  refresh_token: string;
}
