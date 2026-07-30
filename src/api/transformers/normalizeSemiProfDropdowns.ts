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
  areaTypes: NormalizedDropdownOption[];
  houseTypes: NormalizedDropdownOption[];
}

/**
 * Normalizes the GET /form-data response for Semi Professional dropdowns
 */
export function normalizeSemiProfessionalDropdowns(apiResponse: any): NormalizedSemiProfDropdowns {
  console.log('[normalizeSemiProfDropdowns] Raw API response:', JSON.stringify(apiResponse, null, 2));

  const districts = apiResponse.districts || apiResponse.Districts || apiResponse.DistrictList || [];
  const genders = apiResponse.genders || apiResponse.Genders || apiResponse.GenderList || [];
  const casteCategories = apiResponse.casteCategories || apiResponse.CasteCategories || apiResponse.CasteList || [];
  const fatherOccupations = apiResponse.fatherOccupations || apiResponse.FatherOccupations || apiResponse.FatherOccupationList || [];
  const motherOccupations = apiResponse.motherOccupations || apiResponse.MotherOccupations || apiResponse.MotherOccupationList || [];
  const areaTypes = apiResponse.areaTypes || apiResponse.AreaTypes || apiResponse.AreaList || apiResponse.areas || [];
  const houseTypes = apiResponse.houseTypes || apiResponse.HouseTypes || apiResponse.HouseList || apiResponse.houses || [];

  const normalized: NormalizedSemiProfDropdowns = {
    districts: normalizeGenericDropdown(districts),
    genders: normalizeGenericDropdown(genders),
    casteCategories: normalizeGenericDropdown(casteCategories),
    fatherOccupations: normalizeGenericDropdown(fatherOccupations),
    motherOccupations: normalizeGenericDropdown(motherOccupations),
    areaTypes: normalizeGenericDropdown(areaTypes),
    houseTypes: normalizeGenericDropdown(houseTypes),
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
