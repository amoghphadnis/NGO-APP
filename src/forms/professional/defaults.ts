/**
 * Professional Form Default Values
 * Defines default values for Professional form fields (PascalCase to match API)
 */

export const PROFESSIONAL_FORM_DEFAULTS = {
  guidelines: {
    accepted: false,
  },
  personal: {
    Email: '',
    StudentName: '',
    DateOfBirth: '',
    ContactNumber: '',
    AlternateNumber: '',
    ResidentialAddress: '',
    GoogleMapLink: '',
    AreaTypeID: 0,
    DistrictID: 0,
    OtherDistrict: '',
    GenderID: 0,
    CasteCategoryID: 0,
  },
  family: {
    FatherName: '',
    MotherName: '',
    FatherOccupationID: 0,
    MotherOccupationID: 0,
    FamilyMembers: 1,
    HouseTypeID: 0,
    MonthlyRent: undefined,
    FamilyIncome: 0,
  },
  academic: {
    PUPercentage: 0,
    CETRank: undefined,
    NEETRank: undefined,
    CourseApplying: '',
    CourseStream: '',
  },
  documents: {
    StudentSelfie: undefined,
    CETNEETRankSheet: undefined,
    DwellingUnitPhoto: undefined,
    MarksSheet12: undefined,
    RequestLetter: undefined,
    HouseVideo: undefined,
    ElectricityBill: undefined,
    IncomeCertificate: undefined,
    RationCard: undefined,
  },
  review: {
    declarationAccepted: false,
  },
};
