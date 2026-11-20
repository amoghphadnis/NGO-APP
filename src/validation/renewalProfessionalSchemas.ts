import { z } from 'zod';
import { UploadedDocument } from '@/types/documents';

export const renewalProfessionalSchema = z.object({
  // Section 2: Applicant Information
  applicantName: z.string().min(1, { message: 'Applicant name is required' }),
  vpidNumber: z.string().min(1, { message: 'VP ID is required' }),
  whatsAppNumber: z.string().min(10, { message: 'WhatsApp number must be 10 digits' }).max(10),
  alternateNumber: z.string().max(10).optional().or(z.literal('')),
  emailID: z.string().email({ message: 'Valid email is required' }),
  district: z.string().min(1, { message: 'District is required' }),
  taluk: z.string().min(1, { message: 'Taluk is required' }),
  residentialAddress: z.string().min(1, { message: 'Residential address is required' }),
  gender: z.string().min(1, { message: 'Gender is required' }),

  // Section 3: Academic Details
  studentAchievement: z.string().min(1, { message: 'Student achievement is required' }),
  latestResultPercentage: z.number().min(0).max(100).optional(),
  totalScholarshipAmount: z.number().min(0).optional(),
  donorName: z.string().optional().or(z.literal('')),
  lettersWrittenToDonor: z.number().min(0).optional(),
  courseStudyingApplying: z.string().optional().or(z.literal('')),
  currentCourseYear: z.number().min(1).max(6).optional(),
  courseStream: z.string().optional().or(z.literal('')),
  collegeName: z.string().optional().or(z.literal('')),
  collegeContactNumber: z.string().max(10).optional().or(z.literal('')),
  collegeType: z.string().optional().or(z.literal('')),
  expectedCollegeFees: z.number().min(0).optional(),
  totalEducationalExpenses: z.number().min(0).optional(),

  // Section 4: Account Details
  accountHolderName: z.string().min(1, { message: 'Account holder name is required' }),
  bankAccountNumber: z.string().min(1, { message: 'Account number is required' }),
  bankName: z.string().min(1, { message: 'Bank name is required' }),
  ifscCode: z.string().min(1, { message: 'IFSC code is required' }),
  bankBranchName: z.string().min(1, { message: 'Branch name is required' }),
  parentsBankBalance: z.number().min(0).optional(),

  // Section 5: Documents (file fields)
  latestMarksheetFile: z.custom<UploadedDocument>().optional(),
  studentPassbookFile: z.custom<UploadedDocument>().optional(),
  studentSelfieFile: z.custom<UploadedDocument>().optional(),
  collegeFrontPhotoFile: z.custom<UploadedDocument>().optional(),
  thankingVideoFile: z.custom<UploadedDocument>().optional(),
  parentsPassbookFile: z.custom<UploadedDocument>().optional(),
  feesReceiptFile: z.custom<UploadedDocument>().optional(),
  thankingVolunteerLetterFile: z.custom<UploadedDocument>().optional(),
  thankingDonorLetterFile: z.custom<UploadedDocument>().optional(),
});

export type RenewalProfessionalFormValues = z.infer<typeof renewalProfessionalSchema>;
