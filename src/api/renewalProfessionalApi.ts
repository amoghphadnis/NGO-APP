import { environment } from '@/config/environment';
import { UploadedDocument } from '@/types/documents';
import { RenewalProfessionalFormValues } from '@/validation/renewalProfessionalSchemas';
import api from './client';
import { normalizeApiError, NormalizedApiResponse } from './transformers/normalizeApiResponse';
import { NormalizedDropdowns, normalizeProfessionalDropdowns } from './transformers/normalizeDropdowns';

const API_BASE_URL = environment.API_BASE_URL;

export interface RenewalProfessionalSubmitResponse {
  success: boolean;
  message: string;
  prId?: number;
}

/**
 * Gets Professional Renewal dropdown data
 * GET /professionalrenewal/create
 */
export async function getRenewalProfessionalDropdowns(): Promise<
  NormalizedApiResponse<NormalizedDropdowns>
> {
  try {
    const response = await api.get('/professionalrenewal/dropdowns');
    console.log('[getRenewalProfessionalDropdowns] Raw response:', JSON.stringify(response.data, null, 2));
    
    // Handle both wrapped (data.Data) and unwrapped (data) responses
    const dropdownData = response.data.Data || response.data;
    const normalizedDropdowns = normalizeProfessionalDropdowns(dropdownData);

    return {
      success: true,
      data: normalizedDropdowns,
      message: response.data.Message || response.data.message || 'Success',
    };
  } catch (error: any) {
    console.error('[getRenewalProfessionalDropdowns] Error:', error);
    return normalizeApiError(error);
  }
}

function appendFileToFormData(
  formData: FormData,
  key: string,
  doc: UploadedDocument | undefined
): void {
  if (!doc?.file?.uri) return;
  formData.append(key, {
    uri: doc.file.uri,
    name: doc.file.name || `${key}.jpg`,
    type: doc.file.type || 'application/octet-stream',
  } as any);
}

export async function submitRenewalProfessional(
  values: RenewalProfessionalFormValues
): Promise<RenewalProfessionalSubmitResponse> {
  const formData = new FormData();

  // Text fields
  formData.append('ApplicantName', values.applicantName);
  formData.append('VPIDNumber', values.vpidNumber);
  formData.append('WhatsAppNumber', values.whatsAppNumber);
  formData.append('AlternateNumber', values.alternateNumber || '');
  formData.append('EmailID', values.emailID);
  formData.append('District', values.district);
  formData.append('Taluk', values.taluk);
  formData.append('ResidentialAddress', values.residentialAddress);
  formData.append('Gender', values.gender);
  formData.append('StudentAchievement', values.studentAchievement || '');
  formData.append('LatestResultPercentage', String(values.latestResultPercentage ?? ''));
  formData.append('TotalScholarshipAmount', String(values.totalScholarshipAmount ?? ''));
  formData.append('DonorName', values.donorName || '');
  formData.append('LettersWrittenToDonor', String(values.lettersWrittenToDonor ?? ''));
  formData.append('CourseStudyingApplying', values.courseStudyingApplying || '');
  formData.append('CurrentCourseYear', String(values.currentCourseYear ?? ''));
  formData.append('CourseStream', values.courseStream || '');
  formData.append('CollegeName', values.collegeName || '');
  formData.append('CollegeContactNumber', values.collegeContactNumber || '');
  formData.append('CollegeType', values.collegeType || '');
  formData.append('ExpectedCollegeFees', String(values.expectedCollegeFees ?? ''));
  formData.append('TotalEducationalExpenses', String(values.totalEducationalExpenses ?? ''));
  formData.append('AccountHolderName', values.accountHolderName);
  formData.append('BankAccountNumber', values.bankAccountNumber);
  formData.append('BankName', values.bankName);
  formData.append('IFSCCode', values.ifscCode);
  formData.append('BankBranchName', values.bankBranchName);
  formData.append('ParentsBankBalance', String(values.parentsBankBalance ?? ''));

  // File fields
  appendFileToFormData(formData, 'LatestMarksheetFile', values.latestMarksheetFile);
  appendFileToFormData(formData, 'StudentPassbookFile', values.studentPassbookFile);
  appendFileToFormData(formData, 'StudentSelfieFile', values.studentSelfieFile);
  appendFileToFormData(formData, 'CollegeFrontPhotoFile', values.collegeFrontPhotoFile);
  appendFileToFormData(formData, 'ThankingVideoFile', values.thankingVideoFile);
  appendFileToFormData(formData, 'ParentsPassbookFile', values.parentsPassbookFile);

  const response = await fetch(`${API_BASE_URL}/professionalrenewal/create`, {
    method: 'POST',
    body: formData,
  });

  if (response.status === 400) {
    const data = await response.json().catch(() => ({ message: 'Validation failed' }));
    throw new Error(data.message || 'Validation failed');
  }

  if (!response.ok) {
    const data = await response.json().catch(() => ({ message: 'Server error' }));
    throw new Error(data.message || `Submission failed: ${response.statusText}`);
  }

  const data = await response.json();

  if (!data.Success && !data.success) {
    throw new Error(data.Message || data.message || 'Submission failed');
  }

  return {
    success: true,
    message: data.Message || data.message || 'Submitted successfully',
    prId: data.PRId ?? data.prId,
  };
}
