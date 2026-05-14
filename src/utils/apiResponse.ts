import { StandardApiResponse } from '@/types/api';

export const extractApiData = <T>(response: StandardApiResponse<T>): T | undefined => {
  return response.Data;
};

export const extractApiMessage = <T>(response: StandardApiResponse<T>): string => {
  return response.Message;
};

export const isApiSuccess = <T>(response: StandardApiResponse<T>): boolean => {
  return response.Status === true;
};
