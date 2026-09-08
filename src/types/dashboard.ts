interface NotificationCounts {
  pendingPUC: number;
  pendingPayana: number;
  pendingProfessional: number;
  pendingSemiProfessional?: number;
  pendingHousePUC: number;
  pendingHousePayana: number;
  pendingPUCRenewal: number;
  pendingPayanaRenewal: number;
  pendingVisitPUC?: number;
  pendingVisitPayana?: number;
}

export interface DashboardResponseDto {
  success: boolean;
  notifications: NotificationCounts;
  totalPending: number;
}

export interface PDashboardResponseDto {
  success: boolean;
  notifications: NotificationCounts;
  totalPending: number;
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
