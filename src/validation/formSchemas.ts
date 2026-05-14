// Centralized validation schemas for Vidya Poshak Scholarship App
// This file maintains backward compatibility while importing from centralized modules

// Import from centralized validation architecture
import {
  personalDetailsSchema,
  contactDetailsSchema,
  addressDetailsSchema,
  familyDetailsSchema,
  documentDetailsSchema,
  guidelinesSchema,
  type PersonalDetailsFormValues,
  type ContactDetailsFormValues,
  type AddressDetailsFormValues,
  type FamilyDetailsFormValues,
  type DocumentDetailsFormValues,
  type GuidelinesFormValues,
} from './sharedSchemas';

import {
  categoryDetailsSchema,
  academicDetailsSchema,
  bankDetailsSchema,
  professionalFormSchema,
  type CategoryDetailsFormValues,
  type AcademicDetailsFormValues,
  type BankDetailsFormValues,
  type ProfessionalFormValues,
} from './professionalSchemas';

import {
  pucAcademicDetailsSchema,
  pucFormSchema,
  type PucAcademicDetailsFormValues,
  type PucFormValues,
} from './pucSchemas';

// Re-export everything for centralized access
export {
  personalDetailsSchema,
  contactDetailsSchema,
  addressDetailsSchema,
  familyDetailsSchema,
  documentDetailsSchema,
  guidelinesSchema,
  categoryDetailsSchema,
  academicDetailsSchema,
  bankDetailsSchema,
  professionalFormSchema,
  pucAcademicDetailsSchema,
  pucFormSchema,
  type PersonalDetailsFormValues,
  type ContactDetailsFormValues,
  type AddressDetailsFormValues,
  type FamilyDetailsFormValues,
  type DocumentDetailsFormValues,
  type GuidelinesFormValues,
  type CategoryDetailsFormValues,
  type AcademicDetailsFormValues,
  type BankDetailsFormValues,
  type ProfessionalFormValues,
  type PucAcademicDetailsFormValues,
  type PucFormValues,
};

// Legacy exports for backward compatibility
export { personalDetailsSchema as personalSchema };
export { contactDetailsSchema as contactSchema };
export { type PersonalDetailsFormValues as PersonalFormValues };
export { type ContactDetailsFormValues as ContactFormValues };
