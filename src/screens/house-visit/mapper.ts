/**
 * Maps House Visit form data to API payload format
 */

import { HouseVisitFormValues } from '@/validation/houseVisitSchemas';
import { HouseVisitCreatePayload, FamilyMemberDto } from '@/types/houseVisit';

/**
 * Convert array to comma-separated string
 */
function arrayToString(arr: string[]): string {
  return arr.join(',');
}

/**
 * Map family members to DTO format
 */
function mapFamilyMembers(members: { name: string; relation: string; age?: string; education?: string; occupation?: string; monthlyIncome?: string }[]): FamilyMemberDto[] {
  return members.map((m) => ({
    Name: m.name,
    Relation: m.relation,
    Age: m.age || '',
    Education: m.education || '',
    Occupation: m.occupation || '',
    MonthlyIncome: m.monthlyIncome || '',
  }));
}

/**
 * Map form values to API payload
 */
export function mapHouseVisitFormToPayload(
  formData: HouseVisitFormValues,
  studentID: number,
  source: string
): HouseVisitCreatePayload {
  return {
    StudentID: studentID,
    Source: source.toUpperCase(),
    StudentName: formData.basicDetails.studentName,
    CourseInstitution: formData.basicDetails.courseInstitution || '',
    Address: formData.basicDetails.address,
    VisitDate: formData.basicDetails.visitDate,
    FieldSupervisorName: formData.basicDetails.fieldSupervisorName || '',
    PersonsInteracted: formData.basicDetails.personsInteracted || '',

    // Housing conditions
    HouseType: arrayToString(formData.housingConditions.houseType),
    Ownership: arrayToString(formData.housingConditions.ownership),
    Rooms: arrayToString(formData.housingConditions.rooms),
    Floor: arrayToString(formData.housingConditions.floor),

    // Social data
    RationCardType: formData.socialData.rationCardType,
    DigitalAccess: formData.socialData.digitalAccess,
    LivingCondition: arrayToString(formData.socialData.livingCondition),
    LatestElecBill: formData.socialData.latestElecBill || '',
    ElecUnitsCons: formData.socialData.elecUnitsCons || '',
    InternetBillCharges: formData.socialData.internetBillCharges || '',
    RemarkGeneralLivingCondition: formData.socialData.remarkGeneralLivingCondition || '',

    // Family composition
    FamilyMembers: mapFamilyMembers(formData.familyComposition.members),
    Totalfamily: formData.familyComposition.totalFamilyMembers || '',

    // Income stability
    PrimaryIncomeSource: arrayToString(formData.incomeStability.primaryIncomeSource),
    NatureofIncome: arrayToString(formData.incomeStability.natureOfIncome),
    PrimaryEarning: formData.incomeStability.primaryEarningPerson || '',
    AverageIncome: formData.incomeStability.averageIncome || '',
    IncomeShocks: arrayToString(formData.incomeStability.incomeShocks),

    // Land holdings
    AgriculturalLand: arrayToString(formData.landHoldings.agriculturalLand),
    WaterSource: arrayToString(formData.landHoldings.waterSource),
    CropPattern: arrayToString(formData.landHoldings.cropPattern),
    OtherLandHoldings: formData.landHoldings.otherLandHoldings || '',

    // Educational expenses
    TotalChildrenStudying: formData.educationalExpenses.totalChildrenStudying || '',
    AnnualEducationExpense: formData.educationalExpenses.annualEducationExpense || '',
    ScholarshipSupport: formData.educationalExpenses.scholarshipSupport,
    GovernmentSchemes: formData.educationalExpenses.governmentSchemes || '',

    // Debt & financial
    EducationalLoanAmount: formData.debtFinancial.educationalLoanAmount || '',
    AnyOutstandingLoans: arrayToString(formData.debtFinancial.outstandingLoans),
    OutstandingLoanAmount: formData.debtFinancial.outstandingLoanAmount || '',
    MonthlyEMI: formData.debtFinancial.monthlyEMI || '',

    // Health vulnerability
    HealthVulnerability: formData.healthVulnerability.vulnerabilityType,
    HealthVulnerabilityRemarks: formData.healthVulnerability.remarks || '',

    // Assets
    Assets: arrayToString(formData.assets.assets),

    // Student development
    Extracurricular: arrayToString(formData.studentDevelopment.extracurricular),
    StudentAspiration: formData.studentDevelopment.studentAspiration || '',
    ConsentParticipation: formData.studentDevelopment.consentParticipation,
    Remarks: formData.studentDevelopment.remarks || '',

    // Supervisor assessment
    HouseholdVulnerabilityLevel: arrayToString(formData.supervisorAssessment.householdVulnerabilityLevel),
    StudentMotivation: formData.supervisorAssessment.studentMotivation,
    Recommendation: arrayToString(formData.supervisorAssessment.recommendation),
    SupervisorJustification: formData.supervisorAssessment.justification || '',

    // Declaration
    DeclarationConfirmation: formData.declaration.confirmation,
    DeclarationDate: formData.declaration.date,
  };
}
