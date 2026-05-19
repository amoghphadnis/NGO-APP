// Centralized validation schemas for Vidya Poshak Scholarship App
// This file maintains backward compatibility while importing from centralized modules

// Import from centralized validation architecture
import {
  personalDetailsSchema,
  contactDetailsSchema,
  addressDetailsSchema,
  familyDetailsSchema,
  guidelinesSchema,
  type PersonalDetailsFormValues,
  type ContactDetailsFormValues,
  type AddressDetailsFormValues,
  type FamilyDetailsFormValues,
  type GuidelinesFormValues,
} from './sharedSchemas';

import {
  categoryDetailsSchema,
  academicDetailsSchema,
  bankDetailsSchema,
  professionalFormSchema,
  professionalDocumentDetailsSchema,
  type CategoryDetailsFormValues,
  type AcademicDetailsFormValues,
  type BankDetailsFormValues,
  type ProfessionalFormValues,
  type ProfessionalDocumentDetailsFormValues,
} from './professionalSchemas';

import {
  pucAcademicDetailsSchema,
  pucFormSchema,
  pucDocumentDetailsSchema,
  type PucAcademicDetailsFormValues,
  type PucFormValues,
  type PUCDocumentDetailsFormValues,
} from './pucSchemas';

// Re-export everything for centralized access
export {
  personalDetailsSchema,
  contactDetailsSchema,
  addressDetailsSchema,
  familyDetailsSchema,
  guidelinesSchema,
  categoryDetailsSchema,
  academicDetailsSchema,
  bankDetailsSchema,
  professionalFormSchema,
  professionalDocumentDetailsSchema,
  pucAcademicDetailsSchema,
  pucFormSchema,
  pucDocumentDetailsSchema,
  type PersonalDetailsFormValues,
  type ContactDetailsFormValues,
  type AddressDetailsFormValues,
  type FamilyDetailsFormValues,
  type GuidelinesFormValues,
  type CategoryDetailsFormValues,
  type AcademicDetailsFormValues,
  type BankDetailsFormValues,
  type ProfessionalFormValues,
  type ProfessionalDocumentDetailsFormValues,
  type PucAcademicDetailsFormValues,
  type PucFormValues,
  type PUCDocumentDetailsFormValues,
};

// Legacy exports for backward compatibility
export { personalDetailsSchema as personalSchema };
export { contactDetailsSchema as contactSchema };
export { type PersonalDetailsFormValues as PersonalFormValues };
export { type ContactDetailsFormValues as ContactFormValues };
