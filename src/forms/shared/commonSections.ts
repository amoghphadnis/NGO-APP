/**
 * Common Section Components
 * Registry of shared section components used across both Professional and PUC forms
 */

export const COMMON_SECTIONS = [
  'GuidelinesSection',
  'PersonalSection',
  'ContactSection',
  'AddressSection',
  'FamilySection',
  'DocumentSection',
  'ReviewSection',
  'SuccessSection',
] as const;

export const PROFESSIONAL_ONLY_SECTIONS = [
  'CategorySection',
  'AcademicSection',
  'BankSection',
] as const;

export const PUC_ONLY_SECTIONS = [] as const; // PUC may have specific sections in future

export function isCommonSection(section: string): section is typeof COMMON_SECTIONS[number] {
  return COMMON_SECTIONS.includes(section as typeof COMMON_SECTIONS[number]);
}

export function isProfessionalOnlySection(section: string): section is typeof PROFESSIONAL_ONLY_SECTIONS[number] {
  return PROFESSIONAL_ONLY_SECTIONS.includes(section as typeof PROFESSIONAL_ONLY_SECTIONS[number]);
}

export function isPUCOnlySection(section: string): section is typeof PUC_ONLY_SECTIONS[number] {
  return PUC_ONLY_SECTIONS.includes(section as typeof PUC_ONLY_SECTIONS[number]);
}
