/**
 * Document Type Definitions
 * Strongly typed document interfaces for file uploads
 */

export interface DocumentFile {
  uri: string;
  name: string;
  type: string;
  size?: number;
}

export interface UploadedDocument {
  file: DocumentFile;
  uploadedAt?: string;
}

// Professional form documents (9 total per new API contract)
export interface ProfessionalDocuments {
  StudentSelfie?: UploadedDocument;
  CETNEETRankSheet?: UploadedDocument;
  DwellingUnitPhoto?: UploadedDocument;
  MarksSheet12?: UploadedDocument;
  RequestLetter?: UploadedDocument;
  HouseVideo?: UploadedDocument;
  ElectricityBill?: UploadedDocument;
  IncomeCertificate?: UploadedDocument;
  RationCard?: UploadedDocument;
}

// PUC form documents
export interface PUCDocuments extends ProfessionalDocuments {
  sslcMarksCard?: UploadedDocument;
  studentPhoto?: UploadedDocument;
  electricityBill?: UploadedDocument;
  rationCard?: UploadedDocument;
  familyPhoto?: UploadedDocument;
  houseVideo?: UploadedDocument;
}

// Semi Professional form documents (9 total per new API contract)
export interface SemiProfessionalDocuments {
  studentSelfie?: UploadedDocument;
  cetRankSheet?: UploadedDocument;
  ptRankSheet?: UploadedDocument;
  dwellingUnitPhoto?: UploadedDocument;
  marksSheet12?: UploadedDocument;
  houseVideo?: UploadedDocument;
  electricityBill?: UploadedDocument;
  incomeCertificate?: UploadedDocument;
  rationCard?: UploadedDocument;
}

// Union type for all documents
export type FormDocuments = ProfessionalDocuments | PUCDocuments | SemiProfessionalDocuments;
