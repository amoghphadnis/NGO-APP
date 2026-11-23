/**
 * PUC Format 1.1 Form Default Values
 * Defines default values for PUC form fields per the Format 1.1 contract
 */

export const PUC_FORM_DEFAULTS = {
  guidelines: {
    accepted: false,
  },
  personal: {
    StudentName: '',
    DateOfBirth: '',
    Gender: 0,
    Caste: 0,
    Place: 0,
  },
  contact: {
    Email: '',
    ContactNumber: '',
    AlternateNumber: '',
  },
  address: {
    District: 0,
    OtherDistrict: '',
    Taluk: '',
    ResidentialAddress: '',
  },
  family: {
    FatherOccupation: 0,
    MotherOccupation: 0,
    TotalFamilyMembers: undefined as any,
    FamilyAnnualIncome: 0,
  },
  academic: {
    SSLCPercentage: undefined as any,
    CourseJoined: 0,
    CollegeName: '',
    CollegeType: 0,
    CollegeFees: 0,
  },
  documents: {
    StudentSelfie: undefined,
    SSLCMarksCard: undefined,
  },
  review: {
    declarationAccepted: false,
  },
};
