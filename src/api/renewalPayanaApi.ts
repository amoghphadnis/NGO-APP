import { environment } from '@/config/environment';
import { RenewalPayanaFormValues } from '@/validation/renewalPayanaSchemas';
import { UploadedDocument } from '@/types/documents';

const API_BASE_URL = environment.API_BASE_URL;

export interface PayanaRenewalDropdownItem {
  id: number;
  name: string;
}

export interface PayanaRenewalDropdowns {
  districts: PayanaRenewalDropdownItem[];
  areaTypes: PayanaRenewalDropdownItem[];
  casteCategories: PayanaRenewalDropdownItem[];
  collegeTypes: PayanaRenewalDropdownItem[];
}

export interface PayanaRenewalSubmitResponse {
  success: boolean;
  message: string;
}

export async function getPayanaRenewalDropdowns(): Promise<PayanaRenewalDropdowns> {
  // Try to fetch districts from the common endpoint
  const districtsResponse = await fetch(`${API_BASE_URL}/students/districts`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  let districts: PayanaRenewalDropdownItem[] = [];
  if (districtsResponse.ok) {
    const districtData = await districtsResponse.json();
    districts = (districtData || []).map((d: any) => ({ id: d.Id || d.districtID, name: d.Name || d.districtName }));
  }

  // Hardcode other dropdowns as fallback since dedicated endpoints may not exist
  return {
    districts,
    areaTypes: [
      { id: 1, name: 'Urban' },
      { id: 2, name: 'Rural' },
      { id: 3, name: 'Semi Urban' },
    ],
    casteCategories: [
      { id: 1, name: 'GM' },
      { id: 2, name: 'OBC' },
      { id: 3, name: 'SC' },
      { id: 4, name: 'ST' },
      { id: 5, name: 'Minority' },
    ],
    collegeTypes: [
      { id: 1, name: 'Government' },
      { id: 2, name: 'Aided' },
      { id: 3, name: 'Private' },
    ],
  };
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

  const response = await fetch(`${API_BASE_URL}/api/payanarenewal/create`, {
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
