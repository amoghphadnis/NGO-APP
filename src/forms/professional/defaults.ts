/**
 * Professional Form Default Values
 * Defines default values for Professional form fields (PascalCase to match API)
 */

export const PROFESSIONAL_FORM_DEFAULTS = {
  guidelines: {
    accepted: false,
  },
  personal: {
    StudentName: '',
    DateOfBirth: '',
    GenderID: 0,
    CasteCategoryID: 0,
  },
  contact: {
    Email: '',
    ContactNumber: '',
  },
  address: {
    Pincode: '',
    DistrictID: 0,
    OtherDistrict: '',
    Taluk: '',
    PlaceID: 0,
    Address: '',
  },
  family: {
    FatherOccupationID: undefined,
    MotherOccupationID: undefined,
    FamilyMembers: 1,
    AnnualIncome: '',
  },
  academic: {
    PUPercentage: 0,
    CET_NEET_Rank: undefined,
    CourseTypeID: 0,
    CollegeName: '',
    CollegeTypeID: 0,
    CollegeFees: 0,
  },
  documents: {
    PUCMarksCard: undefined,
    IncomeCertificate: undefined,
    Rationcard: undefined,
    Electricitybill: undefined,
    CollegeID: undefined,
    Admissionproof: undefined,
    FeesReceipts: undefined,
    Expenditure: undefined,
    Studentphoto: undefined,
    Photoinfrontofcollege: undefined,
    Dwellingunit: undefined,
    CET: undefined,
    Studentpass: undefined,
    Monthsbank: undefined,
    AadharCard: undefined,
    Handwritten: undefined,
    HouseVisitLink: '',
  },
  review: {
    declarationAccepted: false,
  },
};
