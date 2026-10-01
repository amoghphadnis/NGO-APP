/**
 * Normalizes Semi Professional Student dropdown responses to consistent UI format
 * Based on API contract: GET /api/semi-professional/form-data
 */

import { NormalizedDropdownOption } from './normalizeDropdowns';

export interface NormalizedSemiProfDropdowns {
  districts: NormalizedDropdownOption[];
  genders: NormalizedDropdownOption[];
  casteCategories: NormalizedDropdownOption[];
  fatherOccupations: NormalizedDropdownOption[];
  motherOccupations: NormalizedDropdownOption[];
  places: NormalizedDropdownOption[];
  areaTypes: NormalizedDropdownOption[];
  houseTypes: NormalizedDropdownOption[];
  collegeTypes: NormalizedDropdownOption[];
  semiProfessionalCourses: NormalizedDropdownOption[];
  lastDate?: string;
}

/**
 * Normalizes the GET /form-data response for Semi Professional dropdowns
 */
export function normalizeSemiProfessionalDropdowns(apiResponse: any): NormalizedSemiProfDropdowns {

  // The contract wraps master lists inside a `Masters` object; fall back to the root object
  const masters = apiResponse.Masters || apiResponse;

  const raw = {
    districts: masters.DistrictList || masters.Districts || masters.districts || [],
    genders: masters.GenderList || masters.Genders || masters.genders || [],
    casteCategories:
      masters.CasteList ||
      masters.CasteCategories ||
      masters.casteCategories ||
      masters.Castes ||
      masters.castes ||
      [],
    fatherOccupations:
      masters.FatherOccupationList ||
      masters.FatherOccupations ||
      masters.fatherOccupations ||
      masters.FatherOcc ||
      masters.fatherOcc ||
      [],
    motherOccupations:
      masters.MotherOccupationList ||
      masters.MotherOccupations ||
      masters.motherOccupations ||
      masters.MotherOcc ||
      masters.motherOcc ||
      [],
    places:
      masters.PlaceList ||
      masters.Places ||
      masters.places ||
      [],
    areaTypes:
      masters.AreaList ||
      masters.AreaTypes ||
      masters.areaTypes ||
      masters.areas ||
      [],
    houseTypes:
      masters.HouseList ||
      masters.HouseTypes ||
      masters.houseTypes ||
      masters.Houses ||
      masters.houses ||
      [],
    collegeTypes: masters.CollegeTypeList || masters.CollegeTypes || masters.collegeTypes || [],
    semiProfessionalCourses:
      masters.SemiProfessionalCourseList ||
      masters.SemiProfessionalCourses ||
      masters.semiProfessionalCourses ||
      [],
  };

  const normalized: NormalizedSemiProfDropdowns = {
    lastDate: apiResponse.LastDate,
    districts: normalizeGenericDropdown(raw.districts),
    genders: normalizeGenericDropdown(raw.genders),
    casteCategories: normalizeGenericDropdown(raw.casteCategories),
    fatherOccupations: normalizeGenericDropdown(raw.fatherOccupations),
    motherOccupations: normalizeGenericDropdown(raw.motherOccupations),
    places: normalizeGenericDropdown(raw.places),
    areaTypes: normalizeAreaTypes(raw.areaTypes),
    houseTypes: normalizeHouseTypes(raw.houseTypes),
    collegeTypes: normalizeGenericDropdown(raw.collegeTypes),
    semiProfessionalCourses: normalizeGenericDropdown(raw.semiProfessionalCourses),
  };

  console.log('[normalizeSemiProfDropdowns] Normalized:', JSON.stringify(normalized, null, 2));
  return normalized;
}

function normalizeGenericDropdown(data: any[]): NormalizedDropdownOption[] {
  if (!Array.isArray(data)) {
    console.log('[normalizeSemiProfDropdowns] Data is not an array:', data);
    return [];
  }
  return data
    .map((item) => ({
      value: item.Id ?? item.ID ?? item.id ?? item.value ?? item.Value ?? item.PlaceID ?? item.DistrictID,
      label: item.Name ?? item.name ?? item.label ?? item.Text ?? item.PlaceName ?? item.DistrictName ?? '',
    }))
    .filter((item) => item.value !== undefined && item.value !== null && item.value !== '');
}

function normalizeAreaTypes(data: any[]): NormalizedDropdownOption[] {
  if (!Array.isArray(data)) {
    return [];
  }
  return data
    .map((item) => ({
      value: item.AreaTypeID ?? item.AreaTypeId ?? item.Id ?? item.ID ?? item.id ?? item.value ?? item.Value,
      label: item.AreaTypeName ?? item.Name ?? item.name ?? item.label ?? item.Text ?? '',
    }))
    .filter((item) => item.value !== undefined && item.value !== null && item.value !== '');
}

function normalizeHouseTypes(data: any[]): NormalizedDropdownOption[] {
  if (!Array.isArray(data)) {
    return [];
  }
  return data
    .map((item) => ({
      value: item.HouseTypeID ?? item.HouseTypeId ?? item.Id ?? item.ID ?? item.id ?? item.value ?? item.Value,
      label: item.HouseTypeName ?? item.Name ?? item.name ?? item.label ?? item.Text ?? '',
    }))
    .filter((item) => item.value !== undefined && item.value !== null && item.value !== '');
}
