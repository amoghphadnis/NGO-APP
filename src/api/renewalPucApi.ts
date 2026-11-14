import { environment } from '@/config/environment';
import { appendFileToFormData } from '@/submission/attachFiles';
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
    const response = await api.get('/renewalpuc/Getcreate');
    
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
  // Backend requires multipart/form-data with PascalCase keys
  // (RenewalPUCAPIController /create → GetFormValue(provider, "...")).
  const fd = new FormData();

  // Applicant
  fd.append('Email', formData.email);
  fd.append('ApplicantName', formData.applicantName);
  fd.append('VPID', formData.vpid || '');
  fd.append('WhatsApp', formData.whatsApp);
  fd.append('AlternateNumber', formData.alternateNumber || '');
  fd.append('District', String(formData.district));
  fd.append('Taluk', formData.taluk);
  fd.append('Address', formData.address);
  fd.append('CurrentAddress', formData.currentAddress || '');
  fd.append('OtherDistrict', formData.otherDistrict || '');
  fd.append('Gender', formData.gender);
  fd.append('DOB', formData.dob);

  // Academic
  fd.append('LatestResult', formData.latestResult);
  fd.append('ScholarshipAmount', String(formData.scholarshipAmount));
  fd.append('DonorName', formData.donorName || '');
  fd.append('LettersCount', String(formData.lettersCount ?? 0));
  fd.append('Course', formData.course);
  fd.append('CourseYear', formData.courseYear);
  fd.append('CourseStream', formData.courseStream || '');
  fd.append('CollegeName', formData.collegeName);
  fd.append('CollegeContact', formData.collegeContact || '');
  fd.append('CollegeType', formData.collegeType);
  fd.append('CollegeFees', String(formData.collegeFees));
  fd.append('TotalExpenses', String(formData.totalExpenses));
  fd.append('Achievements', formData.achievements || '');

  // Camp / VDSS
  fd.append('InvitedToCamp', formData.invitedToCamp);
  fd.append('AttendedCamp', formData.attendedCamp);
  fd.append('CampCount', String(formData.campCount ?? 0));
  fd.append('CampPlace', formData.campPlace || '');
  fd.append('CampDate', formData.campDate || '1900-01-01');
  fd.append('VDSSAttended', formData.vdssAttended || '');
  fd.append('VDSS_Topics', formData.vdss_Topics || '');

  // Bank
  fd.append('AccountHolderName', formData.accountHolderName);
  fd.append('AccountNumber', formData.accountNumber);
  fd.append('IFSC', formData.ifsc);
  fd.append('BankName', formData.bankName);
  fd.append('BranchName', formData.branchName);
  fd.append('ParentBankBalance', String(formData.parentBankBalance ?? 0));

  // Other
  fd.append('HouseVisitLink', formData.houseVisitLink || '');

  // Files — backend SaveMultipartFile(provider, "<key>", ...)
  appendFileToFormData(fd, 'Marksheet', formData.marksheet);
  (formData.thankingLetters || []).forEach((doc) =>
    appendFileToFormData(fd, 'ThankingLetter', doc)
  );
  appendFileToFormData(fd, 'Passbook', formData.passbook);
  appendFileToFormData(fd, 'Photo', formData.photo);
  appendFileToFormData(fd, 'ThankingVideo', formData.thankingVideo);
  appendFileToFormData(fd, 'FeesReceiptPath', formData.feesReceipt);
  appendFileToFormData(fd, 'ThankingVolunteerLetterPath', formData.thankingVolunteerLetter);

  try {
    const response = await api.post('/renewalpuc/create', fd);

    const data = response.data;

    if (!data.Success && !data.success) {
      throw new Error(data.Message || data.message || 'Submission failed');
    }

    return {
      success: true,
      message: data.Message || data.message || 'Renewal submitted successfully',
      renewalId: data.RenewalId ?? data.renewalId,
    };
  } catch (error: any) {
    console.error('[submitRenewalPuc] Error:', {
      message: error.message,
      status: error.response?.status,
    });
    throw error;
  }
}
