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
  fatherOcc?: NormalizedDropdownOption[];
  motherOcc?: NormalizedDropdownOption[];
  collegeTypes?: NormalizedDropdownOption[];
}

/**
 * Normalizes Professional dropdown response
 */
export function normalizeProfessionalDropdowns(apiResponse: any): NormalizedDropdowns {
  // Debug: log raw response
  console.log('[normalizeDropdowns] Raw API response:', JSON.stringify(apiResponse, null, 2));

  // Handle both capitalized and lowercase keys from backend
  const districts = apiResponse.Districts || apiResponse.districts || [];
  const genders = apiResponse.Genders || apiResponse.genders || [];
  const castes = apiResponse.Castes || apiResponse.castes || apiResponse.CasteCategories || apiResponse.casteCategories || [];
  const courses = apiResponse.Courses || apiResponse.courses || apiResponse.CourseTypes || apiResponse.courseTypes || [];
  const places = apiResponse.Places || apiResponse.places || [];
  const fatherOcc = apiResponse.FatherOcc || apiResponse.fatherOcc || [];
  const motherOcc = apiResponse.MotherOcc || apiResponse.motherOcc || [];
  const collegeTypes = apiResponse.CollegeTypes || apiResponse.collegeTypes || [];

  const normalized = {
    districts: normalizeDistricts(districts),
    genders: normalizeGenders(genders),
    castes: normalizeCastes(castes),
    courses: normalizeCourses(courses),
    places: normalizePlaces(places),
    fatherOcc: normalizeOccupations(fatherOcc),
    motherOcc: normalizeOccupations(motherOcc),
    collegeTypes: normalizeCollegeTypes(collegeTypes),
  };

  // Debug: log normalized response
  console.log('[normalizeDropdowns] Normalized dropdowns:', JSON.stringify(normalized, null, 2));

  return normalized;
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

/**
 * Normalizes Payana dropdown response (same structure as Professional)
 */
export function normalizePayanaDropdowns(apiResponse: any): NormalizedDropdowns {
  return normalizeProfessionalDropdowns(apiResponse);
}

function normalizeDistricts(data: any[]): NormalizedDropdownOption[] {
  if (!Array.isArray(data)) {
    console.log('[normalizeDistricts] Data is not an array:', data);
    return [];
  }
  return data
    .map((item) => ({
      value: item.DistrictID ?? item.Id ?? item.id ?? item.value ?? item.DistrictId,
      label: item.DistrictName ?? item.Name ?? item.name ?? item.label ?? '',
    }))
    .filter((item) => item.value !== undefined && item.value !== null && !isNaN(Number(item.value)));
}

function normalizeGenders(data: any[]): NormalizedDropdownOption[] {
  if (!Array.isArray(data)) {
    console.log('[normalizeGenders] Data is not an array:', data);
    return [];
  }
  return data
    .map((item) => ({
      value: item.GenderID ?? item.Id ?? item.id ?? item.value ?? item.GenderId,
      label: item.GenderName ?? item.Name ?? item.name ?? item.label ?? '',
    }))
    .filter((item) => item.value !== undefined && item.value !== null && !isNaN(Number(item.value)));
}

function normalizeCastes(data: any[]): NormalizedDropdownOption[] {
  if (!Array.isArray(data)) {
    console.log('[normalizeCastes] Data is not an array:', data);
    return [];
  }
  return data
    .map((item) => ({
      value: item.CasteCategoryID ?? item.Id ?? item.id ?? item.value ?? item.CasteCategoryId,
      label: item.CasteCategoryName ?? item.Name ?? item.name ?? item.label ?? '',
    }))
    .filter((item) => item.value !== undefined && item.value !== null && !isNaN(Number(item.value)));
}

function normalizeCourses(data: any[]): NormalizedDropdownOption[] {
  if (!Array.isArray(data)) {
    console.log('[normalizeCourses] Data is not an array:', data);
    return [];
  }
  return data
    .map((item) => ({
      value: item.CourseTypeID ?? item.Id ?? item.id ?? item.value ?? item.CourseTypeId,
      label: item.CourseTypeName ?? item.Name ?? item.name ?? item.label ?? '',
    }))
    .filter((item) => item.value !== undefined && item.value !== null && !isNaN(Number(item.value)));
}

function normalizePlaces(data: any[]): NormalizedDropdownOption[] {
  if (!Array.isArray(data)) {
    console.log('[normalizePlaces] Data is not an array:', data);
    return [];
  }
  return data
    .map((item) => ({
      value: item.PlaceID ?? item.Id ?? item.id ?? item.value ?? item.PlaceId,
      label: item.PlaceName ?? item.Name ?? item.name ?? item.label ?? '',
    }))
    .filter((item) => item.value !== undefined && item.value !== null && !isNaN(Number(item.value)));
}

function normalizeOccupations(data: any[]): NormalizedDropdownOption[] {
  if (!Array.isArray(data)) {
    console.log('[normalizeOccupations] Data is not an array:', data);
    return [];
  }
  return data
    .map((item) => ({
      value: item.OccupationID ?? item.Id ?? item.id ?? item.value ?? item.OccupationId,
      label: item.OccupationName ?? item.Name ?? item.name ?? item.label ?? '',
    }))
    .filter((item) => item.value !== undefined && item.value !== null && !isNaN(Number(item.value)));
}

function normalizeCollegeTypes(data: any[]): NormalizedDropdownOption[] {
  if (!Array.isArray(data)) {
    console.log('[normalizeCollegeTypes] Data is not an array:', data);
    return [];
  }
  return data
    .map((item) => ({
      value: item.CollegeTypeID ?? item.Id ?? item.id ?? item.value ?? item.CollegeTypeId,
      label: item.CollegeTypeName ?? item.Name ?? item.name ?? item.label ?? '',
    }))
    .filter((item) => item.value !== undefined && item.value !== null && !isNaN(Number(item.value)));
}
