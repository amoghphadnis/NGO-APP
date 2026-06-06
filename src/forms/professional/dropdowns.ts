/**
 * Professional Form Dropdown Configuration
 * Defines which dropdowns are used and their requirements for Professional form
 * Based on API GET /professional/dropdowns response
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
  fatherOcc: {
    required: boolean;
  };
  motherOcc: {
    required: boolean;
  };
  collegeTypes: {
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
  fatherOcc: {
    required: false, // Optional per API
  },
  motherOcc: {
    required: false, // Optional per API
  },
  collegeTypes: {
    required: true,
  },
};

export function isDropdownRequired(dropdownType: keyof ProfessionalDropdownConfig): boolean {
  return PROFESSIONAL_DROPDOWN_CONFIG[dropdownType].required;
}

export function allowsOtherDistrict(): boolean {
  return PROFESSIONAL_DROPDOWN_CONFIG.districts.allowOther;
}
