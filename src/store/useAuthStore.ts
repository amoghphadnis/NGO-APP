import { create } from 'zustand';
import { authApi, LoginRequest, LoginResponse } from '@/api/authApi';

interface UserData {
  UserID: number;
  UserName: string;
  Role: string;
  EmployeeID: number;
  AssignedRole: string;
  District: string;
}

interface AuthStore {
  isLoggedIn: boolean;
  user: UserData | null;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginRequest) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  isLoggedIn: false,
  user: null,
  isLoading: false,
  error: null,

  login: async (credentials: LoginRequest) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authApi.login(credentials);
      if (response.Success) {
        set({
          isLoggedIn: true,
          user: {
            UserID: response.UserID,
            UserName: response.UserName,
            Role: response.Role,
            EmployeeID: response.EmployeeID,
            AssignedRole: response.AssignedRole,
            District: response.District,
          },
          isLoading: false,
          error: null,
        });
        return true;
      }
      set({ isLoading: false, error: 'Login failed' });
      return false;
    } catch (error: any) {
      set({ isLoading: false, error: error.message || 'Login failed' });
      return false;
    }
  },

  logout: () => set({ isLoggedIn: false, user: null, error: null }),

  clearError: () => set({ error: null }),
}));
