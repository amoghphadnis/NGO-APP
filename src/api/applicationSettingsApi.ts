/**
 * Application Settings API (Update Last Date to Apply)
 *
 * Maps to web menu: "Update Last Date to Apply"
 * (legacy admin page editing ApplicationSettings.LastDateToApply)
 *
 * Base Route: /api/application-settings
 *
 * Endpoints:
 *   GET /api/application-settings
 *       → { success, data: [{ Id, FormName, LastDateToApply }] }
 *   PUT /api/application-settings/{id}
 *       → body { LastDateToApply } → { success, message }
 *
 * Requires JWT authentication; restricted to Admin / Admin(CEO) /
 * Program Manager server-side.
 *
 * Row IDs (ApplicationSettings.Id):
 *   1 = PUC (Format 1.1), 2 = New Professional, 3 = Semi Professional,
 *   4 = Payana
 */

import api from './client';

const BASE_URL = '/application-settings';

export interface ApplicationSetting {
  Id: number;
  FormName: string;
  LastDateToApply: string | null;
}

export interface ApplicationSettingsListResponse {
  success: boolean;
  data: ApplicationSetting[];
}

export interface UpdateLastDateResponse {
  success: boolean;
  message: string;
}

export async function getApplicationSettings(): Promise<ApplicationSetting[]> {
  const response = await api.get(BASE_URL);
  const body = response.data as ApplicationSettingsListResponse;
  return body.data || [];
}

export async function updateLastDateToApply(
  id: number,
  lastDateToApply: string
): Promise<UpdateLastDateResponse> {
  const response = await api.put(`${BASE_URL}/${id}`, {
    LastDateToApply: lastDateToApply,
  });
  return response.data as UpdateLastDateResponse;
}

export const applicationSettingsApi = {
  list: getApplicationSettings,
  updateLastDate: updateLastDateToApply,

  queryKeys: {
    list: () => ['applicationSettings', 'list'] as const,
  },
};
