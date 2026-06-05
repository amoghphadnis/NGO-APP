import { environment } from '@/config/environment';
import { RenewalProfessionalFormValues } from '@/validation/renewalProfessionalSchemas';
import { UploadedDocument } from '@/types/documents';

const API_BASE_URL = environment.API_BASE_URL;

export interface RenewalProfessionalDropdowns {
  districts: { districtName?: string; Name?: string; name?: string }[];
  collegeTypes: { collegeTypeName: string }[];
}

export interface RenewalProfessionalSubmitResponse {
  success: boolean;
  message: string;
  prId?: number;
}

export async function getRenewalProfessionalDropdowns(): Promise<RenewalProfessionalDropdowns> {
  const response = await fetch(`${API_BASE_URL}/students/districts`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    throw new Error('Failed to load dropdown data');
  }

  const data = await response.json();
  return {
    districts: data || [],
    collegeTypes: [
      { collegeTypeName: 'Government' },
      { collegeTypeName: 'Aided' },
      { collegeTypeName: 'Private' },
    ],
  };
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

  const response = await fetch(`${API_BASE_URL}/api/professionalrenewal/create`, {
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
