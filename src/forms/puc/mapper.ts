/**
 * PUC Format 1.1 Form Mapper
 * Converts PUC form state to the backend API contract.
 * POST /api/VP_Format1_1PUC  (multipart/form-data)
 *
 * All scalar fields are sent as strings; the backend parses them
 * via model binding.  File fields use the exact contract key names.
 */

import { appendFileToFormData } from '@/submission/attachFiles';
import { PucFormat11FormValues } from '@/validation/pucFormat11Schemas';
import dayjs from 'dayjs';
import { PUC_FORMAT11_FILE_KEYS } from './fileKeys';

function formatDate(date: string): string {
  return dayjs(date).format('YYYY-MM-DD');
}

function toString(value: string | number | undefined | null): string {
  if (value === undefined || value === null) return '';
  return String(value);
}

function appendIfPresent(
  fd: FormData,
  key: string,
  value: string | number | undefined | null,
): void {
  if (value === undefined || value === null || value === '') return;
  fd.append(key, toString(value));
}

/**
 * Maps PUC Format 1.1 form data to the multipart contract.
 * Required fields are always sent; optional fields are sent only when present.
 */
export function pucMapper(formData: PucFormat11FormValues): FormData {
  const fd = new FormData();

  // ── Personal ──────────────────────────────────────────────────────────
  fd.append('StudentName', formData.personal.StudentName);
  if (formData.personal.DateOfBirth) {
    fd.append('DateOfBirth', formatDate(formData.personal.DateOfBirth));
  }
  fd.append('Gender', toString(formData.personal.Gender || 0));
  fd.append('Caste', toString(formData.personal.Caste || 0));
  fd.append('Place', toString(formData.personal.Place || 0));

  // ── Contact ───────────────────────────────────────────────────────────
  fd.append('Email', formData.contact.Email);
  fd.append('ContactNumber', formData.contact.ContactNumber);
  appendIfPresent(fd, 'AlternateNumber', formData.contact.AlternateNumber);

  // ── Address ───────────────────────────────────────────────────────────
  fd.append('District', toString(formData.address.District || 0));
  appendIfPresent(fd, 'OtherDistrict', formData.address.OtherDistrict);
  fd.append('Taluk', formData.address.Taluk);
  fd.append('ResidentialAddress', formData.address.ResidentialAddress);

  // ── Family ────────────────────────────────────────────────────────────
  fd.append('FatherOccupation', toString(formData.family.FatherOccupation || 0));
  fd.append('MotherOccupation', toString(formData.family.MotherOccupation || 0));
  fd.append('TotalFamilyMembers', toString(formData.family.TotalFamilyMembers || 0));
  fd.append('FamilyAnnualIncome', toString(formData.family.FamilyAnnualIncome || 0));

  // ── Academic ──────────────────────────────────────────────────────────
  fd.append('SSLCPercentage', toString(formData.academic.SSLCPercentage || 0));
  fd.append('CourseJoined', toString(formData.academic.CourseJoined || 0));
  fd.append('CollegeName', formData.academic.CollegeName);
  fd.append('CollegeType', toString(formData.academic.CollegeType || 0));
  fd.append('CollegeFees', toString(formData.academic.CollegeFees || 0));
  fd.append('CollegeContactNumber', formData.academic.CollegeContactNumber);
  appendIfPresent(fd, 'Achievement', formData.academic.Achievement);

  // ── Bank ──────────────────────────────────────────────────────────────
  fd.append('ParentsBankBalance', toString(formData.bank.ParentsBankBalance || 0));
  fd.append('AccountHolderName', formData.bank.AccountHolderName);
  fd.append('AccountNumber', formData.bank.AccountNumber);
  fd.append('IFSCCode', formData.bank.IFSCCode);
  fd.append('BankName', formData.bank.BankName);
  fd.append('BranchName', formData.bank.BranchName);

  // ── Documents (all 5 required by contract) ────────────────────────────
  const fileMappings: Record<string, keyof typeof PUC_FORMAT11_FILE_KEYS> = {
    StudentSelfie: 'STUDENT_SELFIE',
    SSLCMarksCard: 'SSLC_MARKS_CARD',
    FeeReceipts: 'FEE_RECEIPTS',
    BankPassbook: 'BANK_PASSBOOK',
    AadhaarCard: 'AADHAAR_CARD',
  };

  for (const [docField, keyConst] of Object.entries(fileMappings)) {
    const apiKey = PUC_FORMAT11_FILE_KEYS[keyConst];
    const doc = formData.documents?.[docField as keyof typeof formData.documents];
    const file = doc && typeof doc === 'object' && 'file' in doc ? (doc as { file?: unknown }).file : undefined;
    if (file) {
      appendFileToFormData(fd, apiKey, file);
    } else {
      console.log(`[pucMapper] Missing required file: ${docField} (API: ${apiKey})`);
    }
  }

  return fd;
}
