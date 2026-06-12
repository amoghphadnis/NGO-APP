import api from './client';
import { environment } from '@/config/environment';
import { RenewalPayanaFormValues } from '@/validation/renewalPayanaSchemas';
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

export async function submitPayanaRenewal(
  values: RenewalPayanaFormValues
): Promise<PayanaRenewalSubmitResponse> {
  // Build JSON payload - backend expects JSON, not multipart/form-data
  const payload: Record<string, any> = {
    EmailId: values.emailId,
    StudentName: values.studentName,
    District: values.district || '',
    Taluk: values.taluk || '',
    PayanaId: values.payanaId || '',
    DateOfBirth: values.dateOfBirth || '',
    ResidentialAddress: values.residentialAddress || '',
    CurrentAddress: values.currentAddress || '',
    PrimaryNumber: values.primaryNumber || '',
    AlternateNumber: values.alternateNumber || '',
    Place: values.place || '',
    Caste: values.caste || '',
    FatherOccupation: values.fatherOccupation || '',
    MotherOccupation: values.motherOccupation || '',
    FamilyIncome: values.familyIncome ?? '',
    BankBalance: values.bankBalance ?? '',
    CollegeName: values.collegeName || '',
    CollegeType: values.collegeType || '',
    CollegeContact: values.collegeContact || '',
    CourseS: values.courseS || '',
    CourseStream: values.courseStream || '',
    AnnualFees: values.annualFees ?? '',
    TotalExpenses: values.totalExpenses ?? '',
    ScholarshipAmount: values.scholarshipAmount ?? '',
    DonorName: values.donorName || '',
    LettersWritten: values.lettersWritten ?? '',
    Achievement: values.achievement || '',
    Percentage: values.percentage || '',
    AccountHolder: values.accountHolder,
    AccountNumber: values.accountNumber,
    IFSC: values.ifsc,
    BankName: values.bankName,
    Branch: values.branch,
    // File URIs for backend to process separately
    MarksheetFile: values.marksheetFile?.file?.uri || '',
    FeesReceiptFile: values.feesReceiptFile?.file?.uri || '',
    PassbookFile: values.passbookFile?.file?.uri || '',
    SelfieFile: values.selfieFile?.file?.uri || '',
    AadhaarFile: values.aadhaarFile?.file?.uri || '',
  };

  try {
    const response = await api.post('/payanarenewal/create', payload);

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
      response: error.response?.data,
      status: error.response?.status,
      payload,
    });
    throw error;
  }
}
