/**
 * Professional Form Dropdown Configuration
 * Defines which dropdowns are used and their requirements for Professional form
 */

export interface ProfessionalDropdownConfig {
  districts: {
    required: boolean;
    allowOther: boolean;
  };
  genders: {
    required: boolean;
  };
  castes: {
    required: boolean;
  };
  courses: {
    required: boolean;
  };
  places: {
    required: boolean;
  };
}

export const PROFESSIONAL_DROPDOWN_CONFIG: ProfessionalDropdownConfig = {
  districts: {
    required: true,
    allowOther: true,
  },
  genders: {
    required: true,
  },
  castes: {
    required: true,
  },
  courses: {
    required: true,
  },
  places: {
    required: true,
  },
};

export function isDropdownRequired(dropdownType: keyof ProfessionalDropdownConfig): boolean {
  return PROFESSIONAL_DROPDOWN_CONFIG[dropdownType].required;
}

export function allowsOtherDistrict(): boolean {
  return PROFESSIONAL_DROPDOWN_CONFIG.districts.allowOther;
}
