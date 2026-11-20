import api, { ApiError } from './client';

export interface LoginRequest {
  Email: string;
  Password: string;
}

export interface LoginResponse {
  Success: boolean;
  UserID: number;
  UserName: string;
  Role: string;
  EmployeeID: number;
  AssignedRole: string;
  District: string;
  Token: string;
  DistrictID: string;
  OtherDistrict: string;
}

export const authApi = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await api.post('/registration/login', credentials);
      // Never log the response — it contains the JWT and user PII.
      return response.data as LoginResponse;
    } catch (error) {
      if (error instanceof ApiError) {
        // Handle specific error cases
        if (error.response?.status === 401) {
          throw new Error('Invalid credentials');
        }
        if (error.response?.status === 400) {
          const data = error.response?.data;
          const message =
            (typeof data === 'object' && data?.Message) ||
            (typeof data === 'string' && data) ||
            error.message ||
            'Account inactive.';
          throw new Error(message);
        }
        throw new Error(error.message || 'Login failed');
      }
      // Network errors
      if (error instanceof Error) {
        if (error.message.includes('Network request failed')) {
          throw new Error('Cannot connect to server. Check your internet or API URL.');
        }
        throw new Error(error.message);
      }
      throw new Error('Network error. Please try again.');
    }
  },
};
