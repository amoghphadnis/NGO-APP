/**
 * Professional Form Default Values
 * Defines default values for Professional form fields
 */

export const PROFESSIONAL_FORM_DEFAULTS = {
  guidelines: {
    accepted: false,
  },
  personal: {
    name: '',
    dateOfBirth: '',
    gender: '',
    caste: '',
  },
  contact: {
    email: '',
    phone: '',
  },
  address: {
    pincode: '',
    district: '',
    otherDistrict: '',
    taluk: '',
    place: '',
    address: '',
  },
  family: {
    fatherOccupationID: '',
    motherOccupationID: '',
    familyMembers: 1,
    annualIncome: '',
  },
  category: {
    scholarshipCategory: '',
    courseType: '',
  },
  academic: {
    puPercentage: 0,
    cetNeetRank: undefined,
    course: '',
    collegeName: '',
    collegeType: 'Government' as const,
    annualCollegeFees: 0,
  },
  bank: {
    accountHolderName: '',
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    branchName: '',
    ifscVerified: false,
  },
  documents: {
    marksCard: undefined,
    incomeCert: undefined,
    aadhaar: undefined,
  },
  review: {
    declarationAccepted: false,
  },
};
