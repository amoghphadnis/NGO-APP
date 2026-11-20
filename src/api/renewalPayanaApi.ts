import { environment } from '@/config/environment';
import { UploadedDocument } from '@/types/documents';
import { RenewalPayanaFormValues } from '@/validation/renewalPayanaSchemas';
import api from './client';
import { normalizeApiError, NormalizedApiResponse } from './transformers/normalizeApiResponse';
import { NormalizedDropdowns, normalizePayanaDropdowns } from './transformers/normalizeDropdowns';

const API_BASE_URL = environment.API_BASE_URL;

export interface PayanaRenewalSubmitResponse {
  success: boolean;
  message: string;
}

/**
 * Gets Payana Renewal dropdown data
 * GET /payana-renewal/dropdowns
 */
export async function getPayanaRenewalDropdowns(): Promise<
  NormalizedApiResponse<NormalizedDropdowns>
> {
  try {
    const response = await api.get('/payana-renewal/dropdowns');

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

import { appendFileToFormData } from '@/submission/attachFiles';

export async function submitPayanaRenewal(
  values: RenewalPayanaFormValues
): Promise<PayanaRenewalSubmitResponse> {
  // Contract (PAYANA RENEWAL API CONTRACT): POST /payana-renewal/create must be
  // multipart/form-data with real file parts — JSON is rejected with 400.
  const formData = new FormData();

  // Text fields (names per contract)
  formData.append('EmailId', values.emailId);
  formData.append('StudentName', values.studentName);
  formData.append('PayanaId', values.payanaId || '');
  formData.append('District', values.district || '');
  formData.append('Taluk', values.taluk || '');
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

  // File parts (uploaded at submit time)
  appendFileToFormData(formData, 'MarksheetFile', values.marksheetFile);
  appendFileToFormData(formData, 'FeesReceiptFile', values.feesReceiptFile);
  appendFileToFormData(formData, 'PassbookFile', values.passbookFile);
  appendFileToFormData(formData, 'SelfieFile', values.selfieFile);
  appendFileToFormData(formData, 'AadhaarFile', values.aadhaarFile);
  appendFileToFormData(formData, 'ThankingLetter', values.thankingLetterFile);
  appendFileToFormData(formData, 'CET_NEET_RankSheetPath', values.cetNeetRankSheetFile);

  try {
    const response = await api.post('/payana-renewal/create', formData);

    const data = response.data;

    if (data.success === false || data.Success === false) {
      throw new Error(data.message || data.Message || 'Submission failed');
    }

    return {
      success: true,
      message: data.message || data.Message || 'Payana Renewal submitted successfully!',
    };
  } catch (error: any) {
    console.error('[submitPayanaRenewal] Error:', {
      message: error.message,
      status: error.response?.status,
    });
    throw error;
  }
}
