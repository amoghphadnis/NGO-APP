import api from './client';
import { environment } from '@/config/environment';
import { RenewalPayanaFormValues } from '@/validation/renewalPayanaSchemas';
import { UploadedDocument } from '@/types/documents';
import { normalizeApiResponse, normalizeApiError, NormalizedApiResponse } from './transformers/normalizeApiResponse';
import { normalizePayanaDropdowns, NormalizedDropdowns } from './transformers/normalizeDropdowns';

const API_BASE_URL = environment.API_BASE_URL;

export interface PayanaRenewalSubmitResponse {
  success: boolean;
  message: string;
}

/**
 * Gets Payana Renewal dropdown data
 * GET /payanarenewal/payanadropdowns
 */
export async function getPayanaRenewalDropdowns(): Promise<
  NormalizedApiResponse<NormalizedDropdowns>
> {
  try {
    const response = await api.get('/payanarenewal/payanadropdowns');
    console.log('[getPayanaRenewalDropdowns] Raw response:', JSON.stringify(response.data, null, 2));
    
    // Handle both wrapped (data.Data) and unwrapped (data) responses
    const dropdownData = response.data.Data || response.data;
    const normalizedDropdowns = normalizePayanaDropdowns(dropdownData);

    return {
      success: true,
      data: normalizedDropdowns,
      message: response.data.Message || response.data.message || 'Success',
    };
  } catch (error: any) {
    console.error('[getPayanaRenewalDropdowns] Error:', error);
    return normalizeApiError(error);
  }
}

function appendFile(formData: FormData, key: string, doc: UploadedDocument | undefined): void {
  if (!doc?.file?.uri) return;
  formData.append(key, {
    uri: doc.file.uri,
    name: doc.file.name || `${key}.jpg`,
    type: doc.file.type || 'application/octet-stream',
  } as any);
}

export async function submitPayanaRenewal(
  values: RenewalPayanaFormValues
): Promise<PayanaRenewalSubmitResponse> {
  const formData = new FormData();

  formData.append('EmailId', values.emailId);
  formData.append('StudentName', values.studentName);
  formData.append('District', values.district || '');
  formData.append('Taluk', values.taluk || '');
  formData.append('PayanaId', values.payanaId || '');
  formData.append('DateOfBirth', values.dateOfBirth || '');
  formData.append('ResidentialAddress', values.residentialAddress || '');
  formData.append('CurrentAddress', values.currentAddress || '');
  formData.append('PrimaryNumber', values.primaryNumber || '');
  formData.append('AlternateNumber', values.alternateNumber || '');
  formData.append('Place', values.place || '');
  formData.append('Caste', values.caste || '');
  formData.append('FatherOccupation', values.fatherOccupation || '');
  formData.append('MotherOccupation', values.motherOccupation || '');
  formData.append('FamilyIncome', String(values.familyIncome ?? ''));
  formData.append('BankBalance', String(values.bankBalance ?? ''));
  formData.append('CollegeName', values.collegeName || '');
  formData.append('CollegeType', values.collegeType || '');
  formData.append('CollegeContact', values.collegeContact || '');
  formData.append('CourseS', values.courseS || '');
  formData.append('CourseStream', values.courseStream || '');
  formData.append('AnnualFees', String(values.annualFees ?? ''));
  formData.append('TotalExpenses', String(values.totalExpenses ?? ''));
  formData.append('ScholarshipAmount', String(values.scholarshipAmount ?? ''));
  formData.append('DonorName', values.donorName || '');
  formData.append('LettersWritten', String(values.lettersWritten ?? ''));
  formData.append('Achievement', values.achievement || '');
  formData.append('Percentage', values.percentage || '');
  formData.append('AccountHolder', values.accountHolder);
  formData.append('AccountNumber', values.accountNumber);
  formData.append('IFSC', values.ifsc);
  formData.append('BankName', values.bankName);
  formData.append('Branch', values.branch);
  formData.append('HouseVisitLink', values.houseVisitLink || '');

  appendFile(formData, 'MarksheetFile', values.marksheetFile);
  appendFile(formData, 'FeesReceiptFile', values.feesReceiptFile);
  appendFile(formData, 'PassbookFile', values.passbookFile);
  appendFile(formData, 'SelfieFile', values.selfieFile);
  appendFile(formData, 'AadhaarFile', values.aadhaarFile);

  const response = await fetch(`${API_BASE_URL}/payanarenewal/create`, {
    method: 'POST',
    body: formData,
  });

  if (response.status === 409) {
    const data = await response.json().catch(() => ({ message: 'Duplicate record' }));
    throw new Error(data.message || 'This Email ID or Payana ID is already registered.');
  }

  if (response.status === 400) {
    const data = await response.json().catch(() => ({ message: 'Validation failed' }));
    throw new Error(data.message || 'Validation failed');
  }

  if (!response.ok) {
    const data = await response.json().catch(() => ({ message: 'Server error' }));
    throw new Error(data.message || `Submission failed: ${response.statusText}`);
  }

  const data = await response.json();

  if (data.success === false) {
    throw new Error(data.message || 'Submission failed');
  }

  return {
    success: true,
    message: data.message || 'Payana Renewal submitted successfully!',
  };
}
