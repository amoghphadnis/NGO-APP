/**
 * PUC Form Default Values
 * Defines default values for PUC form fields
 */

export const PUC_FORM_DEFAULTS = {
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
    fatherOccupationID: undefined as number | undefined,
    motherOccupationID: undefined as number | undefined,
    familyMembers: 1,
    annualIncome: '',
    monthlyRent: '',
    residenceType: 'OWNED' as const,
  },
  documents: {
    sslcMarksCard: undefined,
    studentPhoto: undefined,
    electricityBill: undefined,
    rationCard: undefined,
    incomeCert: undefined,
    familyPhoto: undefined,
    houseVideo: undefined,
  },
  review: {
    declarationAccepted: false,
  },
};
