// API Types for VP Scholarship Application

export interface DropdownItem {
  Value: number;
  Text: string;
}

export interface StandardApiResponse<T> {
  Status: boolean;
  Message: string;
  Data: T;
}

export interface ProfessionalStudentPayload {
  StudentName: string;
  Email: string;
  DateOfBirth: string; // YYYY-MM-DD format
  DistrictID: number;
  OtherDistrict?: string;
  Taluk: string;
  Address: string;
  ContactNumber: string;
  GenderID: number;
  CasteCategoryID: number;
  FamilyMembers: number;
  AnnualIncome: string;
  PUPercentage: string;
  CET_NEET_Rank?: string;
  CourseTypeID: number;
  CollegeName: string;
  CollegeTypeID: number;
  CollegeFees: string;
  PlaceID: number;
}

export interface UploadableFile {
  uri: string;
  type: string;
  name: string;
  size?: number;
}

export interface UploadableDocuments {
  PUCMarksCard?: UploadableFile;
  IncomeCertificate?: UploadableFile;
  AadharCard?: UploadableFile;
}

export interface StudentSubmissionPayload extends ProfessionalStudentPayload {
  PUCMarksCard?: UploadableFile;
  IncomeCertificate?: UploadableFile;
  AadharCard?: UploadableFile;
}

// API Error Types
export interface ApiError {
  title: string;
  message: string;
  code?: number;
}

// Dropdown Response Types
export interface DistrictsResponse {
  DistrictID: number;
  DistrictName: string;
}

export interface GendersResponse {
  GenderID: number;
  GenderName: string;
}

export interface CastesResponse {
  CasteCategoryID: number;
  CasteCategoryName: string;
}

export interface CoursesResponse {
  CourseTypeID: number;
  CourseTypeName: string;
}

export interface PlacesResponse {
  PlaceID: number;
  PlaceName: string;
}

// Type guards
export const isUploadableFile = (file: any): file is UploadableFile => {
  return (
    file &&
    typeof file === 'object' &&
    typeof file.uri === 'string' &&
    typeof file.type === 'string' &&
    typeof file.name === 'string'
  );
};
