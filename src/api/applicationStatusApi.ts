import api from './client';

export interface ApplicationStatusItem {
  program: string;
  applicationType: 'New' | 'Renewal' | string;
  studentName: string | null;
  appliedDate: string | null;
  status: 'Under Review' | 'Approved' | 'Rejected' | string;
  remark: string | null;
}

interface LookupResponse {
  success: boolean;
  count: number;
  applications: ApplicationStatusItem[];
  message?: string;
}

export async function lookupApplications(
  contactNumber: string,
): Promise<LookupResponse> {
  const response = await api.get(
    `/application-status/lookup?contactNumber=${encodeURIComponent(contactNumber)}`,
  );
  return response.data as LookupResponse;
}

export async function checkDuplicate(
  contactNumber: string,
  program?: string,
): Promise<{ exists: boolean; applications: ApplicationStatusItem[] }> {
  const params = new URLSearchParams({ contactNumber });
  if (program) {
    params.set('program', program);
  }
  const response = await api.get(
    `/application-status/check-duplicate?${params.toString()}`,
  );
  return response.data;
}
