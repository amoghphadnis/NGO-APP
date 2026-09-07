/**
 * Types for the Semi Professional Courses API
 * Route prefix: /api/semi-professional-courses (all endpoints JWT)
 */

export interface SemiProfessionalCourseDto {
  CourseId: number;
  CourseName: string;
}

/** GET /list */
export interface SemiProfessionalCourseListResponse {
  success: boolean;
  count: number;
  data: SemiProfessionalCourseDto[];
}

/** GET /{id} */
export interface SemiProfessionalCourseDetailResponse {
  success: boolean;
  data: SemiProfessionalCourseDto;
}

/** POST /create body — CourseId is ignored by the server (identity). */
export interface CreateSemiProfessionalCourseRequest {
  CourseId?: number;
  CourseName: string;
}

/** PUT /update body */
export interface UpdateSemiProfessionalCourseRequest {
  CourseId: number;
  CourseName: string;
}

export interface SemiProfessionalCourseMutationResponse {
  success: boolean;
  message: string;
}
