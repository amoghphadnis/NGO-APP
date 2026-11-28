/**
 * Application Settings API (Update Last Date to Apply)
 *
 * Implements the official Application Settings API Contract:
 *
 * Controller: ApplicationSettingsApiController / VPStudentApiController
 * Base Routes:
 *   Primary:  /api/students/application-settingsvp
 *   Fallback: /api/application-settings
 *
 * Endpoints:
 *   1. GET /api/students/application-settingsvp/form-types
 *      → { Success: true, FormTypes: [{ Text: string, Value: string }] }
 *   2. GET /api/students/application-settingsvp/last-date?formType={formType}
 *      → { Success: true, Id: number, FormType: string, LastDateToApply: "yyyy-MM-dd" }
 *   3. POST /api/students/application-settingsvp/update-last-date
 *      → body (x-www-form-urlencoded): FormType={formType}&LastDateToApply={yyyy-MM-dd}
 *      → { Success: true, Message: string }
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
  try {
    const response = await api.get('/students/application-settingsvp/form-types');
    const data = response.data;
    if (data?.FormTypes && Array.isArray(data.FormTypes)) {
      return data.FormTypes;
    }
    if (data?.data && Array.isArray(data.data)) {
      return data.data;
    }
  } catch {}

  try {
    const response = await api.get('/application-settings/form-types');
    const body = response.data as FormTypesResponse;
    if (body?.data && Array.isArray(body.data)) {
      return body.data;
    }
  } catch {}

  return [
    { Text: 'Professional', Value: 'Professional' },
    { Text: 'PUC, Diploma', Value: 'Diploma' },
    { Text: 'Semi Professional', Value: 'Semi Professional' },
  ];
}

export async function getLastDate(formType: string): Promise<LastDateResponse> {
  try {
    const response = await api.get(
      `/students/application-settingsvp/last-date?formType=${encodeURIComponent(formType)}`
    );
    const data = response.data;
    const lastDate = data?.LastDateToApply ?? data?.lastDate ?? data?.LastDate;
    return {
      success: data?.Success ?? data?.success ?? true,
      id: data?.Id ?? data?.id,
      lastDate: lastDate || undefined,
      message: data?.Message ?? data?.message,
    };
  } catch (primaryErr: any) {
    try {
      const response = await api.get(
        `/application-settings/last-date?formType=${encodeURIComponent(formType)}`
      );
      const data = response.data;
      const lastDate = data?.LastDateToApply ?? data?.lastDate ?? data?.LastDate;
      return {
        success: data?.Success ?? data?.success ?? true,
        id: data?.Id ?? data?.id,
        lastDate: lastDate || undefined,
        message: data?.Message ?? data?.message,
      };
    } catch {
      return {
        success: false,
        message: primaryErr?.message || 'Failed to fetch last date',
      };
    }
  }
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
  const formBody = `FormType=${encodeURIComponent(formType)}&LastDateToApply=${encodeURIComponent(lastDateToApply)}`;
  try {
    const response = await api.post(
      '/students/application-settingsvp/update-last-date',
      formBody,
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );
    const data = response.data;
    return {
      success: data?.Success ?? data?.success ?? true,
      message: data?.Message ?? data?.message ?? 'Last date updated successfully.',
    };
  } catch (primaryErr: any) {
    try {
      const response = await api.post('/application-settings/update-last-date', {
        FormType: formType,
        LastDateToApply: lastDateToApply,
      });
      const data = response.data;
      return {
        success: data?.Success ?? data?.success ?? true,
        message: data?.Message ?? data?.message ?? 'Last date updated successfully.',
      };
    } catch {
      return {
        success: false,
        message: primaryErr?.message || 'Failed to update last date',
      };
    }
  }
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
