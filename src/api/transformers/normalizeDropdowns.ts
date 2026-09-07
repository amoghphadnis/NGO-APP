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
  courses?: NormalizedDropdownOption[];
  places?: NormalizedDropdownOption[];
  fatherOcc?: NormalizedDropdownOption[];
  motherOcc?: NormalizedDropdownOption[];
  collegeTypes?: NormalizedDropdownOption[];
  areaTypes?: NormalizedDropdownOption[];
  houseTypes?: NormalizedDropdownOption[];
  referenceSources?: NormalizedDropdownOption[];
}

/**
 * Normalizes Professional dropdown response
 */
export function normalizeProfessionalDropdowns(apiResponse: any): NormalizedDropdowns {
  // API may wrap master lists in a `Masters` object or return them directly
  const masters = apiResponse.Masters || apiResponse;

  const districts = masters.DistrictList || masters.Districts || masters.districts || [];
  const genders = masters.GenderList || masters.Genders || masters.genders || [];
  const castes = masters.CasteList || masters.CasteCategories || masters.Castes || masters.castes || masters.casteCategories || [];
  const fatherOcc = masters.FatherOccupationList || masters.FatherOcc || masters.fatherOcc || masters.FatherOccupations || masters.fatherOccupations || [];
  const motherOcc = masters.MotherOccupationList || masters.MotherOcc || masters.motherOcc || masters.MotherOccupations || masters.motherOccupations || [];
  const areaTypes = masters.AreaList || masters.AreaTypes || masters.areaTypes || [];
  const houseTypes = masters.HouseList || masters.HouseTypes || masters.houseTypes || masters.Houses || masters.houses || [];
  const referenceSources = masters.ReferenceList || masters.ReferenceSources || masters.referenceSources || masters.References || masters.references || [];
  const courses = masters.CourseList || masters.Courses || masters.courses || [];
  const collegeTypes = masters.CollegeTypeList || masters.CollegeTypes || masters.collegeTypes || [];

  return {
    districts: normalizeDistricts(districts),
    genders: normalizeGenders(genders),
    castes: normalizeCastes(castes),
    fatherOcc: normalizeOccupations(fatherOcc),
    motherOcc: normalizeOccupations(motherOcc),
    areaTypes: areaTypes.length > 0 ? normalizeAreaTypes(areaTypes) : undefined,
    houseTypes: houseTypes.length > 0 ? normalizeHouseTypes(houseTypes) : undefined,
    referenceSources: referenceSources.length > 0 ? normalizeReferenceSources(referenceSources) : undefined,
    courses: courses.length > 0 ? normalizeCourses(courses) : undefined,
    collegeTypes: collegeTypes.length > 0 ? normalizeCollegeTypes(collegeTypes) : undefined,
  };
}

/**
 * Normalizes PUC dropdown response
 * Handles both lowercase and capitalized keys from API
 * Backend returns *List format: GenderList, CasteList, DistrictList, etc.
 */
export function normalizePUCDropdowns(apiResponse: any): NormalizedDropdowns {
  // Handle both *List (API) and lowercase/capitalized keys
  const districts = apiResponse.DistrictList || apiResponse.Districts || apiResponse.districts || [];
  const genders = apiResponse.GenderList || apiResponse.Genders || apiResponse.genders || [];
  const castes = apiResponse.CasteList || apiResponse.CasteCategories || apiResponse.castes || apiResponse.Castes || [];
  const courses = apiResponse.CourseList || apiResponse.Courses || apiResponse.courses || [];
  const places = apiResponse.PlaceList || apiResponse.Places || apiResponse.places || [];
  const collegeTypes = apiResponse.CollegeTypeList || apiResponse.CollegeTypes || apiResponse.collegeTypes || [];
  const areaTypes = apiResponse.AreaList || apiResponse.AreaTypes || apiResponse.areaTypes || apiResponse.areas || [];
  const fatherOcc = apiResponse.FatherOccupationList || apiResponse.FatherOccupations || apiResponse.fatherOccupations || apiResponse.FatherOcc || apiResponse.fatherOcc || [];
  const motherOcc = apiResponse.MotherOccupationList || apiResponse.MotherOccupations || apiResponse.motherOccupations || apiResponse.MotherOcc || apiResponse.motherOcc || [];
  const houseTypes = apiResponse.HouseList || apiResponse.HouseTypes || apiResponse.houseTypes || apiResponse.Houses || apiResponse.houses || [];
  const referenceSources = apiResponse.ReferenceList || apiResponse.ReferenceSources || apiResponse.referenceSources || apiResponse.References || apiResponse.references || [];

  return {
    districts: normalizeDistricts(districts),
    genders: normalizeGenders(genders),
    castes: normalizeCastes(castes),
    courses: normalizeCourses(courses),
    places: normalizePlaces(places),
    collegeTypes: collegeTypes.length > 0 ? normalizeCollegeTypes(collegeTypes) : undefined,
    areaTypes: areaTypes.length > 0 ? normalizeAreaTypes(areaTypes) : undefined,
    fatherOcc: fatherOcc.length > 0 ? normalizeOccupations(fatherOcc) : undefined,
    motherOcc: motherOcc.length > 0 ? normalizeOccupations(motherOcc) : undefined,
    houseTypes: houseTypes.length > 0 ? normalizeHouseTypes(houseTypes) : undefined,
    referenceSources: referenceSources.length > 0 ? normalizeReferenceSources(referenceSources) : undefined,
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
      value: item.DistrictID ?? item.Id ?? item.id ?? item.value ?? item.DistrictId ?? item.Value,
      label: item.DistrictName ?? item.Name ?? item.name ?? item.label ?? item.Text ?? '',
    }))
    .filter((item) => item.value !== undefined && item.value !== null && item.value !== '');
}

