/**
 * Types for the Payana Students API
 * Route prefix: /api/payana-students
 *
 * Wire-format (PascalCase) types mirror the backend contract exactly.
 */

/** ASP.NET SelectListItem as serialised by the backend. */
export interface SelectListItemDto {
  Value: string;
  Text: string;
}

/** GET /api/payana-students/districts */
export interface PayanaDistrictsResponse {
  success: boolean;
  data: SelectListItemDto[];
}

/** GET /api/payana-students/dropdowns */
export interface PayanaDropdownsResponse {
  success: boolean;
  genders: SelectListItemDto[];
  casteCategories: SelectListItemDto[];
  areaTypes: SelectListItemDto[];
  houseTypes: SelectListItemDto[];
  collegeTypes: SelectListItemDto[];
  districts: SelectListItemDto[];
  fatherOccupations: SelectListItemDto[];
  motherOccupations: SelectListItemDto[];
}

/** Row returned by GET /api/payana-students/list */
export interface PayanaStudentListItemDto {
  StudentID: number;
  Source: string | null;
  StudentName: string | null;
  ContactNumber: string | null;
  Address: string | null;
  PinCode: string | null;
  HouseVisitLink: string | null;
  Taluka: string | null;
  DistrictName: string | null;
  CollegeName: string | null;
  FamilyIncome: number | null;
  SecuredPercentage: number | null;
  IsVisited: boolean | number;
  ApproveStatus: string | null;
}

/** GET /api/payana-students/list */
export interface PayanaStudentListApiResponse {
  success: boolean;
  count: number;
  data: PayanaStudentListItemDto[];
}

/** POST /api/payana-students/create success/failure body */
export interface PayanaCreateResponse {
  success: boolean;
  message: string;
}
