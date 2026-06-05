/**
 * Normalizes Semi Professional Student dropdown responses to consistent UI format
 * Based on API contract: GET /api/semiprofessionalstudent/create
 */

import { NormalizedDropdownOption } from './normalizeDropdowns';

export interface NormalizedSemiProfDropdowns {
  districts: NormalizedDropdownOption[];
  genders: NormalizedDropdownOption[];
  semiProfessionalCourses: NormalizedDropdownOption[];
  casteCategories: NormalizedDropdownOption[];
  fatherOccupations: NormalizedDropdownOption[];
  motherOccupations: NormalizedDropdownOption[];
  places: NormalizedDropdownOption[];
  collegeTypes: NormalizedDropdownOption[];
}

/**
 * Normalizes the GET /create response for Semi Professional dropdowns
 */
export function normalizeSemiProfessionalDropdowns(apiResponse: any): NormalizedSemiProfDropdowns {
  console.log('[normalizeSemiProfDropdowns] Raw API response:', JSON.stringify(apiResponse, null, 2));

  const districts = apiResponse.districts || apiResponse.Districts || [];
  const genders = apiResponse.genders || apiResponse.Genders || [];
  const semiProfessionalCourses = apiResponse.semiProfessionalCourses || apiResponse.SemiProfessionalCourses || [];
  const casteCategories = apiResponse.casteCategories || apiResponse.CasteCategories || [];
  const fatherOccupations = apiResponse.fatherOccupations || apiResponse.FatherOccupations || [];
  const motherOccupations = apiResponse.motherOccupations || apiResponse.MotherOccupations || [];
  const places = apiResponse.places || apiResponse.Places || [];
  const collegeTypes = apiResponse.collegeTypes || apiResponse.CollegeTypes || [];

  const normalized: NormalizedSemiProfDropdowns = {
    districts: normalizeGenericDropdown(districts),
    genders: normalizeGenericDropdown(genders),
    semiProfessionalCourses: normalizeGenericDropdown(semiProfessionalCourses),
    casteCategories: normalizeGenericDropdown(casteCategories),
    fatherOccupations: normalizeGenericDropdown(fatherOccupations),
    motherOccupations: normalizeGenericDropdown(motherOccupations),
    places: normalizeGenericDropdown(places),
    collegeTypes: normalizeGenericDropdown(collegeTypes),
  };

  console.log('[normalizeSemiProfDropdowns] Normalized:', JSON.stringify(normalized, null, 2));
  return normalized;
}

function normalizeGenericDropdown(data: any[]): NormalizedDropdownOption[] {
  if (!Array.isArray(data)) {
    console.log('[normalizeSemiProfDropdowns] Data is not an array:', data);
    return [];
  }
  return data.map((item) => ({
    value: item.id ?? item.Id ?? item.ID ?? item.value,
    label: item.name ?? item.Name ?? item.label ?? '',
  }));
}
