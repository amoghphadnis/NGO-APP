/**
 * Normalizes backend dropdown responses to consistent UI format
 * UI components should never depend on raw backend response shape
 */

export interface NormalizedDropdownOption {
  value: string | number;
  label: string;
}

export interface NormalizedDistricts {
  districts: NormalizedDropdownOption[];
}

export interface NormalizedGenders {
  genders: NormalizedDropdownOption[];
}

export interface NormalizedCastes {
  castes: NormalizedDropdownOption[];
}

export interface NormalizedCourses {
  courses: NormalizedDropdownOption[];
}

export interface NormalizedPlaces {
  places: NormalizedDropdownOption[];
}

export interface NormalizedDropdowns {
  districts: NormalizedDropdownOption[];
  genders: NormalizedDropdownOption[];
  castes: NormalizedDropdownOption[];
  courses: NormalizedDropdownOption[];
  places: NormalizedDropdownOption[];
}

/**
 * Normalizes Professional dropdown response
 */
export function normalizeProfessionalDropdowns(apiResponse: any): NormalizedDropdowns {
  return {
    districts: normalizeDistricts(apiResponse.districts),
    genders: normalizeGenders(apiResponse.genders),
    castes: normalizeCastes(apiResponse.castes),
    courses: normalizeCourses(apiResponse.courses),
    places: normalizePlaces(apiResponse.places),
  };
}

/**
 * Normalizes PUC dropdown response
 */
export function normalizePUCDropdowns(apiResponse: any): NormalizedDropdowns {
  return {
    districts: normalizeDistricts(apiResponse.districts),
    genders: normalizeGenders(apiResponse.genders),
    castes: normalizeCastes(apiResponse.castes),
    courses: normalizeCourses(apiResponse.courses),
    places: normalizePlaces(apiResponse.places),
  };
}

function normalizeDistricts(data: any[]): NormalizedDropdownOption[] {
  if (!Array.isArray(data)) return [];
  return data.map((item) => ({
    value: item.DistrictID ?? item.id ?? item.value,
    label: item.DistrictName ?? item.name ?? item.label ?? '',
  }));
}

function normalizeGenders(data: any[]): NormalizedDropdownOption[] {
  if (!Array.isArray(data)) return [];
  return data.map((item) => ({
    value: item.GenderID ?? item.id ?? item.value,
    label: item.GenderName ?? item.name ?? item.label ?? '',
  }));
}

function normalizeCastes(data: any[]): NormalizedDropdownOption[] {
  if (!Array.isArray(data)) return [];
  return data.map((item) => ({
    value: item.CasteCategoryID ?? item.id ?? item.value,
    label: item.CasteCategoryName ?? item.name ?? item.label ?? '',
  }));
}

function normalizeCourses(data: any[]): NormalizedDropdownOption[] {
  if (!Array.isArray(data)) return [];
  return data.map((item) => ({
    value: item.CourseTypeID ?? item.id ?? item.value,
    label: item.CourseTypeName ?? item.name ?? item.label ?? '',
  }));
}

function normalizePlaces(data: any[]): NormalizedDropdownOption[] {
  if (!Array.isArray(data)) return [];
  return data.map((item) => ({
    value: item.PlaceID ?? item.id ?? item.value,
    label: item.PlaceName ?? item.name ?? item.label ?? '',
  }));
}
