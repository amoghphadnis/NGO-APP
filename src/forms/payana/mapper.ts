import { PayanaFormValues } from '@/validation/payanaSchemas';

/**
 * Maps Payana form values to API payload format
 * The backend expects specific field casing
 */
export function mapPayanaFormToApiPayload(formData: PayanaFormValues): Record<string, any> {
  return {
    // Personal details
    StudentName: formData.personal.studentName,
    DateOfBirth: formData.personal.dateOfBirth || '',
    GenderID: formData.personal.genderID,

    // Contact details
    ContactNumber: formData.contact.contactNumber,
    AlternateNumber: formData.contact.alternateNumber || '',
    Email: formData.contact.email,

    // Address details
    RAddress: formData.address.residentialAddress,
    CAddress: formData.address.currentAddress,
    Place: formData.address.place || '',
    Taluka: formData.address.taluka,
    DistrictID: formData.address.districtID,
    OtherDistrict: formData.address.otherDistrict || '',
    PinCode: formData.address.pincode,
    AreaTypeID: formData.address.areaTypeID,

    // Category details
    CasteCategoryID: formData.category.casteCategoryID,
    HouseTypeID: formData.category.houseTypeID,

    // Family details
    FatherName: formData.family.fatherName,
    MotherName: formData.family.motherName,
    FatherOccupationID: formData.family.fatherOccupationID || '',
    MotherOccupationID: formData.family.motherOccupationID || '',
    FamilyMembers: formData.family.familyMembers,
    FamilyIncome: formData.family.familyIncome,
    ParentBank: formData.family.parentBank,

    // Academic details
    CourseID: formData.academic.courseID,
    CollegeName: formData.academic.collegeName,
    CollegeTypeID: formData.academic.collegeTypeID,
    CollegeCNumber: formData.academic.collegeCNumber || '',
    CourseSA: formData.academic.courseSA,
    CourseStream: formData.academic.courseStream || '',
    AnnualFees: formData.academic.annualFees,
    TotalExpenses: formData.academic.totalExpenses,
    StudentAchivements: formData.academic.studentAchievements || '',
    securedPercentage: formData.academic.securedPercentage,

    // Bank details
    accountholdername: formData.bank.accountHolderName,
    bankaccountno: formData.bank.bankAccountNo,
    ifsccode: formData.bank.ifscCode,
    bankname: formData.bank.bankName,
    branchname: formData.bank.branchName,

    // Agreement and optional fields
    IsAgreed: formData.agreement.isAgreed,
    HouseVisitLink: formData.documents.houseVisitLink || '',
  };
}

/**
 * Maps file keys to API field names
 */
export const PAYANA_FILE_MAPPINGS: Record<string, string> = {
  latestMarksCard: 'latestmarkscard',
  studentPassbookFP: 'studentpassbookFP',
  studentPhoto: 'StudentPhoto',
  dwellingUnit: 'dwellingunit',
  aadhaarCard: 'adharcard',
};
