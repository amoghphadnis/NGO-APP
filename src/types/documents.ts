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

// Professional form documents
export interface ProfessionalDocuments {
  // Required documents (16 total)
  PUCMarksCard?: UploadedDocument;
  IncomeCertificate?: UploadedDocument;
  Rationcard?: UploadedDocument;
  Electricitybill?: UploadedDocument;
  CollegeID?: UploadedDocument;
  Admissionproof?: UploadedDocument;
  FeesReceipts?: UploadedDocument;
  Expenditure?: UploadedDocument;
  Studentphoto?: UploadedDocument;
  Photoinfrontofcollege?: UploadedDocument;
  Dwellingunit?: UploadedDocument;
  CET?: UploadedDocument;
  Studentpass?: UploadedDocument;
  Monthsbank?: UploadedDocument;
  AadharCard?: UploadedDocument;
  Handwritten?: UploadedDocument;
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

// Semi Professional form documents
export interface SemiProfessionalDocuments {
  pucMarksCard?: UploadedDocument;
  incomeCertificate?: UploadedDocument;
  aadharCard?: UploadedDocument;
}

// Union type for all documents
export type FormDocuments = ProfessionalDocuments | PUCDocuments | SemiProfessionalDocuments;
