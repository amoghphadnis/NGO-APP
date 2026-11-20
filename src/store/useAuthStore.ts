import { authApi, LoginRequest } from '@/api/authApi';
import { syncPushToken, unregisterPushToken } from '@/services/pushNotifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

const AUTH_STORAGE_KEY = '@vp_auth_user';
const PUSH_TOKEN_SENT_KEY = '@vp_push_token_sent';

export interface UserData {
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

interface AuthStore {
  isLoggedIn: boolean;
  user: UserData | null;
  isLoading: boolean;
  error: string | null;
  hydrated: boolean;
  hydrate: () => Promise<void>;
  login: (credentials: LoginRequest) => Promise<boolean>;
  logout: () => Promise<void>;
  clearError: () => void;
  getToken: () => Promise<string | null>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  isLoggedIn: false,
  user: null,
  isLoading: false,
  error: null,
  hydrated: false,

  hydrate: async () => {
    try {
      const raw = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
      if (raw) {
        const user: UserData = JSON.parse(raw);
        set({ user, isLoggedIn: true, hydrated: true });
        void syncPushToken(user.UserID);
      } else {
        set({ hydrated: true });
      }
    } catch {
      set({ hydrated: true });
    }
  },

  login: async (credentials: LoginRequest) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authApi.login(credentials);
      if (response.Success) {
        const user: UserData = {
          UserID: response.UserID,
          UserName: response.UserName,
          Role: response.Role,
          EmployeeID: response.EmployeeID,
          AssignedRole: response.AssignedRole,
          District: response.District,
          Token: response.Token,
          DistrictID: response.DistrictID,
          OtherDistrict: response.OtherDistrict,
        };
        await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
        set({ isLoggedIn: true, user, isLoading: false, error: null });
        void syncPushToken(user.UserID);
        return true;
      }
      set({ isLoading: false, error: 'Login failed' });
      return false;
    } catch (error: any) {
      set({ isLoading: false, error: error.message || 'Login failed' });
      return false;
    }
  },

  logout: async () => {
    const userId = useAuthStore.getState().user?.UserID;
    if (userId) {
      void unregisterPushToken(userId);
    }
    await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
    set({ isLoggedIn: false, user: null, error: null });
  },

  clearError: () => set({ error: null }),

  getToken: async () => {
    try {
      const raw = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
      if (raw) {
        const user: UserData = JSON.parse(raw);
        return user.Token;
      }
      return null;
    } catch {
      return null;
    }
  },
}));
