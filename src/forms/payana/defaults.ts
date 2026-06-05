/**
 * Payana Form Default Values
 * Defines default values for Payana form fields
 */

export const PAYANA_FORM_DEFAULTS = {
  guidelines: {
    accepted: false,
  },
  personal: {
    studentName: '',
    dateOfBirth: '',
    genderID: 0,
  },
  contact: {
    contactNumber: '',
    alternateNumber: '',
    email: '',
  },
  address: {
    residentialAddress: '',
    currentAddress: '',
    place: '',
    taluka: '',
    districtID: 0,
    otherDistrict: '',
    pincode: '',
    areaTypeID: 0,
  },
  family: {
    fatherName: '',
    motherName: '',
    fatherOccupationID: undefined as number | undefined,
    motherOccupationID: undefined as number | undefined,
    familyMembers: 1,
    familyIncome: '',
    parentBank: '',
  },
  category: {
    casteCategoryID: 0,
    houseTypeID: 0,
  },
  academic: {
    courseID: 0,
    collegeName: '',
    collegeTypeID: 0,
    collegeCNumber: '',
    courseSA: '',
    courseStream: '',
    annualFees: '',
    totalExpenses: '',
    studentAchievements: '',
    securedPercentage: '',
  },
  bank: {
    accountHolderName: '',
    bankAccountNo: '',
    ifscCode: '',
    bankName: '',
    branchName: '',
  },
  documents: {
    latestMarksCard: undefined,
    studentPassbookFP: undefined,
    studentPhoto: undefined,
    dwellingUnit: undefined,
    aadhaarCard: undefined,
    houseVisitLink: '',
  },
  agreement: {
    isAgreed: false,
  },
};
