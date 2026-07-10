export interface DashboardResponseDto {
  Name: string;
  Role: string;
  District: string;
  PendingPUC: number;
  PendingPayana: number;
  PendingProfessional: number;
  PendingSemiProfessional: number;
  PendingHousePUC: number;
  PendingHousePayana: number;
  PendingPUCRenewal: number;
  PendingPayanaRenewal: number;
  PendingVisitPUC: number;
  PendingVisitPayana: number;
}

export interface PDashboardResponseDto {
  Name: string;
  Role: string;
  PendingPUC: number;
  PendingPayana: number;
  PendingProfessional: number;
  PendingSemiProfessional: number;
  PendingHousePUC: number;
  PendingHousePayana: number;
  PendingPUCRenewal: number;
  PendingPayanaRenewal: number;
}

export enum DashboardErrorCode {
  SESSION_INVALID = 'SESSION_INVALID',
  SESSION_EXPIRED = 'SESSION_EXPIRED',
  ACCESS_DENIED = 'ACCESS_DENIED',
  DISTRICT_NOT_FOUND = 'DISTRICT_NOT_FOUND',
  CONFLICT = 'CONFLICT',
  SERVER_ERROR = 'SERVER_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
}

export class DashboardError extends Error {
  code: DashboardErrorCode;

  constructor(code: DashboardErrorCode, message?: string) {
    super(message ?? code);
    this.name = 'DashboardError';
    this.code = code;
  }
}
