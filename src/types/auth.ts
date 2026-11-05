// src/types/auth.ts
import type { UserRole, UserStatus } from './shipment';

export interface AuthUser {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly role: UserRole;
  readonly status: UserStatus;
  readonly organizationId: string;
  readonly organizationName: string;
  readonly organizationCode: string;
  readonly accountNumber: string;
  readonly phone?: string | null;
}

export interface LoginRequest {
  readonly email: string;
  readonly password: string;
}

export interface LoginResponseSuccess {
  readonly success: true;
  readonly user: AuthUser;
  readonly token: string;
  readonly redirectTo: string;
}

export interface LoginResponseError {
  readonly success: false;
  readonly error: string;
  readonly code?: 'ACCOUNT_PENDING_APPROVAL' | 'INVALID_CREDENTIALS' | 'ACCOUNT_SUSPENDED' | 'USER_NOT_FOUND';
  readonly redirectTo?: string;
}

export type LoginApiResponse = LoginResponseSuccess | LoginResponseError;
