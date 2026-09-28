import {
    DashboardError,
    DashboardErrorCode,
    DashboardResponseDto,
    PDashboardResponseDto,
} from '@/types/dashboard';
import api, { ApiError } from './client';

function mapApiError(error: unknown): never {
  if (error instanceof ApiError) {
    switch (error.response?.status) {
      case 400:
        throw new DashboardError(DashboardErrorCode.SESSION_INVALID, error.message);
      case 401:
        throw new DashboardError(DashboardErrorCode.SESSION_EXPIRED, error.message);
      case 403:
        throw new DashboardError(DashboardErrorCode.ACCESS_DENIED, error.message);
      case 404:
        throw new DashboardError(DashboardErrorCode.DISTRICT_NOT_FOUND, error.message);
      case 409:
        throw new DashboardError(DashboardErrorCode.CONFLICT, error.message);
      case 500:
        throw new DashboardError(DashboardErrorCode.SERVER_ERROR, error.message);
      default:
        throw new DashboardError(DashboardErrorCode.SERVER_ERROR, error.message);
    }
  }
  throw new DashboardError(
    DashboardErrorCode.NETWORK_ERROR,
    error instanceof Error ? error.message : 'Network error. Please check your connection.'
  );
}

export const dashboardApi = {
  async getDashboard(): Promise<DashboardResponseDto> {
    try {
      const response = await api.get('/welcome-dashboard/notifications');
      const data = response.data;
      if (!data || data.success === false) {
        throw new DashboardError(
          DashboardErrorCode.SESSION_EXPIRED,
          data?.message || 'Session expired. Please login again.'
        );
      }
      return data as DashboardResponseDto;
    } catch (error) {
      if (error instanceof DashboardError) throw error;
      return mapApiError(error);
    }
  },

  async getPDashboard(): Promise<PDashboardResponseDto> {
    try {
      const response = await api.get('/welcome-dashboard/admin-notifications');
      const data = response.data;
      if (!data || data.success === false) {
        throw new DashboardError(
          DashboardErrorCode.SESSION_EXPIRED,
          data?.message || 'Session expired. Please login again.'
        );
      }
      return data as PDashboardResponseDto;
    } catch (error) {
      if (error instanceof DashboardError) throw error;
      return mapApiError(error);
    }
  },
};
