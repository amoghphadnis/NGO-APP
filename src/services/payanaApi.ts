import { PayanaFormValues } from '@/types/forms';

const API_BASE_URL = 'https://localhost:44300'; // Update with actual API base URL

// Dropdown DTOs
export interface DropdownDto {
  Id: number;
  Name: string;
}

export interface PayanaDropdownResponse {
  Genders: DropdownDto[];
  CasteCategories: DropdownDto[];
  AreaTypes: DropdownDto[];
  HouseTypes: DropdownDto[];
  CollegeTypes: DropdownDto[];
  Districts: DropdownDto[];
  FatherOccupations: DropdownDto[];
  MotherOccupations: DropdownDto[];
}

export interface ApiSuccessResponse<T = any> {
  Success: boolean;
  Message: string;
  Data?: T;
}

export interface ApiErrorResponse {
  Success: false;
  Message: string;
  Errors?: string[];
}

/**
 * Fetch all dropdown data for Payana form
 */
export async function fetchPayanaDropdowns(): Promise<PayanaDropdownResponse> {
  const response = await fetch(`${API_BASE_URL}/api/payanastudents/dropdowns`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch dropdowns: ${response.statusText}`);
  }

  const data: ApiSuccessResponse<PayanaDropdownResponse> = await response.json();
  
  if (!data.Success) {
    throw new Error(data.Message || 'Failed to load dropdown data');
  }

  return data.Data!;
}

/**
 * Fetch districts list
 */
export async function fetchPayanaDistricts(): Promise<DropdownDto[]> {
  const response = await fetch(`${API_BASE_URL}/api/payanastudents/districts`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch districts: ${response.statusText}`);
  }

  const data: ApiSuccessResponse<DropdownDto[]> = await response.json();
  
  if (!data.Success) {
    throw new Error(data.Message || 'Failed to load districts');
  }

  return data.Data!;
}

/**
 * Submit Payana application with files
 */
export async function submitPayanaApplication(
  formData: PayanaFormValues,
  files: Record<string, { uri: string; name: string; type: string } | undefined>
): Promise<ApiSuccessResponse> {
  const formDataPayload = new FormData();

  // Add form fields with exact API casing
  formDataPayload.append('StudentName', formData.personal.studentName);
  formDataPayload.append('DateOfBirth', formData.personal.dateOfBirth || '');
  formDataPayload.append('GenderID', String(formData.personal.genderID));
  formDataPayload.append('ContactNumber', formData.contact.contactNumber);
  formDataPayload.append('AlternateNumber', formData.contact.alternateNumber || '');
  formDataPayload.append('Email', formData.contact.email);
  formDataPayload.append('RAddress', formData.address.residentialAddress);
  formDataPayload.append('CAddress', formData.address.currentAddress);
  formDataPayload.append('Place', formData.address.place || '');
  formDataPayload.append('Taluka', formData.address.taluka);
  formDataPayload.append('DistrictID', String(formData.address.districtID));
  formDataPayload.append('OtherDistrict', formData.address.otherDistrict || '');
  formDataPayload.append('PinCode', formData.address.pincode);
  formDataPayload.append('AreaTypeID', String(formData.address.areaTypeID));
  formDataPayload.append('CasteCategoryID', String(formData.category.casteCategoryID));
  formDataPayload.append('HouseTypeID', String(formData.category.houseTypeID));
  formDataPayload.append('FatherName', formData.family.fatherName);
  formDataPayload.append('MotherName', formData.family.motherName);
  formDataPayload.append('FatherOccupationID', formData.family.fatherOccupationID ? String(formData.family.fatherOccupationID) : '');
  formDataPayload.append('MotherOccupationID', formData.family.motherOccupationID ? String(formData.family.motherOccupationID) : '');
  formDataPayload.append('FamilyMembers', String(formData.family.familyMembers));
  formDataPayload.append('FamilyIncome', formData.family.familyIncome);
  formDataPayload.append('ParentBank', formData.family.parentBank);
  formDataPayload.append('CourseID', String(formData.academic.courseID));
  formDataPayload.append('CollegeName', formData.academic.collegeName);
  formDataPayload.append('CollegeTypeID', String(formData.academic.collegeTypeID));
  formDataPayload.append('CollegeCNumber', formData.academic.collegeCNumber || '');
  formDataPayload.append('CourseSA', formData.academic.courseSA);
  formDataPayload.append('CourseStream', formData.academic.courseStream || '');
  formDataPayload.append('AnnualFees', formData.academic.annualFees);
  formDataPayload.append('TotalExpenses', formData.academic.totalExpenses);
  formDataPayload.append('StudentAchivements', formData.academic.studentAchievements || '');
  formDataPayload.append('securedPercentage', formData.academic.securedPercentage);
  formDataPayload.append('accountholdername', formData.bank.accountHolderName);
  formDataPayload.append('bankaccountno', formData.bank.bankAccountNo);
  formDataPayload.append('ifsccode', formData.bank.ifscCode);
  formDataPayload.append('bankname', formData.bank.bankName);
  formDataPayload.append('branchname', formData.bank.branchName);
  formDataPayload.append('IsAgreed', String(formData.agreement.isAgreed));
  formDataPayload.append('HouseVisitLink', formData.documents.houseVisitLink || '');

  // Add files
  const fileMappings: Record<string, string> = {
    latestMarksCard: 'latestmarkscard',
    studentPassbookFP: 'studentpassbookFP',
    studentPhoto: 'StudentPhoto',
    dwellingUnit: 'dwellingunit',
    aadhaarCard: 'adharcard',
  };

  Object.entries(fileMappings).forEach(([key, apiFieldName]) => {
    const file = files[key];
    if (file) {
      formDataPayload.append(apiFieldName, {
        uri: file.uri,
        name: file.name,
        type: file.type,
      } as any);
    }
  });

  const response = await fetch(`${API_BASE_URL}/api/payanastudents/create`, {
    method: 'POST',
    body: formDataPayload,
    headers: {
      // Don't set Content-Type - let the browser set it with boundary for multipart
    },
  });

  if (response.status === 409) {
    const errorData: ApiErrorResponse = await response.json();
    throw new Error(errorData.Message || 'This email is already registered. You can only apply once.');
  }

  if (!response.ok) {
    const errorData: ApiErrorResponse = await response.json().catch(() => ({ Success: false, Message: 'Server error' }));
    throw new Error(errorData.Message || `Submission failed: ${response.statusText}`);
  }

  const data: ApiSuccessResponse = await response.json();
  
  if (!data.Success) {
    throw new Error(data.Message || 'Submission failed');
  }

  return data;
}
