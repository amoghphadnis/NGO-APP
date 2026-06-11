import { environment } from '@/config/environment';
import { RenewalPucFormValues } from '@/validation/renewalPucSchemas';
import api from './client';
import { normalizeApiError, NormalizedApiResponse } from './transformers/normalizeApiResponse';
import { NormalizedDropdowns, normalizePUCDropdowns } from './transformers/normalizeDropdowns';

const API_BASE_URL = environment.API_BASE_URL;

export interface RenewalPucSubmitResponse {
  success: boolean;
  message: string;
  renewalId?: number;
}

/**
 * Gets Renewal PUC dropdown data
 * GET /renewalpuc/create
 */
export async function getRenewalPucDropdowns(): Promise<
  NormalizedApiResponse<NormalizedDropdowns>
> {
  try {
    const response = await api.get('/renewalpuc/dropdowns');
    console.log('[getRenewalPucDropdowns] Raw response:', JSON.stringify(response.data, null, 2));
    
    // Handle both wrapped (data.Data) and unwrapped (data) responses
    const dropdownData = response.data.Data || response.data;
    const normalizedDropdowns = normalizePUCDropdowns(dropdownData);

    return {
      success: true,
      data: normalizedDropdowns,
      message: response.data.Message || response.data.message || 'Success',
    };
  } catch (error: any) {
    console.error('[getRenewalPucDropdowns] Error:', error);
    return normalizeApiError(error);
  }
}

export async function submitRenewalPuc(
  formData: RenewalPucFormValues
): Promise<RenewalPucSubmitResponse> {
  const payload: Record<string, any> = {
    email: formData.email,
    applicantName: formData.applicantName,
    vpid: formData.vpid || '',
    whatsApp: formData.whatsApp,
    alternateNumber: formData.alternateNumber || '',
    district: formData.district,
    taluk: formData.taluk,
    address: formData.address,
    gender: formData.gender,
    dob: formData.dob,
    latestResult: formData.latestResult,
    scholarshipAmount: formData.scholarshipAmount,
    donorName: formData.donorName || '',
    lettersCount: formData.lettersCount ?? 0,
    course: formData.course,
    courseYear: formData.courseYear,
    courseStream: formData.courseStream || '',
    collegeName: formData.collegeName,
    collegeContact: formData.collegeContact || '',
    collegeType: formData.collegeType,
    collegeFees: formData.collegeFees,
    totalExpenses: formData.totalExpenses,
    achievements: formData.achievements || '',
    invitedToCamp: formData.invitedToCamp,
    attendedCamp: formData.attendedCamp,
    campCount: formData.campCount ?? 0,
    campPlace: formData.campPlace || '',
    campDate: formData.campDate || '',
    vdssAttended: formData.vdssAttended || '',
    vdss_Topics: formData.vdss_Topics || '',
    accountHolderName: formData.accountHolderName,
    accountNumber: formData.accountNumber,
    ifsc: formData.ifsc,
    bankName: formData.bankName,
    branchName: formData.branchName,
    parentBankBalance: formData.parentBankBalance ?? 0,
    houseVisitLink: formData.houseVisitLink || '',
    renewalPreviousVPID: formData.renewalPreviousVPID || '',
  };

  const response = await fetch(`${API_BASE_URL}/renewalpuc/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (response.status === 400) {
    const data = await response.json();
    throw new Error(data.message || 'This email already exists.');
  }

  if (!response.ok) {
    const data = await response.json().catch(() => ({ message: 'Server error' }));
    throw new Error(data.message || `Submission failed: ${response.statusText}`);
  }

  const data: RenewalPucSubmitResponse = await response.json();

  if (!data.success) {
    throw new Error(data.message || 'Submission failed');
  }

  return data;
}
