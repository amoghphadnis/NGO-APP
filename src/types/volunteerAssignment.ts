/**
 * Types for the Volunteer Assignment (House Visit) APIs
 *
 * Four backend controllers share the same shape but differ in route prefix,
 * request-body casing and cancel semantics:
 *
 * | Program           | Prefix                                     | Body keys              | Cancel     |
 * |-------------------|--------------------------------------------|------------------------|------------|
 * | PUC (New_Students)| /assign-volunteer-house-visit              | StudentID/VolunteerID  | DELETE ?qs |
 * | Payana            | /payana-volunteer-assignment               | StudentId/VolunteerId  | POST body  |
 * | Professional      | /professional-volunteer-assignment         | StudentID/VolunteerID  | POST body  |
 * | Semi Professional | /semi-professional-volunteer-assignment    | StudentId/VolunteerId  | POST body  |
 *
 * IMPORTANT identifier semantics (do NOT collapse):
 * - Source = "New Student"  → the identifier is StudentID / ApplicationID of the native record.
 * - Source = "Google Sheet" → the identifier is ImportID of the imported sheet row,
 *   but it is still transmitted under the StudentID/StudentId request key.
 */

import { SelectListItemDto } from './payana';

export type VolunteerAssignmentProgram = 'puc' | 'payana' | 'professional' | 'semiProfessional';

export const VOLUNTEER_ASSIGNMENT_SOURCES = ['New Student', 'Google Sheet'] as const;
export type VolunteerAssignmentSource = (typeof VOLUNTEER_ASSIGNMENT_SOURCES)[number];

/**
 * Program-agnostic request used by the frontend.
 * `studentId` carries StudentID for "New Student" and ImportID for "Google Sheet".
 */
export interface AssignVolunteerRequest {
  studentId: number;
  volunteerId: number;
  source: VolunteerAssignmentSource;
}

export interface CancelVolunteerAssignmentRequest {
  studentId: number;
  source: VolunteerAssignmentSource;
}

/** Row from GET {prefix}/students?districtId= */
export interface VolunteerAssignmentStudentDto {
  StudentID: number;
  Source: VolunteerAssignmentSource | string | null;
  StudentName: string | null;
  ContactNumber: string | null;
  Taluka: string | null;
  DistrictName: string | null;
  CollegeName: string | null;
  FamilyIncome: number | null;
  SecuredPercentage: number | null;
  Remark: string | null;
  VolunteerName: string | null;
  IsAssigned: 0 | 1 | boolean;
  IsHouseVisitCompleted: 0 | 1 | boolean;
  HouseVisitID?: number | null;
}

export interface VolunteerAssignmentListResponse<T> {
  success: boolean;
  count: number;
  data: T[];
}

export type VolunteerAssignmentStudentsResponse = VolunteerAssignmentListResponse<VolunteerAssignmentStudentDto>;
export type VolunteerAssignmentVolunteersResponse = VolunteerAssignmentListResponse<SelectListItemDto>;
export type VolunteerAssignmentDistrictsResponse = VolunteerAssignmentListResponse<SelectListItemDto>;

/** Professional /page and Payana/Semi /initial-data */
export interface VolunteerAssignmentPageDataResponse {
  success: boolean;
  districts: SelectListItemDto[];
  students: VolunteerAssignmentStudentDto[];
}

export interface VolunteerAssignmentMutationResponse {
  success: boolean;
  message: string;
}
