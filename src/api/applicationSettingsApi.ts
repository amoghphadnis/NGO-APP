/**
 * Application Settings API (Update Last Date to Apply)
 *
 * Implements the official Application Settings API Contract:
 *
 * Controller: ApplicationSettingsApiController
 * Base Route: /api/application-settings
 *
 * Endpoints:
 *   1. GET /api/application-settings/form-types
 *      → { success: true, data: [{ Text: string, Value: string }] }
 *   2. GET /api/application-settings/last-date?formType={formType}
 *      → { success: true, id: number, lastDate: "yyyy-MM-dd" }
 *   3. POST /api/application-settings/update-last-date
 *      → body { FormType: string, LastDateToApply: string }
 *      → { success: true, message: string }
 */

import api from './client';

export interface FormTypeItem {
  Text: string;
  Value: string;
}

export interface ApplicationSetting {
  Id: number;
  FormName: string;
  FormType: string;
  LastDateToApply: string | null;
}

export interface UpdateLastDateRequest {
  FormType: string;
  LastDateToApply: string;
}

export interface UpdateLastDateResponse {
  success: boolean;
  message: string;
}

export interface FormTypesResponse {
  success: boolean;
  data: FormTypeItem[];
}

export interface LastDateResponse {
  success: boolean;
  id?: number;
  lastDate?: string;
  message?: string;
}

export async function getFormTypes(): Promise<FormTypeItem[]> {
  const response = await api.get('/application-settings/form-types');
  const body = response.data as FormTypesResponse;
  return body.data || [];
}

export async function getLastDate(formType: string): Promise<LastDateResponse> {
  const response = await api.get(
    `/application-settings/last-date?formType=${encodeURIComponent(formType)}`
  );
  return response.data as LastDateResponse;
}

export async function getApplicationSettings(): Promise<ApplicationSetting[]> {
  const formTypes = await getFormTypes();

  const results = await Promise.allSettled(
    formTypes.map(async (ft, idx) => {
      try {
        const res = await getLastDate(ft.Value);
        return {
          Id: res.id ?? idx + 1,
          FormName: ft.Text,
          FormType: ft.Value,
          LastDateToApply: res.lastDate ?? null,
        };
      } catch {
        // If no deadline configured (404), return setting with null LastDateToApply
        return {
          Id: idx + 1,
          FormName: ft.Text,
          FormType: ft.Value,
          LastDateToApply: null,
        };
      }
    })
  );

  return results.map((r, idx) => {
    if (r.status === 'fulfilled') {
      return r.value;
    }
    return {
      Id: idx + 1,
      FormName: formTypes[idx]?.Text || 'Unknown',
      FormType: formTypes[idx]?.Value || 'Unknown',
      LastDateToApply: null,
    };
  });
}

export async function updateLastDateToApply(
  formType: string,
  lastDateToApply: string
): Promise<UpdateLastDateResponse> {
  const response = await api.post('/application-settings/update-last-date', {
    FormType: formType,
    LastDateToApply: lastDateToApply,
  });
  return response.data as UpdateLastDateResponse;
}

export const applicationSettingsApi = {
  getFormTypes,
  getLastDate,
  list: getApplicationSettings,
  updateLastDate: updateLastDateToApply,

  queryKeys: {
    list: () => ['applicationSettings', 'list'] as const,
  },
};
