/**
 * User Management API (Admin / Admin(CEO))
 *
 * Base Route: /api/registration
 *
 * Endpoints:
 *   GET    /registration/users          → active users (Status=1)
 *   GET    /registration/users/pending  → pending registrations (Status=0)
 *   PUT    /registration/update/{id}    → update user (password optional)
 *   POST   /registration/toggle/{id}    → activate / deactivate Users.Status
 *   DELETE /registration/delete/{id}    → delete user
 *   GET    /registration/roles          → role list
 *   GET    /registration/districts      → district list
 *   PUT    /registration/assign-role/{id} → assign a staff role to a user
 */

import api from './client';

export interface ManagedUser {
  Id: number;
  Name: string;
  Email: string;
  Mobile: string | null;
  Role: string;
  District: string | null;
  OtherDistrict: string | null;
  Taluk?: string | null;
  Status: boolean;
}

export interface UpdateUserPayload {
  Name: string;
  Email: string;
  Mobile?: string;
  Role: string;
  DistrictID?: number | null;
  District?: string | null;
  Taluk?: string;
  Address?: string;
  /** Leave blank to keep the existing password. */
  Password?: string;
}

export interface RoleOption {
  Id: number;
  Name: string;
}

export interface DistrictOption {
  DistrictID: number;
  DistrictName: string;
}

function toUserList(raw: any): ManagedUser[] {
  const rows: ManagedUser[] = Array.isArray(raw) ? raw : (raw?.data || []);
  return rows;
}

export const userManagementApi = {
  async getActiveUsers(): Promise<ManagedUser[]> {
    const response = await api.get('/registration/users');
    return toUserList(response.data);
  },

  async getPendingUsers(): Promise<ManagedUser[]> {
    const response = await api.get('/registration/users/pending');
    return toUserList(response.data);
  },

  async toggleStatus(id: number): Promise<{ success: boolean; newStatus: boolean }> {
    const response = await api.post(`/registration/toggle/${id}`);
    const data = response.data;
    return {
      success: data?.Success ?? data?.success ?? true,
      newStatus: data?.NewStatus ?? data?.newStatus ?? false,
    };
  },

  async updateUser(id: number, payload: UpdateUserPayload): Promise<void> {
    await api.put(`/registration/update/${id}`, payload);
  },

  async deleteUser(id: number): Promise<void> {
    await api.delete(`/registration/delete/${id}`);
  },

  async getRoles(): Promise<RoleOption[]> {
    const response = await api.get('/registration/roles');
    const rows: RoleOption[] = Array.isArray(response.data) ? response.data : (response.data?.data || []);
    return rows;
  },

  async getDistricts(): Promise<DistrictOption[]> {
    const response = await api.get('/registration/districts');
    const rows: DistrictOption[] = Array.isArray(response.data) ? response.data : (response.data?.data || []);
    return rows;
  },

  /**
   * Assign a role to a user (web "Assign Role" admin page).
   * PUT /api/registration/assign-role/{id}
   */
  async assignRole(
    id: number,
    role: string
  ): Promise<{ success: boolean; message: string }> {
    const response = await api.put(`/registration/assign-role/${id}`, {
      Role: role,
    });
    const data = response.data;
    return {
      success: data?.success ?? data?.Success ?? true,
      message: data?.message ?? data?.Message ?? '',
    };
  },
};
