/**
 * PUC Form Dropdown Configuration
 * Defines which dropdowns are used and their requirements for PUC form
 */

export interface PUCDropdownConfig {
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

export const PUC_DROPDOWN_CONFIG: PUCDropdownConfig = {
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

export function isDropdownRequired(dropdownType: keyof PUCDropdownConfig): boolean {
  return PUC_DROPDOWN_CONFIG[dropdownType].required;
}

export function allowsOtherDistrict(): boolean {
  return PUC_DROPDOWN_CONFIG.districts.allowOther;
}