function normalizeGenders(data: any[]): NormalizedDropdownOption[] {
  if (!Array.isArray(data)) {
    console.log('[normalizeGenders] Data is not an array:', data);
    return [];
  }
  return data
    .map((item) => ({
      value: item.GenderID ?? item.Id ?? item.id ?? item.value ?? item.GenderId ?? item.Value,
      label: item.GenderName ?? item.Name ?? item.name ?? item.label ?? item.Text ?? '',
    }))
    .filter((item) => item.value !== undefined && item.value !== null && item.value !== '');
}

function normalizeCastes(data: any[]): NormalizedDropdownOption[] {
  if (!Array.isArray(data)) {
    console.log('[normalizeCastes] Data is not an array:', data);
    return [];
  }
  return data
    .map((item) => ({
      value: item.CasteCategoryID ?? item.Id ?? item.id ?? item.value ?? item.CasteCategoryId ?? item.Value,
      label: item.CasteCategoryName ?? item.CategoryName ?? item.Name ?? item.name ?? item.label ?? item.Text ?? '',
    }))
    .filter((item) => item.value !== undefined && item.value !== null && item.value !== '');
}

function normalizeCourses(data: any[]): NormalizedDropdownOption[] {
  if (!Array.isArray(data)) {
    console.log('[normalizeCourses] Data is not an array:', data);
    return [];
  }
  return data
    .map((item) => ({
      value: item.CourseTypeID ?? item.CourseID ?? item.Id ?? item.id ?? item.value ?? item.CourseTypeId ?? item.Value,
      label: item.CourseTypeName ?? item.CourseName ?? item.Name ?? item.name ?? item.label ?? item.Text ?? '',
    }))
    .filter((item) => item.value !== undefined && item.value !== null && item.value !== '');
}

function normalizePlaces(data: any[]): NormalizedDropdownOption[] {
  if (!Array.isArray(data)) {
    console.log('[normalizePlaces] Data is not an array:', data);
    return [];
  }
  return data
    .map((item) => ({
      value: item.PlaceID ?? item.Id ?? item.id ?? item.value ?? item.PlaceId ?? item.Value,
      label: item.PlaceName ?? item.Name ?? item.name ?? item.label ?? item.Text ?? '',
    }))
    .filter((item) => item.value !== undefined && item.value !== null && item.value !== '');
}

function normalizeOccupations(data: any[]): NormalizedDropdownOption[] {
  if (!Array.isArray(data)) {
    console.log('[normalizeOccupations] Data is not an array:', data);
    return [];
  }
  return data
    .map((item) => ({
      value: item.OccupationID ?? item.FatherOccupationID ?? item.MotherOccupationID ?? item.Id ?? item.id ?? item.value ?? item.OccupationId ?? item.Value,
      label: item.OccupationName ?? item.Name ?? item.name ?? item.label ?? item.Text ?? '',
    }))
    .filter((item) => item.value !== undefined && item.value !== null && item.value !== '');
}

function normalizeCollegeTypes(data: any[]): NormalizedDropdownOption[] {
  if (!Array.isArray(data)) {
    console.log('[normalizeCollegeTypes] Data is not an array:', data);
    return [];
  }
  return data
    .map((item) => ({
      value: item.CollegeTypeID ?? item.Id ?? item.id ?? item.value ?? item.CollegeTypeId ?? item.Value,
      label: item.CollegeTypeName ?? item.Name ?? item.name ?? item.label ?? item.Text ?? '',
    }))
    .filter((item) => item.value !== undefined && item.value !== null && item.value !== '');
}

function normalizeAreaTypes(data: any[]): NormalizedDropdownOption[] {
  if (!Array.isArray(data)) {
    console.log('[normalizeAreaTypes] Data is not an array:', data);
    return [];
  }
  return data
    .map((item) => ({
      value: item.AreaTypeID ?? item.Id ?? item.id ?? item.value ?? item.AreaTypeId ?? item.Value,
      label: item.AreaTypeName ?? item.Name ?? item.name ?? item.label ?? item.Text ?? '',
    }))
    .filter((item) => item.value !== undefined && item.value !== null && item.value !== '');
}

function normalizeHouseTypes(data: any[]): NormalizedDropdownOption[] {
  if (!Array.isArray(data)) {
    console.log('[normalizeHouseTypes] Data is not an array:', data);
    return [];
  }
  return data
    .map((item) => ({
      value: item.HouseTypeID ?? item.HouseTypeId ?? item.Id ?? item.id ?? item.value ?? item.Value,
      label: item.HouseTypeName ?? item.Name ?? item.name ?? item.label ?? item.Text ?? '',
    }))
    .filter((item) => item.value !== undefined && item.value !== null && item.value !== '');
}

function normalizeReferenceSources(data: any[]): NormalizedDropdownOption[] {
  if (!Array.isArray(data)) {
    console.log('[normalizeReferenceSources] Data is not an array:', data);
    return [];
  }
  return data
    .map((item) => ({
      value: item.ReferenceSourceID ?? item.ReferenceSourceId ?? item.Id ?? item.id ?? item.value ?? item.Value,
      label: item.SourceName ?? item.ReferenceSourceName ?? item.Name ?? item.name ?? item.label ?? item.Text ?? '',
    }))
    .filter((item) => item.value !== undefined && item.value !== null && item.value !== '');
}
