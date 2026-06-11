import api, { ApiError } from './client';
import { environment } from '@/config/environment';
import { Linking } from 'react-native';

export interface RegisterRequest {
  Role: string;
  DistrictID?: number;
  OtherDistrict?: string;
  Taluk?: string;
  Name: string;
  Email: string;
  Password: string;
  Mobile: string;
  Address: string;
}

export interface RegisterResponse {
  Success: boolean;
  Message: string;
}

export interface ForgotPasswordRequest {
  Email: string;
}

export interface ForgotPasswordResponse {
  Success: boolean;
  Message: string;
}

export interface ResetPasswordRequest {
  Email: string;
  NewPassword: string;
}

export interface ResetPasswordResponse {
  Success: boolean;
  Message: string;
}

export const registrationApi = {
  async register(data: RegisterRequest): Promise<RegisterResponse> {
    try {
      const response = await api.post('/registration/register', data);
      return response.data as RegisterResponse;
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.response?.status === 409) {
          throw new Error('An account with this email already exists.');
        }
        if (error.response?.status === 400) {
          const msg = error.response?.data?.Message || error.response?.data || 'Invalid registration data.';
          throw new Error(typeof msg === 'string' ? msg : 'Invalid registration data.');
        }
        throw new Error(error.message || 'Registration failed. Please try again.');
      }
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error('Network error. Please try again.');
    }
  },

  async forgotPassword(data: ForgotPasswordRequest): Promise<ForgotPasswordResponse> {
    try {
      const response = await api.post('/registration/forgotpassword', data);
      return response.data as ForgotPasswordResponse;
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.response?.status === 404) {
          throw new Error('No account found with this email address.');
        }
        if (error.response?.status === 400) {
          const msg = error.response?.data?.Message || error.response?.data || 'Invalid email.';
          throw new Error(typeof msg === 'string' ? msg : 'Invalid email.');
        }
        throw new Error(error.message || 'Failed to verify email. Please try again.');
      }
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error('Network error. Please try again.');
    }
  },

  async resetPassword(data: ResetPasswordRequest): Promise<ResetPasswordResponse> {
    try {
      const response = await api.post('/registration/resetpassword', data);
      return response.data as ResetPasswordResponse;
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.response?.status === 400) {
          const msg = error.response?.data?.Message || error.response?.data || 'Invalid request.';
          throw new Error(typeof msg === 'string' ? msg : 'Invalid request.');
        }
        throw new Error(error.message || 'Failed to reset password. Please try again.');
      }
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error('Network error. Please try again.');
    }
  },

  openGoogleLogin(): void {
    const url = `${environment.API_BASE_URL}/registration/google-login`;
    Linking.openURL(url).catch(() => {
      console.error('[registrationApi] Failed to open Google login URL:', url);
    });
  },
};
